/// <reference path="../typings/tsd.d.ts" />

var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/Matrix.js');
require('../src/Images.js');
require('../src/ImgGraphs.js');
require('../src/Region.js');

var M2D = Matrix.Matrix2D;
var Graph = ImgGraphs.ImgGraph;
var Region = Regions.Region;
var RMap = Regions.RegionMap;

var width: number = 25;
var height: number = 25;
var rgba: Array<number> = new Array(width * height * 4);
var rgba_ui8: Uint8ClampedArray = new Uint8ClampedArray(width * height * 4);
for( var i = 0; i < width * height * 4; ++i ) {
    if( i % 4 === 3 ) {
        rgba[i] = 1;
        rgba_ui8[i] = 1;
    }
    else {
        rgba[i] = (Math.random() * 256) >>> 0;
        rgba_ui8[i] = (Math.random() * 256) >>> 0;
    }
}

/**
 * TODO Image Data is not defined in Node.js context
 * Change to RgbImage...
 */
describe("Region Map instantiation", function() {

    // it("Should correctly instantiate a region map", function () {
    //     var col_img: ImageData = new ImageData(rgba_ui8, width, height);
    //     var img: Images.GrayImage = new Images.GrayImage(width, height, rgba);
    //     var regionMap = new RMap(width, height, img, col_img);
    // });

});
