import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';
import { renderNav, toggleMagic, updateSideAnnotations} from './sidebar';
import * as firebase from 'firebase';
import "firebase/auth";
import { firebaseConfig, checkDatabase, dataKeeper } from './firebaseStuff';
import { annotationType, defaultTemplate, annotationTemplate, annoTypes } from './templates';
import { dropDown, clearSidebar } from './canvas';
import { image } from 'd3';
import { specialUserCheck, addCommentButton } from './topToolbar';

export const currentUserKeeper = [];
export const specialUserKeeper = [];

var playing = vid.playing;

export let comments;


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){

    vid.formatVidPlayer(mainWrap, './public/entry_notflat_082020.mp4', true);

    d3.select('#interaction')
    .on('mousemove', (d, i, n)=> vid.mouseMoveVideo(d3.mouse(n[i])))
    .on('click', (d, i, n) => vid.videoClicked(d3.mouse(n[i])));

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
          let ref = firebase.database().ref();  

          // let annotationData = formatTime(await d3.csv('./public/anno_sheet_ji_72020.csv')).map((m, i)=> {
          //   m.index = i;
          //   return m;
          // });
    
          checkDatabase(ref, updateSideAnnotations, null);
          checkDatabase(ref, specialUserCheck, null);

          d3.select('.add-comment').select('button').on('click', (d, i, n)=> addCommentButton(d, i, n));

          clearSidebar();

        // User is signed in.
      } else {
        console.log("NO USER", user);
        // No user is signed in.
      }
        currentUserKeeper.push(user);

    });
}

  

