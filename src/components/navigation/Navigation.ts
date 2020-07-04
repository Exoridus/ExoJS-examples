import styles from './Navigation.module.scss';

import { customElement, html, LitElement, TemplateResult } from 'lit-element';

@customElement('my-navigation')
export default class Navigation extends LitElement {

    public render(): TemplateResult {

        return html`
            <aside class=${styles.navigation}>
                <div class=${styles.viewport}>
                    <slot></slot>
                </div>
            </aside>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
