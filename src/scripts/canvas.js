
import * as d3 from 'd3';
import * as firebase from 'firebase';
import { Math } from 'core-js';
import { skipAheadCircle } from './video_player';
import { annotationType, tagOptions, annotationInitiation, addTagFunctionality, annoTypes, defaultTemplate } from './templates';
import { checkDatabase, dataKeeper } from './firebaseStuff';
import { updateSideAnnotations } from './sidebar';
import { noMarkFormat } from './commentFormat';
import { currentUserKeeper } from './annotation';

export const doodleKeeper = []

        /////parsing data//////
 function formatTime(d){

    return d.map(m=> {
        if(m.video_time.includes("-")){

            let range = m.video_time.split("-");
           
            let start = range[0].split(":");
            let startSec = (+start[0] * 60) + +start[1];
              
            let end = range[1].split(":");
            let endSec = (+end[0] * 60) + +end[1];
            m.seconds = [startSec, endSec];

        }else{
          
            let time= m.video_time.split(":");
         
            let seconds = (+time[0] * 60) + +time[1];
    
            m.seconds = [seconds];
        }
            
        return m;
    });
}

async function updateAnnotationSidebar(data, annoType, videoTime){

    let filteredAnno = data.filter(f=> {
        if(f.seconds.length > 1){
            return videoTime >= f.seconds[0] && videoTime <= f.seconds[1];
        }else{
            return f.seconds < timeRange[1] && f.seconds > timeRange[0];
        }
    })//.classed('selected', true);

    ///start drawing annotation 

    let annoDiv = d3.select('#annotation-sidebar').select('.anno-wrap').selectAll('div.anno').data(filteredAnno).join('div').classed('anno', true);
    let annoTime = annoDiv.selectAll('text.time').data(d=> [d]).join('text').classed('time', true).text(d=> d.video_time);
    let annoTypeHeader = annoDiv.selectAll('h6').data(d=> [d]).join('h6');
    let annoHeadSpan = annoTypeHeader.selectAll('span').data(d=> [d]).join('span').text(d=> d.annotation_type);
    annoHeadSpan.classed('badge badge-secondary', true);
    annoHeadSpan.style('background-color', (d)=> annoType.filter(f=> f.type === d.annotation_type)[0].color)
    let annoText = annoDiv.selectAll('text.anno-text').data(d=> [d]).join('text').text(d=> d.text_description).classed('anno-text', true);

    let annoRef = annoDiv.filter(f=> f.ref != "" && f.ref != "na").selectAll('text.ref').data(d=> [d]).join('text').classed('ref', true).text(d=> d.ref);

    let annoLink = annoDiv.filter(f=> f.url != "" && f.url != "na").selectAll('a.link').data(d=> [d]).join('a').classed('link', true).text(d=> d.url);
    annoLink.attr('href', d=> d.url);
    annoLink.attr('target', '_blank');

    d3.select('.annotation-wrap').selectAll('rect').filter(f=> {
        let currentData = filteredAnno.map(m=> m.text_description);
        return currentData.indexOf(f.text_description) > -1;
    }).style('fill-opacity', '1');

    d3.select('.annotation-wrap').selectAll('rect').filter(f=> {
        let currentData = filteredAnno.map(m=> m.text_description);
        return currentData.indexOf(f.text_description) === -1;
    }).style('fill-opacity', '.4');

}

export function formatVideoTime(videoTime){
    let time = parseInt(videoTime);
    var minutes = Math.floor(time / 60);
    var seconds = (time - (minutes * 60));

    return `${minutes}:${('0' + seconds).slice(-2)}`;
}

export async function updateVideoAnn(data, annoType){

    var storage = firebase.storage();
    var storageRef = storage.ref();
    let doods = await storageRef.child('images/').listAll();
   
    let svgTest = d3.select('#interaction').select('svg')
    let svg = svgTest.empty() ? d3.select('#interaction').append('svg') : svgTest;
    
    const video = document.querySelector('video');

    let vidDim = d3.select('video').node().getBoundingClientRect();
     
    let interDIV = d3.select('#interaction');
  //  interDIV.style('width', vidDim.width+'px').style('height', vidDim.height+'px');

    // let data = await d3.csv('./public/anno_sheet_ji_72020.csv');


    /////ANNOTATION STUFF///
   
        function formatSeconds(timeInSeconds) {
            const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
            return {
            minutes: result.substr(3, 2),
            seconds: result.substr(6, 2)
            };
        }

    updateAnnotationSidebar(data, annoType, 0)



    //  });

    video.ontimeupdate = async (event) => {
     
        // let newData = formatTime(data);

        let timeRange = [video.currentTime - 1.5, video.currentTime + 1.5];
        // let filteredAnno = data.filter(f=> {
        //     if(f.seconds.length > 1){
        //         return video.currentTime >= f.seconds[0] && video.currentTime <= f.seconds[1];
        //     }else{
        //         return f.seconds < timeRange[1] && f.seconds > timeRange[0];
        //     }
        // })//.classed('selected', true);

        // ///start drawing annotation 

        // let annoDiv = rightDiv.select('.anno-wrap').selectAll('div.anno').data(filteredAnno).join('div').classed('anno', true);
        // let annoTime = annoDiv.selectAll('text.time').data(d=> [d]).join('text').classed('time', true).text(d=> d.video_time);
        // let annoTypeHeader = annoDiv.selectAll('h6').data(d=> [d]).join('h6');
        // let annoHeadSpan = annoTypeHeader.selectAll('span').data(d=> [d]).join('span').text(d=> d.annotation_type);
        // annoHeadSpan.classed('badge badge-secondary', true);
        // annoHeadSpan.style('background-color', (d)=> annoType.filter(f=> f.type === d.annotation_type)[0].color)
        // let annoText = annoDiv.selectAll('text.anno-text').data(d=> [d]).join('text').text(d=> d.text_description).classed('anno-text', true);

        // let annoRef = annoDiv.filter(f=> f.ref != "" && f.ref != "na").selectAll('text.ref').data(d=> [d]).join('text').classed('ref', true).text(d=> d.ref);

        // let annoLink = annoDiv.filter(f=> f.url != "" && f.url != "na").selectAll('a.link').data(d=> [d]).join('a').classed('link', true).text(d=> d.url);
        // annoLink.attr('href', d=> d.url);
        // annoLink.attr('target', '_blank');

        updateAnnotationSidebar(data, annoType, video.currentTime);

        // d3.select('.annotation-wrap').selectAll('rect').filter(f=> {
        //     let currentData = filteredAnno.map(m=> m.text_description);
        //     return currentData.indexOf(f.text_description) > -1;
        // }).style('fill-opacity', '1');

        // d3.select('.annotation-wrap').selectAll('rect').filter(f=> {
        //     let currentData = filteredAnno.map(m=> m.text_description);
        //     return currentData.indexOf(f.text_description) === -1;
        // }).style('fill-opacity', '.4');

        ///END ANNOTATION
        let annotations = d3.entries(dataKeeper[dataKeeper.length - 1].annotations).map(m=> m.value);
    
        let annoTest = annotations.filter((f,i)=> {
            let time = JSON.parse(f.videoTime)

            if(time.length > 1){
                return time[0] <= video.currentTime && time[1] >= video.currentTime;
            }else{
                return time[0] < timeRange[1] && time[0] > timeRange[0];
            }
        });

        let memoCirc = d3.select('#annotation-layer').selectAll('.memo');
        let memoDivs = d3.select('#comment-sidebar').select('#annotation-wrap').selectAll('.memo');

        memoCirc.classed('selected', false);
        memoDivs.classed('selected', false);

        let filtered = memoCirc.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);
        let selectedMemoDivs = memoDivs.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);
       
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

        let annoDoodles = annoTest.filter(f=> f.commentMark === "doodle").map(async (dood)=> {
            let urlDood = await doods.items.filter(f=>f.location['path'] === `images/${dood.doodleName}`)[0].getDownloadURL();
            return urlDood;
        });

        if(d3.select('.show-comments').select('.form-check').select('.form-check-input').node().checked){
           
            let images = interDIV.selectAll('.doodles').data(await Promise.all(test)).join('img').classed('doodles', true);
            images.attr('src', d=> d);
    
            let annoImages = interDIV.selectAll('.anno-doodles').data(await Promise.all(annoDoodles)).join('img').classed('anno-doodles', true);
            annoImages.attr('src', d=> d);
    
            let pushedG = svg.selectAll('g.pushed').data(filteredPushes.data()).join('g').classed('pushed', true);
            
            let circ = pushedG.selectAll('circle').data(d=> [d]).join('circle')
            circ.attr('r', 10);
            circ.attr('cx', d=> d.posLeft);
            circ.attr('cy', d=> d.posTop);
            circ.attr('fill', 'red');
            circ.on('mouseover', (d)=>{
                let wrap = d3.select('#comment-sidebar').select('#annotation-wrap');
                let memoDivs = wrap.selectAll('.memo').filter(f=> f.key === d.key);
                memoDivs.classed('selected', true);
                memoDivs.nodes()[0].scrollIntoView({behavior: "smooth"});
    
            }).on('mouseout', (d)=> {
                let wrap = d3.select('#comment-sidebar').select('#annotation-wrap');
                let memoDivs = wrap.selectAll('.memo').classed('selected', false);
            });

           // d3.select('#comment-sidebar').select('#annotation-wrap').node().scrollTop -= 60;
    
            if(!selectedMemoDivs.empty()){
                selectedMemoDivs.nodes()[0].scrollIntoView();
            }
    
            let annotationGroup = svg.selectAll('g.annotations').data(annoTest).join('g').classed('annotations', true);
            let annotationMark = annotationGroup.filter(f=> f.commentMark === 'push').selectAll('circle').data(d=> [d]).join('circle').attr('r', 5).attr('cx', d=> d.posLeft).attr('cy',d=>  d.posTop);
            let annotationText = annotationGroup.selectAll('text').data(d=> [d]).join('text')
            .text(d=> d.comment)
            .classed('annotation-label', true)
            .attr('x', d=> {
                if(d.commentMark === 'push'){
                    let noPx = parseInt(d.posLeft.replace(/px/,""));
                    return noPx+10+"px";
                }else{
                     return '50px'
                }
            })
             .attr('y',d=>  {
                 if(d.commentMark === 'push'){
                    return d.posTop;
                 }else{
                     return '50px'
                 }
            });


            
        }
    };
}

export function clearSidebar(){

    d3.select('#push-div').remove(); 
    d3.select('.template-wrap').remove();//.selectAll('*').remove();
    d3.select('.media-tabber').remove();
    d3.select('.time-tabber').remove();
    d3.select('form').remove();
    d3.select('#comment-submit-button').remove();
    d3.select('#time-wrap').select('svg.range-svg').remove();
    d3.select('.dropdown.ann-type-drop').remove();//.select('button').text('Type of Comment').style('color', 'gray');
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
        tags: tag === '' ? 'none' : tag,
        replies: replyTo,
        reply: replyBool,
        uid: user.uid,
        displayName: user.displayName,
        resolved: false,
        initTag: initTag? initTag : 'other',
        specialAnno: annoBool,
    }
}

export function radioBlob(div, t1Ob, t2Ob, t3Ob, className){

    let form = div.append('form').classed(className, true);
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

    let labelThree = form.append('label').classed('container', true).text(t3Ob.label);
    labelThree.node().for = 't3';

    let inputThree = labelThree.append('input').attr('id', 't3')
    inputThree.node().name = 'radio';//.attr('name', 'comment')
    inputThree.node().type = 'radio';//.attr('type', 'radio');
    inputThree.node().checked = false;

    let inputCheck3 = labelThree.append('span').classed('checkmark', true);

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

    inputThree.on('click', ()=> {

        inputOne.node().checked = false;
        inputTwo.node().checked = false;
        inputThree.node().checked = true;
        form.node().value = 't3';
        t3Ob.callBack();
   // }
});

   return form;

}

export function doodleSubmit(commentType, user, tags, d, currentTime){

    var storage = firebase.storage();
    var storageRef = storage.ref();

    var message = doodleKeeper[doodleKeeper.length - 1].data;
   
    var imagesRef = storageRef.child(`images/im-${user.uid}-${doodleKeeper[doodleKeeper.length - 1].index}.png`);

    imagesRef.putString(message, 'data_url').then(function(snapshot) {
    
      //  let currentTime = document.getElementById('video').currentTime;
        let coords = !d3.select('#push-div').empty() ? [d3.select('#push-div').style('left'), d3.select('#push-div').style('top')] : null;
    
        let dataPush = annotationMaker(user, currentTime, tags.data().toString(), coords, false, null, 'doodle', d === null ? 'other' : d.tag, false);
        dataPush.doodle = true;
        dataPush.doodleName = snapshot.metadata.name;
       
        let refCom = firebase.database().ref(commentType);
                    
        refCom.push(dataPush);
        checkDatabase(firebase.database().ref(), updateSideAnnotations);
        clearSidebar();
    });
}

export async function annotationBar(dbRef){

    let dataAnno = d3.entries(dbRef.comments)
    .map(m=> {
        let value = m.value;
        value.key = m.key;
        return value;
    });

    let unresolved = dataAnno.filter(f=> f.resolved === false);
    
    let data = unresolved.filter(f=> f.reply === false).sort((a, b)=> a.videoTime - b.videoTime);

    let svg = d3.select('#annotation-layer').select('svg');

    let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]).range([3, d3.select('video').node().getBoundingClientRect().width]);
    let yScale = d3.scaleLinear().domain([0, 1]).range([10,15]);

    let commentGroup = svg.selectAll('g.comment-wrap').data([data]).join('g').classed('comment-wrap', true);

    let rect = commentGroup.selectAll('.memo').data(d=>d).join('rect').style('width', '3px').attr('height', 10).classed('memo', true);
    // rect.style('fill', d=> `${tagOptions.filter(f=> f.key === d.initTag)[0].color}`);
    // rect.style('fill', d=> `${tagOptions.filter(f=> f.key === d.initTag)[0].color}`);
   // rect.style('fill', d=> `#fff`);
    rect.attr('x', (d)=> scale(d.videoTime));
    rect.attr('y', 10);
  
    rect.on('mouseover', (d)=>{

        let wrap = d3.select('#comment-sidebar').select('#annotation-wrap');
        let memoDivs = wrap.selectAll('.memo').filter(f=> f.key === d.key);
        memoDivs.classed('selected', true);
        memoDivs.nodes()[0].scrollIntoView();

    }).on('mouseout', (d)=> {

        let wrap = d3.select('#comment-sidebar').select('#annotation-wrap');
        let memoDivs = wrap.selectAll('.memo').classed('selected', false);
       // memoDivs.nodes()[0].scrollIntoView();

    }).on('click', (d)=> {
        skipAheadCircle(d.videoTime);
    });

    let annotationData = formatTime(await d3.csv('./public/anno_sheet_ji_72020.csv')).map((m, i)=> {
        m.index = i;
        return m;
    });

    let annoType = await annoTypes();

    //let formattedAnnoData = formatTime(annotationData);

    let annotationGroup = svg.selectAll('g.annotation-wrap').data([annotationData]).join('g').classed('annotation-wrap', true);

    annotationGroup.attr('transform', 'translate(0, 35)')

    let annotationRects = annotationGroup.selectAll('rect').data(d=> d).join('rect');
    annotationRects.attr('width', (d)=>{
        if(d.seconds.length > 1){
            let calcWidth = scale(d.seconds[1]) - scale(d.seconds[0]);
            return calcWidth;
        }else{
            return 3;
        }
    });
    annotationRects.style('height', '6px');
    annotationRects.style('stroke', '#fff');
    annotationRects.style('stroke-width', '1px');
    annotationRects.attr('fill', (d)=> {
        let test = annoType.filter(f=> f.type === d.annotation_type)[0].color;
        return test;
    });

    annotationRects.attr('y', (d, i, n)=> {
        if(i > 0){
            let chosen = d3.selectAll(n).data().filter((f, j)=> {
                return j < i && f.seconds[1] > d.seconds[0]
            });
     
            return 7 * chosen.length
        }else{
            return 0;
        }
    });

    annotationRects.attr('x', d=> scale(d.seconds[0]));

    annotationRects.on('mouseover', (d, i, n)=> {
        // let wrap = d3.select('#annotation-sidebar');
        // let annoDivs = wrap.selectAll('.anno').filter(f=> f.text_description === d.text_description);
        // memoDivs.classed('selected', true);
        // memoDivs.nodes()[0].scrollIntoView();
        d3.select(n[i]).style('fill-opacity', '1')
    })
    .on('mouseout', (d, i, n)=> {
        d3.select(n[i]).style('fill-opacity', '.4')
    })
    .on('click', (d)=> {
  
        skipAheadCircle(parseFloat(d.seconds[0]));
    })

    updateVideoAnn(annotationData, annoType);
}
export function clearBoard(){

    let canvas = d3.select('canvas').node()
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    
    let interactionDiv = d3.select('#interaction');
    interactionDiv.selectAll('*').remove();

}
export function formatPush(){

    clearBoard();

    let canvas = d3.select('canvas').node()
    canvas.height = 0;
    canvas.width = 0;
   
    let interactionDiv = d3.select('#interaction');
    
   // interactionDiv.style('width', `${document.getElementById('video').getBoundingClientRect().width}px`);
   // interactionDiv.style('height', `${document.getElementById('video').getBoundingClientRect().height}px`);

    let clickedBool = false;

    if(d3.select('.add-comment').select('button').node().value === 'on' && d3.select('.media-tabber').node().value === 't2'){

        interactionDiv.on('mouseenter', function(){
            let coords = d3.mouse(this);
    
            //interactionDiv.classed('crosshair', true);
            if(d3.select('#push-div').empty() && !d3.select('.media-tabber').empty() && d3.select('.media-tabber').node().value === 't2'){
                let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
                pushDiv.style('position', 'absolute')
                pushDiv.style('top', (d)=> (coords[1]-10)+'px')
                pushDiv.style('left', (d)=> (coords[0]-10)+'px')
                let push = pushDiv.append('div').classed('push', true);
                push.append('i').classed('fas fa-map-pin', true);
            }
        });
    
        interactionDiv.on('mousemove', function() {
    
            let coords = d3.mouse(this);
            let pushDiv = d3.select('#push-div');
            if(!pushDiv.empty() && !clickedBool){
                pushDiv.style('top', (d)=> (coords[1]-10)+'px');
                pushDiv.style('left', (d)=> (coords[0]-10)+'px');
            }
        });
    
        interactionDiv.on('mouseleave', function(){
            if(!clickedBool){
                d3.select('#push-div').remove();
            }
        }); 
    }

    interactionDiv.on("click", function() {

        let event = d3.event.target;
        d3.event.stopPropagation();
        let coords = d3.mouse(this);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
  
                if(clickedBool === false && d3.select('.media-tabber').node().value === 't2'){

                    let inputDiv = d3.select('#push-div').append('div').classed('comment-initiated', true);
                    inputDiv.append('h6').text('Comment for this spot');
                    inputDiv.style('margin-left', '15px');
                    inputDiv.style('margin-top', '5px');

                }else{
                    d3.select('#push-div').select('.comment-initiated').remove();
                }
                clickedBool === true ? clickedBool = false : clickedBool = true;

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

    clearBoard();

    let interactionDiv = d3.select('#interaction');
    interactionDiv.on('mouseenter', function(){
        let coords = d3.mouse(this);

        //interactionDiv.classed('crosshair', true);
        if(d3.select('#push-div').empty() && d3.select('.media-tabber').node().value === 't3'){
            let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
            pushDiv.style('position', 'absolute')
            // pushDiv.style('top', (d)=> (coords[1]-10)+'px')
            // pushDiv.style('left', (d)=> (coords[0]-10)+'px')
            pushDiv.style('top', (d)=> (coords[1])+'px')
            pushDiv.style('left', (d)=> (coords[0])+'px')
            let push = pushDiv.append('div').classed('push', true);
            push.append('i').classed('fas fa-paint-brush', true);
        }
    });

    let leftSpace = d3.select('#annotation-sidebar').node().getBoundingClientRect().width;

    interactionDiv.on('mousemove', function() {
        let coords = d3.mouse(this);
        let pushDiv = d3.select('#push-div');
        if(!pushDiv.empty()){
            // pushDiv.style('top', (d)=> (coords[1]-10)+'px');
            // pushDiv.style('left', (d)=> (coords[0]-10)+'px');
            pushDiv.style('top', (d)=> (coords[1])+'px');
            pushDiv.style('left', (d)=> (coords[0] + leftSpace)+'px');
        }
    });

    interactionDiv.on('mouseleave', function(){
        
        d3.select('#push-div').remove();
        
    }); 
  
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
  
          let sideWidth = document.getElementById('comment-sidebar').getBoundingClientRect();
  
          oldX = (e.pageX - (sideWidth.width + 11));
          oldY = (e.pageY - 40);
     
          draw=true;
    }
    div.onmousemove=function(e) {
  
      let sideWidth = document.getElementById('comment-sidebar').getBoundingClientRect();
  
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