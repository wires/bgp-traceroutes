var memoize = require('memoizee');
var c = require("chalk");
var Q = require("kew")

var cache_log = function(s){
	console.log(c.bgBlack(s));
}

// no
