
///////////////////////////////////////////////////////////
/////////////// PARAMETERS FOR KRUSKAL RM /////////////////
///////////////////////////////////////////////////////////
// TODO: get into the main website code
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


///////////////////////////////////////////////////////////
/////////////// WRITE MESSAGE TO INFO BOX /////////////////
///////////////////////////////////////////////////////////
var updateProgress = function(msg) {
    var time = new Date().getTime() - start;
    var time_msg = msg + " \t :\t " + time + "ms";
    console.log(time_msg);
    document.querySelector("#progress").textContent = time_msg;
};


///////////////////////////////////////////////////////////
////////////////// SET GLOBAL VARIABLES ///////////////////
///////////////////////////////////////////////////////////
var setGlobals = function() {
    // Image Canvas
    window.canvas = document.querySelector("#img_canvas");
    window.width = canvas.width;
    window.height = canvas.height;
    window.ctx = canvas.getContext('2d');
    window.img = ctx.getImageData(0, 0, width, height);
    // Region Canvas
    window.regionCanvas = document.querySelector("#region_canvas");
    window.rctx = regionCanvas.getContext('2d');
    window.rImg = rctx.getImageData(0, 0, width, height);
    // Delaunay Canvas
    window.delcan = document.querySelector("#delaunay_canvas");
    window.delctx = delcan.getContext('2d');
    // Data Structures
    window.vertices = [];
    window.vertices_map = {};
    window.triangles = [];
    window.outGraph = {};
    // Time
    window.start = new Date().getTime();
};


///////////////////////////////////////////////////////////
/////////////// IMAGE GRAYSCALE CONVERSION ////////////////
///////////////////////////////////////////////////////////
var demoGrayScale = function() {
    window.start = new Date().getTime();

    setGlobals();
    var gray = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var gray_array = gray.fillRgbaArray(img.data);

    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');

    ctx.putImageData(img, 0, 0);
};


///////////////////////////////////////////////////////////
/////////////// ADJACENCY LIST COMPUTATION ////////////////
///////////////////////////////////////////////////////////
var computeAdjacencyList = function() {
    delete window.grayImg;
    delete window.adj_list;

    var start = new Date().getTime();

    setGlobals();
    window.grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    window.adj_list = grayImg.computeAdjacencyList(true);

    var dims = adj_list.dim();
    console.log("Adjacency List dimensions: " + dims.d1 + ", " + dims.d2);
    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


///////////////////////////////////////////////////////////
////////////////// EDGE LIST COMPUTATION //////////////////
///////////////////////////////////////////////////////////
var computeEdgeList = function() {
    delete window.graph;
    
    var start = new Date().getTime();
    setGlobals();

    var grayImg = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var adj_list = grayImg.computeAdjacencyList(true);
    window.graph = new Graphs.Graph(adj_list);

    var time = new Date().getTime() - start;
    console.log('Execution time: ' + time + 'ms');
};


///////////////////////////////////////////////////////////
//////////// HOUSEKEEPING AND UI PREPARATION //////////////
///////////////////////////////////////////////////////////
var startGraphExtraction = function(algo) {
    delete window.grayImg;
    delete window.adj_list;
    delete window.graph;
    delete window.rMap;
    delete window.djs;

    setGlobals();

    rctx.clearRect(0, 0, width, height);
    delctx.clearRect(0, 0, width, height);
    document.querySelector("#region_canvas").style.backgroundImage = "url(/imgextract/images/loading.gif)";
    document.querySelector("#progress").textContent = "Processing Image... this might take some time...";

    // now figure out which algorithm to invoke... and go!
    var algoToExecute;
    switch (algo) {
        case "kruskalrm":   algoToExecute = kruskalRegionMerging;
                            break;
        case "watershed":   algoToExecute = watershed;
                            break; 
    }
    setTimeout(function() {

        // prepare the necessary datastructures
        // TODO: in the future this will be algorithm independent!!!
        prepareDataStructures();

        // execute Main Image Segmentation Algorithm
        // TODO: in the future, this will be handeled by a webworker
        algoToExecute();

        ///////////////////////////////////////////////////////////
        ///////// POSTPROCESSING AND UI, ALGO INDEPENDENT /////////
        ///////////////////////////////////////////////////////////
        // display the Label Map onto a canvas
        drawLabelMap();

        // we need the Delauney triangulation as precursor to the graph construction
        computeDelauney();

        // and draw it
        drawDelauney();

        // now let's construct the graph object and we're finished
        buildGraphObject();
    }, 50);
};


///////////////////////////////////////////////////////////
/////////////// DATASTRUCTURE PREPROCESSING ///////////////
///////////////////////////////////////////////////////////

// TODO: this function should be passed a configuration object
// so it can determine on its own which datastructures to compute
var prepareDataStructures = function() {
    window.grayImg = new Images.GrayImage(width, height, img.data);
    var msg = "Converted to Gray Image...";
    updateProgress(msg);

    window.adj_list = grayImg.computeAdjacencyList(true);
    msg = "Constructed Adjacency List...";
    updateProgress(msg);


    window.graph = new Graphs.Graph(adj_list, true); // sort the Edge List
    msg = "Instantiated original Graph...";
    updateProgress(msg);

    window.rMap = new Regions.RegionMap(width, height, grayImg);
    window.djs = new DJSet.DisjointSet(width * height);
    msg = "Constructed Region Map...\n STARTING REGION MERGING...";
    updateProgress(msg);
};


///////////////////////////////////////////////////////////
//////////// KRUSKAL REGION MERGING ALGORITHM /////////////
///////////////////////////////////////////////////////////
var kruskalRegionMerging = function() {
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
    msg = "Merged " + mergers + " regions... \n" + nr_regions + " regions remain.";
    updateProgress(msg);
};


///////////////////////////////////////////////////////////
///////////////// DRAWING THE LABEL MAP ///////////////////
///////////////////////////////////////////////////////////
var drawLabelMap = function() {
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

    // remove Spinner image
    document.querySelector("#region_canvas").style.backgroundImage = null;
    rctx.putImageData(rImg, 0, 0);
};


///////////////////////////////////////////////////////////
///////////////// DELAUNEY TRIANGULATION //////////////////
///////////////////////////////////////////////////////////
var computeDelauney = function() {
    ///////////////////////////////////////////////////////////
    /////// PREPARE VERTICES DATASTRUCTURE FOR DELAUNEY ///////
    ///////////////////////////////////////////////////////////
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

    msg = "Regions vary in size from: " + minSize + " to " + maxSize + " pixels\n" +
        "There are: " + belowThreshold + " regions below the size threshold of " + threshold;
    updateProgress(msg);


    ///////////////////////////////////////////////////////////
    /////////////////// EXECUTE DELAUNEY //////////////////////
    ///////////////////////////////////////////////////////////
    triangles = Delaunay.triangulate( vertices );
};


///////////////////////////////////////////////////////////
////////////////// DRAW DELAUNEY TO UI ////////////////////
///////////////////////////////////////////////////////////
var drawDelauney = function() {
    delctx.clearRect(0, 0, canvas.width, canvas.height);
    for(i = triangles.length; i; ) {
        delctx.beginPath();
        --i; delctx.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
        --i; delctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
        --i; delctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
        delctx.closePath();
        delctx.stroke();
    }
};


///////////////////////////////////////////////////////////
/////////////// BUILDING THE GRAPH OBJECT /////////////////
///////////////////////////////////////////////////////////
var buildGraphObject = function() {
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

    document.querySelector("#img_regions .value").textContent = vertices.length;
    msg = "Graph with " + vertices.length + " vertices constructed! FINISHED in ";
    updateProgress(msg);
};