import './NavigationLink';
import './NavigationSection';
import './LoadingSpinner';

import styles, { css } from './Navigation.module.scss';

import { CSSResult, customElement, html, internalProperty, TemplateResult, unsafeCSS } from 'lit-element';
import { autorun, IReactionDisposer } from 'mobx';
import { Example, ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';
import { MobxLitElement } from '@adobe/lit-mobx';

@customElement('my-navigation')
export default class Navigation extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    private exampleService: ExampleService = globalDependencies.get('exampleService');
    private filterSyncDisposer: IReactionDisposer | null = null;
    @internalProperty() private tagInputValue = '';

    public connectedCallback(): void {
        super.connectedCallback();

        this.filterSyncDisposer = autorun(() => {
            this.tagInputValue = this.exampleService.activeTagFilter || '';
        });
    }

    public disconnectedCallback(): void {
        this.filterSyncDisposer?.();
        this.filterSyncDisposer = null;
        super.disconnectedCallback();
    }

    public render(): TemplateResult {
        const activeTagFilter = this.exampleService.activeTagFilter;

        return html`
            <header>
                <h1 class=${styles.title}>ExoJs Examples</h1>
            </header>
            <section class=${styles.filterBar}>
                <label class=${styles.filterLabel} for="tag-filter">Filter by tag</label>
                <div class=${styles.filterControls}>
                    <input
                        id="tag-filter"
                        class=${styles.filterInput}
                        list="tag-filter-options"
                        .value=${this.tagInputValue}
                        placeholder="Pick a tag"
                        @input=${this.onTagInput}
                        @change=${this.onTagChange}
                        @keydown=${this.onTagKeyDown}
                    >
                    <datalist id="tag-filter-options">
                        ${this.exampleService.availableTags.map((tag) => html`<option value=${tag}></option>`)}
                    </datalist>
                    ${activeTagFilter
                        ? html`<button class=${styles.clearButton} @click=${this.onClearFilter}>Clear</button>`
                        : ''}
                </div>
            </section>
            <nav>
                ${this.renderContent()}
            </nav>
        `;
    }

    private renderContent(): TemplateResult {
        const { hasExamples, filteredNestedExamples, loadError } = this.exampleService;

        if (loadError) {
            return html`<p class=${styles.error}>${loadError}</p>`;
        }

        if (!hasExamples) {
            return html`<my-loading-spinner centered />`;
        }

        const categories = Array.from(filteredNestedExamples.entries());

        return html`${categories.map(([category, entries]) => this.renderCategory(category, entries))}`;
    }

    private renderCategory(headline: string, entries: Array<Example>): TemplateResult {
        return html`
            <my-navigation-section headline=${headline}>
                ${entries.map((entry) => this.renderLink(entry))}
            </my-navigation-section>
        `;
    }

    private renderLink(example: Example): TemplateResult {
        return html`
            <my-navigation-link
                href="#${example.path}"
                title=${example.title}
                description=${example.description}
                ?active=${this.exampleService.activeExample?.path === example.path}
            ></my-navigation-link>
        `;
    }

    private onTagInput(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;

        this.tagInputValue = input.value;
    }

    private onTagChange(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;

        this.applyTagFilter(input.value);
    }

    private onTagKeyDown(event: KeyboardEvent): void {
        if (event.key !== 'Enter') {
            return;
        }

        event.preventDefault();
        this.applyTagFilter((event.currentTarget as HTMLInputElement).value);
    }

    private onClearFilter(): void {
        this.tagInputValue = '';
        this.exampleService.setActiveTagFilter(null);
    }

    private applyTagFilter(value: string): void {
        const normalizedValue = value.trim();

        if (normalizedValue === '') {
            this.tagInputValue = '';
            this.exampleService.setActiveTagFilter(null);
            return;
        }

        const matchedTag = this.exampleService.availableTags.find((tag) => tag === normalizedValue);

        if (!matchedTag) {
            this.tagInputValue = this.exampleService.activeTagFilter || '';
            return;
        }

        this.tagInputValue = matchedTag;
        this.exampleService.setActiveTagFilter(matchedTag);
    }
}
