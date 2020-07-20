import { css } from './NavigationTitle.module.scss';

import { CSSResult, customElement, html, LitElement, unsafeCSS } from 'lit-element';
import { TemplateResult } from 'lit-html';

@customElement('my-navigation-title')
export default class NavigationTitle extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    public render(): TemplateResult {
        return html`<slot></slot>`;
    }
}
