import styles, { css } from './Button.module.scss';

import { CSSResult, customElement, html, LitElement, property, TemplateResult, unsafeCSS } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('my-button')
export default class Button extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: Boolean }) public disabled = false;

    public render(): TemplateResult {
        const componentClass = classMap({
            [styles.button]: true,
            [styles.disabled]: this.disabled,
        });

        return html`
            <button ?disabled=${this.disabled} class=${componentClass}>
                <span class=${styles.buttonContent}>
                    <slot></slot>
                </span>
            </button>
        `;
    }
}
