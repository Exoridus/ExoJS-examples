import styles, { css } from './Toolbar.module.scss';

import { CSSResult, customElement, html, LitElement, property, TemplateResult, unsafeCSS } from 'lit-element';

@customElement('my-toolbar')
export default class Toolbar extends LitElement {

    public static styles: CSSResult = unsafeCSS(css);

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
}
