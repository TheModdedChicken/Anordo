import { getServerAddress } from "../Components/extras";

async function createJam(body = {}) {
  try {
    console.log(getServerAddress() + "jam/create")
    const response = await fetch(getServerAddress() + "jam/create", {
      method: "post", 
      headers: { 
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });
  
    if (response.status !== 200) return false;
    return response.json();
  } catch {
    return false;
  }
}

/**
 * 
 * @param {String} authorization 
 * @param {JSON} body 
 * @returns 
 */
async function editJam(authorization, body = {}) {
  try {
    const response = await fetch(getServerAddress() + "jam/edit", {
      method: "POST", 
      headers: { 
        "Content-Type": "application/json", 
        "authorization": authorization, 
      }, 
      body: JSON.stringify(body)
    })
    if (response.status !== 200) return false;
    return response.json();
  } catch {
    return false;
  }
}

async function listJams() {
  try {
    const response = await fetch(getServerAddress() + "jam/list", {
      method: "GET",
    })
    if (response.status !== 200) return false;
    return response.json();
  } catch {
    return false;
  }
}

/**
 * 
 * @param {String} jamID ID of jam
 * @returns 
 */
async function getJam(jamID) {
  try {
    const response = await fetch(getServerAddress() + "jam/get", {
      method: "GET",
      headers: {
        "authorization": jamID
      }
    })
    if (response.status !== 200) return false;
    return response.json();
  } catch {
    return false;
  }
}

export { createJam, editJam, listJams, getJam }