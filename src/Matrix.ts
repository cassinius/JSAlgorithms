/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />

declare function setModule(name: string, mod: any);

module Matrix {

    export interface Dimensions2D {
        d1: number;
        d2: number;
    }

    export class Matrix2D {
        private arr_length: number = 0;
        private arr: Uint32Array;

        constructor(private d1:number, private d2:number, fill?:number) {
            this.arr_length = this.d1 * this.d2;
            this.arr = new Uint32Array(this.arr_length);

            for(var i = 0; i < this.arr_length; ++i) {
                this.arr[i] = fill ? fill : 0;
            }
        }

        getArray() : Uint32Array {
            return this.arr;
        }

        dim() : Dimensions2D {
            return {d1: this.d1, d2: this.d2};
        }

        length() : number {
            return this.arr_length;
        }

        get(i: number, j: number) : number {
            var pos = this.d1 * j + i;
            if( pos >= this.length() ) {
                throw "Index out of bounds";
            }
            return this.arr[pos];
        }

        set(i: number, j: number, val: number) : void {
            var pos = this.d1 * j + i;
            if( pos >= this.length() ) {
                throw "Index out of bounds";
            }
            this.arr[pos] = val;
        }

        add(other: Matrix2D) : Matrix2D {
            var dim_other = other.dim();
            if( this.d1 !== dim_other.d1 || this.d2 !== dim_other.d2 ) {
                throw "Refusing to add 2 matrices of different dimensions!";
            }
            var result = new Matrix2D(this.d1, this.d2);
            for( var i = 0; i < this.d1; ++i ) {
                for( var j = 0; j < this.d2; ++j ) {
                    result.set(i,j, this.get(i,j) + other.get(i,j));
                }
            }
            return result;
        }

        subtract(other: Matrix2D) : Matrix2D {
            var dim_other = other.dim();
            if( this.d1 !== dim_other.d1 || this.d2 !== dim_other.d2 ) {
                throw "Refusing to add 2 matrices of different dimensions!";
            }
            var result = new Matrix2D(this.d1, this.d2);
            for( var i = 0; i < this.d1; ++i ) {
                for( var j = 0; j < this.d2; ++j ) {
                    result.set(i,j, this.get(i,j) - other.get(i,j));
                }
            }
            return result;
        }

    }

    setModule('Matrix', Matrix);
}
