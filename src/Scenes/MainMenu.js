import React from 'react';
import '../Styles/MainMenu.css';

import CustomToggle from '../Components/CustomToggle';

import { Menu, MenuController } from '../Division';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callEvent: props.callbacks.callEvent,
      setAppState: props.callbacks.setAppState,
      newAlert: props.callbacks.newAlert,
    }
  }
  componentDidMount() {
    this.menuController = new MenuController("mainMenuController", 
      new Menu("mainMenuPanel").linkMenus({
        createJamMenuPanel: "sub",
        settingsMenuPanel: "sub"
      })
    ).addTransitions({
      toParentMenu: "middle_to_right_fadeOut 0.2s forwards",
      toSubMenu: "middle_to_left_fadeOut 0.2s forwards",
      fromParentMenu: "right_to_middle_fadeIn 0.3s forwards",
      fromSubMenu: "left_to_middle_fadeIn 0.3s forwards"
    });

    new Menu("createJamMenuPanel", this.menuController).linkMenu("parent", "mainMenuPanel");
    new Menu("settingsMenuPanel_appearance", this.menuController).linkMenu('parent', "settingsMenuPanel");
    new Menu("settingsMenuPanel", this.menuController).linkMenus({
      mainMenuPanel: "parent",
      settingsMenuPanel_appearance: "sub"
    });
  }
  render() {
    return (
      <div className="mainMenu">
        {/* Main Menu */}
        <div className="menuPanel" id="mainMenuPanel">
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("createJamMenuPanel")}>
            Create Jam
          </button>
          <button className="menuButton" onClick={() => {
            this.state.newAlert("joinJamButtonPress", "Join Jam", `Multiplayer jams are not implemented yet!`, 5, "info")
          }}>
            Join Jam
          </button>
          <button className="menuButton" onClick={() => this.state.newAlert("settingsButtonPress", "Settings", `The settings menu is not implemented yet!`, 5, "info")}>
            Settings
          </button>
        </div>
        {/* Jam Menus */}
        <div className="subMenuPanel" id="createJamMenuPanel">
          <p className="menuBackText" onClick={() => this.menuController.gotoMenu("mainMenuPanel")}>Back</p>
          <input id="jamNameInput" placeholder="Jam Name" type="text" maxLength="30" spellCheck="false" autoComplete="off"></input>
          <CustomToggle name="Limited Color Pallet"/>
          <CustomToggle name="Tiled"/>
          <CustomToggle name="Free Draw"/>
          <CustomToggle name="PaT"/>
          <h6 id="jamMenuJamCode">Code: LMAOXD</h6>
          <button className="openJamButton" onClick={() => this.openJam()}>Open Jam</button>
        </div>
        {/* Settings Menus */}
        <div className="subMenuPanel" id="settingsMenuPanel">
          <p className="menuBackText" onClick={() => this.menuController.gotoMenu("mainMenuPanel")}>Back</p>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_appearance")}>Appearance</button>
        </div>
        <div className="subMenuPanel" id="settingsMenuPanel_appearance">
          <p className="menuBackText" onClick={() => this.menuController.gotoMenu("settingsMenuPanel")}>Back</p>
          <button className="menuButton">Font</button>
        </div>
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

export default MainMenu