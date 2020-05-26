import * as d3 from 'd3';
import { formatCanvas, annotateCircle, formatPush } from './canvas';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import * as firebase from 'firebase';

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { skipAheadCircle } from './video_player';

library.add(faCheck, fas, far, fab) 

dom.i2svg() 
dom.watch();

export function updateSideAnnotations(dbRef){

    let data = d3.entries(dbRef).map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    }).sort((a, b)=> a.time - b.time);
  
    let wrap = d3.select('#sidebar').select('#annotation-wrap');

    let memoDivs = wrap.selectAll('.memo').data(data).join('div').classed('memo', true);
    memoDivs.selectAll('.name').data(d=> [d]).join('span').classed('name', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.displayName);
    memoDivs.selectAll('.time').data(d=> [d]).join('span').classed('time', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.time);
    memoDivs.selectAll('.comment').data(d=> [d]).join('span').classed('comment', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.comment);
    let upvote = memoDivs.selectAll('.upvote-span').data(d=> [d]).join('span').classed('upvote-span', true);
    upvote.selectAll('.upvote').data(d=> [d]).join('i').classed('upvote fas fa-thumbs-up', true);
    upvote.selectAll('.up-text').data(d=> [d]).join('text').classed('up-text', true).text(d=> `: ${d.upvote} `);

    let downvote = memoDivs.selectAll('.downvote-span').data(d=> [d]).join('span').classed('downvote-span', true);
    downvote.selectAll('.downvote').data(d=> [d]).join('i').classed('downvote fas fa-thumbs-down', true);
    downvote.selectAll('.down-text').data(d=> [d]).join('text').classed('down-text', true).text(d=> `: ${d.downvote}`);

    var db = firebase.database();

    upvote.on('click', (d)=> {
        let newUp = ++d.upvote;
        db.ref(`${d.key}/upvote`).set(`${newUp}`);
    });

    downvote.on('click', (d)=> {
        let newDown = ++d.downvote;
        db.ref(`${d.key}/downvote`).set(`${newDown}`);
    });

    memoDivs.on('click', d=>{
        console.log(d);
        skipAheadCircle(d);
    });
}

export function renderNav(div, nav){

    let buttons = d3.select(div).selectAll('button').data(nav).join('button');
    buttons.text(d=> d.key);
    buttons.classed('btn btn-secondary', true);
    buttons.attr('id', d=> `button-${d.key}`);
    buttons.on('click', (d, i, n)=> {
    if(d.key === 'draw'){
        if(d.selectedBool === false){
            d.selectedBool = true;
            document.getElementById('video').setAttribute('pointer-events', 'none')
            d.callback();
        }else{
            d.selectedBool = false;
          
            d.callback();
        }
    }else{
        d.callback();
    }
 });
}

export function toggleMagic(){
    d3.select('.togg-wrap').selectAll('input')
    .on('click', (d, i, n)=> {
       
        if(n[i].value === "draw"){
            formatCanvas();
        }else{
            //annotateCircle();
            formatPush();
        }
        
    });
}