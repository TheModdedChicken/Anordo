import React, { createRef } from 'react';

import '../App.css';

class CustomDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name,
      id: props.id,
      options: props.options,
      selection: props.selection,
      onChange: props.onChange,
    }
  }
  componentDidMount() {
    var select = document.getElementById(this.props.id + "-select");

    for (const option of this.state.options) {
      if (option !== null && option !== "") {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.textContent = option;

        select.appendChild(newOption);
      }
    }

    if (this.state.selection) select.value = this.state.selection;

    select.addEventListener("change", () => {
      this.state.selection = select.value;
      if (this.state.onChange) this.state.onChange(select.value);
    })
  }
  render() {
    return (
      <div className="customOptionContainer">
        <h6 className="customOptionText">{this.state.name}</h6>
        <select className="customSelect" id={this.props.id + "-select"}>
        
        </select>
      </div>
    )
  }
}

export default CustomDropdown;