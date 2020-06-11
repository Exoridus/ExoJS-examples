import { css, customElement, html, LitElement, property } from 'lit-element';

import $ from 'jquery';
import CodeMirror from 'codemirror';
import { config, ExamplesConfig, IExample, IExampleCategory } from '../config';
import { ExampleLoader } from 'src/ts/ExampleLoader';

@customElement('my-app')
export default class App extends LitElement {

    private exampleLoader: ExampleLoader = new ExampleLoader(config.examplesPath, config.requestOptions)
    private activeExample: IExample | null = null;
    private activeEditor: CodeMirror.EditorFromTextArea | null = null;
    private title = 'Example Code';

    public constructor() {
        super();


    }

    public async connectedCallback() {
        super.connectedCallback();


    }

    static get styles() {
        return css`
            .app {
                padding: 16px;
                overflow: hidden;
                min-height: 100vh;
                margin-bottom: 57px
            }
        `;
    }

    public render(): string {
        return html`
            <div class="page-wrap">
                ${this.renderNavigation(config.examples)}
                ${this.renderContent()}
            </div>
        `;
    }

    private renderContent(): string {

        return html`
            <main class="main">
                <div class="main-content">
                    <div class="example-preview"></div>
                    <div class="example-editor">
                        <div class="editor-header">
                            <div class="editor-title">${this.title}</div>
                            <div class="refresh-button">
                                <div class="button-content">REFRESH</div>
                            </div>
                        </div>
                        <div class="editor-content">
                            <textarea class="editor-code"></textarea>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    private renderNavigation(categories: Array<IExampleCategory>): string {

        return html`
            <nav class="navigation">
                <div class="navigation-content">
                    <h1 class="navigation-header">ExoJS Examples</h1>
                    <div class="navigation-list">
                        ${categories.map(category => this.renderCategory(category))}
                    </div>
                </div>
            </nav>
        `;
    }

    private renderCategory(category: IExampleCategory): string {

        return html`
            <div class="navigation-sub-header">${category.title}</div>
            ${category.examples.map(example => this.renderExample(example, category))}
        `;
    }

    private renderExample(example: IExample, category: IExampleCategory): string {

        const clickHandler = (): Promise<void> => this.loadExample(example, category);

        return html`<div class="navigation-item" @click="${clickHandler}">${example.title}</div>`;
    }

    private async loadExample(example: IExample, category: IExampleCategory): Promise<void> {

        if (this.activeExample === example) {
            return;
        }

        this.activeExample = example;

        const path = `${category.path}${example.path}`;

        this.createExample(path);

        window.location.hash = path;
        this.setTitle(example.title);
    }

    private async createExample(path: string): void {
        const source = await this.exampleLoader.loadExampleContent(path);

        const $frame: JQuery<HTMLIFrameElement> = $('<iframe>', {
            'class': 'preview-frame',
            'src': 'preview.html',
        });

        this.$preview.empty();
        this.$preview.append($frame);

        $frame.contents()
            .find('body')
            .append($(`<script>window.onload = function() { ${source} }</script>`));

        this.$code.html(source);

        if (this.activeEditor) {
            $(this.activeEditor.getWrapperElement()).remove();
        }

        this.activeEditor = CodeMirror.fromTextArea(this.$code[0], {
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

    private setTitle(title: string): void {
        document.title = `${title} - ExoJS Examples`;
        this.title = `Example Code: ${title}`;
    }
}