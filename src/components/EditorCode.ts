import './Toolbar';
import './Button';
import './LoadingSpinner';

import { css } from './EditorCode.module.scss';

import { CSSResult, customElement, html, property, PropertyValues, TemplateResult, unsafeCSS } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import { EditorState } from '@codemirror/next/state';
import { EditorView } from '@codemirror/next/view';
import { javascript } from '@codemirror/next/lang-javascript';
import { highlightActiveLine } from '@codemirror/next/highlight-selection';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import { lineNumbers } from '@codemirror/next/gutter';
import { oneDark } from '@codemirror/next/theme-one-dark';
import { history } from '@codemirror/next/history/src/history';
import { closeBrackets } from '@codemirror/next/closebrackets';
import { autocomplete } from '@codemirror/next/autocomplete';
import { ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';

export interface UpdateCodeEvent {
    code: string;
}

@customElement('my-editor-code')
export default class EditorCode extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property() public sourceCode: string | null = null;

    private exampleService: ExampleService = globalDependencies.get('exampleService');

    private editorState: EditorState = EditorState.create({
        doc: this.sourceCode || '',
        extensions: [
            lineNumbers(),
            javascript(),
            highlightActiveLine(),
            bracketMatching(),
            history(),
            autocomplete(),
            closeBrackets,
            oneDark,
            // EditorState.indentUnit.of(4),
        ],
    });

    private editorView: EditorView = new EditorView({
        state: this.editorState,
    });

    public render(): TemplateResult {
        const exampleName = this.exampleService.activeExample?.name || 'Loading...';

        // @ts-ignore: test
        window.editorState = this.editorState;
        // @ts-ignore: test
        window.editorView = this.editorView;

        return html`
            <my-toolbar title=${`Example Code: ${exampleName}`}>
                <my-button ?disabled=${!this.sourceCode} @click=${this.triggerRefreshPreview}>REFRESH</my-button>
            </my-toolbar>
            ${this.renderContent()}
        `;
    }

    private renderContent(): TemplateResult {
        if (!this.sourceCode) {
            return html`<my-loading-spinner centered></my-loading-spinner>`;
        }

        return html`${this.editorView.dom}`;
    }

    public updated(changedProperties: PropertyValues): void {
        if (changedProperties.has('sourceCode') && this.sourceCode !== null) {
            this.updateEditorCode(0, this.editorState.doc.length, this.sourceCode);
        }
    }

    private updateEditorCode(from: number, to: number, insert: string): void {
        const transaction = this.editorState.update({
            changes: { from, to, insert },
        });

        this.editorView.dispatch(transaction);
    }

    private triggerRefreshPreview(): void {
        if (!this.editorState) {
            return;
        }

        const updateCodeEvent = new CustomEvent<UpdateCodeEvent>('update-code', {
            detail: {
                code: this.editorState.doc.toString(),
            },
        });

        this.dispatchEvent(updateCodeEvent);
    }
}
