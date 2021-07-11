import { getServerAddress } from "../Components/extras";

async function createJam(body = {}) {
  console.log(getServerAddress() + "jam/create")
  const response = await fetch(getServerAddress() + "jam/create", {
    method: "post", 
    headers: { 
      "Content-Type": "application/json",
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

/**
 * 
 * @param {String} authorization 
 * @param {JSON} body 
 * @returns 
 */
async function editJam(authorization, body = {}) {
  const response = await fetch(getServerAddress() + "jam/edit", {
    method: "POST", 
    headers: { 
      "Content-Type": "application/json", 
      "authorization": authorization, 
    }, 
    body: JSON.stringify(body)
  })
  return response.json();
}

async function listJams() {
  const response = await fetch(getServerAddress() + "jam/list", {
    method: "GET",
  })
  return response.json();
}

/**
 * 
 * @param {String} jamID ID of jam
 * @returns 
 */
async function getJam(jamID) {
  const response = await fetch(getServerAddress() + "jam/get", {
    method: "GET",
    headers: {
      "authorization": jamID
    }
  })
  return response.json();
}

export { createJam, editJam, listJams, getJam }