var mach = require('mach');
var app = mach.stack();
var c = require("chalk");

var cache = require("./cache");
var atlas = require("./atlas");


// JSON 200 OK
function OK(conn){
	return function(data) {
		conn.json(200, data);
	}
};

app.use(mach.logger);
app.use(mach.params);

app.get('/anchors', function(conn){
	return atlas.anchors()
		.then(OK(conn));
});

app.get('/reach', function(conn){
	var q = conn.params.q;
	if(!q)
		return 400;

	if(q.match(/\d+\.\d+\.\d+\.\d+\/\d+/)){
		var ip = q.split('/')[0]
		var prefix = q.split('/')[1]
		console.log("querying prefix " + c.cyan(ip) + "/" + c.red(prefix));

		return atlas.bgp_endpoints(ip + '/' + prefix)
		.then(OK(conn));
	};

	return 400;
});

mach.serve(app);
