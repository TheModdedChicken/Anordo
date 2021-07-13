import React from 'react';
import '../Styles/MainMenu.css';
import options from "../options.json";

import { appendArgsToJSON, Menu, MenuController } from '../Division';
import CustomDropdown from '../Components/CustomDropdown';
import CustomInput from '../Components/CustomInput';
import CustomToggle from '../Components/CustomToggle';

import { createJam, editJam, getJam, listJams } from '../api/rest';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callEvent: props.callbacks.callEvent,
      setAppState: props.callbacks.setAppState,
      newAlert: props.callbacks.newAlert,
    }

    this.jamData;
    this.changeFont = this.changeFont.bind(this);
    this.joinJam = this.joinJam.bind(this);
  }
  componentDidMount() {
    this.menuController = new MenuController("mainMenuController", 
      new Menu("mainMenuPanel").linkMenus({
        createJamMenuPanel: "sub",
        joinJamMenuPanel: "sub",
        settingsMenuPanel: "sub",
      })
    ).addTransitions({
      toParentMenu: {
        animation: "middle_to_right_fadeOut 0.2s forwards",
      },
      toSubMenu: {
        animation: "middle_to_left_fadeOut 0.2s forwards",
      },
      fromParentMenu: {
        animation: "right_to_middle_fadeIn 0.3s forwards",
      },
      fromSubMenu: {
        animation: "left_to_middle_fadeIn 0.3s forwards",
      }
    });

    new Menu("createJamMenuPanel", this.menuController).linkMenu("parent", "mainMenuPanel");
    new Menu("joinJamMenuPanel", this.menuController).linkMenu("parent", "mainMenuPanel").transitions = {
      fromParentMenu: {
        animation: "right_to_middle_fadeIn 0.3s forwards",
        callback: async () => {
          var publicJamList = document.getElementById('publicJamList');
          while (publicJamList.firstChild) {
            publicJamList.removeChild(publicJamList.firstChild);
          }

          var jamlist = await listJams();

          if (jamlist.length <= 0) {
            var jamInfoBox = document.createElement("div");
            jamInfoBox.className = "jamListMessageBox";

            var jamInfoBoxTitle = document.createElement("h1");
            jamInfoBoxTitle.textContent = "¯\\_(ツ)_/¯";
  
            var jamInfoBoxDescription = document.createElement("h2");
            jamInfoBoxDescription.textContent = "Nothing Here...";
  
            jamInfoBox.append(jamInfoBoxTitle, jamInfoBoxDescription);
            publicJamList.appendChild(jamInfoBox);

            if (jamlist === false) {
              this.state.newAlert(
                "connectionIssue-joinJam", 
                "Join Jam", 
                "Anordo is having issues getting jam information from the server. Please check your internet connection and try again.", 
                10, 
                "error"
              );
              return;
            }
          }
  
          for (const jam of jamlist) {
            var jamInfoBox = document.createElement("div");
            jamInfoBox.className = "jamInfoBox";
            jamInfoBox.addEventListener('click', () => {
              this.joinJam(jam.id);
            })
  
            var jamInfoBoxTitle = document.createElement("h1");
            jamInfoBoxTitle.textContent = jam.name;
  
            var jamInfoBoxDescription = document.createElement("h2");
            jamInfoBoxDescription.textContent = jam.description;
  
            jamInfoBox.append(jamInfoBoxTitle, jamInfoBoxDescription);
            publicJamList.appendChild(jamInfoBox);
          }
        }
      },
    };

    // Settings Menus
    new Menu("settingsMenuPanel_preferences", this.menuController).linkMenu('parent', "settingsMenuPanel");
    new Menu("settingsMenuPanel_advanced_data", this.menuController).linkMenu('parent', "settingsMenuPanel_advanced");
    new Menu("settingsMenuPanel_advanced_connections", this.menuController).linkMenu('parent', "settingsMenuPanel_advanced");
    new Menu("settingsMenuPanel_advanced", this.menuController).linkMenus({
      settingsMenuPanel_advanced_data: "sub",
      settingsMenuPanel_advanced_connections: "sub",
      settingsMenuPanel: "parent"
    });
    new Menu("settingsMenuPanel", this.menuController).linkMenus({
      mainMenuPanel: "parent",
      settingsMenuPanel_preferences: "sub",
      settingsMenuPanel_advanced: "sub"
    });
  }
  render() {
    return (
      <div className="mainMenu">
        {/* Main Menu */}
        <div className="menuPanel" id="mainMenuPanel">
          <button className="menuButton" onClick={async () => {
            var jamMenuJamCode = document.getElementById("jamMenuJamCode");
            if (localStorage.offlineMode === false) {
              const serverRes = await createJam();
              if (serverRes === false) {
                this.state.newAlert(
                  "connectionIssue-createJam", 
                  "Create Jam", 
                  "Anordo is having issues sending jam information to the server. Please check your internet connection and try again.", 
                  10, 
                  "error"
                );
                return;
              };
              this.jamData = serverRes;
              jamMenuJamCode.textContent = `ID: ${this.jamData.jamID}`;
            } else {
              jamMenuJamCode.textContent = `ID: Offline`;
            }
            this.menuController.gotoMenu("createJamMenuPanel");
          }}>
            Create Jam
          </button>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("joinJamMenuPanel")}>
            Join Jam
          </button>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel")}>
            Settings
          </button>
        </div>

        {/* Jam Menus */}
        <div className="subMenuPanel" id="createJamMenuPanel">
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("mainMenuPanel")}></button>
            <div className="menuTitle">Create Jam</div>
          </div>
          <input id="jamNameInput" placeholder="Jam Name" type="text" maxLength="30" spellCheck="false" autoComplete="off"></input>
          <div className="jamSetup-sizeInput">
            <h6>Width</h6>
            <input id="jamSetup-widthInput" placeholder="500" type="text" maxLength="5" spellCheck="false" autoComplete="off"></input>
            <input id="jamSetup-heightInput" placeholder="500" type="text" maxLength="5" spellCheck="false" autoComplete="off"></input>
            <h6>Height</h6>
          </div>
          <CustomToggle name="Public" onChange={(state) => editJam(`${this.jamData.jamID} ${this.jamData.hostKey}`, {public: state})}></CustomToggle>
          <h6 id="jamMenuJamCode">ID: LMAOXD</h6>
          <button className="openJamButton" onClick={() => this.openJam()}>Open Jam</button>
        </div>

        <div className="subMenuPanel" id="joinJamMenuPanel">
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("mainMenuPanel")}></button>
            <div className="menuTitle">Jams</div>
          </div>
          <nav className="customListContainer">
            <ul id="publicJamList">
              
            </ul>
          </nav>
        </div>

        {/* Settings Menus */}
        <div className="subMenuPanel" id="settingsMenuPanel">
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("mainMenuPanel")}></button>
            <div className="menuTitle">Settings</div>
          </div>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_preferences")}>Preferences</button>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_advanced")}>Advanced</button>
        </div>

        <div className="subMenuPanel" id="settingsMenuPanel_preferences">
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel")}></button>
            <div className="menuTitle">Preferences</div>
          </div>
          <CustomDropdown name="Font" id="settings_font" options={["Roboto", "Inter"]} selection={localStorage.appFont ? localStorage.appFont : "Roboto"} onChange={this.changeFont}></CustomDropdown>
        </div>

        <div className="subMenuPanel" id="settingsMenuPanel_advanced">
          <p className="advancedSettingsWarningText" >Note: These are advanced settings.<br></br> Unless you know what you're doing, you should turn back</p>
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel")}></button>
            <div className="menuTitle">Advanced</div>
          </div>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_advanced_connections")}>Connections</button>
          <button className="menuButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_advanced_data")}>Data</button>
        </div>

        <div className="subMenuPanel" id="settingsMenuPanel_advanced_connections">
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_advanced")}></button>
            <div className="menuTitle">Connections</div>
          </div>
          <CustomToggle name="Offline" onChange={(state) => localStorage.offlineMode = state}></CustomToggle>
          <CustomInput name="Server" placeholder="https://example.com" value={localStorage.serverAddress ? localStorage.serverAddress : options.defaultServerAddress} onChange={(address) => {
            localStorage.setItem("serverAddress", address);
          }}></CustomInput>
          <CustomDropdown name="Jam Host Location" id="settings_jamHost" options={["Server"]} selection="Server"></CustomDropdown>
        </div>

        <div className="subMenuPanel" id="settingsMenuPanel_advanced_data">
          <div className="menuHeaderPanel">
            <button className="menuBackButton" onClick={() => this.menuController.gotoMenu("settingsMenuPanel_advanced")}></button>
            <div className="menuTitle">Data</div>
          </div>
          <button className="optionButton" onClick={() => {
            this.state.newAlert("deleteLocalData", "Delete Local Data", "Are you sure? Click this notification to remove all local data.", 10, "warning", () => {
              deleteLocalData();
              location.reload();
            })
          }}>Delete Local Data</button>
        </div>
      </div>
    )
  }
  async openJam() {
    var jamNameInput = document.getElementById("jamNameInput").value;
    var width = document.getElementById("jamSetup-widthInput").value !== "" ? document.getElementById("jamSetup-widthInput").value : 500;
    var height = document.getElementById("jamSetup-heightInput").value !== "" ? document.getElementById("jamSetup-heightInput").value : 500;

    if (localStorage.offlineMode === false) {
      const editedJam = await editJam(`${this.jamData.jamID} ${this.jamData.hostKey}`, jamNameInput ? { name: jamNameInput, width: width, height: height } : { width: width, height: height });
      if (editedJam === false) {
        this.state.newAlert(
          "connectionIssue-openJam", 
          "Open Jam", 
          "Anordo is having issues connecting to the server. Please check your internet connection and try again.", 
          10, 
          "error"
        );
        return;
      };
  
      if (jamNameInput === "") this.state.newAlert("jamNameInput", "Jam Name", `No jam name specified, using ${editedJam.name} as filler.`, 15, "warning");
      this.state.setAppState("curJamName", editedJam.name);
  
      localStorage.setItem("latestJam", JSON.stringify({
        clientType: "host",
        authorization: this.jamData.hostKey,
        jamInfo: editedJam
      }))
    }

    this.state.callEvent("goto_jamCanvas");
  }
  async joinJam(jamID) {
    const serverRes = await getJam(jamID);
    if (serverRes === false) {
      this.state.newAlert(
        "connectionIssue-joinJam", 
        "Join Jam", 
        "Anordo is having issues getting jam information from the server. Please check your internet connection and try again.", 
        10, 
        "error"
      );
      return;
    };

    const authTest = JSON.parse(localStorage.getItem("latestJam")) ?
    await editJam(`${jamID} ${JSON.parse(localStorage.getItem("latestJam")).authorization}`) : false;

    console.log(authTest);
    if (authTest !== false) {
      localStorage.setItem("latestJam", JSON.stringify({
        clientType: "host",
        authorization: JSON.parse(localStorage.getItem("latestJam")).authorization,
        jamInfo: authTest
      }))
    } else {
      localStorage.setItem("latestJam", JSON.stringify({
        clientType: "peer",
        jamInfo: serverRes
      }))
    }

    this.state.callEvent("goto_jamCanvas");
  }
  changeFont(font) {
    document.documentElement.style.setProperty("--appFont", font);
    localStorage.setItem("appFont", font);
  }
}

export default MainMenu

function deleteLocalData() {
  const amountOfData = localStorage.length;
  var dataKeys = [];
  for (var i = 0; i < amountOfData; i++) {
    dataKeys.push(localStorage.key(i));
  }

  var jsonData = {};
  for (const key of dataKeys) {
    jsonData[key] = localStorage.getItem(key);
  }

  localStorage.clear();

  return jsonData;
}

