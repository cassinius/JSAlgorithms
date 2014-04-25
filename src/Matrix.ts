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
        private arr: Array<any>;

        constructor(private d1:number, private d2:number, fill?:number) {
            this.arr_length = this.d1 * this.d2;
            this.arr = new Array(this.arr_length);

            if( fill === fill ) {
                for (var i = 0; i < this.arr_length; ++i) {
                    this.arr[i] = fill;
                }
            }
        }

        static generateMatrix(arr: Array<any>, d1: number, d2: number) : Matrix2D {
            if( arr.length !== d1 * d2 ) {
                throw "Dimensions do not agree with given array!";
            }
            var matrix = new Matrix2D(d1, d2);
            matrix.setArray(arr);
            return matrix;
        }

        getArray() : Array<any> {
            return this.arr;
        }

        private setArray(arr: Array<any>) : void {
            this.arr = arr;
        }

        dim() : Dimensions2D {
            return {d1: this.d1, d2: this.d2};
        }

        length() : number {
            return this.arr_length;
        }

        get(i: number, j: number) : any {
            var pos = j * this.d1 + i;
            if( pos >= this.length() ) {
                throw "Index out of bounds";
            }
            return this.arr[pos];
        }

        set(i: number, j: number, val: any) : void {
            var pos = j * this.d1 + i;
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

        sub(other: Matrix2D) : Matrix2D {
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

        mult(other: Matrix2D) : Matrix2D {
            var other_dim = other.dim();
            if( this.d1 !== other_dim.d2 ) {
                throw "Dimensions do now allow multiplication; refusing!";
            }
            var result = new Matrix2D(other_dim.d1, this.d2);

            for( var j = 0; j < this.d2; ++j ) {
                for( var i = 0; i < other_dim.d1; ++i ) {
                    // result position => i, j
                    var cur_res = 0;
                    for( var k = 0; k < this.d1; ++k ) {
                        // console.log("Mult: " + this.get(k,j) + " * " + other.get(i,k));
                        cur_res += this.get(k,j) * other.get(i,k);
                    }
                    result.set(i,j, cur_res);
                }
            }
            return result;
        }

        toString(): void {
            console.log("Matrix representation:\n");
            for (var j = 0; j < this.d2; ++j) {
                process.stdout.write("[");
                for( var i = 0; i < this.d1; ++i ) {
                    process.stdout.write(this.get(i,j) + " ");
                }
                console.log("]");
            }
        }

    }

    setModule('Matrix', Matrix);
}
