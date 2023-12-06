import styles from './styles.css'

enum TagSize {
  Small = 'small',
  Medium = 'medium'
}

interface TagHighlightOptions {
  /**
   * The highlight duration in milliseconds.
   */
  duration?: number;
}

export interface TagRemoveEvent {
  /**
   * Timestamp of the component creation.
   */
  created: number;
}

/**
 * Categorize content. Tag can be a keyword, people, etc.
 *
 * @element
 * @cssprop --tag-text-color - text color of the tag.
 * @slot - content of the tag.
 * @slot remove-button - custom content for the remove button (instead of X icon).
 *
 */
export class TagVanillaTs extends HTMLElement {
  static get observedAttributes() {
    return [
      'size',
      'removable'
    ];
  }
  
  /**
   * The tag’s size. Default is `medium`.
   */
  get size(): TagSize | `${TagSize}` {
    return this.getAttribute('size') as `${TagSize}`;
  }

  set size(value: TagSize | `${TagSize}`) {
    this.setAttribute('size', value)
  }
  
  /**
   * Shows a remove button.
   */
  get removable(): boolean {
    const removableAttribute = this.getAttribute('removable');
    return removableAttribute === "" || removableAttribute === "true";
  }

  set removable(value: boolean) {
    this.setAttribute('removable', value.toString());
  }

  _showHighlight = false;
  _firstRendered = false;
  _created = Date.now();
  _template = document.createElement('template');

  constructor() {
    super();
    
    if(this.getAttribute('size') === null) {
      this.setAttribute('size', 'medium');
    }

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
  highlight(highlightConfig?: TagHighlightOptions) {
    const config: TagHighlightOptions = {
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
    this.dispatchEvent(new CustomEvent<TagRemoveEvent>('on-remove', {
      detail: { created: this._created }
    }));
  }

  get _removeButton() {
    return `<button class="tag__button">
        <slot name="remove-icon">X</slot>
    </button>`
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
