export interface URLParams {
    [param: string]: string | number;
}

export interface ExampleEntry {
    name: string;
    file: string;
}

export type ExampleEntries = Map<string, Array<ExampleEntry>>;

export class ExampleService {

    private readonly sourcePath = `examples/js`;
    private readonly manifestPath = `examples/manifest.json`;
    private readonly requestOptions: RequestInit = {
        cache: 'no-cache',
        method: 'GET',
        mode: 'cors',
    };

    public async fetchExampleEntries(): Promise<ExampleEntries> {

        const examples = await this.createRequest(this.manifestPath, {
            'no-cache': Date.now(),
        });

        if (examples === null) {
            throw new Error(`Could not fetch manifest.json on path ${this.manifestPath}!`);
        }

        const exampleEntries = await examples.json();

        return new Map(Object.entries(exampleEntries));
    }

    public async fetchExampleSource(filePath: string): Promise<string> {

        const examples = await this.createRequest(`${this.sourcePath}/${filePath}`, {
            'no-cache': Date.now(),
        });

        if (examples === null) {
            throw new Error(`Could not fetch file ${filePath} on path ${this.sourcePath}!`);
        }

        return examples.text();
    }

    private async createRequest(path: string, params?: URLParams): Promise<Response | null> {

        const url = this.createUrl(path, params);
        const response = await fetch(url.toString(), this.requestOptions);

        if (!response || !response.ok) {
            return null;
        }

        return response;
    }

    private createUrl(path: string, params?: URLParams): URL {

        const url = new URL(path, window.location.origin);

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value.toString());
            }
        }

        return url;
    }
}