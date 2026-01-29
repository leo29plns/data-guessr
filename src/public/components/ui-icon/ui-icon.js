import { ICONS_PATH } from './consts.js';
import css from './ui-icon.css' with { type: 'css' };

/** @type {Map<string, HTMLTemplateElement>} */
// Save icons to avoid downloading them again
const iconCache = new Map();

export class UiIcon extends HTMLElement {
  static observedAttributes = ['name'];

  /** @type {ShadowRoot} */
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });

    const template = /** @type {HTMLTemplateElement | null} */ (
      document.getElementById('template-ui-icon')
    );

    if (!template) return;

    this.#root.appendChild(template.content.cloneNode(true));
    this.#root.adoptedStyleSheets = [css];
  }

  /**
   * @param {string} _
   * @param {string|null} oldVal
   * @param {string|null} newVal
   */
  attributeChangedCallback(_, oldVal, newVal) {
    if (oldVal !== newVal && newVal) this.#loadIcon(newVal);
  }

  /**
   * @param {string} name
   */
  async #loadIcon(name) {
    const newIconTemplate = await this.#getIconTemplate(name);
    const oldIcon = this.#root.querySelector('svg');

    if (!oldIcon) return;

    oldIcon.replaceWith(newIconTemplate.content.cloneNode(true));
  }

  /**
   * @param {string} name
   * @returns {Promise<HTMLTemplateElement>}
   */
  async #getIconTemplate(name) {
    const icon = iconCache.get(name);

    if (icon) return icon;

    // Fetch and create a template for the new icon
    const res = await fetch(`${ICONS_PATH}/${name}.svg`);
    if (!res.ok) throw new Error(`${res.status}`);

    const svgText = await res.text();
    const template = document.createElement('template');
    template.innerHTML = svgText;

    iconCache.set(name, template);
    return template;
  }
}

customElements.define('ui-icon', UiIcon);
