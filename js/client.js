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
    createImageElement(event.target.result);
  };

  reader.readAsDataURL(file);

}

// creates image element
function createImageElement(imageSrc) {
  var imageElement = new Image();
  var scaledImage;

  imageElement.src = imageSrc;

  scaledImage = scaleImage(imageElement);

  imageElement.onload = function () {
    sliceImage(scaledImage);
  };
}

function scaleImage(image) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var MAX_WIDTH = 700;
  var MAX_HEIGHT = 600;
  var width = image.width;
  var height = image.height;

  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);

  return ctx;

}

// slices images into tiles
function sliceImage(context) {
  var image = new Image();
  image.src = context.canvas.toDataURL();

  var originalCanvas = document.getElementById("canvas");

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  var numberOfColumns = image.width / TILE_WIDTH;
  var numberOfRows = image.height / TILE_HEIGHT;

  var slicedImages = [];

  originalCanvas.height = image.height + 20;
  originalCanvas.width = image.width + 20;

	canvas.width = TILE_WIDTH;
	canvas.height = TILE_HEIGHT;

  for (var row=0; row < numberOfRows; row++) {

    for (var column=0; column < numberOfColumns; column++) {
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
    var averageColour = getAverageColour(slicedImages[i]);

    displayTile(averageColour, slicedImages[i]);

  }

}

// gets average colour of the tile
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

  var hexColour = convertRgbToHex(redValue, greenValue, blueValue);

  return hexColour;

}

// converts rgb value to hex code
function convertRgbToHex(redValue, greenValue, blueValue, slicedImage) {
  var redHex = redValue.toString(16);
  var greenHex = greenValue.toString(16);
  var blueHex = blueValue.toString(16);

  var hexCode = [redHex.toString(), greenHex.toString(), blueHex.toString()];

  for (var i=0; i < hexCode.length; i++) {
    if (hexCode[i].split("").length === 1) {
      hexCode[i] = "0" + hexCode[i];
    }

    if (i === hexCode.length -1) {
      return hexCode.join("");
    }

  }

}

// draws colour tile to canvas
function displayTile(colour, slicedImage) {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var tile = new Image();
  tile.src = "/color/" + colour;

  tile.onload = function() {

      context.drawImage(tile, slicedImage.x, slicedImage.y, TILE_WIDTH, TILE_HEIGHT);

  };

}

captureFileUpload();
captureDragDrop();
