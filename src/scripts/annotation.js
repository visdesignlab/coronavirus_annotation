import '../styles/index.scss';
import * as vid from './video_player';
import { renderNav } from './sidebar';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'
import { firebaseConfig } from './firebaseStuff';




if(!firebase.apps.length){
    console.log('is this firing?')
    firebase.initializeApp(firebaseConfig)
}

const nav = [
    {"key":"Draw", "callback":vid.formatCanvas}
]

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){
    vid.formatVidPlayer(mainWrap, './public/rick-roll.mp4');
    renderNav(document.getElementById('sidebar'), nav);
    var user = firebase.auth();
    console.log(user.currentUser, user, firebase.apps)
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("YES USER", user);
      // User is signed in.
    } else {
        console.log("NO USER", user);
      // No user is signed in.
    }
  });

// if (user) {
//   // User is signed in.
// } else {
//   // No user is signed in.
// }