import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';

var size;

init();

function init(){

    let mainWrap = document.getElementById('just_video');
    if(mainWrap){
        vid.formatVidPlayer(mainWrap, './public/entry_notflat_082020.mp4', null);
    }

    vid.resizeStuff();
       
    let video = document.getElementById('video');
    const playButton = document.getElementById('play');
      
    video.muted = true;
      
    if (video.readyState >= 3) {
        vid.readyToPlay()
    } else {
        video.addEventListener('canplay', vid.readyToPlay);
    }
        
    playButton.addEventListener('click', function () {
      
        if(vid.togglePlay()) {
            video.play()
            context.clearRect(0, 0, canvas.width, canvas.height);
        }else{
            video.pause()
            drawFrameOnPause(d3.select('#context-map').node());
            console.log(currentImageData);
        }
      
    });
      
}

