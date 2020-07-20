import { action, computed, observable, runInAction } from 'mobx';
import { RequestService } from './RequestService';
import { UrlService } from './UrlService';

export interface ExamplesResponse {
    [directory: string]: Array<string>;
}

export interface Example {
    name: string;
    path: string;
}

export type ExamplesMap = Map<string, Array<Example>>;

export class ExampleService {
    private readonly urlService: UrlService;
    private readonly requestService: RequestService;

    @observable
    private examplesResponse: ExamplesResponse | null = null;

    @observable
    public activeExample: Example | null = null;

    @computed
    public get nestedExamples(): ExamplesMap {
        const data = this.hasExamples ? Object.entries(this.examplesResponse!) : [];

        return new Map(
            data.map(([directory, fileNames]) => [
                this.getCleanName(directory),
                fileNames.map(fileName => ({
                    name: this.getCleanName(fileName),
                    path: `${directory}/${fileName}.js`,
                })),
            ])
        );
    }

    @computed
    public get examplesList(): Array<Example> {
        return Array.from(this.nestedExamples.values()).reduce((result, examples) => [...result, ...examples], []);
    }

    @computed
    public get hasExamples(): boolean {
        return this.examplesResponse !== null;
    }

    public constructor(urlService: UrlService, requestService: RequestService) {
        this.urlService = urlService;
        this.requestService = requestService;

        this.loadExampleData();
    }

    @action
    public setCurrentExample(currentExample: Example | null): void {
        this.activeExample = currentExample;
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
        const request = this.requestService.createUniqueRequest(url);
        const exampleData = await request.getJson<ExamplesResponse>();

        if (exampleData === null) {
            throw new Error(`Could not fetch examples config at ${url}!`);
        }

        runInAction(() => {
            this.examplesResponse = exampleData;
        });
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
