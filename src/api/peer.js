import Peer from 'peerjs';
import { getServerHost, getServerPort } from '../Components/extras';

class PeerCanvas {
  /**
   * 
   * @param {String} id ID of peer
   * @param {HTMLCanvasElement} canvas 
   */
  constructor(id, canvas) {
    this.id = id;
    this.canvas = canvas;
  }
}

class PeerConnection {
  /**
   * 
   * @param {Peer.DataConnection} connection
   */
  constructor(connection) {
    this.id = connection.peer;
    this.conn = connection;
  }
}

class ClientConnection {
  /**
   * @param {Function} dataEvent Data event callback
   * @param {Function} connectionEvent Connection event callback
   */
  constructor(dataEvent) {
    this.peer = new Peer({
      host: getServerHost(),
      port: getServerPort(),
      path: '/peer'
    })

    console.log(JSON.parse(localStorage.getItem("latestJam")));
    /**
     * @type {String}
     */
    this.clientType = JSON.parse(localStorage.getItem("latestJam")).clientType;
    /**
     * @type {String}
     */
    this.authorization = JSON.parse(localStorage.getItem("latestJam")).authorization;
    /**
     * @type {{name: String, description: String, id: String, hostID: String, width: Number, height: Number, public: Boolean}}
     */
    this.jamInfo = JSON.parse(localStorage.getItem("latestJam")).jamInfo;
    /**
     * @type {{host: PeerConnection, peers: PeerConnection[]}}
     */
    this.clients = {
      peers: []
    };
    this.dataEvent = dataEvent;
    this.isHost = true;

    this.peer.on("open", (id) => {
      if (this.clientType === "peer") {
        this.isHost = false;
        var conn = this.peer.connect(this.jamInfo.hostID);
        this.clients.host = new PeerConnection(conn);
        conn.on("data", (data) => {
          this.dataEvent(data, conn);
        })
      }
      this.peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          this.dataEvent(data, conn);
        })
      })
    })

    this.sendData = this.sendData.bind(this);
    this.getConnection = this.getConnection.bind(this);
    this.addPeer = this.addPeer.bind(this);
    this.removePeer = this.removePeer.bind(this);
    this.changeHost = this.changeHost.bind(this);
  }
  /**
   * 
   * @param {"host"} client ID of client
   * @returns {Peer.DataConnection}
   */
  getConnection(client) {
    var conn;
    if (client === "host" && this.isHost === false) conn = this.clients.host.conn; 
    else if (this.clients.peers) conn = this.clients.peers.filter(p => p.id === client)[0].conn;
    return conn
  }
  /**
   * 
   * @param {"host"} client ID of recipient
   * @param {"console" | "ping" | "canvas"} type Type of cargo
   * @param {any} cargo 
   */
  sendData(client, type, cargo) {
    var conn;
    if (client === "host" && this.isHost === false) conn = this.clients.host.conn; 
    else if (this.clients.peers) conn = this.clients.peers.filter(p => p.id === client)[0].conn;
    
    if (conn.open !== false) conn.send({type: type, cargo: cargo});
    else conn.on("open", () => conn.send({type: type, cargo: cargo}))
  }
  /**
   * 
   * @param {Peer.DataConnection} conn 
   */
  addPeer(conn) {
    conn.on("data", (data) => {
      this.dataEvent(data);
    })
    this.clients.peers.push(new PeerConnection(conn));
  }
  /**
   * 
   * @param {String} id ID of peer
   */
  removePeer(id) {
    this.clients.peers = this.clients.peers.filter(p => p.id !== id);
  }
  /**
   * 
   * @param {Peer.DataConnection | "none"} conn 
   */
  changeHost(conn) {
    if (conn === "none") delete this.clients.host;
    else this.clients.host = new PeerConnection(conn.peer, conn);
    conn.on("data", (data) => {
      this.dataEvent(data);
    })
  }
}

export {ClientConnection, PeerCanvas, PeerConnection};