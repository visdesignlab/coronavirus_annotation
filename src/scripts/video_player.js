import * as d3 from 'd3';

export function addVidPlayer(div){
  
    let player = d3.select(div).append('video');
    player.node().controls = true;
    let src = player.append('source');
    src.attr('src', './public/covid.mp4');
    src.attr('type', "video/mp4");

    return player;
    
}





