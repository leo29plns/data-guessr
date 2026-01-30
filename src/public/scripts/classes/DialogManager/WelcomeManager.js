import { DialogManager } from './DialogManager.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class WelcomeManager extends DialogManager {
  /**
   * @param {Bus} bus
   * @param {string} dialogId
   */
  constructor(bus, dialogId) {
    super(bus, dialogId);

    this.attachEventListeners();
    this.show();
  }

  attachEventListeners() {
    this.nextBtn.addEventListener('click', () => {
      this.hide();
    });
  }
}
