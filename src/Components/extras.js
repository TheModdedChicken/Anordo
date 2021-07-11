import options from "../options.json";

function evalProp(prop1, prop2, gate) {
  if (typeof prop2 == "string") {
    if (prop1 === prop2) return true;
    return false;
  } else if (typeof prop2 == "object") {
    var falseComNum = 0;
    for (var i = 0; i < prop2.length; i++) {
      if (gate === "and") {
        if (prop1 !== prop2[i]) falseComNum++;
      } else if (gate === "or") {
        if (prop1 !== prop2[i]) return false;
      }
    }

    if (falseComNum === prop2.length) return false;

    return true;
  }
}

function getServerAddress() { 
  var serverAddress = options.defaultServerAddress;
  if (localStorage.serverAddress) serverAddress = localStorage.serverAddress;

  if (serverAddress.endsWith("/") === false) serverAddress += "/";

  return serverAddress;
}

function getServerHost() { 
  var serverAddress = options.defaultServerAddress;
  if (localStorage.serverAddress) serverAddress = localStorage.serverAddress;

  if (serverAddress.includes("https://")) serverAddress = serverAddress.replace("https://", "");
  if (serverAddress.includes("http://")) serverAddress = serverAddress.replace("http://", "");

  if (serverAddress.includes("/")) serverAddress = serverAddress.split("/")[0];

  var serverHost = serverAddress.replace(/(:[0-9]+)/g, "");

  return serverHost;
}

function getServerPort() { 
  var serverAddress = options.defaultServerAddress;
  if (localStorage.serverAddress) serverAddress = localStorage.serverAddress;

  if (serverAddress.includes("https://")) serverAddress = serverAddress.replace("https://", "");
  if (serverAddress.includes("http://")) serverAddress = serverAddress.replace("http://", "");

  var serverPort = serverAddress.split(":")[1];

  return serverPort;
}

export { getServerAddress, getServerHost, getServerPort, evalProp }