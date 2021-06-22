import React from 'react';
import './App.css';

import JamCanvas from './Components/JamCanvas';
import CustomToggle from './Components/CustomToggle';
import AlertBoard from './Components/AlertBoard';

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
      dataMod: props.callbacks.dataMod,
      newAlert: props.callbacks.newAlert
    }
  }
  render() {
    return (
      <div>
        <p id="mainMenuBack" onClick={() => this.state.event("goto-mainMenu")}>Back</p>
        <input id="jamNameInput" placeholder="Jam Name" type="text" maxLength="30" spellCheck="false"></input>
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
      this.state.newAlert("jamNameInput", "Jam Name", `No jam name specified, using ${jamNameInput} as filler.`, 15, "warning", () => {
        console.log("bap");
      })
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
  /*
  componentDidMount() {
    setTimeout(() => {
      this.appCallbacks.mainAlertBoard.newAlert("test", "Test", "Wow alert very is cool nice", "info", () => {
        console.log("le callback");
      })
    },5000)
  }*/
  render() {
    var curMenu;

    const callbackMethods = {
      events: this.handleEvent,
      dataMod: this.appendStateData,
      dataCol: this.collectStateData,
      newAlert: this.newAlert
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
          <AlertBoard name="mainAlertBoard" callbacks={{registerCallback: this.registerCallback}} />
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
  newAlert(id, title, details, duration, type, callback) {
    this.appCallbacks.mainAlertBoard.newAlert(id, title, details, duration, type, callback);
  }
  registerCallback(componentId, callbackId, callback) {
    if (!this.appCallbacks[componentId]) this.appCallbacks[componentId] = {};
    this.appCallbacks[componentId][callbackId] = callback;
  }
}

export default App;
