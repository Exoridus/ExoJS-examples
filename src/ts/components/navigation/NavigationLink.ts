import { css, customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';
import { IExample, ILoadExamplesEvent } from "../../types";

@customElement('my-navigation-link')
export default class NavigationLink extends LitElement {
    @property({type : Object}) example: IExample | null = null;

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

        if (this.example === null) {
            throw new Error('[NavigationSection]: prop example must be set!');
        }

        const { title, path } = this.example;

        return html`
            <a 
                href="#${path}" 
                title="${title}"
                class="navigation-link"
                @click="${this.handleClick}"
            >
                ${title}
            </a>`;
    }

    private handleClick(event: Event): void {

        event.preventDefault();

        this.dispatchEvent(new CustomEvent<ILoadExamplesEvent>('click-example', {
            detail: {
                example: this.example
            },
            bubbles: true,
            composed: true,
        }));
    }
}
