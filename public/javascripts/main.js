const audioCtx = new AudioContext();
const audioElement = document.querySelector('audio');
const track = audioCtx.createMediaElementSource(audioElement);
const analyser = audioCtx.createAnalyser();

track.connect(analyser);
analyser.connect(audioCtx.destination);

document.onclick = function () {
  if (audioElement.paused) {
    audioElement.play();
    audioCtx.resume();
  } else {
    audioElement.pause();
  }
}

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// draw an oscilloscope of the current audio source

function draw() {

  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "black";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 136, 255)";

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

draw();
