!function(e){function t(t){for(var o,s,i=t[0],d=t[1],r=t[2],u=0,p=[];u<i.length;u++)s=i[u],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&p.push(a[s][0]),a[s]=0;for(o in d)Object.prototype.hasOwnProperty.call(d,o)&&(e[o]=d[o]);for(c&&c(t);p.length;)p.shift()();return l.push.apply(l,r||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],o=!0,i=1;i<n.length;i++){var d=n[i];0!==a[d]&&(o=!1)}o&&(l.splice(t--,1),e=s(s.s=n[0]))}return e}var o={},a={1:0},l=[];function s(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=o,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var i=window.webpackJsonp=window.webpackJsonp||[],d=i.push.bind(i);i.push=t,i=i.slice();for(var r=0;r<i.length;r++)t(i[r]);var c=d;l.push([615,0,3]),n()}({118:function(e,t,n){},38:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return l})),n.d(t,"c",(function(){return s}));var o=n(14);n(5);const a={apiKey:"AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",authDomain:"covid-annotation.firebaseapp.com",databaseURL:"https://covid-annotation.firebaseio.com",projectId:"covid-annotation",storageBucket:"covid-annotation.appspot.com",messagingSenderId:"297369575962",appId:"1:297369575962:web:be320c5d86a0b719a467a3",measurementId:"G-H9JT7JZCZ8"};function l(e,t){e.on("value",(function(e){console.log("valuee",e.val()),t(e.val())}),(function(e){console.log("Error: "+e.code)}))}o.apps.length||o.initializeApp(a);const s={callbacks:{signInSuccessWithAuthResult:function(e,t){return!0},uiShown:function(){document.getElementById("loader").style.display="none"}},signInFlow:"popup",signInSuccessUrl:"/coronavirus_annotation/annotation.html",signInOptions:[o.auth.GoogleAuthProvider.PROVIDER_ID,o.auth.EmailAuthProvider.PROVIDER_ID]}},615:function(e,t,n){"use strict";n.r(t);n(118);var o=n(5),a=n(14),l=n(38),s=n(114),i=n(207),d=n(208),r=n(209),c=n(210);function u(e,t,n,l){let s=o.e(n[t].parentNode).append("div").classed("text-input-sidebar",!0);s.append("text").text(`${l.displayName}:`),s.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here");let i=y(s,v,"Tag","tag-drop");s.append("button").text("Add").classed("btn btn-secondary",!0).on("click",()=>{o.b.stopPropagation();let t=f(l,null,i.text(),null,!0,e.key);a.database().ref("comments").push(t)})}function p(e){let t=o.a(e.comments).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.resolved),n=t.filter(e=>!1===e.reply).sort((e,t)=>e.videoTime-t.videoTime),l=t.filter(e=>!0===e.reply),s=n.map((e,t,n)=>(function e(t,n,o){t.level=o,t.replyBool=!1;let a=n.filter(e=>e.replies===t.key);if(a.length>0){t.replyKeeper=a;let l=++o;return t.replyKeeper.map(t=>e(t,n,l)),t}return t.replyKeeper=[],t})(e,l,0)),i=o.e("#sidebar").select("#annotation-wrap");i.selectAll("*").remove();o.f();let d=i.selectAll(".memo").data(s).join("div").classed("memo",!0);d.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),d.selectAll(".time").data(e=>[e]).join("span").classed("time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>g(e.videoTime)),d.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>[e]).join("span").classed("badge badge-secondary",!0).style("background-color",e=>v.filter(t=>t.key===e.tags)[0].color).text(e=>e.tags),d.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment),d.selectAll(".post-time").data(e=>[e]).join("span").classed("post-time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>{let t=new Date(e.postTime);return console.log(t.toUTCString()),`on ${t.toUTCString()}`});let r=d.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);r.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-lg",!0),r.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let c=d.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);c.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down fa-lg",!0),c.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let p=d.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0).text("Reply ");p.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots fa-lg reply",!0);let m=d.selectAll(".resolve-span").data(e=>[e]).join("span").classed("resolve-span",!0).text("Resolve ");m.selectAll(".resolve").data(e=>[e]).join("i").classed("resolve",!0).classed("resolve fas fa-check",!0),m.on("click",e=>{f.ref(`comments/${e.key}/resolved`).set("true")}),p.on("click",(function(e,t,n){o.b.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,a.auth().onAuthStateChanged((function(o){o?u(e,t,n,o):console.log("NO USER",o)}))):(e.replyBool=!1,o.e(n[t].parentNode).select(".text-input-sidebar").remove())}));var f=a.database();r.on("click",e=>{let t=++e.upvote;f.ref(`comments/${e.key}/upvote`).set(`${t}`)}),c.on("click",e=>{let t=++e.downvote;f.ref(`comments/${e.key}/downvote`).set(`${t}`)}),d.on("click",e=>{"textarea"===o.b.target.tagName.toLowerCase()||"button"===o.b.target.tagName.toLowerCase()||"a"===o.b.target.tagName.toLowerCase()||"svg"===o.b.target.tagName.toLowerCase()?console.log("do nothing"):A(e)}),d.each((e,t,n)=>{e.replyKeeper.length>0&&function e(t){let n=t.selectAll(".reply-memo").data(e=>e.replyKeeper).join("div").classed("reply-memo",!0);n.style("margin-left",e=>`${10*e.level}px`);n.each((t,n,l)=>{!function(e){e.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),e.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>[e]).join("span").classed("badge badge-secondary",!0).style("background-color",e=>v.filter(t=>t.key===e.tags)[0].color).text(e=>e.tags),e.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment),e.selectAll(".post-time").data(e=>[e]).join("span").classed("post-time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>{return`on ${new Date(e.postTime).toUTCString()}`});let t=e.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);t.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-sm",!0),t.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let n=e.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);n.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down",!0),n.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let l=e.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0).text("Reply ");l.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots reply",!0).style("float","right");let s=e.selectAll(".resolve-span").data(e=>[e]).join("span").classed("resolve-span",!0).text("Resolve ");s.selectAll(".resolve").data(e=>[e]).join("i").classed("resolve",!0).classed("resolve fas fa-check",!0),s.on("click",e=>{f.ref(`comments/${e.key}/resolved`).set("true")}),l.on("click",(function(e,t,n){o.b.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,a.auth().onAuthStateChanged((function(o){o?u(e,t,n,o):console.log("NO USER",o)}))):(e.replyBool=!1,o.e(n[t].parentNode).select(".text-input-sidebar").remove())}))}(o.e(l[n])),t.replyKeeper.length>0&&e(o.e(l[n]))})}(o.e(n[t]))})}s.b.add(i.faCheck,d.a,r.a,c.a),s.a.i2svg(),s.a.watch();var m=n(211);const v=[{key:"question",color:"#0FF176"},{key:"issue",color:"#FFC300"},{key:"note",color:"#FF5733"},{key:"additional input",color:"#C70039"},{key:"critique",color:"#900C3F"},{key:"note",color:"#7D3C98"},{key:"suggestion",color:"#2E86C1"},{key:"dissent",color:"gray"},{key:"digging deeper",color:"#2ECC71"},{key:"reference",color:"#F1C40F"},{key:"none",color:"black"}];function g(e){let t=parseInt(e);var n=m.Math.floor(t/60),o=t-60*n;return console.log(`${n}:${("0"+o).slice(-2)}`),`${n}:${("0"+o).slice(-2)}`}function f(e,t,n,a,l,s){return{videoTime:t,postTime:(new Date).toString(),comment:o.e("#text-area-id").node().value,posTop:null!=a?a[1]:null,posLeft:null!=a?a[0]:null,upvote:0,downvote:0,tags:"Tag"===n?"none":n,replies:s,reply:l,uid:e.uid,displayName:e.displayName,resolved:!1}}function y(e,t,n,o){let a=e.append("div").classed(`dropdown ${o}`,!0);a.style("display","inline-block");let l=a.append("button").classed("btn dropbtn dropdown-toggle",!0).text(n),s=a.append("div").attr("id",o).classed("dropdown-content",!0);s.append("a").text("text").attr("font-size",11);let i=s.selectAll("a").data(t).join("a").text(e=>e.key);return i.append("svg").classed("color-box",!0).append("rect").attr("width",10).attr("height",10).attr("x",5).attr("y",8).attr("fill",e=>e.color),i.on("click",(e,t,n)=>{l.text(e.key),s.classed("show",!1)}),l.on("click",(e,t,n)=>{s.classed("show")?s.classed("show",!1):s.classed("show",!0)}),i.raise(),l}function h(e){let t=o.a(e.comments).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.resolved).filter(e=>!1===e.reply).sort((e,t)=>e.videoTime-t.videoTime),n=o.e("#annotation-layer").select("svg"),a=o.d().domain([0,document.getElementById("video").duration]).range([3,n.node().getBoundingClientRect().width]),l=(o.d().domain([0,1]).range([10,15]),n.selectAll(".memo").data(t).join("rect").attr("width",3).attr("height",10).classed("memo",!0));l.attr("x",e=>a(e.videoTime)),l.attr("y",10),l.attr("fill",e=>v.filter(t=>t.key===e.tags)[0].color),l.on("mouseover",e=>{let t=o.e("#sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView()}).on("mouseout",e=>{o.e("#sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1)}).on("click",e=>{A(e)}),function(){let e=o.e("#interaction").select("svg");const t=document.querySelector("video");t.ontimeupdate=n=>{let a=o.e("#annotation-layer").selectAll(".memo"),l=o.e("#sidebar").select("#annotation-wrap").selectAll(".memo");a.classed("selected",!1),l.classed("selected",!1);let s=[t.currentTime-1.5,t.currentTime+1.5],i=a.filter(e=>e.videoTime<s[1]&&e.videoTime>s[0]).classed("selected",!0),d=l.filter(e=>e.videoTime<s[1]&&e.videoTime>s[0]).classed("selected",!0),r=e.selectAll("g.pushed").data(i.data()).join("g").classed("pushed",!0);r.attr("transform",e=>`translate(${e.posLeft}, ${e.posTop})`);let c=r.selectAll("circle").data(e=>[e]).join("circle");c.attr("r",10),c.attr("fill",e=>v.filter(t=>t.key===e.tags)[0].color),c.on("mouseover",e=>{let t=o.e("#sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView()}).on("mouseout",e=>{o.e("#sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1)}),d&&d.nodes()[0].scrollIntoView()}}()}function b(){let e=o.e("#interaction");e.style("width",`${document.getElementById("video").getBoundingClientRect().width}px`),e.style("height",`${document.getElementById("video").getBoundingClientRect().height}px`);let t=!1;e.on("click",(function(){console.log("test");let n=o.b.target;o.b.stopPropagation();let s=o.c(this);a.auth().onAuthStateChanged((function(i){if(i){if(console.log("is this reaching in the user",e.node(),n),n==e.select("svg").node())if(t)t=!1,o.e("#push-div").remove();else{console.log("is this reaching"),t=!0;o.d().domain([0,document.getElementById("video").duration]);let n=e.append("div").attr("id","push-div");n.style("position","absolute"),n.style("top",e=>s[1]+"px"),n.style("left",e=>s[0]+"px");n.append("svg").classed("push",!0).append("circle").attr("r",5).attr("cx",5).attr("cy",e=>5).attr("fill","purple");let d=document.getElementById("video").currentTime,r=n.append("div").classed("text-input",!0);r.append("text").text(`${i.displayName}@ ${g(d)} :`),r.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here");let c=y(r,v,"Tag","tag-drop");r.append("button").text("Add").classed("btn btn-secondary",!0).on("click",()=>{o.b.stopPropagation();let e=f(i,d,c.text(),s,!1,null);t=!1,o.e("#push-div").remove(),a.database().ref("comments").push(e),Object(l.a)(a.database().ref(),p)})}}else console.log("NO USER",i)}))}))}function x(){let e=document.getElementById("main-wrap"),t=o.e(e).select("canvas").node();t.setAttribute("id","vid-canvas");const n=t.getContext("2d");let a=document.getElementById("video").getBoundingClientRect();var l,s;t.width=a.width,t.height=a.height,n.strokeStyle="red",n.lineWidth=5;var i=!1;return e.onmousedown=function(e){let t=document.getElementById("sidebar").getBoundingClientRect();l=e.pageX-t.width,s=e.pageY,i=!0},e.onmousemove=function(e){let t=document.getElementById("sidebar").getBoundingClientRect();var o=e.pageX-t.width,a=e.pageY;i&&(n.beginPath(),n.moveTo(l,s),n.lineTo(o,a),n.stroke(),n.closePath(),l=o,s=a)},e.onmouseup=function(e){i=!1,shapeArray.push(n.save())},e}function A(e){let t=e.time,n=o.e("#sidebar").select("#annotation-wrap");n.selectAll(".memo").classed("selected",!1);let a=n.selectAll(".memo").filter(t=>t.key===e.key);a.classed("selected",!0),a.nodes()[0].scrollIntoView(),document.getElementById("video").currentTime=t,progressBar.value=t,seek.value=t}n(156);a.apps.length||a.initializeApp(l.b);let w=document.getElementById("main-wrap");function k(e){let t=o.a(e["special-users"]).map(e=>e.key),n=a.auth().currentUser;if(t.indexOf(n.uid)>-1){console.log("this is a special user");let e=o.e(".user-wrap");e.selectAll("*").remove(),e.append("text").text(`Signed in as Admin: ${n.displayName}`)}else{let e=o.e(".user-wrap");e.selectAll("*").remove(),e.append("text").text(`Signed in as: ${n.displayName}`)}}w&&function(e,t){let n=o.e(e).select("video");n.attr("id","video");let s=n.append("source");s.attr("src",t),s.attr("type","video/mp4"),function(e){const t=document.getElementById("video-controls"),n=document.getElementById("play"),s=document.querySelectorAll(".playback-icons use"),i=document.getElementById("time-elapsed"),d=document.getElementById("duration"),r=document.getElementById("progress-bar"),c=document.getElementById("seek"),u=document.getElementById("seek-tooltip"),p=document.getElementById("volume-button"),m=document.querySelectorAll(".volume-button use"),v=document.querySelector('use[href="#volume-mute"]'),g=document.querySelector('use[href="#volume-low"]'),f=document.querySelector('use[href="#volume-high"]'),y=document.getElementById("volume"),b=document.getElementById("playback-animation"),x=document.getElementById("fullscreen-button"),A=document.getElementById("video-container"),w=document.getElementById("video").getBoundingClientRect();document.createElement("video").canPlayType&&(e.controls=!1,t.classList.remove("hidden"));function k(){e.paused||e.ended?e.play():e.pause()}function E(){s.forEach(e=>e.classList.toggle("hidden")),e.paused?n.setAttribute("data-title","Play (k)"):n.setAttribute("data-title","Pause (k)")}function j(e){const t=new Date(1e3*e).toISOString().substr(11,8);return{minutes:t.substr(3,2),seconds:t.substr(6,2)}}function I(){e.muted=!e.muted,e.muted?(y.setAttribute("data-volume",y.value),y.value=0):y.value=y.dataset.volume}function B(){b.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(1.3)"}],{duration:500})}function $(){e.paused||t.classList.add("hide")}function T(){t.classList.remove("hide")}o.e(t).style("width",`${w.width}px`),n.addEventListener("click",k),e.addEventListener("play",E),e.addEventListener("pause",E),e.addEventListener("loadedmetadata",(function(){const t=Math.round(e.duration);c.setAttribute("max",t),r.setAttribute("max",t);const n=j(t);d.innerText=`${n.minutes}:${n.seconds}`,d.setAttribute("datetime",`${n.minutes}m ${n.seconds}s`)})),e.addEventListener("timeupdate",(function(){const t=j(Math.round(e.currentTime));i.innerText=`${t.minutes}:${t.seconds}`,i.setAttribute("datetime",`${t.minutes}m ${t.seconds}s`)})),e.addEventListener("timeupdate",(function(){c.value=Math.floor(e.currentTime),r.value=Math.floor(e.currentTime)})),e.addEventListener("volumechange",(function(){m.forEach(e=>{e.classList.add("hidden")}),p.setAttribute("data-title","Mute (m)"),e.muted||0===e.volume?(v.classList.remove("hidden"),p.setAttribute("data-title","Unmute (m)")):e.volume>0&&e.volume<=.5?g.classList.remove("hidden"):f.classList.remove("hidden")})),e.addEventListener("click",k),e.addEventListener("click",B),e.addEventListener("mouseenter",T),e.addEventListener("mouseleave",$),t.addEventListener("mouseenter",T),c.addEventListener("mousemove",(function(t){const n=Math.round(t.offsetX/t.target.clientWidth*parseInt(t.target.getAttribute("max"),10));c.setAttribute("data-seek",n);const o=j(n);u.textContent=`${o.minutes}:${o.seconds}`;const a=e.getBoundingClientRect();u.style.left=`${t.pageX-a.left}px`})),c.addEventListener("input",(function(t){const n=t.target.dataset.seek?t.target.dataset.seek:t.target.value;e.currentTime=n,r.value=n,c.value=n})),y.addEventListener("input",(function(){e.muted&&(e.muted=!1),e.volume=y.value})),p.addEventListener("click",I),A.addEventListener("fullscreenchange",(function(){fullscreenIcons.forEach(e=>e.classList.toggle("hidden")),document.fullscreenElement?x.setAttribute("data-title","Exit full screen (f)"):x.setAttribute("data-title","Full screen (f)")})),document.addEventListener("DOMContentLoaded",()=>{"pictureInPictureEnabled"in document||pipButton.classList.add("hidden")});let L=a.database().ref();Object(l.a)(L,h)}(n.node()),"draw"===o.e(".togg-wrap").selectAll("input").data().value?x():b()}(w,"./public/spike_protein_fusion_movie.mp4"),a.auth().onAuthStateChanged((function(e){if(e){let e=a.database().ref();Object(l.a)(e,p),Object(l.a)(e,k)}else console.log("NO USER",e)}))}});
//# sourceMappingURL=annotation.9a75eb9f.js.map