var fs = require('fs');
require('../src/Helper.js');
require('../src/Matrix.js');
require('../src/Images.js');
require('../src/Graphs.js');
PNG = require('pngjs').PNG;

fs.createReadStream('naevus1.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        demoAdjacencyList(this.width, this.height, this.data);
        demoEdgeListComputation(this.width, this.height, this.data);
    });


var demoAdjacencyList = function(width, height, data) {
    var start = new Date().getTime();

    var grayImg = new Images.GrayImage(width, height, data);
    var adj_list = grayImg.computeAdjacencyList(true);

    console.log("Adjacency List dimensions: " + width + ", " + height);
    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


var demoEdgeListComputation = function(width, height, data) {
    var start = new Date().getTime();

    var grayImg = new Images.GrayImage(width, height, data);
    var adj_list = grayImg.computeAdjacencyList(true);
    var graph = new Graphs.Graph(adj_list);

    var time = new Date().getTime() - start;
    console.log('Edge list length: ' + graph.edge_list.length);
    console.log('Execution time: ' + time + 'ms');
};
