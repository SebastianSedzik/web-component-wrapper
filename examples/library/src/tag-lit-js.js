import { LitElement, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import styles from './styles.css'

/**
 * Categorize content. Tag can be a keyword, people, etc.
 *
 * @element
 * @slot - The tag’s content.
 *
 */
export class TagLitJs extends LitElement {
  static styles = unsafeCSS(styles);
  
  static properties = {
    size: { type: String },
    removable: { type: Boolean, attribute: true },
    _created: { state: true },
    _showHighlight: { state: true }
  }

  constructor() {
    super();

    /**
     * The tag’s size. Default is `medium`.
     */
    this.size = 'medium'

    /**
     * Shows a remove button.
     */
    this.removable = false;

    this._created = Date.now();
    this._showHighlight = false;
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

    console.log(this);
    setTimeout(() => this._showHighlight = false, config.duration);
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
    return html`<button class="tag__button" @click=${this._onRemove()}>X</button>`
  }

  render() {
    const classes = {
      tag: true,
      'tag-highlighted': this._showHighlight,
      [`tag--${this.size}`]: true
    }

    return html`<span class=${classMap(classes)}>
          <slot></slot>
          ${this.removable ? this._removeButton : ''}
      </span>`;
  }
}
