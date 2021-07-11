import React, { createRef } from 'react';

import '../App.css';

class CustomInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name,
      id: props.name.split(" ").join(""),
      placeholder: props.placeholder,
      value: props.value,
      onChange: props.onChange,
    }   
  }
  componentDidMount() {
    var input = document.getElementById(this.props.id + "-input");

    if (this.state.placeholder) input.placeholder = this.state.placeholder;
    if (this.state.value) input.value = this.state.value;

    input.addEventListener("change", () => {
      this.state.onChange(input.value);
    })
  }
  render() {
    return (
      <div className="customOptionContainer">
        <h6 className="customOptionText">{this.state.name}</h6>
        <input className="customInput" id={this.props.id + "-input"} autoComplete="off">
        
        </input>
      </div>
    )
  }
}

export default CustomInput;