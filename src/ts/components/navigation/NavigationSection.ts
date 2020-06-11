import { customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';
import { IExampleCategory } from "../../types";

@customElement('my-navigation-section')
export default class NavigationSection extends LitElement {
    @property({type : Object}) category: IExampleCategory | null = null;

    public render(): TemplateResult {

        if (this.category === null) {
            throw new Error('[NavigationSection]: prop category must be set!');
        }

        const { title, examples } = this.category;

        return html`
            <div class="navigation-section">
                <my-navigation-title>${title}</my-navigation-title>
                ${examples.map(example => html`<my-navigation-link example="${example}" />` )}
            </div>
        `;
    }
}
