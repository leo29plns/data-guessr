/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus'
 */

export class Module {
  /** @type {Bus} */
  #bus;

  /**
   * @param {Bus} bus
   */
  constructor(bus) {
    if (!bus) {
      throw new Error(`A bus is required for ${this.constructor.name}`);
    }

    this.#bus = bus;
  }

  /**
   * Method where to set all `this.bus.on` events.
   */
  setupListeners() {}

  get bus() {
    return this.#bus;
  }
}
