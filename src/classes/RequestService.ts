export interface URLParams {
    [param: string]: string | number;
}

export class RequestService {

    private readonly requestOptions: RequestInit;

    public constructor(requestOptions: RequestInit) {
        this.requestOptions = requestOptions;
    }

    public async fetchJsonData<T>(path: string, params?: URLParams): Promise<T | null> {

        const response = await this.fetch(path, params);

        return response && (await response.json() as T);
    }

    public async fetchTextData(path: string, params?: URLParams): Promise<string | null> {

        const response = await this.fetch(path, params);

        return response && (await response.text());
    }

    private async fetch(path: string, params?: URLParams): Promise<Response | null> {

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