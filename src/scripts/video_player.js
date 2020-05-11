import * as d3 from 'd3';

export function formatVidPlayer(div){

    let video = d3.select(div).select('video');
    video.node().controls = true;
    let src = video.append('source');

    src.attr('src', './public/covid.mp4');
    src.attr('type', "video/mp4");

    return div;
     
}

export function formatCanvas(div){

    let canvas = d3.select(div).select('canvas');
    canvas.attr('id', 'vid-canvas');

    return div;

}





