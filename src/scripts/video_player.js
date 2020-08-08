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


// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
export function togglePlay() {
  let video = document.getElementById('video');
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
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

function customControls(video){

// Select elements here
//const video = document.getElementById('video');
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
// const fullscreenIcons = fullscreenButton.querySelectorAll('use');
// const pipButton = document.getElementById('pip-button');

const videoDim = document.getElementById('video').getBoundingClientRect();


const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
 // video.controls = false
  videoControls.classList.remove('hidden');
}


// Main elements
var body = document.getElementsByTagName('body')[0];
var current_rgb = document.getElementById('current_rgb');
var my_video = document.getElementById('video');
var my_canvas = document.getElementById('bg-canvas');
var my_canvas_context = my_canvas.getContext('2d');

  // Update the size of the canvas to match the video
my_canvas.width = my_video.getBoundingClientRect().width///2;
my_canvas.height = my_video.getBoundingClientRect().height + 60///2;

console.log('testing this', my_canvas.getBoundingClientRect().width)

d3.select('#interaction').on('mousemove', (d, i, n)=> {

    var e = window.event;

    let data = pixel8(video, e.offsetX/2, e.offsetY/2, my_canvas.width, my_canvas.height);

    console.log('dataaa', e.offsetX, e.offsetY)

	  var pixel = data.pixelAt(e.offsetX, e.offsetY);
    console.log("The transparency of the first pixel is: " + pixel.alpha +" "+ pixel.red +" "+pixel.blue);
    
     var new_rgb = 'rgba(' + pixel.red +","+ pixel.green +","+pixel.blue + "," + pixel.alpha + ')';
     body.style.background = new_rgb;
  })

  function pixel8(image, x, y, w, h) {
    "use strict";
  
    // Image must be an image, canvas, or video
    // For videos: Pixel data of the currently displayed frame will be extracted
    // For canvases: Why are you using this?
    if (!image.tagName || image.tagName !== "IMG" && image.tagName !== "VIDEO" && image.tagName !== "CANVAS") {
      throw new TypeError("first argument must be image, video, or canvas context.");
    }
  
    // Defaults for x-offset, y-offset, width, and height values
    if (typeof x !== 'number') x = 0;
    if (typeof y !== 'number') y = 0;
    if (typeof w !== 'number') w = image.width;
    if (typeof h !== 'number') h = image.height;
  
    // For our friend Internet Explorer, FlashCanvas is supported
    // ExplorerCanvas does not support the getImageData function
   // var canvas = document.createElement('canvas');
    var canvas = document.getElementById('bg-canvas');
    if (window.FlashCanvas) FlashCanvas.initElement(canvas);
    if (canvas.getContext) var ctx = canvas.getContext('2d');
    else return;
  
    // Draw the image/canvas/video and return a CanvasPixelArray of pixel data
    // Image must be from the same origin! Use a server-side proxy if you need cross-domain resources.
    // Like this one: http://benalman.com/projects/php-simple-proxy/
    // See https://developer.mozilla.org/en-US/docs/HTML/Canvas/Pixel_manipulation_with_canvas
    // to find out how to get specific data from the array
    // Or just use the pixel8-provided methods below
    //ctx.drawImage(image, x, y);

    // ctx.drawImage(image, 0, 0, my_canvas.getBoundingClientRect().width/2, my_canvas.getBoundingClientRect().height/2);

    ctx.drawImage(image, 0, 0, w, h);


    var _data = ctx.getImageData(0, 0, w, h)
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

    console.log('dataaaa',_data)
  
    // Draws the pixel data into a canvas
    data.draw = function(ctx, x, y) {
      ctx.putImageData(_data, x, y);
    };
  
    return data;
  }

d3.select(videoControls).style('top', `${videoDim.height + 55}px`);
d3.select('#interaction').style('height', `${videoDim.height}px`)

function resizeStuff(){
  console.log('this is firing')
  let size = document.getElementById('video').getBoundingClientRect();
  d3.select(videoControls).style('top', `${size.height + 10}px`);
  d3.select(videoControls).style('width', `${size.width}px`);
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
playButton.addEventListener('click', togglePlay);
//video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
// video.addEventListener('mouseenter', showControls);
// video.addEventListener('mouseleave', hideControls);
//videoControls.addEventListener('mouseenter', showControls);
//videoControls.addEventListener('mouseleave', hideControls);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);
//fullscreenButton.addEventListener('click', toggleFullScreen);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);

d3.select("#play-r").on('click', togglePlay);
d3.select("#pause-r").on('click', togglePlay);


//pipButton.addEventListener('click', togglePip);

document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
});

let ref = firebase.database().ref();                     

checkDatabase(ref, annotationBar);

}








