import MenuController from "./MenuController";

class Menu {
  /**
   * 
   * @param {String | HTMLElement} element Menu Container ID | Menu Container HTML Element
   * @param {MenuController} menuController Menu controller to add menu to
   */
  constructor(element, menuController) {
    if (typeof element === "string") element = document.getElementById(element);
    this.id = element.id;
    this.element = element;
    this.parentMenus = [];
    this.subMenus = [];

    this.transitions = {
      toParentMenu: null,
      toSubMenu: null,
      fromParentMenu: null,
      fromSubMenu: null
    }

    this.linkMenus = this.linkMenus.bind(this);
    this.linkMenu = this.linkMenu.bind(this);
    this.unlinkMenu = this.unlinkMenu.bind(this);

    if (menuController) menuController.addMenu(this);
  }
  /**
   * 
   * @param {"parent" | "sub"} type Type of menu
   * @param {String | Menu} menuID Menu ID | Menu
   */
  linkMenu(type, menuID) {
    if (typeof menuID !== "string") menuID = menuID.id;
    this[type + "Menus"].push(menuID);
    return this;
  }
  /**
   * @param {JSON} menus JSON object of menus
   */
  linkMenus(menus) {
    var menuKeys = Object.keys(menus);
    for (const menu of menuKeys) {
      this[menus[menu].toLowerCase() + "Menus"].push(menu);
    }
    return this;
  }
  /**
   * 
   * @param {"parent" | "sub"} type Type of menu
   * @param {String} menuID ID of menu
   */
  unlinkMenu(type, menuID) {
    this[type + "Menus"] = this[type + "Menus"].slice(this[type + "Menus"].findIndex(m => m === menuID), this[type + "Menus"].findIndex(m => m === menuID))
    return this;
  }
}

export default Menu