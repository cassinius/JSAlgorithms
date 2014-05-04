var getGlobals = function() {
    window.canvas = document.querySelector("#img_canvas");
    window.ctx = canvas.getContext('2d');
    window.img = ctx.getImageData(0, 0, canvas.width, canvas.height);
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