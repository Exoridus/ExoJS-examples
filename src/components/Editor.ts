import './EditorPreview';
import './EditorCode';

import { css } from './Editor.module.scss';

import { autorun } from 'mobx';
import { MobxLitElement } from '@adobe/lit-mobx';
import { CSSResult, customElement, html, internalProperty, TemplateResult, unsafeCSS } from 'lit-element';
import { Example, ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';

@customElement('my-editor')
export default class Editor extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    private exampleService: ExampleService = globalDependencies.get('exampleService');

    @internalProperty() private sourceCode: string | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        autorun(() => {
            this.loadSourceCode(this.exampleService.activeExample);
        });
    }

    private async loadSourceCode(example: Example | null): Promise<void> {
        if (example === null) {
            return;
        }

        this.sourceCode = await this.exampleService.loadExampleSource(example.path);
    }

    public render(): TemplateResult {
        return html`
            <my-editor-preview .sourceCode=${this.sourceCode}></my-editor-preview>
            <my-editor-code .sourceCode=${this.sourceCode}></my-editor-code>
        `;
    }
}
