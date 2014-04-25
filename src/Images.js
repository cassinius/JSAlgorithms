/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />

var M2D = Matrix.Matrix2D;

var Images;
(function (Images) {
    var RgbImage = (function () {
        // as we are only using this with HTML canvas, we always assume rgba inputs
        function RgbImage(width, height, rgba) {
            this.width = width;
            this.height = height;
            if (rgba.length !== width * height * 4) {
                throw "Invalid dimensions or array length";
            }
            this.matrix = new M2D(width, height);

            for (var i = 0; i < width; ++i) {
                for (var j = 0; j < height; ++j) {
                    var p = (j * width + i) * 4;
                    var vec = [rgba[p], rgba[p + 1], rgba[p + 2]];
                    this.matrix.set(i, j, vec);
                }
            }
        }
        RgbImage.prototype.getArray = function () {
            return this.matrix.getArray();
        };

        RgbImage.prototype.toRgbaArray = function () {
            var rgba = new Array(this.width * this.height * 4);
            var rgb = this.matrix.getArray();
            var gaps = 0;
            for (var i = 0; i < rgba.length; ++i) {
                if (i % 4 === 3) {
                    ++gaps;
                    rgba[i] = 1;
                } else {
                    rgba[i] = rgb[i - gaps];
                }
            }
            return rgba;
        };

        RgbImage.prototype.toGrayImage = function () {
            return new GrayImage(this.width, this.height, this.toRgbaArray());
        };
        return RgbImage;
    })();
    Images.RgbImage = RgbImage;

    var GrayImage = (function () {
        // as we are only using this with HTML canvas, we always assume rgba inputs
        function GrayImage(width, height, rgba) {
            this.width = width;
            this.height = height;
            if (rgba.length !== width * height * 4) {
                throw "Invalid dimensions or array length";
            }
            this.matrix = new M2D(width, height);

            for (var i = 0; i < width; ++i) {
                for (var j = 0; j < height; ++j) {
                    var p = (j * width + i) * 4;
                    var graylevel = 0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2];
                    this.matrix.set(i, j, graylevel);
                }
            }
        }
        GrayImage.prototype.getArray = function () {
            return this.matrix.getArray();
        };

        GrayImage.prototype.toRgbaArray = function () {
            var rgba = new Uint8ClampedArray(this.width * this.height * 4);
            var pixels = this.matrix.getArray();
            var pos = 0;
            for (var i = 0; i < pixels.length; ++i) {
                rgba[pos] = rgba[pos + 1] = rgba[pos + 2] = pixels[i];
                rgba[pos + 3] = 255;
                pos += 4;
            }
            return rgba;
        };

        GrayImage.prototype.fillRgbaArray = function (rgba) {
            var pixels = this.matrix.getArray();
            var pos = 0;
            for (var i = 0; i < pixels.length; ++i) {
                rgba[pos] = rgba[pos + 1] = rgba[pos + 2] = pixels[i];
                rgba[pos + 3] = 255;
                pos += 4;
            }
        };
        return GrayImage;
    })();
    Images.GrayImage = GrayImage;

    setModule('Images', Images);
})(Images || (Images = {}));
