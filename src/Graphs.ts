/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />
/// <reference path="./Images.ts" />

declare function setModule(name: string, mod: any);

var M2D = Matrix.Matrix2D;


module Graphs {

    export interface Edge {
        p1: Array<number>   // Source Pixel
        p2: Array<number>   // Destination Pixel
        w: number           // Weight
    }

    export class Graph {
        edge_list: Edge[];

        constructor(private adj_list: Matrix.Matrix2D, sort?:boolean, up?:boolean) {
            this.edge_list = this.computeEdgeList();
            if( sort ) {
                this.sort(up);
            }
        }

        sort(up:boolean = true) {
            var sortfunc;
            if( up ) {
                sortfunc = function(a, b) {return a.w - b.w};
            }
            else {
                sortfunc = function(a, b) {return b.w - a.w};
            }
            this.edge_list.sort(sortfunc);
        }

        computeEdgeList() : Edge[] {
            var adj_tmp = this.adj_list;
            var dims = adj_tmp.dim();
            var visited: Matrix.Matrix2D = new Matrix.Matrix2D(dims.d1, dims.d2, 0);

            var edges: Edge[] = [];
            var neighbors: Array<any>;
            var nb: Array<number>;
            var edge: Edge;

            for( var i = 0; i < dims.d1; ++i ) {
                for( var j = 0; j < dims.d2; ++j ) {
                    // mark the pixel deleted (=> add no more edges to this one)
                    visited.set(i, j, 1);

                    // get connected pixels
                    neighbors = adj_tmp.get(i, j);

                    for( var k = 0; k < neighbors.length; ++k ) {
                        nb = neighbors[k];

                        // this neighbor already deleted? => continue
                        if( visited.get(nb[0], nb[1]) ) {
                            continue;
                        }
                        edge = { p1:      [i, j],
                                 p2:      [nb[0], nb[1]],
                                  w:      nb[2]
                               };

                        edges.push(edge);
                    }
                }
            }

            return edges;
        }

    }

    setModule('Graphs', Graphs);
}