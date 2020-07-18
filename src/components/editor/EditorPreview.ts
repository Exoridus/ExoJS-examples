import styles, { css } from './EditorPreview.module.scss';

import {
    CSSResult,
    customElement,
    html,
    internalProperty,
    LitElement,
    property,
    PropertyValues,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { globalDependencies } from '../../classes/globalDependencies';
import { UrlService } from '../../classes/UrlService';

@customElement('my-editor-preview')
export default class EditorPreview extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    private urlService: UrlService = globalDependencies.get('urlService');

    @property({ type: String }) public sourceCode?: string;
    @internalProperty() private updateId = 0;

    public render(): TemplateResult {
        return html`
            <div class=${styles.editorPreview}>
                ${this.renderContent()}
            </div>
        `;
    }

    private renderContent(): TemplateResult {
        if (!this.sourceCode) {
            return html`<my-loading-spinner centered />`;
        }

        const iframeUrl = this.urlService.buildIframeUrl({
            'no-cache': this.updateId,
        });

        return html`
            <iframe
                class=${styles.preview}
                @load=${this.onLoadIframe}
                @error=${this.onErrorIframe}
                src=${iframeUrl}
            ></iframe>
        `;
    }

    protected update(changedProperties: PropertyValues): void {
        if (changedProperties.has('sourceCode')) {
            this.updateId += 1;
        }

        super.update(changedProperties);
    }

    private onLoadIframe(event: Event): void {
        const iframe = event.composedPath()[0] as HTMLIFrameElement;
        const iframeBody = (iframe.contentDocument || iframe.contentWindow?.document)?.body;

        if (!iframeBody) {
            throw new Error('Could not access iframe body element!');
        }

        if (!this.sourceCode) {
            throw new Error('No source code provided!');
        }

        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.innerHTML = this.sourceCode;

        iframeBody.appendChild(script);
    }

    private onErrorIframe(event: Event | string): void {
        console.log('onErrorIframe', event);
        // try {
        //     this.addIframeScript(iframe, this.sourceCode);
        // } catch (e) {
        //     return reject();
        // }
    }
}
