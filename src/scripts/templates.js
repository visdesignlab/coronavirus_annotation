import * as d3 from 'd3';
import { dropDown, formatVideoTime, annotationMaker } from './canvas';
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
    tags.text(d=> `${d}  `);
    let x = tags.append('text').text('X');
    x.style('padding', '5px')
    x.style('cursor', 'pointer');
    x.on('click', (d, i, n)=> {
        d3.select(n[i].parentNode).remove();
        tagArray = tagArray.filter(f=> f != d);
    });
    
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

    console.log('user', user)
  
    let tagButton = dropDown(inputDiv, annotationType, 'Type of Comment', 'ann-type-drop', user, coords, true);

    inputDiv.append('div').classed('template-wrap', true);

}

export function defaultTemplate(div, user, coords){

    d3.select('.dropdown.ann-type-drop').select('button').style('color', 'black')

    let currentTime = document.getElementById('video').currentTime;

    let inputDiv = div.select('.template-wrap').append('div');//.classed('text-input', true);
   // inputDiv.append('text').text(`${user.displayName}@ ${formatVideoTime(currentTime)} :`);

    let templatehtml = 
    `
    <br>
    <p>Couldn't find a type of comment that fits?</p>
    <p>Add your comment and please include as many tags that describe the comment</p> 
    `;

    inputDiv.append('div').classed('temp-text', true).html(templatehtml);

    inputDiv.append('textarea').attr('id', 'text-area-id').attr('placeholder', 'Comment Here');
    let tagButton = dropDown(inputDiv, tagOptions, 'Tag', 'tag-drop');

    let defaultTags = []

    addTagFunctionality(inputDiv, defaultTags);

}

export function annotationTemplate(div, user, coords){

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

  let suggestionTags = ['suggestion']

  addTagFunctionality(inputDiv, suggestionTags);


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

export function citationTemplate(div){
    console.log('this is citation template', div);
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