import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';
import { renderNav, toggleMagic } from './sidebar';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'
import { firebaseConfig } from './firebaseStuff';


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

const nav = [
    {"key":"Draw", "callback":vid.formatCanvas, "selectedBool":false}
]

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){
    vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
    //renderNav(d3.select('.button-wrap').node(), nav);
    toggleMagic();
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userWrap = d3.select('.user-wrap');
        userWrap.append('text').text(`Signed in as: ${user.displayName}`)
      // User is signed in.
    } else {
        console.log("NO USER", user);
      // No user is signed in.
    }
  });

