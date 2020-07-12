import styles, { css } from './EditorPreview.module.scss';

import {
    CSSResult,
    customElement,
    html, internalProperty,
    LitElement,
    property,
    TemplateResult, unsafeCSS,
} from 'lit-element';

@customElement('my-editor-preview')
export default class EditorPreview extends LitElement {

    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: String }) public sourceCode: string | null = null;
    // @internalProperty() iframeElement: HTMLIFrameElement | null = null;

    // private pendingIframe: Promise<HTMLIFrameElement> | null = null;
    //
    // public connectedCallback(): void {
    //     super.connectedCallback();
    //
    //     this.pendingIframe = this.createIframeElement();
    // }

    public render(): TemplateResult {

        if (this.sourceCode === null) {
            return html`<span>No Sourcecode to preview...</span>`;
        }

        const iframeSrc = 'preview.html';

        return html`
            <iframe 
                class=${styles.preview} 
                onload=${this.onLoadIframe}
                onerror=${this.onErrorIframe}
                src=${iframeSrc}
             />
        `;
    }

    // public updated() {
    //     const iframe = this.shadowRoot!.querySelector(styles.preview) as HTMLIFrameElement;
    //
    //     if (!iframe) {
    //         throw new Error('Could not find iframe element!');
    //     }
    //
    //     iframe.onload = (): void => {
    //         try {
    //             this.addIframeScript(iframe, this.sourceCode!);
    //         } catch (error) {
    //             console.error('Could not add source code to iframe!', error);
    //         }
    //     };
    //
    //     iframe.onerror = (error): void => {
    //         console.error('Could not load iframe source!', error);
    //     };
    //
    //     iframe.src = 'preview.html';
    // }

    private onLoadIframe(event: any): void {
        console.log('onLoadIframe', event);
        // try {
        //     this.addIframeScript(iframe, this.sourceCode);
        // } catch (e) {
        //     return reject();
        // }
    }

    private onErrorIframe(event: any): void {
        console.log('onErrorIframe', event);
        // try {
        //     this.addIframeScript(iframe, this.sourceCode);
        // } catch (e) {
        //     return reject();
        // }
    }

    private async createIframeElement(): Promise<HTMLIFrameElement> {

        return new Promise<HTMLIFrameElement>(((resolve, reject) => {

            const iframe = document.createElement('iframe');

            iframe.classList.add(styles.preview);
            iframe.onload = (): void => {
                try {
                    this.addIframeScript(iframe, this.sourceCode!);
                } catch (e) {
                    return reject();
                }

                resolve(iframe);
            };
            iframe.onerror = (): void => reject();
            iframe.src = 'preview.html';
        }));
    }

    private addIframeScript(iframe: HTMLIFrameElement, source: string): void {

        const iframeBody = iframe.contentWindow?.document.body;

        if (!iframeBody) {
            throw new Error('Could not access iframe body element!');
        }

        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.innerHTML = `
            window.onload = function () {
                ${source}
            }
        `;

        iframeBody.appendChild(script);
    }
}
