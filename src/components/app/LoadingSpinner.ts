import styles from './LoadingSpinner.module.scss';

import {
    customElement,
    html,
    LitElement, property,
    TemplateResult,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('my-loading-spinner')
export default class LoadingSpinner extends LitElement {

    @property({ type: Boolean }) public centered = false;

    public render(): TemplateResult {

        return html`
            <div class="${classMap({ [styles.loadingIndicator]: true, [styles.centered]: this.centered })}">
                <svg class=${styles.spinner}>
                    <circle class=${styles.path} cx="50" cy="50" r="20"/>
                </svg>
            </div>
        `;
    }

    public createRenderRoot() {
        return this;
    }
}
