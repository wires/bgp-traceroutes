var React = require("react");
var Map = require("../../node_modules/dist/react-map.js");

/*
<Marker position={position}>
  <Popup>
    <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
  </Popup>
</Marker>
return (<Map center={position} zoom={13}>
      <TileLayer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
</Map>);

*/


module.exports = React.createClass({

    render: function() {
        
        var position = [51.505, -0.09];
        return (<Map lat="60.0" lon="10.0" zoom="10"/>);
    }
});
