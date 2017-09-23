class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // imgUrl: this.props.rendered2D || " "
    };
  }
  onFileChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = () => {
      this.setState({
        imgUrl: reader.result
      });

      this.props.setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.rendered2D) {
    this.setState({
      imgUrl: nextProps.rendered2D.middle || "https://via.placeholder.com/500x350"
    });}
  };

  render() {
    return (
      <div>
        <img src={this.state.imgUrl} width="100px" height="100px" />
        <br/>
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={this.onFileChange}
          placeholder="Upload image..."
        />
      </div>
    );
  }
}

export default Uploader;
