import React from 'react';
import './App.css';

import JamCanvas from './Components/JamCanvas';
import CustomToggle from './Components/CustomToggle';
import AlertBoard from './Components/AlertBoard';

import { SceneManager, Scene } from "./Division/index";

/* Menus */

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: props.callbacks.events,
      newAlert: props.callbacks.newAlert
    }
  }
  render() {
    return (
      <div>
        <button className="mainMenuButton" onClick={() => this.state.event("goto-createJamMenu")}>
          Create Jam
        </button>
        <button className="mainMenuButton" onClick={() => {
          this.state.newAlert("joinJamButtonPress", "Join Jam", `Multiplayer jams are not implemented yet!`, 5, "info")
        }}>
          Join Jam
        </button>
        <button className="mainMenuButton" onClick={() => {
          this.state.newAlert("settingsButtonPress", "Settings", `The settings menu is not implemented yet!`, 5, "info")
        }}>
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
      dataMod: props.callbacks.dataMod,
      newAlert: props.callbacks.newAlert
    }
  }
  render() {
    return (
      <div>
        <p id="mainMenuBack" onClick={() => this.state.event("goto-mainMenu")}>Back</p>
        <input id="jamNameInput" placeholder="Jam Name" type="text" maxLength="30" spellCheck="false" autoComplete="off"></input>
        <CustomToggle name="Limited Color Pallet"/>
        <CustomToggle name="Tiled"/>
        <CustomToggle name="Free Draw"/>
        <CustomToggle name="PaT"/>
        <h6 id="jamMenuJamCode">Code: LMAOXD</h6>
        <button className="openJamButton" onClick={() => this.openJam()}>Open Jam</button>
      </div>
    )
  }
  openJam() {
    var jamNameInput = document.getElementById("jamNameInput").value;
    var currentDate = new Date();

    if (jamNameInput === "") {
      jamNameInput = "Jam-" + currentDate.getMilliseconds() + "" + currentDate.getHours();
      this.state.newAlert("jamNameInput", "Jam Name", `No jam name specified, using ${jamNameInput} as filler.`, 15, "warning")
    };
    this.state.dataMod("curJamName", jamNameInput);

    this.state.event("goto-jamCanvas");
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
    this.registerCallback = this.registerCallback.bind(this);
    this.newAlert = this.newAlert.bind(this);
    this.appCallbacks = {}
  }
  componentDidMount() {
    var currentBuildType = "Production";
    var currentBuild = "production";
    if (window.location.href.indexOf("localhost") > -1) {
      currentBuildType = "Developer"
      currentBuild = "local"
    } else if (window.location.href.indexOf("themoddedchicken.vercel.app") > -1) {
      if (window.location.href.indexOf("anordo.themoddedchicken.vercel.app") === -1) {
        currentBuildType = "Developer"
        currentBuild = window.location.href.split("-")[1];
      }
    } else if (window.location.href.indexOf("anordo-dev.vercel.app") > -1) {
      currentBuildType = "Developer"
      currentBuild = "latest"
    }

    if (currentBuildType !== "Production" && currentBuild !== "local") this.newAlert("currentBuildNotification", `Application Build (${currentBuild})`, `You are using a ${currentBuildType} build of Anordo. ⠀⠀ This build may or may not contain application breaking bugs.`, 5, "warning");
  }
  render() {
    const callbackMethods = {
      events: this.handleEvent,
      dataMod: this.appendStateData,
      dataCol: this.collectStateData,
      newAlert: this.newAlert
    }

    var appScenes = new SceneManager("appScenes").setScene(this.state.currentMenu);

    new Scene("mainMenu", "mainMenu", (
      <div className="mainPanel">
        <MainMenu name="mainMenu" callbacks={callbackMethods} />
      </div>
    ), appScenes);

    new Scene("createJamMenu", "createJamMenu", (
      <div className="mainPanel">
        <CreateJamMenu name="jamCreationMenu" callbacks={callbackMethods}/>
      </div>
    ), appScenes);

    new Scene("jamCanvas", "jamCanvas", (
      <div>
        <JamCanvas name="jamCanvas" callbacks={callbackMethods} />
      </div>
    ), appScenes);

    return (
      <div className="App">
        <header className="App-header">
          <AlertBoard name="mainAlertBoard" callbacks={{registerCallback: this.registerCallback}} />
          {appScenes.render()}
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
  /**
    * @param {String} id Alert reference id
    * @param {String} title Alert title
    * @param {String} details Alert details
    * @param {Number} duration Alert lifetime in seconds
    * @param {String} type Type of alert
    * @param {Function} callback Function to call on click (optional)
    */
  newAlert(id, title, details, duration, type, callback) {
    this.appCallbacks.mainAlertBoard.newAlert(id, title, details, duration, type, callback);
  }
  /**
    * @param {String} componentId ID if Component
    * @param {String} callbackId ID of Callback
    * @param {Function} callback Callback to register
    */
  registerCallback(componentId, callbackId, callback) {
    if (!this.appCallbacks[componentId]) this.appCallbacks[componentId] = {};
    this.appCallbacks[componentId][callbackId] = callback;
  }
}

export default App;
