// captures image file on manual upload
function captureFileUpload() {
  var fileUpload = document.getElementById("file-upload");

  fileUpload.addEventListener("change", function() {
    getImagePath(this.files[0]);
  });

}

// captures image file on drag and drop
function captureDragDrop() {
  var dropZone = document.getElementById("drop-zone");

  dropZone.addEventListener("dragover", function(event) {
    dropZone.className = "drop-zone active";

    event.stopPropagation();
    event.preventDefault();

  });

  dropZone.addEventListener("drop", function(event) {
    dropZone.className = "drop-zone";

    event.stopPropagation();
    event.preventDefault();
    getImagePath(event.dataTransfer.files[0]);

  });

  dropZone.addEventListener("dragleave", function(event) {
    dropZone.className = "drop-zone";

  });

}

// gets local path to uploaded image file
function getImagePath(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    createImageElement(event.target.result)
  }

  reader.readAsDataURL(file);

}

// creates image element
function createImageElement(imageSrc) {
  var imageElement = new Image();

  imageElement.src = imageSrc;

  imageElement.onload = function () {
    sliceImage(imageElement);
  }
}

// draws image to canvas
function drawCanvas(image) {

  // context.drawImage(image, 0, 0);

  // if (document.querySelector("canvas") === null) {
  //   document.getElementById("app-wrapper").appendChild(canvas);
  //
  // } else {
  //   document.getElementById("app-wrapper").replaceChild(canvas, document.querySelector("canvas"));
  // }

  // sliceCanvas(canvas, context, image);

}

// slices images into tiles
function sliceImage(image) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  var numberOfColumns = image.width / TILE_WIDTH;
  var numberOfRows = image.height / TILE_HEIGHT;

  var slicedImages = [];

	canvas.width = TILE_WIDTH;
	canvas.height = TILE_HEIGHT;

  for (var column=0; column < numberOfColumns; column++) {

    for (var row=0; row < numberOfRows; row++) {
      var tile;

      context.drawImage(image, column * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 0, 0, TILE_WIDTH, TILE_HEIGHT);

      tile = {
        src: canvas.toDataURL(),
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        x: column * TILE_WIDTH,
        y: row * TILE_HEIGHT
      };

      slicedImages.push(tile);

    }

  }

  buildMosaic(slicedImages);

}

function buildMosaic(slicedImages) {

  for (var i=0; i < slicedImages.length; i++) {

    getAverageColour(slicedImages[i]);

  }

}

function getAverageColour(slicedImage) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var image = new Image();
  image.src = slicedImage.src;

  canvas.width = TILE_WIDTH;
  canvas.height = TILE_HEIGHT;

  context.drawImage(image, 0, 0);

  var rgbData = context.getImageData(0, 0, TILE_WIDTH, TILE_HEIGHT).data;

  var numberOfPixels = TILE_WIDTH * TILE_HEIGHT;

  var redSum = 0;
  var greenSum = 0;
  var blueSum = 0;

  var redValue;
  var greenValue;
  var blueValue;

  for (var i=0; i < rgbData.length; i+=4) {
    redSum = redSum + rgbData[i];
    greenSum = greenSum + rgbData[i+1];
    blueSum = blueSum + rgbData[i+2];

  }

  redValue = Math.floor(redSum / numberOfPixels);
  greenValue = Math.floor(greenSum / numberOfPixels);
  blueValue = Math.floor(blueSum / numberOfPixels);

  convertRgbToHex(redValue, greenValue, blueValue);

}

function convertRgbToHex(redValue, greenValue, blueValue) {
  var redHex = redValue.toString(16);
  var greenHex = greenValue.toString(16);
  var blueHex = blueValue.toString(16);

  var hexCode = [redHex.toString(), greenHex.toString(), blueHex.toString()];

  for (var i=0; i < hexCode.length; i++) {
    if (hexCode[i].split("").length === 1) {
      hexCode[i] = "0" + hexCode[i];
    }

  }

  displayTile(hexCode.join(""));

}

// fetches colour tile from server
function displayTile(colour) {
  var tile = new Image();
  tile.src = "/color/" + colour;

  document.getElementById("app-wrapper").appendChild(tile)

}

function drawMosaic(data) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  var DOMURL = window.URL || window.webkitURL || window;

  var image = new Image();
  var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  var url = DOMURL.createObjectURL(svg);

  image.onload = function() {
    context.drawImage(image, 0, 0);
    DOMURL.revokeObjectURL(url);

    document.getElementById("app-wrapper").appendChild(image);
  }

  image.src = url;

}

captureFileUpload();
captureDragDrop();
