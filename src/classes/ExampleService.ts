import { action, computed, observable, runInAction, toJS } from 'mobx';
import { RequestService } from './RequestService';

export interface ExampleData {
    [directory: string]: Array<string>;
}

export interface Example {
    name: string;
    path: string;
}

export type ExamplesMap = Map<string, Array<Example>>;

export class ExampleService {

    private readonly requestService: RequestService;
    private readonly sourcePath = 'public/js';
    private readonly manifestPath = 'public/examples.json';

    @observable
    public exampleData: ExampleData | null = null;

    @observable
    public currentExample: Example | null = null;

    @computed
    public get nestedExamples(): ExamplesMap {

        const data = this.hasExamples
            ? Object.entries(this.exampleData!)
            : [];

        return new Map(data.map(([directory, fileNames]) => [
            this.getCleanName(directory),
            fileNames.map(fileName => ({
                name: this.getCleanName(fileName),
                path: `${directory}/${fileName}.js`,
            }))
        ]));
    }

    @computed
    public get examplesList(): Array<Example> {

        return Array.from(this.nestedExamples.values()).reduce((result, examples) => ([
            ...result,
            ...examples,
        ]), []);
    }

    @computed
    public get hasExamples(): boolean {
        return this.exampleData !== null;
    }

    public constructor(requestService: RequestService) {
        this.requestService = requestService;

        this.loadExampleData();
    }

    public getExampleByPath(path: string): Example | null {

        return this.examplesList.find(example => example.path === path) || null;
    }

    @action
    public setCurrentExample(example: Example | null): void {
        this.currentExample = example;
    }

    public async loadExampleSource(filePath: string): Promise<string> {

        const request = this.requestService.createUniqueRequest(`${this.sourcePath}/${filePath}`, {
            'no-cache': Date.now(),
        });

        const response = await request.getText();

        if (response === null) {
            throw new Error(`Could not fetch file ${filePath} on path ${this.sourcePath}!`);
        }

        return response;
    }

    @action
    private async loadExampleData(): Promise<void> {

        const request = this.requestService.createUniqueRequest(this.manifestPath, {
            'no-cache': Date.now(),
        });

        const exampleData = await request.getJson<ExampleData>();

        if (exampleData === null) {
            throw new Error(`Could not fetch manifest.json on path ${this.manifestPath}!`);
        }

        runInAction(() => {
            this.exampleData = exampleData;
        });
    }

    private getCleanName(text: string): string {

        return text.split('-')
            .map(
                (part: string) => [...part].some(char => char !== char.toUpperCase())
                    ? part[0].toUpperCase() + part.substr(1)
                    : part
            )
            .join(' ')
    }
}