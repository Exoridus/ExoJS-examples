import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement, property,
    TemplateResult,
} from 'lit-element';


@customElement('my-toolbar')
export default class Toolbar extends LitElement {

    @property({ type: String }) public title = '';

    public static get styles(): CSSResult {

        return css`
            .toolbar {
                padding: 16px;
                line-height: 16px;
                display: flex;
            }
            
            .toolbar-title {
                font-weight: 500;
                display: flex;
                flex: 1 0 auto;
            }
            
            .toolbar-options {
                font-weight: 500;
            }
        `;
    }

    public render(): TemplateResult {

        return html`
            <div class="toolbar">
                <div class="toolbar-title">${this.title}</div>
                <div class="toolbar-options">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}
