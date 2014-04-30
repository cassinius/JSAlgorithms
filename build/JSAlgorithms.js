/// <reference path="../tsrefs/node.d.ts" />
var ROOT;

var Helper;
(function (Helper) {
    function setModule(name, mod) {
        ROOT[name] = mod;
    }
    Helper.setModule = setModule;

    function initGEObject() {
        if (typeof module !== 'undefined' && module.exports) {
            ROOT = global;
        } else {
            ROOT = window;
        }
    }

    initGEObject();
    setModule('setModule', setModule);
})(Helper || (Helper = {}));
/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />

var Matrix;
(function (Matrix) {
    var Matrix2D = (function () {
        function Matrix2D(d1, d2, fill) {
            this.d1 = d1;
            this.d2 = d2;
            this.arr_length = 0;
            this.arr_length = this.d1 * this.d2;
            this.arr = new Array(this.arr_length);

            if (fill === fill) {
                for (var i = 0; i < this.arr_length; ++i) {
                    this.arr[i] = fill;
                }
            }
        }
        Matrix2D.generateMatrix = function (arr, d1, d2) {
            if (arr.length !== d1 * d2) {
                throw "Dimensions do not agree with given array!";
            }
            var matrix = new Matrix2D(d1, d2);
            matrix.setArray(arr);
            return matrix;
        };

        Matrix2D.prototype.getArray = function () {
            return this.arr;
        };

        Matrix2D.prototype.setArray = function (arr) {
            this.arr = arr;
        };

        Matrix2D.prototype.dim = function () {
            return { d1: this.d1, d2: this.d2 };
        };

        Matrix2D.prototype.length = function () {
            return this.arr_length;
        };

        Matrix2D.prototype.get = function (i, j) {
            var pos = j * this.d1 + i;
            if (pos >= this.length()) {
                throw "Index out of bounds";
            }
            return this.arr[pos];
        };

        Matrix2D.prototype.set = function (i, j, val) {
            var pos = j * this.d1 + i;
            if (pos >= this.length()) {
                throw "Index out of bounds";
            }
            this.arr[pos] = val;
        };

        Matrix2D.prototype.add = function (other) {
            var dim_other = other.dim();
            if (this.d1 !== dim_other.d1 || this.d2 !== dim_other.d2) {
                throw "Refusing to add 2 matrices of different dimensions!";
            }
            var result = new Matrix2D(this.d1, this.d2);
            for (var i = 0; i < this.d1; ++i) {
                for (var j = 0; j < this.d2; ++j) {
                    result.set(i, j, this.get(i, j) + other.get(i, j));
                }
            }
            return result;
        };

        Matrix2D.prototype.sub = function (other) {
            var dim_other = other.dim();
            if (this.d1 !== dim_other.d1 || this.d2 !== dim_other.d2) {
                throw "Refusing to add 2 matrices of different dimensions!";
            }
            var result = new Matrix2D(this.d1, this.d2);
            for (var i = 0; i < this.d1; ++i) {
                for (var j = 0; j < this.d2; ++j) {
                    result.set(i, j, this.get(i, j) - other.get(i, j));
                }
            }
            return result;
        };

        Matrix2D.prototype.mult = function (other) {
            var other_dim = other.dim();
            if (this.d1 !== other_dim.d2) {
                throw "Dimensions do now allow multiplication; refusing!";
            }
            var result = new Matrix2D(other_dim.d1, this.d2);

            for (var j = 0; j < this.d2; ++j) {
                for (var i = 0; i < other_dim.d1; ++i) {
                    // result position => i, j
                    var cur_res = 0;
                    for (var k = 0; k < this.d1; ++k) {
                        // console.log("Mult: " + this.get(k,j) + " * " + other.get(i,k));
                        cur_res += this.get(k, j) * other.get(i, k);
                    }
                    result.set(i, j, cur_res);
                }
            }
            return result;
        };

        Matrix2D.prototype.toString = function () {
            console.log("Matrix representation:\n");
            for (var j = 0; j < this.d2; ++j) {
                process.stdout.write("[");
                for (var i = 0; i < this.d1; ++i) {
                    process.stdout.write(this.get(i, j) + " ");
                }
                console.log("]");
            }
        };
        return Matrix2D;
    })();
    Matrix.Matrix2D = Matrix2D;

    setModule('Matrix', Matrix);
})(Matrix || (Matrix = {}));
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

var demoGrayScale = function() {
    var canvas = document.querySelector("#img_canvas");
    var ctx = canvas.getContext('2d');
    var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var gray = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var gray_array = gray.fillRgbaArray(img.data);
    ctx.putImageData(img, 0, 0);
};