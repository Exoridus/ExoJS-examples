import styles, { css } from './Button.module.scss';

import { CSSResult, customElement, html, LitElement, property, TemplateResult, unsafeCSS } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('my-button')
export default class Button extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: Boolean }) public disabled = false;
    @property({ type: Boolean }) public flat = false;

    public render(): TemplateResult {
        const buttonClass = classMap({
            [styles.button]: true,
            [styles.flat]: this.flat,
        });

        return html`
            <button ?disabled=${this.disabled} class=${buttonClass}>
                <slot></slot>
            </button>
        `;
    }
}