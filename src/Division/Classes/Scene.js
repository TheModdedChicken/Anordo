import React from "react";
import SceneManager from "./SceneManager";

class Scene {
  /**
   * 
   * @param {String} name Name of the scene
   * @param {String} id ID of scene
   * @param {JSX.Element} jsx JSX Element
   * @param {SceneManager} sceneManager SceneManager to add Scene to _(Optional)_
   */
  constructor(name, id, jsx, sceneManager = null) {
    this.name = name;
    this.id = id;
    this.jsx = jsx? jsx : <div></div>;
    this.divisionType = "scene";
    if (sceneManager) sceneManager.addScene(this);
  }
}

export default Scene