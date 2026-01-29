import { DataSlot } from '../DataSlot/DataSlot.js';
import { DialogManager } from './DialogManager.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { Game } from '@/scripts/classes/Game/Game.js'
 */

export class GameScoreManager extends DialogManager {
  /**
   * @param {Bus} bus
   * @param {string} dialogId
   */
  constructor(bus, dialogId) {
    super(bus, dialogId);

    this.attachEventListeners();
    this.setupListeners();
  }

  attachEventListeners() {
    this.nextBtn.addEventListener('click', () => {
      this.bus.emit('ui:game-restart');
      this.hide();
    });
  }

  setupListeners() {
    this.bus.on('game:ended', (game) => {
      this.#render(game);
      this.show();
    });
  }

  /**
   * @param {Game} game
   */
  #render(game) {
    const { totalScore } = game;

    const dataSlot = new DataSlot(this.dialog);
    dataSlot.update({ totalScore });
  }
}
