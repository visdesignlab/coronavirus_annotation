import * as d3 from 'd3';
import { formatCanvas, annotateCircle, formatPush } from './canvas';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import * as firebase from 'firebase';

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { skipAheadCircle } from './video_player';
import { event } from 'd3';

library.add(faCheck, fas, far, fab) 

dom.i2svg() 
dom.watch();

export function updateSideAnnotations(dbRef){

    let data = d3.entries(dbRef).map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    }).filter(f=> f.reply === false).sort((a, b)=> a.time - b.time);

    console.log('dbRef', data)

    let replyData = d3.entries(dbRef).map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    }).filter(f=> f.reply === true);
  
    let wrap = d3.select('#sidebar').select('#annotation-wrap');

    let memoDivs = wrap.selectAll('.memo').data(data).join('div').classed('memo', true);
    memoDivs.selectAll('.name').data(d=> [d]).join('span').classed('name', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.displayName);
    memoDivs.selectAll('.time').data(d=> [d]).join('span').classed('time', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.time);

    let tags = memoDivs.selectAll('.tag-span').data(d=> [d]).join('span').classed('tag-span', true);
    tags.selectAll('.badge').data(d=> [d]).join('span').classed('badge badge-secondary', true).text(d=> d.tags);

    memoDivs.selectAll('.comment').data(d=> [d]).join('span').classed('comment', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.comment);
    let upvote = memoDivs.selectAll('.upvote-span').data(d=> [d]).join('span').classed('upvote-span', true);
    upvote.selectAll('.upvote').data(d=> [d]).join('i').classed('upvote fas fa-thumbs-up', true);
    upvote.selectAll('.up-text').data(d=> [d]).join('text').classed('up-text', true).text(d=> `: ${d.upvote} `);

    let downvote = memoDivs.selectAll('.downvote-span').data(d=> [d]).join('span').classed('downvote-span', true);
    downvote.selectAll('.downvote').data(d=> [d]).join('i').classed('downvote fas fa-thumbs-down', true);
    downvote.selectAll('.down-text').data(d=> [d]).join('text').classed('down-text', true).text(d=> `: ${d.downvote}`);

    let reply = memoDivs.selectAll('button').data(d=> [d]).join('button').classed('btn btn-outline-secondary btn-sm', true).text('Reply');


    reply.on("click", function(d, i, n) {

        let event = d3.event.target;
        d3.event.stopPropagation();
        let coords = d3.mouse(this);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                        console.log(d, i, n) 
                        
                        console.log('node wot',n[i].parentNode)
                        let inputDiv = d3.select(n[i].parentNode).append('div').classed('text-input-sidebar', true);
                        inputDiv.append('text').text(`${user.displayName}:`)
                        inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
                        inputDiv.append('textarea').attr('id', 'tags').attr('placeholder', 'Comment Tag');
                        let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);
                
                        console.log('replies', d);
                
                        let dataPush = {
                            time: d.time,
                            comment: d3.select('#text-area-id').node().value,
                            upvote: 0,
                            downvote: 0,
                            tags: d3.select('#tags').node().value,
                            replies: d.key,
                            reply: true,
                            uid: user.uid,
                            displayName: user.displayName
                        }
            
                           
                                let ref = firebase.database().ref();                     
                                ref.push(dataPush);
                              
                                //checkDatabase(ref, updateSideAnnotations);

                         
                    
         
                // User is signed in.
                } else {
                    console.log("NO USER", user);
                // No user is signed in.
                }
        });    
      });


    // reply.on('click', (d, i, n)=>{

    //     event.stopPropagation();

    //     console.log('node wot',n[i].parentNode)
    //     let inputDiv = d3.select(n[i].parentNode).append('div').classed('text-input', true);
    //     inputDiv.append('text').text(`${user.displayName}@ ${currentTime} :`)
    //     inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    //     inputDiv.append('textarea').attr('id', 'tags').attr('placeholder', 'Comment Tag');
    //     let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);

    //     console.log('replies', d);

    //     let dataPush = {
    //         time: currentTime,
    //         comment: d3.select('#text-area-id').node().value,
    //         posTop: coords[1],
    //         posLeft: coords[0],
    //         upvote: 0,
    //         downvote: 0,
    //         tags: d3.select('#tags').node().value,
    //         replies:'',
    //         reply: true,
    //         uid: user.uid,
    //         displayName: user.displayName
    //     }

    // });

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