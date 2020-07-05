import styles, { css } from './Editor.module.scss';

import {
    CSSResult,
    customElement,
    html,
    internalProperty,
    LitElement,
    property,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';

@customElement('my-editor')
export default class Editor extends LitElement {

    public static styles: CSSResult = unsafeCSS(css);

    @property({ type: String }) public code: string = '';
    @property({ type: String }) public examplePath: string = '';
    @property({ type: String }) public exampleTitle: string = '';
    @internalProperty() private pendingContent: Promise<TemplateResult> | null = null;

    // public connectedCallback(): void {
    //     super.connectedCallback();
    //
    //     this.pendingContent = this.loadExample();
    // }

    public render(): TemplateResult {

        return html`
            <div class=${styles.editor}>
                <my-editor-preview .code=${this.code} />
                <my-editor-code .title=${this.exampleTitle} .code=${this.code} />
            </div>
        `;
    }

    // private async loadExample(): Promise<TemplateResult> {
    //
    //     if (this.examplePath === null) {
    //         throw new Error('No examplePath provided!')
    //     }
    //
    //     try {
    //         const response = await fetch(`public/js/${this.examplePath}?no-cache=${Date.now()}`, {
    //             cache: 'no-cache',
    //             method: 'GET',
    //             mode: 'cors',
    //         });
    //
    //         if (!response || !response.ok) {
    //             return null;
    //         }
    //
    //         return response.text();
    //     } catch (e) {
    //         return null;
    //     }
    // }
    //
    // private async refreshPreview(event: CustomEvent<IRefreshPreviewEvent>): Promise<void> {
    //
    //     const code = event.detail?.code ?? null;
    //
    //     if (this.code === code || code === null) {
    //         return;
    //     }
    //
    //     this.code = code;
    // }
}
