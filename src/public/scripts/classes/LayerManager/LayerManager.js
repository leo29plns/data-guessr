import { layerGroup } from 'leaflet';
import { Module } from '../Module/Module.js';

/**
 * @import { Layer } from 'leaflet'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class LayerManager extends Module {
  /** @type {Map<string, Layer>} */
  #layers = new Map([['default', layerGroup()]]);

  /** @type {Layer} */
  #activeLayer;

  /** @type {HTMLSelectElement} */
  #select;

  /**
   * @param {Bus} bus
   * @param {string} selectId
   */
  constructor(bus, selectId) {
    super(bus);

    const select = document.getElementById(selectId);

    if (!select) {
      throw new Error(`Unable to find layer select.`);
    }

    this.#select = /** @type {HTMLSelectElement} */ (select);

    this.#activeLayer = /** @type {Layer} */ (this.#layers.get('default'));

    this.#attachSelect();
  }

  /**
   * @param {string} id
   * @param {Layer} layer
   */
  register(id, layer, label = id) {
    this.#layers.set(id, layer);

    const option = document.createElement('option');
    option.value = id;
    option.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    this.#select.appendChild(option);
  }

  /**
   * @param {string} id
   */
  select(id) {
    const next = this.#layers.get(id) || this.#layers.get('default');

    if (this.#activeLayer !== next) {
      this.#activeLayer = /** @type {import('leaflet').Layer} */ (next);
      this.bus.emit('layer:update', this);
    }
  }

  #attachSelect() {
    this.#select.addEventListener('change', () => {
      this.select(this.#select.value);
    });
  }

  /** @returns {import('leaflet').Layer} */
  get activeLayer() {
    return this.#activeLayer;
  }
}
