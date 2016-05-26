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
    event.stopPropagation();
    event.preventDefault();

    dropZone.className = "drop-zone active";

  });

  dropZone.addEventListener("drop", function(event) {
    event.stopPropagation();
    event.preventDefault();

    dropZone.className = "drop-zone";

    getImagePath(event.dataTransfer.files[0]);

  });

}

// gets local path to uploaded image file
function getImagePath(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    drawCanvas(event.target.result)
  }

  reader.readAsDataURL(file);

}

// draws image to canvas
function drawCanvas(imageSrc) {
  var canvas = document.getElementById("image-canvas");
  var ctx = canvas.getContext("2d");

  var img = new Image();
  img.src = imageSrc;

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  }

}

// fetches colour tile from server
function getTile(color) {
  var request = new XMLHttpRequest();

  request.open('GET', '/color/' + color);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

    }
  };

  request.send();

}

captureFileUpload();
captureDragDrop();
