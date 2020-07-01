
import * as d3 from 'd3';
import * as firebase from 'firebase';
import { Math } from 'core-js';
import { skipAheadCircle } from './video_player';
import { annotationType, tagOptions, annotationInitiation, addTagFunctionality } from './templates';
import { checkDatabase } from './firebaseStuff';
import { updateSideAnnotations } from './sidebar';

export const doodleKeeper = []


export function formatVideoTime(videoTime){
    let time = parseInt(videoTime);
    var minutes = Math.floor(time / 60);
    var seconds = (time - (minutes * 60));

    return `${minutes}:${('0' + seconds).slice(-2)}`;
}

export async function updateVideoAnn(){

    
    var storage = firebase.storage();
    var storageRef = storage.ref();
    let doods = await storageRef.child('images/').listAll();
   
    let svg = d3.select('#interaction').select('svg')
    
    const video = document.querySelector('video');

    let vidDim = d3.select('video').node().getBoundingClientRect();
     
    let interDIV = d3.select('#interaction');
    interDIV.style('width', vidDim.width+'px').style('height', vidDim.height+'px');

    video.ontimeupdate = async (event) => {

        let memoCirc = d3.select('#annotation-layer').selectAll('.memo');
        let memoDivs = d3.select('#sidebar').select('#annotation-wrap').selectAll('.memo');

        memoCirc.classed('selected', false);
        memoDivs.classed('selected', false);

        let timeRange = [video.currentTime - 1.5, video.currentTime + 1.5];
        let filtered = memoCirc.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);
        let selectedMemoDivs = memoDivs.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);
        console.log('filtered',filtered)
        let filteredPushes = filtered.filter(f=> {
            return f.commentMark === 'push';
        });

        let filteredDoodles = filtered.filter(f=> {
            return f.commentMark === 'doodle';
        });

        let doodleData = filteredDoodles.data();

        let test = doodleData.map(async (dood)=> {
            let urlDood = await doods.items.filter(f=>f.location['path'] === `images/${dood.doodleName}`)[0].getDownloadURL();
            return urlDood;
        });

        let images = interDIV.selectAll('.doodles').data(await Promise.all(test)).join('img').classed('doodles', true);
        images.attr('src', d=> d);

     
        
        let pushedG = svg.selectAll('g.pushed').data(filteredPushes.data()).join('g').classed('pushed', true);
       // d3.selectAll('.pushed').attr('transform', (d, i)=> `translate( ${d.posLeft}, ${d.posTop} )`);
       
        let circ = pushedG.selectAll('circle').data(d=> [d]).join('circle')
        circ.attr('r', 10);
        circ.attr('cx', d=> d.posLeft);
        circ.attr('cy', d=> d.posTop);
       // circ.attr('fill', d=> tagOptions.filter(f=> f.key === d.tags)[0].color)
        circ.attr('fill', 'red')
        circ.on('mouseover', (d)=>{
            let wrap = d3.select('#sidebar').select('#annotation-wrap');
            let memoDivs = wrap.selectAll('.memo').filter(f=> f.key === d.key);
            memoDivs.classed('selected', true);
            memoDivs.nodes()[0].scrollIntoView();

        }).on('mouseout', (d)=> {
            let wrap = d3.select('#sidebar').select('#annotation-wrap');
            let memoDivs = wrap.selectAll('.memo').classed('selected', false);
        });

    
        if(!selectedMemoDivs.empty()){
            selectedMemoDivs.nodes()[0].scrollIntoView();
            // d3.select('#sidebar').select('#annotation-wrap').node().scrollTop = selectedMemoDivs[0].node().getBoundingClientRect().y;
        }
        

    };
}

export function clearSidebar(){
    d3.select('#push-div').remove(); 
    d3.select('.template-wrap').selectAll('*').remove();
    d3.select('form').remove();
    d3.select('#comment-submit-button').remove();
    d3.select('.dropdown.ann-type-drop').select('button').text('Type of Comment').style('color', 'gray');
    let canvas = d3.select('canvas').node()
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 0;
    canvas.width = 0;
}

export function annotationMaker(user, currentTime, tag, coords, replyBool, replyTo, mark, initTag, annoBool){
   
    return {
        videoTime: currentTime,
        postTime: new Date().toString(), //.toDateString(),
        comment: d3.select('#text-area-id').node().value,
        commentMark: mark,
        posTop: coords != null ? coords[1] : null,
        posLeft: coords != null ? coords[0] : null,
        upvote: 0,
        downvote: 0,
        tags: tag === 'Tag' ? 'none' : tag,
        replies: replyTo,
        reply: replyBool,
        uid: user.uid,
        displayName: user.displayName,
        resolved: false,
        initTag: initTag,
        specialAnno: annoBool,

    }
}

export function radioBlob(div, t1Ob, t2Ob){

    let form = div.append('form').classed('tabber', true);
    let labelOne = form.append('label').classed('container', true);
    labelOne.text(t1Ob.label);
    labelOne.node().for = 't1';

    let inputOne = labelOne.append('input').attr('id', 't1')
    inputOne.node().name = 'radio';//'name', 'comment')
    inputOne.node().type = 'radio';
    inputOne.node().checked = true;

    let inputCheck1 = labelOne.append('span').classed('checkmark', true);
    form.node().value = 't1';

    let labelTwo = form.append('label').classed('container', true).text(t2Ob.label);
    labelTwo.node().for = 't2';

    let inputTwo = labelTwo.append('input').attr('id', 't2')
    inputTwo.node().name = 'radio';//.attr('name', 'comment')
    inputTwo.node().type = 'radio';//.attr('type', 'radio');
    inputTwo.node().checked = false;

    let inputCheck2 = labelTwo.append('span').classed('checkmark', true);

    inputOne.on('click', ()=> {
    
            inputOne.node().checked = true;
            inputTwo.node().checked = false;
            form.node().value = 't1';
            t1Ob.callBack();
    });

    inputTwo.on('click', ()=> {
   
            inputOne.node().checked = false;
            inputTwo.node().checked = true;
            form.node().value = 't2';
            t2Ob.callBack();
       // }
    });

   return form;

}

function doodleSubmit(commentType, user, tags, d){

    var storage = firebase.storage();
    var storageRef = storage.ref();

    var message = doodleKeeper[doodleKeeper.length - 1].data;
   
    var imagesRef = storageRef.child(`images/im-${user.uid}-${doodleKeeper[doodleKeeper.length - 1].index}.png`);

    imagesRef.putString(message, 'data_url').then(function(snapshot) {
    
        let currentTime = document.getElementById('video').currentTime;
        let coords = !d3.select('#push-div').empty() ? [d3.select('#push-div').style('left'), d3.select('#push-div').style('top')] : null;
    
        let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'doodle', d.tag, false);
        dataPush.doodle = true;
        dataPush.doodleName = snapshot.metadata.name;
        let refCom = firebase.database().ref(commentType);
                    
        refCom.push(dataPush);
        checkDatabase(firebase.database().ref(), updateSideAnnotations);
        clearSidebar();
    });
}

export function dropDown(div, optionArray, dropText, dropId, user, coords, callbackBool, questionBool){
   
    let dropdiv = div.append('div').classed(`dropdown ${dropId}`, true);
   // dropdiv.style('display', 'inline-block');
    let button = dropdiv.append('button').classed('btn dropbtn dropdown-toggle', true);
    let texting = button.text(dropText);
    button.node().value = dropText;
    let dropContent = dropdiv.append('div').attr('id', dropId).classed('dropdown-content', true);
    dropContent.append('a').text('text').attr('font-size', 11);
    let options = dropContent.selectAll('a').data(optionArray).join('a').text(d=> d.key);
    if(!callbackBool){
        options.append('svg').classed('color-box', true).append('rect').attr('width', 10).attr('height', 10).attr('x', 5).attr('y', 8).attr('fill', d=> d.color);
    }
   
    options.on('click', (d, i, n)=> {
       let testToo = button.text(d.key);

       console.log('dddddd',d)

       let commentType = d.key === 'annotation' ? "annotations" : "comments";

        button.node().value = d.key;
        dropContent.classed('show', false);
        if(callbackBool){
            d3.select('.template-wrap').selectAll('*').remove();
            div.select('.tabber').remove();
            div.select('#comment-submit-button').remove();
            d.tempCall(div, user, coords);

            let t1Ob = {label: "Push", callBack: formatPush}
            let t2Ob = {label: "Draw", callBack: formatCanvas}

            let form = radioBlob(div, t1Ob, t2Ob);

            let interactionVal = d3.select('.tabber').node().value;
            interactionVal === 't1' ? formatPush() : formatCanvas();

            let submit = div.append('button').attr('id', 'comment-submit-button').text('Add').classed('btn btn-secondary', true);

            console.log('data', d)
         

            submit.on('click', async ()=> {
        
                d3.event.stopPropagation();
                let tags = d3.select('.tag-wrap').selectAll('.badge');
              

                if(d.key === 'question'){
                 
                   if(d3.select('.q-tag-drop').select('button').node().value != 'biology' && d3.select('.q-tag-drop').select('button').node().value != 'animation'){
                    window.alert("select a type of question");

                   }else{

                    if(form.node().value === 't1'){
                    
                        let currentTime = document.getElementById('video').currentTime;
                        let coords = !d3.select('#push-div').empty() ? [d3.select('#push-div').style('left'), d3.select('#push-div').style('top')] : null;
                      
                        let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'push', d.tag, false);
                        let refCom = firebase.database().ref(commentType);                     
                        refCom.push(dataPush);
                        checkDatabase(firebase.database().ref(), updateSideAnnotations);
                        clearSidebar();
                        
    
                        }else{
                        
                            doodleKeeper(user, tags, d);
                  
                        }
                    } 

                }else{

                    if(form.node().value === 't1'){
                    
                        let currentTime = document.getElementById('video').currentTime;
                        let coords = !d3.select('#push-div').empty() ? [d3.select('#push-div').style('left'), d3.select('#push-div').style('top')] : null;
                        
                        let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'push', d.tag, commentType === "annotations");
                        
                        let refCom = firebase.database().ref(commentType);                     
                        refCom.push(dataPush);
                        checkDatabase(firebase.database().ref(), updateSideAnnotations);
                        clearSidebar();
    
                    }else{
                        doodleSubmit(commentType, user, tags, d);
                    }
                }
            });
        }
        if(questionBool){
            d3.select('.tag-wrap').remove();
            d3.select('.input-group.mb-3').remove();
            addTagFunctionality(div, [d.key, 'question']);
        }
    });

    button.on('click', (d, i, n)=> {
        if(dropContent.classed('show')){
            dropContent.classed('show', false);
        }else{
            dropContent.classed('show', true);
        }
    });
    options.raise()
    return button;
}

export function annotationBar(dbRef){

    let dataAnno = d3.entries(dbRef.comments)
    .map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    });

    let unresolved = dataAnno.filter(f=> f.resolved === false);
    
    let data = unresolved.filter(f=> f.reply === false).sort((a, b)=> a.videoTime - b.videoTime);

    let svg = d3.select('#annotation-layer').select('svg');

    let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]).range([3, svg.node().getBoundingClientRect().width]);
    let yScale = d3.scaleLinear().domain([0, 1]).range([10,15])

    let rect = svg.selectAll('.memo').data(data).join('rect').attr('width', 3).attr('height', 10).classed('memo', true);
    rect.style('fill', d=> `${tagOptions.filter(f=> f.key === d.initTag)[0].color}`);
    rect.attr('x', (d)=> scale(d.videoTime));
    rect.attr('y', 10);
  
    rect.on('mouseover', (d)=>{
        let wrap = d3.select('#sidebar').select('#annotation-wrap');
        let memoDivs = wrap.selectAll('.memo').filter(f=> f.key === d.key);
        memoDivs.classed('selected', true);
        memoDivs.nodes()[0].scrollIntoView();
    }).on('mouseout', (d)=> {
        let wrap = d3.select('#sidebar').select('#annotation-wrap');
        let memoDivs = wrap.selectAll('.memo').classed('selected', false);
       // memoDivs.nodes()[0].scrollIntoView();
    }).on('click', (d)=> {
        skipAheadCircle(d);
    });

    updateVideoAnn();
}
export function formatPush(){

    let canvas = d3.select('canvas').node()
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 0;
    canvas.width = 0;
   
    let interactionDiv = d3.select('#interaction');
    interactionDiv.style('width', `${document.getElementById('video').getBoundingClientRect().width}px`);
    interactionDiv.style('height', `${document.getElementById('video').getBoundingClientRect().height}px`);

    interactionDiv.on("click", function() {

        let event = d3.event.target;
        d3.event.stopPropagation();
        let coords = d3.mouse(this);
      
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
  
                if(d3.select('#push-div').empty() && d3.select('.tabber').node().value != 't2'){

                    let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
                    pushDiv.style('position', 'absolute')
                    pushDiv.style('top', (d)=> coords[1]+'px')
                    pushDiv.style('left', (d)=> coords[0]+'px')
                    let svg = pushDiv.append('svg').classed('push', true);
                    let circ = svg.append('circle').attr('r', 7).attr('cx', 6).attr('cy', d=> 7).attr('fill', 'cornflowerblue');

                        
                    let inputDiv = pushDiv.append('div').classed('comment-initiated', true);
                    inputDiv.append('h6').text('Comment for this spot');

                    // annotationInitiation(user, interactionDiv, coords);
                }else{
                    d3.select('#push-div').remove();
                }

                // User is signed in.
                } else {
                    console.log("NO USER", user);
                // No user is signed in.
                }
        });    
      });
}
export function formatCanvas(){

    let frame = 'video';
  
    let div = document.getElementById('main-wrap');

    d3.select('#interaction').selectAll('*').remove();
  
    let canvas = d3.select(div).select('canvas').node();
    canvas.setAttribute('id', 'vid-canvas');
  
    const context = canvas.getContext("2d");
    let videoDim = document.getElementById(frame).getBoundingClientRect();
    
  
    canvas.width = videoDim.width;
    canvas.height = videoDim.height;
  
    context.strokeStyle = "red";
    context.lineWidth = 5;
     
    var oldX, oldY;
    var draw=false;
  
    div.onmousedown=function(e) {
  
          let sideWidth = document.getElementById('sidebar').getBoundingClientRect();
  
          oldX = (e.pageX - (sideWidth.width + 11));
          oldY = (e.pageY - 40);
     
          draw=true;
    }
    div.onmousemove=function(e) {
  
      let sideWidth = document.getElementById('sidebar').getBoundingClientRect();
  
     // var mouseX = (e.pageX - sideWidth.width);
      var mouseX = (e.pageX - (sideWidth.width + 11));
      var mouseY = (e.pageY - 40);
    
        if(draw) {
          context.beginPath();
          context.moveTo(oldX, oldY);
          context.lineTo(mouseX, mouseY);
          context.stroke();
          context.closePath();
          oldX=mouseX;
          oldY=mouseY;
        }
      
    }
    div.onmouseup= async function(e) {
        draw=false;
       // shapeArray.push(context.save());

       let urlTest = canvas.toDataURL("image/png");

       var storage = firebase.storage();
       var storageRef = storage.ref();
     
       var message = urlTest;
       let listPromis = await Promise.resolve(storageRef.child('images/').listAll());

       doodleKeeper.push({index:listPromis.items.length, data:message});

      }
  
      return div;
  
  }