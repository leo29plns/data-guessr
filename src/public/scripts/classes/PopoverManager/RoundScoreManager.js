import { DataSlot } from '../DataSlot/DataSlot.js';
import { PopoverManager } from './PopoverManager.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { GameRound } from '@/scripts/classes/GameRound/GameRound.js'
 */

export class RoundScoreManager extends PopoverManager {
  /**
   * @param {Bus} bus
   * @param {string} popoverId
   */
  constructor(bus, popoverId) {
    super(bus, popoverId);

    this.attachEventListeners();
    this.setupListeners();
  }

  attachEventListeners() {
    this.nextBtn.addEventListener('click', () => {
      this.close();
      this.bus.emit('dialog:next-round');
    });
  }

  setupListeners() {
    this.bus.on('round:ended', (gameRound) => {
      this.#render(gameRound);
      this.show();
    });
  }

  /**
   * @param {GameRound} gameRound
   */
  #render(gameRound) {
    const { score, distance } = gameRound;

    const dataSlot = new DataSlot(this.popover);
    dataSlot.update({ score, distance });
  }
}
