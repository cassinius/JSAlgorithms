/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />
/// <reference path="./Images.ts" />

declare function setModule(name: string, mod: any);

var M2D = Matrix.Matrix2D;
var GrayImg = Images.GrayImage;
var RgbImg = Images.RgbImage;


module Graphs {

    export interface Edge {
        p1: Array<number>   // Source Pixel
        p2: Array<number>   // Destination Pixel
        w: number           // Weight
    }

    export class Graph {
        edge_list: Edge[];

        constructor(private adj_list: Matrix.Matrix2D) {
            this.edge_list = this.computeEdgeList();
        }

        computeEdgeList() : Edge[] {
            var adj_tmp = Matrix.Matrix2D.copyMatrix(this.adj_list);
            var dims = adj_tmp.dim();
            var visited: Matrix.Matrix2D = new Matrix.Matrix2D(dims.d1, dims.d2, 0);

            var edges: Edge[] = new Array();

            for( var i = 0; i < dims.d1; ++i ) {
                for( var j = 0; j < dims.d2; ++j ) {
                    // mark the pixel visited (=> add no more edges to this one)
                    visited.set(i, j, 1);

                    // get connected pixels
                    var neighbors: Array<any> = adj_tmp.get(i, j);

                    for( var k = 0; k < neighbors.length; ++k ) {
                        var n = neighbors[k];

                        // this neighbor already visited? => continue
                        if( visited.get(n[0], n[1]) ) {
                            continue;
                        }
                        var edge: Edge = { p1:      [i, j],
                                           p2:      [n[0], n[1]],
                                            w:      n[2]
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
        }

    }

    setModule('Graphs', Graphs);
}