import React, { createRef } from 'react';
import ColorPicker from '../Components/ColorPicker';

import { AnimationController } from '../Division';
import ClientConnection from '../api/peer';

import '../App.css';
import { editJam } from '../api/rest';

class JamCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callEvent: props.callbacks.callEvent,
      setAppState: props.callbacks.setAppState,
      getAppState: props.callbacks.getAppState,
      authorization: props.auth,
      penColor: "rgba(0,0,0,255)",
      penWidth: 6,
      colorPickerOpen: false
    }
    this.cc = new ClientConnection();
    this.canvasRef = createRef(null);
    this.setProp = this.setProp.bind(this);

    this.clients = {
      host: null,
      peers: []
    };
  }
  async componentDidMount() {
    this.cc.peer.on("open", () => {
      this.cc.sendData("host", "wow");
    })

    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext("2d");

    // Vars
    var canvWidth = document.body.offsetWidth;
    var canvHeight = document.body.offsetHeight;
    var mouseDown = false;

    var getStateProp = this.getStateProp.bind(this);

    var colorPickerAC = new AnimationController("colorPickerMenu-AC", "colorPickerMenu", "hidden");

    colorPickerAC.closeOnBlur = true;
    colorPickerAC.addAnimation("hide", "closeColorPicker 0.1s forwards", () => {
      this.setState({colorPickerOpen: false});
    });
    colorPickerAC.addAnimation("show", "openColorPicker 0.1s forwards", () => {
      this.setState({colorPickerOpen: true});
    }).addTouchElement("show", "mainColorBox");

    sizeCanvas();
    window.addEventListener("resize", (event) => sizeCanvas());

    function sizeCanvas () {
      var saved_rect = ctx.getImageData(0, 0, canvWidth, canvHeight);
      canvas.height = document.body.offsetHeight;
      canvas.width = document.body.offsetWidth;
      ctx.putImageData(saved_rect, 0, 0);

      canvWidth = document.body.offsetWidth;
		  canvHeight = document.body.offsetHeight;
    }

    // Events
    document.body.onmousedown = e => { if (e.button === 1) return false }
    document.body.onmouseup = e => { if (e.button === 1) return false }
    canvas.addEventListener('mousedown', (event) => handleDown(event));
    canvas.addEventListener('mouseup', (event) => exitDown(event));
    canvas.addEventListener('mousemove', (event) => draw(event));
    canvas.addEventListener('mouseout', (event) => exitDown(event));

    function handleDown(event) {
      if (event.button === 1) return false;
      mouseDown = true;
      draw(event);
      console.log(getStateProp("penColor"));
    }

    function exitDown(event) {
      if (event.button === 1) return false;
      mouseDown = false;
      ctx.beginPath();
    }

    function draw(event) {
      if (!mouseDown) return;
      
      ctx.lineWidth = getStateProp("penWidth");
      ctx.lineCap = "round";
      ctx.strokeStyle = getStateProp("penColor");

      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY);
    }
  }
  render() {
    var jamName = this.state.getAppState("curJamName");
    var jamID = "canvas-" + jamName;

    return (
      <div id="jamContainer">
        <div id="jamSideBar">
          <div className="colorBox" id="mainColorBox">

          </div>
        </div>
        <ColorPicker key="lePicker3000" name="lePicker" callbacks={{updateDrawingProp: this.setProp}} />
        <canvas className="leCanvas3000" id={jamID} ref={this.canvasRef}{...this.props}>

        </canvas>
      </div>
    )
  }
  setProp(property, data) {
    this.setState({[property]: data});

    if (property === "penColor") {
      var mainColorBox = document.getElementById('mainColorBox');

      mainColorBox.style.background = this.state.penColor;
    }
  }
  getStateProp(property) {
    return this.state[property];
  }
}

export default JamCanvas