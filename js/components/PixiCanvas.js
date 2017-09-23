class Canvas extends React.Component {
  /**
        * Define our prop types
        **/
  static propTypes = {
    zoomLevel: React.PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    console.log(props);
  }
  disableAnimation = () => {
    return window.innerWidth >= 768;
  };

  /**
        * In this case, componentDidMount is used to grab the canvas container ref, and 
        * and hook up the PixiJS renderer
        **/
  componentDidMount() {
    //Setup PIXI Canvas in componentDidMount
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.app = new PIXI.Application(111, 111, { backgroundColor: 0x1099bb });
    this.stage = this.app.stage;
    this.renderer = this.app.renderer;
    this.refs.gameCanvas.appendChild(this.app.view);
  }

  /**
        * shouldComponentUpdate is used to check our new props against the current
        * and only update if needed
        **/
  shouldComponentUpdate(nextProps, nextState) {
    //this is easy with 1 prop, using Immutable helpers make
    //this easier to scale

    return true || nextProps.zoomLevel !== this.props.zoomLevel;
  }
  /**
        * When we get new props, run the appropriate imperative functions 
        **/
  componentWillReceiveProps(nextProps) {
    this.updateZoomLevel(nextProps);
  }
  /**
        * Update the stage "zoom" level by setting the scale
        **/
  updateZoomLevel = props => {
    this.stage.scale.x = props.zoomLevel;
    this.stage.scale.y = props.zoomLevel;
  };

  /**
        * Animation loop for updating Pixi Canvas
        **/
  animate = () => {
    while (this.stage.children[0]) {
      this.stage.removeChild(this.stage.children[0]);
    }
    // this.stage.addChild(
    //   new PIXI.Sprite(PIXI.loader.resources[this.props.imgUrl].texture)
    // );
    // create a new Sprite from an image path
    var bunny = PIXI.Sprite.fromImage(this.props.imgUrl);

    // center the sprite's anchor point
    bunny.anchor.set(0.5);

    // move the sprite to the center of the screen
    bunny.x = this.renderer.width / 2;
    bunny.y = this.renderer.height / 2;

    bunny.scale.x = bunny.scale.y = 0.05;
    bunny.interactive = true;
    // Pointers normalize touch and mouse
    bunny.on("pointerdown", this.drawline);

    this.stage.addChild(bunny);
  };

  drawline = x => {
    console.log(x);
    var line = new PIXI.Graphics();
    line.lineStyle(4, 0xffffff, 1);
    line.moveTo(0, 0);
    line.lineTo(80, 50);
    line.x = 32;
    line.y = 32;
    this.stage.addChild(line);
  };
  render() {
    //Use Pixi's built-in `loader` object to load an image
    PIXI.loader.reset().add(this.props.imgUrl).load(this.animate);

    return (
      <div className="app-root">

        <div className="game-canvas-container" ref="gameCanvas" />

      </div>
    );
  }
}

export default Canvas;
