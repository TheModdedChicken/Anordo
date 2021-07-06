import React from 'react';
import '../Styles/MainMenu.css';

import CustomToggle from '../Components/CustomToggle';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callEvent: props.callbacks.callEvent,
      setAppState: props.callbacks.setAppState,
      newAlert: props.callbacks.newAlert,
    }
    this.currentMenu = "mainMenuPanel";
    this.menuDepths = {
      mainMenuPanel: 0,
      createJamMenuPanel: 1
    }
  }
  render() {
    return (
      <div className="mainMenu">
        <div className="menuPanel" id="mainMenuPanel">
          <button className="mainMenuButton" onClick={() => this.changeMenu("createJamMenuPanel", "mainMenuPanel")}>
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
        <div className="menuPanel" id="createJamMenuPanel">
          <p id="mainMenuBack" onClick={() => this.changeMenu("mainMenuPanel", "createJamMenuPanel")}>Back</p>
          <input id="jamNameInput" placeholder="Jam Name" type="text" maxLength="30" spellCheck="false" autoComplete="off"></input>
          <CustomToggle name="Limited Color Pallet"/>
          <CustomToggle name="Tiled"/>
          <CustomToggle name="Free Draw"/>
          <CustomToggle name="PaT"/>
          <h6 id="jamMenuJamCode">Code: LMAOXD</h6>
          <button className="openJamButton" onClick={() => this.openJam()}>Open Jam</button>
        </div>
      </div>
    )
  }
  /**
   * 
   * @param {String} menu Menu ID
   */
  changeMenu(toMenu, fromMenu) {
    console.log("test4");
    if (this.menuDepths[toMenu] < this.menuDepths[fromMenu]) {
      console.log("test");
      var toMenuElement = document.getElementById(toMenu);
      var fromMenuElement = document.getElementById(fromMenu);

      toMenuElement.style.animation = "left_to_middle_fadeIn 0.3s forwards";
      fromMenuElement.style.animation = "middle_to_right_fadeOut 0.2s forwards";
    } else if (this.menuDepths[toMenu] > this.menuDepths[fromMenu]) {
      console.log("test2");
      var toMenuElement = document.getElementById(toMenu);
      var fromMenuElement = document.getElementById(fromMenu);

      toMenuElement.style.animation = "right_to_middle_fadeIn 0.3s forwards";
      fromMenuElement.style.animation = "middle_to_left_fadeOut 0.2s forwards";
    }
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

export default MainMenu