import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';

init();

console.log('is this fucking on')

function init(){

    

    let mainWrap = document.getElementById('just_video');
    if(mainWrap){
        vid.formatVidPlayer(mainWrap, './public/entry_notflat_082020.mp4');
    
    }

}
