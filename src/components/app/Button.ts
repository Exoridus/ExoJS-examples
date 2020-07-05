import styles, { css } from './Button.module.scss';

import { CSSResult, customElement, html, LitElement, TemplateResult, unsafeCSS } from 'lit-element';

@customElement('my-button')
export default class Button extends LitElement {

    public static styles: CSSResult = unsafeCSS(css);

    public render(): TemplateResult {

        return html`
            <div class=${styles.button}>
                <div class=${styles.buttonContent}>
                    <slot></slot>
                </div>
            </div>
        `;
    }
}
