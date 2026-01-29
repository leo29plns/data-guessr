/**
 * @import { SlotData } from 'src/types/slot'
 */

export class DataSlot {
  #span;
  #formatter;

  /**
   * @param {HTMLElement} span
   */
  constructor(span) {
    this.#span = span;
    this.#formatter = new Intl.NumberFormat('fr-FR');
  }

  /**
   * @param {SlotData} slotData
   */
  update(slotData) {
    /** @type {NodeListOf<HTMLElement>} */
    const slots = this.#span.querySelectorAll('[data-slot]');

    for (const slot of slots) {
      const key = slot.dataset.slot;

      if (key && key in slotData) {
        const value = slotData[key];

        // If it is a number, format it
        if (typeof value === 'number') {
          let dataNode = slot.querySelector('data');

          // Create <data> tag if it doesn't exist
          if (!dataNode) {
            dataNode = document.createElement('data');
            slot.replaceChildren(dataNode);
          }

          dataNode.value = String(value);
          dataNode.textContent = this.#formatter.format(value);
        } else {
          slot.textContent = String(value ?? '');
        }
      }
    }
  }
}
