import React, { createRef } from 'react';
import CustomPicker from './CustomPicker';

import '../App.css';
import lightnessImg from '../assets/lightnessImg.png';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateDrawingProp: props.callbacks.updateDrawingProp,
      curColor: [0, 0, 0, 255]
    }
    this.lightnessPickerRef = createRef(null);
    this.huePickerRef = createRef(null);
    this.captureEvent = this.captureEvent.bind(this);
    this.registerCallback = this.registerCallback.bind(this);
    this.canvasCallbacks = {}
  }
  componentDidMount() {
    // Local Function Vars
    let setColor = this.setColor.bind(this);
    let setProp = this.setProp.bind(this);
    let getProp = this.getProp.bind(this);

    // Functions
    function pickLightness (data) {
      setColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
    }
    this.pickLightness = pickLightness;

    function pickHue (data) {
      this.canvasCallbacks.lightnessPickerCanv.setProp("color", `rgb(${data[0]}, ${data[1]}, ${data[2]})`);
      var lightnessData = this.canvasCallbacks.lightnessPickerCanv.getPosData();
      setColor(`rgb(${lightnessData[0]}, ${lightnessData[1]}, ${lightnessData[2]})`);
    }
    this.pickHue = pickHue;

  }
  render() {
    //<canvas id="huePickerCanv" ref={this.huePickerRef}></canvas>
    //<canvas id="lightnessPickerCanv" ref={this.lightnessPickerRef}></canvas>
    return (
      <div id="colorPickerMenu">
        <div id="colorChangers">
          <CustomPicker name="lightnessPickerCanv" width={150} height={150} color={"rgb(255, 0, 0)"} image={lightnessImg} pointer={{startX: 150, startY: 150, motionType: "bilinear", offsetY: -2, offsetX: -5}} callbacks={{newEvent: this.captureEvent, registerCallback: this.registerCallback}} ></CustomPicker>
          <CustomPicker name="huePickerCanv" width={150} height={20} gradient={{startX: 0, startY: 20, endX:150, endY:20, arr: ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "red"]}} pointer={{startX: 0, startY: 0, motionType: "horizontal", offsetY: 7}} borderRadius="5px" callbacks={{newEvent: this.captureEvent, registerCallback: this.registerCallback}} ></CustomPicker>
        </div>
        <div id="colorValues">

        </div>
      </div>
    )
  }
  setColor(color) {
    this.state.updateDrawingProp("penColor", color);
  }
  setProp(property, data) {
    this.setState({[property]: data});
  }
  getProp(property) {
    return this.state[property];
  }
  captureEvent(componentName, type, event) { 
    if (componentName === "huePickerCanv") {
      if (type === "selection") {
        this.pickHue(event.imageData);
      }
    } else if (componentName === "lightnessPickerCanv") {
      if (type === "selection") {
        this.pickLightness(event.imageData);
      }
    }
  }
  registerCallback(componentId, callbackId, callback) {
    if (!this.canvasCallbacks[componentId]) this.canvasCallbacks[componentId] = {};
    this.canvasCallbacks[componentId][callbackId] = callback;
  }
}

export default ColorPicker