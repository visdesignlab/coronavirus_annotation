!function(e){function t(t){for(var a,s,i=t[0],d=t[1],c=t[2],p=0,u=[];p<i.length;p++)s=i[p],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&u.push(o[s][0]),o[s]=0;for(a in d)Object.prototype.hasOwnProperty.call(d,a)&&(e[a]=d[a]);for(r&&r(t);u.length;)u.shift()();return l.push.apply(l,c||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],a=!0,i=1;i<n.length;i++){var d=n[i];0!==o[d]&&(a=!1)}a&&(l.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},o={1:0},l=[];function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var i=window.webpackJsonp=window.webpackJsonp||[],d=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var r=d;l.push([614,0,3]),n()}({20:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return l})),n.d(t,"a",(function(){return s})),n.d(t,"d",(function(){return i}));var a=n(9);n(1);const o=[],l={apiKey:"AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",authDomain:"covid-annotation.firebaseapp.com",databaseURL:"https://covid-annotation.firebaseio.com",storageBucket:"gs://covid-annotation.appspot.com/",projectId:"covid-annotation",storageBucket:"covid-annotation.appspot.com",messagingSenderId:"297369575962",appId:"1:297369575962:web:be320c5d86a0b719a467a3",measurementId:"G-H9JT7JZCZ8"};function s(e,t){e.on("value",(function(e){t(e.val()),o.push(e.val())}),(function(e){console.log("Error: "+e.code)}))}a.apps.length||a.initializeApp(l);const i={callbacks:{signInSuccessWithAuthResult:function(e,t){return!0},uiShown:function(){document.getElementById("loader").style.display="none"}},signInFlow:"popup",signInSuccessUrl:"/coronavirus_annotation/annotation.html",signInOptions:[a.auth.GoogleAuthProvider.PROVIDER_ID,a.auth.EmailAuthProvider.PROVIDER_ID]}},614:function(e,t,n){"use strict";n.r(t),n.d(t,"currentUserKeeper",(function(){return _})),n.d(t,"specialUserKeeper",(function(){return O}));n(91);var a=n(1),o=n(9),l=n(207),s=n(115),i=n(208),d=n(209),c=n(210),r=n(211),p=n(20);function u(e,t,n,l){let s=a.g(n[t].parentNode).append("div").classed("text-input-sidebar",!0);s.append("text").text(`${l.displayName}:`),s.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here");let i=(void 0)(s,v,"Tag","tag-drop");s.append("button").text("Add").classed("btn btn-secondary",!0).on("click",()=>{a.d.stopPropagation();let t=j(l,null,i.text(),null,!0,e.key);o.database().ref("comments").push(t)})}function m(e){let t=a.c(e.comments).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.resolved),n=t.filter(e=>!1===e.reply).sort((e,t)=>e.videoTime-t.videoTime),s=t.filter(e=>!0===e.reply),i=n.map((e,t,n)=>(function e(t,n,a){t.level=a,t.replyBool=!1;let o=n.filter(e=>e.replies===t.key);if(o.length>0){t.replyKeeper=o;let l=++a;return t.replyKeeper.map(t=>e(t,n,l)),t}return t.replyKeeper=[],t})(e,s,0)),d=a.g("#comment-sidebar").select("#annotation-wrap");d.selectAll("*").remove();a.i();let c=d.selectAll(".memo").data(i).join("div").classed("memo",!0);c.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),c.selectAll(".time").data(e=>[e]).join("span").classed("time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>(function(e){let t=parseInt(e);var n=l.Math.floor(t/60);return`${n}:${("0"+(t-60*n)).slice(-2)}`})(e.videoTime)),c.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>e.tags.split(",")).join("span").classed("badge badge-secondary",!0).text(e=>e);c.selectAll("i.fas").data(e=>[e]).join("i").attr("class",e=>"push"===e.commentMark?"fas fa-map-pin":"doodle"===e.commentMark?"fas fa-paint-brush":"hidden");c.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment),c.selectAll(".post-time").data(e=>[e]).join("span").classed("post-time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>{return`on ${new Date(e.postTime).toUTCString()}`}),c.style("border",e=>"1px solid gray");let r=c.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);r.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-lg",!0),r.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let p=c.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);p.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down fa-lg",!0),p.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let m=c.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0).text("Reply ");m.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots fa-lg reply",!0);let g=c.filter(e=>e.uid===_[_.length-1].uid).selectAll(".resolve-span").data(e=>[e]).join("span").classed("resolve-span",!0).text("Resolve ");g.selectAll(".resolve").data(e=>[e]).join("i").classed("resolve",!0).classed("resolve fas fa-check",!0),g.on("click",e=>{f.ref(`comments/${e.key}/resolved`).set("true")}),m.on("click",(function(e,t,n){a.d.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,o.auth().onAuthStateChanged((function(a){a?u(e,t,n,a):console.log("NO USER",a)}))):(e.replyBool=!1,a.g(n[t].parentNode).select(".text-input-sidebar").remove())}));var f=o.database();r.on("click",e=>{let t=++e.upvote;f.ref(`comments/${e.key}/upvote`).set(`${t}`)}),p.on("click",e=>{let t=++e.downvote;f.ref(`comments/${e.key}/downvote`).set(`${t}`)}),c.on("click",e=>{console.log("click",e.videoTime),"textarea"===a.d.target.tagName.toLowerCase()||"button"===a.d.target.tagName.toLowerCase()||"a"===a.d.target.tagName.toLowerCase()||"svg"===a.d.target.tagName.toLowerCase()||L(e.videoTime)}),c.each((e,t,n)=>{e.replyKeeper.length>0&&function e(t){let n=t.selectAll(".reply-memo").data(e=>e.replyKeeper).join("div").classed("reply-memo",!0);n.style("margin-left",e=>`${10*e.level}px`);n.each((t,n,l)=>{!function(e){e.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),e.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>[e]).join("span").classed("badge badge-secondary",!0).style("background-color",e=>v.filter(t=>t.key===e.tags)[0].color).text(e=>e.tags),e.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment),e.selectAll(".post-time").data(e=>[e]).join("span").classed("post-time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>{return`on ${new Date(e.postTime).toUTCString()}`});let t=e.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);t.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-sm",!0),t.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let n=e.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);n.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down",!0),n.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let l=e.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0).text("Reply ");l.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots reply",!0).style("float","right");let s=e.selectAll(".resolve-span").data(e=>[e]).join("span").classed("resolve-span",!0).text("Resolve ");s.selectAll(".resolve").data(e=>[e]).join("i").classed("resolve",!0).classed("resolve fas fa-check",!0),s.on("click",e=>{f.ref(`comments/${e.key}/resolved`).set("true")}),l.on("click",(function(e,t,n){a.d.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,o.auth().onAuthStateChanged((function(a){a?u(e,t,n,a):console.log("NO USER",a)}))):(e.replyBool=!1,a.g(n[t].parentNode).select(".text-input-sidebar").remove())}))}(a.g(l[n])),t.replyKeeper.length>0&&e(a.g(l[n]))})}(a.g(n[t]))})}s.b.add(i.faCheck,d.a,c.a,r.a),s.a.i2svg(),s.a.watch();const g=[],v=[{key:"question",color:"#2E86C1"},{key:"suggestion",color:"#2ECC71"},{key:"issue",color:"#F1C40F"},{key:"context",color:"#F10F42"},{key:"other",color:"black"}],f=["#2E86C1","#2ECC71","#F1C40F","#F10F42","black"];function h(e,t,n){n.push(e.value);let o=t.selectAll("span.badge").data(n).join("span").classed("badge badge-secondary",!0);o.text(e=>`${e}  `);let l=o.append("text").text("X");l.style("padding","5px"),l.style("cursor","pointer"),l.on("click",(e,t,o)=>{a.g(o[t].parentNode).remove(),n=n.filter(t=>t!=e)}),e.value=""}function y(e,t){let n=e.append("div").classed("tag-input-wrap",!0),o=n.append("div").classed("tag-wrap",!0),l=o.selectAll("span.badge").data(t).join("span").classed("badge badge-secondary",!0);if(t.length>0){l.text(e=>`${e}  `);let e=l.append("text").text("X");e.style("padding","5px"),e.style("cursor","pointer"),e.on("click",(e,n,o)=>{a.g(o[n].parentNode).remove(),t=t.filter(t=>t!=e)})}let s=n.append("input").attr("id","tag-input");s.classed("form-control",!0),s.node().type="text",s.node()["aria-label"]="tag add",s.node().placeholder="Type to add...";const i=document.getElementById("tag-input");i.addEventListener("keyup",(function(e){"Enter"===e.key&&(""!=i.value?h(i,o,t):console.log("nothing to add"))}));let d=p.b[p.b.length-1].comments,c=a.c(d).map(e=>e.value).flatMap(e=>e.tags.split(","));!function(e,t){var n;function o(e){if(!e)return!1;!function(e){for(var t=0;t<e.length;t++)e[t].classList.remove("autocomplete-active")}(e),n>=e.length&&(n=0),n<0&&(n=e.length-1),e[n].classList.add("autocomplete-active")}function l(t){for(var n=document.getElementsByClassName("autocomplete-items"),a=0;a<n.length;a++)t!=n[a]&&t!=e&&n[a].parentNode.removeChild(n[a])}e.addEventListener("input",(function(o){var s,i,d,c=this.value;if(l(),!c)return!1;for(n=-1,(s=document.createElement("DIV")).setAttribute("id",this.id+"autocomplete-list"),s.setAttribute("class","autocomplete-items"),this.parentNode.appendChild(s),d=0;d<t.length;d++)t[d].substr(0,c.length).toUpperCase()==c.toUpperCase()&&((i=document.createElement("DIV")).innerHTML="<strong>"+t[d].substr(0,c.length)+"</strong>",i.innerHTML+=t[d].substr(c.length),i.innerHTML+="<input type='hidden' value='"+t[d]+"'>",i.addEventListener("click",(function(t){e.value=this.getElementsByTagName("input")[0].value,l()})),s.appendChild(i),a.g(i).on("click",()=>{console.log("click!!"),h(a.g("#tag-input").node(),a.g(".tag-wrap"),a.g(".tag-wrap").selectAll("span").data())}))})),e.addEventListener("keydown",(function(e){var t=document.getElementById(this.id+"autocomplete-list");t&&(t=t.getElementsByTagName("div")),40==e.keyCode?(n++,o(t)):38==e.keyCode?(n--,o(t)):13==e.keyCode&&(e.preventDefault(),n>-1&&t&&t[n].click())})),document.addEventListener("click",(function(e){l(e.target),console.log("e target",e.target,e.target,e.target.value)}))}(i,Array.from(new Set(c)))}function b(){console.log("this is a test");let e=a.g("canvas").node();e.getContext("2d").clearRect(0,0,e.width,e.height),e.height=0,e.width=0,a.g("#interaction").selectAll("*").remove()}function x(e){e.append("div").classed("template-wrap",!0);let t=e.append("div").classed("dropdown comment-type",!0),n=t.append("button").classed("btn dropbtn dropdown-toggle",!0);n.text("Color Code by Comment");n.node().value="other";let l=t.append("div").attr("id","comment-type").classed("dropdown-content",!0);l.append("a").text("text").attr("font-size",11);let s=l.selectAll("a").data(v).join("a").text(e=>e.key);s.append("svg").classed("color-box",!0).append("rect").attr("width",10).attr("height",10).attr("x",5).attr("y",8).attr("fill",e=>e.color),s.on("click",(e,t,a)=>{n.text(e.key);n.node().value=e.key,l.classed("show",!1)}),n.on("click",(e,t,n)=>{l.classed("show")?l.classed("show",!1):l.classed("show",!0)}),function(e){console.log("div",e),document.getElementById("video").currentTime;let t=e.select(".template-wrap");t.append("div").classed("temp-text",!0).html("\n    <br>\n    <p>Add a comment here - comments can be suggestions for the tool, critiques of the animation, questions on biology, etc.</p>\n    <p>Please include as any tags that describe the comment you are making</p> \n    "),t.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here"),y(t,[])}(e);let i=function(e,t,n,a,o){let l=e.append("form").classed(o,!0),s=l.append("label").classed("container",!0);s.text(t.label),s.node().for="t1";let i=s.append("input").attr("id","t1");i.node().name="radio",i.node().type="radio",i.node().checked=!0;s.append("span").classed("checkmark",!0);l.node().value="t1";let d=l.append("label").classed("container",!0).text(n.label);d.node().for="t2";let c=d.append("input").attr("id","t2");c.node().name="radio",c.node().type="radio",c.node().checked=!1;d.append("span").classed("checkmark",!0);let r=l.append("label").classed("container",!0).text(a.label);r.node().for="t3";let p=r.append("input").attr("id","t3");p.node().name="radio",p.node().type="radio",p.node().checked=!1;r.append("span").classed("checkmark",!0);return i.on("click",()=>{i.node().checked=!0,c.node().checked=!1,l.node().value="t1",t.callBack()}),c.on("click",()=>{i.node().checked=!1,c.node().checked=!0,l.node().value="t2",n.callBack()}),p.on("click",()=>{i.node().checked=!1,c.node().checked=!1,p.node().checked=!0,l.node().value="t3",a.callBack()}),l}(e,{label:"No spatial reference",callBack:b},{label:"Mark a Point",callBack:C},{label:"Draw",callBack:I},"media-tabber");b();let d=e.append("button").attr("id","comment-submit-button").text("Add").classed("btn btn-secondary",!0);d.on("click",async()=>{let e=_[_.length-1];if(a.d.stopPropagation(),""!=a.g("#text-area-id").node().value){let t=a.g(".tag-wrap").selectAll(".badge"),l=document.getElementById("video").currentTime;if("t2"===i.node().value){console.log("this is a push",a.g("#push-div"),!a.g("#push-div").empty());let s=+a.g("#push-div").style("left").split("px")[0]/+a.g("video").node().getBoundingClientRect().width,i=+a.g("#push-div").style("top").split("px")[0]/+a.g("video").node().getBoundingClientRect().height,d=a.g("#push-div").empty()?null:[s,i];console.log("coords",s,i);let c=j(e,l,t.data().toString(),d,!1,null,"push",n.node().value,!1);o.database().ref("comments").push(c),Object(p.a)(o.database().ref(),m),A(),a.g("#interaction").selectAll("*").remove()}else if("t3"===i.node().value)!function(e,t,n,l,s){var i=o.storage().ref(),d=k[k.length-1].data;i.child(`images/im-${t.uid}-${k[k.length-1].index}.png`).putString(d,"data_url").then((function(i){let d=a.g("#push-div").empty()?null:[a.g("#push-div").style("left"),a.g("#push-div").style("top")],c=j(t,s,n.data().toString(),d,!1,null,"doodle",null===l?"other":l.tag,!1);c.doodle=!0,c.doodleName=i.metadata.name,o.database().ref(e).push(c),Object(p.a)(o.database().ref(),m),A()}))}("comments",e,t,n.node().value,l),a.g("#interaction").selectAll("*").remove();else{let s=null,i=j(e,l,t.data().toString(),s,!1,null,"push",n.node().value,!1);o.database().ref("comments").push(i),Object(p.a)(o.database().ref(),m),A(),a.g("#interaction").selectAll("*").remove()}a.g(".add-comment").select("button").text("Add Comment")}else window.alert("Please add a comment first")})}const k=[];async function w(e,t,n){let o=e.filter(e=>e.seconds.length>1?n>=e.seconds[0]&&n<=e.seconds[1]:e.seconds<timeRange[1]&&e.seconds>timeRange[0]),l=a.g("#annotation-sidebar").select(".anno-wrap").selectAll("div.anno").data(o).join("div").classed("anno",!0),s=(l.selectAll("text.time").data(e=>[e]).join("text").classed("time",!0).text(e=>e.video_time),l.selectAll("h6").data(e=>[e]).join("h6").selectAll("span").data(e=>[e]).join("span").text(e=>e.annotation_type));s.classed("badge badge-secondary",!0),s.style("background-color",e=>t.filter(t=>t.type===e.annotation_type)[0].color);l.selectAll("text.anno-text").data(e=>[e]).join("text").text(e=>e.text_description).classed("anno-text",!0),l.filter(e=>""!=e.ref&&"na"!=e.ref).selectAll("text.ref").data(e=>[e]).join("text").classed("ref",!0).text(e=>e.ref);let i=l.filter(e=>""!=e.url&&"na"!=e.url).selectAll("a.link").data(e=>[e]).join("a").classed("link",!0).text(e=>e.url);i.attr("href",e=>e.url),i.attr("target","_blank"),a.g(".annotation-wrap").selectAll("rect").filter(e=>{return o.map(e=>e.text_description).indexOf(e.text_description)>-1}).style("fill-opacity","1"),a.g(".annotation-wrap").selectAll("rect").filter(e=>{return-1===o.map(e=>e.text_description).indexOf(e.text_description)}).style("fill-opacity",".4")}function A(){a.g("#push-div").remove(),a.g(".template-wrap").remove(),a.g(".media-tabber").remove(),a.g(".time-tabber").remove(),a.g("form").remove(),a.g("#comment-submit-button").remove(),a.g("#time-wrap").select("svg.range-svg").remove(),a.g(".dropdown.ann-type-drop").remove();let e=a.g("canvas").node();e.getContext("2d").clearRect(0,0,e.width,e.height),e.height=0,e.width=0}function j(e,t,n,o,l,s,i,d,c){return{videoTime:t,postTime:(new Date).toString(),comment:a.g("#text-area-id").node().value,commentMark:i,posTop:null!=o?o[1]:null,posLeft:null!=o?o[0]:null,upvote:0,downvote:0,tags:""===n?"none":n,replies:s,reply:l,uid:e.uid,displayName:e.displayName,resolved:!1,initTag:d||"other",specialAnno:c}}async function E(e){let t=a.c(e.comments).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.resolved).filter(e=>!1===e.reply).sort((e,t)=>e.videoTime-t.videoTime),n=a.g("#annotation-layer").select("svg"),l=a.f().domain([0,document.getElementById("video").duration]).range([3,a.g("video").node().getBoundingClientRect().width]),s=(a.f().domain([0,1]).range([10,15]),n.selectAll("g.comment-wrap").data([t]).join("g").classed("comment-wrap",!0).selectAll(".memo").data(e=>e).join("rect").style("width","3px").attr("height",10).classed("memo",!0));s.attr("x",e=>l(e.videoTime)),s.attr("y",10),s.on("mouseover",e=>{let t=a.g("#comment-sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView()}).on("mouseout",e=>{a.g("#comment-sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1)}).on("click",e=>{L(e.videoTime)});let i=(d=await a.b("./public/anno_sheet_ji_72020.csv"),d.map(e=>{if(e.video_time.includes("-")){let t=e.video_time.split("-"),n=t[0].split(":"),a=60*+n[0]+ +n[1],o=t[1].split(":"),l=60*+o[0]+ +o[1];e.seconds=[a,l]}else{let t=e.video_time.split(":"),n=60*+t[0]+ +t[1];e.seconds=[n]}return e})).map((e,t)=>(e.index=t,e));var d;let c=await async function(){let e=await a.b("./public/anno_sheet_ji_72020.csv");return Array.from(new Set(e.map(e=>e.annotation_type))).map((e,t)=>({type:e,color:f[t]}))}(),r=n.selectAll("g.annotation-wrap").data([i]).join("g").classed("annotation-wrap",!0);r.attr("transform","translate(0, 35)");let u=r.selectAll("rect").data(e=>e).join("rect");u.attr("width",e=>{if(e.seconds.length>1){return l(e.seconds[1])-l(e.seconds[0])}return 3}),u.style("height","6px"),u.style("stroke","#fff"),u.style("stroke-width","1px"),u.attr("fill",e=>{return c.filter(t=>t.type===e.annotation_type)[0].color}),u.attr("y",(e,t,n)=>{if(t>0){return 7*a.h(n).data().filter((n,a)=>a<t&&n.seconds[1]>e.seconds[0]).length}return 0}),u.attr("x",e=>l(e.seconds[0])),u.on("mouseover",(e,t,n)=>{a.g(n[t]).style("fill-opacity","1")}).on("mouseout",(e,t,n)=>{a.g(n[t]).style("fill-opacity",".4")}).on("click",e=>{L(parseFloat(e.seconds[0]))}),async function(e,t){var n=o.storage().ref();let l=await n.child("images/").listAll(),s=a.g("#interaction").select("svg"),i=s.empty()?a.g("#interaction").append("svg"):s;const d=document.querySelector("video");let c=a.g("video").node().getBoundingClientRect(),r=a.g("#interaction");w(e,t,0),d.ontimeupdate=async n=>{let o=[d.currentTime-1.5,d.currentTime+1.5];w(e,t,d.currentTime);let s=a.c(p.b[p.b.length-1].annotations).map(e=>e.value).filter((e,t)=>{let n=JSON.parse(e.videoTime);return n.length>1?n[0]<=d.currentTime&&n[1]>=d.currentTime:n[0]<o[1]&&n[0]>o[0]}),u=a.g("#annotation-layer").selectAll(".memo"),m=a.g("#comment-sidebar").select("#annotation-wrap").selectAll(".memo");u.classed("selected",!1),m.classed("selected",!1);let g=u.filter(e=>e.videoTime<o[1]&&e.videoTime>o[0]).classed("selected",!0),v=m.filter(e=>e.videoTime<o[1]&&e.videoTime>o[0]).classed("selected",!0),f=g.filter(e=>"push"===e.commentMark),h=g.filter(e=>"doodle"===e.commentMark).data().map(async e=>{return await l.items.filter(t=>t.location.path===`images/${e.doodleName}`)[0].getDownloadURL()}),y=s.filter(e=>"doodle"===e.commentMark).map(async e=>{return await l.items.filter(t=>t.location.path===`images/${e.doodleName}`)[0].getDownloadURL()});if(a.g(".show-comments").select(".form-check").select(".form-check-input").node().checked){r.selectAll(".doodles").data(await Promise.all(h)).join("img").classed("doodles",!0).attr("src",e=>e),r.selectAll(".anno-doodles").data(await Promise.all(y)).join("img").classed("anno-doodles",!0).attr("src",e=>e);let e=i.selectAll("g.pushed").data(f.data()).join("g").classed("pushed",!0).selectAll("circle").data(e=>[e]).join("circle");e.attr("r",10),e.attr("cx",e=>`${c.width*+e.posLeft+10}px`),e.attr("cy",e=>`${c.height*+e.posTop+10}px`),e.attr("fill","red"),e.on("mouseover",e=>{let t=a.g("#comment-sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView({behavior:"smooth"})}).on("mouseout",e=>{a.g("#comment-sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1)}),v.empty()||v.nodes()[0].scrollIntoView();let t=i.selectAll("g.annotations").data(s).join("g").classed("annotations",!0);t.filter(e=>"push"===e.commentMark).selectAll("circle").data(e=>[e]).join("circle").attr("r",5).attr("cx",e=>e.posLeft).attr("cy",e=>e.posTop),t.selectAll("text").data(e=>[e]).join("text").text(e=>e.comment).classed("annotation-label",!0).attr("x",e=>{if("push"===e.commentMark){return parseInt(e.posLeft.replace(/px/,""))+10+"px"}return"50px"}).attr("y",e=>"push"===e.commentMark?e.posTop:"50px")}}}(i,c)}function B(){let e=a.g("canvas").node();e.getContext("2d").clearRect(0,0,e.width,e.height),a.g("#interaction").selectAll("*").remove()}function C(){B();let e=a.g("canvas").node();e.height=0,e.width=0;let t=a.g("#interaction"),n=!1;"on"===a.g(".add-comment").select("button").node().value&&"t2"===a.g(".media-tabber").node().value&&(t.on("mouseenter",(function(){let e=a.e(this);if(a.g("#push-div").empty()&&!a.g(".media-tabber").empty()&&"t2"===a.g(".media-tabber").node().value){let n=t.append("div").attr("id","push-div");n.style("position","absolute"),n.style("top",t=>e[1]-10+"px"),n.style("left",t=>e[0]-10+"px"),n.append("div").classed("push",!0).append("i").classed("fas fa-map-pin",!0)}})),t.on("mousemove",(function(){let e=a.e(this),t=a.g("#push-div");t.empty()||n||(t.style("top",t=>e[1]-10+"px"),t.style("left",t=>e[0]-10+"px"))})),t.on("mouseleave",(function(){n||a.g("#push-div").remove()}))),t.on("click",(function(){a.d.target;a.d.stopPropagation();a.e(this);o.auth().onAuthStateChanged((function(e){if(e){if(!1===n&&"t2"===a.g(".media-tabber").node().value){let e=a.g("#push-div").append("div").classed("comment-initiated",!0);e.append("h6").text("Comment for this spot"),e.style("margin-left","15px"),e.style("margin-top","5px")}else a.g("#push-div").select(".comment-initiated").remove();n=!0!==n}else console.log("NO USER",e)}))}))}function I(){let e=document.getElementById("main-wrap");B();let t=a.g("#interaction");t.on("mouseenter",(function(){let e=a.e(this);if(a.g("#push-div").empty()&&"t3"===a.g(".media-tabber").node().value){let n=t.append("div").attr("id","push-div");n.style("position","absolute"),n.style("top",t=>e[1]+"px"),n.style("left",t=>e[0]+"px"),n.append("div").classed("push",!0).append("i").classed("fas fa-paint-brush",!0)}}));let n=a.g("#annotation-sidebar").node().getBoundingClientRect().width;t.on("mousemove",(function(){let e=a.e(this),t=a.g("#push-div");t.empty()||(t.style("top",t=>e[1]+"px"),t.style("left",t=>e[0]+n+"px"))})),t.on("mouseleave",(function(){a.g("#push-div").remove()}));let l=a.g(e).select("canvas").node();l.setAttribute("id","vid-canvas");const s=l.getContext("2d");let i=document.getElementById("video").getBoundingClientRect();var d,c;l.width=i.width,l.height=i.height,s.strokeStyle="red",s.lineWidth=5;var r=!1;return e.onmousedown=function(e){let t=document.getElementById("comment-sidebar").getBoundingClientRect();d=e.pageX-(t.width+11),c=e.pageY-40,r=!0},e.onmousemove=function(e){let t=document.getElementById("comment-sidebar").getBoundingClientRect();var n=e.pageX-(t.width+11),a=e.pageY-40;r&&(s.beginPath(),s.moveTo(d,c),s.lineTo(n,a),s.stroke(),s.closePath(),d=n,c=a)},e.onmouseup=async function(e){r=!1;let t=l.toDataURL("image/png");var n=o.storage().ref(),a=t;let s=await Promise.resolve(n.child("images/").listAll());k.push({index:s.items.length,data:a})},e}function T(){let e=document.getElementById("video");e.paused||e.ended?e.play():e.pause()}function L(e){let t=e;const n=document.getElementById("progress-bar");document.getElementById("video").currentTime=t,n.value=t,seek.value=t}function $(){const e=document.getElementById("play"),t=document.querySelectorAll(".playback-icons use");let n=document.getElementById("video");t.forEach(e=>e.classList.toggle("hidden")),n.paused?(e.setAttribute("data-title","Play (k)"),a.g("#play-r").classed("hidden",!1),a.g("#pause-r").classed("hidden",!0)):(e.setAttribute("data-title","Pause (k)"),a.g("#play-r").classed("hidden",!0),a.g("#pause-r").classed("hidden",!1))}n(119);function S(e,t,n){if("off"===n[t].value){n[t].value="on",a.g(n[t]).text("Go back");let e=a.g("#comment-sidebar").select("#annotation-wrap");e.selectAll("*").remove(),a.g("#interaction").style("pointer-events","all"),function(e){let t=e.append("div").attr("id","time-wrap"),n=t.append("div").attr("id","control").append("svg"),o=n.append("g").attr("id","play-r");o.node().viewBox="0 0 24 24",o.append("path").attr("d","M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z");let l=n.append("g").attr("id","pause-r").classed("hidden",!0);l.node().viewBox="0 0 24 24",l.append("path").attr("d","M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"),t.append("div").attr("id","time-update").append("text").text("00:00"),$(),a.g("#play-r").on("click",T),a.g("#pause-r").on("click",T)}(e),x(e)}else{B(),n[t].value="off",a.g(n[t]).text("Add Comment"),a.g("#comment-sidebar").select("#annotation-wrap").selectAll("*").remove(),a.g("#interaction").style("pointer-events","none");let e=o.database().ref();Object(p.a)(e,m)}}function R(e){let t=a.c(e["special-users"]).map(e=>e.key),n=o.auth().currentUser,l=a.g("video").node().getBoundingClientRect();if(t.indexOf(n.uid)>-1){let e=a.g(".user-wrap");e.selectAll("*").remove(),e.append("text").text(`Signed in as Admin: ${n.displayName}`);let t=e.append("a");t.attr("href","https://github.com/visdesignlab/coronavirus_annotation/issues"),t.attr("target","_blank"),t.append("span").classed("fas fa-bug",!0),[...g].push({key:"annotation",tag:"annotation",tempCall:void 0});o.storage().ref();a.g("#interaction").attr("width",l.width).attr("height",l.height)}else{let e=a.g(".user-wrap");e.selectAll("*").remove(),e.append("text").text(`Signed in as: ${n.displayName}`);let t=e.append("a");t.attr("href","https://github.com/visdesignlab/coronavirus_annotation/issues"),t.attr("target","_blank"),t.append("span").classed("fas fa-bug",!0);o.storage().ref();a.g("#interaction").attr("width",l.width).attr("height",l.height)}}const _=[],O=[];o.apps.length||o.initializeApp(p.c);let N=document.getElementById("main-wrap");if(N){!function(e,t){let n=a.g(e).select("video");n.attr("id","video");let l=n.append("source");l.attr("src",t),l.attr("type","video/mp4"),function(e){const t=document.getElementById("video-controls"),n=document.getElementById("play"),l=(document.querySelectorAll(".playback-icons use"),document.getElementById("time-elapsed")),s=document.getElementById("duration"),i=document.getElementById("progress-bar"),d=document.getElementById("seek"),c=document.getElementById("seek-tooltip"),r=document.getElementById("volume-button"),u=document.querySelectorAll(".volume-button use"),m=document.querySelector('use[href="#volume-mute"]'),g=document.querySelector('use[href="#volume-low"]'),v=document.querySelector('use[href="#volume-high"]'),f=document.getElementById("volume"),h=document.getElementById("playback-animation"),y=document.getElementById("fullscreen-button"),b=document.getElementById("video-container"),x=document.getElementById("video").getBoundingClientRect();document.createElement("video").canPlayType&&(e.controls=!1,t.classList.remove("hidden"));function k(e){const t=new Date(1e3*e).toISOString().substr(11,8);return{minutes:t.substr(3,2),seconds:t.substr(6,2)}}function w(){e.muted=!e.muted,e.muted?(f.setAttribute("data-volume",f.value),f.value=0):f.value=f.dataset.volume}function A(){h.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(1.3)"}],{duration:500})}function j(){e.paused||t.classList.add("hide")}function B(){t.classList.remove("hide")}a.g(t).style("top",`${x.height+55}px`),a.g("#interaction").style("height",`${x.height}px`),window.onresize=function(){console.log("this is firing");let e=document.getElementById("video").getBoundingClientRect();a.g(t).style("top",`${e.height+10}px`),a.g(t).style("width",`${e.width}px`)},n.addEventListener("click",T),e.addEventListener("play",$),e.addEventListener("pause",$),e.addEventListener("loadedmetadata",(function(){const t=Math.round(e.duration);d.setAttribute("max",t),i.setAttribute("max",t);const n=k(t);s.innerText=`${n.minutes}:${n.seconds}`,s.setAttribute("datetime",`${n.minutes}m ${n.seconds}s`)})),e.addEventListener("timeupdate",(function(){const t=k(Math.round(e.currentTime));l.innerText=`${t.minutes}:${t.seconds}`,l.setAttribute("datetime",`${t.minutes}m ${t.seconds}s`),a.g("#time-update").select("text").text(`${t.minutes}m ${t.seconds}s`)})),e.addEventListener("timeupdate",(function(){d.value=Math.floor(e.currentTime),i.value=Math.floor(e.currentTime)})),e.addEventListener("volumechange",(function(){u.forEach(e=>{e.classList.add("hidden")}),r.setAttribute("data-title","Mute (m)"),e.muted||0===e.volume?(m.classList.remove("hidden"),r.setAttribute("data-title","Unmute (m)")):e.volume>0&&e.volume<=.5?g.classList.remove("hidden"):v.classList.remove("hidden")})),e.addEventListener("click",T),e.addEventListener("click",A),e.addEventListener("mouseenter",B),e.addEventListener("mouseleave",j),t.addEventListener("mouseenter",B),d.addEventListener("mousemove",(function(t){const n=Math.round(t.offsetX/t.target.clientWidth*parseInt(t.target.getAttribute("max"),10));d.setAttribute("data-seek",n);const a=k(n);c.textContent=`${a.minutes}:${a.seconds}`;const o=e.getBoundingClientRect();c.style.left=`${t.pageX-o.left}px`})),d.addEventListener("input",(function(t){const n=t.target.dataset.seek?t.target.dataset.seek:t.target.value;e.currentTime=n,i.value=n,d.value=n})),f.addEventListener("input",(function(){e.muted&&(e.muted=!1),e.volume=f.value})),r.addEventListener("click",w),b.addEventListener("fullscreenchange",(function(){fullscreenIcons.forEach(e=>e.classList.toggle("hidden")),document.fullscreenElement?y.setAttribute("data-title","Exit full screen (f)"):y.setAttribute("data-title","Full screen (f)")})),a.g("#play-r").on("click",T),a.g("#pause-r").on("click",T),document.addEventListener("DOMContentLoaded",()=>{"pictureInPictureEnabled"in document||pipButton.classList.add("hidden")});let C=o.database().ref();Object(p.a)(C,E)}(n.node())}(N,"./public/entryComp_071420.mp4");let e=a.g("video").node().getBoundingClientRect();window.innerWidth,e.x,e.width;o.auth().onAuthStateChanged((function(e){if(e){let e=o.database().ref();Object(p.a)(e,m),Object(p.a)(e,R),a.g(".add-comment").select("button").on("click",(e,t,n)=>S(0,t,n)),A()}else console.log("NO USER",e);_.push(e)}))}},91:function(e,t,n){}});
//# sourceMappingURL=annotation.a0174d29.js.map