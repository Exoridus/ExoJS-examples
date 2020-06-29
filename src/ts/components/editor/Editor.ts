import { css, customElement, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element';
import { CSSResult } from 'lit-element/src/lib/css-tag';
import { IRefreshPreviewEvent } from '../../types';

@customElement('my-editor')
export default class Editor extends LitElement {

    @property({ type: String }) public code: string = '';
    @property({ type: String }) public examplePath: string = '';
    @property({ type: String }) public exampleTitle: string = '';
    @internalProperty() private pendingContent: Promise<TemplateResult> | null = null;

    public static get styles(): CSSResult {

        return css`
            .editor {
                position: relative;
                overflow: auto;
                overflow-x: hidden;
                height: 100%;
            }
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.pendingContent = this.loadExample();
    }

    public render(): TemplateResult {

        return html`
            <div class="editor">
                <my-editor-preview .code=${this.code} />
                <my-editor-code .title=${this.exampleTitle} .code=${this.code} @refresh-preview=${this.refreshPreview} />
            </div>
        `;
    }

    private async loadExample(): Promise<TemplateResult> {

        if (this.examplePath === null) {
            throw new Error('No examplePath provided!')
        }

        try {
            const response = await fetch(`examples/js/${this.examplePath}?no-cache=${Date.now()}`, {
                cache: 'no-cache',
                method: 'GET',
                mode: 'cors',
            });

            if (!response || !response.ok) {
                return null;
            }

            return response.text();
        } catch (e) {
            return null;
        }
    }

    private async refreshPreview(event: CustomEvent<IRefreshPreviewEvent>): Promise<void> {

        const code = event.detail?.code ?? null;

        if (this.code === code || code === null) {
            return;
        }

        this.code = code;
    }
}
