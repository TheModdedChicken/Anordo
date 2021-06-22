import React from 'react';
import './App.css';

import JamCanvas from './Components/JamCanvas';
import CustomToggle from './Components/CustomToggle';

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

    if (jamNameInput === null) jamNameInput = "Jam-" + currentDate.getMilliseconds();
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
