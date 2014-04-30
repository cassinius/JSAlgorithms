
var demoGrayScale = function() {
    var canvas = document.querySelector("#img_canvas");
    var ctx = canvas.getContext('2d');
    var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var gray = new Images.GrayImage(canvas.width, canvas.height, img.data);
    var gray_array = gray.fillRgbaArray(img.data);
    ctx.putImageData(img, 0, 0);
};