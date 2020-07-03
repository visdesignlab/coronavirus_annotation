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

export const currentUserKeeper = [];
export const specialUserKeeper = [];



if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){
    vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
    let vidDim = d3.select('video').node().getBoundingClientRect();

    let width = (window.innerWidth - (vidDim.x + vidDim.width));
    d3.select('#annotation-right').style('left', (vidDim.x + vidDim.width)+"px");
    d3.select('#annotation-right').style('height', (vidDim.height)+"px");
    d3.select('#annotation-right').style('min-width', width+"px");

    d3.select('#annotation-right').select('#control').style('margin-left', ((width/2)-10)+"px");

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        console.log('this is firing', user)
        
          let ref = firebase.database().ref();  
        
          checkDatabase(ref, updateSideAnnotations);
          checkDatabase(ref, specialUserCheck);
          clearSidebar();

        // User is signed in.
      } else {
          console.log("NO USER", user);
        // No user is signed in.
      }
        currentUserKeeper.push(user);

    });
}

  function specialUserCheck(dbRef){

    let specialUserList = d3.entries(dbRef['special-users']).map(m=> m.key);

    let currentUser = firebase.auth().currentUser;

    let vidDim = d3.select('video').node().getBoundingClientRect();

    if(specialUserList.indexOf(currentUser.uid) > -1){

      let userWrap = d3.select('.user-wrap');
      userWrap.selectAll('*').remove();
     
      userWrap.append('text').text(`Signed in as Admin: ${currentUser.displayName}`);
      let bugLink = userWrap.append('a');
      bugLink.attr('href', 'https://github.com/visdesignlab/coronavirus_annotation/issues');
      bugLink.attr('target', "_blank");
      bugLink.append('span').classed("fas fa-bug", true);

      let newAnno = [...annotationType];
      newAnno.push({key:'annotation', tag:'annotation', tempCall: annotationTemplate});

      let tagButton = dropDown(d3.select('#annotation-wrap-r'), newAnno, 'Type of Comment', 'ann-type-drop', currentUser, null, true);
      d3.select('#annotation-wrap-r').append('div').classed('template-wrap', true);

      var storage = firebase.storage();
      var storageRef = storage.ref();
                    
      let interDIV = d3.select('#interaction');
      interDIV.attr('width', vidDim.width).attr('height', vidDim.height);

    }else{

      let userWrap = d3.select('.user-wrap');
      userWrap.selectAll('*').remove();
      userWrap.append('text').text(`Signed in as: ${currentUser.displayName}`);

      let bugLink = userWrap.append('a');
      bugLink.attr('href', 'https://github.com/visdesignlab/coronavirus_annotation/issues');
      bugLink.attr('target', "_blank");
      bugLink.append('span').classed("fas fa-bug", true);

      let tagButton = dropDown(d3.select('#annotation-wrap-r'), annotationType, 'Type of Comment', 'ann-type-drop', currentUser, null, true);
      d3.select('#annotation-wrap-r').append('div').classed('template-wrap', true);

      var storage = firebase.storage();
      var storageRef = storage.ref();
                    
      let interDIV = d3.select('#interaction');
      interDIV.attr('width', vidDim.width).attr('height', vidDim.height);

    }



  }

