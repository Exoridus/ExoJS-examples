import styles, { css } from './NavigationLink.module.scss';

import { CSSResult, customElement, LitElement, property, unsafeCSS } from 'lit-element';
import { html, TemplateResult } from 'lit-html';

@customElement('my-navigation-link')
export default class NavigationLink extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: String }) public href: string = '';

    public render(): TemplateResult {
        return html`
            <a href=${this.href} class=${styles.navigationLink}>
                <slot></slot>
            </a>
        `;
    }
}
