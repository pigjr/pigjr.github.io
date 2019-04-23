AFRAME.registerComponent('gpoly', {
  schema: {
    polyid: { default: '' },
    API_KEY: { default: '' }
  },
  init() {
    const id = this.data.polyid;
    const API_KEY = this.data.API_KEY;
    const url = 'https://poly.googleapis.com/v1/assets/' + id + '/?key=' + API_KEY;
    const el = this.el;

    if (!API_KEY) {
      console.log('Please fill in your API KEY, cf https://developers.google.com/poly/develop/web ');
      return;
    }

    fetch(url)
      .then(res => res.json())
      .then((data) => {
        const gltf2Format = data.formats.find((f) => f.formatType === 'GLTF2');
        if (gltf2Format) { // Use <a-gltf-model> if GLTF2 model is available
          el.setAttribute('gltf-model', gltf2Format.root.url);
        } else {
          const objFormat = data.formats.find((f) => f.formatType === 'OBJ');
          if (objFormat) { // Use <a-obj-model> if OBJ model is available
            el.setAttribute('obj-model', 'obj', objFormat.root.url);
            el.setAttribute('obj-model', 'mtl', objFormat.resources[0].url);
          }
        }
      })
      .catch(err => { throw err; });
  }
});
AFRAME.registerSystem('utility', {
  init() {
    this.selection = null;
    this.objectPool = {};
  },
  saveObject(el) {
    this.selection = el;
  },
  loadObject() {
    return this.selection;
  },
  clearSavedObject() {
    this.selection = null;
  },
  hideObject(id) {
    document.querySelector(id).classList.remove('clickable');
    document.querySelector(id).setAttribute('visible', false);
    document.querySelector('#ring').components.raycaster.refreshObjects();
  },
  showObject(id) {
    document.querySelector(id).classList.toggle('clickable');
    document.querySelector(id).setAttribute('visible', true);
    document.querySelector('#ring').components.raycaster.refreshObjects();
  }
});
/**
 * Rain of Entities component.
 *
 * Creates a spawner on the scene, which periodically generates new entities
 * and drops them from the sky. Objects falling below altitude=0 will be
 * recycled after a few seconds.
 *
 * Requires: physics
 */
AFRAME.registerComponent('rain-of-entities', {
  schema: {
    tagName: { default: 'a-entity' },
    components: {
      default: ['mixin|ball']
    },
    descriptions: {
      default: [
        {
          label: 'My Linkedin',
          url: 'https://ca.linkedin.com/in/lingkaizhu',
          facing: 'front',
        },
        {
          label: 'My Blog',
          url: 'https://pigjr.blogspot.com/',
          facing: 'front',
        },
        {
          label: 'ADnL comics',
          url: 'https://goo.gl/photos/MriCgvz92bqioXgo9',
          facing: 'front',
        },
        {
          label: '(Free ball)',
          url: '',
          facing: 'front',
        },
        {
          label: 'Feeling Rich',
          url: '/rich',
          facing: 'back',
        },
        {
          label: 'Obsolete',
          url: '/obsolete',
          facing: 'back',
        },
        {
          label: 'Potato',
          url: '/potato',
          facing: 'back',
        },
        {
          label: '(Free ball)',
          url: '',
          facing: 'back',
        },
      ]
    },
    interval: { default: 300, min: 0 },
    lifetime: { default: 10000, min: 0 }
  },
  init() {
    this.balls = [];
    this.labels = [];
    this.spawn();
  },
  reset() {
    this.balls.forEach(B => {
      B.body.position.copy(
        this.getPosition(B.components.grabbable.data.index)
      );
      B.body.velocity.set(0, 0, 0);
      B.body.angularVelocity.setZero();
    });
  },
  spawn() {
    const D = this.data;
    for (let i = 0; i < D.descriptions.length; i++) {
      const B = document.createElement(D.tagName);

      B.setAttribute('position', this.getPosition(i, 'ball'));
      B.setAttribute(
        'grabbable',
        'index: ' +
        i +
        '; url: ' +
        D.descriptions[i].url +
        '; label: ' +
        D.descriptions[i].label
      );

      D.components.forEach((s) => {
        const parts = s.split('|');
        B.setAttribute(parts[0], parts[1] || '');
      });

      this.balls.push(B);

      const T = document.createElement('a-text');
      T.setAttribute('position', this.getPosition(i, 'text'));
      T.setAttribute('rotation', `0 ${D.descriptions[i].facing === 'front' ? 0 : 180} 0`);
      T.setAttribute('wrap-count', 80);
      T.setAttribute(
        'text',
        'side: double; color: white; align: center; width: 50; value: ' +
        D.descriptions[i].label
      );
      this.labels.push(T);

      setTimeout(() => {
        this.el.appendChild(B);
        this.el.appendChild(T);
        // Return the ball if it falls down
        setInterval(() => {
          if (B.body.position.y > 0) { return; }
          B.body.position.copy(this.getPosition(i));
          B.body.velocity.set(0, 0, 0);
          B.body.angularVelocity.setZero();
        }, D.lifetime);
      }, i * D.interval);
    }
  },
  getPosition(i, type) {
    const ball = this.data.descriptions[i];
    const balls = this.data.descriptions.filter(el => el.facing === ball.facing);

    return {
      x: ((1 - balls.length) / 2 + balls.indexOf(ball)) * 8,
      y: type === 'text' ? 5 : 1.5,
      z: ball.facing === 'front' ? -15 : 15,
    };
  }
});

AFRAME.registerComponent('grabbable', {
  schema: {
    force: { default: 100 },
    index: { default: 0 },
    label: { default: '' },
    url: { default: '' }
  },
  init() {
    this.pStart = new CANNON.Vec3();
    this.sourceEl = this.el.sceneEl.querySelector('#camera');
    this.el.addEventListener('click', this.grab.bind(this));
  },
  grab() {
    const util = document.querySelector('a-scene').systems.utility;
    if (
      !util.loadObject()
    ) {
      util.saveObject(this.el);
      const el = this.el;
      this.sourceEl = this.el.sceneEl.querySelector('#camera');
      const isFront = el.body.position.z < 0;
      el.body.position.copy(this.sourceEl.getAttribute('position'));
      el.body.position.z += isFront ? -5 : 5;
      el.body.velocity.setZero();
      el.body.angularVelocity.setZero();
    }
  }
});

AFRAME.registerComponent('aimable', {
  schema: {
    shootForceScale: { default: 105 },
    jumpForceScale: { default: 20 },
    accuracy: { default: 1.5 }
  },
  init() {
    this.el.addEventListener('click', this.aimThisAndThrow.bind(this));
  },
  aimThisAndThrow() {
    const basketGroup = this.el.parentEl.id === 'basketGroup2' ? '2' : '';
    const util = document.querySelector('a-scene').systems.utility;
    const ACC = this.data.accuracy;
    const ball = util.loadObject();
    if (!ball) {
      console.log('Please pick a ball first. ');
    } else {
      ball.body.velocity.setZero();
      ball.body.angularVelocity.setZero();

      const basket = this.el.sceneEl.querySelector('#basket' + basketGroup);
      this.sourceEl = this.el.sceneEl.querySelector('#camera');

      // Hold
      ball.body.position.copy(this.sourceEl.getAttribute('position'));
      ball.body.position.z += basketGroup === '2' ? 5 : -5;
      ball.body.velocity.setZero();
      ball.body.angularVelocity.setZero();

      // Jump
      this.sourceEl.emit('jump');
      const jumpForce = new CANNON.Vec3(0, 1, 0);
      jumpForce.normalize();
      jumpForce.scale(this.data.jumpForceScale, jumpForce);
      ball.body.applyImpulse(jumpForce, ball.body.position);

      setTimeout(() => {
        // Throw
        const force = basket.body.position
          .vsub(ball.body.position)
          .vadd(
            new CANNON.Vec3(
              ACC - Math.random() * ACC * 2,
              20 + ACC - Math.random() * ACC * 2,
              ACC - Math.random() * ACC * 2
            )
          );
        force.normalize();
        force.scale(this.data.shootForceScale, force);
        ball.body.applyImpulse(force, ball.body.position);
        // Random Spin
        ball.body.angularVelocity.set(
          ACC * 10 - Math.random() * ACC * 20,
          ACC * 10 - Math.random() * ACC * 20,
          ACC * 10 - Math.random() * ACC * 20
        );
      }, 300);

      // setTimeout(() => {
      //     document.querySelector('#camera').setAttribute('active', false);
      //     document.querySelector('#camera-2').setAttribute('active', true);
      // }, 1000);

      // In/out detection
      const posBefore = new CANNON.Vec3();
      const posAfter = new CANNON.Vec3();
      const zMax = basketGroup === '2' ? 27 : -23;
      const zMin = basketGroup === '2' ? 23 : -27;
      const intervalId = setInterval(() => {
        posBefore.copy(posAfter);
        posAfter.copy(ball.body.position);
        if (
          !posBefore.isZero() &&
          !posAfter.isZero() &&
          posBefore.y >= 15 &&
          posAfter.y < 15
        ) {
          const avgX = (posBefore.x + posAfter.x) / 2;
          const avgZ = (posBefore.z + posAfter.z) / 2;
          if (avgX >= -2 && avgX <= 2 && avgZ >= zMin && avgZ < zMax) {
            console.log('in');
            document.querySelectorAll('.point-light').forEach(el => {
              el.setAttribute('color', 'gold');
            });
            // setTimeout(() => {
            //     document
            //         .querySelector('#camera')
            //         .setAttribute('active', true);
            //     document
            //         .querySelector('#camera-2')
            //         .setAttribute('active', false);
            // }, 500);

            setTimeout(() => {
              util.showObject('#banner-success');
              util.hideObject('#ball-container');
              document
                .querySelector('#banner-success')
                .setAttribute(
                  'navigate',
                  'label: ' +
                  ball.components.grabbable.data.label +
                  '; url: ' +
                  ball.components.grabbable.data.url +
                  '; group: ' + basketGroup
                );
            }, 1500);
            clearInterval(intervalId);
          } else {
            // setTimeout(() => {
            //     document
            //         .querySelector('#camera')
            //         .setAttribute('active', true);
            //     document
            //         .querySelector('#camera-2')
            //         .setAttribute('active', false);
            // }, 500);

            console.log('out');
            clearInterval(intervalId);
          }
        }
      }, 50);
      setTimeout(() => {
        // document
        //     .querySelector('#camera')
        //     .setAttribute('active', true);
        // document
        //     .querySelector('#camera-2')
        //     .setAttribute('active', false);
        clearInterval(intervalId);
      }, 5000);

      // Clear selection
      util.clearSavedObject();
    }
  }
});

AFRAME.registerComponent('navigate', {
  schema: {
    label: { default: '' },
    url: { default: '' },
    group: { default: '' }
  },
  init() {
    this.util = document.querySelector('a-scene').systems.utility;
  },
  update() {
    const group = this.data.group;
    document.querySelector('#banner-success').setAttribute('position', `0 8 ${group === '2' ? 8 : -8}}`);
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    const T = document.createElement('a-text');
    T.setAttribute('color', 'white');
    T.setAttribute('align', 'center');
    T.setAttribute('width', 50);
    T.setAttribute('position', `0 0 ${group === '2' ? 8 : -8}`);
    T.setAttribute('rotation', `0 ${group === '2' ? 180 : 0} 0`);
    T.setAttribute(
      'value',
      this.data.url ? `Congratulations! Visit ${this.data.label} ?` : 'Congratulations!'
    );
    this.el.appendChild(T);
    if (this.data.url) {
      this.insertLeftButton();
    }
    this.insertRightButton();
  },
  insertLeftButton() {
    const btn = document.createElement('a-icosahedron');
    btn.setAttribute('color', '#FFF26B');
    btn.setAttribute('radius', '1.5');
    btn.setAttribute('position', `-3 -4 ${this.data.group === '2' ? 8 : -8}`);
    const T = document.createElement('a-text');
    T.setAttribute('color', 'white');
    T.setAttribute('align', this.data.group === '2' ? 'left' : 'right');
    T.setAttribute('width', 30);
    T.setAttribute('value', 'Take me there');
    T.setAttribute('position', `-5 -4 ${this.data.group === '2' ? 8 : -8}`);
    T.setAttribute('rotation', `0 ${this.data.group === '2' ? 180 : 0} 0`);
    btn.addEventListener('click', this.clickLeftButton.bind(this));
    T.addEventListener('click', this.clickLeftButton.bind(this));
    this.el.appendChild(btn);
    this.el.appendChild(T);
  },
  clickLeftButton() {
    window.location.href = this.data.url;
  },
  insertRightButton() {
    const btn = document.createElement('a-icosahedron');
    btn.setAttribute('color', '#FF226B');
    btn.setAttribute('radius', '1.5');
    btn.setAttribute('position', `3 -4 ${this.data.group === '2' ? 8 : -8}`);
    const T = document.createElement('a-text');
    T.setAttribute('color', 'white');
    T.setAttribute('align', this.data.group === '2' ? 'right' : 'left');
    T.setAttribute('width', 30);
    T.setAttribute('value', 'Return to shoot more');
    T.setAttribute('position', `5 -4 ${this.data.group === '2' ? 8 : -8}`);
    T.setAttribute('rotation', `0 ${this.data.group === '2' ? 180 : 0} 0`);
    btn.addEventListener('click', this.clickRightButton.bind(this));
    T.addEventListener('click', this.clickRightButton.bind(this));
    this.el.appendChild(btn);
    this.el.appendChild(T);
  },
  clickRightButton() {
    document.querySelectorAll('.point-light').forEach(el => {
      el.setAttribute('color', '#ccc');
    });
    this.util.hideObject('#banner-success');
    this.util.showObject('#ball-container');
    document
      .querySelector('[rain-of-entities]')
      .components['rain-of-entities'].reset();
  }
});

/**
 * Force Pushable component.
 *
 * Applies behavior to the current entity such that cursor clicks will apply a
 * strong impulse, pushing the entity away from the viewer.
 *
 * Requires: physics
 */
AFRAME.registerComponent('force-pushable', {
  schema: {
    force: { default: 100 }
  },
  init() {
    this.pStart = new THREE.Vector3();
    this.sourceEl = this.el.sceneEl.querySelector('[camera]');
    this.el.addEventListener('click', this.forcePush.bind(this));
  },
  forcePush() {
    let force;
    const el = this.el;
    const pStart = this.pStart.copy(this.sourceEl.getAttribute('position'));
    // Compute direction of force, normalize, then scale.
    force = el.body.position.vsub(pStart);
    force.normalize();
    force.scale(this.data.force, force);
    el.body.applyImpulse(force, el.body.position);
  }
});
/**
 * Force Float component.
 *
 * Applies behavior to the scene in which a keypress (default: Spacebar) will
 * temporarily disable gravity and apply a small upward impulse to target
 * entities.
 *
 * Requires: physics
 */
AFRAME.registerComponent('force-float', {
  schema: {
    force: { default: 1.0 },
    keyCode: { default: 32 },
    selector: { default: '[force-float-target]' }
  },
  init() {
    document.addEventListener('keyup', this.onKeyup.bind(this));
  },
  onKeyup(e) {
    if (e.keyCode !== this.data.keyCode) { return; }
    const data = this.data;
    const targets = this.el.sceneEl.querySelectorAll(data.selector);
    // Lift targets slightly.
    targets.forEach((el) => {
      const impulse = new CANNON.Vec3(
        0,
        10.0 * data.force * Math.random() + 20,
        0
      );
      el.body.applyLocalImpulse(impulse, new CANNON.Vec3(0, 0, 0));
    });
  }
});
