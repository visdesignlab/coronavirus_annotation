import '../styles/index.scss';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'
import { firebaseConfig, uiConfig } from './firebaseStuff';


/**
 * Firebase shenannigans
 */



// Initialize Firebase
//export const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.apps[0];
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

firebase.analytics();

var database = firebase.database();

export const authOb = firebase.auth();

  // Initialize the FirebaseUI Widget using Firebase.
export const ui = new firebaseui.auth.AuthUI(authOb);


// The start method will wait until the DOM is loaded.
ui.start('#sign-in-container', uiConfig);




 

/**
 * End Firebase shennanigans
 */



// const nav = [
//     {"key":"Draw", "callback":vid.formatCanvas}
// ]

// let mainWrap = document.getElementById('main-wrap');
// vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
// //vid.formatCanvas(mainWrap);

// renderNav(document.getElementById('sidebar'), nav)
