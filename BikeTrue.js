// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Basic Pitch Detection
=== */

let audioContext;
let mic;
let pitch;
let pitchArray = [];
let pitchArr2;

function setup() {
  noCanvas();
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
}

function startPitch() {
  pitch = ml5.pitchDetection("./model/", audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  select("#status").html("Model Loaded");
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      select("#result").html(frequency);
      pitchArray.push(frequency);
      pitchArray = [frequency, ...pitchArray.slice(0, 5)];
      // console.log(pitchArray)
    } else {
      select("#result").html("No pitch detected");
    }
    median(pitchArray);
    console.log("median:" + median(pitchArray));
    getPitch();
  });
}

//Median function to increase accuracy in pitch retrieval
function median(pitchArray) {
  const sorted = Array.from(pitchArray).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}
