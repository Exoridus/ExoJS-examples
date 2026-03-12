import styles, { css } from './NavigationLink.module.scss';

import { CSSResult, customElement, LitElement, property, unsafeCSS } from 'lit-element';
import { html, TemplateResult } from 'lit-html';

@customElement('my-navigation-link')
export default class NavigationLink extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: String }) public href: string = '';
    @property({ type: String }) public title: string = '';
    @property({ type: String }) public description: string = '';
    @property({ type: Boolean }) public active = false;

    public render(): TemplateResult {
        return html`
            <a
                href=${this.href}
                class=${styles.navigationLink}
                title=${this.description || this.title}
                ?data-active=${this.active}
                aria-current=${this.active ? 'page' : 'false'}
            >
                <span class=${styles.title}>${this.title}</span>
            </a>
        `;
    }
}
