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

export function formatCommentBox(){

}

export function formatTimeControl(div){

    let timeWrap = div.append('div').attr('id', 'time-wrap');
    let controlDiv = timeWrap.append('div').attr('id', 'control');
    let svg = controlDiv.append('svg');

    let playR = svg.append('g').attr('id', 'play-r');
    playR.node().viewBox = "0 0 24 24";
    playR.append('path').node().d = "M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z";

    let pauseR = svg.append('g').attr('id', 'pause-r').classed('hidden', true);
    pauseR.node().viewBox = "0 0 24 24";
    pauseR.append('path').node().d = "M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z";

    let timeUpdate = timeWrap.append('div').attr('id', 'time-update');
    timeUpdate.append('text').text('00:00');




}