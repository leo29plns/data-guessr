import css from './data-scale.css' with { type: 'css' };

export class DataScale extends HTMLElement {
  static observedAttributes = ['min', 'max', 'value', 'steps'];

  /** @type {ShadowRoot} */
  #root;

  /** @type {HTMLElement} */
  #indicator;

  /** @type {HTMLElement} */
  #track;

  /** @type {MutationObserver | null} */
  #observer = null;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });

    const template = /** @type {HTMLTemplateElement | null} */ (
      document.getElementById('template-data-scale')
    );

    if (template) {
      this.#root.appendChild(template.content.cloneNode(true));
    }

    this.#root.adoptedStyleSheets = [css];

    this.#indicator = /** @type {HTMLElement} */ (
      this.#root.querySelector('.indicator')
    );

    this.#track = /** @type {HTMLElement} */ (
      this.#root.querySelector('.track')
    );
  }

  connectedCallback() {
    this.#renderSteps();
    this.#updatePosition();
    this.#initObserver();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  #initObserver() {
    const parent = this.parentElement;
    if (!parent) return;

    this.#syncValue();

    this.#observer = new MutationObserver(() => this.#syncValue());

    this.#observer.observe(parent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value'],
    });
  }

  #syncValue() {
    const dataNode = this.parentElement?.querySelector('data');

    if (dataNode?.hasAttribute('value')) {
      const val = Number(dataNode.getAttribute('value'));

      if (this.value !== val) {
        this.value = val;
      }
    }
  }

  /**
   * @param {string} name
   * @param {string|null} oldVal
   * @param {string|null} newVal
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;

    if (name === 'steps') {
      this.#renderSteps();
    }

    this.#updatePosition();
  }

  #renderSteps() {
    this.#track.innerHTML = '';
    const count = this.steps;

    for (let i = 0; i < count; i++) {
      const step = document.createElement('div');
      step.classList.add('step');

      const ratio = i / (count - 1 || 1);

      step.style.setProperty('--step-ratio', String(ratio));
      this.#track.appendChild(step);
    }
  }

  #updatePosition() {
    const range = this.max - this.min;

    const pct =
      range === 0
        ? 0
        : Math.max(0, Math.min(100, ((this.value - this.min) / range) * 100));

    this.#indicator.style.left = `${pct}%`;
  }

  get value() {
    return Number(this.getAttribute('value')) || 0;
  }
  set value(v) {
    this.setAttribute('value', String(v));
  }

  get min() {
    return Number(this.getAttribute('min')) || 0;
  }
  set min(v) {
    this.setAttribute('min', String(v));
  }

  get max() {
    return Number(this.getAttribute('max')) || 100;
  }
  set max(v) {
    this.setAttribute('max', String(v));
  }

  get steps() {
    return Number(this.getAttribute('steps')) || 5;
  }
  set steps(v) {
    this.setAttribute('steps', String(v));
  }
}

customElements.define('data-scale', DataScale);
