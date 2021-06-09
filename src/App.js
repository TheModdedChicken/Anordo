import React, { createRef } from 'react';
import './App.css';

import lightnessImg from './assets/lightnessImg.png';

/* Functions */

/* Components */

class ToggleOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      toggled: false,
      id: props.name.split(" "),
      switchId: props.name.split(" ") + "-switch",
      capId: props.name.split(" ") + "-cap"
    }
  }
  render() {
    return (
      <div>
        <div className="toggleSwitch" id={this.state.switchId} onClick={() => {
          this.updateToggle(this.state.id, this.state.toggled);
          if (this.state.toggled) this.setState({toggled: false})
          else this.setState({toggled: true});
        }}>
          <div className="toggleSwitchCap" id={this.state.capId}></div>
        </div>
        <h6 className="toggleOption">{this.state.name}</h6>
      </div>
    )
  }
  updateToggle (id, toggled) {
    var toggle = document.getElementById(id + "-switch");
    var toggleCap = document.getElementById(id + "-cap");
    
    if (toggled === false) {
      toggle.style.background = "#3E8BFF";
      toggleCap.style.transform = "translateX(18px)";
    } else {
      toggle.style.background = "#CACACA";
      toggleCap.style.transform = "translateX(0px)";
    }
  }
}

/* Menus */

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: props.callbacks.events,
    }
  }
  render() {
    return (
      <div>
        <button className="mainMenuButton" onClick={() => this.state.event("goto-createJamMenu")}>
          Create Jam
        </button>
        <button className="mainMenuButton">
          Join Jam
        </button>
        <button className="mainMenuButton">
          Settings
        </button>
      </div>
    )
  }
}

class CreateJamMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: props.callbacks.events,
      dataMod: props.callbacks.dataMod
    }
  }
  render() {
    const backButtonText = "< Back";

    return (
      <div>
        <p id="mainMenuBack" onClick={() => this.state.event("goto-mainMenu")}>{backButtonText}</p>
        <input id="jamNameInput" placeholder="Jam Name" type="text" maxLength="30" spellCheck="false"></input>
        <ToggleOption name="Limited Color Pallet"/>
        <ToggleOption name="Tiled"/>
        <ToggleOption name="Free Draw"/>
        <ToggleOption name="PaT"/>
        <h6 id="jamMenuJamCode">Code: LMAOXD</h6>
        <button className="openJamButton" onClick={() => this.openJam()}>Open Jam</button>
      </div>
    )
  }
  openJam() {
    var jamNameInput = document.getElementById("jamNameInput").value;
    var currentDate = new Date();

    if (jamNameInput === null) jamNameInput = "Jam-" + currentDate.getMilliseconds();
    this.state.dataMod("curJamName", jamNameInput);

    this.state.event("goto-jamCanvas");
  }
}

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateDrawingProp: props.callbacks.updateDrawingProp
    }
    this.lightnessPickerRef = createRef(null);
  }
  componentDidMount() {
    // Local Function Vars
    let setColor = this.setColor.bind(this);

    // Color Picker Vars
    var lightnessPicker = this.lightnessPickerRef.current;
    var lpCtx = lightnessPicker.getContext('2d');
    let lightnessImage = document.createElement("img");
    lightnessImage.src = lightnessImg;
    lightnessPicker.width = 150;
    lightnessPicker.height = 150;
    setTimeout(() => {
      changeColor("#000");
    },100)

    // Data Vars
    var picking = false;

    // Events
    lightnessPicker.addEventListener('mousedown', (event) => {
      picking = true;
      var pixelData = lightnessPicker.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
      setColor(`rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`);
    });
    lightnessPicker.addEventListener('mouseup', (event) => picking = false);
    lightnessPicker.addEventListener('mousemove', (event) => handleOver(event));
    lightnessPicker.addEventListener('mouseout', (event) => picking = false);

    function handleOver (event) {
      if (!picking) return;

      var pixelData = lightnessPicker.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
      setColor(`rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`);
    }

    function changeColor (color) {
      lightnessPicker.getContext('2d').clearRect(0, 0, lightnessPicker.width, lightnessPicker.height);
      lpCtx.beginPath();
      lpCtx.rect(0, 0, 150, 150);
      lpCtx.fillStyle = color;
      lpCtx.fill();
      lightnessPicker.getContext('2d').drawImage(lightnessImage, 0, 0, lightnessImage.width, lightnessImage.height);
    }
  }
  componentDidUpdate() {
    
  }
  render() {
    return (
      <div>
        <div id="colorPickerMenu">
          <canvas id="colorPickCanv" ref={this.lightnessPickerRef}></canvas>
        </div>
      </div>
    )
  }
  setColor(color) {
    this.state.updateDrawingProp("penColor", color);
  }
}

class JamCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: props.callbacks.events,
      dataMod: props.callbacks.dataMod,
      dataCol: props.callbacks.dataCol,
      penColor: "#000",
      penWidth: 6,
      colorPickerOpen: false
    }
    this.canvasRef = createRef(null);
    this.updateDrawingProp = this.updateDrawingProp.bind(this);
  }
  componentDidMount() {
    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext("2d");

    // Vars
    var canvWidth = window.innerWidth;
		var canvHeight = window.innerHeight;
    var mouseDown = false;

    var getStateProp = this.getStateProp.bind(this);

    sizeCanvas();
    window.addEventListener("resize", (event) => sizeCanvas());

    function sizeCanvas () {
      var saved_rect = ctx.getImageData(0, 0, canvWidth, canvHeight);
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      ctx.putImageData(saved_rect, 0, 0);

      canvWidth = window.innerWidth;
		  canvHeight = window.innerHeight;
    }

    // Infini-Canvas Vars
    var bounds = canvas.getBoundingClientRect();
    var selectedBox = null;
    var panX = 0;
    var panY = 0;
    var mouseX = 0;
    var mouseY = 0;
    var oldMouseX = 0;
    var oldMouseY = 0;
    var mouseHeld = false;
    var boxArray = [];

    // Events
    document.addEventListener("mousedown", (event) => {
      if (this.state.colorPickerOpen === false) return;
      if (event.target.id !== "colorPickCanv" && event.target.id !== "mainColorBox") {
        var colorPickerMenu = document.getElementById('colorPickerMenu');
        colorPickerMenu.style.animation = "closeColorPicker 0.1s forwards";
        this.setState({colorPickerOpen: false});
        setTimeout(() => {
          colorPickerMenu.style.visibility = "hidden";
        },100)
      }
      console.log(event.target.id);
    })
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
    var jamName = this.state.dataCol("curJamName");
    var jamID = "canvas-" + jamName;

    return (
      <div>
        <div id="jamSideBar">
          <div className="colorBox" id="mainColorBox" onClick={() => {
            var colorPickerMenu = document.getElementById('colorPickerMenu');
            if (this.state.colorPickerOpen === false) {
              colorPickerMenu.style.visibility = "visible";
              colorPickerMenu.style.animation = "openColorPicker 0.1s forwards";
              this.setState({colorPickerOpen: true});
            } else {
              colorPickerMenu.style.animation = "closeColorPicker 0.1s forwards";
              this.setState({colorPickerOpen: false});
              setTimeout(() => {
                colorPickerMenu.style.visibility = "hidden";
              },100)
            }
          }}>

          </div>
        </div>
        <ColorPicker key="lePicker3000" name="lePicker" callbacks={{updateDrawingProp: this.updateDrawingProp}} />
        <canvas id={jamID} ref={this.canvasRef}{...this.props}>

        </canvas>
      </div>
    )
  }
  updateDrawingProp(property, data) {
    this.setState({[property]: data});
  }
  getStateProp(property) {
    return this.state[property];
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentMenu: "mainMenu",
      curJamName: ""
    }
    this.handleEvent = this.handleEvent.bind(this);
    this.appendStateData = this.appendStateData.bind(this);
    this.collectStateData = this.collectStateData.bind(this);
  }
  render() {
    var curMenu;
    const callbackMethods = {
      events: this.handleEvent,
      dataMod: this.appendStateData,
      dataCol: this.collectStateData
    }

    if (this.state.currentMenu === "mainMenu") {
      curMenu = (
        <div className="mainPanel">
          <MainMenu name="mainMenu" callbacks={callbackMethods} />
        </div>
      );
    } else if (this.state.currentMenu === "createJamMenu") {
      curMenu = (
        <div className="mainPanel">
          <CreateJamMenu name="jamCreationMenu" callbacks={callbackMethods} />
        </div>
      );
    } else if (this.state.currentMenu === "jamCanvas") {
      curMenu = (
        <div>
          <JamCanvas name="jamCanvas" callbacks={callbackMethods} />
        </div>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          {curMenu}
        </header>
      </div>
    );
  }
  appendStateData(state, data) {
    this.setState({[state]: data});
  }
  collectStateData(state) {
    return this.state[state];
  }
  handleEvent(event, cargo) {
    var action = event.split("-")[0];
    var arg = event.split("-")[1];

    if (action === "goto") {
      if (arg === "mainMenu") {
        this.setState({currentMenu: "mainMenu"});
      } else if (arg === "createJamMenu") {
        this.setState({currentMenu: "createJamMenu"});
      } else if (arg === "jamCanvas") {
        this.setState({currentMenu: "jamCanvas"});
      }
    }
  }
}

export default App;
