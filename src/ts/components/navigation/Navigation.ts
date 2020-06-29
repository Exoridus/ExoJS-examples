import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { CSSResult } from 'lit-element/src/lib/css-tag';
import { ExampleEntries, ExampleEntry } from '../../classes/ExampleService';

@customElement('my-navigation')
export default class Navigation extends LitElement {

    @property({type : Object}) exampleEntries?: ExampleEntries;

    public static get styles(): CSSResult {

        return css`
            .navigation {
                transition: all 350ms ease;
                width: 320px;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                background: #232323;
                position: absolute;
                overflow: visible;
                outline: none;
                height: 100%;
                bottom: 0;
                left: 0;
                top: 0;
            }
            
            .viewport {
                position: absolute;
                overflow: auto;
                width: 100%;
                bottom: 0;
                left: 0;
                top: 0;
            }
            
            .navigation-header {
                height: 64px;
                padding: 8px 16px;
                line-height: 48px;
                font-size: 20px;
                font-weight: 500;
                color: #fff;
                position: relative;
                overflow: hidden;
                cursor: default;
                margin: 0;
            }
        `;
    }

    public render(): TemplateResult {

        return html`
            <nav class="navigation">
                <div class="viewport">
                    <h1 class="navigation-header">ExoJS Examples</h1>
                    ${this.renderNavigation()}
                </div>
            </nav>
        `;
    }

    private renderNavigation(): TemplateResult {

        if (!this.exampleEntries) {
            return html`<my-loading-spinner centered />`;
        }

        return html`
            ${Array.from(this.exampleEntries, ([category, examples]) => this.renderCategory(category, examples))}
        `;
    }

    private renderCategory(title: string, examples: Array<ExampleEntry>): TemplateResult {

        return html`
            <div class="navigation-section">
                <my-navigation-title>${title}</my-navigation-title>
                ${examples.map(example => html`<my-navigation-link example="${example}" />` )}
            </div>
        `;
    }
}
