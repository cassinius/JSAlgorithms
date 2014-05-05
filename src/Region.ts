/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />
/// <reference path="./Images.ts" />
/// <reference path="./Graphs.ts" />


declare function setModule(name: string, mod: any);

var M2D = Matrix.Matrix2D;


module Regions {

    export interface IRegion{
        size: number
        avg_color: number
        centroid: Array<any>
        maxMST: number
        pixels: Array<any>
    }

    export class RegionMap {
        labels: Matrix.Matrix2D;
        regions: {} = {};

        constructor(width: number, height: number, img: Images.GrayImage) {
            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();
            var x:number,
                y: number,
                region: Region;

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                region = new Region(i);

                // TODO outsource this to region class in some meaningful way
                region.size = 1;
                region.avg_color = img_arr[i];
                x = i % width;
                y = (i / width) | 0;
                region.pixels.push( [ x, y, img_arr[i] ]);
                this.regions[i] = region;
            }
        }

        merge(r1: Region, r2: Region, e: Graphs.Edge) {
            // Set new internal maxMST
            r1.maxMST = e.w;

            // Set new avg color (as integer)
            r1.avg_color = ( ( r1.avg_color * r1.size + r2.avg_color * r2.size ) / ( r1.size + r2.size ) ) | 0;

            // Set the centroid (TODO implement later ;))

            // Update size
            r1.size += r2.size;

            // set all other labels to the r1 label
            var px;
            for(var i = 0; i < r2.pixels.length; ++i) {
                px = r2.pixels[i];
                this.labels.set(px[0], px[1], r1.id);
            }

            // and push all pixels over...
            // r1.pixels.push.apply(r1.pixels, r2.pixels);

//            while( r2.pixels.length ) {
//                r1.pixels.push(r2.pixels.pop());
//            }

            // delete r2
            // delete this.regions[r2.id];
        }

        getRegion( px: Array<any> ) : Region {
            var key = this.labels.get(px[0], px[1]);
            return this.regions[key];
        }

    }


    export class Region implements IRegion {
        // TODO WHY OH WHY IS THE TYPE SYSTEM SO SHY ???
        size: number = 0;
        avg_color: number = 0;
        centroid: Array<any> = null;
        maxMST: number = 0;
        pixels: Array<any> = [];

        constructor( public id: number ) {}

    }


    setModule('Regions', Regions);

}
