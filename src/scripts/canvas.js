
import * as d3 from 'd3';
import * as firebase from 'firebase';
import { Math } from 'core-js';
import { skipAheadCircle } from './video_player';
import { annotationType, tagOptions, annotationInitiation } from './templates';
import { checkDatabase } from './firebaseStuff';
import { updateSideAnnotations } from './sidebar';


export function formatVideoTime(videoTime){
    let time = parseInt(videoTime);
    var minutes = Math.floor(time / 60);
    var seconds = (time - (minutes * 60));
    console.log(`${minutes}:${('0' + seconds).slice(-2)}`);
    return `${minutes}:${('0' + seconds).slice(-2)}`;
}

export function updateVideoAnn(){
   
    let svg = d3.select('#interaction').select('svg')
    
    const video = document.querySelector('video');
    video.ontimeupdate = (event) => {
        let memoCirc = d3.select('#annotation-layer').selectAll('.memo');
        let memoDivs = d3.select('#sidebar').select('#annotation-wrap').selectAll('.memo');

        memoCirc.classed('selected', false);
        memoDivs.classed('selected', false);

        let timeRange = [video.currentTime - 1.5, video.currentTime + 1.5];
        let filtered = memoCirc.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);
        let selectedMemoDivs = memoDivs.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);

        let pushedG = svg.selectAll('g.pushed').data(filtered.data()).join('g').classed('pushed', true);
        pushedG.attr('transform', d=> `translate(${d.posLeft}, ${d.posTop})`)
        let circ = pushedG.selectAll('circle').data(d=> [d]).join('circle')
        circ.attr('r', 10);
        circ.attr('fill', d=> tagOptions.filter(f=> f.key === d.tags)[0].color)
        circ.on('mouseover', (d)=>{
            let wrap = d3.select('#sidebar').select('#annotation-wrap');
            let memoDivs = wrap.selectAll('.memo').filter(f=> f.key === d.key);
            memoDivs.classed('selected', true);
            memoDivs.nodes()[0].scrollIntoView();

        }).on('mouseout', (d)=> {

            let wrap = d3.select('#sidebar').select('#annotation-wrap');
            let memoDivs = wrap.selectAll('.memo').classed('selected', false);

        });

    
        if(selectedMemoDivs){
          
            selectedMemoDivs.nodes()[0].scrollIntoView();
            // d3.select('#sidebar').select('#annotation-wrap').node().scrollTop = selectedMemoDivs[0].node().getBoundingClientRect().y;
        }
        

    };
}

export function annotationMaker(user, currentTime, tag, coords, replyBool, replyTo){

    return {
        videoTime: currentTime,
        postTime: new Date().toString(), //.toDateString(),
        comment: d3.select('#text-area-id').node().value,
        commentMark: 'push',
        posTop: coords != null ? coords[1] : null,
        posLeft: coords != null ? coords[0] : null,
        upvote: 0,
        downvote: 0,
        tags: tag === 'Tag' ? 'none' : tag,
        replies: replyTo,
        reply: replyBool,
        uid: user.uid,
        displayName: user.displayName,
        resolved: false
    }
}

export function radioBlob(div){

    let form = div.append('form').classed('tabber', true);
    let labelOne = form.append('label')
    labelOne.text('Push');
    labelOne.node().for = 't1';

    let inputOne = form.append('input').attr('id', 't1')
    inputOne.node().name = 'comment';//'name', 'comment')
    inputOne.node().type = 'radio';
    inputOne.node().checked = true;
    form.node().value = 't1';

    let labelTwo = form.append('label').text('Draw');
    labelTwo.node().for = 't2';

    let inputTwo = form.append('input').attr('id', 't2')
    inputTwo.node().name = 'comment';//.attr('name', 'comment')
    inputTwo.node().type = 'radio';//.attr('type', 'radio');
    inputTwo.node().checked = false;


    let blob = form.append('div').classed('blob', true);

    labelOne.on('click', ()=> {
        if(inputOne.node().checked == false){
            inputOne.node().checked = true;
            inputTwo.node().checked = false;
         
            form.node().value = 't1';

            formatPush();
            
        }
    })

    labelTwo.on('click', ()=> {
        if(inputTwo.node().checked === false){
            console.log('this reaches')
            inputOne.node().checked = false;
            inputTwo.node().checked = true;
          
            form.node().value = 't2';
           
            formatCanvas();
        }
    });

   return form;

}

export function dropDown(div, optionArray, dropText, dropId, user, coords, callbackBool){
   
    let dropdiv = div.append('div').classed(`dropdown ${dropId}`, true);
    dropdiv.style('display', 'inline-block')
    let button = dropdiv.append('button').classed('btn dropbtn dropdown-toggle', true).text(dropText);
    let dropContent = dropdiv.append('div').attr('id', dropId).classed('dropdown-content', true);
    dropContent.append('a').text('text').attr('font-size', 11);
    let options = dropContent.selectAll('a').data(optionArray).join('a').text(d=> d.key);
    if(!callbackBool){
        options.append('svg').classed('color-box', true).append('rect').attr('width', 10).attr('height', 10).attr('x', 5).attr('y', 8).attr('fill', d=> d.color);
    }
   
    options.on('click', (d, i, n)=> {
        button.text(d.key);
        button.node().value = d.key;
        dropContent.classed('show', false);
        if(callbackBool){
            d3.select('.template-wrap').selectAll('*').remove();
            div.select('.tabber').remove();
            div.select('#comment-submit-button').remove();
            d.tempCall(div, user, coords);

            let form = radioBlob(div, []);

            let interactionVal = d3.select('.tabber').node().value;
            interactionVal === 't1' ? formatPush() : formatCanvas();

            let submit = div.append('button').attr('id', 'comment-submit-button').text('Add').classed('btn btn-secondary', true);

            console.log('form',form.node().value)

            submit.on('click', ()=> {
        
                d3.event.stopPropagation();

                if(form.node().value === 't1'){
                    

                    console.log('d',d)
                    let currentTime = document.getElementById('video').currentTime;
                    let coords = [d3.select('#push-div').style('left'), d3.select('#push-div').style('top')];
                    let dataPush = annotationMaker(user, currentTime, d.tag, coords, false, null);
                    
                    let refCom = firebase.database().ref("comments");                     
                    refCom.push(dataPush);
                    checkDatabase(firebase.database().ref(), updateSideAnnotations);
                    d3.select('#push-div').remove(); 

                }else{
                    console.log('draw would be submitted here', d);
                }

                d3.select('.template-wrap').selectAll('*').remove();
                d3.select('form').remove();
                d3.select('#comment-submit-button').remove();

                
        
            });


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
    rect.attr('x', (d)=> scale(d.videoTime));
    rect.attr('y', 10);
    rect.attr('fill', (d)=> tagOptions.filter(f=> f.key === d.tags)[0].color);
   // rect.style('stroke', (d)=> `${tagOptions.filter(f=> f.key === d.tags)[0].color}`);

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

    console.log('testing')
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
  
          oldX = (e.pageX - sideWidth.width);
          oldY = (e.pageY);
     
          draw=true;
      }
      div.onmousemove=function(e) {
  
      let sideWidth = document.getElementById('sidebar').getBoundingClientRect();
  
      var mouseX = (e.pageX - sideWidth.width);
      var mouseY = (e.pageY);
    
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
      div.onmouseup=function(e) {
        draw=false;
       // shapeArray.push(context.save());
       
      }
  
      return div;
  
  }