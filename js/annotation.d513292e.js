!function(e){function t(t){for(var a,s,d=t[0],i=t[1],r=t[2],u=0,p=[];u<d.length;u++)s=d[u],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&p.push(o[s][0]),o[s]=0;for(a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a]);for(c&&c(t);p.length;)p.shift()();return l.push.apply(l,r||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],a=!0,d=1;d<n.length;d++){var i=n[d];0!==o[i]&&(a=!1)}a&&(l.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},o={1:0},l=[];function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var d=window.webpackJsonp=window.webpackJsonp||[],i=d.push.bind(d);d.push=t,d=d.slice();for(var r=0;r<d.length;r++)t(d[r]);var c=i;l.push([615,0,3]),n()}({119:function(e,t,n){},39:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"a",(function(){return l})),n.d(t,"c",(function(){return s}));var a=n(16);n(88);const o={apiKey:"AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",authDomain:"covid-annotation.firebaseapp.com",databaseURL:"https://covid-annotation.firebaseio.com",projectId:"covid-annotation",storageBucket:"covid-annotation.appspot.com",messagingSenderId:"297369575962",appId:"1:297369575962:web:be320c5d86a0b719a467a3",measurementId:"G-H9JT7JZCZ8"};function l(e,t){e.on("value",(function(e){t(e.val())}),(function(e){console.log("Error: "+e.code)}))}a.apps.length||a.initializeApp(o);const s={callbacks:{signInSuccessWithAuthResult:function(e,t){return console.log("testing",e),!0},uiShown:function(){document.getElementById("loader").style.display="none"}},signInFlow:"popup",signInSuccessUrl:"/coronavirus_annotation/annotation.html",signInOptions:[a.auth.GoogleAuthProvider.PROVIDER_ID,a.auth.EmailAuthProvider.PROVIDER_ID]}},615:function(e,t,n){"use strict";n.r(t);n(119);var a=n(6),o=n(16),l=n(39),s=n(115),d=n(207),i=n(208),r=n(209),c=n(210);function u(e,t,n,l){let s=a.e(n[t].parentNode).append("div").classed("text-input-sidebar",!0);s.append("text").text(`${l.displayName}:`),s.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here");let d=v(s,g,"Tag","tag-drop");s.append("button").text("Add").classed("btn btn-secondary",!0).on("click",()=>{a.b.stopPropagation();let t=f(l,null,d.text(),null,!0,e.key);o.database().ref().push(t)})}function p(e){let t=a.a(e).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.reply).sort((e,t)=>e.time-t.time),n=a.a(e).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!0===e.reply),l=t.map((e,t,a)=>(function e(t,n,a){t.level=a,t.replyBool=!1;let o=n.filter(e=>e.replies===t.key);if(o.length>0){t.replyKeeper=o;let l=++a;return t.replyKeeper.map(t=>e(t,n,l)),t}return t.replyKeeper=[],t})(e,n,0)),s=a.e("#sidebar").select("#annotation-wrap");s.selectAll("*").remove();a.f();let d=s.selectAll(".memo").data(l).join("div").classed("memo",!0);d.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),d.selectAll(".time").data(e=>[e]).join("span").classed("time",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.time),d.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>[e]).join("span").classed("badge badge-secondary",!0).style("background-color",e=>g.filter(t=>t.key===e.tags)[0].color).text(e=>e.tags),d.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment);let i=d.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);i.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-lg",!0),i.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let r=d.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);r.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down fa-lg",!0),r.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let c=d.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0);c.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots fa-lg reply",!0).style("float","right"),c.on("click",(function(e,t,n){a.b.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,o.auth().onAuthStateChanged((function(a){a?u(e,t,n,a):console.log("NO USER",a)}))):(e.replyBool=!1,a.e(n[t].parentNode).select(".text-input-sidebar").remove())}));var p=o.database();i.on("click",e=>{let t=++e.upvote;p.ref(`${e.key}/upvote`).set(`${t}`)}),r.on("click",e=>{let t=++e.downvote;p.ref(`${e.key}/downvote`).set(`${t}`)}),d.on("click",e=>{console.log("test click",a.b.target.tagName.toLowerCase()),"textarea"===a.b.target.tagName.toLowerCase()||"button"===a.b.target.tagName.toLowerCase()||"a"===a.b.target.tagName.toLowerCase()||"svg"===a.b.target.tagName.toLowerCase()?console.log("do nothing"):x(e)}),d.each((e,t,n)=>{e.replyKeeper.length>0&&function e(t){let n=t.selectAll(".reply-memo").data(e=>e.replyKeeper).join("div").classed("reply-memo",!0);n.style("margin-left",e=>`${10*e.level}px`);n.each((t,n,l)=>{!function(e){e.selectAll(".name").data(e=>[e]).join("span").classed("name",!0).selectAll("text").data(e=>[e]).join("text").text(e=>`${e.displayName}:`),e.selectAll(".tag-span").data(e=>[e]).join("span").classed("tag-span",!0).selectAll(".badge").data(e=>[e]).join("span").classed("badge badge-secondary",!0).style("background-color",e=>g.filter(t=>t.key===e.tags)[0].color).text(e=>e.tags),e.selectAll(".comment").data(e=>[e]).join("span").classed("comment",!0).selectAll("text").data(e=>[e]).join("text").text(e=>e.comment);let t=e.selectAll(".upvote-span").data(e=>[e]).join("span").classed("upvote-span",!0);t.selectAll(".upvote").data(e=>[e]).join("i").classed("upvote fas fa-thumbs-up fa-sm",!0),t.selectAll(".up-text").data(e=>[e]).join("text").classed("up-text",!0).text(e=>`: ${e.upvote} `);let n=e.selectAll(".downvote-span").data(e=>[e]).join("span").classed("downvote-span",!0);n.selectAll(".downvote").data(e=>[e]).join("i").classed("downvote fas fa-thumbs-down",!0),n.selectAll(".down-text").data(e=>[e]).join("text").classed("down-text",!0).text(e=>`: ${e.downvote}`);let l=e.selectAll(".reply-span").data(e=>[e]).join("span").classed("reply-span",!0);l.selectAll(".reply").data(e=>[e]).join("i").classed("far fa-comment-dots reply",!0).style("float","right"),l.on("click",(function(e,t,n){a.b.stopPropagation(),!1===e.replyBool?(e.replyBool=!0,o.auth().onAuthStateChanged((function(a){a?u(e,t,n,a):console.log("NO USER",a)}))):(e.replyBool=!1,a.e(n[t].parentNode).select(".text-input-sidebar").remove())}))}(a.e(l[n])),t.replyKeeper.length>0&&e(a.e(l[n]))})}(a.e(n[t]))})}s.b.add(d.faCheck,i.a,r.a,c.a),s.a.i2svg(),s.a.watch();var m=n(152);const g=[{key:"question",color:"red"},{key:"issue",color:"purple"},{key:"info",color:"orange"},{key:"uncertainty",color:"green"}];function f(e,t,n,o,l,s){return{time:t,comment:a.e("#text-area-id").node().value,posTop:null!=o?o[1]:null,posLeft:null!=o?o[0]:null,upvote:0,downvote:0,tags:n,replies:s,reply:l,uid:e.uid,displayName:e.displayName,resolved:!1}}function v(e,t,n,a){let o=e.append("div").classed(`dropdown ${a}`,!0);o.style("display","inline-block");let l=o.append("button").classed("btn dropbtn dropdown-toggle",!0).text(n),s=o.append("div").attr("id",a).classed("dropdown-content",!0);s.append("a").text("text").attr("font-size",11);let d=s.selectAll("a").data(t).join("a").text(e=>e.key);return d.append("svg").classed("color-box",!0).append("rect").attr("width",10).attr("height",10).attr("x",5).attr("y",8).attr("fill",e=>e.color),d.on("click",(e,t,n)=>{l.text(e.key),s.classed("show",!1)}),l.on("click",(e,t,n)=>{s.classed("show")?s.classed("show",!1):s.classed("show",!0)}),d.raise(),l}function y(e){let t=a.e("#annotation-layer").select("svg"),n=a.d().domain([0,document.getElementById("video").duration]).range([3,t.node().getBoundingClientRect().width]);a.d().domain([0,1]).range([10,15]);let o=a.a(e).map(e=>{let t=e.value;return t.key=e.key,t}).filter(e=>!1===e.reply).map(e=>(e.y=m.Math.random(),e.x=.06*m.Math.random()-.03,e)),l=t.selectAll(".memo").data(o).join("rect").attr("width",3).attr("height",10).classed("memo",!0);l.attr("x",e=>n(e.time+e.x)),l.attr("y",10),l.attr("fill",e=>g.filter(t=>t.key===e.tags)[0].color),l.on("mouseover",e=>{let t=a.e("#sidebar").select("#annotation-wrap").selectAll(".memo").filter(t=>t.key===e.key);t.classed("selected",!0),t.nodes()[0].scrollIntoView()}).on("mouseout",e=>{a.e("#sidebar").select("#annotation-wrap").selectAll(".memo").classed("selected",!1).nodes()[0].scrollIntoView()}).on("click",e=>{x(e)}),function(){let e=a.e("#pushed-layer").select("svg");const t=document.querySelector("video");t.ontimeupdate=n=>{let o=a.e("#annotation-layer").selectAll(".memo"),l=a.e("#sidebar").select("#annotation-wrap").selectAll(".memo");o.classed("selected",!1),l.classed("selected",!1);let s=[t.currentTime-1.5,t.currentTime+1.5],d=o.filter(e=>e.time<s[1]&&e.time>s[0]).classed("selected",!0),i=l.filter(e=>e.time<s[1]&&e.time>s[0]).classed("selected",!0),r=e.selectAll("g.pushed").data(d.data()).join("g").classed("pushed",!0);r.attr("transform",e=>`translate(${e.posLeft}, ${e.posTop})`),r.selectAll("circle").data(e=>[e]).join("circle").attr("r",10),i&&i.nodes()[0].scrollIntoView()}}()}function h(){let e=a.e("#interaction");e.style("width",`${document.getElementById("video").getBoundingClientRect().width}px`),e.style("height",`${document.getElementById("video").getBoundingClientRect().height}px`);let t=!1;e.on("click",(function(){let n=a.b.target;a.b.stopPropagation();let s=a.c(this);o.auth().onAuthStateChanged((function(d){if(d){if(n==e.node())if(t)t=!1,a.e("#push-div").remove();else{t=!0;a.d().domain([0,document.getElementById("video").duration]);let n=e.append("div").attr("id","push-div");n.style("position","absolute"),n.style("top",e=>s[1]+"px"),n.style("left",e=>s[0]+"px");n.append("svg").append("circle").attr("r",5).attr("cx",5).attr("cy",e=>5).attr("fill","purple");let i=document.getElementById("video").currentTime,r=n.append("div").classed("text-input",!0);r.append("text").text(`${d.displayName}@ ${i} :`),r.append("textarea").attr("id","text-area-id").attr("placeholder","Comment Here");let c=v(r,g,"Tag","tag-drop");r.append("button").text("Add").classed("btn btn-secondary",!0).on("click",()=>{console.log(c.text());let e=f(d,i,tagButton.text(),s,!1,null);t=!1,a.e("#push-div").remove();let n=o.database().ref();n.push(e),Object(l.a)(n,p)})}}else console.log("NO USER",d)}))}))}function b(){let e=document.getElementById("main-wrap"),t=a.e(e).select("canvas").node();t.setAttribute("id","vid-canvas");const n=t.getContext("2d");let o=document.getElementById("video").getBoundingClientRect();var l,s;t.width=o.width,t.height=o.height,n.strokeStyle="red",n.lineWidth=5;var d=!1;return e.onmousedown=function(e){let t=document.getElementById("sidebar").getBoundingClientRect();l=e.pageX-t.width,s=e.pageY,d=!0},e.onmousemove=function(e){let t=document.getElementById("sidebar").getBoundingClientRect();var a=e.pageX-t.width,o=e.pageY;d&&(console.log(e,this.offsetLeft),n.beginPath(),n.moveTo(l,s),n.lineTo(a,o),n.stroke(),n.closePath(),l=a,s=o)},e.onmouseup=function(e){d=!1,shapeArray.push(n.save()),console.log(shapeArray,n.save())},e}function x(e){let t=e.time,n=a.e("#sidebar").select("#annotation-wrap");n.selectAll(".memo").classed("selected",!1);let o=n.selectAll(".memo").filter(t=>t.key===e.key);o.classed("selected",!0),o.nodes()[0].scrollIntoView(),document.getElementById("video").currentTime=t,progressBar.value=t,seek.value=t}n(88);o.apps.length||o.initializeApp(l.b);let A=document.getElementById("main-wrap");A&&(!function(e,t){let n=a.e(e).select("video");n.attr("id","video");let s=n.append("source");s.attr("src",t),s.attr("type","video/mp4"),function(e){const t=document.getElementById("video-controls"),n=document.getElementById("play"),s=document.querySelectorAll(".playback-icons use"),d=document.getElementById("time-elapsed"),i=document.getElementById("duration"),r=document.getElementById("progress-bar"),c=document.getElementById("seek"),u=document.getElementById("seek-tooltip"),p=document.getElementById("volume-button"),m=document.querySelectorAll(".volume-button use"),g=document.querySelector('use[href="#volume-mute"]'),f=document.querySelector('use[href="#volume-low"]'),v=document.querySelector('use[href="#volume-high"]'),h=document.getElementById("volume"),b=document.getElementById("playback-animation"),x=document.getElementById("fullscreen-button"),A=document.getElementById("video-container"),w=document.getElementById("video").getBoundingClientRect();document.createElement("video").canPlayType&&(e.controls=!1,t.classList.remove("hidden"));function k(){e.paused||e.ended?e.play():e.pause()}function E(){s.forEach(e=>e.classList.toggle("hidden")),e.paused?n.setAttribute("data-title","Play (k)"):n.setAttribute("data-title","Pause (k)")}function j(e){const t=new Date(1e3*e).toISOString().substr(11,8);return{minutes:t.substr(3,2),seconds:t.substr(6,2)}}function I(){e.muted=!e.muted,e.muted?(h.setAttribute("data-volume",h.value),h.value=0):h.value=h.dataset.volume}function B(){b.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(1.3)"}],{duration:500})}function L(){e.paused||t.classList.add("hide")}function $(){t.classList.remove("hide")}a.e(t).style("width",`${w.width}px`),n.addEventListener("click",k),e.addEventListener("play",E),e.addEventListener("pause",E),e.addEventListener("loadedmetadata",(function(){const t=Math.round(e.duration);c.setAttribute("max",t),r.setAttribute("max",t);const n=j(t);i.innerText=`${n.minutes}:${n.seconds}`,i.setAttribute("datetime",`${n.minutes}m ${n.seconds}s`)})),e.addEventListener("timeupdate",(function(){const t=j(Math.round(e.currentTime));d.innerText=`${t.minutes}:${t.seconds}`,d.setAttribute("datetime",`${t.minutes}m ${t.seconds}s`)})),e.addEventListener("timeupdate",(function(){c.value=Math.floor(e.currentTime),r.value=Math.floor(e.currentTime)})),e.addEventListener("volumechange",(function(){m.forEach(e=>{e.classList.add("hidden")}),p.setAttribute("data-title","Mute (m)"),e.muted||0===e.volume?(g.classList.remove("hidden"),p.setAttribute("data-title","Unmute (m)")):e.volume>0&&e.volume<=.5?f.classList.remove("hidden"):v.classList.remove("hidden")})),e.addEventListener("click",k),e.addEventListener("click",B),e.addEventListener("mouseenter",$),e.addEventListener("mouseleave",L),t.addEventListener("mouseenter",$),c.addEventListener("mousemove",(function(t){const n=Math.round(t.offsetX/t.target.clientWidth*parseInt(t.target.getAttribute("max"),10));c.setAttribute("data-seek",n);const a=j(n);u.textContent=`${a.minutes}:${a.seconds}`;const o=e.getBoundingClientRect();u.style.left=`${t.pageX-o.left}px`})),c.addEventListener("input",(function(t){const n=t.target.dataset.seek?t.target.dataset.seek:t.target.value;e.currentTime=n,r.value=n,c.value=n})),h.addEventListener("input",(function(){e.muted&&(e.muted=!1),e.volume=h.value})),p.addEventListener("click",I),A.addEventListener("fullscreenchange",(function(){fullscreenIcons.forEach(e=>e.classList.toggle("hidden")),document.fullscreenElement?x.setAttribute("data-title","Exit full screen (f)"):x.setAttribute("data-title","Full screen (f)")})),document.addEventListener("DOMContentLoaded",()=>{"pictureInPictureEnabled"in document||pipButton.classList.add("hidden")});let S=o.database().ref();Object(l.a)(S,y)}(n.node()),"draw"===a.e(".togg-wrap").selectAll("input").data().value?b():h()}(A,"./public/spike_protein_fusion_movie.mp4"),a.e(".togg-wrap").selectAll("input").on("click",(e,t,n)=>{"draw"===n[t].value?b():h()})),o.auth().onAuthStateChanged((function(e){if(e){a.e(".user-wrap").append("text").text(`Signed in as: ${e.displayName}`);let t=o.database().ref();Object(l.a)(t,p)}else console.log("NO USER",e)}))}});
//# sourceMappingURL=annotation.d513292e.js.map