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
    vid.formatVidPlayer(mainWrap, './public/entryComp_071220.mp4');
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

         
          d3.csv('./public/sample-anno-sheet.csv').then((data)=> {
           

            let newData = formatTime(data);

            console.log('newData', newData)

            let rightDiv = d3.select('#annotation-right');

            let  video = d3.select('video').node()//.currentTime;

            video.ontimeupdate = async (event) => { 
             // console.log('update',video.currentTime, Math.round(video.currentTime), event);

              let timeRange = [video.currentTime - 1.5, video.currentTime + 1.5];
              let filtered = newData.filter(f=> f.seconds < timeRange[1] && f.seconds > timeRange[0]).classed('selected', true);

              console.log(event, 'is this working')

              console.log('filtered',filtered)
             // let selectedMemoDivs = memoDivs.filter(f=> f.videoTime < timeRange[1] && f.videoTime > timeRange[0]).classed('selected', true);
    

            };

            function formatSeconds(timeInSeconds) {
              console.log('time', timeInSeconds);
              const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
              return {
                minutes: result.substr(3, 2),
                seconds: result.substr(6, 2)
              };
            }

            /////parsing data//////
            function formatTime(d){

              return d.map(m=> {
                if(m.video_time.includes("-")){
                  let range = m.video_time.split("-");
             
                  let start = range[0].split(":");
                  let startSec = (+start[0] * 60) + +start[1];
                
                  let end = range[1].split(":");
                  let endSec = (+end[0] * 60) + +end[1];
                  m.seconds = [startSec, endSec];
                }else{
                  console.log('no split');

                  let time= m.video_time.split(":");
                  console.log(time[0], +time[0], +time[1]);
                  let seconds = (+time[0] * 60) + +time[1];

                  m.seconds = [seconds];
                }
              
                return m;
              });

            }

          });
         
          clearSidebar();

        // User is signed in.
      } else {
          console.log("NO USER", user);
        // No user is signed in.
      }
        currentUserKeeper.push(user);

    });
}

  

