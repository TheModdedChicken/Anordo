import React from 'react';
import ReactDOM from 'react-dom';
import AlertBox from './AlertBox';

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
    this.dismissAlert = this.dismissAlert.bind(this);
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
    var alert = <AlertBox name={id} title={title} details={details} duration={duration} type={type} callback={callback} boardCallbacks={{dismissAlert: this.dismissAlert}} />;

    var alertBoard = document.getElementById(this.state.id + "-alertBoard");
    var alertContainer = document.createElement("div");
    alertContainer.id = id + "-alertContainer";
    alertBoard.appendChild(alertContainer);

    ReactDOM.render(alert, document.getElementById(id + "-alertContainer"))
  }
  dismissAlert(id) {
    ReactDOM.unmountComponentAtNode(document.getElementById(id + "-alertContainer"))
  }
}

export default AlertBoard