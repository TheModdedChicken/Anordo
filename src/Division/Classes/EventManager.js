class EventManager {
  constructor(id = "newEventManager") {
    this.id = id;
    this.events = new Map();
    
    this.addEvent = this.addEvent.bind(this);
    this.addEvents = this.addEvents.bind(this);
    this.clear = this.clear.bind(this);
    this.delete = this.delete.bind(this);
    this.call = this.call.bind(this);
  }
  /**
   * 
   * @param {JSON} events 
   * @returns {EventManager}
   */
  addEvents(events) {
    const keys = Object.keys(events);
    for (var i = 0; i < keys.length; i++) {
      this.events.set(keys[i], events[keys[i]]);
    }
    return this;
  }
  /**
   * 
   * @param {String} id ID of Event
   * @param {Function} callback Callback of Event
   * @returns {EventManager}
   */
  addEvent(id, callback) {
    this.events.set(id, callback);
  }
  /**
   * 
   * @returns {EventManager}
   */
  clear() {
    this.events.clear();
    return this;
  }
  /**
   * 
   * @param {String} id ID of Event
   * @returns {EventManager}
   */
  delete(id) {
    this.events.delete(id);
    return this;
  }
  /**
   * 
   * @param {String} id ID of Event
   * @param  {...any} cargo Array of parameters
   * @returns {EventManager | Any}
   */
  call(id, ...cargo) {
    return this.events.get(id)(...cargo) | this;
  }
}

export default EventManager