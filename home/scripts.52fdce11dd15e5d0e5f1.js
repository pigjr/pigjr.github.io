AFRAME.registerComponent("gpoly",{schema:{polyid:{default:""},API_KEY:{default:""}},init(){const t=this.data.API_KEY,e=this.el;t?fetch("https://poly.googleapis.com/v1/assets/"+this.data.polyid+"/?key="+t).then(t=>t.json()).then(t=>{const i=t.formats.find(t=>"GLTF2"===t.formatType);if(i)e.setAttribute("gltf-model",i.root.url);else{const i=t.formats.find(t=>"OBJ"===t.formatType);i&&(e.setAttribute("obj-model","obj",i.root.url),e.setAttribute("obj-model","mtl",i.resources[0].url))}}).catch(t=>{throw t}):console.log("Please fill in your API KEY, cf https://developers.google.com/poly/develop/web ")}}),AFRAME.registerSystem("utility",{init(){this.selection=null,this.objectPool={}},saveObject(t){this.selection=t},loadObject(){return this.selection},clearSavedObject(){this.selection=null},hideObject(t){document.querySelector(t).classList.remove("clickable"),document.querySelector(t).setAttribute("visible",!1),document.querySelector("#ring").components.raycaster.refreshObjects()},showObject(t){document.querySelector(t).classList.toggle("clickable"),document.querySelector(t).setAttribute("visible",!0),document.querySelector("#ring").components.raycaster.refreshObjects()}}),AFRAME.registerComponent("rain-of-entities",{schema:{tagName:{default:"a-entity"},components:{default:["mixin|ball"]},descriptions:{default:[{label:"My Linkedin",url:"https://ca.linkedin.com/in/lingkaizhu",facing:"front"},{label:"My Blog",url:"https://pigjr.blogspot.com/",facing:"front"},{label:"ADnL comics",url:"https://goo.gl/photos/MriCgvz92bqioXgo9",facing:"front"},{label:"(Free ball)",url:"",facing:"front"},{label:"Feeling Rich",url:"/rich",facing:"back"},{label:"(Free ball)",url:"",facing:"back"}]},interval:{default:300,min:0},lifetime:{default:1e4,min:0}},init(){this.balls=[],this.labels=[],this.spawn()},reset(){this.balls.forEach(t=>{t.body.position.copy(this.getPosition(t.components.grabbable.data.index)),t.body.velocity.set(0,0,0),t.body.angularVelocity.setZero()})},spawn(){const t=this.data;for(let e=0;e<t.descriptions.length;e++){const i=document.createElement(t.tagName);i.setAttribute("position",this.getPosition(e,"ball")),i.setAttribute("grabbable","index: "+e+"; url: "+t.descriptions[e].url+"; label: "+t.descriptions[e].label),t.components.forEach(t=>{const e=t.split("|");i.setAttribute(e[0],e[1]||"")}),this.balls.push(i);const o=document.createElement("a-text");o.setAttribute("position",this.getPosition(e,"text")),o.setAttribute("rotation",`0 ${"front"===t.descriptions[e].facing?0:180} 0`),o.setAttribute("wrap-count",80),o.setAttribute("text","side: double; color: white; align: center; width: 50; value: "+t.descriptions[e].label),this.labels.push(o),setTimeout(()=>{this.el.appendChild(i),this.el.appendChild(o),setInterval(()=>{i.body.position.y>0||(i.body.position.copy(this.getPosition(e)),i.body.velocity.set(0,0,0),i.body.angularVelocity.setZero())},t.lifetime)},e*t.interval)}},getPosition(t,e){const i=this.data.descriptions[t],o=this.data.descriptions.filter(t=>t.facing===i.facing);return{x:8*((1-o.length)/2+o.indexOf(i)),y:"text"===e?5:1.5,z:"front"===i.facing?-15:15}}}),AFRAME.registerComponent("grabbable",{schema:{force:{default:100},index:{default:0},label:{default:""},url:{default:""}},init(){this.pStart=new CANNON.Vec3,this.sourceEl=this.el.sceneEl.querySelector("#camera"),this.el.addEventListener("click",this.grab.bind(this))},grab(){const t=document.querySelector("a-scene").systems.utility;if(!t.loadObject()){t.saveObject(this.el);const e=this.el;this.sourceEl=this.el.sceneEl.querySelector("#camera");const i=e.body.position.z<0;e.body.position.copy(this.sourceEl.getAttribute("position")),e.body.position.z+=i?-5:5,e.body.velocity.setZero(),e.body.angularVelocity.setZero()}}}),AFRAME.registerComponent("aimable",{schema:{shootForceScale:{default:105},jumpForceScale:{default:20},accuracy:{default:1.5}},init(){this.el.addEventListener("click",this.aimThisAndThrow.bind(this))},aimThisAndThrow(){const t="basketGroup2"===this.el.parentEl.id?"2":"",e=document.querySelector("a-scene").systems.utility,i=this.data.accuracy,o=e.loadObject();if(o){o.body.velocity.setZero(),o.body.angularVelocity.setZero();const s=this.el.sceneEl.querySelector("#basket"+t);this.sourceEl=this.el.sceneEl.querySelector("#camera"),o.body.position.copy(this.sourceEl.getAttribute("position")),o.body.position.z+="2"===t?5:-5,o.body.velocity.setZero(),o.body.angularVelocity.setZero(),this.sourceEl.emit("jump");const l=new CANNON.Vec3(0,1,0);l.normalize(),l.scale(this.data.jumpForceScale,l),o.body.applyImpulse(l,o.body.position),setTimeout(()=>{const t=s.body.position.vsub(o.body.position).vadd(new CANNON.Vec3(i-Math.random()*i*2,20+i-Math.random()*i*2,i-Math.random()*i*2));t.normalize(),t.scale(this.data.shootForceScale,t),o.body.applyImpulse(t,o.body.position),o.body.angularVelocity.set(10*i-Math.random()*i*20,10*i-Math.random()*i*20,10*i-Math.random()*i*20)},300);const r=new CANNON.Vec3,n=new CANNON.Vec3,a="2"===t?27:-23,c="2"===t?23:-27,u=setInterval(()=>{if(r.copy(n),n.copy(o.body.position),!r.isZero()&&!n.isZero()&&r.y>=15&&n.y<15){const i=(r.x+n.x)/2,s=(r.z+n.z)/2;i>=-2&&i<=2&&s>=c&&s<a?(console.log("in"),document.querySelectorAll(".point-light").forEach(t=>{t.setAttribute("color","gold")}),setTimeout(()=>{e.showObject("#banner-success"),e.hideObject("#ball-container"),document.querySelector("#banner-success").setAttribute("navigate","label: "+o.components.grabbable.data.label+"; url: "+o.components.grabbable.data.url+"; group: "+t)},1500),clearInterval(u)):(console.log("out"),clearInterval(u))}},50);setTimeout(()=>{clearInterval(u)},5e3),e.clearSavedObject()}else console.log("Please pick a ball first. ")}}),AFRAME.registerComponent("navigate",{schema:{label:{default:""},url:{default:""},group:{default:""}},init(){this.util=document.querySelector("a-scene").systems.utility},update(){for(;this.el.firstChild;)this.el.removeChild(this.el.firstChild);const t=document.createElement("a-text");t.setAttribute("color","white"),t.setAttribute("align","center"),t.setAttribute("width",50),t.setAttribute("position",`0 0 ${"2"===this.data.group?8:-8}`),t.setAttribute("rotation",`0 ${"2"===this.data.group?180:0} 0`),t.setAttribute("value",this.data.url?`Congratulations! Visit ${this.data.label} ?`:"Congratulations!"),this.el.appendChild(t),this.data.url&&this.insertLeftButton(),this.insertRightButton()},insertLeftButton(){const t=document.createElement("a-icosahedron");t.setAttribute("color","#FFF26B"),t.setAttribute("radius","1.5"),t.setAttribute("position",`-3 -4 ${"2"===this.data.group?18:-8}`);const e=document.createElement("a-text");e.setAttribute("color","white"),e.setAttribute("align","right"),e.setAttribute("width",30),e.setAttribute("value","Take me there"),e.setAttribute("position",`-5 -4 ${"2"===this.data.group?18:-8}`),e.setAttribute("rotation",`0 ${"2"===this.data.group?180:0} 0`),t.addEventListener("click",this.clickLeftButton.bind(this)),e.addEventListener("click",this.clickLeftButton.bind(this)),this.el.appendChild(t),this.el.appendChild(e)},clickLeftButton(){window.location.href=this.data.url},insertRightButton(){const t=document.createElement("a-icosahedron");t.setAttribute("color","#FF226B"),t.setAttribute("radius","1.5"),t.setAttribute("position",`3 -4 ${"2"===this.data.group?18:-8}`);const e=document.createElement("a-text");e.setAttribute("color","white"),e.setAttribute("align","left"),e.setAttribute("width",30),e.setAttribute("value","Return to shoot more"),e.setAttribute("position",`5 -4 ${"2"===this.data.group?18:-8}`),e.setAttribute("rotation",`0 ${"2"===this.data.group?180:0} 0`),t.addEventListener("click",this.clickRightButton.bind(this)),e.addEventListener("click",this.clickRightButton.bind(this)),this.el.appendChild(t),this.el.appendChild(e)},clickRightButton(){document.querySelectorAll(".point-light").forEach(t=>{t.setAttribute("color","#ccc")}),this.util.hideObject("#banner-success"),this.util.showObject("#ball-container"),document.querySelector("[rain-of-entities]").components["rain-of-entities"].reset()}}),AFRAME.registerComponent("force-pushable",{schema:{force:{default:100}},init(){this.pStart=new THREE.Vector3,this.sourceEl=this.el.sceneEl.querySelector("[camera]"),this.el.addEventListener("click",this.forcePush.bind(this))},forcePush(){let t;const e=this.el,i=this.pStart.copy(this.sourceEl.getAttribute("position"));(t=e.body.position.vsub(i)).normalize(),t.scale(this.data.force,t),e.body.applyImpulse(t,e.body.position)}}),AFRAME.registerComponent("force-float",{schema:{force:{default:1},keyCode:{default:32},selector:{default:"[force-float-target]"}},init(){document.addEventListener("keyup",this.onKeyup.bind(this))},onKeyup(t){if(t.keyCode!==this.data.keyCode)return;const e=this.data;this.el.sceneEl.querySelectorAll(e.selector).forEach(t=>{const i=new CANNON.Vec3(0,10*e.force*Math.random()+20,0);t.body.applyLocalImpulse(i,new CANNON.Vec3(0,0,0))})}});