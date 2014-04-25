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
