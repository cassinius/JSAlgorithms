/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />

declare function setModule(name: string, mod: any);

var M2D = Matrix.Matrix2D;
declare var Uint8ClampedArray;

module Images {

    export class RgbImage {
        private matrix: Matrix.Matrix2D;

        // as we are only using this with HTML canvas, we always assume rgba inputs
        constructor(private width: number, private height: number, rgba: Array<number>) {
            if( rgba.length !== width * height * 4) {
                throw "Invalid dimensions or array length";
            }
            this.matrix = new M2D(width, height);

            // set each [r,g,b] array to its pixel coordinate
            for( var i = 0; i < width; ++i ) {
                for( var j = 0; j < height; ++j ) {
                    var p = (j * width + i) * 4;
                    var vec = [ rgba[p], rgba[p+1], rgba[p+2] ];
                    this.matrix.set(i,j, vec);
                }
            }
        }

        getArray(): Array<any> {
            return this.matrix.getArray();
        }

        toRgbaArray() : Array<number> {
            var rgba: Array<number> = new Array( this.width * this.height * 4);
            var rgb = this.matrix.getArray();
            var gaps = 0;
            for( var i = 0; i < rgba.length; ++i ) {
                if( i % 4 === 3 ) {
                    ++gaps;
                    rgba[i] = 1;
                }
                else {
                    rgba[i] = rgb[i - gaps];
                }
            }
            return rgba;
        }

        toGrayImage() : GrayImage {
            return new GrayImage(this.width, this.height, this.toRgbaArray());
        }

    }


    export class GrayImage {
        private matrix: Matrix.Matrix2D;

        // as we are only using this with HTML canvas, we always assume rgba inputs
        constructor(private width: number, private height: number, rgba: Array<number>) {
            if( rgba.length !== width * height * 4 ) {
                throw "Invalid dimensions or array length";
            }
            this.matrix = new M2D(width, height);

            // set each [r,g,b] array to its pixel coordinate
            for( var i = 0; i < width; ++i ) {
                for( var j = 0; j < height; ++j ) {
                    var p = (j * width + i) * 4;
                    var graylevel =  0.2126*rgba[p] + 0.7152*rgba[p+1] + 0.0722*rgba[p+2];
                    this.matrix.set(i,j, graylevel);
                }
            }
        }

        getArray(): Array<any> {
            return this.matrix.getArray();
        }

        toRgbaArray() : Array<number> {
            var rgba = new Uint8ClampedArray( this.width * this.height * 4);
            var pixels = this.matrix.getArray();
            var pos = 0;
            for( var i = 0; i < pixels.length; ++i ) {
                rgba[pos] = rgba[pos+1] = rgba[pos+2] = pixels[i];
                rgba[pos+3] = 255;
                pos += 4;
            }
            return rgba;
        }

        fillRgbaArray(rgba: Array<number>) : void {
            var pixels = this.matrix.getArray();
            var pos = 0;
            for( var i = 0; i < pixels.length; ++i ) {
                rgba[pos] = rgba[pos+1] = rgba[pos+2] = pixels[i];
                rgba[pos+3] = 255;
                pos += 4;
            }
        }

    }

    setModule('Images', Images);
}