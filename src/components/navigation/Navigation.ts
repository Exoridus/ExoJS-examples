import styles, { css } from './Navigation.module.scss';

import { CSSResult, customElement, html, LitElement, TemplateResult, unsafeCSS } from 'lit-element';

@customElement('my-navigation')
export default class Navigation extends LitElement {

    public static styles: CSSResult = unsafeCSS(css);

    public render(): TemplateResult {

        return html`
            <aside class=${styles.navigation}>
                <div class=${styles.viewport}>
                    <slot></slot>
                </div>
            </aside>
        `;
    }
}
