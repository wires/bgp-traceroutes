var mach = require('mach');
var app = mach.stack();
var c = require("chalk");

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

app.use(mach.file, {
	root: process.cwd() + '/../dist/',
	index: 'index.html'
});

mach.serve(app);
