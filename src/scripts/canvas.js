function Canvas2D() {
    this.canvas = document.getElementById("main-canvas");
    this.context = this.canvas.getContext('2d');
    this.originalImage = null;
}

/**
 * Updates the originalImage with the uploaded image file.
 */
Canvas2D.prototype.updateImage = function () {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        loadImage(reader.result);
    }, false);
    reader.readAsDataURL(document.getElementById("img-loader").files[0]);
}

/**
 * Resizes the canvas with the given width and height values.
 * @param {number} width 
 * @param {number} height 
 */
Canvas2D.prototype.resize = function (width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.drawImage();
}

/**
 * Draws the originalImage on the canvas and then applies the chosen filter to it.
 */
Canvas2D.prototype.drawImage = function () {
    if (this.originalImage != null) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var or = this.originalImage.width / this.originalImage.height;
        var cr = this.canvas.width / this.canvas.height;
        var sw = or > cr ? this.canvas.width : this.canvas.height * or;
        var sh = or > cr ? this.canvas.width / or : this.canvas.height;
        this.context.drawImage(this.originalImage, (this.canvas.width - sw) / 2, (this.canvas.height - sh) / 2, sw, sh);
        var imageData = this.context.getImageData((this.canvas.width - sw) / 2, (this.canvas.height - sh) / 2, sw, sh);
        var filter = document.getElementById("filter-select");
        imageData.filter(filter.options[filter.selectedIndex].value);
        imageData.fixBit(document.getElementById("bit-depth").value, document.getElementById("dithering-algo").value);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.putImageData(imageData, (this.canvas.width - sw) / 2, (this.canvas.height - sh) / 2);
    }
}

/**
 * Loads the originalImage. If image data is not provided, loads the sample image.
 * @param {string} data 
 */
function loadImage(data = null) {
    var image = new Image();
    image.onerror = function () {
        alert("Failed to load the image file.");
    }
    image.onload = function () {
        image.crossOrigin = "Anonymous";
        Canvas.originalImage = image;
        Canvas.drawImage();
    }
    if (data != null)
        image.src = data;
    else {
        image.src = `./src/images/${document.getElementById("sample-image-select").value}.jpg`;
        // image.src = `https://raw.githubusercontent.com/biarmic/image-processor-js/main/src/images/${document.getElementById("sample-image-select").value}.jpg`; // To test in localhost without dealing with CORS
    }
    return image;
}

let Canvas = new Canvas2D();