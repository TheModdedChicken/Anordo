import Menu from "./Menu";

class MenuController {
  /**
   * 
   * @param {String} id ID of menu controller
   * @param {Menu} mainMenu Main menu
   */
  constructor(id, mainMenu = null) {
    this.id = id;
    this.transitions = {
      toParentMenu: null,
      toSubMenu: null,
      fromParentMenu: null,
      fromSubMenu: null
    };

    this.currentMenu = mainMenu ? mainMenu.id : null;
    if (mainMenu) this.menus = {[mainMenu.id]: mainMenu};
    else this.menus = {};

    this.addMenus = this.addMenus.bind(this);
    this.addMenu = this.addMenu.bind(this);
    this.removeMenu = this.removeMenu.bind(this);
    this.addTransitions = this.addTransitions.bind(this);
    this.addTransition = this.addTransition.bind(this);
    this.removeTransition = this.removeTransition.bind(this);
    this.gotoMenu = this.gotoMenu.bind(this);
  }
  /**
   * 
   * @param {Menu[]} menus Array of menus
   */
  addMenus(menus) {
    for (const menu of menus) {
      this.menus[menu.id] = menu;
    }
    return this;
  }
  /**
   * 
   * @param {Menu} menu
   */
  addMenu(menu) {
    this.menus[menu.id] = menu;
    return this;
  }
  /**
   * 
   * @param {String | Menu} menu Menu ID | Menu
   */
  removeMenu(menu) {
    if (typeof menu === "string") delete this.menus[menu];
    else delete this.menus[menu.id];
    return this;
  }
  /**
   * 
   * @param {JSON} transitions JSON object of transitions
   */
  addTransitions(transitions) {
    var transitionKeys = Object.keys(transitions);
    for (const transition of transitionKeys) {
      this.transitions[transition] = transitions[transition];
    }
    return this;
  }
  /**
   * 
   * @param {String} id ID of transition
   * @param {String} animation CSS Animation
   * @param {Function} callback Callback of transition
   */
  addTransition(id, animation, callback) {
    this.transitions[id] = {
      animation: animation,
      callback: callback
    };
    return this;
  }
  /**
   * @param {String} id ID of transition
   */
  removeTransition(id) {
    this.transitions[id] = null;
    return this;
  }
  /**
   * 
   * @param {String | Menu} menuID Menu ID | Menu
   */
  gotoMenu(menuID) {
    if (typeof menuID !== "string") menuID = menuID.id;

    var curAvailTransitions = {
      toParentMenu: this.menus[this.currentMenu] ? 
      this.menus[this.currentMenu].transitions.toParentMenu ? 
        this.menus[this.currentMenu].transitions.toParentMenu : this.transitions.toParentMenu : 
      this.transitions.toParentMenu,

      toSubMenu: this.menus[this.currentMenu] ? 
      this.menus[this.currentMenu].transitions.toSubMenu ? 
        this.menus[this.currentMenu].transitions.toSubMenu : this.transitions.toSubMenu : 
      this.transitions.toSubMenu,

      fromParentMenu: this.menus[menuID] ? 
      this.menus[menuID].transitions.fromParentMenu ? 
        this.menus[menuID].transitions.fromParentMenu : this.transitions.fromParentMenu : 
      this.transitions.fromParentMenu,

      fromSubMenu: this.menus[menuID] ? 
      this.menus[menuID].transitions.fromSubMenu ? 
        this.menus[menuID].transitions.fromSubMenu : this.transitions.fromSubMenu : 
      this.transitions.fromSubMenu,
    }

    if (this.currentMenu) {
      if (this.menus[this.currentMenu].parentMenus.includes(menuID)) {
        this.menus[this.currentMenu].element.style.animation = curAvailTransitions.toParentMenu;
        this.menus[menuID].element.style.animation = curAvailTransitions.fromSubMenu;
      } else if (this.menus[this.currentMenu].subMenus.includes(menuID)) {
        this.menus[this.currentMenu].element.style.animation = curAvailTransitions.toSubMenu;
        this.menus[menuID].element.style.animation = curAvailTransitions.fromParentMenu;
      }
    } else {
      this.menus[menuID].element.style.animation = curAvailTransitions.fromSubMenu;
    }

    this.currentMenu = menuID;
    return this;
  }
}

export default MenuController