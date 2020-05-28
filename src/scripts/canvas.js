
import * as d3 from 'd3';
import * as firebase from 'firebase';
import { firebaseConfig, checkDatabase } from './firebaseStuff';
import { updateSideAnnotations } from './sidebar';
import { Math } from 'core-js';
import { skipAheadCircle } from './video_player';

export const tagOptions = [{key:'question', color:'red'}, {key:'issue', color:'purple'}, {key:'info', color:'orange'}, {key:'uncertainty', color:'green'}];

export function updateVideoAnn(){
   
    let svg = d3.select('#pushed-layer').select('svg')
    
    const video = document.querySelector('video');
    video.ontimeupdate = (event) => {
        let memoCirc = d3.select('#annotation-layer').selectAll('.memo');
        let memoDivs = d3.select('#sidebar').select('#annotation-wrap').selectAll('.memo');

        memoCirc.classed('selected', false);
        memoDivs.classed('selected', false);

        let timeRange = [video.currentTime - 1.5, video.currentTime + 1.5];
        let filtered = memoCirc.filter(f=> f.time < timeRange[1] && f.time > timeRange[0]).classed('selected', true);
        let selectedMemoDivs = memoDivs.filter(f=> f.time < timeRange[1] && f.time > timeRange[0]).classed('selected', true);

        let pushedG = svg.selectAll('g.pushed').data(filtered.data()).join('g').classed('pushed', true);
        pushedG.attr('transform', d=> `translate(${d.posLeft}, ${d.posTop})`)
        pushedG.selectAll('circle').data(d=> [d]).join('circle').attr('r', 10);

    
        if(selectedMemoDivs){
            selectedMemoDivs.nodes()[0].scrollIntoView();
            // d3.select('#sidebar').select('#annotation-wrap').node().scrollTop = selectedMemoDivs[0].node().getBoundingClientRect().y;
        }
        

    };
}

export function annotationMaker(user, currentTime, tag, coords, replyBool, replyTo){
    
    return {
        time: currentTime,
        comment: d3.select('#text-area-id').node().value,
        posTop: coords != null ? coords[1] : null,
        posLeft: coords != null ? coords[0] : null,
        upvote: 0,
        downvote: 0,
        tags: tag,
        replies: replyTo,
        reply: replyBool,
        uid: user.uid,
        displayName: user.displayName,
        resolved: false
    }
}

export function dropDown(div, optionArray, dropText, dropId){
   
    let dropdiv = div.append('div').classed(`dropdown ${dropId}`, true);
    dropdiv.style('display', 'inline-block')
    let button = dropdiv.append('button').classed('btn dropbtn dropdown-toggle', true).text(dropText);
    let dropContent = dropdiv.append('div').attr('id', dropId).classed('dropdown-content', true);
    dropContent.append('a').text('text').attr('font-size', 11);
    let options = dropContent.selectAll('a').data(optionArray).join('a').text(d=> d.key);
    options.append('svg').classed('color-box', true).append('rect').attr('width', 10).attr('height', 10).attr('x', 5).attr('y', 8).attr('fill', d=> d.color);

    options.on('click', (d, i, n)=> {
        
        button.text(d.key);
        dropContent.classed('show', false);
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

    let svg = d3.select('#annotation-layer').select('svg');

    let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]).range([3, svg.node().getBoundingClientRect().width]);
    let yScale = d3.scaleLinear().domain([0, 1]).range([10,15])
   
    function randomizer(){
        var min= -.03; 
        var max= .03;  
        var random = Math.random() * (+max - +min) + +min; 
        return random;
    }
    let jitterMove = d3.entries(dbRef).map(d=> {
        let value = d.value;
        value.key = d.key;
        return value;
    }).filter(f=> f.reply === false).map(m=> {
        m.y = Math.random();
        m.x = randomizer();
        return m;
    });

    let rect = svg.selectAll('.memo').data(jitterMove).join('rect').attr('width', 3).attr('height', 10).classed('memo', true);
    rect.attr('x', (d)=> scale(d.time + d.x));
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
        memoDivs.nodes()[0].scrollIntoView();
    }).on('click', (d)=> {
        skipAheadCircle(d);
    });

    updateVideoAnn();
}

export function formatPush(){
   
    let interactionDiv = d3.select('#interaction');
    interactionDiv.style('width', `${document.getElementById('video').getBoundingClientRect().width}px`);
    interactionDiv.style('height', `${document.getElementById('video').getBoundingClientRect().height}px`);
    let pushedBool = false;

    interactionDiv.on("click", function() {

        let event = d3.event.target;
        d3.event.stopPropagation();
        let coords = d3.mouse(this);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                    if(event == interactionDiv.node()){
                        if(!pushedBool){       
            
                            pushedBool = true;
                            let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]);
                            let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
                            pushDiv.style('position', 'absolute')
                            pushDiv.style('top', (d)=> coords[1]+'px')
                            pushDiv.style('left', (d)=> coords[0]+'px')
                            let svg = pushDiv.append('svg');
                            let circ = svg.append('circle').attr('r', 5).attr('cx', 5).attr('cy', d=> 5).attr('fill', 'purple');
            
                            let currentTime = document.getElementById('video').currentTime;
            
                            let inputDiv = pushDiv.append('div').classed('text-input', true);
                            inputDiv.append('text').text(`${user.displayName}@ ${currentTime} :`)
                            inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
                            // inputDiv.append('textarea').attr('id', 'tags').attr('placeholder', 'Tag');
                            let dropButton = dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');
                            let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);
                            submit.on('click', ()=> {
                                console.log(dropButton.text())
                                let dataPush = annotationMaker(user, currentTime, tagButton.text(), coords, false, null);

                                pushedBool = false;
                                d3.select('#push-div').remove();

                                let ref = firebase.database().ref();                     
                                ref.push(dataPush);
                              
                                checkDatabase(ref, updateSideAnnotations);

                            });
                    
                        }else{
                            pushedBool = false;
                            d3.select('#push-div').remove();
                        }
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
          console.log(e, this.offsetLeft)
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
        shapeArray.push(context.save());
        console.log(shapeArray, context.save())
      }
  
      return div;
  
  }