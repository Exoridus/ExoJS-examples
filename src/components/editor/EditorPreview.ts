import styles, { css } from './EditorPreview.module.scss';

import {
    CSSResult,
    customElement,
    html,
    LitElement,
    property,
    TemplateResult, unsafeCSS,
} from 'lit-element';
import dedent from 'dedent';
import { until } from 'lit-html/directives/until';

@customElement('my-editor-preview')
export default class EditorPreview extends LitElement {

    public static styles: CSSResult = unsafeCSS(css);

    @property() private previewUrl: string = '';
    @property() private code: string = '';

    private pendingIframe: Promise<HTMLIFrameElement> | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        this.pendingIframe = this.createIframeElement();
    }

    public render(): TemplateResult {

        if (this.pendingIframe === null) {
            throw new Error('Pending iframe must be set!');
        }

        return html`${until(this.pendingIframe, html`<span>Loading preview...</span>`)}`;
    }

    private async createIframeElement(): Promise<HTMLIFrameElement> {

        return new Promise<HTMLIFrameElement>(((resolve, reject) => {

            const iframe = document.createElement('iframe');

            iframe.classList.add(styles.preview);
            iframe.onload = (): void => {
                try {
                    this.addIframeScript(iframe, this.code);
                } catch (e) {
                    return reject();
                }

                resolve(iframe);
            };
            iframe.onerror = (): void => reject();
            iframe.src = this.previewUrl;
        }));
    }

    private addIframeScript(iframe: HTMLIFrameElement, source: string): void {

        const iframeBody = iframe.contentWindow?.document.body;

        if (!iframeBody) {
            throw new Error('Could not access iframe body element!');
        }

        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.innerHTML = dedent`
            window.onload = function () {
                ${source}
            }
        `;

        iframeBody.appendChild(script);
    }
}
