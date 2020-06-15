import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';
import { renderNav, toggleMagic, updateSideAnnotations} from './sidebar';
import * as firebase from 'firebase';
import "firebase/auth";
import { firebaseConfig, checkDatabase } from './firebaseStuff';
import { annotationType } from './templates';
import { dropDown } from './canvas';



if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){
    vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');

    console.log('video with',d3.select('video').node().getBoundingClientRect())
    let vidDim = d3.select('video').node().getBoundingClientRect();

    let width = (window.innerWidth - (vidDim.x + vidDim.width));
    d3.select('#annotation-right').style('left', (vidDim.x + vidDim.width)+"px");
    d3.select('#annotation-right').style('height', (vidDim.height)+"px");
    d3.select('#annotation-right').style('width', width+"px");

    d3.select('#annotation-right').select('#control').style('margin-left', ((width/2)-10)+"px");

   

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
       
        let tagButton = dropDown(d3.select('#annotation-wrap-r'), annotationType, 'Type of Comment', 'ann-type-drop', user, null, true);

        d3.select('#annotation-wrap-r').append('div').classed('template-wrap', true);

       
  
        // User is signed in.
      } else {
          console.log("NO USER", user);
        // No user is signed in.
      }
    });

    //d3.select('#annotation-right').select('#control').select('')

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
     
        let ref = firebase.database().ref();  
        checkDatabase(ref, updateSideAnnotations);
        checkDatabase(ref, specialUserCheck);

      // User is signed in.
    } else {
        console.log("NO USER", user);
      // No user is signed in.
    }
  });

  function specialUserCheck(dbRef){

    let specialUserList = d3.entries(dbRef['special-users']).map(m=> m.key);
    let currentUser = firebase.auth().currentUser;

    if(specialUserList.indexOf(currentUser.uid) > -1){

      let userWrap = d3.select('.user-wrap');
      userWrap.selectAll('*').remove();
      userWrap.append('text').text(`Signed in as Admin: ${currentUser.displayName}`);
    }else{
      let userWrap = d3.select('.user-wrap');
      userWrap.selectAll('*').remove();
      userWrap.append('text').text(`Signed in as: ${currentUser.displayName}`);
    }

  }

