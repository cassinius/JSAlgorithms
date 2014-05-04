/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />
/// <reference path="./Images.ts" />
/// <reference path="./Graphs.ts" />

var M2D = Matrix.Matrix2D;

var Regions;
(function (Regions) {
    var RegionMap = (function () {
        function RegionMap(width, height, img) {
            this.labels = null;
            this.regions = {};
            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                this.regions[i] = new Region(i);

                // TODO compute the right conversion
                this.regions[i].pixels.push([img_arr[i]]);
            }
        }
        // we merge r2 into r1
        RegionMap.prototype.merge = function (r1, r2, e) {
            // Set new internal maxMST
            r1.maxMST = e.w;

            // Set new avg color (as integer)
            r1.avg_color = ((r1.avg_color * r1.size + r2.avg_color * r2.size) / (r1.size + r2.size)) | 0;

            // Set the centroid (TODO implement later ;))
            // Update size
            r1.size += r2.size;

            // set all other labels to meeeee !
            var px;
            for (var i = 0; i < r2.pixels.length; ++i) {
                px = r2[i];
                this.labels.set(px[0], px[1], r1.id);
            }
        };
        return RegionMap;
    })();
    Regions.RegionMap = RegionMap;

    var Region = (function () {
        function Region(id) {
            this.id = id;
            // TODO WHY OH WHY IS THE TYPE SYSTEM SO SHY ???
            this.size = 0;
            this.avg_color = 0;
            this.centroid = null;
            this.maxMST = 0;
            this.pixels = [];
        }
        return Region;
    })();
    Regions.Region = Region;

    setModule('Regions', Regions);
})(Regions || (Regions = {}));
