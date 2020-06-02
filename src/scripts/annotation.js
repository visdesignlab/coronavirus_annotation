import '../styles/index.scss';
import * as d3 from 'd3';
import * as vid from './video_player';
import { renderNav, toggleMagic, updateSideAnnotations} from './sidebar';
import * as firebase from 'firebase';
import "firebase/auth";
import { firebaseConfig, checkDatabase } from './firebaseStuff';



if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

let mainWrap = document.getElementById('main-wrap');
if(mainWrap){
    vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
    //renderNav(d3.select('.button-wrap').node(), nav);
    
    //toggleMagic();
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('user', user.metadata, firebase.auth().currentUser);
        // let userWrap = d3.select('.user-wrap');
        // userWrap.append('text').text(`Signed in as: ${user.displayName}`);

        

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
      console.log('this is a special user');
      let userWrap = d3.select('.user-wrap');
      userWrap.append('text').text(`Signed in as Admin: ${currentUser.displayName}`);
    }else{
      let userWrap = d3.select('.user-wrap');
      userWrap.append('text').text(`Signed in as: ${currentUser.displayName}`);
    }

  }

