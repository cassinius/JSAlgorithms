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

        Matrix2D.copyMatrix = function (source) {
            var dims = source.dim();
            var dest = new Matrix2D(dims.d1, dims.d2);
            for (var i = 0; i < dims.d1; ++i) {
                for (var j = 0; j < dims.d2; ++j) {
                    var px = source.get(i, j);
                    if (typeof px === 'number') {
                        dest.set(i, j, px);
                    } else if (Array.isArray(px)) {
                        dest.set(i, j, px.slice(0));
                    } else {
                        throw "Unsupported matrix field type!";
                    }
                }
            }
            return dest;
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

        Matrix2D.prototype.getNeighbors = function (x, y, color) {
            if (typeof color === "undefined") { color = false; }
            var width = this.d1;
            var height = this.d2;

            var neighborsArray = [];

            for (var n = -1; n < 2; n++) {
                if (x + n < 0 || x + n >= width) {
                    continue;
                }
                for (var m = -1; m < 2; m++) {
                    if (y + m < 0 || y + m >= height) {
                        continue;
                    }
                    if (m == 0 && n == 0) {
                        continue;
                    }
                    if (color) {
                        var pixel = this.get(x, y);

                        if (typeof pixel === 'number') {
                            neighborsArray.push([x + n, y + m, this.get(x, y) - this.get(x + n, y + m)]);
                        } else if (Array.isArray(pixel)) {
                            var graylevel_here = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
                            var there = this.get(x + n, y + m);
                            var graylevel_there = 0.2126 * there[0] + 0.7152 * there[1] + 0.0722 * there[2];
                            neighborsArray.push([x + n, y + m, graylevel_here - graylevel_there]);
                        } else {
                            throw "Unsupported Matrix field type!";
                        }
                    } else {
                        neighborsArray.push([x + n, y + m, this.get(x + n, y + m)]);
                    }
                }
            }

            return neighborsArray;
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

        GrayImage.prototype.computeAdjacencyList = function (color) {
            var adj_list = new Matrix.Matrix2D(this.width, this.height);

            for (var x = 0; x < this.width; ++x) {
                for (var y = 0; y < this.height; ++y) {
                    adj_list.set(x, y, this.matrix.getNeighbors(x, y, color));
                }
            }

            return adj_list;
        };
        return GrayImage;
    })();
    Images.GrayImage = GrayImage;

    setModule('Images', Images);
})(Images || (Images = {}));
/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />
/// <reference path="./Images.ts" />

var M2D = Matrix.Matrix2D;
var GrayImg = Images.GrayImage;
var RgbImg = Images.RgbImage;

var Graphs;
(function (Graphs) {
    var Graph = (function () {
        function Graph(adj_list) {
            this.adj_list = adj_list;
            this.edge_list = this.computeEdgeList();
        }
        Graph.prototype.computeEdgeList = function () {
            var adj_tmp = Matrix.Matrix2D.copyMatrix(this.adj_list);
            var dims = adj_tmp.dim();
            var visited = new Matrix.Matrix2D(dims.d1, dims.d2, 0);

            var edges = new Array();

            for (var i = 0; i < dims.d1; ++i) {
                for (var j = 0; j < dims.d2; ++j) {
                    // mark the pixel visited (=> add no more edges to this one)
                    visited.set(i, j, 1);

                    // get connected pixels
                    var neighbors = adj_tmp.get(i, j);

                    for (var k = 0; k < neighbors.length; ++k) {
                        var n = neighbors[k];

                        // this neighbor already visited? => continue
                        if (visited.get(n[0], n[1])) {
                            continue;
                        }
                        var edge = {
                            p1: [i, j],
                            p2: [n[0], n[1]],
                            w: n[2]
                        };

                        //                        // now we have to delete the opposite edge
                        //                        var dest_px_neighbors = adj_tmp.get(n[0], n[1]);
                        //                        for( var l = 0; l < dest_px_neighbors.length; ++l ) {
                        //                            var potential = dest_px_neighbors[l];
                        //                            if( potential[0] == i && potential[1] == j) {
                        //                                dest_px_neighbors.splice(l, 1);
                        //                            }
                        //                        }
                        edges.push(edge);
                    }
                }
            }

            return edges;
        };
        return Graph;
    })();
    Graphs.Graph = Graph;

    setModule('Graphs', Graphs);
})(Graphs || (Graphs = {}));
var getGlobals = function() {
    window.canvas = document.querySelector("#img_canvas");
    window.ctx = canvas.getContext('2d');
    window.img = ctx.getImageData(0, 0, canvas.width, canvas.height);
};


var demoGrayScale = function() {
    var start = new Date().getTime();

    getGlobals();
    var gray = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var gray_array = gray.fillRgbaArray(img.data);

    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');

    ctx.putImageData(img, 0, 0);
};


var demoAdjacencyList = function() {
    var start = new Date().getTime();

    getGlobals();
    var grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var adj_list = grayImg.computeAdjacencyList(true);

    var dims = adj_list.dim();
    console.log("Adjacency List dimensions: " + dims.d1 + ", " + dims.d2);
    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


var demoEdgeListComputation = function() {
    var start = new Date().getTime();

    getGlobals();
    var grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var adj_list = grayImg.computeAdjacencyList(true);
    var graph = new Graphs.Graph(adj_list);

    var time = new Date().getTime() - start;
    console.error('Execution time: ' + time + 'ms');


    // window.graph = graph;

//    return graph.edge_list;
};