import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement,
    TemplateResult,
} from 'lit-element';

@customElement('my-button')
export default class Button extends LitElement {

    public static get styles(): CSSResult {

        return css`
            .button {
                height: 48px;
                padding: 6px 4px;
                -webkit-tap-highlight-color: ;
                background: rgba(0, 0, 0, 0);
                border: 0 none;
                display: inline-block;
                outline: none;
                cursor: pointer;
                text-decoration: none;
                position: absolute;
                right: 0;
                top: 0;
            }

            .button-content {
                transition: background-color 0.3s linear;
                height: 36px;
                min-width: 64px;
                line-height: 36px;
                padding: 0 8px;
                letter-spacing: 0.5px;
                border-radius: 2px;
                display: block;
                text-transform: uppercase;
                text-align: center;
                font-weight: 500;
                position: relative;
                border: 0 none;
                outline: none;
                background-color: rgba(0, 0, 0, 0);
                color: $color-accent;
            }
        `;
    }

    public render(): TemplateResult {

        return html`
            <div class="button">
                <div class="button-content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}
