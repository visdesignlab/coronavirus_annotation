!function(e){function t(t){for(var a,s,d=t[0],i=t[1],c=t[2],p=0,u=[];p<d.length;p++)s=d[p],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&u.push(o[s][0]),o[s]=0;for(a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a]);for(r&&r(t);u.length;)u.shift()();return l.push.apply(l,c||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],a=!0,d=1;d<n.length;d++){var i=n[d];0!==o[i]&&(a=!1)}a&&(l.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},o={1:0},l=[];function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var d=window.webpackJsonp=window.webpackJsonp||[],i=d.push.bind(d);d.push=t,d=d.slice();for(var c=0;c<d.length;c++)t(d[c]);var r=i;l.push([615,0,3]),n()}({20:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return l})),n.d(t,"a",(function(){return s})),n.d(t,"d",(function(){return d}));var a=n(7);n(1);const o=[],l={apiKey:"AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",authDomain:"covid-annotation.firebaseapp.com",databaseURL:"https://covid-annotation.firebaseio.com",storageBucket:"gs://covid-annotation.appspot.com/",projectId:"covid-annotation",storageBucket:"covid-annotation.appspot.com",messagingSenderId:"297369575962",appId:"1:297369575962:web:be320c5d86a0b719a467a3",measurementId:"G-H9JT7JZCZ8"};function s(e,t){e.on("value",(function(e){t(e.val()),o.push(e.val())}),(function(e){console.log("Error: "+e.code)}))}a.apps.length||a.initializeApp(l);const d={callbacks:{signInSuccessWithAuthResult:function(e,t){return!0},uiShown:function(){document.getElementById("loader").style.display="none"}},signInFlow:"popup",signInSuccessUrl:"/coronavirus_annotation/annotation.html",signInOptions:[a.auth.GoogleAuthProvider.PROVIDER_ID,a.auth.EmailAuthProvider.PROVIDER_ID]}},615:function(e,t,n){"use strict";n.r(t),n.d(t,"currentUserKeeper",(function(){return N})),n.d(t,"specialUserKeeper",(function(){return P}));n(91);var a=n(1),o=n(7),l=n(207),s=n(115),d=n(208),i=n(209),c=n(210),r=n(211),p=n(20);function u(e,t,n,l){let s=a.g(n[t].parentNode).append("div").classed("text-input-sidebar",!0);s.append("text").text(`${l.displayName}:`),s.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here");let d=j(s,v,"Tag","tag-drop");s.append("button").text("Add").classed("btn btn-secondary",!0).on("click",()=>{a.d.stopPropagation();let t=w(l,null,d.text(),null,!0,e.key);o.database().ref("comments").push(t)})}function m(e){let t=a.c(e.comments).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.resolved),n=t.filter(e=>!1===e.reply).sort((e,t)=>e.videoTime-t.videoTime),s=t.filter(e=>!0===e.reply),d=n.map((e,t,n)=>(function e(t,n,a){t.level=a,t.replyBool=!1;let o=n.filter(e=>e.replies===t.key);if(o.length>0){t.replyKeeper=o;let l=++a;return t.replyKeeper.map(t=>e(t,n,l)),t}return t.replyKeeper=[],t})(e,s,0)),i=a.g("#sidebar").select("#annotation-wrap");i.selectAll("*").remove();a.h();let c=i.selectAll(".memo").data(d).join("div").classed("memo",!0);c.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),c.selectAll(".time").data(e=>[e]).join("span").classed("time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>(function(e){let t=parseInt(e);var n=l.Math.floor(t/60);return`${n}:${("0"+(t-60*n)).slice(-2)}`})(e.videoTime)),c.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>e.tags.split(",")).join("span").classed("badge badge-secondary",!0).text(e=>e),c.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment),c.selectAll(".post-time").data(e=>[e]).join("span").classed("post-time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>{return`on ${new Date(e.postTime).toUTCString()}`}),c.style("border",e=>`1px solid ${v.filter(t=>t.key===e.initTag)[0].color}`);let r=c.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);r.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-lg",!0),r.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let p=c.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);p.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down fa-lg",!0),p.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let m=c.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0).text("Reply ");m.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots fa-lg reply",!0);let g=c.filter(e=>e.uid===N[N.length-1].uid).selectAll(".resolve-span").data(e=>[e]).join("span").classed("resolve-span",!0).text("Resolve ");g.selectAll(".resolve").data(e=>[e]).join("i").classed("resolve",!0).classed("resolve fas fa-check",!0),g.on("click",e=>{h.ref(`comments/${e.key}/resolved`).set("true")}),m.on("click",(function(e,t,n){a.d.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,o.auth().onAuthStateChanged((function(a){a?u(e,t,n,a):console.log("NO USER",a)}))):(e.replyBool=!1,a.g(n[t].parentNode).select(".text-input-sidebar").remove())}));var h=o.database();r.on("click",e=>{let t=++e.upvote;h.ref(`comments/${e.key}/upvote`).set(`${t}`)}),p.on("click",e=>{let t=++e.downvote;h.ref(`comments/${e.key}/downvote`).set(`${t}`)}),c.on("click",e=>{"textarea"===a.d.target.tagName.toLowerCase()||"button"===a.d.target.tagName.toLowerCase()||"a"===a.d.target.tagName.toLowerCase()||"svg"===a.d.target.tagName.toLowerCase()||$(e)}),c.each((e,t,n)=>{e.replyKeeper.length>0&&function e(t){let n=t.selectAll(".reply-memo").data(e=>e.replyKeeper).join("div").classed("reply-memo",!0);n.style("margin-left",e=>`${10*e.level}px`);n.each((t,n,l)=>{!function(e){e.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),e.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>[e]).join("span").classed("badge badge-secondary",!0).style("background-color",e=>v.filter(t=>t.key===e.tags)[0].color).text(e=>e.tags),e.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment),e.selectAll(".post-time").data(e=>[e]).join("span").classed("post-time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>{return`on ${new Date(e.postTime).toUTCString()}`});let t=e.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);t.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-sm",!0),t.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let n=e.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);n.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down",!0),n.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let l=e.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0).text("Reply ");l.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots reply",!0).style("float","right");let s=e.selectAll(".resolve-span").data(e=>[e]).join("span").classed("resolve-span",!0).text("Resolve ");s.selectAll(".resolve").data(e=>[e]).join("i").classed("resolve",!0).classed("resolve fas fa-check",!0),s.on("click",e=>{h.ref(`comments/${e.key}/resolved`).set("true")}),l.on("click",(function(e,t,n){a.d.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,o.auth().onAuthStateChanged((function(a){a?u(e,t,n,a):console.log("NO USER",a)}))):(e.replyBool=!1,a.g(n[t].parentNode).select(".text-input-sidebar").remove())}))}(a.g(l[n])),t.replyKeeper.length>0&&e(a.g(l[n]))})}(a.g(n[t]))})}s.b.add(d.faCheck,i.a,c.a,r.a),s.a.i2svg(),s.a.watch();const g=[],v=[{key:"question",color:"#2E86C1"},{key:"suggestion",color:"#2ECC71"},{key:"issue",color:"#F1C40F"},{key:"context",color:"#F10F42"},{key:"other",color:"black"}];function h(e,t,n){n.push(e.value);let o=t.selectAll("span.badge").data(n).join("span").classed("badge badge-secondary",!0);o.text(e=>`${e}  `);let l=o.append("text").text("X");l.style("padding","5px"),l.style("cursor","pointer"),l.on("click",(e,t,o)=>{a.g(o[t].parentNode).remove(),n=n.filter(t=>t!=e)}),e.value=""}function f(e,t){let n=e.append("div").classed("tag-input-wrap",!0),o=n.append("div").classed("tag-wrap",!0),l=o.selectAll("span.badge").data(t).join("span").classed("badge badge-secondary",!0);if(t.length>0){l.text(e=>`${e}  `);let e=l.append("text").text("X");e.style("padding","5px"),e.style("cursor","pointer"),e.on("click",(e,n,o)=>{a.g(o[n].parentNode).remove(),t=t.filter(t=>t!=e)})}let s=n.append("input").attr("id","tag-input");s.classed("form-control",!0),s.node().type="text",s.node()["aria-label"]="tag add",s.node().placeholder="Type to add...";const d=document.getElementById("tag-input");d.addEventListener("keyup",(function(e){"Enter"===e.key&&(""!=d.value?h(d,o,t):console.log("nothing to add"))}));let i=p.b[p.b.length-1].comments,c=a.c(i).map(e=>e.value).flatMap(e=>e.tags.split(","));!function(e,t){var n;function o(e){if(!e)return!1;!function(e){for(var t=0;t<e.length;t++)e[t].classList.remove("autocomplete-active")}(e),n>=e.length&&(n=0),n<0&&(n=e.length-1),e[n].classList.add("autocomplete-active")}function l(t){for(var n=document.getElementsByClassName("autocomplete-items"),a=0;a<n.length;a++)t!=n[a]&&t!=e&&n[a].parentNode.removeChild(n[a])}e.addEventListener("input",(function(o){var s,d,i,c=this.value;if(l(),!c)return!1;for(n=-1,(s=document.createElement("DIV")).setAttribute("id",this.id+"autocomplete-list"),s.setAttribute("class","autocomplete-items"),this.parentNode.appendChild(s),i=0;i<t.length;i++)t[i].substr(0,c.length).toUpperCase()==c.toUpperCase()&&((d=document.createElement("DIV")).innerHTML="<strong>"+t[i].substr(0,c.length)+"</strong>",d.innerHTML+=t[i].substr(c.length),d.innerHTML+="<input type='hidden' value='"+t[i]+"'>",d.addEventListener("click",(function(t){e.value=this.getElementsByTagName("input")[0].value,l()})),s.appendChild(d),a.g(d).on("click",()=>{console.log("click!!"),h(a.g("#tag-input").node(),a.g(".tag-wrap"),a.g(".tag-wrap").selectAll("span").data())}))})),e.addEventListener("keydown",(function(e){var t=document.getElementById(this.id+"autocomplete-list");t&&(t=t.getElementsByTagName("div")),40==e.keyCode?(n++,o(t)):38==e.keyCode?(n--,o(t)):13==e.keyCode&&(e.preventDefault(),n>-1&&t&&t[n].click())})),document.addEventListener("click",(function(e){l(e.target),console.log("e target",e.target,e.target,e.target.value)}))}(d,Array.from(new Set(c)))}function y(){console.log("this is a test");let e=a.g("canvas").node();e.getContext("2d").clearRect(0,0,e.width,e.height),e.height=0,e.width=0,a.g("#interaction").selectAll("*").remove()}function b(e){e.append("div").classed("template-wrap",!0);let t=e.append("div").classed("dropdown comment-type",!0),n=t.append("button").classed("btn dropbtn dropdown-toggle",!0);n.text("Color Code by Comment");n.node().value="other";let l=t.append("div").attr("id","comment-type").classed("dropdown-content",!0);l.append("a").text("text").attr("font-size",11);let s=l.selectAll("a").data(v).join("a").text(e=>e.key);s.append("svg").classed("color-box",!0).append("rect").attr("width",10).attr("height",10).attr("x",5).attr("y",8).attr("fill",e=>e.color),s.on("click",(e,t,a)=>{n.text(e.key);n.node().value=e.key,l.classed("show",!1)}),n.on("click",(e,t,n)=>{l.classed("show")?l.classed("show",!1):l.classed("show",!0)}),function(e){console.log("div",e),document.getElementById("video").currentTime;let t=e.select(".template-wrap");t.append("div").classed("temp-text",!0).html("\n    <br>\n    <p>Add a comment here - comments can be suggestions for the tool, critiques of the animation, questions on biology, etc.</p>\n    <p>Please include as any tags that describe the comment you are making</p> \n    "),t.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here"),f(t,[])}(e);let d=A(e,{label:"No spatial reference",callBack:y},{label:"Mark a Point",callBack:T},{label:"Draw",callBack:C},"media-tabber");y();let i=e.append("button").attr("id","comment-submit-button").text("Add").classed("btn btn-secondary",!0);i.on("click",async()=>{console.log("button submit");let e=N[N.length-1];a.d.stopPropagation();let t=a.g(".tag-wrap").selectAll(".badge"),l=document.getElementById("video").currentTime;if("t2"===d.node().value){let s=a.g("#push-div").empty()?null:[a.g("#push-div").style("left"),a.g("#push-div").style("top")],d=w(e,l,t.data().toString(),s,!1,null,"push",n.node().value,!1);o.database().ref("comments").push(d),Object(p.a)(o.database().ref(),m),k(),a.g("#interaction").selectAll("*").remove()}else if("t3"===d.node().value)E("comments",e,t,n.node().value,l),a.g("#interaction").selectAll("*").remove();else{let s=null,d=w(e,l,t.data().toString(),s,!1,null,"push",n.node().value,!1);o.database().ref("comments").push(d),Object(p.a)(o.database().ref(),m),k(),a.g("#interaction").selectAll("*").remove()}})}const x=[];function k(){a.g("#push-div").remove(),a.g(".template-wrap").remove(),a.g(".media-tabber").remove(),a.g(".time-tabber").remove(),a.g("form").remove(),a.g("#comment-submit-button").remove(),a.g("#time-wrap").select("svg.range-svg").remove(),a.g(".dropdown.ann-type-drop").remove();let e=a.g("canvas").node();e.getContext("2d").clearRect(0,0,e.width,e.height),e.height=0,e.width=0}function w(e,t,n,o,l,s,d,i,c){return{videoTime:t,postTime:(new Date).toString(),comment:a.g("#text-area-id").node().value,commentMark:d,posTop:null!=o?o[1]:null,posLeft:null!=o?o[0]:null,upvote:0,downvote:0,tags:"Tag"===n?"none":n,replies:s,reply:l,uid:e.uid,displayName:e.displayName,resolved:!1,initTag:i,specialAnno:c}}function A(e,t,n,a,o){let l=e.append("form").classed(o,!0),s=l.append("label").classed("container",!0);s.text(t.label),s.node().for="t1";let d=s.append("input").attr("id","t1");d.node().name="radio",d.node().type="radio",d.node().checked=!0;s.append("span").classed("checkmark",!0);l.node().value="t1";let i=l.append("label").classed("container",!0).text(n.label);i.node().for="t2";let c=i.append("input").attr("id","t2");c.node().name="radio",c.node().type="radio",c.node().checked=!1;i.append("span").classed("checkmark",!0);let r=l.append("label").classed("container",!0).text(a.label);r.node().for="t3";let p=r.append("input").attr("id","t3");p.node().name="radio",p.node().type="radio",p.node().checked=!1;r.append("span").classed("checkmark",!0);return d.on("click",()=>{d.node().checked=!0,c.node().checked=!1,l.node().value="t1",t.callBack()}),c.on("click",()=>{d.node().checked=!1,c.node().checked=!0,l.node().value="t2",n.callBack()}),p.on("click",()=>{d.node().checked=!1,c.node().checked=!1,p.node().checked=!0,l.node().value="t3",a.callBack()}),l}function E(e,t,n,l,s){var d=o.storage().ref(),i=x[x.length-1].data;d.child(`images/im-${t.uid}-${x[x.length-1].index}.png`).putString(i,"data_url").then((function(d){let i=a.g("#push-div").empty()?null:[a.g("#push-div").style("left"),a.g("#push-div").style("top")],c=w(t,s,n.data().toString(),i,!1,null,"doodle",null===l?"other":l.tag,!1);c.doodle=!0,c.doodleName=d.metadata.name,o.database().ref(e).push(c),Object(p.a)(o.database().ref(),m),k()}))}function j(e,t,n,l,s,d,i,c){let r=e.append("div").classed(`dropdown ${l}`,!0),u=r.append("button").classed("btn dropbtn dropdown-toggle",!0);u.text(n);u.node().value=n;let g=r.append("div").attr("id",l).classed("dropdown-content",!0);g.append("a").text("text").attr("font-size",11);let v=g.selectAll("a").data(t).join("a").text(e=>e.key);return i||v.append("svg").classed("color-box",!0).append("rect").attr("width",10).attr("height",10).attr("x",5).attr("y",8).attr("fill",e=>e.color),v.on("click",(t,n,l)=>{u.text(t.key);let r="annotation"===t.key?"annotations":"comments";if(u.node().value=t.key,g.classed("show",!1),i){a.g(".template-wrap").selectAll("*").remove(),e.select(".tabber").remove(),e.select("#comment-submit-button").remove(),t.tempCall(e,s,d);let n=A(e,{label:"Drop a Pin",callBack:T},{label:"Draw",callBack:C},"media-tabber");({t1:y,t2:T,t3:C})[a.g(".media-tabber").node().value]();e.append("button").attr("id","comment-submit-button").text("Add").classed("btn btn-secondary",!0).on("click",async()=>{a.d.stopPropagation();let e=a.g(".tag-wrap").selectAll(".badge");if("question"===t.key)if("biology"!=a.g(".q-tag-drop").select("button").node().value&&"animation"!=a.g(".q-tag-drop").select("button").node().value)window.alert("select a type of question");else if("t1"===n.node().value){let n=document.getElementById("video").currentTime,l=a.g("#push-div").empty()?null:[a.g("#push-div").style("left"),a.g("#push-div").style("top")],d=w(s,n,e.data().toString(),l,!1,null,"push",t.tag,!1);o.database().ref(r).push(d),Object(p.a)(o.database().ref(),m),k()}else x(s,e,t);else if("annotation"===t.key){let l="t2"===a.g(".time-tabber").node().value?function(){let e=a.g(".range-svg").select("#labelright").text();return`[${a.g(".range-svg").select("#labelleft").text()},${e}]`}():`[${document.getElementById("video").currentTime}]`;if("t2"===n.node().value){let n=a.g("#push-div").empty()?null:[a.g("#push-div").style("left"),a.g("#push-div").style("top")],d=w(s,l,e.data().toString(),n,!1,null,"push",t.tag,"annotations"===r);o.database().ref(r).push(d),Object(p.a)(o.database().ref(),m),k()}else"t3"===n.node().value&&E(r,s,e,t,l)}else{let l=document.getElementById("video").currentTime;if("t2"===n.node().value){let n=a.g("#push-div").empty()?null:[a.g("#push-div").style("left"),a.g("#push-div").style("top")],d=w(s,l,e.data().toString(),n,!1,null,"push",t.tag,"annotations"===r);o.database().ref(r).push(d),Object(p.a)(o.database().ref(),m),k()}else"t3"===n.node().value&&E(r,s,e,t,l)}})}c&&(a.g(".tag-wrap").remove(),a.g(".input-group.mb-3").remove(),f(e,[t.key,"question"]))}),u.on("click",(e,t,n)=>{g.classed("show")?g.classed("show",!1):g.classed("show",!0)}),v.raise(),u}function B(e){let t=a.c(e.comments).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.resolved).filter(e=>!1===e.reply).sort((e,t)=>e.videoTime-t.videoTime),n=a.g("#annotation-layer").select("svg"),l=a.f().domain([0,document.getElementById("video").duration]).range([3,n.node().getBoundingClientRect().width]),s=(a.f().domain([0,1]).range([10,15]),n.selectAll(".memo").data(t).join("rect").attr("width",3).attr("height",10).classed("memo",!0));s.style("fill",e=>`${v.filter(t=>t.key===e.initTag)[0].color}`),s.attr("x",e=>l(e.videoTime)),s.attr("y",10),s.on("mouseover",e=>{let t=a.g("#sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView()}).on("mouseout",e=>{a.g("#sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1)}).on("click",e=>{$(e)}),async function(){var e=o.storage().ref();let t=await e.child("images/").listAll(),n=a.g("#interaction").select("svg"),l=n.empty()?a.g("#interaction").append("svg"):n;const s=document.querySelector("video");let d=a.g("video").node().getBoundingClientRect(),i=a.g("#interaction");i.style("width",d.width+"px").style("height",d.height+"px");let c=await a.b("./public/sample-anno-sheet.csv"),r=a.g("#annotation-right");s.ontimeupdate=async e=>{console.log("checked",a.g(".show-comments").select(".form-check").select(".form-check-input").node().checked);let n=function(e){return e.map(e=>{if(e.video_time.includes("-")){let t=e.video_time.split("-"),n=t[0].split(":"),a=60*+n[0]+ +n[1],o=t[1].split(":"),l=60*+o[0]+ +o[1];e.seconds=[a,l]}else{let t=e.video_time.split(":"),n=60*+t[0]+ +t[1];e.seconds=[n]}return e})}(c),o=[s.currentTime-1.5,s.currentTime+1.5],d=n.filter(e=>e.seconds<o[1]&&e.seconds>o[0]);console.log("filtered",d);let u=r.selectAll("div.anno").data(d).join("div").classed("anno",!0),m=(u.selectAll("h4").data(e=>[e]).join("h4").text(e=>e.annotation_type),u.selectAll("text.anno-text").data(e=>[e]).join("text").text(e=>e.text_description).classed("anno-text",!0),a.c(p.b[p.b.length-1].annotations).map(e=>e.value).filter((e,t)=>{let n=JSON.parse(e.videoTime);return n.length>1?n[0]<=s.currentTime&&n[1]>=s.currentTime:n[0]<o[1]&&n[0]>o[0]})),g=a.g("#annotation-layer").selectAll(".memo"),v=a.g("#sidebar").select("#annotation-wrap").selectAll(".memo");g.classed("selected",!1),v.classed("selected",!1);let h=g.filter(e=>e.videoTime<o[1]&&e.videoTime>o[0]).classed("selected",!0),f=v.filter(e=>e.videoTime<o[1]&&e.videoTime>o[0]).classed("selected",!0),y=h.filter(e=>"push"===e.commentMark),b=h.filter(e=>"doodle"===e.commentMark).data().map(async e=>{return await t.items.filter(t=>t.location.path===`images/${e.doodleName}`)[0].getDownloadURL()}),x=m.filter(e=>"doodle"===e.commentMark).map(async e=>{return await t.items.filter(t=>t.location.path===`images/${e.doodleName}`)[0].getDownloadURL()});if(a.g(".show-comments").select(".form-check").select(".form-check-input").node().checked){i.selectAll(".doodles").data(await Promise.all(b)).join("img").classed("doodles",!0).attr("src",e=>e),i.selectAll(".anno-doodles").data(await Promise.all(x)).join("img").classed("anno-doodles",!0).attr("src",e=>e);let e=l.selectAll("g.pushed").data(y.data()).join("g").classed("pushed",!0).selectAll("circle").data(e=>[e]).join("circle");e.attr("r",10),e.attr("cx",e=>e.posLeft),e.attr("cy",e=>e.posTop),e.attr("fill","red"),e.on("mouseover",e=>{let t=a.g("#sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView()}).on("mouseout",e=>{a.g("#sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1)}),f.empty()||f.nodes()[0].scrollIntoView();let t=l.selectAll("g.annotations").data(m).join("g").classed("annotations",!0);t.filter(e=>"push"===e.commentMark).selectAll("circle").data(e=>[e]).join("circle").attr("r",5).attr("cx",e=>e.posLeft).attr("cy",e=>e.posTop),t.selectAll("text").data(e=>[e]).join("text").text(e=>e.comment).classed("annotation-label",!0).attr("x",e=>{if("push"===e.commentMark){return parseInt(e.posLeft.replace(/px/,""))+10+"px"}return"50px"}).attr("y",e=>"push"===e.commentMark?e.posTop:"50px")}}}()}function I(){let e=a.g("canvas").node();e.getContext("2d").clearRect(0,0,e.width,e.height),a.g("#interaction").selectAll("*").remove()}function T(){I();let e=a.g("canvas").node();e.height=0,e.width=0;let t=a.g("#interaction");t.style("width",`${document.getElementById("video").getBoundingClientRect().width}px`),t.style("height",`${document.getElementById("video").getBoundingClientRect().height}px`);let n=!1;"on"===a.g(".add-comment").select("button").node().value&&"t2"===a.g(".media-tabber").node().value&&(t.on("mouseenter",(function(){let e=a.e(this);if(a.g("#push-div").empty()&&!a.g(".media-tabber").empty()&&"t2"===a.g(".media-tabber").node().value){let n=t.append("div").attr("id","push-div");n.style("position","absolute"),n.style("top",t=>e[1]-10+"px"),n.style("left",t=>e[0]-10+"px"),n.append("div").classed("push",!0).append("i").classed("fas fa-map-pin",!0)}})),t.on("mousemove",(function(){let e=a.e(this),t=a.g("#push-div");t.empty()||n||(t.style("top",t=>e[1]-10+"px"),t.style("left",t=>e[0]-10+"px"))})),t.on("mouseleave",(function(){n||a.g("#push-div").remove()}))),t.on("click",(function(){a.d.target;a.d.stopPropagation();a.e(this);o.auth().onAuthStateChanged((function(e){if(e){if(!1===n&&"t2"===a.g(".media-tabber").node().value){let e=a.g("#push-div").append("div").classed("comment-initiated",!0);e.append("h6").text("Comment for this spot"),e.style("margin-left","15px"),e.style("margin-top","5px")}else a.g("#push-div").select(".comment-initiated").remove();n=!0!==n}else console.log("NO USER",e)}))}))}function C(){let e=document.getElementById("main-wrap");I();let t=a.g("#interaction");t.on("mouseenter",(function(){let e=a.e(this);if(a.g("#push-div").empty()&&"t3"===a.g(".media-tabber").node().value){let n=t.append("div").attr("id","push-div");n.style("position","absolute"),n.style("top",t=>e[1]-10+"px"),n.style("left",t=>e[0]-10+"px"),n.append("div").classed("push",!0).append("i").classed("fas fa-paint-brush",!0)}})),t.on("mousemove",(function(){let e=a.e(this),t=a.g("#push-div");t.empty()||(t.style("top",t=>e[1]-10+"px"),t.style("left",t=>e[0]-10+"px"))})),t.on("mouseleave",(function(){a.g("#push-div").remove()}));let n=a.g(e).select("canvas").node();n.setAttribute("id","vid-canvas");const l=n.getContext("2d");let s=document.getElementById("video").getBoundingClientRect();var d,i;n.width=s.width,n.height=s.height,l.strokeStyle="red",l.lineWidth=5;var c=!1;return e.onmousedown=function(e){let t=document.getElementById("sidebar").getBoundingClientRect();d=e.pageX-(t.width+11),i=e.pageY-40,c=!0},e.onmousemove=function(e){let t=document.getElementById("sidebar").getBoundingClientRect();var n=e.pageX-(t.width+11),a=e.pageY-40;c&&(l.beginPath(),l.moveTo(d,i),l.lineTo(n,a),l.stroke(),l.closePath(),d=n,i=a)},e.onmouseup=async function(e){c=!1;let t=n.toDataURL("image/png");var a=o.storage().ref(),l=t;let s=await Promise.resolve(a.child("images/").listAll());x.push({index:s.items.length,data:l})},e}function L(){let e=document.getElementById("video");e.paused||e.ended?e.play():e.pause()}function $(e){let t=e.videoTime;const n=document.getElementById("progress-bar");let o=a.g("#sidebar").select("#annotation-wrap");o.selectAll(".memo").classed("selected",!1);let l=o.selectAll(".memo").filter(t=>t.key===e.key);l.classed("selected",!0),l.nodes()[0].scrollIntoView(),document.getElementById("video").currentTime=t,n.value=t,seek.value=t}function S(){const e=document.getElementById("play"),t=document.querySelectorAll(".playback-icons use");let n=document.getElementById("video");t.forEach(e=>e.classList.toggle("hidden")),n.paused?(e.setAttribute("data-title","Play (k)"),a.g("#play-r").classed("hidden",!1),a.g("#pause-r").classed("hidden",!0)):(e.setAttribute("data-title","Pause (k)"),a.g("#play-r").classed("hidden",!0),a.g("#pause-r").classed("hidden",!1))}n(119);function R(e,t,n){if(console.log(e,t,n),"off"===n[t].value){n[t].value="on",a.g(n[t]).text("Go back");let e=a.g("#sidebar").select("#annotation-wrap");e.selectAll("*").remove(),a.g("#interaction").style("pointer-events","all"),function(e){let t=e.append("div").attr("id","time-wrap"),n=t.append("div").attr("id","control").append("svg"),o=n.append("g").attr("id","play-r");o.node().viewBox="0 0 24 24",o.append("path").attr("d","M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z");let l=n.append("g").attr("id","pause-r").classed("hidden",!0);l.node().viewBox="0 0 24 24",l.append("path").attr("d","M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"),t.append("div").attr("id","time-update").append("text").text("00:00"),S(),a.g("#play-r").on("click",L),a.g("#pause-r").on("click",L)}(e),b(e)}else{I(),n[t].value="off",a.g(n[t]).text("Add Comment"),a.g("#sidebar").select("#annotation-wrap").selectAll("*").remove(),a.g("#interaction").style("pointer-events","none");let e=o.database().ref();Object(p.a)(e,m)}}function O(e){let t=a.c(e["special-users"]).map(e=>e.key),n=o.auth().currentUser,l=a.g("video").node().getBoundingClientRect();if(t.indexOf(n.uid)>-1){let e=a.g(".user-wrap");e.selectAll("*").remove(),e.append("text").text(`Signed in as Admin: ${n.displayName}`);let t=e.append("a");t.attr("href","https://github.com/visdesignlab/coronavirus_annotation/issues"),t.attr("target","_blank"),t.append("span").classed("fas fa-bug",!0),[...g].push({key:"annotation",tag:"annotation",tempCall:void 0});o.storage().ref();a.g("#interaction").attr("width",l.width).attr("height",l.height)}else{let e=a.g(".user-wrap");e.selectAll("*").remove(),e.append("text").text(`Signed in as: ${n.displayName}`);let t=e.append("a");t.attr("href","https://github.com/visdesignlab/coronavirus_annotation/issues"),t.attr("target","_blank"),t.append("span").classed("fas fa-bug",!0);o.storage().ref();a.g("#interaction").attr("width",l.width).attr("height",l.height)}}const N=[],P=[];o.apps.length||o.initializeApp(p.c);let M=document.getElementById("main-wrap");if(M){!function(e,t){let n=a.g(e).select("video");n.attr("id","video");let l=n.append("source");l.attr("src",t),l.attr("type","video/mp4"),function(e){const t=document.getElementById("video-controls"),n=document.getElementById("play"),l=(document.querySelectorAll(".playback-icons use"),document.getElementById("time-elapsed")),s=document.getElementById("duration"),d=document.getElementById("progress-bar"),i=document.getElementById("seek"),c=document.getElementById("seek-tooltip"),r=document.getElementById("volume-button"),u=document.querySelectorAll(".volume-button use"),m=document.querySelector('use[href="#volume-mute"]'),g=document.querySelector('use[href="#volume-low"]'),v=document.querySelector('use[href="#volume-high"]'),h=document.getElementById("volume"),f=document.getElementById("playback-animation"),y=document.getElementById("fullscreen-button"),b=document.getElementById("video-container");document.getElementById("video").getBoundingClientRect();document.createElement("video").canPlayType&&(e.controls=!1,t.classList.remove("hidden"));function x(e){const t=new Date(1e3*e).toISOString().substr(11,8);return{minutes:t.substr(3,2),seconds:t.substr(6,2)}}function k(){e.muted=!e.muted,e.muted?(h.setAttribute("data-volume",h.value),h.value=0):h.value=h.dataset.volume}function w(){f.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(1.3)"}],{duration:500})}function A(){e.paused||t.classList.add("hide")}function E(){t.classList.remove("hide")}a.g(t).style("width","890px"),n.addEventListener("click",L),e.addEventListener("play",S),e.addEventListener("pause",S),e.addEventListener("loadedmetadata",(function(){const t=Math.round(e.duration);i.setAttribute("max",t),d.setAttribute("max",t);const n=x(t);s.innerText=`${n.minutes}:${n.seconds}`,s.setAttribute("datetime",`${n.minutes}m ${n.seconds}s`)})),e.addEventListener("timeupdate",(function(){const t=x(Math.round(e.currentTime));l.innerText=`${t.minutes}:${t.seconds}`,l.setAttribute("datetime",`${t.minutes}m ${t.seconds}s`),a.g("#time-update").select("text").text(`${t.minutes}m ${t.seconds}s`)})),e.addEventListener("timeupdate",(function(){i.value=Math.floor(e.currentTime),d.value=Math.floor(e.currentTime)})),e.addEventListener("volumechange",(function(){u.forEach(e=>{e.classList.add("hidden")}),r.setAttribute("data-title","Mute (m)"),e.muted||0===e.volume?(m.classList.remove("hidden"),r.setAttribute("data-title","Unmute (m)")):e.volume>0&&e.volume<=.5?g.classList.remove("hidden"):v.classList.remove("hidden")})),e.addEventListener("click",L),e.addEventListener("click",w),e.addEventListener("mouseenter",E),e.addEventListener("mouseleave",A),t.addEventListener("mouseenter",E),i.addEventListener("mousemove",(function(t){const n=Math.round(t.offsetX/t.target.clientWidth*parseInt(t.target.getAttribute("max"),10));i.setAttribute("data-seek",n);const a=x(n);c.textContent=`${a.minutes}:${a.seconds}`;const o=e.getBoundingClientRect();c.style.left=`${t.pageX-o.left}px`})),i.addEventListener("input",(function(t){const n=t.target.dataset.seek?t.target.dataset.seek:t.target.value;e.currentTime=n,d.value=n,i.value=n})),h.addEventListener("input",(function(){e.muted&&(e.muted=!1),e.volume=h.value})),r.addEventListener("click",k),b.addEventListener("fullscreenchange",(function(){fullscreenIcons.forEach(e=>e.classList.toggle("hidden")),document.fullscreenElement?y.setAttribute("data-title","Exit full screen (f)"):y.setAttribute("data-title","Full screen (f)")})),a.g("#play-r").on("click",L),a.g("#pause-r").on("click",L),document.addEventListener("DOMContentLoaded",()=>{"pictureInPictureEnabled"in document||pipButton.classList.add("hidden")});let j=o.database().ref();Object(p.a)(j,B)}(n.node())}(M,"./public/entryComp_071420.mp4");let e=a.g("video").node().getBoundingClientRect(),t=window.innerWidth-(e.x+e.width);a.g("#annotation-right").style("left",e.x+e.width+"px"),a.g("#annotation-right").style("height",e.height+"px"),a.g("#annotation-right").style("min-width",t+"px"),a.g("#annotation-right").select("#control").style("margin-left",t/2-10+"px"),o.auth().onAuthStateChanged((function(e){if(e){let e=o.database().ref();Object(p.a)(e,m),Object(p.a)(e,O),a.g(".add-comment").select("button").on("click",(e,t,n)=>R(e,t,n)),k()}else console.log("NO USER",e);N.push(e)}))}},91:function(e,t,n){}});
//# sourceMappingURL=annotation.3ab1aaa1.js.map