import * as d3 from 'd3';
import { formatCanvas, formatPush, annotationBar, formatTime, formatVideoTime } from './canvas';
import { drawCommentBoxes, formatCommentData, toggleMagic } from './sidebar';
import { checkDatabase, dataKeeper } from './firebaseStuff';
import * as firebase from 'firebase';
import { mouse, select } from 'd3';
import { comments } from './annotation';

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

var video;
var video2;
var size;

var structureClicked = false;

const getColorCode = [];

export function formatVidPlayer(div, videoPath, isInteractive){

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

      canPlay = true;

      if(isInteractive){

        d3.select('#interaction').node().width = Math.round(video.videoWidth)+'px';
        d3.select('#interaction').node().style.height = d3.select('#canvas').style('height');

        resizeStuff(true);
     
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        let imgOb = loadPngForFrame();
    
        //context.drawImage(video2, 0, 0);
        // imgOb.onload = ()=> {

  
        //   context.drawImage(imgOb, 0, 0);
    
        //   var _data = context.getImageData(0, 0, size.width, size.height)
      
        //   currentImageData.data = _data.data;
        //   currentImageData.width = _data.width;
        //   currentImageData.height = _data.height;
      
        //   context.putImageData(_data, 0, 0);
        // }
        
    
    
      }else{
        resizeStuff();
      }
  
    } else {
      video.addEventListener('canplay', canPlay = true);
    }
    
    playButton.addEventListener('click', function () {
  
      if(togglePlay()) {
        video.pause();
       // drawFrameOnPause(d3.select('#context-map').node());
       drawFrameOnPause();
      }else{
        video.play();
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
     return 'teal';
  }else if(code[2] > 70 && code[0] < 100 && code[2] > code[0] && code[2] > code[1]){
    return 'blue';
  }else if(code[2] > 70 && code[0] > 100 && code[2] > code[0] && code[2] > code[1]){
    return 'purple';
  }else if(code[2] < 70 && code[0] > 200 && code[2] < code[0] && code[1] < code[0] && code[1] < 80){
    return 'red';
  }else if(code[2] < 70 && code[0] > 50 && code[2] < code[0] && code[1] < code[0] && code[1] > 80){
    return 'orange';
  }else if(code[1] > code[2] && code[1] > code[0] && code[2] > 49 && code[2] > 110 && code[0] < 120 && code[1] > 200){
    return 'mint';
  }else if(code[1] > code[2] && code[1]> code[0] && code[2] > 49 && code[0] < 120 && code[0] < 220){
    return 'green';
  }else if(code[0] > 250 && code[1] > 200 && code[2] < 100){
    return 'yellow';
  }else if(code[0] > 220 && code[1] > 220 && code[2] > 220){
    return 'white';
  }else{
    return 'unknown';
  }

}
const colorDictionary = {
  'blue': {'code':[0, 0, 255], 'structure': ['ACE2']},
  'purple':{'code':[102, 0, 204], 'structure': ['ACE2']},
  'red':{'code':[255,0,0], 'structure': ['TMPRSS2']},
  'green':{'code':[0,255,0], 'structure': ['Spike Protein', 's protein']},
  'orange':{'code':[255,128,0], 'structure': ['Furin']},
  'yellow':{'code':[255,255,0], 'structure': ['Membrane Protein']},
  'mint':{'code':[40,255,150], 'structure': ['Spike Protein', 's protein']},
  'teal':{'code':[10,160,140], 'structure': ['Spike Protein', 's protein']},
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
        newData.data[i] = colorDictionary[color].code[0];
        newData.data[i + 1] = colorDictionary[color].code[1];
        newData.data[i + 2] = colorDictionary[color].code[2];
        newData.data[i + 3] = 100;
      }
    }

    const myimg = new ImageData(newData.data, dat.width, dat.height);
    context.putImageData(myimg, 0, 0);

}

const getColorIndicesForCoord = (x, y, width) => {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};


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

async function loadPngForFrame(){
 
  let pullFrame = Math.floor((video.currentTime) * 30);
  let pathImg = './public/imgStack/meshAll.';

    //The path to the image that we want to add.
  var imgPath = pathImg + (pullFrame+1) + '.png';

  console.log(imgPath);
  
  //Create a new Image object.
  var imgObj = new Image();
  
  //Set the src of this Image object.
  imgObj.src = imgPath;  
  
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  imgObj.onload = function() {
  
    context.drawImage(imgObj, 0, 0);
  
    var _data = context.getImageData(0, 0, size.width, size.height);

    currentImageData.data = _data.data.map((m,i)=> {
      if((i+1) % 4 === 0) m = 0;
      return m;
    });
    currentImageData.width = _data.width;
    currentImageData.height = _data.height;

    context.putImageData(_data, 0, 0);
  }

}

function drawFrameOnPause() {

  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  let imgObj = loadPngForFrame();
 
}

function getCoordColor(coord){

  const colorIndices = getColorIndicesForCoord(Math.round(coord[0]), (coord[1]), currentImageData.width);

  const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

  var redForCoord = currentImageData.data[redIndex];
  var greenForCoord = currentImageData.data[greenIndex];
  var blueForCoord = currentImageData.data[blueIndex];
  var alphaForCoord = currentImageData.data[alphaIndex];
  var new_rgb = 'rgba(' + redForCoord +","+ greenForCoord +","+ blueForCoord +', 1.0)';

  let body = d3.select('body').node();
  //body.style.background = new_rgb;

  let snip = colorChecker([redForCoord, greenForCoord, blueForCoord, alphaForCoord]);

  return snip;

}

export async function mouseMoveVideo(coord){

      if(isPlaying()){
        console.log('videoPlaying');
      }else if(structureClicked){
       
      }else{

        let snip = getCoordColor(coord);

        if(snip != currentColorCodes[currentColorCodes.length - 1] && !playing && snip != "black" && snip != "white"){
          currentColorCodes.push(snip);
          make2DArray(currentImageData, snip);

          let annotationData = formatTime(await d3.csv('./public/annotation_2.csv')).map((m, i)=> {
            m.index = i;
            return m;
          });
    
          let structureData = annotationData.filter(f=> {
            return f.associated_structures.split(', ').map(m=> m.toUpperCase()).indexOf(colorDictionary[snip].structure[0].toUpperCase()) > -1;
          });

          structureTooltip(colorDictionary, structureData, coord, snip);
    
    
        }else if(snip === "black" || snip === "white"){
          d3.select('.tooltip').style("opacity", 0);
         
          const myimg = new ImageData(currentImageData.data, currentImageData.width, currentImageData.height);
          context.putImageData(myimg, 0, 0);
        }
      }

      
}

function structureTooltip(colorDictionary, structureData, coord, snip){

    d3.select('.tooltip')
    .style('position', 'absolute')
    .style("opacity", 1)
    .html(`<h4>${colorDictionary[snip].structure[0]}</h4>
    <span class="badge badge-pill badge-info"><h7>${structureData.length}</h7></span> annotations for this structure. <br>
    <span class="badge badge-pill badge-danger">${structureData.filter(f=> f.has_unkown === "TRUE").length}</span> Unknowns. <br>
    <br>
    <button class="btn btn-outline-secondary">Add information on this structure</button> <br>
    `)
    .style("left", (coord[0]+ 200) + "px")
    .style("top", (coord[1]) + "px");

}

export async function videoClicked(coord){

  if(isPlaying()){

    structureClicked = false;
    await togglePlay(true);
    drawFrameOnPause();

  // }else if(structureClicked === false){
  //   const context = canvas.getContext('2d');
  //   context.clearRect(0, 0, canvas.width, canvas.height); 
  //   await togglePlay(false);

  }else{ 
    
   
    let snip = getCoordColor(coord);
  
    if(snip === "black" || snip === "white" || snip === "unknown"){
      structureClicked = false;
      togglePlay(false);

      context.clearRect(0, 0, canvas.width, canvas.height);
      d3.select('.tooltip')
            .style('position', 'absolute')
            .style("opacity", 0)
    }else{
      structureClicked = true;
      make2DArray(currentImageData, snip);

      let annotationData = formatTime(await d3.csv('./public/annotation_2.csv')).map((m, i)=> {
        m.index = i;
        return m;
      });

  
      let structureData = annotationData.filter(f=> {
        return f.associated_structures.split(', ').map(m=> m.toUpperCase()).indexOf(colorDictionary[snip].structure[0].toUpperCase()) > -1;
      });

      structureTooltip(colorDictionary, structureData, coord, snip);

      let annoWrap = d3.select('#annotation-wrap');
      annoWrap.selectAll('*').remove();

      annoWrap.append('h3').text(colorDictionary[snip].structure[0]);
      annoWrap.append('h7').text("Annotations:");

      let annos = annoWrap.selectAll('.anno').data(structureData).join('div').classed('anno', true);
   
      let annoTypeHeader = annos.selectAll('h6').data(d=> [d]).join('h6');
      let annoHeadSpan = annoTypeHeader.selectAll('span').data(d=> [d]).join('span').text(d=> d.annotation_type);
      annoHeadSpan.classed('badge badge-secondary', true);
      //annoHeadSpan.style('background-color', (d)=> annoType.filter(f=> f.type === d.annotation_type)[0].color);

      let blurb = annos.selectAll('.anno-text').data(d=> [d]).join('text').classed('anno-text', true)
      blurb.text(d=> {return d.text_description});

      let annoRef = annos.filter(f=> f.ref != "" && f.ref != "na").selectAll('text.ref').data(d=> [d]).join('text').classed('ref', true).text(d=> d.ref);

      let annoLink = annos.filter(f=> f.url != "" && f.url != "na").selectAll('a.link').data(d=> [d]).join('a').classed('link', true).text(d=> d.url);
      annoLink.attr('href', d=> d.url);
      annoLink.attr('target', '_blank');


      annos.filter(f=> {
        return f.has_unkown === 'TRUE';
      }).classed('unknown', true);

      annoWrap.append('h7').text("Comments:");

      let nestReplies = formatCommentData(dataKeeper[dataKeeper.length -1]);

      let test = nestReplies.filter((f)=> {
        if(colorDictionary[snip].structure[1]){
          return f.comment.toUpperCase().includes(colorDictionary[snip].structure[0].toUpperCase()) || f.comment.toUpperCase().includes(colorDictionary[snip].structure[1].toUpperCase);
        }else{
          return f.comment.includes(colorDictionary[snip].structure[0]);
        }
       
      });

      drawCommentBoxes(test, annoWrap);
      



    }
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

export function resizeStuff(isInteractive){

  size = document.getElementById('video').getBoundingClientRect();

  // d3.select('#video').style('width', `${Math.round(size.width)}px`);
  // d3.select('#video').style('height', `${Math.round(size.size)}px`);

  if(isInteractive){

    // video2.width = Math.round(size.width);
    // video2.height = size.height;

    // d3.select(video2).style('width', `${Math.round(size.width)}px`);
    // d3.select(video2).style('height', `${Math.round(size.size)}px`);

    d3.select('#interaction').style('width', `${Math.round(size.width)}px`);
    d3.select('#interaction').style('height', `${Math.round(size.height)}px`);

    d3.select('#canvas').node().width = size.width;
    d3.select('#canvas').node().height = size.height;

    // d3.select('#interaction').node().style.height = size.height;
  }

  d3.select('#video-controls').style('top', `${(size.height + size.top) + 10}px`);
  d3.select('#video-controls').style('width', `${Math.round(size.width)}px`);
}

async function customControls(video){

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

  window.onresize = resizeStuff(true);

  // formatTime takes a time length in seconds and returns the time in
  // minutes and seconds
  function formatVideoTime(timeInSeconds) {

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

    const time = formatVideoTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
  }

  // updateTimeElapsed indicates how far through the video
  // the current playback is by updating the timeElapsed element
  function updateTimeElapsed() {
    const time = formatVideoTime(Math.round(video.currentTime));
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
    const t = formatVideoTime(skipTo);
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

let annotationData = formatTime(await d3.csv('./public/annotation_2.csv')).map((m, i)=> {
  m.index = i;
  return m;
})

  let ref = firebase.database().ref();                     
  checkDatabase(ref, annotationBar, annotationData);





}








