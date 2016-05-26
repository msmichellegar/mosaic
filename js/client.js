
// captures image file on upload
function captureFile() {
  var fileUpload = document.getElementById("file-upload");

  fileUpload.addEventListener("change", function() {
    getImagePath(this.files[0]);
  });

}

// gets local path to uploaded image file
function getImagePath(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    return event.target.result;
  }

  reader.readAsDataURL(file);
}

// fetches tile from server
function getTile(color) {
  var request = new XMLHttpRequest();

  request.open('GET', '/color/' + color);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        // console.log(data);

    }
  };

  request.send();

}

captureFile();
