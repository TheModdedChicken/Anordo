import React from 'react';
import './App.css';

/* Components */
import JamCanvas from './Scenes/JamCanvas';
import { SceneManager, Scene, AlertBoard, EventManager } from "./Division";

/* Menus */
import MainMenu from './Scenes/MainMenu';

import options from "./options.json";

/* App */
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentScene: "mainMenu",
      curJamName: ""
    }
    this.eventManager = new EventManager("mainEventManager").addEvents({
      goto_mainMenu: () => {this.setState({currentScene: "mainMenu"})},
      goto_jamCanvas: () => {this.setState({currentScene: "jamCanvas"})}
    })
    this.setAppState = this.setAppState.bind(this);
    this.getAppState = this.getAppState.bind(this);
    this.registerCallback = this.registerCallback.bind(this);
    this.alertBoard = new AlertBoard("mainAlertBoard");
    this.appCallbacks = {}
  }
  componentDidMount() {
    if (window.location.href.indexOf("anordo.vercel.app") == -1 && window.location.href.indexOf("localhost") == -1) 
      this.alertBoard.newAlert("currentBuildNotification", "Application Build (Dev)", `You are using a development build of Anordo. ⠀⠀ This build may or may not contain application breaking bugs.`, 5, "warning");

    if (localStorage.appFont) document.documentElement.style.setProperty("--appFont", localStorage.appFont);
    if (!localStorage.serverAddress) localStorage.setItem("serverAddress", options.defaultServerAddress);
  }
  render() {
    const callbackMethods = {
      callEvent: this.eventManager.call,
      setAppState: this.setAppState,
      getAppState: this.getAppState,
      newAlert: this.alertBoard.newAlert
    }

    var appScenes = new SceneManager("appScenes").setScene(this.state.currentScene);
    new Scene("mainMenu", "mainMenu", <MainMenu name="mainMenu" callbacks={callbackMethods} />, appScenes);
    new Scene("jamCanvas", "jamCanvas", <JamCanvas name="jamCanvas" callbacks={callbackMethods} />, appScenes);

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
