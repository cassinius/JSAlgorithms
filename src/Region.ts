/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />


declare function setModule(name: string, mod: any);

var M2D = Matrix.Matrix2D;


module Regions {

    export interface IRegion{
        size: number
        avg_color: number
        centroid: Array<any>
        maxEdge: number
        pixels: Array<any>
        labelColor: Array<any>
        deleted: boolean
    }

    export class RegionMap {
        labels: Matrix.Matrix2D;
        regions: {} = {};

        constructor(width: number, height: number, img: Images.GrayImage) {
            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();
            var x: number,
                y: number,
                region: Region;

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                region = new Region(i);

                // TODO outsource this to region class in some meaningful way
                region.size = 1;
                region.avg_color = img_arr[i];
                x = i % width >>> 0;
                y = (i / width) >>> 0;
//                region.pixels.push( [ x, y, img_arr[i] ]);
                region.centroid = [x, y];
                this.regions[i] = region;
            }
        }

        merge(r1: Region, r2: Region, e: Graphs.Edge) {

            // Set new internal maxEdge
            r1.maxEdge = e.w;

            // Set new avg color (as integer)
            r1.avg_color = ( ( r1.avg_color * r1.size + r2.avg_color * r2.size ) / ( r1.size + r2.size ) ) | 0;

            var sum_size = r1.size + r2.size;
            // Set the centroid and update the size (we assume 2D centroids)
            r1.centroid[0] = ( r1.centroid[0] * r1.size + r2.centroid[0] + r2.size ) / sum_size;
            r1.centroid[1] = ( r1.centroid[1] * r1.size + r2.centroid[1] + r2.size ) / sum_size;

            r1.size = sum_size;

            // mark the region r2 deleted
            r2.deleted = true;
        }

        getRegion( px: Array<any> ) : Region {
            var key = this.labels.get(px[0], px[1]);
            return this.regions[key];
        }

        getRegionByIndex( idx : number ) {
            return this.regions[idx];
        }

    }


    export class Region implements IRegion {
        // TODO WHY OH WHY IS THE TYPE SYSTEM SO SHY ???
        size: number = 0;
        avg_color: number = 0;
        centroid: Array<any> = [];
        maxEdge: number = 0;
        pixels: Array<any> = [];
        labelColor: Array<any> = [];
        deleted: boolean = false;

        constructor( public id: number ) {}

    }


    setModule('Regions', Regions);

}
