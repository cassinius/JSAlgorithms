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
        labels: Matrix.Matrix2D = null;
        regions: {} = {};

        constructor(width: number, height: number, img: Images.GrayImage) {
            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                this.regions[i] = new Region(i);

                // TODO compute the right conversion
                this.regions[i].pixels.push( [ img_arr[i] ]);
            }
        }

        // we merge r2 into r1
        merge(r1: Region, r2: Region, e: Graphs.Edge) {
            // Set new internal maxMST
            r1.maxMST = e.w;

            // Set new avg color (as integer)
            r1.avg_color = ( ( r1.avg_color * r1.size + r2.avg_color * r2.size ) / ( r1.size + r2.size ) ) | 0;

            // Set the centroid (TODO implement later ;))

            // Update size
            r1.size += r2.size;

            // set all other labels to meeeee !
            var px;
            for(var i = 0; i < r2.pixels.length; ++i) {
                px = r2[i];
                this.labels.set(px[0], px[1], r1.id);
            }
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
