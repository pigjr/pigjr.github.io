AFRAME.registerComponent("gpoly",{schema:{polyid:{default:"5vbJ5vildOq"},API_KEY:{default:""}},init:function(){var t=this.data.polyid,e=AFRAME.utils.getUrlParameter("polyid");e.length>0&&(t=e);let o=this.data.API_KEY,l=this.el;o?fetch("https://poly.googleapis.com/v1/assets/"+t+"/?key="+o).then(t=>t.json()).then(t=>{const e=t.formats.find(t=>"GLTF2"===t.formatType);if(e)l.setAttribute("gltf-model",e.root.url);else{const e=t.formats.find(t=>"OBJ"===t.formatType);e&&(l.setAttribute("obj-model","obj",e.root.url),l.setAttribute("obj-model","mtl",e.resources[0].url))}}).catch(t=>{throw t}):console.log("Please fill in your API KEY, cf https://developers.google.com/poly/develop/web ")}});