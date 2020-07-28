import * as d3 from 'd3';
import { updatePlayButton, togglePlay } from "./video_player";
import { defaultTemplate, tagOptions } from './templates';
import { radioBlob, formatPush, formatCanvas, clearSidebar, annotationMaker, doodleSubmit } from './canvas';
import { checkDatabase, firebaseConfig } from './firebaseStuff';
import * as firebase from 'firebase';
import { currentUserKeeper } from './annotation';
import { updateSideAnnotations } from './sidebar';

export function formatAnnotationBox(){
    console.log('this is where  the annotation goes');

    let annotationDiv = d3.select('#main-wrap').append('div').attr('id','annotation-ui');
    
}

export function noMarkFormat(){
    console.log("this is a test");

    let canvas = d3.select('canvas').node()
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 0;
    canvas.width = 0;
   
    let interactionDiv = d3.select('#interaction');
    interactionDiv.selectAll('*').remove();
}

export function formatCommentBox(div){

    let dropId = 'comment-type';
    let optionArray = ['None', 'Question', 'Suggestion', 'Critique']

    let templateWrap = div.append('div').classed('template-wrap', true);

    let dropdiv = div.append('div').classed(`dropdown ${dropId}`, true);
    // dropdiv.style('display', 'inline-block');
    let button = dropdiv.append('button').classed('btn dropbtn dropdown-toggle', true);
    let texting = button.text('Add Category Tag');
    button.node().value = 'other';
    let dropContent = dropdiv.append('div').attr('id', dropId).classed('dropdown-content', true);
    dropContent.append('a').text('text').attr('font-size', 11);
    let options = dropContent.selectAll('a').data(tagOptions).join('a').text(d=> d.key);

   // options.append('svg').classed('color-box', true).append('rect').attr('width', 10).attr('height', 10).attr('x', 5).attr('y', 8).attr('fill', d=> d.color);
   
    options.on('click', (d, i, n)=> {
        let testToo = button.text(d.key);

        button.node().value = d.key;
        dropContent.classed('show', false);

    });
   

    button.on('click', (d, i, n)=> {
        if(dropContent.classed('show')){
            dropContent.classed('show', false);
        }else{
            dropContent.classed('show', true);
        }
    });

    defaultTemplate(div);
    
    let t1Ob = {label: "No spatial reference", callBack: noMarkFormat};
    let t2Ob = {label: "Mark a Point", callBack: formatPush};
    let t3Ob = {label: "Draw", callBack: formatCanvas};

    let form = radioBlob(div, t1Ob, t2Ob, t3Ob, 'media-tabber');

    // formatPush();
    noMarkFormat();

    let submit = div.append('button').attr('id', 'comment-submit-button').text('Add').classed('btn btn-secondary', true);
    let commentType = "comments";

    submit.on('click', async ()=> {

        let user = currentUserKeeper[currentUserKeeper.length -1];
        
        d3.event.stopPropagation();

        if(d3.select('#text-area-id').node().value != ''){

            let tags = d3.select('.tag-wrap').selectAll('.badge');
      
            let currentTime = document.getElementById('video').currentTime;

            if(form.node().value === 't2'){
                console.log('this is a push', d3.select('#push-div'), !d3.select('#push-div').empty());
                
                let vidWidth =  +d3.select('#push-div').style('left').split('px')[0] / +d3.select('video').node().getBoundingClientRect().width;
                let vidHeight =  +d3.select('#push-div').style('top').split('px')[0] / +d3.select('video').node().getBoundingClientRect().height;

                let coords = !d3.select('#push-div').empty() ? [vidWidth, vidHeight] : null;
                console.log('coords', vidWidth, vidHeight)
                let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'push', button.node().value, commentType === "annotations");
                let refCom = firebase.database().ref(commentType);                     
                refCom.push(dataPush);
                checkDatabase(firebase.database().ref(), updateSideAnnotations);
                clearSidebar();
                d3.select('#interaction').selectAll("*").remove();
                
            }else if(form.node().value === 't3'){

                doodleSubmit(commentType, user, tags, button.node().value, currentTime);
                d3.select('#interaction').selectAll("*").remove();

            }else{
                let coords = null;
                let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'none', button.node().value, commentType === "annotations");
                let refCom = firebase.database().ref(commentType);                     
                refCom.push(dataPush);
                checkDatabase(firebase.database().ref(), updateSideAnnotations);
                clearSidebar();
                d3.select('#interaction').selectAll("*").remove();
            }

            d3.select('.add-comment').select('button').text('Add Comment');

        }else{
            window.alert('Please add a comment first');
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