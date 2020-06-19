import * as d3 from 'd3';
import { dropDown, formatVideoTime, annotationMaker } from './canvas';
import { updateSideAnnotations } from './sidebar';
import { firebaseConfig, checkDatabase } from './firebaseStuff';
import * as firebase from 'firebase';


export const annotationType = [
    {key:'question', tag:'question', tempCall: questionTemplate}, 
    {key:'add context for biology', tag:'context', tempCall: bioInfoTemplate}, 
    {key:'suggestion for animation/tool', tag:'suggestion', tempCall: suggestionTemplate},
    {key:'other', tag:'none', tempCall: defaultTemplate},  
]
export const tagOptions = [
    {key:'question-biology', color:'#0FF176'}, 
    {key:'question-animation', color:'#FFC300'}, 
    {key:'suggestion', color:'#FF5733'}, 
     {key:'bio-context', color:'#C70039'}, 
    // {key:'critique', color:'#900C3F'}, 
    // {key:'note', color:'#7D3C98'}, 
    // {key:'dissent', color:'gray'},
    // {key:'digging deeper', color:'#2ECC71'}, 
    // {key:'reference', color:'#F1C40F'},
    {key: 'none', color: 'black'}
];

export function addTagFunctionality(inputDiv, tagArray){

    let tagWrap = inputDiv.append('div').classed('tag-wrap', true);

    let tags = tagWrap.selectAll('span.badge').data(tagArray).join('span').classed('badge badge-secondary', true);
    tags.text(d=> `${d}  `);
    let x = tags.append('text').text('X');
    x.style('padding', '5px')
    x.style('cursor', 'pointer');
    x.on('click', (d, i, n)=> {
        d3.select(n[i].parentNode).remove();
        tagArray = tagArray.filter(f=> f != d);
    });

    let tagInput = inputDiv.append('div').classed('input-group mb-3', true);
    let tagText = tagInput.append('input');
    tagText.classed('form-control', true);
    tagText.node().type = 'text';
    tagText.node()['aria-label'] = 'tag add';
    tagText.node()['aria-describedby'] = 'basic-addon2';

    let addTagButtonWrap = tagInput.append('div').classed('input-group-append', true);

    let addTagButton = addTagButtonWrap.append('button');
    addTagButton.text('Add Tag').classed('btn btn-outline-secondary', true);
    
    addTagButton.on('click', ()=> {
       
        tagArray.push(tagText.node().value);
        
        let tags = tagWrap.selectAll('span.badge').data(tagArray).join('span').classed('badge badge-secondary', true);
        tags.text(d=> `${d}  `);
        let x = tags.append('text').text('X');
        x.style('padding', '5px')
        x.style('cursor', 'pointer');
        x.on('click', (d, i, n)=> {
            d3.select(n[i].parentNode).remove();
            tagArray = tagArray.filter(f=> f != d);
        });
    });
}

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

    d3.select('.dropdown.ann-type-drop').select('button').style('color', 'black')

    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
    inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    let tagButton = dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');

    let defaultTags = []

    addTagFunctionality(inputDiv, defaultTags);

}

export function suggestionTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'suggestion')[0].color);
    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
   // inputDiv.append('h6').text('Make a suggestion ');

    inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    let suggestionText = `Have a critique of the animation or tool? Make a suggestion to improve it.`;

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', suggestionText);

    let suggestionTags = ['suggestion', 'improvement', 'animation']

    addTagFunctionality(inputDiv, suggestionTags);


}



export function bioInfoTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'bio-context')[0].color);

    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);

    inputDiv.append('h6').text('Add some context for biology');
    inputDiv.append('p').classed('text-tab', true).text('This could be additional information and references that support an aspect of the biology or animation. If you add a rederence, please add the DOI for the paper.')
    inputDiv.append('p').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Add a comment, clarifying information, or the DOI of a reference');

    let bioTags = ['biology', 'context'];

    addTagFunctionality(inputDiv, bioTags);

}

export function questionTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'none')[0].color);

    let questionOps = [
        {key:'biology', color:'#0FF176'},
        {key: 'animation', color:'#FFC300'}
    ];

    let questionText = {
        body: `Choose the type of question in the drop down. This can be biology or animation related. Please be descriptive as possible.`
    };
        
    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
    // inputDiv.append('h6').text('Ask a question:');
    // inputDiv.append('p').classed('text-tab', true)
    // .text('Have a question about something? Please specify if it is biology or tool related.')

    inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Ask a biology or tool related question here.');
    let tagButton = dropDown(inputDiv, questionOps, 'Type', 'q-tag-drop', null, null, false, true);
    //div, optionArray, dropText, dropId, user, coords, callbackBool, questionBool

    
  
}

export function citationTemplate(div){
    console.log('this is citation template', div);
}