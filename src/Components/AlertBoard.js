import React from 'react';

import '../App.css';

class AlertBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.name,
      width: props.width,
      height: props.height,
      registerCallback: props.callbacks.registerCallback
    }
    this.newAlert = this.newAlert.bind(this);
    this.editAlert = this.editAlert.bind(this);
    this.stepAlert = this.stepAlert.bind(this);
    this.alerts = {};
  }
  componentDidMount() {
    if (this.state.id.indexOf(" ") !== -1) return console.log("AlertBoard cannot have any spaces in its 'name' property");

    this.state.registerCallback(this.state.id, "newAlert", this.newAlert);
  }
  render() {
    return (
      <div className="alertBoard" id={this.state.id + "-alertBoard"}></div>
    )
  }
  newAlert(id, title, details, duration, type, callback) {
    var alertBoard = document.getElementById(this.state.id + "-alertBoard");

    var typeColor = "#3E8BFF"
    if (type === "warning") typeColor = "#ffd23d"
    else if (type === "error") typeColor = "#ff3d3d";

    var alertBox = document.createElement("div");
    alertBox.className = "alertBox";
    alertBox.id = this.state.id + "-alertBox";

    var alertTimeBar = document.createElement("div");
    alertTimeBar.className = "alertTimeBar";
    alertTimeBar.id = this.state.id + "-alertTimeBar"
    alertTimeBar.style.background = typeColor;

    var alertTitle = document.createElement("h3");
    alertTitle.className = "alertTitle";
    alertTitle.id = this.state.id + "-alertTitle";
    alertTitle.textContent = title;

    var alertDetails = document.createElement("p");
    alertDetails.className = "alertDetails";
    alertDetails.id = this.state.id + "-alertDetails";
    alertDetails.textContent = details;

    alertBox.append(alertTitle, alertDetails, alertTimeBar);
    alertBoard.appendChild(alertBox);

    alertBox.addEventListener('click', callback);

    this.alerts[id] = {
      elements: {
        box: alertBox.id,
        title: alertTitle.id,
        details: alertDetails.id,
        timeBar: alertTimeBar.id
      },
      duration: duration,
      body: {
        title: title,
        details: details
      },
      type: type,
      callback: callback
    };

    this.stepAlert(id);
  }
  editAlert(id, newDetails, newType, callback) {

  }
  stepAlert (id) {
    var timeBar = document.getElementById(this.alerts[id].elements.timeBar);
    var duration = this.alerts[id].duration
    var timeBarStep = 300 / duration;
    var timeBarWidth = 300;

    var i = 0;
    function leLoop() {
      setTimeout(function() {
        timeBarWidth = 300 - (timeBarStep * i);
        timeBar.style.width = timeBarWidth + "px";

        i++;
        if (i <= duration) leLoop();
      }, 1000)
    }
    leLoop();

    setTimeout(() => {
      var box = document.getElementById(this.alerts[id].elements.box);
      box.parentNode.removeChild(box);
      delete this.alerts[id]
    },`${this.alerts[id].duration + 1}300`)
  }
}

export default AlertBoard