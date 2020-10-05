import * as d3 from 'd3';
import { formatCanvas, formatPush, annotationBar } from './canvas';
import { toggleMagic } from './sidebar';
import { checkDatabase } from './firebaseStuff';
import * as firebase from 'firebase';
import { mouse } from 'd3';

const shapeArray = [];

export function formatVidPlayer(div, videoPath){

  let videoSelect = d3.select(div).select('video');
  videoSelect.attr('id', 'video');

  let src = videoSelect.append('source');

  src.attr('src', videoPath);
  src.attr('type', "video/mp4");

  customControls(videoSelect.node());

  return div;
     
}

var startButton;
var canvas;
var context;
var video;
var canPlay;
var applyEffect;

var playing;


var currentImageData = {};


function make2DArray(dat){

  console.log('data length', dat.length, "data.width", dat.width, "video", video.getBoundingClientRect(), dat.height, (dat.length/4)/dat.height);
  for(let i = 0; i<dat.length; i += 4){
    
  }

}

function init() {

  resizeStuff();
 
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  video = document.getElementById('video');
  const playButton = document.getElementById('play');

  video.muted = true;

  currentImageData.index = 0;

  if (video.readyState >= 3) {
    readyToPlay();
  } else {
    video.addEventListener('canplay', readyToPlay);
  }
  
  playButton.addEventListener('click', function () {

    playing = togglePlay();
    if(playing) {
      
    drawFrame(video);
  }else{
    console.log(currentImageData);
  }



  });

}

const getColorIndicesForCoord = (x, y, width) => {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

function readyToPlay() {

  console.log('when does this wotk?? ready to play')
  // Set the canvas the same width and height of the video
  canvas.width = Math.round(video.videoWidth);
  canvas.height = video.videoHeight;

  d3.select('#interaction').node().width = Math.round(video.videoWidth)+'px';
  d3.select('#interaction').node().style.height = d3.select('#canvas').style('height');

  canPlay = true;
}

function drawFrame(video) {

  context.drawImage(video, 0, 0);

  var _data = context.getImageData(0, 0, video.getBoundingClientRect().width, video.getBoundingClientRect().height)
  currentImageData.data = _data.data;
  currentImageData.width = _data.width;
  currentImageData.height = _data.height;

  //currentImageData.data = data;
  currentImageData.index = currentImageData.index += 1;

  
  if (applyEffect) {
   
    invertColors(imageData.data);
    context.putImageData(imageData, 0, 0);
  }

  setTimeout(function () {
    
   if(playing){
    drawFrame(video);

   }
   
  }, 3);

  
}

  ////EXPERIMENT///
  d3.select('#interaction').on('mousemove', (d, i, n)=> {

    var coord = d3.mouse(n[i]);

    console.log(currentImageData.data, currentImageData.width, currentImageData.height);
    
    let rect = n[i].getBoundingClientRect(); 

    const colorIndices = getColorIndicesForCoord(Math.round(coord[0]), (coord[1]), currentImageData.width);

    const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

    var redForCoord = currentImageData.data[redIndex];
    var greenForCoord = currentImageData.data[greenIndex];
    var blueForCoord = currentImageData.data[blueIndex];
    var alphaForCoord = currentImageData.data[alphaIndex];

    var new_rgb = 'rgba(' + redForCoord +","+ greenForCoord +","+ blueForCoord +', 1.0)';

    let body = d3.select('body').node();
    body.style.background = new_rgb;

  }).on('click', ()=> {

    playing = togglePlay();

    if(playing){

      drawFrame(video);

    }else{


      console.log('current image data',currentImageData)

        // var e = window.event;

        // var _data = context.getImageData(0, 0, video.getBoundingClientRect().width, video.getBoundingClientRect().height)
        // var data = _data.data;
        // data.width = _data.width;
        // data.height = _data.height;

        // data.pixelAt = function (x, y, set) {

        //   console.log('width', x, y, this.width)
        //   var i = y * this.width * 4 + x * 4;
      
        //   if (set) {
        //     this[i] = set.red;
        //     this[i + 1] = set.green;
        //     this[i + 2] = set.blue;
        //     this[i + 3] = set.alpha;
        //   } else return {
        //     red: this[i],
        //     green: this[i + 1],
        //     blue: this[i + 2],
        //     alpha: this[i + 3]
        //   };
        // };
  
        // var pixel = data.pixelAt(e.offsetX, e.offsetY);
    
       // console.log('new CLICK', data);

        // let groups = [];
        // for(let i = 0; i < data.length; i = i + 4){
        //    // console.log(i, i+4);
        //    let end = i + 4;
        //     let snip = data.slice(i, end);
        //     if(String(snip) === String([pixel.red, pixel.green, pixel.blue, pixel.alpha])){
        //        // console.log('it works', String(snip), String([pixel.red, pixel.green, pixel.blue, pixel.alpha]))
                
        //     }else{
        //         snip[3] = 0;
        //     }
            
        //     snip.map(m=> groups.push(m));
        // }

        // var ctx = canvas.getContext('2d');
        // ctx.putImageData(new ImageData(new Uint8ClampedArray(groups), video.getBoundingClientRect().width, video.getBoundingClientRect().height), 0, 0);
       // video.style.opacity = 0;
    }
  });


function invertColors(data) {
  for (var i = 0; i < data.length; i+= 4) {
    data[i] = data[i] ^ 255; // Invert Red
    data[i+1] = data[i+1] ^ 255; // Invert Green
    data[i+2] = data[i+2] ^ 255; // Invert Blue
  }
}



export function pixel8(image, w, h) {
  "use strict";

  // Image must be an image, canvas, or video
  // For videos: Pixel data of the currently displayed frame will be extracted
  // For canvases: Why are you using this?
  if (!image.tagName || image.tagName !== "IMG" && image.tagName !== "VIDEO" && image.tagName !== "CANVAS") {
    throw new TypeError("first argument must be image, video, or canvas context.");
  }

  // For our friend Internet Explorer, FlashCanvas is supported
  // ExplorerCanvas does not support the getImageData function
 // var canvas = document.createElement('canvas');
  var canvas = document.getElementById('canvas-exp');
  canvas.style.width = image.getBoundingClientRect().width;
  canvas.style.height = image.getBoundingClientRect().height;

  console.log('width check',w, h)
  //d3.select(canvas).style('opacity', 0)
  if (window.FlashCanvas) FlashCanvas.initElement(canvas);
  if (canvas.getContext) var ctx = canvas.getContext('2d');
  else return;

  ctx.drawImage(image, 0, 0, image.getBoundingClientRect().width/2, image.getBoundingClientRect().height/2);

  var _data = ctx.getImageData(0, 0, image.getBoundingClientRect().width, image.getBoundingClientRect().height)
  var data = _data.data;
  data.width = _data.width;
  data.height = _data.height;
  
  // Returns {red, green, blue, alpha} object of a single specified pixel
  // or sets the specified pixel.
  data.pixelAt = function (x, y, set) {
    var i = y * this.width * 4 + x * 4;

    if (set) {
      this[i] = set.red;
      this[i + 1] = set.green;
      this[i + 2] = set.blue;
      this[i + 3] = set.alpha;
    } else return {
      red: this[i],
      green: this[i + 1],
      blue: this[i + 2],
      alpha: this[i + 3]
    };
  };

  // Draws the pixel data into a canvas
  data.draw = function(ctx, x, y) {
    ctx.putImageData(_data, x, y);
  };
  return data;
}

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
export function togglePlay() {
  let video = document.getElementById('video');
  if (video.paused || video.ended) {
    video.play();
    return true;
  } else {
    video.pause();
    return false;
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

function resizeStuff(){

  let size = document.getElementById('video').getBoundingClientRect();

  d3.select('#video').style('width', `${Math.round(size.width)}px`);


  d3.select('#interaction').style('width', `${Math.round(size.width)}px`);
  d3.select('#interaction').node().style.height = d3.select('#video').style('height');

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
  const playbackAnimation = document.getElementById('playback-animation');
  const fullscreenButton = document.getElementById('fullscreen-button');
  const videoContainer = document.getElementById('video-container');
  const videoDim = document.getElementById('video').getBoundingClientRect();

  const videoWorks = !!document.createElement('video').canPlayType;
  if (videoWorks) {
  // video.controls = false
    videoControls.classList.remove('hidden');
  }


  window.onresize = resizeStuff;

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

// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
    playbackAnimation.animate([
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      }
    ], {
      duration: 500,
    });
}

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
function updateFullscreenButton() {
  fullscreenIcons.forEach(icon => icon.classList.toggle('hidden'));
  if (document.fullscreenElement) {
    fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
  } else {
    fullscreenButton.setAttribute('data-title', 'Full screen (f)')
  }
}

// togglePip toggles Picture-in-Picture mode on the video
async function togglePip() {
  try {
    if (video !== document.pictureInPictureElement) {
      pipButton.disabled = true;
      await video.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error(error)
  } finally {
    pipButton.disabled = false;
  }
}

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
      animatePlayback();
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
window.addEventListener('load', init);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);

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








