
import * as d3 from 'd3';
import * as firebase from 'firebase';

const annotationDataset = [];


export function formatPush(){
    console.log('this is button');
    let interactionDiv = d3.select('#interaction');
    interactionDiv.style('width', `${document.getElementById('video').getBoundingClientRect().width}px`);
    interactionDiv.style('height', `${document.getElementById('video').getBoundingClientRect().height}px`);
    let pushedBool = false;

    interactionDiv.on("click", function() {

        let event = d3.event.target;
        d3.event.stopPropagation();
        let coords = d3.mouse(this);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                    if(event == interactionDiv.node()){
            
                        if(!pushedBool){       
            
                            pushedBool = true;
                    
                            let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]);
            
                            let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
                            pushDiv.style('position', 'absolute')
                            pushDiv.style('top', (d)=> coords[1]+'px')
                            pushDiv.style('left', (d)=> coords[0]+'px')
                            let svg = pushDiv.append('svg');
                            let circ = svg.append('circle').attr('r', 5).attr('cx', 5).attr('cy', d=> 5).attr('fill', 'purple');
            
                            let currentTime = document.getElementById('video').currentTime;
            
                            let inputDiv = pushDiv.append('div').classed('text-input', true);
                            inputDiv.append('text').text(`${user.displayName}@ ${currentTime} :`)
                            inputDiv.append('textarea').attr('id', 'text-area-id');
                            let submit = inputDiv.append('button').text('Add').classed('btn btn-secondary', true);
                            submit.on('click', ()=> {
            
            
            
                                let dataPush = {
                                    time: currentTime,
                                    comment: d3.select('#text-area-id').node().value,
                                }
                                
                                
                                dataPush.user = user;
                                dataPush.displayName = user.displayName;

                                console.log(dataPush)
                        
            
                                
                            });
                    
                        }else{
                            pushedBool = false;
                            d3.select('#push-div').remove();
            
                        }

                    }
                // User is signed in.
                } else {
                    console.log("NO USER", user);
                // No user is signed in.
                }
            

        });

       


        
        



        // // // Normally we go from data to pixels, but here we're doing pixels to data
        // var newData= {
        // //  x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
        // //  y: Math.round( yScale.invert(coords[1]))
        //     x: coords[0],
        //     y: coords[1]
        // };

        // annotationDataset.push(newData);   // Push data to our array

        // /////NEED TO CREATE THE INITIAL PUSH DIV FIRST//
        // let div = interactionDiv.selectAll('div.saved').data(annotationDataset).join('div').classed('saved', true);
        // div.style('position', 'absolute')
        // div.style('top', (d)=> d.y+'px')
        // div.style('left', (d)=> d.x+'px')
        // let svg = div.selectAll('svg').data(d=> [d]).join('svg');
        // let circ = svg.selectAll('circle').data(d=> [d]).join('circle').attr('r', 5).attr('cx', 5).attr('cy', d=> 5).attr('fill', 'red');

    
      });
}
export function formatCanvas(){

    let frame = 'video';
  
    console.log('is this firing')
  
     let div = document.getElementById('main-wrap');
  
      let canvas = d3.select(div).select('canvas').node();
      canvas.setAttribute('id', 'vid-canvas');
  
      const context = canvas.getContext("2d");
      let videoDim = document.getElementById(frame).getBoundingClientRect();
      console.log(video, 'size')
  
      canvas.width = videoDim.width;
      canvas.height = videoDim.height;
  
      context.strokeStyle = "red";
      context.lineWidth = 5;
     
      var oldX, oldY;
      var draw=false;
  
      div.onmousedown=function(e) {
  
          let sideWidth = document.getElementById('sidebar').getBoundingClientRect();
  
          oldX = (e.pageX - sideWidth.width);
          oldY = (e.pageY);
     
          draw=true;
      }
      div.onmousemove=function(e) {
  
      let sideWidth = document.getElementById('sidebar').getBoundingClientRect();
  
      var mouseX = (e.pageX - sideWidth.width);
      var mouseY = (e.pageY);
    
        if(draw) {
          console.log(e, this.offsetLeft)
          context.beginPath();
          context.moveTo(oldX, oldY);
          context.lineTo(mouseX, mouseY);
          context.stroke();
          context.closePath();
          oldX=mouseX;
          oldY=mouseY;
        }
      
      }
      div.onmouseup=function(e) {
        draw=false;
        shapeArray.push(context.save());
        console.log(shapeArray, context.save())
      }
  
      return div;
  
  }