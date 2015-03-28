var React = require("react");
var leaf = require("react-leaflet");

var Map = leaf.Map;
var TileLayer = leaf.TileLayer;
var Marker = leaf.Marker;
var Popup = leaf.Popup;

/*
<Marker position={position}>
  <Popup>
    <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
  </Popup>
</Marker>
*/


module.exports = React.createClass({

    render: function() {
        
        var position = [51.505, -0.09];

        return (<Map center={position} zoom={13}>
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
        </Map>);
    }
});
