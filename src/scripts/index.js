import '../styles/index.scss';

import * as vid from './video_player';

console.log('webpack starterkit');

let mainWrap = document.getElementById('main-wrap');
// let vidWrap = document.getElementById('vid-wrap');
// let canvasWrap = document.getElementById('canvas-wrap');

vid.formatVidPlayer(mainWrap);
vid.formatCanvas(mainWrap);
