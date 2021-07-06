import React from 'react';
import './App.css';

import JamCanvas from './Components/JamCanvas';
import CustomToggle from './Components/CustomToggle';

import { SceneManager, Scene, AlertBoard, EventManager } from "./Division/index";

/* Menus */

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callEvent: props.callbacks.callEvent,
      newAlert: props.callbacks.newAlert
    }
  }
  render() {
    return (
      <div>
        <button className="mainMenuButton" onClick={() => this.state.callEvent("goto_createJamMenu")}>
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
      callEvent: props.callbacks.callEvent,
      setAppState: props.callbacks.setAppState,
      newAlert: props.callbacks.newAlert
    }
  }
  render() {
    return (
      <div>
        <p id="mainMenuBack" onClick={() => this.state.callEvent("goto_mainMenu")}>Back</p>
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
    this.state.setAppState("curJamName", jamNameInput);

    this.state.callEvent("goto_jamCanvas");
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentMenu: "mainMenu",
      curJamName: ""
    }
    this.eventManager = new EventManager("mainEventManager").addEvents({
      goto_mainMenu: () => {this.setState({currentMenu: "mainMenu"})},
      goto_createJamMenu: () => {this.setState({currentMenu: "createJamMenu"})},
      goto_jamCanvas: () => {this.setState({currentMenu: "jamCanvas"})}
    })
    this.setAppState = this.setAppState.bind(this);
    this.getAppState = this.getAppState.bind(this);
    this.registerCallback = this.registerCallback.bind(this);
    this.newAlert = this.newAlert.bind(this);
    this.alertBoard = new AlertBoard("mainAlertBoard");
    this.appCallbacks = {}
  }
  componentDidMount() {
    if (window.location.href.indexOf("anordo.vercel.app") == -1 && window.location.href.indexOf("localhost") == -1) 
      this.newAlert("currentBuildNotification", "Application Build (Dev)", `You are using a development build of Anordo. ⠀⠀ This build may or may not contain application breaking bugs.`, 5, "warning");
  }
  render() {
    const callbackMethods = {
      callEvent: this.eventManager.call,
      setAppState: this.setAppState,
      getAppState: this.getAppState,
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
          {this.alertBoard.render()}
          {appScenes.render()}
        </header>
      </div>
    );
  }
  setAppState(state, data) {
    this.setState({[state]: data});
  }
  getAppState(state) {
    return this.state[state];
  }
  /**
    * @param {String} id Alert reference id
    * @param {String} title Alert title
    * @param {String} details Alert details
    * @param {Number} duration Alert lifetime in seconds
    * @param {String} type Type of alert
    * @param {Function} callback Function to call on click _(optional)_
    */
  newAlert(id, title, details, duration, type, callback = null) {
    this.alertBoard.newAlert(id, title, details, duration, type, callback);
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
