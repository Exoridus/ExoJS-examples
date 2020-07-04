import styles from './Toolbar.module.scss';

import {
    customElement,
    html,
    LitElement, property,
    TemplateResult,
} from 'lit-element';

@customElement('my-toolbar')
export default class Toolbar extends LitElement {

    @property({ type: String }) public title = '';

    public render(): TemplateResult {

        return html`
            <div class=${styles.toolbar}>
                <div class=${styles.toolbarTitle}>${this.title}</div>
                <div class=${styles.toolbarOptions}>
                    <slot></slot>
                </div>
            </div>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
