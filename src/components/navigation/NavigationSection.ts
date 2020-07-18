import styles, { css } from './NavigationSection.module.scss';

import { CSSResult, customElement, LitElement, property, unsafeCSS } from 'lit-element';
import { html, TemplateResult } from 'lit-html';

@customElement('my-navigation-section')
export default class NavigationSection extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: String }) public headline?: string;

    public render(): TemplateResult {
        return html`
            <section class=${styles.navigationSection}>
                <my-navigation-title>${this.headline}</my-navigation-title>
                <slot></slot>
            </section>
        `;
    }
}
