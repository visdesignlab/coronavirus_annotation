import * as d3 from 'd3';
import { formatCanvas, annotateCircle, formatPush } from './canvas';

export function updateSideAnnotations(dbRef){

    console.log('is this reaching??',dbRef, d3.entries(dbRef));

    let data = d3.entries(dbRef).map(m=> m.value);
    let wrap = d3.select('#sidebar').select('#annotation-wrap');

    let memoDivs = wrap.selectAll('.memo').data(data).join('div').classed('memo', true);
    memoDivs.selectAll('text').data(d=> [d]).join('text').text(d=> {
        console.log(d)
        return `${d.displayName}: ${d.time} - ${d.comment}`;
    })

   
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
            console.log('how do you pause the video');
            console.log(n[i])
            document.getElementById('video').setAttribute('pointer-events', 'none')
            d.callback();
        }else{
            d.selectedBool = false;
            console.log(n[i])
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
        console.log(n[i].value);
        if(n[i].value === "draw"){
            formatCanvas();
        }else{
            //annotateCircle();
            formatPush();
        }
        
    });
}