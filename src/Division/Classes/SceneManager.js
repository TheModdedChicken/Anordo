import React from "react";
import { JSONIsEmpty } from "../utilities";
import Scene from "./Scene";

import '../css/Scenes.css';

class SceneManager {
  /**
   * 
   * @param {String} id 
   */
  constructor(id) {
    this.id = id;
    this.callbacks = {};
    this.scenes = {};
    this.currentScene = "";

    this.addScene = this.addScene.bind(this);
    this.addScenes = this.addScenes.bind(this);
    this.removeScene = this.removeScene.bind(this);
    this.setScene = this.setScene.bind(this);
    this.render = this.render.bind(this);
  }
  /**
   * @param {Scene} scene 
   * @returns {SceneManager}
   */
  addScene(scene) {
    if (!scene.divisionType) return console.error(`The scene you tried to append to SceneManager "${this.id}" was not of class Scene`);
    this.scenes[scene.id] = scene;

    return this;
  }
  /**
   * 
   * @param {Scene[]} scene 
   * @returns {SceneManager}
   */
  addScenes(scene) {
    if (typeof scene === "object") {
      for (var i = 0; i < scene.length; i++) {
        if (!scene[i].divisionType) return console.error(`The scene you tried to append to SceneManager "${this.id}" was not of type Scene`);
        this.scenes[scene[i].id] = scene[i];
      }
    }

    return this;
  }
  /**
   * @param {String} id ID of the Scene
   * @returns {SceneManager}
   */
  removeScene(id) {
    delete this.scenes[id]
    return this;
  }
  /**
   * @param {String} id ID of the Scene
   * @returns {SceneManager}
   */
  setScene(id) {
    this.currentScene = id;
    return this;
  }
  render() {
    return (
      <div className="SceneRenderer" id={this.id + "-SceneRenderer"}>
        {this.scenes[this.currentScene].jsx}
      </div>
    );
  }
}

export default SceneManager