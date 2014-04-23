/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/Matrix.ts" />
var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/Matrix.js');

var M2D = Matrix.Matrix2D;

describe("Basic Test", function () {
    it("Should be true", function () {
        expect(true).to.be.true;
    });
});

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
        var sub_result = m1.subtract(m2);
        expect(JSON.stringify(sub_expect.getArray())).to.equal(JSON.stringify(sub_result.getArray()));
    });
});
//# sourceMappingURL=matrixTests.js.map
