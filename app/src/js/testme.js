// var React = require("react");
// var L = require("leaflet");
// var LiveMap = React.createClass({
//     componentDidMount: function() {
//         var map = this.map = L.map(this.getDOMNode(), {
//             minZoom: 2,
//             maxZoom: 20,
//             // tms: true,
//             layers: [
//                 L.tileLayer(
//                     'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//                     {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
//             ],
//             attributionControl: false,
//         });
// 
//         map.on('click', this.onMapClick);
//         map.fitWorld();
//     },
//     componentWillUnmount: function() {
//         this.map.off('click', this.onMapClick);
//         this.map = null;
//     },
//     onMapClick: function() {
//         // Do some wonderful map things...
//     },
//     render: function() {
//         return (
//             <div className='map'></div>
//         );
//     }
// });

var _ = require("lodash");

L.mapbox.accessToken = 'pk.eyJ1Ijoid2lyZXMiLCJhIjoiUk54Vlh5RSJ9.3BVTFfeHzPRbgByezhab8A';
    // .setView([40, -74.50], 3
    
    // var map = L.mapbox.map('map', 'examples.map-zr0njcqy');
var map = L.mapbox.map('map', 'wires.lj6fgb39')
    .setView([42, 22], 2)

map.featureLayer.on('click', function(e) {
    map.panTo(e.layer.getLatLng());
});

var request = require("request")

function api(resource, params, cb) {
    // alright, let's try it
    request
        .get({url: 'http://localhost:5000' + resource, qs: params},
        function(err, response, body) {
            console.log(err);
            if(response.statusCode !== 200 || err)
            {
                console.log("error reqn", resource, response.statusCode);
                return;
            }

            var b = JSON.parse(body);
            cb(b);
        });    
}

function rndm_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

api('/anchors', {}, function(anchors){
    anchors.forEach(function(a) {
        var m = L.marker([a.latitude, a.longitude], {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-symbol': 'harbor',
                'marker-color': '#fa0'
            }),
            riseOnHover: true
        });
        
        var popupContent = '<p>' +
            '<b>IPv4</b> <code>' + a.address_v4 + '</code> AS' + a.asn_v4 + '<br/>' +
            '<b>IPv6</b> <code>' + a.address_v6 + '</code> AS' + a.asn_v6 + '</p>';
            
        m.bindPopup(popupContent).openPopup();
        
        m.on('click', function(e){
            console.log("clicked", a);
            
            doReach(a.prefix_v4, a.latitude, a.longitude);
            
            if(true) api('/reach', {q: a.prefix_v4}, function(reach){
                console.log("DONE", reach);
                
                reach.forEach(function(as){
                    var clr = rndm_color();
                    
                    as.probes.forEach(function(p){
                        var k = L.marker([p.latitude, p.longitude], {
                            icon: L.mapbox.marker.icon({
                                'marker-size': 'small',
                                'marker-symbol': (p.is_anchor ? 'harbor' : 'parking'),
                                'marker-color': clr
                            }),
                            riseOnHover: true
                        });
                        k.addTo(map);
                    });
                });
            }); 
        });
        
        m.addTo(map);
    });
});



// var map = new L.Map("map", {center: [37.8, -96.9], zoom: 4})
//     .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png"));
// 

function doReach(prefix, lat, lng){
    
    console.log("REACH");
    
    var svg = d3.select(map.getPanes().overlayPane).append("svg");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    api("/reach.geojson", {q: prefix, lat: lat, lng: lng}, function(collection) {
        
      var transform = d3.geo.transform({point: projectPoint}),
          path = d3.geo.path().projection(transform);

      var feature = g.selectAll("path")
          .data(collection.features)
        .enter().append("path");

        feature.on('click', function(d) {
            console.log("CLICKED", d);
        });

      map.on("viewreset", reset);
      reset();

      // Reposition the SVG to cover the features.
      function reset() {
        var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
      }

      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
      
    });
}

// console.log("HEERE")
// d3.json("/anchors", function(collection) {
//     console.log("HAHA", collection);

  // var transform = d3.geo.transform({point: projectPoint}),
  //     path = d3.geo.path().projection(transform);
  // 
  // var feature = g.selectAll("path")
  //     .data(collection.features)
  //   .enter().append("path");
  // 
  // map.on("viewreset", reset);
  // reset();
  // 
  // // Reposition the SVG to cover the features.
  // function reset() {
  //   var bounds = path.bounds(collection),
  //       topLeft = bounds[0],
  //       bottomRight = bounds[1];
  // 
  //   svg .attr("width", bottomRight[0] - topLeft[0])
  //       .attr("height", bottomRight[1] - topLeft[1])
  //       .style("left", topLeft[0] + "px")
  //       .style("top", topLeft[1] + "px");
  // 
  //   g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
  // 
  //   feature.attr("d", path);
  // }
  // 
// 
// });



// React.render(<LiveMap/>, document.body);