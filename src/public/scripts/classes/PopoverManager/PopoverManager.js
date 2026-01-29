import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class PopoverManager extends Module {
  /** @type {HTMLElement} */
  popover;

  /** @type {HTMLButtonElement} */
  nextBtn;

  /**
   * @param {Bus} bus
   * @param {string} popoverId
   */
  constructor(bus, popoverId) {
    super(bus);

    const popover = document.getElementById(popoverId);

    if (!popover || !popover.hasAttribute('popover')) {
      throw new Error('Unable to find popover');
    }

    this.popover = popover;

    const nextBtn = popover.querySelector('[data-action="next"]');

    if (!nextBtn) {
      throw new Error(`Unable to find next button.`);
    }

    this.popover = /** @type {HTMLElement} */ (popover);
    this.nextBtn = /** @type {HTMLButtonElement} */ (nextBtn);
  }

  attachEventListeners() {}

  show() {
    this.popover.showPopover();
  }

  close() {
    this.popover.hidePopover();
  }
}
