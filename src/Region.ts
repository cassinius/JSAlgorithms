/// <reference path="../typings/tsd.d.ts" />


declare function setModule(name: string, mod: any);

var M2D = Matrix.Matrix2D;

module Regions {

    export interface IRegion {
        id: number
        size: number
        avg_color: number
        avg_orig_color: Array<number>;
        centroid: Array<any>
        maxEdge: number
        pixels: Array<any>
        labelColor: Array<any>
        deleted: boolean
    }

    /*
    *   @member labels
    *
    */
    export class RegionMap {
        labels: Matrix.Matrix2D;
        regions: {} = {};

        constructor(width: number, height: number,
                    img: Images.GrayImage, orig_img: ImageData) {

            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();
            var orig_img_arr = orig_img.data;
            var x: number,
                y: number,
                region: Region;

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                region = new Region(i);

                // TODO outsource this to region class
                region.size = 1;
                region.avg_color = img_arr[i];
                region.avg_orig_color = [orig_img_arr[4*i], orig_img_arr[4*i+1], orig_img_arr[4*i+2] ];
                x = i % width >>> 0;
                y = (i / width) >>> 0;
//                region.pixels.push( [ x, y, img_arr[i] ]);
                region.centroid = [x, y];
                this.regions[i] = region;
            }
        }

        merge(r1: Region, r2: Region, e: ImgGraphs.Edge) {

            // Set new internal maxEdge
            r1.maxEdge = e.w;

            // Set new avg GREY color (as integer)
            r1.avg_color = ( ( r1.avg_color * r1.size + r2.avg_color * r2.size ) / ( r1.size + r2.size ) ) | 0;

            // Set new avg ORIGINAL color
            r1.avg_orig_color[0] = ( ( r1.avg_orig_color[0] * r1.size + r2.avg_orig_color[0] * r2.size ) / ( r1.size + r2.size )) | 0;
            r1.avg_orig_color[1] = ( ( r1.avg_orig_color[1] * r1.size + r2.avg_orig_color[1] * r2.size ) / ( r1.size + r2.size )) | 0;
            r1.avg_orig_color[2] = ( ( r1.avg_orig_color[2] * r1.size + r2.avg_orig_color[2] * r2.size ) / ( r1.size + r2.size )) | 0;

            var sum_size = r1.size + r2.size;
            // Set the centroid and update the size (we assume 2D centroids)
            r1.centroid[0] = ( r1.centroid[0] * r1.size + r2.centroid[0] * r2.size ) / sum_size;
            r1.centroid[1] = ( r1.centroid[1] * r1.size + r2.centroid[1] * r2.size ) / sum_size;
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
        // TODO: WHY OH WHY IS THE TYPE SYSTEM SO SHY ???
        size: number = 0;
        avg_color: number = 0;
        avg_orig_color:  Array<number> = [0, 0, 0];
        centroid: Array<any> = [];
        maxEdge: number = 0;
        pixels: Array<any> = [];
        labelColor: Array<any> = [];
        deleted: boolean = false;

        constructor( public id: number ) {}
    }


    setModule('Regions', Regions);

}
