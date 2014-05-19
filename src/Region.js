/// <reference path="../tsrefs/node.d.ts" />
/// <reference path="./Helper.ts" />
/// <reference path="./Matrix.ts" />

var M2D = Matrix.Matrix2D;

var Regions;
(function (Regions) {
    var RegionMap = (function () {
        function RegionMap(width, height, img) {
            this.regions = {};
            this.labels = new M2D(width, height);
            var arr = this.labels.getArray();
            var img_arr = img.getArray();
            var x, y, region;

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = i;
                region = new Region(i);

                // TODO outsource this to region class in some meaningful way
                region.size = 1;
                region.avg_color = img_arr[i];
                x = i % width;
                y = (i / width) | 0;
                region.pixels.push([x, y, img_arr[i]]);
                this.regions[i] = region;
            }
        }
        RegionMap.prototype.merge = function (r1, r2, e) {
            // define which region to merge into the other
            // var p = r1;
            // Set new internal maxMST
            r1.maxMST = e.w;

            // Set new avg color (as integer)
            r1.avg_color = ((r1.avg_color * r1.size + r2.avg_color * r2.size) / (r1.size + r2.size)) | 0;

            var sum_size = r1.size + r2.size;

            // Set the centroid and update the size (we assume 2D centroids)
            r1.centroid[0] = (r1.centroid[0] * r1.size + r2.centroid[0] + r2.size) / sum_size;
            r1.centroid[1] = (r1.centroid[1] * r1.size + r2.centroid[1] + r2.size) / sum_size;

            r1.size = sum_size;

            // join sets
            // set all labels to the new region label
            var px;
            for (var i = 0; i < r2.pixels.length; ++i) {
                px = r2.pixels[i];
                this.labels.set(px[0], px[1], r1.id);
            }
            // delete the merged region
            // delete this.regions[r2.id];
        };

        RegionMap.prototype.getRegion = function (px) {
            var key = this.labels.get(px[0], px[1]);
            return this.regions[key];
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
