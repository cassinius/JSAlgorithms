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
