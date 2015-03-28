var http = require("httpinvoke");
var mach = require("mach");
var Q = require("kew");
var _ = require("lodash");

var c = require("chalk");

var log = {}
log.debug = function(s) {
	//console.log(c.gray(s));
}

function http_json(url, method) {
	return http(url, method, {'Content-Type': 'application/json'})
		.then(function(resp){
			console.log(url)
			return JSON.parse(resp.body);
		});
}

function anchor_page(limit, offset) {
	var base = "https://atlas.ripe.net/api/v1"
	var url = base + "/probe/?is_anchor=1&offset=" + offset + "&limit=" + limit;

	console.log(c.bgGreen('GET') + c.dim(' => ') + c.underline(url));
	return http_json(url, "GET");
}

function get_all_anchors() {
	console.log("querying " + c.red("anchors"));
	var l = 20;
	return anchor_page(l, 0)
		.then(function(data){
			var pages = Math.ceil(data.meta.total_count / l);

			// build list of objects from first page
			var anchors = [];
			data.objects.map(function(anchor){
				anchors.push(anchor);
			});

			// query other pages
			var others = _.range(1, pages).map(function(page){
				return anchor_page(l, l * page).then(function(d){
					console.log("\tdone", d.objects.length);
					return d;
				});
			});

			// join all objects
			return Q
				.all(others)
				.then(function(responses){
					responses.map(function(n){
						n.objects.map(function(anchor){
							anchors.push(anchor);
						});
					});
					return anchors;
				}.bind(this));
		});
}

exports.anchors = function() {
	return get_all_anchors()
		.then(function(anchors){
			var az = _(anchors)
				.filter(function(anchor){
					return (anchor.asn_v4 || anchor.asn_v6);
				}).value();

			console.log(az.length);
			return az;
		});
}


lookup_bgp_routes = function(prefix){
	var base = "https://stat.ripe.net/data/bgp-state/data.json?unix_timestamps=TRUE";
	return http_json(base + "&resource=" + encodeURIComponent(prefix), 'GET')
		.then(function(r){
			return r.data.bgp_state.map(function(entry){
				return entry.path;
			});
		});
}

bgp_endpoints = function(prefix) {
	return lookup_bgp_routes(prefix)
		.then(function(paths){
			return paths.map(function(n){
				return _.head(n);
			});
		});
}

probes_in_asn = function(asn) {
	var base = "https://stat.ripe.net/data/atlas-probes/data.json?resource="
	console.log("GET => " + base + asn);
	return http_json(base + asn, "GET")
		.then(function(d){
			return {
				as: asn,
				probes: d.data.probes
			};
		});
}


exports.bgp_endpoints = function(prefix) {
	return bgp_endpoints(prefix)
		.then(function(paths){
			return Q
				.all(paths.map(
					function(path){
						// find all probes in path endnode
						return probes_in_asn(path);
					}))

				.then(function (results){
					var z = results
						.filter(function(r){
							return r.probes.length > 0;
						})
						.map(function(r){
							return {
								as: r.as,
								probes: r.probes
									.filter(function(pr){
										return	(pr.status === 1) &&
												(pr.is_public === true);
									})
									.map(function(pr){
										return pr.id
									})
							}
						});

					console.log(z);
					return z;
			});
		});
}

