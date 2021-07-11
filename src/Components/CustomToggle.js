import React from 'react';

import '../App.css';

class CustomToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      id: props.name.split(" ").join(""),
      switchId: props.name.split(" ").join("") + "-switch",
      capId: props.name.split(" ").join("") + "-cap",
      onChange: props.onChange
    }
    this.toggled = false;
  }
  render() {
    return (
      <div>
        <div className="toggleSwitch" id={this.state.switchId} onClick={() => {
          this.updateToggle(this.state.id, this.toggled);
          if (this.toggled === true) this.toggled = false;
          else this.toggled = true;

          if (this.state.onChange) this.state.onChange(this.toggled);
        }}>
          <div className="toggleSwitchCap" id={this.state.capId}></div>
        </div>
        <h6 className="customOption">{this.state.name}</h6>
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