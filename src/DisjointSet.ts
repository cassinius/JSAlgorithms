/// <reference path="../typings/tsd.d.ts" />

declare function setModule(name: string, mod: any);

module DJSet {

    export class DisjointSet {
        parents: Array<any>;
        ranks: Array<any>;

        // we make this a continuous DJSet for the moment, i.e.
        // our elements are numberd 0 .. size-1
        constructor(public size: number) {
            this.parents = new Array(size);
            this.ranks = new Array(size);
            for (var i = 0; i < size; ++i) {
                // every region is it's own parent at the beginning
                this.parents[i] = i;
                // every region has rank = 0 (no children)
                this.ranks[i] = 0;
            }
        }

        getSize() : number {
            return this.size;
        }

        find(region: number) : number {
            var p = this.parents[region];
            if ( p  === region ) {
                return p;
            }
            else {
                return this.find( p );
            }
        }

        union(r1: number, r2: number) : void {
            if ( this.ranks[r1] > this.ranks[r2] ) {
                this.parents[r2] = r1;
            }
            else if ( this.ranks[r2] > this.ranks[r1] ) {
                this.parents[r1] = r2;
            }
            else {
                this.parents[r2] = r1;
                this.ranks[r1]++;
            }
        }

        rank(r: number) : number {
            return this.ranks[r];
        }

        parent(r: number) : number {
            return this.parents[r];
        }
    }

    setModule('DJSet', DJSet);
}
