import styles from './EditorCode.module.scss';

import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';
import CodeMirror from 'codemirror';

@customElement('my-editor-code')
export default class EditorCode extends LitElement {

    @property({ type: String }) public title = '';
    @property({ type: String }) public code = '';

    @query('.codemirror-element') private codeMirrorElement?: HTMLTextAreaElement;

    private codeMirrorEditor: CodeMirror.EditorFromTextArea | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        console.log(this.codeMirrorElement);

        if (!this.codeMirrorElement) {
            throw new Error('Could not codemirror element!');
        }

        this.codeMirrorEditor = CodeMirror.fromTextArea(this.codeMirrorElement, {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            viewportMargin: Infinity,
            lineWrapping: true,
            indentUnit: 4,
        });
    }

    public render(): TemplateResult {

        return html`
            <div class=${styles.editorCode}>
                <my-toolbar title="${`Example Code: ${this.title}`}">
                    <my-button @click="${this.triggerRefreshPreview}">REFRESH</my-button>
                </my-toolbar>
                <textarea class=${styles.codemirrorElement}>${this.code}</textarea>
            </div>
        `;
    }

    private triggerRefreshPreview(): void {

        if (this.codeMirrorEditor === null) {
            throw new Error('No Editor was found!');
        }

        // this.dispatchEvent(new CustomEvent<IRefreshPreviewEvent>('refresh-preview', {
        //     detail: {
        //         code: this.codeMirrorEditor.getValue(),
        //     },
        //     bubbles: true,
        //     composed: true,
        // }));
    }

    public createRenderRoot() {
        return this;
    }
}
