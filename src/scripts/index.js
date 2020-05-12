import '../styles/index.scss';
import * as vid from './video_player';
import { renderNav } from './sidebar';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'


/**
 * Firebase shenannigans
 */

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",
    authDomain: "covid-annotation.firebaseapp.com",
    databaseURL: "https://covid-annotation.firebaseio.com",
    projectId: "covid-annotation",
    storageBucket: "covid-annotation.appspot.com",
    messagingSenderId: "297369575962",
    appId: "1:297369575962:web:be320c5d86a0b719a467a3",
    measurementId: "G-H9JT7JZCZ8"
  };

  // Initialize Firebase
  let app = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var database = firebase.database();

  console.log('database', database, app);

/**
 * End Firebase shennanigans
 */

const nav = [
    {"key":"Draw", "callback":vid.formatCanvas}
]

let mainWrap = document.getElementById('main-wrap');
vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
//vid.formatCanvas(mainWrap);

renderNav(document.getElementById('sidebar'), nav)
