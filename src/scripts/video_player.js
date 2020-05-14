import * as d3 from 'd3';

const shapeArray = [];

export function formatVidPlayer(div, videoPath){

  let video = d3.select(div).select('video');
  video.attr('id', 'video');

    
  let src = video.append('source');

  src.attr('src', videoPath);
  src.attr('type', "video/mp4");

  customControls(video.node());
    
  return div;
     
}

function customControls(videoNode){

  const videoControls = document.getElementById('video-controls');

  const videoWorks = !!document.createElement('video').canPlayType;
  if (videoWorks) {
    videoNode.controls = false;
    videoControls.classList.remove('hidden');
  }else{
    videoNode.controls = true;
  }

  const playButton = document.getElementById('play');
  // Add eventlisteners here
  playButton.addEventListener('click', togglePlay);

  const playbackIcons = document.querySelectorAll('.playback-icons use');

  videoNode.addEventListener('play', updatePlayButton);
  videoNode.addEventListener('pause', updatePlayButton);

  const timeElapsed = document.getElementById('time-elapsed');
  const duration = document.getElementById('duration');

  videoNode.addEventListener('loadedmetadata', initializeVideo);

  videoNode.addEventListener('timeupdate', updateTimeElapsed);

  const progressBar = document.getElementById('progress-bar');
  const seek = document.getElementById('seek');

  function initializeVideo() {
    const videoDuration = Math.round(videoNode.duration);
    seek.setAttribute('max', videoDuration);
    progressBar.setAttribute('max', videoDuration);
    const time = formatTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
  }

  // updateTimeElapsed indicates how far through the video
  // the current playback is
  function updateTimeElapsed() {
    const time = formatTime(Math.round(videoNode.currentTime));
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
  }

  // initializeVideo sets the video duration, and maximum value of the
  // progressBar

  function initializeVideo() {
    const videoDuration = Math.round(videoNode.duration);
    const time = formatTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
  }

  // formatTime takes a time length in seconds and returns the time in
  // minutes and seconds
  function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
  };

  // updatePlayButton updates the playback icon and tooltip
  // depending on the playback state
  function updatePlayButton() {
    playbackIcons.forEach(icon => icon.classList.toggle('hidden'));
  
    if (videoNode.paused) {
      playButton.setAttribute('data-title', 'Play (k)')
    } else {
      playButton.setAttribute('data-title', 'Pause (k)')
    }
  }
  // togglePlay toggles the playback state of the video.
  // If the video playback is paused or ended, the video is played
  // otherwise, the video is paused
  function togglePlay() {
    if (videoNode.paused || videoNode.ended) {
      videoNode.play();
    } else {
      videoNode.pause();
    }
  }

}

export function formatCanvas(){

  let frame = 'video';

  console.log('is this firing')

   let div = document.getElementById('main-wrap');

    let canvas = d3.select(div).select('canvas').node();
    canvas.setAttribute('id', 'vid-canvas');

    const context = canvas.getContext("2d");
    let videoDim = document.getElementById(frame).getBoundingClientRect();
    console.log(video, 'size')

    canvas.width = videoDim.width;
    canvas.height = videoDim.height;

    context.strokeStyle = "red";
    context.lineWidth = 5;
   
    var oldX, oldY;
    var draw=false;

    div.onmousedown=function(e) {

        let sideWidth = document.getElementById('sidebar').getBoundingClientRect();

        oldX = (e.pageX - sideWidth.width);
        oldY = (e.pageY);
   
        draw=true;
    }
    div.onmousemove=function(e) {

    let sideWidth = document.getElementById('sidebar').getBoundingClientRect();

    var mouseX = (e.pageX - sideWidth.width);
    var mouseY = (e.pageY);
  
      if(draw) {
        console.log(e, this.offsetLeft)
      context.beginPath();
      context.moveTo(oldX, oldY);
      context.lineTo(mouseX, mouseY);
      context.stroke();
      context.closePath();
      oldX=mouseX;
      oldY=mouseY;
      }
    
    }
    div.onmouseup=function(e) {
      draw=false;
      shapeArray.push(context.save());
      console.log(shapeArray, context.save())
    }

    return div;

}






