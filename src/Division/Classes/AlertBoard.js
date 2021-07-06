import React from 'react';
import ReactDOM from 'react-dom';
import AlertBox from '../Components/AlertBox';

import '../css/Alerts.css';

class AlertBoard {
  constructor(id = "newAlertBoard") {
    if (id.indexOf(" ") > -1) return console.log("AlertBoard cannot have any spaces in its id");
    this.id = id;
    this.newAlert = this.newAlert.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.alerts = {};

    this.newAlert = this.newAlert.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.render = this.render.bind(this);
  }
  /**
    * @param {String} id Alert reference id
    * @param {String} title Alert title
    * @param {String} details Alert details
    * @param {Number} duration Alert lifetime in seconds
    * @param {String} type Type of alert
    * @param {Function} callback Function to call on click _(optional)_
    */
  newAlert(id, title, details, duration, type, callback = null) {
    var alert = <AlertBox name={id} title={title} details={details} duration={duration} type={type} callback={callback} boardCallbacks={{dismissAlert: this.dismissAlert}} />;

    var alertBoard = document.getElementById(this.id + "-alertBoard");
    var alertContainer = document.createElement("div");
    alertContainer.id = id + "-alertContainer";
    alertBoard.appendChild(alertContainer);

    ReactDOM.render(alert, document.getElementById(id + "-alertContainer"))

    return this;
  }
  /**
   * 
   * @param {String} id 
   */
  dismissAlert(id) {
    ReactDOM.unmountComponentAtNode(document.getElementById(id + "-alertContainer"))
    return this;
  }
  render() {
    return (
      <div className="alertBoard" id={this.id + "-alertBoard"}></div>
    );
  }
}

export default AlertBoard