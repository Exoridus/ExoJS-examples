import { css, customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';
import { ExampleEntry } from '../../classes/ExampleService';

export interface NavLinkClicked {
    exampleEntry: ExampleEntry;
}

@customElement('my-navigation-link')
export default class NavigationLink extends LitElement {

    @property({type : Object}) exampleEntry?: ExampleEntry;

    public static get styles(): CSSResult {

        return css`
            .navigation-link {
                transition: background-color 120ms cubic-bezier(0, 0, 0.2, 1);
                padding: 0 16px;
                height: 48px;
                font-size: 16px;
                line-height: 48px;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                font-weight: 400;
                color: #fff;
                text-decoration: none;
                position: relative;
                cursor: pointer;
                display: block;
                width: 100%;
            }
            
            .navigation-link:hover {
                background-color: rgba(255, 255, 255, 0.12);
            }
            
            .navigation-link:active {
                background-color: rgba(255, 255, 255, 0.18);
            }
        `;
    }

    public render(): TemplateResult {

        if (!this.exampleEntry) {
            return html``;
        }

        const { name, file } = this.exampleEntry;

        return html`
            <a 
                href="#${file}" 
                title="${name}"
                class="navigation-link"
                @click="${this.handleClick}"
            >
                ${name}
            </a>`;
    }

    private handleClick(event: Event): void {

        event.preventDefault();

        this.dispatchEvent(new CustomEvent<NavLinkClicked>('nav-link-clicked', {
            detail: {
                exampleEntry: this.exampleEntry!
            },
            bubbles: true,
            composed: true,
        }));
    }
}
