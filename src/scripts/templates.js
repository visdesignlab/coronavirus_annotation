import * as d3 from 'd3';
import { dropDown, formatVideoTime, annotationMaker, radioBlob, formatPush } from './canvas';
import { updateSideAnnotations } from './sidebar';
import { firebaseConfig, checkDatabase, dataKeeper } from './firebaseStuff';
import * as firebase from 'firebase';


export const annotationType = [
    {key:'question', tag:'question', tempCall: questionTemplate}, 
    // {key:'add context for biology', tag:'context', tempCall: bioInfoTemplate}, 
    {key:'critique or issue', tag:'issue', tempCall: issueTemplate}, 
    {key:'suggestion for animation/tool', tag:'suggestion', tempCall: suggestionTemplate},
    {key:'other', tag:'none', tempCall: defaultTemplate},  
]
export const tagOptions = [
    {key:'question', color:'#2E86C1'}, 
    {key:'suggestion', color:'#2ECC71'}, 
    {key:'issue', color:'#F1C40F'}, 
    {key:'context', color:'#F10F42'}, 
    {key: 'none', color: 'black'}
];

function updateTags(node, tagWrap, tagArray){

    tagArray.push(node.value);

    let tags = tagWrap.selectAll('span.badge').data(tagArray).join('span').classed('badge badge-secondary', true);
    tags.text(d=> `${d}  `);
    let x = tags.append('text').text('X');
    x.style('padding', '5px')
    x.style('cursor', 'pointer');
    x.on('click', (d, i, n)=> {
        d3.select(n[i].parentNode).remove();
        tagArray = tagArray.filter(f=> f != d);
    });

    node.value = "";
}

export function addTagFunctionality(inputDiv, tagArray){

    let inputWrap = inputDiv.append('div').classed('tag-input-wrap', true);

    let tagWrap = inputWrap.append('div').classed('tag-wrap', true);

    let tags = tagWrap.selectAll('span.badge').data(tagArray).join('span').classed('badge badge-secondary', true);
    if(tagArray.length > 0){

      tags.text(d=> `${d}  `);
      let x = tags.append('text').text('X');
      x.style('padding', '5px');
      x.style('cursor', 'pointer');
      x.on('click', (d, i, n)=> {
          d3.select(n[i].parentNode).remove();
          tagArray = tagArray.filter(f=> f != d);
      });

    }
    
    
    let tagText = inputWrap.append('input').attr('id', 'tag-input');
    tagText.classed('form-control', true);
    tagText.node().type = 'text';
    tagText.node()['aria-label'] = 'tag add';
    tagText.node().placeholder = "Type to add..."

    const node = document.getElementById("tag-input");
    node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        
            if(node.value != ""){

              updateTags(node, tagWrap, tagArray)

            }else{
                console.log('nothing to add');
            }
        }
    });

    let array = dataKeeper[dataKeeper.length - 1].comments;
    let test = d3.entries(array).map(m=> m.value).flatMap(m=> m.tags.split(','));
    console.log(Array.from(new Set(test)))

    autocomplete(node, Array.from(new Set(test)));

}

export function annotationInitiation(user, interactionDiv, coords){

    let scale = d3.scaleLinear().domain([0, document.getElementById('video').duration]);
    let pushDiv = interactionDiv.append('div').attr('id', 'push-div');
    pushDiv.style('position', 'absolute')
    pushDiv.style('top', (d)=> coords[1]+'px')
    pushDiv.style('left', (d)=> coords[0]+'px')
    let svg = pushDiv.append('svg').classed('push', true);
    let circ = svg.append('circle').attr('r', 5).attr('cx', 5).attr('cy', d=> 5).attr('fill', 'purple');
        
    let inputDiv = pushDiv.append('div').classed('comment-initiated', true);

    console.log('when does this fire', user)
    //btn dropbtn dropdown-toggle
    d3.select('.btn.dropbtn.dropdown-toggle').remove();//.text('Type of Comment').style('color', 'gray');
    let tagButton = dropDown(inputDiv, annotationType, 'Type of Comment', 'ann-type-drop', user, coords, true);

    inputDiv.append('div').classed('template-wrap', true);

}

export function defaultTemplate(div){

    //d3.select('.dropdown.ann-type-drop').select('button').style('color', 'black')

    console.log('div',div)

    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap')//.append('div');//.classed('text-input', true);
   // inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    let templatehtml = 
    `
    <br>
    <p>Add a comment here - comments can be suggestions for the tool, critiques of the animation, questions on biology, etc.</p>
    <p>Please include as any tags that describe the comment you are making</p> 
    `;

    inputDiv.append('div').classed('temp-text', true).html(templatehtml);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    //let tagButton = dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');

    let defaultTags = []

    addTagFunctionality(inputDiv, defaultTags);

}

function timePoint(){
  console.log('timepoint');
  d3.select('#time-wrap').select('svg.range-svg').remove();
}

function timeRange(){
  console.log('timerange')

  d3.select('#time-wrap').select('svg.range-svg').remove();

  let slid = slider(0, document.getElementById('video').duration)


  function slider(min, max) {

    var range = [min, max]

    let whichHandle = [];
  
    // set width and height of svg
    var w = 300
    var h = 100
    var margin = {top: 30,
                  bottom: 30,
                  left: 20,
                  right: 20}

    // create svg and translated g
    var svg = d3.select('#time-wrap').append('svg').classed('range-svg', true);
    svg.style('width', '100%').style('height', `${h}px`)
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      // dimensions of slider bar
    var width = svg.node().getBoundingClientRect().width - (margin.left + margin.right);
    var height = h - margin.top - margin.bottom;

        // create x scale
    var x = d3.scaleLinear()
      .domain(range)  // data space
      .range([0, width]);  // display space
 
    // labels
    var labelL = g.append('text')
      .attr('id', 'labelleft')
      .attr('x', 0)
      .attr('y', height + 5)
      .style('fill', 'gray')
  
    var labelR = g.append('text')
      .attr('id', 'labelright')
      .attr('x', 0)
      .attr('y', height + 5)
      .style('fill', 'gray')
  
    // define brush
    var brush = d3.brushX()
      .extent([[0,0], [width, height]])
      .on('brush', function(d, i, n) {
        var s = d3.event.selection;
        // update and move labels
        labelL.attr('x', s[0])
          .text((x.invert(s[0]).toFixed(2)))
        labelR.attr('x', s[1])
          .text((x.invert(s[1]).toFixed(2)))
        // move brush handles      
        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
        // update view
        // if the view should only be updated after brushing is over, 
        // move these two lines into the on('end') part below
        svg.node().value = s.map(function(d) {var temp = x.invert(d); return +temp.toFixed(2)});
        svg.node().dispatchEvent(new CustomEvent("input"));

        let index = whichHandle[whichHandle.length - 1];

        const progressBar = document.getElementById('progress-bar');
        const seek = document.getElementById('seek');
        let videoSelect = d3.select('video').node();

        progressBar.value = x.invert(s[index].toFixed(2));
        seek.value = x.invert(s[index].toFixed(2));
        videoSelect.currentTime = x.invert(s[index].toFixed(2));

      });
  
    // append brush to g
    var gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)
  
    // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
    var brushResizePath = function(d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = height / 2;
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
          "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
          "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }
  
    var handle = gBrush.selectAll(".handle--custom")
      .data([{type: "w"}, {type: "e"}])
      .enter().append("path")
      .attr("class", "handle--custom")
      .attr("stroke", "#000")
      .attr("fill", '#eee')
      .attr("cursor", "ew-resize")
      .attr("d", brushResizePath);
    
      handle.each((d, i, n)=> d3.select(n[i]).classed(`h-${i}`, true));
      handle.on('mousedown', (d, i, n)=> d3.select(n[i]).classed('h-0') ? whichHandle.push(0) : whichHandle.push(1));
      
    // override default behaviour - clicking outside of the selected area 
    // will select a small piece there rather than deselecting everything
    // https://bl.ocks.org/mbostock/6498000
    gBrush.selectAll(".overlay")
      .each(function(d) { d.type = "selection"; })
      .on("mousedown touchstart", brushcentered)
    
    function brushcentered() {
      var dx = x(1) - x(0), // Use a fixed width when recentering.
      cx = d3.mouse(this)[0],
      x0 = cx - dx / 2,
      x1 = cx + dx / 2;
      d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
    }
    
    // select entire range
    gBrush.call(brush.move, range.map(x))
    
    return svg.node()
  }
}

export function annotationTemplate(div, user, coords){

  console.log(d3.select(div.node().parentNode).select('#time-wrap'))

  let timeDiv = d3.select(div.node().parentNode).select('#time-wrap');

  let t1Ob = {label:"time point", callBack: timePoint}
  let t2Ob = {label:"time range", callBack: timeRange}
  formatPush();
  radioBlob(timeDiv, t1Ob, t2Ob, 'time-tabber')

  d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'suggestion')[0].color);
  let currentTime = document.getElementById('video').currentTime;

  let inputDiv = div.select('.template-wrap').append('div');

  let suggestionhtml = 
  `
  <br>
  <p>Add an annotation to the video </p>
  `;

  inputDiv.append('div').classed('temp-text', true).html(suggestionhtml)

  inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Suggest something...');

}

export function suggestionTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'suggestion')[0].color);
    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');

    let suggestionhtml = 
    `
    <br>
    <p>Have a critique of the animation or tool? <br> Make a suggestion to improve it.</p>
     <p>Is it missing something in the animation that should be there?</p> 
     <p>Is there something wrong in the structure or function?</p>
    `;

    inputDiv.append('div').classed('temp-text', true).html(suggestionhtml)

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Suggest something...');

    let suggestionTags = ['suggestion']

    addTagFunctionality(inputDiv, suggestionTags);


}

export function issueTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'issue')[0].color);
    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');

    //inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    let suggestionhtml = 
    ` <br>
    <p>Have a critique or issue? 
     Is it missing something in the animation that should be there?
     Is there something wrong in the structure or function?<p>
    `;

    inputDiv.append('div').classed('temp-text', true).html(suggestionhtml);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Suggest something');

    let suggestionTags = ['critique']

    addTagFunctionality(inputDiv, suggestionTags);


}

export function commentTemplate(div, user, color, templatehtml, placeholder, tempTags){
    d3.select('.dropdown.ann-type-drop').select('button').style('color', color);

    let currentTime = document.getElementById('video').currentTime;
    let inputDiv = div.select('.template-wrap').append('div');

   // inputDiv.append('p').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    inputDiv.append('div').classed('temp-text', true).html(templatehtml);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', placeholder);

    addTagFunctionality(inputDiv, tempTags);
}

export function bioInfoTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'bio-context')[0].color);

    let currentTime = document.getElementById('video').currentTime;
    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);

  //  inputDiv.append('p').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    let templatehtml = 
    `
    <p>Add some context for biology.This could be additional information and references that support an aspect of the biology or animation.</p>
    <p>If you add a rederence, please add the DOI for the paper.</p> 
    `;

    inputDiv.append('div').classed('temp-text', true).html(templatehtml);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Add a comment, clarifying information, or the DOI of a reference');

    let tempTags = ['biology', 'context'];

    addTagFunctionality(inputDiv, tempTags);

}

export function questionTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', tagOptions.filter(f=> f.key === 'none')[0].color);

    let questionOps = [
        {key:'biology', color:'#0FF176'},
        {key: 'animation', color:'#FFC300'}
    ];
        
    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');

   // inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    let templatehtml = 
    `
    <br>
    <p>Choose the type of question in the drop down. </p>
    <p>This can be biology or animation related. </p>
    <p>Please be descriptive as possible.</p> 
    `;

    inputDiv.append('div').classed('temp-text', true).html(templatehtml);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Ask a biology or tool related question here.');
    let tagButton = dropDown(inputDiv, questionOps, 'Type', 'q-tag-drop', null, null, false, true);
    //div, optionArray, dropText, dropId, user, coords, callbackBool, questionBool

    
  
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
         
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
              });
          a.appendChild(b);

          d3.select(b).on('click', ()=> {
            console.log('click!!');
            updateTags(d3.select('#tag-input').node(), d3.select('.tag-wrap'), d3.select('.tag-wrap').selectAll('span').data())
          });

        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");

      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x){ 
          
            x[currentFocus].click();}
        }
      }
  });
  function addActive(x) {``
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
    console.log('e target', e.target, e.target, e.target.value)
});
}