import styles from './NavigationLink.module.scss';

import { customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';

@customElement('my-navigation-link')
export default class NavigationLink extends LitElement {

    @property({ type: String }) href?: string;

    public render(): TemplateResult {

        return html`
            <a href=${this.href} class=${styles.navigationLink}>
                <slot></slot>
            </a>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
