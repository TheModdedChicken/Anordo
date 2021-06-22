import React, { createRef } from 'react';

import '../App.css';
import lightnessImg from '../assets/lightnessImg.png';

// Example: <CustomPicker name="alphaPickerCanv" width={150} height={20} gradient={{startX: 0, startY: 20, endX:150, endY:20, arr: ["#ffffff00", "#000"]}} pointer={{startX: 0, startY: 0, motionType: "bilinear"}} borderRadius="5px" callbacks={{newEvent: this.captureEvent}} ></CustomPicker>

class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.name,
      width: props.width,
      height: props.height,
      color: props.color,
      gradient: props.gradient,
      image: props.image,
      borderRadius: props.borderRadius,
      pointer: props.pointer,
      newEvent: props.callbacks.newEvent,
      registerCallback: props.callbacks.registerCallback
    }
    this.customPickerRef = createRef(null);
    this.getProp = this.getProp.bind(this);
    this.setProp = this.setProp.bind(this);
    this.getPosData = this.getPosData.bind(this);
  }
  componentDidMount() {
    var getProp = this.getProp;
    var newEvent = this.state.newEvent;

    this.state.registerCallback(this.state.id, "setProp", this.setProp);
    this.state.registerCallback(this.state.id, "getPosData", this.getPosData);

    var customPicker = this.customPickerRef.current;
    var cpCtx = customPicker.getContext('2d');
    let customPickerImage = document.createElement("img");

    if (!this.state.width || !this.state.height) return console.log("CustomPicker must have a width and height to be displayed properly");
    customPicker.width = this.state.width;
    customPicker.height = this.state.height;

    if (this.state.borderRadius) customPicker.style.borderRadius = this.state.borderRadius;

    if (this.state.image) {
      customPickerImage.src = this.state.image;
      customPickerImage.width = this.state.width;
      customPickerImage.height = this.state.height;
    }

    if (this.state.gradient && this.state.color) return console.log("CustomPicker must not be using two color types (Color, Gradient)");
    if (this.state.color) {
      if (this.state.image) {
        customPickerImage.addEventListener("load", () => {
          updateColor("color")
        })
      } else {
        updateColor("color")
      }
    };
    if (this.state.gradient) updateColor("gradient");

    if (!this.state.pointer) return console.log("CustomPicker must have pointer data (motionType, startX, startY)");
    if (!this.state.pointer.motionType) return console.log("CustomPicker must have a motionType");
    if (this.state.pointer.startX === null) return console.log("CustomPicker must have a startX");
    if (this.state.pointer.startY === null) return console.log("CustomPicker must have a startY");

    var pointer = document.getElementById(this.state.id + "-pointer");
    var pointerYOffset = 0;
    var pointerXOffset = 0;
    if ((this.state.pointer.motionType === "horizontal" || this.state.pointer.motionType === "bilinear") && this.state.pointer.offsetY) pointerYOffset = this.state.pointer.offsetY;
    if ((this.state.pointer.motionType === "vertical" || this.state.pointer.motionType === "bilinear") && this.state.pointer.offsetX) pointerXOffset = this.state.pointer.offsetX;
    var pointerY = this.state.pointer.startY + pointerYOffset;
    var pointerX = this.state.pointer.startX + pointerXOffset;
    pointer.style.top = (pointerY + pointerYOffset) + "px";
    pointer.style.left = pointerX + "px";

    function updateColor(type, halt) {
      if (type === "color") {
        if (halt) {
          cpCtx.beginPath();
          cpCtx.rect(0, 0, 150, 150);
          cpCtx.fillStyle = getProp("color");
          cpCtx.fill();
        } else {
          cpCtx.clearRect(0, 0, customPicker.width, customPicker.height);
          cpCtx.beginPath();
          cpCtx.rect(0, 0, 150, 150);
          cpCtx.fillStyle = getProp("color");
          cpCtx.fill();
          if (getProp("image")) updateImage(true);
        }
      } else {
        /* 
          Usage: { startX: 0, startY: 20, endX: 150, endY: 20, arr: ["#fff", "#000"] }
          Fields:
            startX - Starting X position of gradient
            startY - Starting Y position of gradient
            endX - Ending X position of gradient
            endY - Ending Y position of gradient
            arr - Array of colors to distribute across gradient
        */

        var gradientData = getProp("gradient");
        var gradient = cpCtx.createLinearGradient(gradientData.startX, gradientData.startY, gradientData.endX, gradientData.endY);

        var i;
        if (halt) {

          for (i = 0; i < gradientData.arr.length; i++) {
            if (i === 0) gradient.addColorStop(0, gradientData.arr[i])
            else if (i === gradientData.arr[i]) gradient.addColorStop(1, gradientData.arr[i])
            else {
              gradient.addColorStop(i / (gradientData.arr.length - 1), gradientData.arr[i])
            }
          };

          cpCtx.fillStyle = gradient;
          cpCtx.fillRect(0, 0, 150, 20);
        } else {
          cpCtx.clearRect(0, 0, customPicker.width, customPicker.height);

          for (i = 0; i < gradientData.arr.length; i++) {
            if (i === 0) gradient.addColorStop(0, gradientData.arr[i])
            else if (i === gradientData.arr[i]) gradient.addColorStop(1, gradientData.arr[i])
            else {
              gradient.addColorStop(i / (gradientData.arr.length - 1), gradientData.arr[i])
            }
          };

          cpCtx.fillStyle = gradient;
          cpCtx.fillRect(0, 0, 150, 20);
        }
      }
    }

    this.updateColor = updateColor.bind(this);

    function updateImage(halt) {
      if (halt) cpCtx.drawImage(customPickerImage, 0, 0)
      else {
        cpCtx.clearRect(0, 0, customPicker.width, customPicker.height);
        cpCtx.drawImage(customPickerImage, 0, 0, customPickerImage.width, customPickerImage.height)
        if (getProp("color") || getProp("gradient")) updateColor(this.state.gradient ? "gradient" : "color", true);
      }
    }

    this.updateImage = updateImage.bind(this);

    var motionType = this.state.pointer.motionType;
    var isPicking = false;

    customPicker.addEventListener('mousedown', (event) => {
      isPicking = true;
      sendPosData(event);
    });
    customPicker.addEventListener("mouseup", (event) => {
      isPicking = false;
    });
    customPicker.addEventListener("mouseout", (event) => {
      isPicking = false;
    });
    document.body.addEventListener('mousemove', (event) => {
      if (!isPicking) return;

      var pickerRect = customPicker.getBoundingClientRect();
      var pickerWidth = pickerRect.width;
      var pickerHeight = pickerRect.height;
      var pickerX = pickerRect.x;
      var pickerY = pickerRect.y;
      var mouseLocX = event.pageX - pickerX;
      var mouseLocY = event.pageY - pickerY;

      if (motionType === "horizontal" || motionType === "bilinear") {
        if (mouseLocX < 0 || mouseLocX > pickerWidth) {
          if (Math.sign(mouseLocX) === 1) {
            pointer.style.left = (pickerWidth - 4) + "px";
          } else {
            pointer.style.left = "0px";
          }
          
          return;
        } else {
          pointer.style.left = (mouseLocX - 4) + "px";
        }
      }

      if (motionType === "vertical" || motionType === "bilinear") {
        if (mouseLocY < 0 || mouseLocY > pickerHeight) {
          if (Math.sign(mouseLocY) === 1) {
            pointer.style.top = (pickerHeight - 3) + "px";
          } else {
            pointer.style.top = "0px";
          }
          
          return;
        } else {
          pointer.style.top = (mouseLocY - 3) + "px";
        }
      }

      sendPosData(event);
    });

    function sendPosData (event) {
      var pickerRect = customPicker.getBoundingClientRect();
      var pointerRect = pointer.getBoundingClientRect();
      var pointerX = (pointerRect.x - pickerRect.x) + 4;
      var pointerY = (pointerRect.y - pickerRect.y) + 4;

      var imageData = cpCtx.getImageData(pointerX, pointerY, 1, 1).data;

      newEvent(`${getProp("id")}`, "selection", {
        imageData: imageData,
        event: event
      })
    }
  }
  render() {
    return (
      <div className="customPickerContainer" id={this.state.id + "-container"}>
        <canvas id={this.state.id} ref={this.customPickerRef}></canvas>
        <div className="pickerCanvPointer" id={this.state.id + "-pointer"}></div>
      </div>
    )
  }
  setProp(property, data) {
    this.setState({[property]: data});

    if (property === "color" || property === "gradient") this.updateColor(this.state.gradient ? "gradient" : "color")
    else if (property === "image") this.updateImage();
  }
  getProp(property) {
    return this.state[property];
  }
  getPosData() {
    var customPicker = this.customPickerRef.current;
    var cpCtx = customPicker.getContext('2d');
    var pointer = document.getElementById(this.state.id + "-pointer");
    var pickerRect = customPicker.getBoundingClientRect();
    var pointerRect = pointer.getBoundingClientRect();
    var pointerX = (pointerRect.x - pickerRect.x) + 3;
    var pointerY = (pointerRect.y - pickerRect.y) + 3;

    var imageData = cpCtx.getImageData(pointerX, pointerY, 1, 1).data;
    return imageData;
  }
}

export default CustomPicker;