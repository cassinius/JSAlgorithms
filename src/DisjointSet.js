/**
* Created by bernd on 19.05.14.
*/
/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />

var DJSet;
(function (DJSet) {
    var DisjointSet = (function () {
        // we make this a continuous DJSet for the moment, i.e.
        // our elements are numberd 0 .. size-1
        function DisjointSet(size) {
            this.size = size;
            this.parents = new Array(size);
            this.ranks = new Array(size);
            for (var i = 0; i < size; ++i) {
                // every region is it's own parent at the beginning
                this.parents[i] = i;

                // every region has rank = 0 (no children)
                this.ranks[i] = 0;
            }
        }
        DisjointSet.prototype.getSize = function () {
            return this.size;
        };

        DisjointSet.prototype.find = function (region) {
            var p = this.parents[region];
            if (p === region) {
                return p;
            } else {
                return this.find(p);
            }
        };

        DisjointSet.prototype.union = function (r1, r2) {
            if (this.ranks[r1] > this.ranks[r2]) {
                this.parents[r2] = r1;
            } else if (this.ranks[r2] > this.ranks[r1]) {
                this.parents[r1] = r2;
            } else {
                this.parents[r2] = r1;
                this.ranks[r1]++;
            }
        };

        DisjointSet.prototype.rank = function (r) {
            return this.ranks[r];
        };

        DisjointSet.prototype.parent = function (r) {
            return this.parents[r];
        };
        return DisjointSet;
    })();
    DJSet.DisjointSet = DisjointSet;

    setModule('DJSet', DJSet);
})(DJSet || (DJSet = {}));
