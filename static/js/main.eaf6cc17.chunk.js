(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{103:function(e,t,i){"use strict";i.r(t);var a=i(1),o=i.n(a),n=i(49),r=i.n(n),s=(i(55),i(23)),c=i(24),l=i(26),u=i(25),d=i(27),m=i(56),b=i(60),h=i(4);i(83),i(84);var y=function(e){function t(){var e,i;Object(s.a)(this,t);for(var a=arguments.length,n=new Array(a),r=0;r<a;r++)n[r]=arguments[r];return(i=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).getA=function(){return o.a.createElement("a-scene",{"force-float":"selector: [grabbable]",fog:"type: exponential; color: aqua",physics:"gravity: -20; friction: 0.8; restitution: 0.8",cursor:"rayOrigin: mouse",stats:"false"},o.a.createElement("a-entity",{position:"-11.033 19.453 -6.567",rotation:"-10 -45 0"},o.a.createElement("a-camera",{id:"camera-2",active:"false"})),o.a.createElement("a-entity",{position:"0 2 4"},o.a.createElement("a-camera",{id:"camera","look-controls":"","wasd-controls":""},o.a.createElement("a-animation",{begin:"jump",easing:"ease-out",attribute:"user-height",direction:"alternate",fill:"forwards",from:"1.8",to:"3",repeat:"1",dur:"600"}),o.a.createElement("a-ring",{"radius-outer":"0.30","radius-inner":"0.20","segments-phi":"5","segments-theta":"20",position:"0 0 -3",material:"color: cyan; shader: flat",raycaster:"objects: .clickable",cursor:"maxDistance: 30; fuse: true; fuseTimeout: 1000",id:"ring"},o.a.createElement("a-animation",{begin:"click",easing:"ease-in",attribute:"scale",fill:"backwards",from:"0.1 0.1 0.1",to:"1 1 1",dur:"150"}),o.a.createElement("a-animation",{begin:"fusing",easing:"ease-in",attribute:"scale",fill:"forwards",from:"1 1 1",to:"0.1 0.1 0.1",dur:"1000"})))),o.a.createElement("a-light",{type:"ambient",color:"#bbb"}),o.a.createElement("a-entity",{light:"type:point; castShadow:true; intensity: 1.0",position:"3 20 -10"}),o.a.createElement("a-assets",null,o.a.createElement("a-mixin",{id:"cube",geometry:"primitive: box"}),o.a.createElement("a-mixin",{id:"cube-hovered",material:"color: magenta"}),o.a.createElement("a-mixin",{id:"cube-selected",material:"color: cyan"}),o.a.createElement("a-mixin",{id:"box",geometry:"primitive: box",material:"color: grey; side: double","physics-body":"mass: 5; boundingBox: 2 2 2"}),o.a.createElement("a-mixin",{id:"ball",class:"ball",geometry:"primitive: sphere; segmentsHeight: 12; segmentsWidth: 24; ",material:"src: #ballTexture; ",shadow:"cast: true","dynamic-body":"",radius:"1.2"}),o.a.createElement("img",{id:"groundTexture",alt:"groundTexture",src:"https://cdn.aframe.io/a-painter/images/floor.jpg"}),o.a.createElement("img",{id:"skyTexture",alt:"skyTexture",src:"https://cdn.aframe.io/a-painter/images/sky.jpg"}),o.a.createElement("img",{id:"woodTexture",alt:"woodTexture",src:"images/textures/Texture-wood.jpg"}),o.a.createElement("img",{id:"ballTexture",alt:"ballTexture",src:"images/textures/Texture-basketball.jpg"}),o.a.createElement("img",{id:"boardTexture",alt:"boardTexture",src:"images/textures/Texture-board.jpg"})),o.a.createElement("a-cylinder",{id:"ground",src:"#groundTexture",radius:"50",height:"1","static-body":!0,"segments-height":"1","segments-radial":"18",shadow:"receive: true; cast: false"}),o.a.createElement("a-sky",{id:"background",src:"#skyTexture","theta-length":"90",radius:"50","segments-width":"10"}),o.a.createElement("a-entity",{id:"basketGroup",position:"0 15 -20",class:"clickable"},o.a.createElement("a-entity",{id:"backboard",aimable:"",mixin:"box","static-body":"",position:"0 4 -3",geometry:"depth: 0.5; height: 10; width: 15",material:"src: #boardTexture;",shadow:"receive: true; cast: false"}),o.a.createElement("a-ring",{aimable:"","radius-inner":"2.0","radius-outer":"2.2",rotation:"90 0 0",id:"basket","static-body":""}),o.a.createElement("a-torus",{aimable:"","segments-radial":"18","segments-tubular":"18",radius:"2.1","radius-tubular":"0.05",rotation:"90 0 0",material:"color: #A50021;",shadow:"cast: true"}),o.a.createElement("a-cylinder",{src:"#groundTexture",radius:"0.25",height:"14","static-body":!0,shadow:"receive: true; cast: true",position:"0 -8 -3","segments-height":"1","segments-radial":"10"}),o.a.createElement("a-box",{material:"color: black;",geometry:"depth: 1.0; height: 0.1; width: 0.2",position:"0 0 -2.5",shadow:"receive: true; cast: true"})),o.a.createElement("a-entity",{navigate:"",position:"0 8 -8",id:"banner-success",visible:"false"}),o.a.createElement("a-entity",{"rain-of-entities":"",id:"ball-container",class:"clickable"}))},i}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentWillMount",value:function(){m.registerSystem("utility",{init:function(){this.selection=null,this.objectPool={}},saveObject:function(e){this.selection=e},loadObject:function(){return this.selection},clearSavedObject:function(){this.selection=null},hideObject:function(e){document.querySelector(e).classList.remove("clickable"),document.querySelector(e).setAttribute("visible",!1),document.querySelector("#ring").components.raycaster.refreshObjects()},showObject:function(e){document.querySelector(e).classList.toggle("clickable"),document.querySelector(e).setAttribute("visible",!0),document.querySelector("#ring").components.raycaster.refreshObjects()}}),m.registerComponent("rain-of-entities",{schema:{tagName:{default:"a-entity"},components:{default:["mixin|ball"]},descriptions:{default:[{label:"My Linkedin",url:"https://ca.linkedin.com/in/lingkaizhu"},{label:"ADnL Comics",url:"https://goo.gl/photos/MriCgvz92bqioXgo9"}]},interval:{default:300,min:0},lifetime:{default:1e4,min:0}},init:function(){this.balls=[],this.labels=[],this.spawn()},reset:function(){var e=this;this.balls.forEach(function(t){t.body.position.copy(e.getPosition(t.components.grabbable.data.index)),t.body.velocity.set(0,0,0),t.body.angularVelocity.setZero()})},spawn:function(){for(var e=this,t=this.data,i=function(i){var a=document.createElement(t.tagName);a.setAttribute("position",e.getPosition(i)),a.setAttribute("grabbable","index: "+i+"; url: "+t.descriptions[i].url+"; label: "+t.descriptions[i].label),t.components.forEach(function(e){var t=e.split("|");a.setAttribute(t[0],t[1]||"")}),e.balls.push(a);var o=document.createElement("a-text");o.setAttribute("position",e.getPosition(i,"text")),o.setAttribute("wrap-count",80),o.setAttribute("text","color: white; align: center; width: 50; value: "+t.descriptions[i].label),e.labels.push(o),setTimeout(function(){e.el.appendChild(a),e.el.appendChild(o),setInterval(function(){a.body.position.y>0||(a.body.position.copy(e.getPosition(i)),a.body.velocity.set(0,0,0),a.body.angularVelocity.setZero())},t.lifetime)},i*t.interval)},a=0;a<t.descriptions.length;a++)i(a)},getPosition:function(e,t){return"text"===t?{x:8*((1-this.data.descriptions.length)/2+e),y:5,z:-10}:{x:8*((1-this.data.descriptions.length)/2+e),y:1.5,z:-10}}}),m.registerComponent("grabbable",{schema:{force:{default:100},index:{default:0},label:{default:""},url:{default:""}},init:function(){this.pStart=new h.Vec3,this.sourceEl=this.el.sceneEl.querySelector("#camera"),this.el.addEventListener("click",this.grab.bind(this))},grab:function(){if(!document.querySelector("a-scene").systems.utility.loadObject()){document.querySelector("a-scene").systems.utility.saveObject(this.el);var e=this.el;this.sourceEl=this.el.sceneEl.querySelector("#camera"),e.body.position.copy(this.sourceEl.getAttribute("position")),e.body.velocity.setZero(),e.body.angularVelocity.setZero()}}}),m.registerComponent("aimable",{schema:{shootForceScale:{default:145},jumpForceScale:{default:30},accuracy:{default:1.5}},init:function(){this.el.addEventListener("click",this.aimThisAndThrow.bind(this))},aimThisAndThrow:function(){var e=this,t=this.data.accuracy,i=document.querySelector("a-scene").systems.utility.loadObject();if(i){i.body.velocity.setZero(),i.body.angularVelocity.setZero();var a=this.el.sceneEl.querySelector("#basket");this.sourceEl=this.el.sceneEl.querySelector("#camera"),i.body.position.copy(this.sourceEl.getAttribute("position")),i.body.velocity.setZero(),i.body.angularVelocity.setZero(),this.sourceEl.emit("jump");var o=new h.Vec3(0,1,0);o.normalize(),o.scale(this.data.jumpForceScale,o),i.body.applyImpulse(o,i.body.position),setTimeout(function(){var o=a.body.position.vsub(i.body.position).vadd(new h.Vec3(t-Math.random()*t*2,30+t-Math.random()*t*2,t-Math.random()*t*2));o.normalize(),o.scale(e.data.shootForceScale,o),i.body.applyImpulse(o,i.body.position),i.body.angularVelocity.set(10*t-Math.random()*t*20,10*t-Math.random()*t*20,10*t-Math.random()*t*20)},300),setTimeout(function(){document.querySelector("#camera").setAttribute("active",!1),document.querySelector("#camera-2").setAttribute("active",!0)},1e3);var n=new h.Vec3,r=new h.Vec3,s=setInterval(function(){if(n.copy(r),r.copy(i.body.position),!n.isZero()&&!r.isZero()&&n.y>=15&&r.y<15){var e=(n.x+r.x)/2,t=(n.z+r.z)/2;e>=-2&&e<=2&&t>=-22&&t<-18?(console.log("in"),document.querySelectorAll(".point-light").forEach(function(e){e.setAttribute("color","gold")}),setTimeout(function(){document.querySelector("#camera").setAttribute("active",!0),document.querySelector("#camera-2").setAttribute("active",!1)},500),setTimeout(function(){document.querySelector("a-scene").systems.utility.showObject("#banner-success"),document.querySelector("a-scene").systems.utility.hideObject("#ball-container"),document.querySelector("#banner-success").setAttribute("navigate","label: "+i.components.grabbable.data.label+"; url: "+i.components.grabbable.data.url)},1500),clearInterval(s)):(setTimeout(function(){document.querySelector("#camera").setAttribute("active",!0),document.querySelector("#camera-2").setAttribute("active",!1)},500),console.log("out"),clearInterval(s))}},50);setTimeout(function(){clearInterval(s)},5e3),document.querySelector("a-scene").systems.utility.clearSavedObject()}else console.log("Please pick a ball first. ")}}),m.registerComponent("navigate",{schema:{label:{default:""},url:{default:""}},init:function(){},update:function(){for(;this.el.firstChild;)this.el.removeChild(this.el.firstChild);var e=document.createElement("a-text");e.setAttribute("color","white"),e.setAttribute("align","center"),e.setAttribute("width",50),e.setAttribute("position","0 0 -8"),e.setAttribute("value","Congratulations! Visit "+this.data.label+"?"),this.el.appendChild(e),this.insertLeftButton(),this.insertRightButton()},insertLeftButton:function(){var e=document.createElement("a-icosahedron");e.setAttribute("color","#FFF26B"),e.setAttribute("radius",1.5),e.setAttribute("position","-3 -4 -8");var t=document.createElement("a-text");t.setAttribute("color","white"),t.setAttribute("align","right"),t.setAttribute("width",30),t.setAttribute("value","Take me there"),t.setAttribute("position","-5 -4 -8"),e.addEventListener("click",this.clickLeftButton.bind(this)),t.addEventListener("click",this.clickLeftButton.bind(this)),this.el.appendChild(e),this.el.appendChild(t)},clickLeftButton:function(){window.location.href=this.data.url},insertRightButton:function(){var e=document.createElement("a-icosahedron");e.setAttribute("color","#FF226B"),e.setAttribute("radius",1.5),e.setAttribute("position","3 -4 -8");var t=document.createElement("a-text");t.setAttribute("color","white"),t.setAttribute("align","left"),t.setAttribute("width",30),t.setAttribute("value","Return to shoot more"),t.setAttribute("position","5 -4 -8"),e.addEventListener("click",this.clickRightButton.bind(this)),t.addEventListener("click",this.clickRightButton.bind(this)),this.el.appendChild(e),this.el.appendChild(t)},clickRightButton:function(){document.querySelectorAll(".point-light").forEach(function(e){e.setAttribute("color","#ccc")}),document.querySelector("a-scene").systems.utility.hideObject("#banner-success"),document.querySelector("a-scene").systems.utility.showObject("#ball-container"),document.querySelector("[rain-of-entities]").components["rain-of-entities"].reset()}}),m.registerComponent("force-pushable",{schema:{force:{default:100}},init:function(){this.pStart=new b.Vector3,this.sourceEl=this.el.sceneEl.querySelector("[camera]"),this.el.addEventListener("click",this.forcePush.bind(this))},forcePush:function(){var e,t=this.el,i=this.pStart.copy(this.sourceEl.getAttribute("position"));(e=t.body.position.vsub(i)).normalize(),e.scale(this.data.force,e),t.body.applyImpulse(e,t.body.position)}}),m.registerComponent("force-float",{schema:{force:{default:1},keyCode:{default:32},selector:{default:"[force-float-target]"}},init:function(){document.addEventListener("keyup",this.onKeyup.bind(this))},onKeyup:function(e){if(e.keyCode===this.data.keyCode){var t=this.data;this.el.sceneEl.querySelectorAll(t.selector).forEach(function(e){var i=new h.Vec3(0,10*t.force*Math.random()+20,0);e.body.applyLocalImpulse(i,new h.Vec3(0,0,0))})}}})}},{key:"render",value:function(){return o.a.createElement("div",{id:"aframe-root"},this.getA())}}]),t}(o.a.Component),f=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return o.a.createElement(y,null)}}]),t}(o.a.Component),p=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function g(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}r.a.render(o.a.createElement(f,null),document.getElementById("root")),function(){if("serviceWorker"in navigator){if(new URL("",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("","/service-worker.js");p?function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):g(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e):g(e)})}}()},50:function(e,t,i){e.exports=i(103)},55:function(e,t,i){}},[[50,1,2]]]);
//# sourceMappingURL=main.eaf6cc17.chunk.js.map