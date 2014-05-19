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
                    // mark the pixel deleted (=> add no more edges to this one)
                    visited.set(i, j, 1);

                    // get connected pixels
                    neighbors = adj_tmp.get(i, j);

                    for (var k = 0; k < neighbors.length; ++k) {
                        nb = neighbors[k];

                        // this neighbor already deleted? => continue
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
