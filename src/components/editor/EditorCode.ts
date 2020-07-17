import { css } from './EditorCode.module.scss';

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
import { history } from '@codemirror/next/history/src/history';
import { closeBrackets } from '@codemirror/next/closebrackets';
import { autocomplete } from '@codemirror/next/autocomplete';

@customElement('my-editor-code')
export default class EditorCode extends MobxLitElement {

    public static styles: CSSResult = unsafeCSS(css);

    @property() public sourceCode?: string;

    private editorState: EditorState | null = null;
    private editorView: EditorView | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        this.editorState = EditorState.create({
            doc: this.sourceCode,
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

        this.editorView = new EditorView({
            state: this.editorState,
        });
    }

    public render(): TemplateResult {

        return html`${this.editorView!.dom}`;
    }

    public updated(changedProperties: PropertyValues): void {
        if (changedProperties.has('sourceCode')) {
            // this.editorState.;
        }
    }
}
