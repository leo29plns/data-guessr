import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class DialogManager extends Module {
  /** @type {HTMLDialogElement} */
  dialog;

  /** @type {HTMLButtonElement} */
  nextBtn;

  /**
   * @param {Bus} bus
   * @param {string} dialogId
   */
  constructor(bus, dialogId) {
    super(bus);

    const dialog = document.getElementById(dialogId);

    if (!dialog) {
      throw new Error(`Unable to find dialog.`);
    }

    const nextBtn = dialog.querySelector('[data-action="next"]');

    if (!nextBtn) {
      throw new Error(`Unable to find next button.`);
    }

    this.dialog = /** @type {HTMLDialogElement} */ (dialog);
    this.nextBtn = /** @type {HTMLButtonElement} */ (nextBtn);
  }

  attachEventListeners() {}

  show() {
    this.dialog.showModal();
  }

  hide() {
    this.dialog.close();
  }
}
