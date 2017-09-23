class FabricCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.fabricCanvas = new fabric.Canvas();
    this.fabricEditCanvas = new fabric.Canvas();
    this.image = null;
    this.H = 100;
    this.W = 100;
  }
  componentDidMount() {
    this.fabricCanvas.initialize(this.refs.canvasRef, {
      height: this.H,
      width: this.W
    });
    this.fabricEditCanvas.initialize(this.refs.editCanvasRef, {
      height: this.H,
      width: this.W
    });
  }

  componentWillReceiveProps = nextProps => {
    let C = this.fabricCanvas;
    let H = C.height;
    let W = C.width;

    if (nextProps.imgUrl !== this.props.imgUrl) {
      fabric.Image.fromURL(nextProps.imgUrl, oImg => {
        oImg.setOptions({
          selectable: false,
          evented: false,
          opacity: 0.9,
          height: H,
          width: W
        });

        C.setBackgroundImage(oImg);
        C.renderAll();
        this.image = oImg;
      });

      let rect = new fabric.Rect({
        left: 0.25 * W,
        top: 0.25 * H,
        stroke: "red",
        strokeWidth: 1,
        fill: "red",
        opacity: 0.5,
        width: 0.5 * W,
        height: 0.5 * H
      });

      function makeLine(coords) {
        return new fabric.Line(coords, {
          fill: "red",
          stroke: "red",
          strokeWidth: 1,
          selectable: false
        });
      }

      let line1 = makeLine([0, H, 0.25 * W, 0.75 * H]),
        line2 = makeLine([0.75 * W, 0.75 * H, W, H]);

      C.add(rect, line1, line2);

      // Export clip info
      this.clipParams = {
        topLeftX: line1.x2,
        topLeftY: line1.y2,
        topRightX: line2.x1,
        topRightY: line2.y1,
        bottomLeftX: line1.x1,
        bottomLeftY: line1.y1,
        bottomRightX: line2.x2,
        bottomRightY: line2.y2
      };

      let onRect = () => {
        line1.set({ x2: rect.left, y2: rect.top + rect.height * rect.scaleY });
        line2.set({
          x1: rect.left + rect.width * rect.scaleX,
          y1: rect.top + rect.height * rect.scaleY
        });

        C.renderAll();

        // Export clip info
        this.clipParams = {
          topLeftX: line1.x2,
          topLeftY: line1.y2,
          topRightX: line2.x1,
          topRightY: line2.y1,
          bottomLeftX: line1.x1,
          bottomLeftY: line1.y1,
          bottomRightX: line2.x2,
          bottomRightY: line2.y2
        };
      };

      rect.on({
        moving: onRect,
        scaling: onRect
      });
    }
  };

  export = () => {
    
    let CP = this.clipParams;
    // console.log(this.clipParams);
    let image = new Image();
    image.onload = () => {
      let IW = image.width,
        IH = image.height,
        CW = this.W,
        CH = this.H;
      // console.log(IW, IH, CW, CH);
      var context = this.refs.editCanvasRef.getContext("2d");
      for (var i = 0; i <= CH; ++i) {
        // if (i % 10 === 0) {
        //   console.log(IW / CW * (CP.topLeftX + (CP.bottomLeftX - CP.topLeftX) * i / CH),
        //   IH / CH * (CP.topLeftY + (CP.bottomLeftY - CP.topLeftY) * i / CH),
        //   IW /
        //     CW *
        //     (CP.topRightX -
        //       CP.topLeftX +
        //       (CP.bottomRightX - CP.bottomLeftX - CP.topRightX + CP.topLeftX) *
        //         i /
        //         CH),
        //   IH / CH,
        //   0,
        //   i,
        //   CW,
        //   1)
        // }
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(
          image,
          IW / CW * (CP.topLeftX + (CP.bottomLeftX - CP.topLeftX) * i / CH),
          IH / CH * (CP.topLeftY + (CP.bottomLeftY - CP.topLeftY) * i / CH),
          IW /
            CW *
            (CP.topRightX -
              CP.topLeftX +
              (CP.bottomRightX - CP.bottomLeftX - CP.topRightX + CP.topLeftX) *
                i /
                CH),
          IH / CH,
          0,
          i,
          CW,
          1
        );
        
      }
      

        let imgDataUrl = this.refs.editCanvasRef.toDataURL(); 
      fabric.Image.fromURL(imgDataUrl, oImg => {
        oImg.setOptions({
          selectable: false,
          evented: false,
          opacity: 0.9,
          height: this.H,
          width: this.W
        });

        this.fabricEditCanvas.setBackgroundImage(oImg);
        this.fabricEditCanvas.renderAll();
        
        this.setRendered2D();
      });
      // this.fabricEditCanvas.renderAll();
    };
    image.src = this.props.imgUrl;
  }

  setRendered2D = () => {
  

this.props.setRendered2D(
  {
    middle: this.fabricCanvas.deactivateAll().toDataURL({
        format: "png",
        multiplier: 2.56
      }),
    bottom: this.fabricEditCanvas.deactivateAll().toDataURL({
        format: "png",
        multiplier: 2.56
      })
  }
      
    );
  }

  render() {
    return (
      <div>
        <button onClick={this.export} />
        <div className="row">
          <canvas ref="canvasRef" />
          <canvas ref="editCanvasRef" />
        </div>
      </div>
    );
  }
}

export default FabricCanvas;
