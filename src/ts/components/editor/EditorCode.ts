import { css, customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

import { CSSResult } from 'lit-element/src/lib/css-tag';
import CodeMirror from 'codemirror';
import { IRefreshPreviewEvent } from '../../types';

@customElement('my-editor-code')
export default class EditorCode extends LitElement {

    @property({ type: String }) public title = '';
    @property({ type: String }) public code = '';

    @query('.codemirror-element') private codeMirrorElement?: HTMLTextAreaElement;

    private codeMirrorEditor: CodeMirror.EditorFromTextArea | null = null;

    public static get styles(): CSSResult {

        return css`
            .editor-code {
                @include box-shadow(0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12));
                @include border-radius(2);
                background: $color-card;
                position: relative;
                height: auto;
                width: 100%;
            }
            
            .codemirror-element {
                background: transparent;
                resize: none;
                border: 0;
            }
        `;
    }

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
            styleActiveLine: true,
            matchBrackets: true,
            viewportMargin: Infinity,
            lineWrapping: true,
            indentUnit: 4,
        });
    }

    public render(): TemplateResult {

        return html`
            <div class="editor-code">
                <my-toolbar title="${`Example Code: ${this.title}`}">
                    <my-button @click="${this.triggerRefreshPreview}">REFRESH</my-button>
                </my-toolbar>
                <textarea class="codemirror-element">${this.code}</textarea>
            </div>
        `;
    }

    private triggerRefreshPreview(): void {

        if (this.codeMirrorEditor === null) {
            throw new Error('No Editor was found!');
        }

        this.dispatchEvent(new CustomEvent<IRefreshPreviewEvent>('refresh-preview', {
            detail: {
                code: this.codeMirrorEditor.getValue(),
            },
            bubbles: true,
            composed: true,
        }));
    }
}
