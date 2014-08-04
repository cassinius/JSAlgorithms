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
    window.labelmap = [];
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
//////////////// WATERSHED TRANSFORMATION /////////////////
///////////////////////////////////////////////////////////
var watershed = function() {
    var step1 = function(p) {
      if (v[p] != 1)  {
        var nbs = al[p];
        for (var i = 0; i < nbs.length; ++i) {
          if (nbs[i][2] < f[p]) {
            v[p] = 1;
          }
        }
      }
    };

    var step2 = function(p) {
      var changed = 0;
      if (v[p] != 1)  {
        var min = vmax;
        var nbs = al[p];
        
        for (var i = 0; i < nbs.length; ++i) {
          var n_i = grayImg.getPixelIndex(nbs[i][0], nbs[i][1]);
          if (f[n_i] == f[p] && v[n_i] > 0 && v[n_i] < min) {
            min = v[n_i];
          }
        }
        
        if ( min != vmax && v[p] != min+1) {
          v[p] = min+1;
          changed = 1;
        }
      }
      return changed;
    };

    var step3 = function(p) {
      var lmin = lmax,
          fmin = f[p],
          nbs = al[p],
          changed = 0,
          n_i = 0,
          i = 0;
          
      if (v[p] == 0) {
        for (i = 0; i < nbs.length; ++i) {
          n_i = grayImg.getPixelIndex(nbs[i][0], nbs[i][1]);
          if (f[n_i] == f[p] && l[n_i] > 0 && l[n_i] < lmin) {
            lmin = l[n_i];
          }
        }
        if (lmin == lmax && l[p] == 0) {
          lmin = ++new_label;
          numb_regions++;
        }    
      }
      else if (v[p] == 1) {
        for (i = 0; i < nbs.length; ++i) {
          n_i = grayImg.getPixelIndex(nbs[i][0], nbs[i][1]);
          if (f[n_i] < fmin) {
            fmin = f[n_i];
          }
        }
        for (var i = 0; i < nbs.length; ++i) {
          n_i = grayImg.getPixelIndex(nbs[i][0], nbs[i][1]);
          if (f[n_i] == fmin && l[n_i] > 0 && l[n_i] < lmin) {
            lmin = l[n_i];
          }
        }
      }
      else {
        for (i = 0; i < nbs.length; ++i) {
          n_i = grayImg.getPixelIndex(nbs[i][0], nbs[i][1]);
          if (f[n_i] == f[p] && v[n_i] == v[p]-1 && l[n_i] > 0 && l[n_i] < lmin) {
            lmin = l[n_i];
          }
        }
      }
      if (lmin != lmax && lmin != l[p]) { 
        l[p] = lmin;
        changed = 1;
      }
      return changed;
    };


    window.grayImg = new Images.GrayImage(width, height, img.data);
    var msg = "Converted to Gray Image...";
    updateProgress(msg);
    
    window.adj_list = grayImg.computeAdjacencyList();
    msg = "Constructed Adjacency List...";
    updateProgress(msg);

    window.f = grayImg.getArray();
    window.v = [];
    window.l = [];
    window.al = adj_list.getArray();
    window.vmax = width + height;
    window.lmax = window.l_thres;
    window.new_label = 0;
    window.numb_regions = 0;
       
    var i = width*height,
        scan_step2 = 1,
        scan_step3 = 1,
        p;                 
        
    while(i) {
      v[--i] = 0;
      l[i] = 0;
    }
    
    for( p = 0; p < width*height; ++p) {
        step1(p);
    }
    while(scan_step2) {
      scan_step2 = 0;
      for( p = 0; p < width*height; ++p) {
        if(step2(p)) {
          scan_step2 = 1;
        }
      }
      if(scan_step2) {
        scan_step2 = 0;
        for( p = width*height; p;) {
          if(step2(--p)) {
          scan_step2 = 1;
          }
        }
      }
   }
   while(scan_step3) {
     scan_step3 = 0;
     for( p = 0; p < width*height; ++p) {
       if(step3(p) == 1) {
         scan_step3 = 1;
       }
     }
     if(scan_step3) {
       scan_step3 = 0;
       for( p = width*height; p;) {   
         if(step3(--p) == 1) {
           scan_step3 = 1;
         }
       }
     }     
   }

   window.rMap = new Regions.RegionMap(width, height, grayImg);
   console.log("computing rMap");

   window.labelmap = l;
   var r, orig_region, x, y;
   var img_arr = grayImg.getArray();

   for ( var i = 0; i < labelmap.length; ++i ) {
        if ( labelmap[i] !== i ) { // original region merged into another
            r = rMap.getRegionByIndex( labelmap[i] );           
            // Set new avg color (as integer)
            r.avg_color = ( ( r.avg_color * r.size + img_arr[i] ) / ( r.size + 1 ) ) | 0;            
            // Set new centroid
            x = i % width >>> 0;
            y = (i / width) >>> 0;
            r.centroid[0] = ( r.centroid[0] * r.size + x ) / ( r.size + 1 );
            r.centroid[1] = ( r.centroid[1] * r.size + y ) / ( r.size + 1 );
            r.size++;

            // set original region to deleted
            // rMap.getRegionByIndex( i ).deleted = true;
        }
   }

    // set the right size threshold parameter
    window.size_threshold = window.ws_size_threshold;
};



///////////////////////////////////////////////////////////
//////////// KRUSKAL REGION MERGING ALGORITHM /////////////
///////////////////////////////////////////////////////////
var kruskalRegionMerging = function() {
    // prepare the necessary datastructures
    // TODO: in the future this will be algorithm independent!!!
    prepareDataStructures();


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

    // set the right size threshold parameter
    window.size_threshold = window.rm_size_threshold;

    // compute label array from disjoint set forest
    for( var i = 0; i < djs.size; ++i ) {
        window.labelmap[i] = djs.find(i);
    }
};


///////////////////////////////////////////////////////////
///////////////// DRAWING THE LABEL MAP ///////////////////
///////////////////////////////////////////////////////////
var drawLabelMap = function() {
    for (i = 0; i < width * height * 4; ) {
        var region = rMap.getRegionByIndex( labelmap[i / 4] );

        if ( region.size < window.size_threshold ) {
            rImg.data[i++] = 255;
            rImg.data[i++] = 255;
            rImg.data[i++] = 255;
            rImg.data[i++] = 255;
            continue;
        }

        if ( region.labelColor.length !== 3) {
            region.labelColor[0] = ( ( Math.random() * 256 ) | 0 );
            region.labelColor[1] = ( ( Math.random() * 256 ) | 0 );
            region.labelColor[2] = ( ( Math.random() * 256 ) | 0 );
        }
        rImg.data[i++] = region.labelColor[0];
        rImg.data[i++] = region.labelColor[1];
        rImg.data[i++] = region.labelColor[2];
        rImg.data[i++] = 255;
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
        if (!r.deleted && r.size < size_threshold) {
            ++belowThreshold;
        }
        else if (!r.deleted && r.size >= size_threshold) {
            coords = [ r.centroid[0], r.centroid[1] ];
            vertices[vert_idx] = coords;
            vertices_map[vert_idx++] = r;
        }
    }

    msg = "Regions vary in size from: " + minSize + " to " + maxSize + " pixels\n" +
        "There are: " + belowThreshold + " regions below the size threshold of " + window.size_threshold;
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