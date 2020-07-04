import styles from './NavigationTitle.module.scss';

import { customElement, html, LitElement } from 'lit-element';
import { TemplateResult } from 'lit-html';

@customElement('my-navigation-title')
export default class NavigationTitle extends LitElement {

    public render(): TemplateResult {

        return html`
            <div class=${styles.navigationTitle}>
                <slot></slot>
            </div>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
