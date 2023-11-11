import styles from './styles.css'

/**
 * Categorize content. Tag can be a keyword, people, etc.
 *
 * @element
 * @slot - The tag’s content.
 *
 */
export class TagVanillaJs extends HTMLElement {
  static get observedAttributes() {
    return [
      /**
       * The tag’s size. Default is `medium`.
       */
      'size',
      /**
       * Shows a remove button.
       */
      'removable'
    ];
  }
  
  set size(value) {
    this.setAttribute('size', value)
  }
  
  get size() {
    return this.getAttribute('size')
  }
  
  set removable(value) {
    this.setAttribute('removable', value);
  }

  get removable() {
    const removableAttribute = this.getAttribute('removable');
    return removableAttribute === "" || removableAttribute === "true";
  }

  _showHighlight = false;
  _firstRendered = false;

  constructor() {
    super();

    if(this.getAttribute('size') === null) {
      this.setAttribute('size', 'medium');
    }

    this._created = Date.now();
    this._showHighlight = false;
  }

  attributeChangedCallback() {
    if (this._firstRendered) {
      this.render();
    }
  }

  /**
   * Highlights the tag for a requested number of time.
   */
  highlight(highlightConfig) {
    const config = {
      duration: 4000,
      ...highlightConfig
    }

    this._showHighlight = true;
    this.render();

    setTimeout(() => {
      this._showHighlight = false
      this.render();
    }, config.duration);
  }
  
  _onRemove() {
    /**
     * Emits when the remove button is clicked.
     */
    this.dispatchEvent(new CustomEvent('my-remove', {
      detail: { created: this.created }
    }));
  }

  get _removeButton() {
    return `<button class="tag__button">X</button>`
  }
  
  _addEventHandlers() {
    const removeButton = this.shadowRoot.querySelector('button');
    
    if (removeButton) {
      removeButton.addEventListener('click', this._onRemove);
    }
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.template = document.createElement('template');
    shadowRoot.append(this.template);
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.getTemplate();
    this._addEventHandlers();
    this._firstRendered = true;
  }

  getTemplate() {
    const classes = {
      tag: true,
      'tag-highlighted': this._showHighlight,
      [`tag--${this.size}`]: true
    }

    const activeClasses = Object.keys(classes)
      .filter(className => classes[className])
      .join(' ')

    return `
        <style>${styles}</style>
        <span class="${activeClasses}">
            <slot></slot>
            ${this.removable ? this._removeButton : ''}
        </span>
    `
  }
}
