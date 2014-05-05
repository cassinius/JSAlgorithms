/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/Matrix.ts" />
/// <reference path="../src/Images.ts" />
/// <reference path="../src/Graphs.ts" />
/// <reference path="../src/Region.ts" />
var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/Matrix.js');
require('../src/Images.js');
require('../src/Graphs.js');
require('../src/Region.js');

var M2D = Matrix.Matrix2D;
var Graph = Graphs.Graph;
var Region = Regions.Region;
var RMap = Regions.RegionMap;

var width = 25;
var height = 25;
var rgba = new Array(width * height * 4);
for (var i = 0; i < width * height * 4; ++i) {
    if (i % 4 === 3) {
        rgba[i] = 1;
    } else {
        rgba[i] = (Math.random() * 256) >>> 0;
    }
}

describe("Region Map instantiation", function () {
    it("Should correctly instantiate a region map", function () {
        var img = new Images.GrayImage(width, height, rgba);
        var regionMap = new RMap(width, height, img);
    });
});
