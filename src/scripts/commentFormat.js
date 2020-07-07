import * as d3 from 'd3';
import { updatePlayButton, togglePlay } from "./video_player";
import { defaultTemplate } from './templates';
import { radioBlob, formatPush, formatCanvas, clearSidebar, annotationMaker, doodleSubmit } from './canvas';
import { checkDatabase, firebaseConfig } from './firebaseStuff';
import * as firebase from 'firebase';
import { currentUserKeeper } from './annotation';


export function formatCommentBox(div){
    div.append('div').classed('template-wrap', true);
    defaultTemplate(div);

    let t1Ob = {label: "Push", callBack: formatPush};
    let t2Ob = {label: "Draw", callBack: formatCanvas};

    let form = radioBlob(div, t1Ob, t2Ob, 'media-tabber');

    let interactionVal = d3.select('.media-tabber').node().value;
    interactionVal === 't1' ? formatPush() : formatCanvas();

    let submit = div.append('button').attr('id', 'comment-submit-button').text('Add').classed('btn btn-secondary', true);

    let commentType = "comments";

    submit.on('click', async ()=> {

        let user = currentUserKeeper[currentUserKeeper.length -1];
        
        d3.event.stopPropagation();
        let tags = d3.select('.tag-wrap').selectAll('.badge');
      
            let currentTime = document.getElementById('video').currentTime;
            if(form.node().value === 't1'){
            
                let coords = !d3.select('#push-div').empty() ? [d3.select('#push-div').style('left'), d3.select('#push-div').style('top')] : null;
                
                let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'push', null, commentType === "annotations");
                
                let refCom = firebase.database().ref(commentType);                     
                refCom.push(dataPush);
                checkDatabase(firebase.database().ref(), updateSideAnnotations);
                clearSidebar();

                
            }else{
                doodleSubmit(commentType, user, tags, null, currentTime);
            }
    });
}

export function formatTimeControl(div){

    let timeWrap = div.append('div').attr('id', 'time-wrap');
    let controlDiv = timeWrap.append('div').attr('id', 'control');
    let svg = controlDiv.append('svg');

    let playR = svg.append('g').attr('id', 'play-r');
    playR.node().viewBox = "0 0 24 24";
    playR.append('path').attr("d", "M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z");

    let pauseR = svg.append('g').attr('id', 'pause-r').classed('hidden', true);
    pauseR.node().viewBox = "0 0 24 24";
    pauseR.append('path').attr("d", "M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z");

    let timeUpdate = timeWrap.append('div').attr('id', 'time-update');
    timeUpdate.append('text').text('00:00');

    updatePlayButton();

    d3.select("#play-r").on('click', togglePlay);
    d3.select("#pause-r").on('click', togglePlay);
    
}