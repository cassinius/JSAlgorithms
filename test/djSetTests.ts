/**
 * Created by bernd on 19.05.14.
 */

/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="../tsrefs/mocha.d.ts" />
/// <reference path="../tsrefs/chai.d.ts" />
/// <reference path="../src/DisjointSet.ts" />


var expect = require('chai').expect;
require('../src/Helper.js');
require('../src/DisjointSet.js');

var DJS = DJSet.DisjointSet;

describe("DJSet Tests", function() {

    it("Should correctly instantiate a djSet", function () {
        var size = 5;
        var djs: DJSet.DisjointSet = new DJS(size);

        expect(djs.getSize()).to.equal(size);
        for (var i = 0; i < size; ++i) {
            expect(djs.parent(i)).to.equal(i);
            expect(djs.rank(i)).to.equal(0);
        }

        // merge region 0 and 1, should be merged to 0..
        // so that parent(1) = 0 and rank(0) = 1
        djs.union(0, 1);
        expect(djs.parent(0)).to.equal(0);
        expect(djs.parent(1)).to.equal(0);
        expect(djs.rank(1)).to.equal(0);
        expect(djs.rank(0)).to.equal(1);
        expect(djs.find(1)).to.equal(0);

        // merge region 2 and 3, should be merged to 2
        djs.union(2, 3);
        expect(djs.parent(2)).to.equal(2);
        expect(djs.parent(3)).to.equal(2);
        expect(djs.rank(3)).to.equal(0);
        expect(djs.rank(2)).to.equal(1);
        expect(djs.find(3)).to.equal(2);

        // merge regions 0 and 2 (now 1,2,3 should all be in 0)
        djs.union(0, 2);
        expect(djs.parent(2)).to.equal(0);
        expect(djs.find(2)).to.equal(0);
        expect(djs.find(1)).to.equal(0);
        expect(djs.find(3)).to.equal(0);

        expect(djs.rank(3)).to.equal(0);
        expect(djs.rank(1)).to.equal(0);
        expect(djs.rank(2)).to.equal(1);
        expect(djs.rank(0)).to.equal(2);

        // merge region 4 into 0 (now all nodes in 0)
        djs.union(4, 0);
        expect(djs.parent(4)).to.equal(0);
        for (var i = 0; i < size; ++i) {
            expect(djs.find(i)).to.equal(0);
        }
        expect(djs.rank(0)).to.equal(2);
    });

});
