import { css, customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';

@customElement('my-navigation-link')
export default class NavigationLink extends LitElement {
    @property({type : String}) path: string = '';

    public static get styles(): CSSResult {
        return css`
            .navigation-item {
                @include transition(background-color 120ms cubic-bezier(0, 0, 0.2, 1));
                @include unitize(padding, 0, 16);
                @include unitize(height, 48);
                @include unitize(font-size, 16);
                @include unitize(line-height, 48);
                -webkit-tap-highlight-color: $color-transparent;
                font-weight: $font-weight-regular;
                color: $color-text;
                text-decoration: none;
                position: relative;
                cursor: pointer;
                display: block;
                width: 100%;
    
                &:hover {
                    background-color: rgba($color-white, 0.12);
                }
    
                &:active {
                    background-color: rgba($color-white, 0.18);
                }
            }
        `;
    }

    public render(): TemplateResult {

        return html`
            <a 
                href="#${this.path}" 
                title="${this.title}" 
                class="navigation-item"
                @click="${this.handleClick}"
            >
                ${this.title}
            </a>`;
    }

    private handleClick(event: Event): void {

        this.dispatchEvent(new CustomEvent('load-example', {
            detail: {
                path: this.path,
            },
            bubbles: true,
            composed: true,
        }));

        event.preventDefault();
    }
}