var React = require("react");
var mui = require("material-ui");

var PageWithNav = require("./page-with-nav.js");

// temporary work-around until React 1.0 for tap events
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

// var menuItems = [
//   // { route: 'update-msp', text: 'Update MSP' },
//   // { route: 'create-agent', text: 'Create Agent' },
//   // { route: 'create-reseller', text: 'Create Reseller' },
//   { route: 'create-carrier', text: 'Create Carrier' }
//   // { type: mui.MenuItem.Types.SUBHEADER, text: 'External Links' },
//   // { type: mui.MenuItem.Types.LINK, payload: 'http://defekt.nl/~jelle/', text: 'Author' }
// ];
// 
// var CreateAgent = require("./components/create-agent.js");
// var CreateCarrier = require("./components/create-carrier.js");
// var CreateReseller = require("./components/create-reseller.js");
// var UpdateMSP = require("./components/update-msp.js");
// 
//return <PageWithNav menuItems={menuItems}/>

// var map = require("./components/geom-map.js");
var L = require("leaflet");
var Livemap = React.createClass({
    componentDidMount: function() {
        var map = this.map = L.map(this.getDOMNode(), {
            minZoom: 2,
            maxZoom: 20,
            tms: true,
            layers: [
                L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
            ],
            attributionControl: false,
        });

        map.on('click', this.onMapClick);
        map.fitWorld();
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function() {
        // Do some wonderful map things...
    },
    render: function() {
        return (
            <div className='map'></div>
        );
    }
});

// var App = React.createClass({
//     render: function(){
//         return (<div>
//             map
//         </div>);
//     }
// });

// <Route name="select-anchor" handler={UpdateMSP} />
var routes = (
    <Route handler={Livemap} path="/">
        
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
