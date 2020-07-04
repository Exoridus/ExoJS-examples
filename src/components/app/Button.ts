import styles from './Button.module.scss';
import {
    customElement,
    html,
    LitElement,
    TemplateResult,
} from 'lit-element';

@customElement('my-button')
export default class Button extends LitElement {

    public render(): TemplateResult {

        return html`
            <div class=${styles.button}>
                <div class=${styles.buttonContent}>
                    <slot></slot>
                </div>
            </div>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
