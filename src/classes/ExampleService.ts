import { action, observable } from 'mobx';
import { RequestService } from './RequestService';

export interface ExampleResponse {
    [directory: string]: Array<string>;
}

export interface ExampleEntry {
    name: string;
    path: string;
}

export type ExampleEntries = Map<string, Array<ExampleEntry>>;

export class ExampleService {

    private readonly requestService: RequestService;
    private readonly sourcePath = `public/js`;
    private readonly manifestPath = `public/examples.json`;

    @observable
    public exampleEntries: ExampleEntries | null = null;

    @observable
    public activeExample: ExampleEntry | null = null;

    constructor(requestService: RequestService) {
        this.requestService = requestService;

        this.loadExampleEntries();
    }

    public async loadExampleSource(filePath: string): Promise<string> {

        const examples = await this.requestService.fetchTextData(`${this.sourcePath}/${filePath}`, {
            'no-cache': Date.now(),
        });

        if (examples === null) {
            throw new Error(`Could not fetch file ${filePath} on path ${this.sourcePath}!`);
        }

        return examples;
    }

    @action
    private async loadExampleEntries(): Promise<void> {

        const exampleResponse = await this.requestService.fetchJsonData<ExampleResponse>(this.manifestPath, {
            'no-cache': Date.now(),
        });

        if (exampleResponse === null) {
            throw new Error(`Could not fetch manifest.json on path ${this.manifestPath}!`);
        }

        this.exampleEntries = this.mapExampleResponseToEntries(exampleResponse);
    }

    private mapExampleResponseToEntries(exampleResponse: ExampleResponse): ExampleEntries {

        return new Map(Object.entries(exampleResponse).map(([directory, fileNames]) => [
            this.getCleanName(directory),
            fileNames.map((fileName => ({
                name: this.getCleanName(fileName),
                path: `${directory}/${fileName}.js`,
            })))
        ]));
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