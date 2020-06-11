import { css, customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';

@customElement('my-navigation-title')
export default class NavigationTitle extends LitElement {

    public static get styles(): CSSResult {

        return css`
            .navigation-title {
                transition: background-color 120ms cubic-bezier(0, 0, 0.2, 1);
                padding: 0 16px;
                height: 48px;
                font-size: 14px;
                line-height: 48px;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                font-weight: 500;
                color: #FFFF00;
                text-decoration: none;
                position: relative;
                cursor: default;
                display: block;
                width: 100%;
            }
        `;
    }

    public render(): TemplateResult {

        return html`
            <div class="navigation-title">
                <slot></slot>
            </div>
        `;
    }
}
