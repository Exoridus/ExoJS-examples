import './Editor';
import './Navigation';

import styles, { css } from './App.module.scss';

import { CSSResult, customElement, html, TemplateResult, unsafeCSS } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import { ExampleService } from '../services/ExampleService';
import { globalDependencies } from '../classes/globalDependencies';
import { LocationService } from '../services/LocationService';
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
            <aside class=${styles.sideContent}>
                <my-navigation></my-navigation>
            </aside>
            <main class=${styles.mainContent}>
                <my-editor></my-editor>
            </main>
        `;
    }
}
