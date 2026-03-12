import './EditorPreview';
import './EditorCode';

import styles, { css } from './Editor.module.scss';

import { autorun } from 'mobx';
import { MobxLitElement } from '@adobe/lit-mobx';
import { CSSResult, customElement, html, internalProperty, TemplateResult, unsafeCSS } from 'lit-element';
import { Example, ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';
import type { ResetCodeEvent, UpdateCodeEvent } from './EditorCode';
import type { PreviewErrorEntry, PreviewErrorsEvent } from './EditorPreview';

@customElement('my-editor')
export default class Editor extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    private exampleService: ExampleService = globalDependencies.get('exampleService');

    @internalProperty() private sourceCode: string | null = null;
    @internalProperty() private originalSourceCode: string | null = null;
    @internalProperty() private sourceLoadError: PreviewErrorEntry | null = null;
    @internalProperty() private previewErrors: Array<PreviewErrorEntry> = [];
    @internalProperty() private previewExecutionMode: 'defer-media' | 'immediate' = 'defer-media';

    private hasCompletedInitialExampleLoad = false;

    public connectedCallback(): void {
        super.connectedCallback();

        autorun(() => {
            this.loadSourceCode(this.exampleService.activeExample);
        });
    }

    private async loadSourceCode(example: Example | null): Promise<void> {
        if (example === null) {
            this.sourceCode = null;
            this.originalSourceCode = null;
            this.sourceLoadError = null;
            this.previewErrors = [];
            return;
        }

        this.sourceCode = null;
        this.originalSourceCode = null;
        this.sourceLoadError = null;
        this.previewErrors = [];
        this.previewExecutionMode = this.hasCompletedInitialExampleLoad ? 'immediate' : 'defer-media';

        try {
            const sourceCode = await this.exampleService.loadExampleSource(example.path);

            this.sourceCode = sourceCode;
            this.originalSourceCode = sourceCode;
            this.sourceLoadError = null;
            this.hasCompletedInitialExampleLoad = true;
        } catch (error) {
            this.sourceCode = null;
            this.originalSourceCode = null;
            this.sourceLoadError = {
                summary: 'Failed to load example source',
                details: error instanceof Error ? error.message : String(error),
            };
            this.hasCompletedInitialExampleLoad = true;
        }
    }

    public render(): TemplateResult {
        const activeExample = this.exampleService.activeExample;
        const combinedErrors = this.getCombinedErrors();

        if (activeExample === null && combinedErrors.length > 0) {
            return html`${this.renderErrors(combinedErrors)}`;
        }

        return html`
            ${this.renderExampleHeader(activeExample)}
            <section class=${styles.previewCard}>
                <my-editor-preview
                    .sourceCode=${this.sourceCode}
                    .exampleMeta=${activeExample}
                    .executionMode=${this.previewExecutionMode}
                    @preview-errors=${this.onPreviewErrors}
                ></my-editor-preview>
                ${this.renderErrors(combinedErrors)}
            </section>
            ${this.renderExampleNotes(activeExample)}
            <my-editor-code
                .sourceCode=${this.sourceCode}
                .sourcePath=${activeExample?.path || null}
                .canReset=${!!this.originalSourceCode && this.sourceCode !== this.originalSourceCode}
                @update-code=${this.onUpdateCode}
                @reset-code=${this.onResetCode}
            ></my-editor-code>
        `;
    }

    private onUpdateCode(event: CustomEvent<UpdateCodeEvent>): void {
        this.previewExecutionMode = 'immediate';
        this.sourceCode = event.detail.code;
    }

    private onResetCode(_event: CustomEvent<ResetCodeEvent>): void {
        if (this.originalSourceCode === null) {
            return;
        }

        this.previewExecutionMode = 'immediate';
        this.previewErrors = [];
        this.sourceCode = this.originalSourceCode;
    }

    private onPreviewErrors(event: CustomEvent<PreviewErrorsEvent>): void {
        this.previewErrors = event.detail.errors;
    }

    private renderExampleHeader(example: Example | null): TemplateResult {
        if (example === null) {
            return html``;
        }

        return html`
            <section class=${styles.metaHeader}>
                <h2 class=${styles.title} data-role="example-title">${example.title}</h2>
                <p class=${styles.description} data-role="example-description">${example.description}</p>
                ${(example.tags || []).length > 0 ? html`
                    <div class=${styles.tagList} data-role="example-tags">
                        ${(example.tags || []).map((tag) => html`
                            <button
                                class=${styles.tag}
                                data-role="example-tag"
                                @click=${() => this.onTagClick(tag)}
                            >${tag}</button>
                        `)}
                    </div>
                ` : ''}
            </section>
        `;
    }

    private renderErrors(errors: Array<PreviewErrorEntry>): TemplateResult {
        if (errors.length === 0) {
            return html``;
        }

        return html`
            <details class=${styles.errorPanel} data-role="error-panel">
                <summary class=${styles.errorSummary}>
                    <span class=${styles.errorSummaryLabel}>Errors</span>
                    <span class=${styles.errorSummaryCount}>${errors.length}</span>
                </summary>
                <div class=${styles.errorBody}>
                    ${errors.map((error) => html`
                        <article class=${styles.errorItem} data-role="error-item">
                            <h3 class=${styles.errorItemTitle}>${error.summary}</h3>
                            ${error.details && error.details !== error.summary
                                ? html`<pre class=${styles.errorDetails}>${error.details}</pre>`
                                : ''}
                        </article>
                    `)}
                </div>
            </details>
        `;
    }

    private renderExampleNotes(example: Example | null): TemplateResult {
        if (example === null) {
            return html``;
        }

        const notes = example.notes || [];

        if (notes.length === 0) {
            return html``;
        }

        return html`
            <section class=${styles.notesPanel}>
                <div class=${styles.metaBlock}>
                    <h3 class=${styles.metaHeading}>Notes</h3>
                    <ul class=${styles.notesList} data-role="example-notes">
                        ${notes.map((note) => html`<li>${note}</li>`)}
                    </ul>
                </div>
            </section>
        `;
    }

    private getCombinedErrors(): Array<PreviewErrorEntry> {
        return [
            ...(this.exampleService.loadError ? [{
                summary: 'Failed to load examples catalog',
                details: this.exampleService.loadError,
            }] : []),
            ...(this.sourceLoadError ? [this.sourceLoadError] : []),
            ...this.previewErrors,
        ];
    }

    private onTagClick(tag: string): void {
        this.exampleService.setActiveTagFilter(tag);
    }
}
