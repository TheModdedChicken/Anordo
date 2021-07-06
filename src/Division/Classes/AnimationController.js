/**
 * 
 * @param {"full" | "top"} scanType 
 * @param {HTMLElement | JSX.Element} element
 * @returns {Array}
 */
function getArrayOfChildren(scanType, element) {
  var out = [];
  if (scanType == "full") {
    if (element.hasChildNodes() === false) return false;
    var children = element.childNodes;

    for (const child of children) {
      out.push(child.id);
      if (child.hasChildNodes() === true) {
        var childrenOfChild = getArrayOfChildren("full", child);

        for (const childOfChild of childrenOfChild) {
          out.push(childOfChild);
        }
      }
    }
  }
  return out;
}

class AnimationController {
  /**
   * 
   * @param {String} id 
   * @param {HTMLElement | JSX.Element | String} element HTML Element | JSX Element | Element ID
   * @param {"hidden" | "shown"} state
   */
  constructor(id, element, state = "hidden") {
    this.id = id;
    if (typeof element === "string") element = document.getElementById(element);
    this.element = element;
    this.touchElements = {
      children: [],
      hide: [],
      show: [],
    }

    this.openElements;
    this.state = state;
    this.closeOnBlur = false;
    this.animations = {
      hide: null,
      show: null
    }

    this.touchElements.children = getArrayOfChildren("full", element);

    this.addAnimation = this.addAnimation.bind(this);
    this.removeAnimation = this.removeAnimation.bind(this);
    this.addTouchElement = this.addTouchElement.bind(this);
    this.addTouchElements = this.addTouchElements.bind(this);

    document.addEventListener("mousedown", (event) => {
      if (this.touchElements.hide.includes(event.target.id) === true && this.state !== "hidden") {
        this.state = "hidden";

        if (this.animations.hide !== null) this.element.style.animation = this.animations.hide.animation;

        if (this.animations.hide.callback) this.animations.hide.callback();
      } else if (this.touchElements.show.includes(event.target.id) === true && this.state !== "shown") {
        this.state = "shown";

        if (this.animations.hide !== null) this.element.style.animation = this.animations.show.animation;

        if (this.animations.show.callback) this.animations.show.callback();
      } else if (this.touchElements.children.includes(event.target.id) === false && this.closeOnBlur === true && this.state !== "hidden") {
        this.state = "hidden";

        if (this.animations.hide !== null) this.element.style.animation = this.animations.hide.animation;

        if (this.animations.hide.callback) this.animations.hide.callback();
      }
    })
  }
  /**
   * 
   * @param {"hide" | "show"} type Type of animation
   * @param {String} animation CSS animation
   * @param {Function} callback Animation callback
   * @returns {AnimationController}
   */
  addAnimation(type, animation, callback = null) {
    this.animations[type] = {
      animation: animation,
      callback: callback
    }

    return this;
  }
  /**
   * 
   * @param {"hide" | "show"} type Type of animation
   * @returns {AnimationController}
   */
  removeAnimation(type) {
    this.animations[type] = null;
    return this;
  }
  /**
   * 
   * @param {"hide" | "show"} type Touch event type
   * @param {String} elementID ID of touch element
   * @returns {AnimationController}
   */
  addTouchElement(type, elementID) {
    this.touchElements[type].push(elementID);
    return this;
  }
  /**
   * @param {JSON} elements
   * @description _Example:_ 
   * addTouchElements({
   *    hide: [
   *      "elementID1",
   *      "elementID2" 
   *    ],
   *    show: [
   *      "elementID3"
   *    ]
   * })
   * @returns {AnimationController}
   */
  addTouchElements(elements) {
    var elementObjectKeys = Object.keys(elements);

    for (const key of elementObjectKeys) {
      if (elements[key]) {
        for (const element of elements[key]) {
          this.touchElements[key].push(element);
        }
      }
    }
    return this;
  }
}

export default AnimationController