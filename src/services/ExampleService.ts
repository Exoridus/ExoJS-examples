import { action, computed, observable, runInAction } from 'mobx';
import { RequestService } from './RequestService';
import { UrlService } from './UrlService';

export interface ExamplesResponse {
    [directory: string]: Array<ExampleDefinition>;
}

export type ExampleBackend = 'core' | 'webgl2' | 'webgpu' | 'advanced';

export interface ExampleDefinition {
    slug: string;
    path: string;
    title: string;
    description: string;
    backend: ExampleBackend;
    notes?: Array<string>;
    unsupportedNote?: string;
    tags?: Array<string>;
    order?: number;
    status?: string;
}

export interface Example extends ExampleDefinition {
    section: string;
}

export type ExamplesMap = Map<string, Array<Example>>;

export class ExampleService {
    private readonly urlService: UrlService;
    private readonly requestService: RequestService;

    @observable
    private examplesResponse: ExamplesResponse | null = null;

    @observable
    public activeExample: Example | null = null;

    @observable
    public loadError: string | null = null;

    @observable
    public activeTagFilter: string | null = null;

    @computed
    public get nestedExamples(): ExamplesMap {
        const data = this.hasExamples ? Object.entries(this.examplesResponse!) : [];

        return new Map(
            data.map(([directory, exampleDefinitions]) => [
                this.getCleanName(directory),
                exampleDefinitions
                    .slice()
                    .sort((exampleA, exampleB) => (exampleA.order || 0) - (exampleB.order || 0))
                    .map((exampleDefinition) => ({
                        ...exampleDefinition,
                        section: directory,
                    })),
            ])
        );
    }

    @computed
    public get filteredNestedExamples(): ExamplesMap {
        if (!this.activeTagFilter) {
            return this.nestedExamples;
        }

        const filteredEntries = Array.from(this.nestedExamples.entries())
            .map(([section, examples]) => [
                section,
                examples.filter((example) => (example.tags || []).includes(this.activeTagFilter!)),
            ] as [string, Array<Example>])
            .filter(([, examples]) => examples.length > 0);

        return new Map(filteredEntries);
    }

    @computed
    public get examplesList(): Array<Example> {
        return Array.from(this.nestedExamples.values()).reduce((result, examples) => [...result, ...examples], []);
    }

    @computed
    public get availableTags(): Array<string> {
        return Array.from(new Set(
            this.examplesList.flatMap((example) => example.tags || [])
        )).sort((left, right) => left.localeCompare(right));
    }

    @computed
    public get hasExamples(): boolean {
        return this.examplesResponse !== null;
    }

    public constructor(urlService: UrlService, requestService: RequestService) {
        this.urlService = urlService;
        this.requestService = requestService;

        void this.loadExampleData();
    }

    @action
    public setCurrentExample(currentExample: Example | null): void {
        this.activeExample = currentExample;
    }

    @action
    public setActiveTagFilter(tag: string | null): void {
        this.activeTagFilter = tag && tag.trim() ? tag.trim() : null;
    }

    public getExampleByPath(path: string): Example | null {
        return this.examplesList.find(example => example.path === path) || null;
    }

    public async loadExampleSource(filePath: string): Promise<string> {
        const url = this.urlService.buildExampleUrl(filePath, { 'no-cache': Date.now() });
        const request = this.requestService.createUniqueRequest(url);

        const response = await request.getText();

        if (response === null) {
            throw new Error(`Could not fetch example source at ${url}!`);
        }

        return response;
    }

    @action
    private async loadExampleData(): Promise<void> {
        const url = this.urlService.buildExampleUrl('examples.json', { 'no-cache': Date.now() });
        this.loadError = null;

        try {
            const request = this.requestService.createUniqueRequest(url);
            const exampleData = await request.getJson<ExamplesResponse>();

            if (exampleData === null) {
                throw new Error(`Could not load the examples catalog from ${url}.`);
            }

            runInAction(() => {
                this.examplesResponse = exampleData;
                this.loadError = null;
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            runInAction(() => {
                this.examplesResponse = null;
                this.loadError = message;
            });
        }
    }

    private getCleanName(text: string): string {
        return text
            .split('-')
            .map((part: string) =>
                [...part].some(char => char !== char.toUpperCase()) ? part[0].toUpperCase() + part.substr(1) : part
            )
            .join(' ');
    }
}
