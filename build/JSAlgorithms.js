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
            var pixel;

            var graylevel_here, graylevel_there, there;

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
                        pixel = this.get(x, y);

                        if (typeof pixel === 'number') {
                            neighborsArray.push([x + n, y + m, Math.abs(this.get(x, y) - this.get(x + n, y + m))]);
                        } else if (Array.isArray(pixel)) {
                            graylevel_here = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
                            there = this.get(x + n, y + m);
                            graylevel_there = 0.2126 * there[0] + 0.7152 * there[1] + 0.0722 * there[2];
                            neighborsArray.push([x + n, y + m, Math.abs(graylevel_here - graylevel_there)]);
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

var Graphs;
(function (Graphs) {
    var Graph = (function () {
        function Graph(adj_list, sort, up) {
            this.adj_list = adj_list;
            this.edge_list = this.computeEdgeList();
            if (sort) {
                this.sort(up);
            }
        }
        Graph.prototype.sort = function (up) {
            if (typeof up === "undefined") { up = true; }
            var sortfunc;
            if (up) {
                sortfunc = function (a, b) {
                    return a.w - b.w;
                };
            } else {
                sortfunc = function (a, b) {
                    return b.w - a.w;
                };
            }
            this.edge_list.sort(sortfunc);
        };

        Graph.prototype.computeEdgeList = function () {
            var adj_tmp = this.adj_list;
            var dims = adj_tmp.dim();
            var visited = new Matrix.Matrix2D(dims.d1, dims.d2, 0);

            var edges = new Array();
            var neighbors;
            var nb;
            var edge;

            for (var i = 0; i < dims.d1; ++i) {
                for (var j = 0; j < dims.d2; ++j) {
                    // mark the pixel visited (=> add no more edges to this one)
                    visited.set(i, j, 1);

                    // get connected pixels
                    neighbors = adj_tmp.get(i, j);

                    for (var k = 0; k < neighbors.length; ++k) {
                        nb = neighbors[k];

                        // this neighbor already visited? => continue
                        if (visited.get(nb[0], nb[1])) {
                            continue;
                        }
                        edge = {
                            p1: [i, j],
                            p2: [nb[0], nb[1]],
                            w: nb[2]
                        };

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
/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />
/// <reference path="./Images.ts" />
/// <reference path="./Graphs.ts" />

var M2D = Matrix.Matrix2D;

var Regions;
(function (Regions) {
    var RegionMap = (function () {
        function RegionMap(width, height, img) {
            this.regions = {};
            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();
            var x, y, region;

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                region = new Region(i);

                // TODO outsource this to region class in some meaningful way
                region.size = 1;
                region.avg_color = img_arr[i];
                x = i % width;
                y = (i / width) | 0;
                region.pixels.push([x, y, img_arr[i]]);
                this.regions[i] = region;
            }
        }
        RegionMap.prototype.merge = function (r1, r2, e) {
            // Set new internal maxMST
            r1.maxMST = e.w;

            // Set new avg color (as integer)
            r1.avg_color = ((r1.avg_color * r1.size + r2.avg_color * r2.size) / (r1.size + r2.size)) | 0;

            // Set the centroid (TODO implement later ;))
            // Update size
            r1.size += r2.size;

            // set all other labels to the r1 label
            var px;
            for (var i = 0; i < r2.pixels.length; ++i) {
                px = r2.pixels[i];
                this.labels.set(px[0], px[1], r1.id);
            }

            // and push all pixels over...
            r1.pixels.push.apply(r1.pixels, r2.pixels);

            //            while( r2.pixels.length ) {
            //                r1.pixels.push(r2.pixels.pop());
            //            }
            // delete r2
            delete this.regions[r2.id];
        };

        RegionMap.prototype.getRegion = function (px) {
            var key = this.labels.get(px[0], px[1]);
            return this.regions[key];
        };
        return RegionMap;
    })();
    Regions.RegionMap = RegionMap;

    var Region = (function () {
        function Region(id) {
            this.id = id;
            // TODO WHY OH WHY IS THE TYPE SYSTEM SO SHY ???
            this.size = 0;
            this.avg_color = 0;
            this.centroid = null;
            this.maxMST = 0;
            this.pixels = [];
        }
        return Region;
    })();
    Regions.Region = Region;

    setModule('Regions', Regions);
})(Regions || (Regions = {}));
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
    delete window.grayImg;
    delete window.adj_list;

    var start = new Date().getTime();

    getGlobals();
    window.grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    window.adj_list = grayImg.computeAdjacencyList(true);

    var dims = adj_list.dim();
    console.log("Adjacency List dimensions: " + dims.d1 + ", " + dims.d2);
    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


var demoEdgeListComputation = function() {
    delete window.graph;
    
    var start = new Date().getTime();
    getGlobals();

    var grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var adj_list = grayImg.computeAdjacencyList(true);
    window.graph = new Graphs.Graph(adj_list);

    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


var demoKruskalBasedSegmentation = function() {
    delete window.grayImg;
    delete window.adj_list;
    delete window.graph;
    delete window.rMap;

    var start = new Date().getTime();
    getGlobals();
    var width = canvas.width,
        height = canvas.height;

    window.grayImg = new Images.GrayImage(width, height, img.data);
    var time = new Date().getTime() - start;
    console.log("Converted to Gray Image... in " + time + 'ms');

    window.adj_list = grayImg.computeAdjacencyList(true);
    time = new Date().getTime() - start;
    console.log("Constructed Adjacency List...  in " + time + 'ms');

    window.graph = new Graphs.Graph(adj_list, true); // sort the Edge List
    time = new Date().getTime() - start;
    console.log("Instantiated original Graph... in " + time + 'ms');

    window.rMap = new Regions.RegionMap(width, height, grayImg);
    time = new Date().getTime() - start;
    console.log("Constructed Region Map... in " + time + 'ms');

    var edges = graph.edge_list,
        px_i = [],
        px_j = [],
        r1 = 0,
        r2 = 0,
        e = 0,
        mergers = 0;

    console.log("STARTING THE REGION MERGING...");

    for( var i = 0; i < edges.length; ++i ) {
        e = edges[i];
        px_i = e.p1;
        px_j = e.p2;
        r1 = rMap.getRegion(px_i);
        r2 = rMap.getRegion(px_j);
        if( r1.id !== r2.id ) {
            rMap.merge(r1, r2, e);
            ++mergers;
        }
    }

    time = new Date().getTime() - start;
    console.log("Merged " + mergers + " regions... in " + time + 'ms');
    console.log( (width * height - mergers) + " regions remain.");
};

