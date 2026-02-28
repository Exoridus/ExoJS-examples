import './Toolbar';
import './Button';
import './LoadingSpinner';

import styles, { css } from './EditorCode.module.scss';

import {
    CSSResult,
    customElement,
    html,
    property,
    PropertyValues,
    query,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';

export interface UpdateCodeEvent {
    code: string;
}

@customElement('my-editor-code')
export default class EditorCode extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property() public sourceCode: string | null = null;
    @query(`.${styles.editorHost}`) private editorHostElement?: HTMLDivElement;

    private exampleService: ExampleService = globalDependencies.get('exampleService');
    private editorView: EditorView | null = null;

    private readonly editorExtensions = [
        basicSetup,
        javascript(),
        oneDark,
    ];

    public render(): TemplateResult {
        const exampleName = this.exampleService.activeExample?.name || 'Loading...';

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

        return html`<div class=${styles.editorHost}></div>`;
    }

    public updated(changedProperties: PropertyValues): void {
        if (!changedProperties.has('sourceCode') || this.sourceCode === null) {
            return;
        }

        if (this.editorView === null) {
            this.initializeEditor(this.sourceCode);
            return;
        }

        this.updateEditorCode(this.sourceCode);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.editorView !== null) {
            this.editorView.destroy();
            this.editorView = null;
        }
    }

    private initializeEditor(initialCode: string): void {
        if (!this.editorHostElement || this.editorView !== null) {
            return;
        }

        const state = EditorState.create({
            doc: initialCode,
            extensions: this.editorExtensions,
        });

        this.editorView = new EditorView({
            state,
            parent: this.editorHostElement,
            root: this.shadowRoot || document,
        });
    }

    private updateEditorCode(code: string): void {
        if (this.editorView === null) {
            return;
        }

        const currentState = this.editorView.state;
        const transaction = currentState.update({
            changes: {
                from: 0,
                to: currentState.doc.length,
                insert: code,
            },
        });

        this.editorView.dispatch(transaction);
    }

    private triggerRefreshPreview(): void {
        if (this.editorView === null) {
            return;
        }

        const updateCodeEvent = new CustomEvent<UpdateCodeEvent>('update-code', {
            detail: {
                code: this.editorView.state.doc.toString(),
            },
        });

        this.dispatchEvent(updateCodeEvent);
    }
}
