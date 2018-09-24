const os = require("os");
const EventEmitter = require("events");

module.exports = class NetworkChangeNotifier extends EventEmitter {
  /**
   * Creates an instance of NetworkChangeNotifier.
   *
   * It will emit network interface changes with a `network-change` event.
   *
   * @example
   * const NetworkChangeNotifier = require('network-change-notifier');
   * const notifier = new NetworkChangeNotifier();
   *
   * notifier.on('network-change', () => console.log('network interfaces changed'));
   *
   * You can provide a filter, if you're only interested in a subset of the
   * network interfaces.
   *
   * @example
   * const NetworkChangeNotifier = require('network-change-notifier');
   * const notifier = new NetworkChangeNotifier({
   *  filter: network => network.internal
   * });
   *
   * notifier.on('network-change', () => console.log('internal network interfaces changed'));
   *
   * @param {*} [{
   *     intervals = 1000,
   *     filter = () => true
   *   }={}]
   */
  constructor({ intervals = 1000, filter = () => true } = {}) {
    super();

    this.filter = filter;
    this.previousInterfaces = this.getInterfacesSerialized();

    setInterval(() => {
      const currentInterfaces = this.getInterfacesSerialized();
      const hasChanges = this.previousInterfaces !== currentInterfaces;

      if (hasChanges) {
        this.emit("network-change");
      }

      this.previousInterfaces = currentInterfaces;
    }, intervals);
  }
  /**
   * Get network interfaces in serialized form
   *
   * @returns {string}
   */
  getInterfacesSerialized() {
    const networkInterfaces = os.networkInterfaces();
    const privateInterfaces = Object.values(networkInterfaces).map(
      networkInterface => {
        return networkInterface.filter(this.filter);
      }
    );
    return JSON.stringify(privateInterfaces);
  }
};
