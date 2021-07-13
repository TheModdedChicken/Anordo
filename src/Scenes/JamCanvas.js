import React, { createRef } from 'react';
import Peer from 'peerjs';
import ColorPicker from '../Components/ColorPicker';

import { AnimationController } from '../Division';
import { ClientConnection, PeerCanvas, PeerConnection } from '../api/peer';

import '../App.css';
import { editJam } from '../api/rest';

class JamCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callEvent: props.callbacks.callEvent,
      setAppState: props.callbacks.setAppState,
      getAppState: props.callbacks.getAppState,
      authorization: props.auth,
      penColor: "rgba(0,0,0,255)",
      penWidth: 6,
      colorPickerOpen: false
    }
    this.canvasRef = createRef(null);
    this.setProp = this.setProp.bind(this);
    this.dataEvent = this.dataEvent.bind(this);

    if (localStorage.offlineMode === false) this.cc = new ClientConnection(this.dataEvent);
    /**
     * @type {PeerCanvas[]}
     */
    this.canvs = [];

    this.mouseDown = false;
  }
  componentDidMount() {
    if (localStorage.offlineMode === false) {
      this.cc.peer.on("open", (id) => {
        if (this.cc.isHost === true) editJam(`${this.cc.jamInfo.id} ${this.cc.authorization}`, {hostID: id});
        else {
          this.newClient(this.cc.jamInfo.hostID);
          this.cc.sendData("host", "ping", {peerID: id, proto: "connecting"});
        };
      })
    }

    var peerCanvas = document.getElementById("peerCanv");
    var pctx = peerCanvas.getContext("2d");

    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext("2d");
    canvas.style.touchAction = "none";

    // Vars
    var canvWidth = document.body.offsetWidth;
    var canvHeight = document.body.offsetHeight;

    var colorPickerAC = new AnimationController("colorPickerMenu-AC", "colorPickerMenu", "hidden");

    colorPickerAC.closeOnBlur = true;
    colorPickerAC.addAnimation("hide", "closeColorPicker 0.1s forwards", () => {
      this.setState({colorPickerOpen: false});
    });
    colorPickerAC.addAnimation("show", "openColorPicker 0.1s forwards", () => {
      this.setState({colorPickerOpen: true});
    }).addTouchElement("show", "mainColorBox");

    sizeCanvas();
    window.addEventListener("resize", (event) => sizeCanvas());

    function sizeCanvas () {
      var saved_rect = ctx.getImageData(0, 0, canvWidth, canvHeight);
      canvas.height = document.body.offsetHeight;
      canvas.width = document.body.offsetWidth;
      ctx.putImageData(saved_rect, 0, 0);

      var saved_rect2 = pctx.getImageData(0, 0, canvWidth, canvHeight);
      peerCanvas.width = document.body.offsetHeight;
      peerCanvas.height = document.body.offsetWidth;
      pctx.putImageData(saved_rect2, 0, 0);

      canvWidth = document.body.offsetWidth;
		  canvHeight = document.body.offsetHeight;
    }

    // Events
    document.body.onmousedown = e => { if (e.button === 1) return false }
    document.body.onmouseup = e => { if (e.button === 1) return false }
    canvas.addEventListener('pointerdown', (event) => this.handleDown(event));
    canvas.addEventListener('pointerup', (event) => this.exitDown(event));
    canvas.addEventListener('pointermove', (event) => this.draw(event));
    canvas.addEventListener('pointerout', (event) => this.exitDown(event));
    canvas.addEventListener('mousedown', (event) => this.handleDown(event));
    canvas.addEventListener('mouseup', (event) => this.exitDown(event));
    canvas.addEventListener('mousemove', (event) => this.draw(event));
    canvas.addEventListener('mouseout', (event) => this.exitDown(event));
  }
  render() {
    var jamName = this.state.getAppState("curJamName");
    var jamID = "canvas-" + jamName;

    return (
      <div id="jamContainer">
        <div id="jamSideBar">
          <div className="colorBox" id="mainColorBox">

          </div>
        </div>
        <ColorPicker key="lePicker3000" name="lePicker" callbacks={{updateDrawingProp: this.setProp}} />
        <canvas className="jamCanv" id={jamID} ref={this.canvasRef}{...this.props}></canvas>
        <canvas className="peerCanv" id="peerCanv"></canvas>
      </div>
    )
  }
  getThisProp(property) {
    return this[property];
  }
  setProp(property, data) {
    this.setState({[property]: data});

    if (property === "penColor") {
      var mainColorBox = document.getElementById('mainColorBox');

      mainColorBox.style.background = this.state.penColor;
    }
  }
  getStateProp(property) {
    return this.state[property];
  }
  /**
   * 
   * @param {{type: "console" | "ping" | "canvas", cargo: any}} data 
   * @param {Peer.DataConnection} conn
   */
  dataEvent(data, conn) {
    const protocols = {
      console: (cargo) => console.log(cargo),

      /**
       * @param {Peer.DataConnection} conn 
       */
      ping: (cargo, conn) => {
        if (cargo.proto === "connecting") {
          console.log(cargo)
          this.newClient(conn.peer);
          this.cc.addPeer(conn);
        }
        else if (cargo.proto === "pong") console.log(cargo);
      },

      canvas: (cargo) => {
        console.log(cargo)
        if (cargo.proto === "drawing") {
          this.updateCanvas(cargo.peerID, new ImageData(JSON.parse( cargo.imageData.data, stdlib.reviveTypedArray), cargo.imageData.width, cargo.imageData.height))
        }
      }
    }

    console.log("test1")
    if (protocols[data.type]) protocols[data.type](data.cargo, conn);
  }
  /**
   * 
   * @param {String} id ID of peer
   */
  newClient(id) {
    var newCanv = document.createElement("canvas");
    newCanv.width = this.cc.jamInfo.width;
    newCanv.height = this.cc.jamInfo.height;
    newCanv.id = `client-${id}-canvas`;

    this.canvs.push(new PeerCanvas(id, newCanv));
  }
  /**
   * 
   * @param {String} id ID of peer
   * @param {ImageData} data
   */
  updateCanvas(id, data) {
    console.log("tes")
    const index = this.canvs.findIndex(p => p.id === id);
    this.canvs[index].canvas.getContext("2d").putImageData(data, 0, 0);
    this.combineCanvs();
  }
  combineCanvs() {
    var peerCanvas = document.getElementById("peerCanv");
    var ctx = peerCanvas.getContext("2d");

    for (const peerCanv of this.canvs) {
      const imageData = peerCanv.canvas.getContext("2d").getImageData(0, 0, this.cc.jamInfo.width, this.cc.jamInfo.height);
      ctx.putImageData(imageData, 0, 0);
    }
  }
  /**
   * 
   * @param {String} id ID of peer
   */
  removeClient(id) {
    this.canvs = this.canvs.filter(p => p.id !== id);
    this.cc.removePeer(id);
  }
  /**
   * 
   * @param {ImageData} imageData 
   */
  sendImageData(imageData) {
    if (this.cc.clients.host) this.cc.sendData("host", "canvas", {peerID: this.cc.peer.id, proto: "drawing", imageData: {data: JSON.stringify(stdlib.typedarray2json(imageData.data)), width: imageData.width, height: imageData.height}});
    if (this.cc.clients.peers) {
      for (const peer of this.cc.clients.peers) {
        this.cc.sendData(peer.id, "canvas", {peerID: this.cc.peer.id, proto: "drawing", imageData: {data: JSON.stringify(stdlib.typedarray2json(imageData.data)), width: imageData.width, height: imageData.height}})
      }
    }
  }
  draw(event) {
    if (!this.mouseDown) return;

    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext("2d");
    
    ctx.lineWidth = this.state.penWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = this.state.penColor;

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    ctx

    if (localStorage.offlineMode === false) this.sendImageData(ctx.getImageData(0, 0, this.cc.jamInfo.width, this.cc.jamInfo.height), event.offsetX, event.offsetY)
  }
  handleDown(event) {
    if (event.button === 1) return false;
    this.mouseDown = true;
    this.draw(event);
    console.log(this.state.penColor);
  }

  exitDown(event) {
    if (event.button === 1) return false;
    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext("2d");

    this.mouseDown = false;
    ctx.beginPath();
  }
}

export default JamCanvas