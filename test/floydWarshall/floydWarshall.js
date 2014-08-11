/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/Matrix.ts" />

//require('../../src/Helper.js');
var fs = require('fs');


var Matrix2D = function (d1, d2, fill) {
    this.d1 = d1;
    this.d2 = d2;
    this.arr_length = 0;
    this.arr_length = this.d1 * this.d2;
    this.arr = new Float32Array(this.arr_length);

    if ( fill === fill ) {
        for (var i = 0; i < this.arr_length; ++i) {
            this.arr[i] = fill;
        }
    }
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


// BEGIN OF ACTUAL EXERCISE...
var fileToDistMatrix = function (file) {
    var dist;
    var infile = fs.readFileSync(file).toString();
    var converted = infile.replace(/\r\n/g, "\n");
    converted.split('\n').forEach(function (line, idx) {

        var l_arr = line.split(/\s+/g);
//        console.log(l_arr);

        if (idx === 0 ) {
            dist = new Matrix2D(l_arr[0], l_arr[0], Number.POSITIVE_INFINITY);
            console.log(dist.length());
            for( var i = 0; i < dist.d1; ++i )
                dist.set(i, i, 0); // distance to self is zero
        }
        else {
            dist.set(l_arr[0] - 1, l_arr[1] - 1, l_arr[2]);
        }
    });
//    console.log(dist.length());

    var nr_inf = 0;
    for(var i = 0; i < dist.d1; ++i ) {
        for (var j = 0; j < dist.d1; ++j) {
            if (dist.get(i, j) === Number.POSITIVE_INFINITY) {
                ++nr_inf;
            }
        }
    }
    console.log(nr_inf);

    return dist;
};


var computeFloydWarshall = function(file) {
    var dist = fileToDistMatrix(file);
    var min = Number.POSITIVE_INFINITY;
    var alternative,
        n = dist.d1,
        k,
        i,
        j;

    // MAIN FLOYD
    for ( k = 0; k < n; ++k ) {
        console.log("k: " + k);
        for ( i = 0; i < n; ++i ) {
            for ( j = 0; j < n; ++j ) {
                alternative = dist.get(i, k) + dist.get(k, j);
                if (dist.get(i, j) > alternative) {
                    dist.set(i, j, alternative);
                }
            }
        }
    }

    // Detect NEGATIVE CYCLES
    for( i = 0; i < dist.d1; ++i ) {
        if( dist.get(i, i) < 0 ) {
            console.log("NEGATIVE CYCLE DETECTED - ABORT!");
            return;
        }
    }

    // Put out SHORTEST SHORTEST PATH
    for ( i = 0; i < n; ++i ) {
        for ( j = 0; j < n; ++j ) {
            if ( dist.get(i,j) < min ) {
                min = dist.get(i,j);
            }
        }
    }
    console.log("MIN SHORTEST PATH HAS LENGTH: " + min);
};


var file = process.argv[2];
computeFloydWarshall(file);
