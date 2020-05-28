import * as d3 from 'd3';
import { formatCanvas, annotateCircle, formatPush, dropDown, tagOptions } from './canvas';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import * as firebase from 'firebase';

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { skipAheadCircle } from './video_player';
import { event } from 'd3';
import { checkDatabase } from './firebaseStuff';

library.add(faCheck, fas, far, fab) 

dom.i2svg() 
dom.watch();

export function updateSideAnnotations(dbRef){


    let data = d3.entries(dbRef).map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    }).filter(f=> f.reply === false).sort((a, b)=> a.time - b.time);

    let replyData = d3.entries(dbRef).map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    }).filter(f=> f.reply === true);

    let nestReplies = data.map((d, i, n)=>{
        return recurse(d, replyData, 0);
    });

    function recurse(parent, replyArray, level){

        parent.level = level;
        parent.replyBool = false;
        let replies = replyArray.filter(f=> f.replies === parent.key);

        if(replies.length > 0){
            parent.replyKeeper = replies;
            let nextlevel = ++level;
            parent.replyKeeper.map(m=> recurse(m, replyArray, nextlevel));
            return parent;
        }else{
            parent.replyKeeper = [];
            return parent;
        }
    }
  
    let wrap = d3.select('#sidebar').select('#annotation-wrap');

    wrap.selectAll('*').remove();

    let formatMinute = d3.timeFormat();

    let memoDivs = wrap.selectAll('.memo').data(nestReplies).join('div').classed('memo', true);
    memoDivs.selectAll('.name').data(d=> [d]).join('span').classed('name', true).selectAll('text').data(d=> [d]).join('text').text(d=> `${d.displayName}:`);
    memoDivs.selectAll('.time').data(d=> [d]).join('span').classed('time', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.time);

    let tags = memoDivs.selectAll('.tag-span').data(d=> [d]).join('span').classed('tag-span', true);
    tags.selectAll('.badge').data(d=> [d]).join('span').classed('badge badge-secondary', true).text(d=> d.tags);

    memoDivs.selectAll('.comment').data(d=> [d]).join('span').classed('comment', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.comment);
    let upvote = memoDivs.selectAll('.upvote-span').data(d=> [d]).join('span').classed('upvote-span', true);
    upvote.selectAll('.upvote').data(d=> [d]).join('i').classed('upvote fas fa-thumbs-up fa-lg', true);
    upvote.selectAll('.up-text').data(d=> [d]).join('text').classed('up-text', true).text(d=> `: ${d.upvote} `);

    let downvote = memoDivs.selectAll('.downvote-span').data(d=> [d]).join('span').classed('downvote-span', true);
    downvote.selectAll('.downvote').data(d=> [d]).join('i').classed('downvote fas fa-thumbs-down fa-lg', true);
    downvote.selectAll('.down-text').data(d=> [d]).join('text').classed('down-text', true).text(d=> `: ${d.downvote}`);

    let reply = memoDivs.selectAll('.reply-span').data(d=> [d]).join('span').classed('reply-span', true);
    reply.selectAll('.reply').data(d=> [d]).join('i').classed('far fa-comment-dots fa-lg reply', true).style('float', 'right')//.text('Reply');

    reply.on("click", function(d, i, n) {

        d3.event.stopPropagation();
        if(d.replyBool === false){

            d.replyBool = true;

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
    
                    let inputDiv = d3.select(n[i].parentNode).append('div').classed('text-input-sidebar', true);
                    inputDiv.append('text').text(`${user.displayName}:`)
                    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
                    //inputDiv.append('textarea').attr('id', 'tags').attr('placeholder', 'Tag');
                    dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');
                    let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);
    
                    submit.on('click',  ()=> {
                        d3.event.stopPropagation();

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
                    });
                    // User is signed in.
                } else {
                    console.log("NO USER", user);
                    // No user is signed in.
                }
            });   

        }else{
            d.replyBool = false;
            d3.select(n[i].parentNode).select('.text-input-sidebar').remove();
        }
      });

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
        console.log('test click', typeof d3.event.target);
        if(d3.event.target.tagName.toLowerCase() === 'textarea' || d3.event.target.tagName.toLowerCase() === 'button'){
            console.log('do nothing');
        }else{ 
            skipAheadCircle(d);
        }     
    });

    memoDivs.each((d, i, n)=> {
        if(d.replyKeeper.length > 0){
            recurseDraw(d3.select(n[i]));
        }
    })

    function replyRender(replyDivs){
        

        replyDivs.selectAll('.name').data(d=> [d]).join('span').classed('name', true).selectAll('text').data(d=> [d]).join('text').text(d=> `${d.displayName}:`);

        let tags = replyDivs.selectAll('.tag-span').data(d=> [d]).join('span').classed('tag-span', true);
        tags.selectAll('.badge').data(d=> [d]).join('span').classed('badge badge-secondary', true).text(d=> d.tags);
    
        replyDivs.selectAll('.comment').data(d=> [d]).join('span').classed('comment', true).selectAll('text').data(d=> [d]).join('text').text(d=> d.comment);
        let upvote = replyDivs.selectAll('.upvote-span').data(d=> [d]).join('span').classed('upvote-span', true);
        upvote.selectAll('.upvote').data(d=> [d]).join('i').classed('upvote fas fa-thumbs-up fa-sm', true);
        upvote.selectAll('.up-text').data(d=> [d]).join('text').classed('up-text', true).text(d=> `: ${d.upvote} `);
    
        let downvote = replyDivs.selectAll('.downvote-span').data(d=> [d]).join('span').classed('downvote-span', true);
        downvote.selectAll('.downvote').data(d=> [d]).join('i').classed('downvote fas fa-thumbs-down', true);
        downvote.selectAll('.down-text').data(d=> [d]).join('text').classed('down-text', true).text(d=> `: ${d.downvote}`);
    
        let reply = replyDivs.selectAll('.reply-span').data(d=> [d]).join('span').classed('reply-span', true);
        reply.selectAll('.reply').data(d=> [d]).join('i').classed('far fa-comment-dots reply', true).style('float', 'right');

        reply.on("click", function(d, i, n) {

            d3.event.stopPropagation();
            if(d.replyBool === false){
    
                d.replyBool = true;
    
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
        
                        let inputDiv = d3.select(n[i].parentNode).append('div').classed('text-input-sidebar', true);
                        inputDiv.append('text').text(`${user.displayName}:`)
                        inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
                        //inputDiv.append('textarea').attr('id', 'tags').attr('placeholder', 'Comment Tag');
                        dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');
                        let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);
        
                        submit.on('click',  ()=> {
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
                            
                         
                            checkDatabase(ref, updateSideAnnotations);
                            
                            inputDiv.remove();
                        });
                        // User is signed in.
                    } else {
                        console.log("NO USER", user);
                        // No user is signed in.
                    }
                });   
    
            }else{
                d.replyBool = false;
                d3.select(n[i].parentNode).select('.text-input-sidebar').remove();
            }
          });
    }

    function recurseDraw(selectDiv){

        let replyDivs = selectDiv.selectAll('.reply-memo').data(d=> d.replyKeeper).join('div').classed('reply-memo', true);
        replyDivs.style('margin-left', d=> `${d.level * 10}px`);

        replyDivs.each((d, i, n)=> {
            replyRender(d3.select(n[i]));
            if(d.replyKeeper.length > 0){
                recurseDraw(d3.select(n[i]));
            }
        })

    }
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