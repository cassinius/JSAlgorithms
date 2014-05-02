/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/Matrix.ts" />
var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/Matrix.js');

var M2D = Matrix.Matrix2D;

describe("Simple Matrix Tests", function () {
    it("Should construct a matrix of correct proportions", function () {
        var d1 = 5, d2 = 4;
        var m = new M2D(d1, d2);
        expect(m.length()).to.equal(20);
        var dim_result = JSON.stringify(m.dim());
        var dim_expect = JSON.stringify({ d1: 5, d2: 4 });
        expect(dim_result).to.equal(dim_expect);
        expect(m.length()).to.equal(d1 * d2);
    });

    it("Should set the right internal array", function () {
        var m = new M2D(3, 3, 0);
        var arr_expect = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        expect(JSON.stringify(m.getArray())).to.equal(JSON.stringify(arr_expect));
    });

    it("Should get and set correct values", function () {
        var d1 = 5, d2 = 4, fill = 55;
        var m = new M2D(d1, d2, fill);
        for (var i = 0; i < d1; ++i) {
            for (var j = 0; j < d2; ++j) {
                expect(m.get(i, j)).to.equal(fill);
            }
        }
        m.set(2, 2, 22);
        expect(m.get(2, 2)).to.equal(22);
    });

    it("Should correctly add two matrices", function () {
        var m1 = new M2D(3, 3, 2);
        var m2 = new M2D(3, 3, 3);
        var add_expect = new M2D(3, 3, 5);
        var add_result = m1.add(m2);
        expect(JSON.stringify(add_expect.getArray())).to.equal(JSON.stringify(add_result.getArray()));
    });

    it("Should correctly subtract two matrices", function () {
        var m1 = new M2D(3, 3, 5);
        var m2 = new M2D(3, 3, 3);
        var sub_expect = new M2D(3, 3, 2);
        var sub_result = m1.sub(m2);
        expect(JSON.stringify(sub_expect.getArray())).to.equal(JSON.stringify(sub_result.getArray()));
    });

    it("Should be able to correctly instantiate a matrix given an array and dimensions", function () {
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var m = M2D.generateMatrix(arr, 3, 3);

        // Check for correct dimensions
        var dim_expect = { d1: 3, d2: 3 };
        var dim_result = m.dim();
        expect(JSON.stringify(dim_expect)).to.equal(JSON.stringify(dim_result));
    });

    it("Should correctly multiply two quadratic matrices", function () {
        var arr1 = [1, 2, 3, 4];
        var arr2 = [5, 6, 7, 8];
        var m1 = M2D.generateMatrix(arr1, 2, 2);
        var m2 = M2D.generateMatrix(arr2, 2, 2);
        var prod_expect = [19, 22, 43, 50];
        var prod_result = m1.mult(m2).getArray();
        expect(JSON.stringify(prod_expect)).to.be.equal(JSON.stringify(prod_result));
    });

    it("Should correctly multiply two matrices giving a quadratic result", function () {
        var arr1 = [1, 2, 3, 4, 1, 0];
        var arr2 = [0, 3, 1, 5, 2, 6];
        var m1 = M2D.generateMatrix(arr1, 3, 2);
        var m2 = M2D.generateMatrix(arr2, 2, 3);
        var prod_expect = [8, 31, 1, 17];
        var prod_result = m1.mult(m2).getArray();
        expect(JSON.stringify(prod_expect)).to.be.equal(JSON.stringify(prod_result));
    });

    // TODO find out what's wrong here...
    it("Should correctly multiply two matrices giving a non-quadratic result", function () {
        var m1 = new M2D(7, 15, 4);
        var m2 = new M2D(10, 7, 7);
        var prod_result = m1.mult(m2).getArray();

        expect(prod_result.length).to.equal(150);
        for (var k = 0; k < prod_result.length; k++) {
            expect(prod_result[k]).to.equal(196);
        }
    });

    it("Should correctly determine neighbors", function () {
        var arr0 = [0,1,2,3,4,5];
        var m0 = M2D.generateMatrix(arr0, 3, 2);
        var m1 = new M2D(7, 15, 4);
        var pixel0 = [1,0];
        var pixel1 = [1,1];
        var neighbors0 = m0.getNeighbors(pixel0);
        var neighbors1 = m1.getNeighbors(pixel1);

        expect(neighbors0.length).to.equal(5);
        expect(neighbors0[0][2]).to.equal(0);
        expect(neighbors0[1][2]).to.equal(3);
        expect(neighbors0[2][2]).to.equal(4);
        expect(neighbors0[3][2]).to.equal(2);
        expect(neighbors0[4][2]).to.equal(5);

        expect(neighbors1.length).to.equal(8);
        for (var k = 0; k < neighbors1.length; k++) {
            expect(neighbors1[k][2]).to.equal(4);
        }
        
    });
});
