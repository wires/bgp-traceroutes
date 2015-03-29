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
            
            api('/reach', {q: a.prefix_v4}, function(reach){
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





// React.render(<LiveMap/>, document.body);