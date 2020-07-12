import styles, { css } from './EditorCode.module.scss';

import {
    CSSResult,
    customElement,
    html,
    property, PropertyValues,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import { EditorState } from '@codemirror/next/state';
import { EditorView } from '@codemirror/next/view';
import { javascript } from '@codemirror/next/lang-javascript';
import { highlightActiveLine } from '@codemirror/next/highlight-selection';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import { lineNumbers } from '@codemirror/next/gutter';
import { oneDark } from '@codemirror/next/theme-one-dark';

@customElement('my-editor-code')
export default class EditorCode extends MobxLitElement {

    public static styles: CSSResult = unsafeCSS(css);

    @property() public sourceCode: string | null = null;

    private editorState: EditorState = EditorState.create({
        doc: 'Hello World',
        extensions: [
            lineNumbers(),
            javascript(),
            highlightActiveLine(),
            bracketMatching(),
            // EditorState.indentUnit.of(4),
            oneDark,
        ],
    });

    private editorView: EditorView = new EditorView({
        state: this.editorState,
    });

    public render(): TemplateResult {

        return html`
            <textarea class=${styles.codemirrorElement}></textarea>
        `;
    }

    public firstUpdated(_changedProperties: PropertyValues): void {
        const textArea = this.shadowRoot!.querySelector(styles.codemirrorElement) as HTMLTextAreaElement;

        if (!textArea) {
            throw new Error('Could not find textArea element!');
        }

        // this.codeMirrorEditor = CodeMirror.fromTextArea(textArea, {
        //     value: this.sourceCode || '',
        //     viewportMargin: Infinity,
        //     lineWrapping: true,
        //     indentUnit: 4,
        // });
    }

    public updated(changedProperties: PropertyValues): void {
        // if (changedProperties.has('sourceCode')) {
        //     this.codeMirrorEditor?.setValue(this.sourceCode || '');
        // }
    }
}
