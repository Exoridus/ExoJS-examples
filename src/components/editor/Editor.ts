import styles, { css } from './Editor.module.scss';

import {
    CSSResult,
    customElement,
    html, internalProperty,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { autorun } from 'mobx';
import { Example, ExampleService } from '../../classes/ExampleService';
import { globalDependencies } from '../../classes/globalDependencies';
import { MobxLitElement } from '@adobe/lit-mobx';

@customElement('my-editor')
export default class Editor extends MobxLitElement {

    public static styles: CSSResult = unsafeCSS(css);

    private exampleService: ExampleService = globalDependencies.get('exampleService');

    @internalProperty() private sourceCode: string | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        autorun(() => {
            this.loadSourceCode(this.exampleService.currentExample);
        });
    }

    private async loadSourceCode(example: Example | null): Promise<void> {
        if (example === null) {
            return;
        }

        this.sourceCode = await this.exampleService.loadExampleSource(example.path);
    }

    public render(): TemplateResult {

        const exampleName = this.exampleService.currentExample?.name || '';

        return html`
            <div class=${styles.editor}>
                <my-editor-preview .sourceCode=${this.sourceCode}></my-editor-preview>

                <section class=${styles.editorCode}>
                    <my-toolbar title="${`Example Code: ${exampleName}`}">
                        <my-button @click="${this.triggerRefreshPreview}">REFRESH</my-button>
                    </my-toolbar>
                    <my-editor-code .sourceCode=${this.sourceCode}></my-editor-code>
                </section>
            </div>
        `;
    }

    private triggerRefreshPreview(): void {

        console.log('Refresh click!');
        //
        // if (this.codeMirrorEditor === null) {
        //     throw new Error('No Editor was found!');
        // }
    }
}
