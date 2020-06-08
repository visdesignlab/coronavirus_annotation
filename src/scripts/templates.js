import * as d3 from 'd3';
import { dropDown, formatVideoTime, annotationMaker } from './canvas';
import { updateSideAnnotations } from './sidebar';
import { firebaseConfig, checkDatabase } from './firebaseStuff';
import * as firebase from 'firebase';


export const annotationType = [
    {key:'question', tempCall: questionTemplate}, 
    {key:'add context for biology', tempCall: defaultTemplate}, 
    {key:'suggestion for animation/tool', tempCall: defaultTemplate}, 
]
export const tagOptions = [
    {key:'question-biology', color:'#0FF176'}, 
    {key:'question-animation', color:'#FFC300'}, 
    {key:'suggestion', color:'#FF5733'}, 
    {key:'additional input', color:'#C70039'}, 
    {key:'critique', color:'#900C3F'}, 
    {key:'note', color:'#7D3C98'}, 
    {key:'suggestion', color:'#2E86C1'}, 
    {key:'dissent', color:'gray'},
    {key:'digging deeper', color:'#2ECC71'}, 
    {key:'reference', color:'#F1C40F'},
    {key: 'none', color: 'black'}
];

export function annotationInitiation(user, interactionDiv, coords){

    let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]);
    let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
    pushDiv.style('position', 'absolute')
    pushDiv.style('top', (d)=> coords[1]+'px')
    pushDiv.style('left', (d)=> coords[0]+'px')
    let svg = pushDiv.append('svg').classed('push', true);
    let circ = svg.append('circle').attr('r', 5).attr('cx', 5).attr('cy', d=> 5).attr('fill', 'purple');
        
    let inputDiv = pushDiv.append('div').classed('comment-initiated', true);
  
    let tagButton = dropDown(inputDiv, annotationType, 'Type of Comment', 'ann-type-drop', user, coords, true);

    inputDiv.append('div').classed('template-wrap', true);

}

export function defaultTemplate(div, user, coords){

    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
    inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    let tagButton = dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');
    let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);

    submit.on('click', ()=> {

        d3.event.stopPropagation();
        let dataPush = annotationMaker(user, currentTime, tagButton.text(), coords, false, null);
        d3.select('#push-div').remove(); 
        let refCom = firebase.database().ref("comments");                     
        refCom.push(dataPush);
        checkDatabase(firebase.database().ref(), updateSideAnnotations);

    });
}

export function bioInfoTemplate(div, user, coords){

    console.log('this is bio template', div);

    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
    inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    let tagButton = dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');
    let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);

    submit.on('click', ()=> {

        d3.event.stopPropagation();
        let dataPush = annotationMaker(user, currentTime, tagButton.text(), coords, false, null);
        d3.select('#push-div').remove(); 
        let refCom = firebase.database().ref("comments");                     
        refCom.push(dataPush);
        checkDatabase(firebase.database().ref(), updateSideAnnotations);

    });
}

export function questionTemplate(div, user, coords){

    let questionOps = [
        {key:'biology', color:'#0FF176'},
        {key: 'animation', color:'#FFC300'}
    ];

    let questionText = {
        body: `Choose the type of question in the drop down. This can be biology or animation related. Please be descriptive as possible.`
    }
        
    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
    inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    let tagButton = dropDown(inputDiv, questionOps, 'Type', 'tag-drop');
    let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);

    submit.on('click', ()=> {

        console.log('testing this out', d3.select('.dropdown.ann-type-drop').select('button').attr('value'), tagButton.text())

        d3.event.stopPropagation();
        let dataPush = annotationMaker(user, currentTime, `${d3.select('.dropdown.ann-type-drop').select('button').attr('value')}-${tagButton.text()}`, coords, false, null);
        d3.select('#push-div').remove(); 
        let refCom = firebase.database().ref("comments");                     
        refCom.push(dataPush);
        checkDatabase(firebase.database().ref(), updateSideAnnotations);

    });
}

export function citationTemplate(div){
    console.log('this is citation template', div);
}