import * as d3 from 'd3';
import { formatCanvas, formatPush, annotationBar } from './canvas';
import { toggleMagic } from './sidebar';
import { checkDatabase } from './firebaseStuff';
import * as firebase from 'firebase';
import { mouse, select } from 'd3';

const shapeArray = [];
var startButton;
var canvas;
var context;
var video;
var canPlay;
var applyEffect;

export var playing;

var currentImageData = {};
var currentColorCodes = [];

let purpArray = [];
let yellowArray = [];
let greenArray = [];
let mintArray = [];
let orangeArray = [];
let redArray = [];
let blackArray = [];
let blueArray = [];
let tealArray = [];

var video;
var video2;
var size;

const getColorCode = [];

export function formatVidPlayer(div, videoPath, secondVidPath){

  const playButton = document.getElementById('play');

  let videoSelection = d3.select(div).select('video');
  videoSelection.attr('id', 'video');

  let src = videoSelection.append('source');
  src.attr('src', videoPath);
  src.attr('type', "video/mp4");

  video = videoSelection.node();
  video.muted = true;

  video.oncanplay = function(){

    if (video.readyState >= 3) {

      readyToPlay(video2);
  
      if(secondVidPath){
        video2 = document.createElement('video');
        video2.src = secondVidPath;
        video2.id = 'context-map';
        video2.muted = true;
        video2.autoplay = true;
    
        resizeStuff(video2);
     
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
    
        context.drawImage(video2, 0, 0);
    
        // var _data = context.getImageData(0, 0, document.getElementById('video').getBoundingClientRect().width, document.getElementById('video').getBoundingClientRect().height)
    
        var _data = context.getImageData(0, 0, size.width, size.height)
    
        currentImageData.data = _data.data;
        currentImageData.width = _data.width;
        currentImageData.height = _data.height;
    
        context.putImageData(_data, 0, 0);
    
    
      }else{
        resizeStuff();
      }
  
    } else {
      video.addEventListener('canplay', readyToPlay(video2));
    }
    
    playButton.addEventListener('click', function () {
  
      if(togglePlay()) {
        video.pause();
        video2.pause();
        drawFrameOnPause(d3.select('#context-map').node());
      }else{
        video.play();
        video2.play();
        context.clearRect(0, 0, canvas.width, canvas.height);
       
    
      }
  
    });
  
    customControls(video);
  
    // create a tooltip
    var tooltip = d3.select('#main-wrap').append('div');
    tooltip.style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");
  
    return playing;
  }


  }

function colorChecker(code){
  if((code[0] + code[1] + code[2]) === 0){
    return 'black';
  }else if(code[0]<14 && code[1] > 142 && code[1] < 199 && code[2] > 142 && code[2] < 147){
    // tealArray.push(code);
     return 'teal';
  }else if(code[2] > 70 && code[0] < 100 && code[2] > code[0] && code[2] > code[1]){
    //blueArray.push(code)
    return 'blue';
  }else if(code[2] > 70 && code[0] > 100 && code[2] > code[0] && code[2] > code[1]){
    //purpArray.push(code);
    return 'purple';
  }else if(code[2] < 70 && code[0] > 200 && code[2] < code[0] && code[1] < code[0] && code[1] < 80){
   // redArray.push(code);
    return 'red';
  }else if(code[2] < 70 && code[0] > 50 && code[2] < code[0] && code[1] < code[0] && code[1] > 80){
   // orangeArray.push(code);
    return 'orange';
  }else if(code[1] > code[2] && code[1] > code[0] && code[2] > 49 && code[2] > 110 && code[0] < 120 && code[1] > 200){
   // mintArray.push(code);
    return 'mint';
  }else if(code[1] > code[2] && code[1]> code[0] && code[2] > 49 && code[0] < 120 && code[0] < 220){
   // greenArray.push(code);
    return 'green';
  }else if(code[1] > code[2] && code[1] > 200 && code[0] > 220){
   // yellowArray.push(code);
    return 'yellow';
  }else if(code[0] > 220 && code[1] > 220 && code[2] > 220){
    return 'white';
  }else{
    //blackArray.push(code);
    return 'unknown';
  }

}

function make2DArray(dat, hoverColor){

  let newData = Object.assign({}, dat);
  newData.data = Uint8ClampedArray.from([...dat.data])

    for(let i = 0; i < newData.data.length; i = i + 4){
      
      let end = i + 4;
      let snip = newData.data.slice(i, end);
      let color = colorChecker(snip);

      if(color != hoverColor){
        newData.data[i] = 255;
        newData.data[i + 1] = 255;
        newData.data[i + 2] = 255;
        newData.data[i + 3] = 150;
      }else if(color === hoverColor){
        newData.data[i + 3] = 0;
      }
    }

    const myimg = new ImageData(newData.data, dat.width, dat.height);
    context.putImageData(myimg, 0, 0);

}

const getColorIndicesForCoord = (x, y, width) => {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

export function readyToPlay(secondVid) {

  // Set the canvas the same width and height of the video
  // canvas.width = Math.round(video.videoWidth);
  // canvas.height = video.videoHeight;

  if(secondVid){

    d3.select('#interaction').node().width = Math.round(video.videoWidth)+'px';
    d3.select('#interaction').node().style.height = d3.select('#canvas').style('height');
  
    canPlay = true;
  }
  
}

function drawFrame(video) {

  context.drawImage(video, 0, 0);

  var _data = context.getImageData(0, 0, video.getBoundingClientRect().width, video.getBoundingClientRect().height)
  currentImageData.data = _data.data;
  currentImageData.width = _data.width;
  currentImageData.height = _data.height;

  setTimeout(function () {
   if(playing){
    drawFrame(video);
   }
   
  }, 3);

}

function drawFrameOnPause() {

    // video2.pause();
  video2.currentTime = video.currentTime;
 
  let pullFrame = Math.floor((video.currentTime) * 30);
  let pathImg = './public/imgStack/meshAll.';

  console.log(pathImg + pullFrame + '.png');

    //The path to the image that we want to add.
  var imgPath = pathImg + pullFrame + '.png';
  
  //Create a new Image object.
  var imgObj = new Image();
  
  //Set the src of this Image object.
  imgObj.src = imgPath;
  
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  imgObj.onload = function() {
    context.drawImage(imgObj, 0, 0);
  
    var _data = context.getImageData(0, 0, size.width, size.height);
    currentImageData.data = _data.data;
    currentImageData.width = _data.width;
    currentImageData.height = _data.height;

    context.putImageData(_data, 0, 0);

    // let dataKeeper = []

    // let greenK = [];
    // let mintK = [];
    // let redK = [];
    // let purpleK = [];
    // let orangeK = [];
    // let tealK = [];
    // let blueK = [];
    // let yellK = [];

//     for(let i = 0; i < _data.data.length; i += 4){
//    // for(let i = 0; i < 200; i += 4){
//       let color = colorChecker(_data.data.slice(i, i+4))
//       dataKeeper.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       if(color === 'green'){
//         greenK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'mint'){
//         mintK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'red'){
//         redK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'purple'){
//         purpleK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'orange'){
//         orangeK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'teal'){
//         tealK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'blue'){
//         blueK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }else if(color === 'yellow'){
//         yellK.push(String(_data.data[i] +','+ _data.data[i+1]+','+ _data.data[i+2]+','+ _data.data[i+3]));
//       }
      
//     }
//     console.log('green', Array.from(new Set(greenK)));
//     console.log('mint', Array.from(new Set(mintK)));
//     console.log('red', Array.from(new Set(redK)));
//     console.log('purple', Array.from(new Set(purpleK)));
//     console.log('orange', Array.from(new Set(orangeK)));
//     console.log('teal', Array.from(new Set(tealK)));
//     console.log('blue', Array.from(new Set(blueK)));
//     console.log('yellow', Array.from(new Set(yellK)));



  };

  
}

export function mouseMoveVideo(coord){

      if(isPlaying()){
        console.log('videoPlaying');
      }else{


        const colorIndices = getColorIndicesForCoord(Math.round(coord[0]), (coord[1]), currentImageData.width);

        const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
  
        var redForCoord = currentImageData.data[redIndex];
        var greenForCoord = currentImageData.data[greenIndex];
        var blueForCoord = currentImageData.data[blueIndex];
        var alphaForCoord = currentImageData.data[alphaIndex];
        var new_rgb = 'rgba(' + redForCoord +","+ greenForCoord +","+ blueForCoord +', 1.0)';



        let body = d3.select('body').node();
        body.style.background = new_rgb;

       let snip = colorChecker([redForCoord, greenForCoord, blueForCoord, alphaForCoord]);

       console.log(snip, new_rgb, currentImageData);
  
        if(snip != currentColorCodes[currentColorCodes.length - 1] && !playing && snip != "black" && snip != "white"){
         // currentColorCodes.push(snip);
          //make2DArray(currentImageData, snip);
    
          d3.select('.tooltip')
            .style('position', 'absolute')
            .style("opacity", 1)
            .html(`${snip} stucture: <br>
            Number of associated annotations go here. <br>
            Certainty level also shown here.
            `)
            .style("left", (coord[0]+ 200) + "px")
            .style("top", (coord[1]) + "px")
    
        }else if(snip === "black" || snip === "white"){
          d3.select('.tooltip').style("opacity", 0);
         
          const myimg = new ImageData(currentImageData.data, currentImageData.width, currentImageData.height);
          context.putImageData(myimg, 0, 0);
        }
      }

      
}

export async function videoClicked(){
 
  if(isPlaying()){
    await togglePlay(true);
    drawFrameOnPause();
  }else{
    togglePlay(false);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
  

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
export function togglePlay(playingBool) {
  if (playingBool) {
    video.pause();
 
  } else {
    video.play();
    //video2.play();
  }
}

export function isPlaying(){
  let video = document.getElementById('video');
  if (video.paused || video.ended) {
    return false;
  } else {
    return true;
  }

}

export function skipAheadCircle(data){

  let skipTo = data;//.videoTime;
  const progressBar = document.getElementById('progress-bar');
  
  let video = document.getElementById('video');

  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
export function updatePlayButton() {
  const playButton = document.getElementById('play');
  const playbackIcons = document.querySelectorAll('.playback-icons use');
  let video = document.getElementById('video');

  playbackIcons.forEach(icon => icon.classList.toggle('hidden'));

  if (video.paused) {
    playButton.setAttribute('data-title', 'Play (k)');
    d3.select("#play-r").classed('hidden', false);
    d3.select("#pause-r").classed('hidden', true);
  } else {
    playButton.setAttribute('data-title', 'Pause (k)');
    d3.select("#play-r").classed('hidden', true);
    d3.select("#pause-r").classed('hidden', false);
  }
}

export function resizeStuff(secondVid){

  size = document.getElementById('video').getBoundingClientRect();

  // d3.select('#video').style('width', `${Math.round(size.width)}px`);
  // d3.select('#video').style('height', `${Math.round(size.size)}px`);

  if(secondVid){

    video2.width = Math.round(size.width);
    video2.height = size.height;

    d3.select(video2).style('width', `${Math.round(size.width)}px`);
    d3.select(video2).style('height', `${Math.round(size.size)}px`);

    d3.select('#interaction').style('width', `${Math.round(size.width)}px`);
    d3.select('#interaction').style('height', `${Math.round(size.height)}px`);

    d3.select('#canvas').node().width = size.width;
    d3.select('#canvas').node().height = size.height;

    // d3.select('#interaction').node().style.height = size.height;
  }

  d3.select('#video-controls').style('top', `${(size.height + size.top) + 10}px`);
  d3.select('#video-controls').style('width', `${Math.round(size.width)}px`);
}

function customControls(video){

  const videoControls = document.getElementById('video-controls');
  const playButton = document.getElementById('play');
  const playbackIcons = document.querySelectorAll('.playback-icons use');
  const timeElapsed = document.getElementById('time-elapsed');
  const duration = document.getElementById('duration');
  const progressBar = document.getElementById('progress-bar');
  const seek = document.getElementById('seek');
  const seekTooltip = document.getElementById('seek-tooltip');
  const volumeButton = document.getElementById('volume-button');
  const volumeIcons = document.querySelectorAll('.volume-button use');
  const volumeMute = document.querySelector('use[href="#volume-mute"]');
  const volumeLow = document.querySelector('use[href="#volume-low"]');
  const volumeHigh = document.querySelector('use[href="#volume-high"]');
  const volume = document.getElementById('volume');
  //const playbackAnimation = document.getElementById('playback-animation');
  const fullscreenButton = document.getElementById('fullscreen-button');
  const videoContainer = document.getElementById('video-container');
  const videoDim = document.getElementById('video').getBoundingClientRect();

  const videoWorks = !!document.createElement('video').canPlayType;
  if (videoWorks) {
    videoControls.classList.remove('hidden');
  }

  window.onresize = resizeStuff(video2);

  // formatTime takes a time length in seconds and returns the time in
  // minutes and seconds
  function formatTime(timeInSeconds) {

    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
  };

  // initializeVideo sets the video duration, and maximum value of the
  // progressBar
  function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    seek.setAttribute('max', videoDuration);
    progressBar.setAttribute('max', videoDuration);
    const time = formatTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
  }

  // updateTimeElapsed indicates how far through the video
  // the current playback is by updating the timeElapsed element
  function updateTimeElapsed() {
    const time = formatTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
    d3.select('#time-update').select('text').text(`${time.minutes}m ${time.seconds}s`);
  }

  // updateProgress indicates how far through the video
  // the current playback is by updating the progress bar
  function updateProgress() {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
  }

  // updateSeekTooltip uses the position of the mouse on the progress bar to
  // roughly work out what point in the video the user will skip to if
  // the progress bar is clicked at that point
  function updateSeekTooltip(event) {
    const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
    seek.setAttribute('data-seek', skipTo)
    const t = formatTime(skipTo);
    seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
    const rect = video.getBoundingClientRect();
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
  }

  // skipAhead jumps to a different point in the video when the progress bar
  // is clicked
  function skipAhead(event) {

    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
  }

  // updateVolume updates the video's volume
  // and disables the muted state if active
  function updateVolume() {
    if (video.muted) {
      video.muted = false;
    }

    video.volume = volume.value;
  }

  // updateVolumeIcon updates the volume icon so that it correctly reflects
  // the volume of the video
  function updateVolumeIcon() {
    volumeIcons.forEach(icon => {
      icon.classList.add('hidden');
    });

    volumeButton.setAttribute('data-title', 'Mute (m)');

    if (video.muted || video.volume === 0) {
      volumeMute.classList.remove('hidden');
      volumeButton.setAttribute('data-title', 'Unmute (m)')
    } else if (video.volume > 0 && video.volume <= 0.5) {
      volumeLow.classList.remove('hidden');
    } else {
      volumeHigh.classList.remove('hidden');
    }
  }

  // toggleMute mutes or unmutes the video when executed
  // When the video is unmuted, the volume is returned to the value
  // it was set to before the video was muted
  function toggleMute() {
    video.muted = !video.muted;
    if (video.muted) {
      volume.setAttribute('data-volume', volume.value);
      volume.value = 0;
    } else {
      volume.value = volume.dataset.volume;
    }
  }

// // animatePlayback displays an animation when
// // the video is played or paused
// function animatePlayback() {
//     playbackAnimation.animate([
//       {
//         opacity: 1,
//         transform: "scale(1)",
//       },
//       {
//         opacity: 0,
//         transform: "scale(1.3)",
//       }
//     ], {
//       duration: 500,
//     });
// }

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it must be exited and vice versa.
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
}

// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
// function updateFullscreenButton() {
//   fullscreenIcons.forEach(icon => icon.classList.toggle('hidden'));
//   if (document.fullscreenElement) {
//     fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
//   } else {
//     fullscreenButton.setAttribute('data-title', 'Full screen (f)')
//   }
// }

// togglePip toggles Picture-in-Picture mode on the video
// async function togglePip() {
//   try {
//     if (video !== document.pictureInPictureElement) {
//       pipButton.disabled = true;
//       await video.requestPictureInPicture();
//     } else {
//       await document.exitPictureInPicture();
//     }
//   } catch (error) {
//     console.error(error)
//   } finally {
//     pipButton.disabled = false;
//   }
// }

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }
  videoControls.classList.add('hide');
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove('hide');
}

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
  const { key } = event;
  switch(key) {
    case 'k':
      togglePlay();
     // animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case 'm':
      toggleMute();
      break;
    case 'f':
      toggleFullScreen();
      break;
    case 'p':
      togglePip();
      break;
  }
}

// Add eventlisteners here
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
//video.addEventListener('click', togglePlay);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);

d3.select("#play-r").on('click', togglePlay);
d3.select("#pause-r").on('click', togglePlay);

document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
});

let ref = firebase.database().ref();                     
checkDatabase(ref, annotationBar);

}








