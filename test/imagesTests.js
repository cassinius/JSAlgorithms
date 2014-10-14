/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/Matrix.ts" />
/// <reference path="../src/Images.ts" />
var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/Matrix.js');
require('../src/Images.js');
var M2D = Matrix.Matrix2D;
var RgbImage = Images.RgbImage;
var GrayImage = Images.GrayImage;
// Test Data
var width = 16;
var height = 10;
var rgba = new Array(width * height * 4);
for (var i = 0; i < width * height * 4; ++i) {
    if (i % 4 === 3) {
        rgba[i] = 1;
    }
    else {
        rgba[i] = (Math.random() * 256) >>> 0;
    }
}
//describe("Simple Gray Image Tests", function() {
//    var img: Images.RgbImage = new RgbImage(width, height, rgba);
//    var rgb: Array<any> = img.getArray();
//    console.log(rgb);
//    expect(rgb.length).to.equal(width * height);
//    // TODO Think about good test case for rgb values
//
//});
describe("Simple RGB Image Tests", function () {
    it("Should instantiate a rgb image correctly", function () {
        var img = new RgbImage(width, height, rgba);
        var rgb = img.getArray();
        expect(rgb.length).to.equal(width * height);
        // TODO Think about good test case for rgb values
        var arr = img.toRgbaArray();
        expect(arr.length).to.equal(width * height * 4);
    });
});
describe("Get an adjacency list of a simple image", function () {
    var width = 2;
    var height = 2;
    var rgba = new Array(width * height * 4);
    for (var i = 0; i < width * height * 4; ++i) {
        if (i % 4 === 3) {
            rgba[i] = 1;
        }
        else {
            rgba[i] = (Math.random() * 256) >>> 0;
        }
    }
    it("Should compute an adjacency matrix of correct dimensions", function () {
        var img = new GrayImage(width, height, rgba);
        var rgb = img.getArray();
        var adj_list = img.computeNeighborhoods8(true);
        var dim_expect = JSON.stringify({ d1: width, d2: height });
        var dim_result = JSON.stringify(adj_list.dim());
        expect(dim_expect).to.equal(dim_result);
        for (var i = 0; i < width; ++i) {
            for (var j = 0; j < height; ++j) {
                expect(adj_list.get(i, j).length).to.equal(3);
            }
        }
    });
    // TODO
    it("Should compute a correct adjacency matrix for 4-Neighborhoods", function () {
    });
    // TODO
    it("Should compute a correct adjacency matrix for 8-Neighborhoods", function () {
    });
});
