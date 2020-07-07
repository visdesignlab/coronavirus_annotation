import * as d3 from 'd3';
import { updatePlayButton, togglePlay } from "./video_player";
import { annotationType, defaultTemplate } from './templates';
import { currentUserKeeper } from './annotation';
import { dropDown, radioBlob, formatPush, formatCanvas } from './canvas';


{/* <div id="time-wrap">
<div id="control">
  <svg>
    <g id="play-r" viewBox="0 0 24 24">
      <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
    </g>
    <g id="pause-r" class="hidden" viewBox="0 0 24 24">
      <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
    </g>
  </svg>
</div>
<div id="time-update"><text>00:00</text></div>
</div> */}

export function formatCommentBox(div){
    div.append('div').classed('template-wrap', true);
    defaultTemplate(div);

    let t1Ob = {label: "Push", callBack: formatPush};
    let t2Ob = {label: "Draw", callBack: formatCanvas};


    let form = radioBlob(div, t1Ob, t2Ob, 'media-tabber');

    let interactionVal = d3.select('.media-tabber').node().value;
    interactionVal === 't1' ? formatPush() : formatCanvas();

    let submit = div.append('button').attr('id', 'comment-submit-button').text('Add').classed('btn btn-secondary', true);
}

export function formatTimeControl(div){

    let timeWrap = div.append('div').attr('id', 'time-wrap');
    let controlDiv = timeWrap.append('div').attr('id', 'control');
    let svg = controlDiv.append('svg');

    let playR = svg.append('g').attr('id', 'play-r');
    playR.node().viewBox = "0 0 24 24";
    playR.append('path').attr("d", "M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z");

    let pauseR = svg.append('g').attr('id', 'pause-r').classed('hidden', true);
    pauseR.node().viewBox = "0 0 24 24";
    pauseR.append('path').attr("d", "M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z");

    let timeUpdate = timeWrap.append('div').attr('id', 'time-update');
    timeUpdate.append('text').text('00:00');

    updatePlayButton();

    d3.select("#play-r").on('click', togglePlay);
    d3.select("#pause-r").on('click', togglePlay);
    
}