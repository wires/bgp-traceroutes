var mach = require('mach');
var app = mach.stack();
var c = require("chalk");
var _ = require("lodash");

var GeoJSON = require("geojson");

var atlas = require("./atlas");


// JSON 200 OK
function OK(conn){
	return function(data) {
		conn.json(200, data);
	}
};

function cors(app) {
  return function (conn) {
    return conn.call(app).then(function () {
		conn.response.setHeader('Access-Control-Allow-Origin', '*');
		conn.response.setHeader('Access-Control-Allow-Credentials', false);
    });
  };
}

app.use(cors);

app.use(mach.logger);
app.use(mach.params);

app.get('/anchors', function(conn){
	return atlas
		.anchors()
		.then(OK(conn));
});

app.get('/anchors.geojson', function(conn){
	return atlas
		.anchors()
		.then(function(anchors){
			return GeoJSON.parse(anchors, {Point: ['latitude', 'longitude']});
		})
		.then(OK(conn));
});

app.get('/reach', function(conn){
	var q = conn.params.q;
	if(!q)
		return 400;

	// ip/prefix ~ v4/v6
	if(q.match(/[0-9\.\:]+\/\d+/)){
		var ip = q.split('/')[0]
		var prefix = q.split('/')[1]
		console.log("querying prefix " + c.cyan(ip) +
								"/" + c.red(prefix));
		return atlas
			.bgp_endpoints(ip + '/' + prefix)
			.then(OK(conn));
	};

	return 400;
});


app.get('/reach.geojson', function(conn){
	var q = conn.params.q;
	var lat = parseFloat(conn.params.lat);
	var lng = parseFloat(conn.params.lng);
	
	if(!q)
		return 400;

	// ip/prefix ~ v4/v6
	if(q.match(/[0-9\.\:]+\/\d+/)){
		var ip = q.split('/')[0]
		var prefix = q.split('/')[1]
		console.log("querying prefix " + c.cyan(ip) +
								"/" + c.red(prefix));
		return atlas
			.bgp_endpoints(ip + '/' + prefix)
			.then(function(as){
				var probes = _(as)
					.map(function(n){
						return n.probes;
					})
					.flatten()
					.value();
				
				// add lines to the origin	
				if(lat && lng)
				{
					var lines = probes.map(function(p){
						return {line: [[lat, lng], [p.latitude, p.longitude]]}
					});
					
					probes = probes.concat(lines);
				}
					
				return GeoJSON.parse(probes, {Point: ['latitude', 'longitude'], 'LineString': 'line'})
			})
			.then(OK(conn));
	};

	return 400;
});


app.use(mach.file, {
	root: process.cwd() + '/../dist/',
	index: 'index.html',
	useLastModified: true
});

mach.serve(app);
