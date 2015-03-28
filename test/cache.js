var c = require("chalk");

var cache_log = function(s){
	console.log(c.bgBlack(s));
}

var cache = require('Simple-Cache').SimpleCache("cache", cache_log);

module.exports = function(key, promise){
	return cache.get(key, function(cb){
		promise.then(function(x){
			cb(x)
		});
	});
}

