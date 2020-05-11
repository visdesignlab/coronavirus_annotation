import '../styles/index.scss';
import * as vid from './video_player';
import { renderNav } from './sidebar';

const nav = [
    {"key":"Draw", "callback":vid.formatCanvas}
]

let mainWrap = document.getElementById('main-wrap');
vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
//vid.formatCanvas(mainWrap);

renderNav(document.getElementById('sidebar'), nav)
