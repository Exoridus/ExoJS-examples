import './Toolbar';
import './Button';
import './LoadingSpinner';

import styles, { css } from './EditorCode.module.scss';

import {
    CSSResult,
    customElement,
    html,
    internalProperty,
    property,
    PropertyValues,
    query,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import type * as Monaco from 'monaco-editor';
import { ExampleService } from '../services/ExampleService';
import { UrlService } from '../services/UrlService';
import { globalDependencies } from '../classes/globalDependencies';

export interface UpdateCodeEvent {
    code: string;
}

export interface ResetCodeEvent {
    confirmed: true;
}

interface MonacoAmdRequire {
    config(configuration: { paths: Record<string, string> }): void;
    (
        modules: string[],
        onLoad: () => void,
        onError?: (error: unknown) => void
    ): void;
}

declare global {
    interface Window {
        require?: MonacoAmdRequire;
        monaco?: typeof Monaco;
    }
}

interface MonacoLanguageDefaults {
    setEagerModelSync(value: boolean): void;
    setCompilerOptions(options: Record<string, unknown>): void;
    setDiagnosticsOptions(options: Record<string, unknown>): void;
    addExtraLib(content: string, filePath?: string): unknown;
}

interface MonacoTypeScriptApi {
    javascriptDefaults: MonacoLanguageDefaults;
    typescriptDefaults: MonacoLanguageDefaults;
    ModuleKind: { ESNext: number };
    ModuleResolutionKind: { NodeJs: number };
    ScriptTarget: { ES2020: number };
}

const EXO_JS_LIB_FILES = [
    { path: 'vendor/exojs/exo.d.ts', virtualPath: 'file:///node_modules/exojs/dist/exo.d.ts' },
    { path: 'vendor/exojs/webgl2.d.ts', virtualPath: 'file:///node_modules/exojs/dist/webgl2.d.ts' },
    { path: 'vendor/exojs/webgpu.d.ts', virtualPath: 'file:///node_modules/exojs/dist/webgpu.d.ts' },
    { path: 'vendor/exojs/module-shims.d.ts', virtualPath: 'file:///node_modules/exojs/dist/module-shims.d.ts' },
    { path: 'examples/shared/editor-support.d.ts', virtualPath: 'file:///node_modules/@examples/editor-support/index.d.ts' },
    { path: 'examples/shared/runtime.d.ts', virtualPath: 'file:///node_modules/@examples/runtime/index.d.ts' },
] as const;

let monacoLoadPromise: Promise<typeof Monaco> | null = null;
let monacoConfiguredPromise: Promise<void> | null = null;
const MONACO_FONT_FAMILY = 'Consolas, "SFMono-Regular", Menlo, Monaco, "Courier New", monospace';

@customElement('my-editor-code')
export default class EditorCode extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    @property() public sourceCode: string | null = null;
    @property() public sourcePath: string | null = null;
    @property({ type: Boolean }) public canReset = false;
    @internalProperty() private diagnosticsCount = 0;
    @query(`.${styles.editorHost}`) private editorHostElement?: HTMLDivElement;

    private exampleService: ExampleService = globalDependencies.get('exampleService');
    private urlService: UrlService = globalDependencies.get('urlService');
    public editorView: Monaco.editor.IStandaloneCodeEditor | null = null;

    private editorModel: Monaco.editor.ITextModel | null = null;
    private markerListener: Monaco.IDisposable | null = null;

    public render(): TemplateResult {
        const exampleName = this.exampleService.activeExample?.title || 'Loading...';

        return html`
            <my-toolbar title=${`Example Code: ${exampleName}`}>
                <my-button
                    data-action="refresh"
                    ?disabled=${!this.sourceCode}
                    @click=${this.triggerRefreshPreview}
                >REFRESH</my-button>
                <my-button
                    data-action="reset"
                    ?disabled=${!this.canReset}
                    @click=${this.triggerResetCode}
                >RESET</my-button>
                ${this.diagnosticsCount > 0
                    ? html`<span class=${styles.diagnostics} data-role="toolbar-status">${this.diagnosticsCount} diagnostic${this.diagnosticsCount === 1 ? '' : 's'}</span>`
                    : ''}
            </my-toolbar>
            ${this.renderContent()}
        `;
    }

    private renderContent(): TemplateResult {
        return html`
            <div class=${styles.editorShell}>
                <div class=${styles.editorHost}></div>
                ${!this.sourceCode
                    ? html`<div class=${styles.loadingOverlay}><my-loading-spinner centered></my-loading-spinner></div>`
                    : ''}
            </div>
        `;
    }

    public updated(changedProperties: PropertyValues): void {
        if (
            (!changedProperties.has('sourceCode') && !changedProperties.has('sourcePath')) ||
            this.sourceCode === null
        ) {
            return;
        }

        void this.ensureEditorState(this.sourceCode, this.sourcePath);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.editorModel?.dispose();
        this.editorModel = null;
        this.markerListener?.dispose();
        this.markerListener = null;
        this.editorView?.dispose();
        this.editorView = null;
    }

    private async ensureEditorState(sourceCode: string, sourcePath: string | null): Promise<void> {
        const monaco = await this.loadMonaco();

        await this.configureMonaco(monaco);
        await Promise.all([
            this.ensureMonacoStyles(),
            this.ensureMonacoGlobalStyles(),
        ]);

        if (!this.editorHostElement) {
            return;
        }

        if (this.editorView === null) {
            this.initializeEditor(monaco, sourceCode, sourcePath);
            return;
        }

        this.updateEditorModel(monaco, sourceCode, sourcePath);
        this.editorView.layout();
    }

    private initializeEditor(monaco: typeof Monaco, sourceCode: string, sourcePath: string | null): void {
        if (!this.editorHostElement || this.editorView !== null) {
            return;
        }

        this.editorModel = this.createModel(monaco, sourceCode, sourcePath);
        this.editorView = monaco.editor.create(this.editorHostElement, {
            model: this.editorModel,
            theme: 'vs-dark',
            automaticLayout: true,
            fixedOverflowWidgets: true,
            fontFamily: MONACO_FONT_FAMILY,
            fontSize: 14,
            glyphMargin: false,
            hover: {
                enabled: true,
                sticky: true,
            },
            lineDecorationsWidth: 8,
            lineHeight: 21,
            lineNumbersMinChars: 4,
            minimap: { enabled: false },
            overviewRulerLanes: 0,
            renderValidationDecorations: 'on',
            scrollBeyondLastLine: false,
            tabSize: 4,
        });
        this.remeasureEditorFonts(monaco);
        requestAnimationFrame(() => this.editorView?.layout());
        this.installDiagnosticsTracking(monaco);
        this.updateDiagnostics(monaco);
    }

    private updateEditorModel(monaco: typeof Monaco, sourceCode: string, sourcePath: string | null): void {
        if (this.editorView === null) {
            return;
        }

        const nextModelUri = monaco.Uri.parse(this.getModelUrl(sourcePath)).toString();

        if (!this.editorModel || this.editorModel.uri.toString() !== nextModelUri) {
            this.editorModel?.dispose();
            this.editorModel = this.createModel(monaco, sourceCode, sourcePath);
            this.editorView.setModel(this.editorModel);
            this.updateDiagnostics(monaco);
            return;
        }

        if (this.editorModel.getValue() !== sourceCode) {
            this.editorModel.setValue(sourceCode);
        }
    }

    private createModel(
        monaco: typeof Monaco,
        sourceCode: string,
        sourcePath: string | null
    ): Monaco.editor.ITextModel {
        return monaco.editor.createModel(
            sourceCode,
            'javascript',
            monaco.Uri.parse(this.getModelUrl(sourcePath))
        );
    }

    private ensureMonacoStyles(): Promise<void> {
        const renderRoot = this.renderRoot as ShadowRoot;

        if (!renderRoot) {
            return Promise.resolve();
        }

        return this.ensureMonacoStylesheet(renderRoot, 'link[data-monaco-style="editor-main"]', 'editor-main');
    }

    private ensureMonacoGlobalStyles(): Promise<void> {
        const head = document.head;

        if (!head) {
            return Promise.resolve();
        }

        return Promise.all([
            this.ensureMonacoStylesheet(head, 'link[data-monaco-style="editor-main-global"]', 'editor-main-global'),
            this.ensureMonacoWidgetOverrides(head),
        ]).then(() => undefined);
    }

    private ensureMonacoStylesheet(
        container: ParentNode,
        selector: string,
        styleMarker: string
    ): Promise<void> {
        const existingStylesheet = container.querySelector(selector) as HTMLLinkElement | null;

        if (existingStylesheet) {
            if (existingStylesheet.dataset.loaded === 'true' || existingStylesheet.sheet) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                existingStylesheet.addEventListener('load', () => {
                    existingStylesheet.dataset.loaded = 'true';
                    resolve();
                }, { once: true });
                existingStylesheet.addEventListener('error', () => {
                    reject(new Error('Failed to load Monaco editor styles.'));
                }, { once: true });
            });
        }

        const stylesheet = document.createElement('link');

        stylesheet.rel = 'stylesheet';
        stylesheet.href = this.urlService.buildPublicUrl('vendor/monaco/vs/editor/editor.main.css');
        stylesheet.dataset.monacoStyle = styleMarker;

        container.appendChild(stylesheet);

        return new Promise((resolve, reject) => {
            stylesheet.addEventListener('load', () => {
                stylesheet.dataset.loaded = 'true';
                resolve();
            }, { once: true });
            stylesheet.addEventListener('error', () => {
                reject(new Error(`Failed to load Monaco stylesheet from ${stylesheet.href}.`));
            }, { once: true });
        });
    }

    private ensureMonacoWidgetOverrides(container: ParentNode): Promise<void> {
        const selector = 'style[data-monaco-widget-overrides="true"]';
        const existingOverrides = container.querySelector(selector) as HTMLStyleElement | null;

        if (existingOverrides) {
            return Promise.resolve();
        }

        const overrides = document.createElement('style');

        overrides.dataset.monacoWidgetOverrides = 'true';
        overrides.textContent = `
            .monaco-editor .suggest-widget,
            .monaco-editor-hover,
            .monaco-hover,
            .parameter-hints-widget,
            .context-view.monaco-menu-container {
                max-width: min(720px, calc(100vw - 32px)) !important;
            }

            .monaco-editor .suggest-widget,
            .context-view.monaco-menu-container {
                width: max-content !important;
                min-width: 320px !important;
            }

            .monaco-editor .suggest-widget .tree,
            .monaco-editor .suggest-widget .monaco-list,
            .monaco-editor .suggest-widget .monaco-list-row,
            .monaco-editor .suggest-widget .monaco-list-row > .contents {
                width: auto !important;
                min-width: 0 !important;
            }

            .monaco-editor .suggest-widget .monaco-list-row > .contents,
            .context-view.monaco-menu-container .action-label,
            .monaco-editor-hover .hover-row,
            .monaco-editor-hover .hover-contents {
                white-space: normal !important;
                max-width: none !important;
            }
        `;

        container.appendChild(overrides);

        return Promise.resolve();
    }

    private getModelUrl(sourcePath: string | null): string {
        const normalizedPath = (sourcePath || 'examples/active-example.js').replace(/^\/+/, '');

        return `file:///${normalizedPath}`;
    }

    private async loadMonaco(): Promise<typeof Monaco> {
        if (window.monaco) {
            return window.monaco;
        }

        if (monacoLoadPromise) {
            return monacoLoadPromise;
        }

        const loaderUrl = this.urlService.buildPublicUrl('vendor/monaco/vs/loader.js', {
            'no-cache': Date.now(),
        });
        const vsPath = this.urlService.buildPublicUrl('vendor/monaco/vs');

        monacoLoadPromise = new Promise((resolve, reject) => {
            const initializeAmdLoader = () => {
                const amdRequire = window.require;

                if (!amdRequire) {
                    reject(new Error('Monaco AMD loader is not available.'));
                    return;
                }

                amdRequire.config({
                    paths: {
                        vs: vsPath,
                    },
                });
                amdRequire(
                    ['vs/editor/editor.main'],
                    () => {
                        if (!window.monaco) {
                            reject(new Error('Monaco editor failed to initialize.'));
                            return;
                        }

                        resolve(window.monaco);
                    },
                    (error) => reject(error)
                );
            };

            if (typeof window.require === 'function') {
                initializeAmdLoader();
                return;
            }

            const script = document.createElement('script');

            script.src = loaderUrl;
            script.async = true;
            script.onload = initializeAmdLoader;
            script.onerror = () => reject(new Error(`Failed to load Monaco loader from ${loaderUrl}.`));

            document.head.appendChild(script);
        });

        return monacoLoadPromise;
    }

    private async configureMonaco(monaco: typeof Monaco): Promise<void> {
        if (monacoConfiguredPromise) {
            return monacoConfiguredPromise;
        }

        monacoConfiguredPromise = this.registerExoJsLibraries(monaco);
        return monacoConfiguredPromise;
    }

    private installDiagnosticsTracking(monaco: typeof Monaco): void {
        if (this.markerListener) {
            return;
        }

        this.markerListener = monaco.editor.onDidChangeMarkers((resources) => {
            if (!this.editorModel) {
                return;
            }

            if (resources.some((resource) => resource.toString() === this.editorModel?.uri.toString())) {
                this.updateDiagnostics(monaco);
            }
        });
    }

    private async registerExoJsLibraries(monaco: typeof Monaco): Promise<void> {
        const typescriptLanguage = monaco.languages.typescript as unknown as MonacoTypeScriptApi;
        const compilerOptions = {
            allowJs: true,
            allowNonTsExtensions: true,
            allowSyntheticDefaultImports: true,
            checkJs: true,
            esModuleInterop: true,
            module: typescriptLanguage.ModuleKind.ESNext,
            moduleResolution: typescriptLanguage.ModuleResolutionKind.NodeJs,
            noEmit: true,
            strict: true,
            target: typescriptLanguage.ScriptTarget.ES2020,
        };
        const diagnosticsOptions = {
            noSemanticValidation: false,
            noSyntaxValidation: false,
        };

        typescriptLanguage.javascriptDefaults.setEagerModelSync(true);
        typescriptLanguage.typescriptDefaults.setEagerModelSync(true);
        typescriptLanguage.javascriptDefaults.setCompilerOptions(compilerOptions);
        typescriptLanguage.typescriptDefaults.setCompilerOptions(compilerOptions);
        typescriptLanguage.javascriptDefaults.setDiagnosticsOptions(diagnosticsOptions);
        typescriptLanguage.typescriptDefaults.setDiagnosticsOptions(diagnosticsOptions);

        const libraryContents = await Promise.all(
            EXO_JS_LIB_FILES.map(async (libraryFile) => ({
                ...libraryFile,
                content: await this.fetchTextFile(this.urlService.buildPublicUrl(libraryFile.path)),
            }))
        );

        for (const library of libraryContents) {
            typescriptLanguage.javascriptDefaults.addExtraLib(library.content, library.virtualPath);
            typescriptLanguage.typescriptDefaults.addExtraLib(library.content, library.virtualPath);
        }
    }

    private async fetchTextFile(url: string): Promise<string> {
        const response = await fetch(url, { cache: 'no-cache' });

        if (!response.ok) {
            throw new Error(`Failed to fetch editor support file at ${url}.`);
        }

        return response.text();
    }

    private updateDiagnostics(monaco: typeof Monaco): void {
        if (!this.editorModel) {
            this.diagnosticsCount = 0;
            return;
        }

        this.diagnosticsCount = monaco.editor.getModelMarkers({
            resource: this.editorModel.uri,
        }).length;
    }

    private remeasureEditorFonts(monaco: typeof Monaco): void {
        const monacoEditorApi = monaco.editor as typeof Monaco.editor & {
            remeasureFonts?: () => void;
        };

        monacoEditorApi.remeasureFonts?.();
    }

    private triggerRefreshPreview(): void {
        if (this.editorView === null) {
            return;
        }

        const updateCodeEvent = new CustomEvent<UpdateCodeEvent>('update-code', {
            detail: {
                code: this.editorView.getValue(),
            },
        });

        this.dispatchEvent(updateCodeEvent);
    }

    private triggerResetCode(): void {
        if (!this.canReset || !window.confirm('Reset the editor to the original example source?')) {
            return;
        }

        const resetCodeEvent = new CustomEvent<ResetCodeEvent>('reset-code', {
            detail: {
                confirmed: true,
            },
        });

        this.dispatchEvent(resetCodeEvent);
    }
}
