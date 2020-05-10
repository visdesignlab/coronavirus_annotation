import '../styles/index.scss';

import * as vid from './video_player';

console.log('webpack starterkit');

let mainWrap = document.getElementById('main-wrap');

vid.addVidPlayer(mainWrap);
