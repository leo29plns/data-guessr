import { DataSlot } from '../DataSlot/DataSlot.js';
import { Module } from '../Module/Module.js';

/**
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { GeoDataProperties } from 'src/types/data/geodata.js'
 */

export class MapMetadataManager extends Module {
  /** @type {HTMLElement} */
  #container;

  /** @type {HTMLButtonElement} */
  #button;

  /**
   * @param {Bus} bus
   * @param {string} containerId
   * @param {string} buttonId
   */
  constructor(bus, containerId, buttonId) {
    super(bus);

    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);

    if (!container || !button) {
      throw new Error(`Metadata container not found.`);
    }

    this.#container = container;
    this.#button = /** @type {HTMLButtonElement} */ (button);

    this.#attachEventListeners();
    this.setupListeners();
    this.open();
  }

  setupListeners() {
    this.bus.on('round:started', (gameRound) => {
      this.#render(gameRound.poi.properties);
      this.open();
    });

    this.bus.on('round:ended', () => this.close());
  }

  open() {
    this.#container.setAttribute('data-open', '');
    this.#container.setAttribute('aria-hidden', 'true');
    this.#button.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.#container.removeAttribute('data-open');
    this.#container.setAttribute('aria-hidden', 'false');
    this.#button.setAttribute('aria-expanded', 'false');
  }

  toggle() {
    const isOpen = this.#container.hasAttribute('data-open');
    isOpen ? this.close() : this.open();
  }

  /**
   * @param {GeoDataProperties} props
   */
  #render(props) {
    const dataSlot = new DataSlot(this.#container);
    dataSlot.update({ ...props });
  }

  #attachEventListeners() {
    this.#button.addEventListener('click', () => this.toggle());
    this.#container.addEventListener('beforematch', () => this.open());
  }
}
