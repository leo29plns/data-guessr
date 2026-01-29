import { Module } from '../Module/Module.js';

/**
 * @import { GuessFormHTML } from 'src/types/guess-form.js'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 * @import { Coordinates } from 'src/types/coordinates.js'
 */

export class GuessManager extends Module {
  /** @type {GuessFormHTML} */
  #form;

  /** @type {Coordinates | null} */
  #coordinates = null;

  /**
   * @param {Bus} bus
   * @param {string} formId
   */
  constructor(bus, formId) {
    super(bus);

    const form = document.getElementById(formId);

    if (!form) {
      throw new Error('Form element not found.');
    }

    this.#form = /** @type {GuessFormHTML} */ (form);

    this.#attachForm();
    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('round:ended', () => {
      this.#form.hidden = true;
      this.#form.reset();
    });

    this.bus.on('round:started', () => {
      this.#form.hidden = false;
    });

    this.bus.on('map:moved-pointer', (geoMap) =>
      this.updateCoordinates(geoMap.pointerCoordinates),
    );
  }

  #attachForm() {
    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(this.#form);

      this.#coordinates = {
        lat: Number(data.get('lat')),
        lng: Number(data.get('lng')),
      };

      this.bus.emit('guess:submitted', this);
    });
  }

  /**
   * @param {Coordinates} coordinates
   */
  updateCoordinates(coordinates) {
    this.#form.elements.lat.value = coordinates.lat.toFixed(6);
    this.#form.elements.lng.value = coordinates.lng.toFixed(6);
  }

  get coordinates() {
    if (!this.#coordinates) {
      throw new Error('No coordinates found.');
    }

    return this.#coordinates;
  }
}
