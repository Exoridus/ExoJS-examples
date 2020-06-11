import { css, customElement, html, LitElement } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';

@customElement('my-navigation-title')
export default class NavigationTitle extends LitElement {

    public static get styles(): CSSResult {
        return css`
            .navigation-title {
                @include transition(background-color 120ms cubic-bezier(0, 0, 0.2, 1));
                @include unitize(padding, 0, 16);
                @include unitize(height, 48);
                @include unitize(font-size, 14);
                @include unitize(line-height, 48);
                -webkit-tap-highlight-color: $color-transparent;
                font-weight: $font-weight-medium;
                color: $color-accent;
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