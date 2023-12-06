import { LitElement, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import styles from './styles.css'

/**
 * Categorize content. Tag can be a keyword, people, etc.
 *
 * @element
 *
 * @prop {"small"|"medium"} size - The tag’s size. Default is `medium`.
 * @prop {Boolean} removable - Shows a remove button.
 * @slot - content of the tag.
 * @slot remove-button - custom content for the remove button (instead of X icon).
 * @cssprop --tag-text-color - text color of the tag.
 *
 */
export class TagLitJs extends LitElement {
  static styles = unsafeCSS(styles);
  

  static properties = {
    size: { type: String, attribute: true },
    removable: { type: Boolean, attribute: true },
    _created: { state: true },
    _showHighlight: { state: true }
  }

  constructor() {
    super();

    this.size = 'medium'
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

    setTimeout(() => this._showHighlight = false, config.duration);
  }

  _onRemove() {
    /**
     * Emits when the remove button is clicked.
     */
    this.dispatchEvent(new CustomEvent('on-remove', {
      detail: { created: this.created }
    }));
  }

  get _removeButton() {
    return html`<button class="tag__button" @click=${this._onRemove()}>
        <slot name="remove-button">X</slot>
    </button>`
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
