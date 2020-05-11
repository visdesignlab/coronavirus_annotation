import * as d3 from 'd3';

export function formatVidPlayer(div){

    let video = d3.select(div).select('video');
    video.attr('id', 'video');

    video.node().controls = true;
    let src = video.append('source');

    src.attr('src', './public/covid.mp4');
    src.attr('type', "video/mp4");

    return div;
     
}

export function formatCanvas(div){

    let canvas = d3.select(div).select('canvas').node();
    canvas.setAttribute('id', 'vid-canvas');

    const context = canvas.getContext("2d");
    let videoDim = document.getElementById('video').getBoundingClientRect();
    console.log(video, 'size')

    canvas.width = videoDim.width;
    canvas.height = videoDim.height;

    context.strokeStyle = "red";

    var oldX, oldY;
    var draw=false;

    function oMousePos(element, evt) {
        var ClientRect = element.getBoundingClientRect();
             return { //objeto
             x: Math.round(evt.clientX - ClientRect.left),
             y: Math.round(evt.clientY - ClientRect.top)
        }
    }  

    div.onmousedown=function(e) {

        oldX = (e.pageX - this.offsetLeft);
        oldY = (e.pageY - this.offsetTop);
   
        draw=true;
    }
    div.onmousemove=function(e) {
      
      var mouseX = (e.pageX - this.offsetLeft);
      var mouseY = (e.pageY - this.offsetTop);
    
      if(draw) {
        console.log(e)
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
    }

    return div;

}






