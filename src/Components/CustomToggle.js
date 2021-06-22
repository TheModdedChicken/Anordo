import React from 'react';

import '../App.css';

class CustomToggle extends React.Component {
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

export default CustomToggle