if( typeof window !== 'undefined' && window !== null) {
    var k_thres = document.querySelector("#k-threshold").value;
    window.k = k_thres;
    document.querySelector("#k-threshold-info").textContent = k_thres;

    var size_thres = document.querySelector("#size-threshold").value;
    window.threshold = size_thres;
    document.querySelector("#size-threshold-info").textContent = size_thres;

    var region_max_merge_size = document.querySelector("#max-merge").value;
    window.region_max_merge_size = region_max_merge_size;
    document.querySelector("#max-merge-info").textContent = region_max_merge_size;
}

var getGlobals = function() {
    window.canvas = document.querySelector("#img_canvas");
    window.ctx = canvas.getContext('2d');
    window.img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    window.vertices = [];
    window.vertices_map = {};
    window.triangles = [];

    window.regionCanvas = document.querySelector("#region_canvas");
    window.rctx = regionCanvas.getContext('2d');
    window.rImg = rctx.getImageData(0, 0, canvas.width, canvas.height);

    window.delcan = document.querySelector("#delaunay_canvas");
    window.delctx = delcan.getContext('2d');

    window.outGraph = {};
};


var demoGrayScale = function() {
    var start = new Date().getTime();

    getGlobals();
    var gray = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var gray_array = gray.fillRgbaArray(img.data);

    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');

    ctx.putImageData(img, 0, 0);
};


var demoAdjacencyList = function() {
    delete window.grayImg;
    delete window.adj_list;

    var start = new Date().getTime();

    getGlobals();
    window.grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    window.adj_list = grayImg.computeAdjacencyList(true);

    var dims = adj_list.dim();
    console.log("Adjacency List dimensions: " + dims.d1 + ", " + dims.d2);
    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


var demoEdgeListComputation = function() {
    delete window.graph;
    
    var start = new Date().getTime();
    getGlobals();

    var grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var adj_list = grayImg.computeAdjacencyList(true);
    window.graph = new Graphs.Graph(adj_list);

    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


var demoRegionMerging = function() {
    delete window.grayImg;
    delete window.adj_list;
    delete window.graph;
    delete window.rMap;
    delete window.djs;

    var start = new Date().getTime();
    getGlobals();
    var width = canvas.width,
        height = canvas.height;

    window.grayImg = new Images.GrayImage(width, height, img.data);
    var time = new Date().getTime() - start;
    console.log("Converted to Gray Image... in " + time + 'ms');

    window.adj_list = grayImg.computeAdjacencyList(true);
    time = new Date().getTime() - start;
    console.log("Constructed Adjacency List...  in " + time + 'ms');

    window.graph = new Graphs.Graph(adj_list, true); // sort the Edge List
    time = new Date().getTime() - start;
    console.log("Instantiated original Graph... in " + time + 'ms');

    window.rMap = new Regions.RegionMap(width, height, grayImg);
    window.djs = new DJSet.DisjointSet(width * height);
    time = new Date().getTime() - start;
    console.log("Constructed Region Map... in " + time + 'ms');

    var edges = graph.edge_list,
        px_i,                       // Pixel i (as index)
        px_j,                       // Pixel j (as index)
        r1,                         // Region i (as number)
        r2,                         // Region j (as number)
        ro1,                        // Region object 1
        ro2,                        // Region object 2
        e,                          // current edge
        tau1,                       // tau value for r1
        tau2,                       // tau value for r2
        mInt,                       // min internal diff r1 - r2
        mergers = 0;                // amount of merged regions

    console.log("STARTING REGION MERGING...");
    for( var i = 0; i < edges.length; ++i ) {
        e = edges[i];
        px_i = grayImg.getPixelIndex(e.p1[0], e.p1[1]);
        px_j = grayImg.getPixelIndex(e.p2[0], e.p2[1]);
        r1 = djs.find(px_i);
        r2 = djs.find(px_j);

        // get regions to compute diff values
        ro1 = rMap.getRegionByIndex( r1 );
        ro2 = rMap.getRegionByIndex( r2 );

        if ( r1 === r2 || ro1.size + ro2.size > region_max_merge_size ) {
            // already merged those regions => edge would introduce cycle...
            continue;
        }

        tau1 = k / ro1.size;
        tau2 = k / ro2.size;
        mInt = Math.min(ro1.maxEdge + tau1, ro2.maxEdge + tau2);

        if( mInt > e.w ) {
            djs.union(r1, r2); // will automatically merge into the larger region

            // which region to merge into the other? => rank
            if ( djs.rank(r1) > djs.rank(r2) ) {
                rMap.merge(ro1, ro2, e);
            }
            else {
                rMap.merge(ro2, ro1, e);
            }
            ++mergers;
        }
    }
    var nr_regions = width * height - mergers;

    time = new Date().getTime() - start;
    console.log("Merged " + mergers + " regions... in " + time + 'ms');
    console.log( nr_regions + " regions remain.");


    for (i = 0; i < width * height * 4; i += 4) {
        var region = rMap.getRegionByIndex( djs.find(i / 4) );

        if ( region.size < threshold ) {
            rImg.data[i] = 255;
            rImg.data[i+1] = 255;
            rImg.data[i+2] = 255;
            rImg.data[i+3] = 255;
            continue;
        }

        if ( region.labelColor.length !== 3) {
            region.labelColor[0] = ( ( Math.random() * 256 ) | 0 ); //  - 64 * (i % 4)
            region.labelColor[1] = ( ( Math.random() * 256 ) | 0 );
            region.labelColor[2] = ( ( Math.random() * 256 ) | 0 );
        }
        rImg.data[i] = region.labelColor[0];
        rImg.data[i+1] = region.labelColor[1];
        rImg.data[i+2] = region.labelColor[2];
        rImg.data[i+3] = 255;
    }

    rctx.putImageData(rImg, 0, 0);

    var regKeys = Object.keys(rMap.regions);
    var minSize = Number.POSITIVE_INFINITY,
        maxSize = Number.NEGATIVE_INFINITY,
        belowThreshold = 0,
        r,
        coords,
        vert_idx = 0;

    for (i = 0; i < regKeys.length; ++i) {
        r = rMap.regions[regKeys[i]];
        minSize = minSize > r.size ? r.size : minSize;
        maxSize = maxSize < r.size ? r.size : maxSize;
        if (!r.deleted && r.size < threshold) {
            ++belowThreshold;
        }
        else if (!r.deleted && r.size >= threshold) {
            coords = [r.centroid[0] | 0, r.centroid[1] | 0];
            vertices[vert_idx] = coords;
            vertices_map[vert_idx++] = r;
        }
    }

    console.log("Regions vary in size from: " + minSize + " to " + maxSize + " pixels");
    console.log("There are: " + belowThreshold + " regions below the size threshold of " + threshold);

    // Now for the Delauney
    triangles = Delaunay.triangulate( vertices );
    delctx.clearRect(0, 0, canvas.width, canvas.height);

    for(i = triangles.length; i; ) {
        delctx.beginPath();
        --i; delctx.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
        --i; delctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
        --i; delctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
        delctx.closePath();
        delctx.stroke();
    }

    var region;
    var tri;
    for( i = 0; i < triangles.length - 1; ) {
        tri = triangles[i];
        region = vertices_map[tri];
        if ( typeof outGraph[tri] === 'undefined' ) {
            outGraph[tri] = {
                node: tri,
                coords: {
                    x: region.centroid[0],
                    y: region.centroid[1],
                    z: region.avg_color
                },
                features: {},
                edges: []
            };
        }

        // we already got that node, just add the next edge
        outGraph[tri].edges.push(triangles[++i]);
    }

};

