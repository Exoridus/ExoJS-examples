import { css, customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';

@customElement('my-navigation-header')
export default class NavigationHeader extends LitElement {

    public static get styles(): CSSResult {
        return css`
            .navigation-header {
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
            <div class="navigation-header">
                <slot></slot>
            </div>
        `;
    }
}