import * as d3 from 'd3';

export function formatVidPlayer(div){

    let video = d3.select(div).select('video');
    video.attr('id', 'video');

    video.node().controls = true;
    let src = video.append('source');

    src.attr('src', './public/spike_protein_fusion_movie.mp4');
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
    context.lineWidth = 5;
   
    var oldX, oldY;
    var draw=false;

    div.onmousedown=function(e) {

        oldX = (e.pageX);
        oldY = (e.pageY);
   
        draw=true;
    }
    div.onmousemove=function(e) {

    var mouseX = (e.pageX);
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
    }

    return div;

}






