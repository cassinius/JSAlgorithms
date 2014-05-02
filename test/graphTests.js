/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/Matrix.ts" />
/// <reference path="../src/Images.ts" />
/// <reference path="../src/Graphs.ts" />
var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/Matrix.js');
require('../src/Images.js');
require('../src/Graphs.js');

var M2D = Matrix.Matrix2D;
var Graph = Graphs.Graph;

//var RgbImage = Images.RgbImage;
var GrayImage = Images.GrayImage;

// Test Data
var width = 2;
var height = 2;
var rgba = new Array(width * height * 4);
for (var i = 0; i < width * height * 4; ++i) {
    if (i % 4 === 3) {
        rgba[i] = 1;
    } else {
        rgba[i] = (Math.random() * 256) >>> 0;
    }
}

describe("Graph instantiation and computation of representation", function () {
    it("Should correctly compute the edge list out of an adj_list", function () {
        var grayImg = new GrayImage(width, height, rgba);
        var adj_list = grayImg.computeAdjacencyList(true);
        var graph = new Graph(adj_list);
        var edge_list = graph.edge_list;

        //        console.log(edge_list);
        expect(edge_list.length).to.equal(6);
    });
});
