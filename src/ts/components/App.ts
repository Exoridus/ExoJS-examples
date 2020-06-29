import { customElement, html, internalProperty, LitElement, TemplateResult } from 'lit-element';
import { ExampleEntries, ExampleEntry, ExampleService } from '../classes/ExampleService';
import { NavLinkClicked } from './navigation/NavigationLink';
import styles from './App.module.scss';

@customElement('my-app')
export default class App extends LitElement {

    // @query('.editor-code') private codeElement: HTMLTextAreaElement | null = null;
    //
    // private activeEditor: CodeMirror.EditorFromTextArea | null = null;
    // private config: Config = new Config(config as IConfigOptions);

    @internalProperty() private exampleEntries: ExampleEntries | null = null;
    @internalProperty() private activeExample: ExampleEntry | null = null;
    private exampleService = new ExampleService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        this.exampleEntries = await this.exampleService.fetchExampleEntries();
    }

    public render(): TemplateResult {

        return html`
            <div class="${styles.app}">
                <my-navigation .exampleEntries="${this.exampleEntries}" @nav-link-clicked="${this.handleEntryClicked}" />
                <div class="${styles.appContent}">
                    Current Example: ${this.renderTest()}
                </div>
            </div>
        `;
    }

    private renderTest(): TemplateResult {

        if (!this.activeExample) {
            return html`NONE`;
        }

        return html`Name: ${this.activeExample.name}, File: ${this.activeExample.file}`;
    }

    private handleEntryClicked(event: CustomEvent<NavLinkClicked>): void {

        const exampleEntry = event.detail?.exampleEntry ?? null;

        if (exampleEntry && exampleEntry !== this.activeExample) {
            this.activeExample = exampleEntry;
        }
    }

    //
    // private setTitle(title: string): void {
    //     document.title = `${title} - ExoJS Examples`;
    // }
    //
    // private setCurrentHash(path: string): void {
    //     window.location.hash = path;
    // }
    //
    // private updateActiveEditor(source: string): void {
    //
    //     if (this.activeEditor) {
    //         const wrapper = this.activeEditor.getWrapperElement();
    //
    //         wrapper.parentNode?.removeChild(wrapper);
    //
    //         this.activeEditor = null;
    //     }
    //
    //     if (this.codeElement === null) {
    //         console.log('Could not find editor code element!');
    //
    //         return;
    //     }
    //
    //     this.codeElement.innerText = source;
    //
    //     this.activeEditor = CodeMirror.fromTextArea(this.codeElement, {
    //         mode: 'javascript',
    //         theme: 'monokai',
    //         lineNumbers: true,
    //         styleActiveLine: true,
    //         matchBrackets: true,
    //         viewportMargin: Infinity,
    //         lineWrapping: true,
    //         indentUnit: 4,
    //     });
    // }
    //
    // private async createIframeElement(source: string): Promise<HTMLIFrameElement> {
    //
    //     return new Promise<HTMLIFrameElement>(((resolve, reject) => {
    //
    //         const iframe = document.createElement('iframe');
    //
    //         iframe.classList.add('preview-frame');
    //
    //         iframe.onload = (): void => {
    //             try {
    //                 this.addIframeScript(iframe, source);
    //             } catch (e) {
    //                 return reject();
    //             }
    //
    //             resolve(iframe);
    //         };
    //
    //         iframe.onerror = (): void => reject();
    //
    //         iframe.src = 'preview.html';
    //     }));
    // }
    //
    // private addIframeScript(iframe: HTMLIFrameElement, source: string): void {
    //
    //     const iframeBody = iframe.contentWindow?.document.body;
    //
    //     if (!iframeBody) {
    //         throw new Error('Could not access iframe body element!');
    //     }
    //
    //     const script = document.createElement('script');
    //
    //     script.type = 'text/javascript';
    //     script.innerHTML = dedent`
    //         window.onload = function () {
    //             ${source}
    //         }
    //     `;
    //
    //     iframeBody.appendChild(script);
    // }
    //
    // private getActiveExample(): IExample | null {
    //
    //     const activePath = window.location.hash.slice(1);
    //
    //     for (const category of this.config.examples) {
    //         for (const example of category.examples) {
    //             if (!activePath || activePath === example.path) {
    //                 return example;
    //             }
    //         }
    //     }
    //
    //     return null;
    // }
    //
    // private async initExample({ path, title }: IExample): Promise<void> {
    //
    //     this.setTitle(title);
    //     this.setCurrentHash(path);
    //
    //     const source = await this.loadExampleText(path);
    //
    //     if (source === null) {
    //         console.log(`Error loading example text with path ${path}`);
    //
    //         return;
    //     }
    //
    //     const iframe = await this.createIframeElement(source);
    //
    //     this.updateActiveEditor(source);
    // }
    //
    // private async loadExampleText(path: string): Promise<string | null> {
    //
    //     try {
    //         const response = await fetch(`examples/js/${path}?no-cache=${Date.now()}`, {
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
}
