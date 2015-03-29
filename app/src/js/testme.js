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

console.log("L", L);

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

            // {"geoloc":"2711705"}
            var b = JSON.parse(body);
            cb(b);
        });    
}

api('/anchors', {}, function(as){
    console.log(as);
});







// React.render(<LiveMap/>, document.body);