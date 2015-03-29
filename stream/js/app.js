var graph;
var nodesOccurrences = {};

function MyGraph(el) {

    this.addNode = function(params) {
        if (!findNode(params.id)){
            nodes.push({
                "id": params.id,
                "probe": params.probe,
                "target": params.target,
                "fixed": params.fixed,
                "x": params.x,
                "y": params.y,
                "occurs": params.occurs
            });
        }
        else {
            findNode(params.id)["occurs"] = params.occurs;
        }
        update()
    };

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] == n)||(links[i]['target'] == n))
            {
                links.splice(i,1);
            }
            else i++;
        }
        nodes.splice(findNodeIndex(id),1);
        update();
    };

    this.removeLink = function (source,target){
        for(var i=0;i<links.length;i++)
        {
            if(links[i].source.id == source && links[i].target.id == target)
            {
                links.splice(i,1);
                break;
            }
        }
        update();
    };

    this.removeallLinks = function(){
        links.splice(0,links.length);
        update();
    };

    this.removeAllNodes = function(){
        nodes.splice(0,links.length);
        update();
    };

    this.addLink = function (source, target) {
        links.push({"source":findNode(source),"target":findNode(target)});
        update();
    };

    var findNode = function(id) {
        for (var i in nodes) {
            if (nodes.hasOwnProperty(i)){
                if (nodes[i]["id"] === id) return nodes[i]}
            }

    };

    var findNodeIndex = function(id) {
        for (var i=0;i<nodes.length;i++) {
            if (nodes[i].id==id){
                return i;
            }
        }
    };

    var color = d3.scale.category10();

    // set up the D3 visualisation in the specified element
    var w = 1600,
        h = 900;
    var vis = d3.select(el)
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id","svg")
        .append('svg:g');

    var force = d3.layout.force();

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {

        // New links
        var link = vis.selectAll(".link")
            .data(links, function(d) {
                return d.source.id + "-" + d.target.id;
            });

        link.enter().append("line")
            .attr("id",function(d){return d.source.id + "-" + d.target.id;})
            .attr("class","link");

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;});

        // Update nodes
        node.attr("r", function(d) { console.log(d); return d["occurs"]});


        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        // Probe
        nodeEnter.filter(function(node) {return node["probe"] == true})
            .append("svg:circle")
            .attr("r", 20)
            .attr("id", function(d) { return "Node;"+ d.id})
            .attr("class", "nodeStrokeClass")
            .attr("fill", "yellow");

        // Target
        nodeEnter.filter(function(node) {return node["target"] == true})
            .append("svg:circle")
            .attr("r", 20)
            .attr("id",function(d) { return "Node;"+d.id;})
            .attr("class","nodeStrokeClass")
            .attr("fill", "blue");


        // Other nodes
        nodeEnter.filter(function(node) {return node["target"] == false && node["probe"] == false})
            .append("svg:circle")
            .attr("r", 18)
            .attr("id",function(d) { return "Node;"+d.id;})
            .attr("class","nodeStrokeClass")
            .attr("fill", function(d) { return color(d.id); });



        // Text in nodes

        // Probe
        nodeEnter.filter(function(node) { return node["probe"] == true})
            .append("svg:text")
            .attr("class", "textClassBlack")
            .attr("x", -10)
            .attr("y", ".31em")
            .text(function(d) { return d.id });

        // Other nodes
        nodeEnter.filter(function(node) { return node["probe"] == false})
            .append("svg:text")
            .attr("class","textClass")
            .attr("x", -10)
            .attr("y", ".31em")
            .text( function(d){return lastByte(d.id.toString())});

        node.exit().remove();
        force.on("tick", function() {

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        });

        // Restart the force layout.
        force
            .gravity(.05)
            .linkDistance(1)
            .linkStrength(0.9)
            .charge(-500)
            //.chargeDistance(1000)
            .size([w, h])
            .start();
    };


// Make it all go
    update();
}

function drawGraph()
{
    graph = new MyGraph("#svgdiv");
    //graph.addNode('A');
    //graph.addNode('B');
    //graph.addNode('C');
    //graph.addNode('D');
    //graph.addNode('E');
    //graph.addNode('F');
    //graph.addNode('G');
    //graph.addNode('H');
    //graph.addLink('A','B');
    //graph.addLink('B','C');
    //graph.addLink('C','D');
    //graph.addLink('D','E');
    //graph.addLink('E','F');
    //graph.addLink('F','G');
    //graph.addLink('G','H');

    keepNodesOnTop();
}

function updateDrawing(newData) {

    var path = newData["result"].map(function(hop) {return hop["result"][0]["from"]});

    // Nodes and links from path
    for(var i = 0; i < path.length-1; i++) {

        // Regular nodes
        nodesOccurrences[path[i]] = nodesOccurrences[path[i]] ? nodesOccurrences[path[i]] + 1 : 1;
        graph.addNode({
            "id": path[i],
            "probe": false,
            "target": false,
            "fixed": false,
            "occurs": nodesOccurrences[path[i]]
        });


        //Target
        if (i + 1 == path.length - 1) {
            graph.addNode({
                "id": path[i + 1],
                "probe": false,
                "target": true,
                "fixed": true,
                "x": 1600 - 100,
                "y": 900 / 2
            });
        }

        else {
            nodesOccurrences[path[i+1]] = nodesOccurrences[path[i+1]] ? nodesOccurrences[path[i+1]] + 1 : 1;
            graph.addNode({
                "id": path[i + 1],
                "probe": false,
                "target": false,
                "fixed": false,
                "occurs": nodesOccurrences[path[i+1]]
            });
        }
        graph.addLink(path[i], path[i + 1]);

    }
    // Probe and link to first hop
    var prbId = newData["prb_id"].toString();
    graph.addNode({
        "id": prbId,
        "probe": true,
        "target": false,
        "fixed": true,
        "x": 100,
        "y": 900/2
    });
    graph.addLink(prbId, path[0]);
    keepNodesOnTop()
}

drawGraph();

// because of the way the network is created, nodes are created first, and links second,
// so the lines were on top of the nodes, this just reorders the DOM to put the svg:g on top
function keepNodesOnTop() {
    d3.selectAll(".nodeStrokeClass").each(function( index ) {
        var gnode = this.parentNode;
        gnode.parentNode.appendChild(gnode);
    });
}


// Main
// Create a socket and connect to the streaming service
var socket = io("https://atlas-stream.ripe.net:443", { path : "/stream/socket.io" });

socket.on("connect", function() {

    socket.emit("atlas_subscribe", {
        stream_type: "result",
        msm: 1663314,
        prb: 726,//1426,
        startTime: 1399035600,
        stopTimestamp: 1399129200,
        speed: 300
    });
});

socket.on("atlas_result", function(result){
    updateDrawing(result)
});

socket.on("atlas_error", function(err) {
    console.log("Error: ", err);
});
