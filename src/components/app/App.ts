import styles, { css } from './App.module.scss';

import { CSSResult, customElement, html, TemplateResult, unsafeCSS } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import { ExampleService } from '../../classes/ExampleService';
import { globalDependencies } from '../../classes/globalDependencies';
import { LocationService } from '../../classes/LocationService';
import { reaction } from 'mobx';

@customElement('my-app')
export default class App extends MobxLitElement {
    private exampleService: ExampleService = globalDependencies.get('exampleService');
    private locationService: LocationService = globalDependencies.get('locationService');

    public static styles: CSSResult = unsafeCSS(css);

    public connectedCallback(): void {
        super.connectedCallback();

        reaction(
            () => [this.locationService.currentHash, this.exampleService.hasExamples] as [string, boolean],
            ([currentHash, hasExamples]) => {
                if (!hasExamples) {
                    return;
                }

                if (!currentHash) {
                    this.locationService.setHash(this.exampleService.examplesList[0]?.path);

                    return;
                }

                const example = this.exampleService.getExampleByPath(currentHash);

                this.exampleService.setCurrentExample(example);
            }
        );
    }

    public render(): TemplateResult {
        return html`
            <div class="${styles.app}">
                <aside class=${styles.navigation}>
                    <div class=${styles.viewport}>
                        <header>
                            <h1 class=${styles.title}>ExoJs Examples</h1>
                        </header>
                        <my-navigation />
                    </div>
                </aside>
                <main class="${styles.content}">
                    <my-editor />
                </main>
            </div>
        `;
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
    //         const response = await fetch(`public/js/${path}?no-cache=${Date.now()}`, {
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
