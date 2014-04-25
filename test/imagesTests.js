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
    } else {
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
    var img = new RgbImage(width, height, rgba);
    var rgb = img.getArray();
    expect(rgb.length).to.equal(width * height);

    // TODO Think about good test case for rgb values
    var arr = img.toRgbaArray();
    expect(arr.length).to.equal(width * height * 4);
});
