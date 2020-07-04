import styles from './NavigationSection.module.scss';

import { customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';

@customElement('my-navigation-section')
export default class NavigationSection extends LitElement {

    @property({ type: String }) headline?: string;

    public render(): TemplateResult {

        return html`
            <div class=${styles.navigationSection}>
                <my-navigation-title>${this.headline}</my-navigation-title>
                <slot></slot>
            </div>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
