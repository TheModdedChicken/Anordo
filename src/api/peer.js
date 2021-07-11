import Peer from 'peerjs';
import { getServerHost, getServerPort } from '../Components/extras';

class ClientConnection {
  /**
   * 
   */
  constructor() {
    this.peer = new Peer({
      host: getServerHost(),
      port: getServerPort(),
      path: '/peer'
    })

    this.authorization = JSON.parse(localStorage.getItem("latestJam")).authorization;
    this.jamInfo = JSON.parse(localStorage.getItem("latestJam")).jamInfo;
    this.clients = {};

    this.peer.on("open", () => {
      if (this.jamInfo.hostID) {
        this.clients.host = this.peer.connect(this.jamInfo.hostID);
      };
    })
  }
  /**
   * @param {"host"} recipient Recipient of data
   * @param {any} data Data to send
   */
  sendData(recipient, data) {
    if (recipient === "host" && this.jamInfo.hostID) this.clients.host.send(data);
  }
}

export default ClientConnection;