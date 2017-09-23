class Aframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // imgUrl: this.props.rendered2D
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.rendered2D) {
      this.setState({
        imgUrlMiddle: nextProps.rendered2D.middle,
        imgUrlBottom: nextProps.rendered2D.bottom
      });
    }
  };

  componentWillMount() {
    AFRAME.registerSystem("utility", {
      init: function() {
        this.selection = null;
        this.objectPool = {};
      },
      saveObject: function(el) {
        this.selection = el;
      },
      loadObject: function() {
        return this.selection;
      },
      clearSavedObject: function() {
        this.selection = null;
      },
      hideObject: function(id) {
        document.querySelector(id).classList.remove("clickable");
        document.querySelector(id).setAttribute("visible", false);
        document.querySelector("#ring").components.raycaster.refreshObjects();
      },
      showObject: function(id) {
        document.querySelector(id).classList.toggle("clickable");
        document.querySelector(id).setAttribute("visible", true);
        document.querySelector("#ring").components.raycaster.refreshObjects();
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
    AFRAME.registerComponent("rain-of-entities", {
      schema: {
        tagName: { default: "a-entity" },
        components: {
          default: ["mixin|ball"]
        },
        descriptions: {
          default: [
            {
              label: "Google1",
              url: "https://www.google1.com"
            },
            {
              label: "Google2",
              url: "https://www.google2.com"
            },
            {
              label: "Google3",
              url: "https://www.google3.com"
            },
            {
              label: "Google4",
              url: "https://www.google4.com"
            },
            {
              label: "Google5",
              url: "https://www.google5.com"
            }
          ]
        },
        interval: { default: 300, min: 0 },
        lifetime: { default: 10000, min: 0 }
      },
      init: function() {
        this.balls = [];
        this.labels = [];
        this.spawn();
      },
      reset: function() {
        this.balls.forEach(B => {
          B.body.position.copy(
            this.getPosition(B.components.grabbable.data.index)
          );
          B.body.velocity.set(0, 0, 0);
          B.body.angularVelocity.setZero();
        });
      },
      spawn: function() {
        let D = this.data;
        for (let i = 0; i < D.descriptions.length; i++) {
          let B = document.createElement(D.tagName);

          B.setAttribute("position", this.getPosition(i));
          B.setAttribute(
            "grabbable",
            "index: " +
              i +
              "; url: " +
              D.descriptions[i].url +
              "; label: " +
              D.descriptions[i].label
          );

          D.components.forEach(function(s) {
            var parts = s.split("|");
            B.setAttribute(parts[0], parts[1] || "");
          });

          this.balls.push(B);

          let T = document.createElement("a-text");
          T.setAttribute("position", this.getPosition(i, "text"));
          T.setAttribute("wrap-count", 80);
          T.setAttribute(
            "text",
            "color: white; align: center; width: 50; value: " +
              D.descriptions[i].label
          );
          this.labels.push(T);

          setTimeout(() => {
            this.el.appendChild(B);
            this.el.appendChild(T);
            // Return the ball if it falls down
            setInterval(() => {
              if (B.body.position.y > 0) return;
              B.body.position.copy(this.getPosition(i));
              B.body.velocity.set(0, 0, 0);
              B.body.angularVelocity.setZero();
            }, D.lifetime);
          }, i * D.interval);
        }
      },
      getPosition: function(i, type) {
        return type === "text"
          ? {
              x: ((1 - this.data.descriptions.length) / 2 + i) * 5,
              y: 5,
              z: -5
            }
          : {
              x: ((1 - this.data.descriptions.length) / 2 + i) * 5,
              y: 1.5,
              z: -5
            };
      }
    });

    AFRAME.registerComponent("grabbable", {
      schema: {
        force: { default: 100 },
        index: { default: 0 },
        label: { default: "" },
        url: { default: "" }
      },
      init: function() {
        this.pStart = new CANNON.Vec3();
        this.sourceEl = this.el.sceneEl.querySelector("#camera");
        this.el.addEventListener("click", this.grab.bind(this));
      },
      grab: function() {
        if (
          !document.querySelector("a-scene").systems["utility"].loadObject()
        ) {
          document
            .querySelector("a-scene")
            .systems["utility"].saveObject(this.el);
          var force,
            el = this.el,
            pStart = this.pStart.copy(this.sourceEl.getAttribute("position"));
          this.sourceEl = this.el.sceneEl.querySelector("#camera");
          el.body.position.copy(this.sourceEl.getAttribute("position"));
          el.body.velocity.setZero();
          el.body.angularVelocity.setZero();
        }
      }
    });

    AFRAME.registerComponent("aimable", {
      schema: {
        shootForceScale: { default: 145 },
        jumpForceScale: { default: 30 },
        accuracy: { default: 1.5 }
      },
      init: function() {
        this.el.addEventListener("click", this.aimThisAndThrow.bind(this));
      },
      aimThisAndThrow: function() {
        let ACC = this.data.accuracy;
        let ball = document
          .querySelector("a-scene")
          .systems["utility"].loadObject();
        if (!ball) {
          console.log("Please pick a ball first. ");
        } else {
          ball.body.velocity.setZero();
          ball.body.angularVelocity.setZero();

          let basket = this.el.sceneEl.querySelector("#basket");
          this.sourceEl = this.el.sceneEl.querySelector("#camera");

          // Hold
          ball.body.position.copy(this.sourceEl.getAttribute("position"));
          ball.body.velocity.setZero();
          ball.body.angularVelocity.setZero();

          // Jump
          this.sourceEl.emit("jump");
          let jumpForce = new CANNON.Vec3(0, 1, 0);
          jumpForce.normalize();
          jumpForce.scale(this.data.jumpForceScale, jumpForce);
          ball.body.applyImpulse(jumpForce, ball.body.position);

          setTimeout(() => {
            // Throw
            let force = basket.body.position
              .vsub(ball.body.position)
              .vadd(
                new CANNON.Vec3(
                  ACC - Math.random() * ACC * 2,
                  30 + ACC - Math.random() * ACC * 2,
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

          setTimeout(() => {
            document.querySelector("#camera").setAttribute("active", false);
            document.querySelector("#camera-2").setAttribute("active", true);
          }, 1000);

          // In/out detection
          let posBefore = new CANNON.Vec3();
          let posAfter = new CANNON.Vec3();
          let intervalId = setInterval(function() {
            posBefore.copy(posAfter);
            posAfter.copy(ball.body.position);
            if (
              !posBefore.isZero() &&
              !posAfter.isZero() &&
              posBefore.y >= 15 &&
              posAfter.y < 15
            ) {
              let avgX = (posBefore.x + posAfter.x) / 2;
              let avgZ = (posBefore.z + posAfter.z) / 2;
              if (avgX >= -2 && avgX <= 2 && avgZ >= -17 && avgZ < -13) {
                console.log("in");

                document.querySelectorAll(".point-light").forEach(el => {
                  el.setAttribute("color", "gold");
                });
                setTimeout(function() {
                  document
                    .querySelector("#camera")
                    .setAttribute("active", true);
                  document
                    .querySelector("#camera-2")
                    .setAttribute("active", false);
                }, 500);

                setTimeout(function() {
                  document
                    .querySelector("a-scene")
                    .systems["utility"].showObject("#banner-success");
                  document
                    .querySelector("a-scene")
                    .systems["utility"].hideObject("#ball-container");
                  document
                    .querySelector("#banner-success")
                    .setAttribute(
                      "navigate",
                      "label: " +
                        ball.components.grabbable.data.label +
                        "; url: " +
                        ball.components.grabbable.data.url
                    );
                }, 1500);
                clearInterval(intervalId);
              } else {
                setTimeout(function() {
                  document
                    .querySelector("#camera")
                    .setAttribute("active", true);
                  document
                    .querySelector("#camera-2")
                    .setAttribute("active", false);
                }, 500);

                console.log("out");
                clearInterval(intervalId);
              }
            }
          }, 50);
          setTimeout(function() {
            clearInterval(intervalId);
          }, 5000);

          // Clear selection
          document
            .querySelector("a-scene")
            .systems["utility"].clearSavedObject();
        }
      }
    });

    AFRAME.registerComponent("navigate", {
      schema: {
        label: { default: "" },
        url: { default: "" }
      },
      init: function() {
        // this.pStart = new THREE.Vector3();
        // this.sourceEl = this.el.sceneEl.querySelector("[camera]");
        // this.el.addEventListener("click", this.forcePush.bind(this));
      },
      update: function() {
        console.log(this.data);

        while (this.el.firstChild) {
          this.el.removeChild(this.el.firstChild);
        }

        let T = document.createElement("a-text");
        T.setAttribute("color", "white");
        T.setAttribute("align", "center");
        T.setAttribute("width", 50);
        T.setAttribute(
          "value",
          "Congratulations! Visit " + this.data.label + "?"
        );
        this.el.appendChild(T);

        this.insertLeftButton();
        this.insertRightButton();
      },
      insertLeftButton: function() {
        let btn = document.createElement("a-icosahedron");

        btn.setAttribute("color", "#FFF26B");
        btn.setAttribute("radius", 1.5);
        btn.setAttribute("position", "-3 -4 0");

        let T = document.createElement("a-text");
        T.setAttribute("color", "white");
        T.setAttribute("align", "right");
        T.setAttribute("width", 30);
        T.setAttribute("value", "Take me there");
        T.setAttribute("position", "-5 -4 0");
        btn.addEventListener("click", this.clickLeftButton.bind(this));
        T.addEventListener("click", this.clickLeftButton.bind(this));
        this.el.appendChild(btn);
        this.el.appendChild(T);
      },
      clickLeftButton: function() {
        window.location.href = this.data.url;
      },
      insertRightButton: function() {
        let btn = document.createElement("a-icosahedron");

        btn.setAttribute("color", "#FF226B");
        btn.setAttribute("radius", 1.5);
        btn.setAttribute("position", "3 -4 0");

        let T = document.createElement("a-text");
        T.setAttribute("color", "white");
        T.setAttribute("align", "left");
        T.setAttribute("width", 30);
        T.setAttribute("value", "Return to shoot more");
        T.setAttribute("position", "5 -4 0");
        btn.addEventListener("click", this.clickRightButton.bind(this));
        T.addEventListener("click", this.clickRightButton.bind(this));
        this.el.appendChild(btn);
        this.el.appendChild(T);
      },
      clickRightButton: function() {
        document.querySelectorAll(".point-light").forEach(el => {
          el.setAttribute("color", "#ccc");
        });
        document
          .querySelector("a-scene")
          .systems["utility"].hideObject("#banner-success");
        document
          .querySelector("a-scene")
          .systems["utility"].showObject("#ball-container");
        document
          .querySelector("[rain-of-entities]")
          .components["rain-of-entities"].reset();
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
    AFRAME.registerComponent("force-pushable", {
      schema: {
        force: { default: 100 }
      },
      init: function() {
        this.pStart = new THREE.Vector3();
        this.sourceEl = this.el.sceneEl.querySelector("[camera]");
        this.el.addEventListener("click", this.forcePush.bind(this));
      },
      forcePush: function() {
        var force,
          el = this.el,
          pStart = this.pStart.copy(this.sourceEl.getAttribute("position"));
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
    AFRAME.registerComponent("force-float", {
      schema: {
        force: { default: 1.0 },
        keyCode: { default: 32 },
        selector: { default: "[force-float-target]" }
      },
      init: function() {
        this.isFloating = false;
        document.addEventListener("keyup", this.onKeyup.bind(this));
      },
      onKeyup: function(e) {
        if (e.keyCode !== this.data.keyCode) return;
        var data = this.data,
          isFloating = this.isFloating,
          physics = this.el.sceneEl.systems.physics,
          targets = this.el.sceneEl.querySelectorAll(data.selector);
        if (isFloating) {
          physics.world.gravity = this.gravity;
        } else {
          // Disable gravity.
          this.gravity = physics.world.gravity;
          physics.world.gravity = new CANNON.Vec3(0, 0, 0);
          // Lift targets slightly.
          targets = [].slice.call(targets).forEach(function(el) {
            var position = new CANNON.Vec3().copy(el.getAttribute("position")),
              impulse = new CANNON.Vec3(
                0.25 * data.force * Math.random(),
                1.0 * data.force * Math.random() + 1.5,
                0.25 * data.force * Math.random()
              );
            el.body.applyImpulse(impulse, position);
          });
        }
        this.isFloating = !isFloating;
      }
    });
  }

  getA = () => {
    return (
      <a-scene
        force-float="selector: [grabbable]"
        fog="type: exponential; color: aqua"
        physics="gravity: -20; friction: 0.8; restitution: 0.8"
        cursor="rayOrigin: mouse"
      >
        <a-entity position="-11.033 19.453 -6.567" rotation="-10 -45 0">
          <a-camera
            id="camera-2"
            active="false"
          />
        </a-entity>

        <a-entity position="0 1.8 4">

          <a-camera id="camera" look-controls="" wasd-controls="">

            <a-animation
              begin="jump"
              easing="ease-out"
              attribute="user-height"
              direction="alternate"
              fill="forwards"
              from="1.8"
              to="3"
              repeat="1"
              dur="600"
            />

            <a-ring
              radius-outer="0.30"
              radius-inner="0.20"
              position="0 0 -3"
              material="color: cyan; shader: flat"
              raycaster="objects: .clickable"
              cursor="maxDistance: 30; fuse: true; fuseTimeout: 1000"
              id="ring"
            >
              <a-animation
                begin="click"
                easing="ease-in"
                attribute="scale"
                fill="backwards"
                from="0.1 0.1 0.1"
                to="1 1 1"
                dur="150"
              />
              <a-animation
                begin="fusing"
                easing="ease-in"
                attribute="scale"
                fill="forwards"
                from="1 1 1"
                to="0.1 0.1 0.1"
                dur="1000"
              />
            </a-ring>
          </a-camera>
        </a-entity>

        <a-box
          id="ground"
          width="75"
          height="0.1"
          depth="75"
          color="#FFAAAA"
          static-body=""
        />

        <a-light type="ambient" color="#bbb" />
        <a-light
          class="point-light"
          color="#ccc"
          position="0 30 0"
          distance="100"
          intensity="0.4"
          type="point"
        />
        <a-light
          class="point-light"
          color="#ccc"
          position="3 10 -10"
          distance="50"
          intensity="0.4"
          type="point"
        />
        <a-assets>
          <a-mixin id="cube" geometry="primitive: box" />
          <a-mixin id="cube-hovered" material="color: magenta" />
          <a-mixin id="cube-selected" material="color: cyan" />
          <a-mixin id="red" material="color: red" />
          <a-mixin id="green" material="color: green" />
          <a-mixin id="blue" material="color: blue" />
          <a-mixin id="yellow" material="color: yellow" />
          <a-mixin id="sphere" geometry="primitive: sphere" />
          <a-mixin
            id="box"
            geometry="primitive: box"
            material="color: grey; side: double"
            physics-body="mass: 5; boundingBox: 2 2 2"
          />
          <a-mixin
            id="ball"
            class="ball"
            geometry="primitive: sphere"
            material="color: grey"
            dynamic-body=""
            radius="1.2"
          />

        </a-assets>

        <a-sky color="#222" />

        <a-entity position="0 15 -15" class="clickable">
          <a-entity
            id="backboard"
            aimable=""
            mixin="box"
            static-body=""
            position="0 5 -3"
            geometry="depth: 0.2; height: 12; width: 15"
          />
          <a-ring
            aimable=""
            radius-inner="2.0"
            radius-outer="2.2"
            rotation="90 0 0"
            id="basket"
            static-body=""
          />
          <a-torus
            aimable=""
            radius="2.1"
            radius-tubular="0.1"
            rotation="90 0 0"
            material="color: crimson;"
          />

        </a-entity>
        <a-entity
          navigate=""
          position="0 8 -8"
          id="banner-success"
          visible="false"
        />
        <a-entity rain-of-entities="" id="ball-container" class="clickable" />

      </a-scene>
    );
  };

  render() {
    return (
      <div id="aframe-root">
        {this.getA()}
      </div>
    );
  }
}

export default Aframe;
