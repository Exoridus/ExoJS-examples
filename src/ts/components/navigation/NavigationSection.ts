import { css, customElement, LitElement, property } from 'lit-element';
import { html, TemplateResult } from 'lit-html';
import { CSSResult } from 'lit-element/src/lib/css-tag';
import { IExample } from '../../config';

@customElement('my-navigation-section')
export default class NavigationSection extends LitElement {
    @property({type : String}) title: string = '';
    @property({type : String}) path: string = '';
    @property({type : Array}) examples: Array<IExample> = [];

    public static get styles(): CSSResult {
        return css`
            .navigation-section {
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

        const { title, examples } = this;

        return html`
            <div class="navigation-section">
                <my-navigation-title>${title}</my-navigation-title>
                ${examples.map(example => this.renderNavigationLink(example))}
            </div>
        `;
    }

    public renderNavigationLink({ path, title }: IExample): TemplateResult {

        const fullPath = `${this.path}${path}`;

        return html`
            <my-navigation-link path="${fullPath}">${title}</my-navigation-link>
        `;
    }
}