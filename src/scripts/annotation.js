import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';
import { renderNav, toggleMagic, updateSideAnnotations} from './sidebar';
import * as firebase from 'firebase';
import "firebase/auth";
import { firebaseConfig, checkDatabase, dataKeeper } from './firebaseStuff';
import { annotationType, defaultTemplate, annotationTemplate } from './templates';
import { dropDown, clearSidebar } from './canvas';
import { image } from 'd3';
import { specialUserCheck, addCommentButton } from './topToolbar';

export const currentUserKeeper = [];
export const specialUserKeeper = [];



if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){
    vid.formatVidPlayer(mainWrap, './public/entryComp_071420.mp4');
    let vidDim = d3.select('video').node().getBoundingClientRect();

    let width = (window.innerWidth - (vidDim.x + vidDim.width));
    d3.select('#annotation-right').style('left', (vidDim.x + vidDim.width)+"px");
    d3.select('#annotation-right').style('height', (vidDim.height)+"px");
    d3.select('#annotation-right').style('min-width', width+"px");
    d3.select('#annotation-right').select('#control').style('margin-left', ((width/2)-10)+"px");

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
          let ref = firebase.database().ref();  
        
          checkDatabase(ref, updateSideAnnotations);
          checkDatabase(ref, specialUserCheck);

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

  

