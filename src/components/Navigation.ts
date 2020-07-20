import './NavigationLink';
import './NavigationSection';
import './LoadingSpinner';

import styles, { css } from './Navigation.module.scss';

import { CSSResult, customElement, html, TemplateResult, unsafeCSS } from 'lit-element';
import { Example, ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';
import { MobxLitElement } from '@adobe/lit-mobx';

@customElement('my-navigation')
export default class Navigation extends MobxLitElement {
    public static styles: CSSResult = unsafeCSS(css);

    private exampleService: ExampleService = globalDependencies.get('exampleService');

    public render(): TemplateResult {
        return html`
            <header>
                <h1 class=${styles.title}>ExoJs Examples</h1>
            </header>
            <nav>
                ${this.renderContent()}
            </nav>
        `;
    }

    private renderContent(): TemplateResult {
        const { hasExamples, nestedExamples } = this.exampleService;

        if (!hasExamples) {
            return html`<my-loading-indicator centered />`;
        }

        const categories = Array.from(nestedExamples.entries());

        return html`${categories.map(([category, entries]) => this.renderCategory(category, entries))}`;
    }

    private renderCategory(headline: string, entries: Array<Example>): TemplateResult {
        return html`
            <my-navigation-section headline=${headline}>
                ${entries.map(({ name, path }) => this.renderLink(name, path))}
            </my-navigation-section>
        `;
    }

    private renderLink(name: string, path: string): TemplateResult {
        return html` <my-navigation-link href="#${path}">${name}</my-navigation-link> `;
    }
}
