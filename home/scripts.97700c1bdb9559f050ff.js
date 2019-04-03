AFRAME.registerComponent("gpoly",{schema:{API_KEY:{default:""}},init(){const t=this.data.polyid;console.log(t);const e=this.data.API_KEY,i=this.el;e?fetch("https://poly.googleapis.com/v1/assets/"+t+"/?key="+e).then(t=>t.json()).then(t=>{const e=t.formats.find(t=>"GLTF2"===t.formatType);if(e)i.setAttribute("gltf-model",e.root.url);else{const e=t.formats.find(t=>"OBJ"===t.formatType);e&&(i.setAttribute("obj-model","obj",e.root.url),i.setAttribute("obj-model","mtl",e.resources[0].url))}}).catch(t=>{throw t}):console.log("Please fill in your API KEY, cf https://developers.google.com/poly/develop/web ")}}),AFRAME.registerSystem("utility",{init(){this.selection=null,this.objectPool={}},saveObject(t){this.selection=t},loadObject(){return this.selection},clearSavedObject(){this.selection=null},hideObject(t){document.querySelector(t).classList.remove("clickable"),document.querySelector(t).setAttribute("visible",!1),document.querySelector("#ring").components.raycaster.refreshObjects()},showObject(t){document.querySelector(t).classList.toggle("clickable"),document.querySelector(t).setAttribute("visible",!0),document.querySelector("#ring").components.raycaster.refreshObjects()}}),AFRAME.registerComponent("rain-of-entities",{schema:{tagName:{default:"a-entity"},components:{default:["mixin|ball"]},descriptions:{default:[{label:"My Linkedin",url:"https://ca.linkedin.com/in/lingkaizhu"},{label:"My Blog",url:"https://pigjr.blogspot.com/"},{label:"ADnL comics",url:"https://goo.gl/photos/MriCgvz92bqioXgo9"},{label:"(Just a ball)",url:""}]},interval:{default:300,min:0},lifetime:{default:1e4,min:0}},init(){this.balls=[],this.labels=[],this.spawn()},reset(){this.balls.forEach(t=>{t.body.position.copy(this.getPosition(t.components.grabbable.data.index)),t.body.velocity.set(0,0,0),t.body.angularVelocity.setZero()})},spawn(){const t=this.data;for(let e=0;e<t.descriptions.length;e++){const i=document.createElement(t.tagName);i.setAttribute("position",this.getPosition(e)),i.setAttribute("grabbable","index: "+e+"; url: "+t.descriptions[e].url+"; label: "+t.descriptions[e].label),t.components.forEach(t=>{const e=t.split("|");i.setAttribute(e[0],e[1]||"")}),this.balls.push(i);const o=document.createElement("a-text");o.setAttribute("position",this.getPosition(e,"text")),o.setAttribute("wrap-count",80),o.setAttribute("text","color: white; align: center; width: 50; value: "+t.descriptions[e].label),this.labels.push(o),setTimeout(()=>{this.el.appendChild(i),this.el.appendChild(o),setInterval(()=>{i.body.position.y>0||(i.body.position.copy(this.getPosition(e)),i.body.velocity.set(0,0,0),i.body.angularVelocity.setZero())},t.lifetime)},e*t.interval)}},getPosition(t,e){return"text"===e?{x:8*((1-this.data.descriptions.length)/2+t),y:5,z:-10}:{x:8*((1-this.data.descriptions.length)/2+t),y:1.5,z:-10}}}),AFRAME.registerComponent("grabbable",{schema:{force:{default:100},index:{default:0},label:{default:""},url:{default:""}},init(){this.pStart=new CANNON.Vec3,this.sourceEl=this.el.sceneEl.querySelector("#camera"),this.el.addEventListener("click",this.grab.bind(this))},grab(){const t=document.querySelector("a-scene").systems.utility;if(!t.loadObject()){t.saveObject(this.el);const e=this.el;this.sourceEl=this.el.sceneEl.querySelector("#camera"),e.body.position.copy(this.sourceEl.getAttribute("position")),e.body.velocity.setZero(),e.body.angularVelocity.setZero()}}}),AFRAME.registerComponent("aimable",{schema:{shootForceScale:{default:105},jumpForceScale:{default:20},accuracy:{default:1.5}},init(){this.el.addEventListener("click",this.aimThisAndThrow.bind(this))},aimThisAndThrow(){const t=document.querySelector("a-scene").systems.utility,e=this.data.accuracy,i=t.loadObject();if(i){i.body.velocity.setZero(),i.body.angularVelocity.setZero();const o=this.el.sceneEl.querySelector("#basket");this.sourceEl=this.el.sceneEl.querySelector("#camera"),i.body.position.copy(this.sourceEl.getAttribute("position")),i.body.velocity.setZero(),i.body.angularVelocity.setZero(),this.sourceEl.emit("jump");const s=new CANNON.Vec3(0,1,0);s.normalize(),s.scale(this.data.jumpForceScale,s),i.body.applyImpulse(s,i.body.position),setTimeout(()=>{const t=o.body.position.vsub(i.body.position).vadd(new CANNON.Vec3(e-Math.random()*e*2,20+e-Math.random()*e*2,e-Math.random()*e*2));t.normalize(),t.scale(this.data.shootForceScale,t),i.body.applyImpulse(t,i.body.position),i.body.angularVelocity.set(10*e-Math.random()*e*20,10*e-Math.random()*e*20,10*e-Math.random()*e*20)},300),setTimeout(()=>{document.querySelector("#camera").setAttribute("active",!1),document.querySelector("#camera-2").setAttribute("active",!0)},1e3);const l=new CANNON.Vec3,r=new CANNON.Vec3,c=setInterval(()=>{if(l.copy(r),r.copy(i.body.position),!l.isZero()&&!r.isZero()&&l.y>=15&&r.y<15){const e=(l.x+r.x)/2,o=(l.z+r.z)/2;e>=-2&&e<=2&&o>=-22&&o<-18?(console.log("in"),document.querySelectorAll(".point-light").forEach(t=>{t.setAttribute("color","gold")}),setTimeout(()=>{document.querySelector("#camera").setAttribute("active",!0),document.querySelector("#camera-2").setAttribute("active",!1)},500),setTimeout(()=>{t.showObject("#banner-success"),t.hideObject("#ball-container"),document.querySelector("#banner-success").setAttribute("navigate","label: "+i.components.grabbable.data.label+"; url: "+i.components.grabbable.data.url)},1500),clearInterval(c)):(setTimeout(()=>{document.querySelector("#camera").setAttribute("active",!0),document.querySelector("#camera-2").setAttribute("active",!1)},500),console.log("out"),clearInterval(c))}},50);setTimeout(()=>{document.querySelector("#camera").setAttribute("active",!0),document.querySelector("#camera-2").setAttribute("active",!1),clearInterval(c)},5e3),t.clearSavedObject()}else console.log("Please pick a ball first. ")}}),AFRAME.registerComponent("navigate",{schema:{label:{default:""},url:{default:""}},init(){this.util=document.querySelector("a-scene").systems.utility},update(){for(;this.el.firstChild;)this.el.removeChild(this.el.firstChild);const t=document.createElement("a-text");t.setAttribute("color","white"),t.setAttribute("align","center"),t.setAttribute("width",50),t.setAttribute("position","0 0 -8"),t.setAttribute("value",this.data.url?`Congratulations! Visit ${this.data.label} ?`:"Congratulations!"),this.el.appendChild(t),this.data.url&&this.insertLeftButton(),this.insertRightButton()},insertLeftButton(){const t=document.createElement("a-icosahedron");t.setAttribute("color","#FFF26B"),t.setAttribute("radius","1.5"),t.setAttribute("position","-3 -4 -8");const e=document.createElement("a-text");e.setAttribute("color","white"),e.setAttribute("align","right"),e.setAttribute("width",30),e.setAttribute("value","Take me there"),e.setAttribute("position","-5 -4 -8"),t.addEventListener("click",this.clickLeftButton.bind(this)),e.addEventListener("click",this.clickLeftButton.bind(this)),this.el.appendChild(t),this.el.appendChild(e)},clickLeftButton(){window.location.href=this.data.url},insertRightButton(){const t=document.createElement("a-icosahedron");t.setAttribute("color","#FF226B"),t.setAttribute("radius","1.5"),t.setAttribute("position","3 -4 -8");const e=document.createElement("a-text");e.setAttribute("color","white"),e.setAttribute("align","left"),e.setAttribute("width",30),e.setAttribute("value","Return to shoot more"),e.setAttribute("position","5 -4 -8"),t.addEventListener("click",this.clickRightButton.bind(this)),e.addEventListener("click",this.clickRightButton.bind(this)),this.el.appendChild(t),this.el.appendChild(e)},clickRightButton(){document.querySelectorAll(".point-light").forEach(t=>{t.setAttribute("color","#ccc")}),this.util.hideObject("#banner-success"),this.util.showObject("#ball-container"),document.querySelector("[rain-of-entities]").components["rain-of-entities"].reset()}}),AFRAME.registerComponent("force-pushable",{schema:{force:{default:100}},init(){this.pStart=new THREE.Vector3,this.sourceEl=this.el.sceneEl.querySelector("[camera]"),this.el.addEventListener("click",this.forcePush.bind(this))},forcePush(){let t;const e=this.el,i=this.pStart.copy(this.sourceEl.getAttribute("position"));(t=e.body.position.vsub(i)).normalize(),t.scale(this.data.force,t),e.body.applyImpulse(t,e.body.position)}}),AFRAME.registerComponent("force-float",{schema:{force:{default:1},keyCode:{default:32},selector:{default:"[force-float-target]"}},init(){document.addEventListener("keyup",this.onKeyup.bind(this))},onKeyup(t){if(t.keyCode!==this.data.keyCode)return;const e=this.data;this.el.sceneEl.querySelectorAll(e.selector).forEach(t=>{const i=new CANNON.Vec3(0,10*e.force*Math.random()+20,0);t.body.applyLocalImpulse(i,new CANNON.Vec3(0,0,0))})}});