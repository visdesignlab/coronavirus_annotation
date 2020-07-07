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
import { formatTimeControl, formatCommentBox } from './commentFormat';

export function addCommentButton(d, i, n){
    console.log(d, i, n)
    if(n[i].value === 'off'){
        n[i].value = 'on';
        let sideWrap = d3.select('#sidebar').select('#annotation-wrap');
        sideWrap.selectAll('*').remove();
        
        formatTimeControl(sideWrap);
        formatCommentBox(sideWrap);

    }else{

        n[i].value = 'off';
        d3.select('#sidebar').select('#annotation-wrap').selectAll('*').remove();

        let ref = firebase.database().ref();  
        checkDatabase(ref, updateSideAnnotations);
    }
}
    

export function specialUserCheck(dbRef){

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
