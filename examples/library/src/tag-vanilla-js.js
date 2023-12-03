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
      'size',
      'removable'
    ];
  }
  
  /**
   * The tag’s size. Default is `medium`.
   */
  get size() {
    return this.getAttribute('size') || 'medium';
  }

  set size(value) {
    this.setAttribute('size', value)
  }

  /**
   * Shows a remove button.
   */
  get removable() {
    const removableAttribute = this.getAttribute('removable');
    return removableAttribute === "" || removableAttribute === "true";
  }

  set removable(value) {
    this.setAttribute('removable', value);
  }

  _showHighlight = false;
  _firstRendered = false;
  _created = Date.now();
  _template = document.createElement('template');

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
    this.dispatchEvent(new CustomEvent('on-remove', {
      detail: { created: this._created }
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
    shadowRoot.append(this._template);
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
