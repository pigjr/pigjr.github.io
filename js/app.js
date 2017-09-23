import FabricCanvas from "./components/FabricCanvas";
import PixiCanvas from "./components/PixiCanvas";
import Uploader from "./components/Uploader";
import Aframe from "./components/Aframe";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomLevel: 1.0,
      img:  ""
    };
  }
  /**    
     * Event handler for clicking zoom in. Increments the zoom level 
     **/
  onZoomIn = () => {
    let zoomLevel = (this.state.zoomLevel += 0.1);
    this.setState({ zoomLevel });
  };
  /**    
     * Event handler for clicking zoom out. Decrements the zoom level 
     **/
  onZoomOut = () => {
    let zoomLevel = (this.state.zoomLevel -= 0.1);

    if (zoomLevel >= 0) {
      this.setState({ zoomLevel });
    }
  };

  setImage = (img) => {
    this.setState({ img });
    
  }
  
  setRendered2D = (imgDataUrlCollection) => {
    this.setState({ rendered2D: imgDataUrlCollection})
  }

  render() {
    return (
      <div className="row">
        {/*<FabricCanvas imgUrl={this.state.img} setRendered2D={this.setRendered2D}/>
        <button onClick={this.onZoomIn}>Zoom In</button>
        <button onClick={this.onZoomOut}>Zoom Out</button>
        <PixiCanvas zoomLevel={this.state.zoomLevel} imgUrl={this.state.img}/>
        <Uploader setImage={this.setImage} rendered2D={this.state.rendered2D}/>*/}
        <Aframe rendered2D={this.state.rendered2D}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
