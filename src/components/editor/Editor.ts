import styles, { css } from './Editor.module.scss';

import {
    CSSResult,
    customElement,
    html, internalProperty,
    LitElement,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { autorun, reaction } from 'mobx';
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
            console.log('reaction', this.exampleService.currentExample);
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
                <my-editor-preview sourceCode=${this.sourceCode} />

                <section class=${styles.editorCode}>
                    <my-toolbar title="${`Example Code: ${exampleName}`}">
                        <my-button @click="${this.triggerRefreshPreview}">REFRESH</my-button>
                    </my-toolbar>
                    <my-editor-code sourceCode=${this.sourceCode} />
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
