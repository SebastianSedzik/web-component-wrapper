import { LitElement, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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
export class TagLitTs extends LitElement {
  static styles = unsafeCSS(styles);

  private created = Date.now();

  /**
   * The tag’s size. Default is `medium`.
   */
  @property()
  size: TagSize | `${TagSize}` = 'medium';

  /**
   * Shows a remove button.
   */
  @property({ type: Boolean })
  removable: boolean = false;

  @state()
  private showHighlight: boolean = false;

  /**
   * Highlights the tag for a requested number of time.
   */
  highlight(highlightConfig?: TagHighlightOptions) {
    const config: TagHighlightOptions = {
      duration: 4000,
      ...highlightConfig
    }

    this.showHighlight = true;

    setTimeout(() => this.showHighlight = false, config.duration);
  }

  private onRemove() {
    /**
     * Emits when the remove button is clicked.
     */
    this.dispatchEvent(new CustomEvent<TagRemoveEvent>('on-remove', {
      detail: { created: this.created }
    }));
  }

  private get removeButton() {
    return html`<button class="tag__button" @click=${this.onRemove}>
        <slot name="remove-icon">X</slot>
    </button>`
  }

  override render() {
    const classes = {
      tag: true,
      'tag-highlighted': this.showHighlight,
      [`tag--${this.size}`]: true
    }

    return html`<span class=${classMap(classes)}>
        <slot></slot>
        ${this.removable ? this.removeButton : ''}
    </span>`;
  }
}
