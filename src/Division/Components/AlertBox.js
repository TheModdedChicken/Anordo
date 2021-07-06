import React from 'react';

import '../css/Alerts.css';

class AlertBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.name,
      title: props.title,
      details: props.details,
      duration: props.duration,
      type: props.type,
      callback: props.callback,
      boardCallbacks: props.boardCallbacks
    }
  }
  componentDidMount() {
    var type = this.state.type;

    var typeColor = "#3E8BFF"
    if (type === "warning") typeColor = "#ffd23d"
    else if (type === "error") typeColor = "#ff3d3d";

    var alertBox = document.getElementById(this.state.id + "-alertBox");
    if (this.state.callback) alertBox.addEventListener('click', this.state.callback);

    var alertTimeBar = document.getElementById(this.state.id + "-alertTimeBar");
    alertTimeBar.style.background = typeColor;

    var duration = this.state.duration
    var timeBarStep = 300 / duration;
    var timeBarWidth = 300;

    /* 
      Yes I know what for loops are, I just can't use them in this case because of the "setTimeout" function.
      If anyone has a better solution I'm all ears.
    */
    var i = 0;
    function leLoop() {
      setTimeout(function() {
        timeBarWidth = 300 - (timeBarStep * i);
        alertTimeBar.style.width = timeBarWidth + "px";

        i++;
        if (i <= duration) leLoop();
      }, 1000)
    }
    leLoop();

    setTimeout(() => {
      this.state.boardCallbacks.dismissAlert(this.state.id);
    },`${this.state.duration + 1}300`)
  }
  render() {
    return(
      <div className="alertBox" id={this.state.id + "-alertBox"}>
        <h3 className="alertTitle" id={this.state.id + "-alertTitle"}>{this.state.title}</h3>
        <p className="alertDetails" id={this.state.id + "-alertDetails"}>{this.state.details}</p>
        <div className="alertTimeBar" id={this.state.id + "-alertTimeBar"}></div>
      </div>
    )
  }
}

export default AlertBox