var mach = require('mach');
var app = mach.stack();
var c = require("chalk");

var cache_log = function(s){
	console.log(c.bgBlack(s));
}

var cache = require('Simple-Cache').SimpleCache("/tmp", cache_log);

app.use(mach.logger);

var atlas = require("./atlas");

//conn.json(200, user);

app.get('/anchors', function(conn){
	console.log("querying " + c.red("anchors"));
	return atlas.anchors().then(function(anchors){
		conn.json(200, anchors);
	});
});

app.get('/reach/:ip/:prefix', function(conn){
	var prefix = conn.params.prefix;
	var ip = conn.params.ip.replace(/-/g, ".")
	console.log("querying prefix " + c.cyan(ip) + "/" + c.red(prefix));
	return atlas.bgp_endpoints(ip + '/' + prefix).then(function(d){
		conn.json(200, d);
	});
});

mach.serve(app);
