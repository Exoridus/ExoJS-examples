import $ from 'jquery';
import CodeMirror from 'codemirror';

import { config, ExamplesConfig, IExample, IExampleCategory } from './config';

export class ExampleLoader {
    private basePath: string;
    private requestOptions: RequestInit;
    private activePath = location.hash.slice(1);

    constructor(basePath: string, requestOptions: RequestInit) {
        this.basePath = basePath;
        this.requestOptions = requestOptions;
    }

    private async loadExample(category: IExampleCategory, example: IExample): Promise<string | null> {
        if (this.activeExample === example) {
            return null;
        }

        this.activeExample = example;
        this.activePath = `${category.path}${example.path}`;
        window.location.hash = this.activePath;
        document.title = `${example.title} - ExoJS Examples`;
        this.$title.html(`Example Code: ${example.title}`);

        const response = await fetch(`${this.basePath}${this.activePath}?no-cache=${Date.now()}`, this.requestOptions);

        return response.text();
    }

    public async loadExampleContent(path: string): Promise<string | null> {
        try {
            const response = await fetch(`${this.basePath}${path}?no-cache=${Date.now()}`, this.requestOptions);

            return response && response.text();
        } catch (e) {
            return null;
        }
    }

    private async createNavigation(examplesCategories: ExamplesConfig): Promise<void> {

        for (const category of examplesCategories) {
            this.$navigation.append($('<div>', {
                'class': 'navigation-sub-header',
                'html': category.title
            }));

            for (const example of category.examples) {
                this.$navigation.append($('<div>', {
                    'class': 'navigation-item',
                    'html': example.title
                }).on('click', () => this.loadExample(category, example)));

                if (!this.activePath || this.activePath === example.path) {
                    await this.loadExample(category, example);
                }
            }
        }
    }
}