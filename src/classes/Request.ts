export enum RequestStatus {
    initialized,
    loading,
    finished,
    cancelled,
    failed,
}

export class FetchRequest {
    private readonly url: string;
    private readonly requestOptions: RequestInit;
    private readonly abortController: AbortController;

    private response: Response | null = null;
    private status: RequestStatus;

    public constructor(url: string, requestOptions: RequestInit) {
        this.url = url;
        this.abortController = new AbortController();
        this.requestOptions = {
            ...requestOptions,
            signal: this.abortController.signal,
        };
        this.status = RequestStatus.initialized;
    }

    public async getJson<T>(): Promise<T | null> {
        const response = await this.getResponse();

        if (response === null) {
            return null;
        }

        try {
            return (await response.json()) as T;
        } catch (error) {
            console.error(`Error while parsing json response! (${this.url})`, error, response);
            return null;
        }
    }

    public async getText(): Promise<string | null> {
        const response = await this.getResponse();

        return response && (await response.text());
    }

    public async getResponse(): Promise<Response | null> {
        if (this.status !== RequestStatus.initialized) {
            return this.response;
        }

        this.status = RequestStatus.loading;

        try {
            this.response = await fetch(this.url, this.requestOptions);
            this.status = RequestStatus.finished;

            if (!this.response.ok) {
                console.error(`Response was not successful! (${this.url})`, this.response);
            }
        } catch (error) {
            console.error(`Error while fetching data! (${this.url})`, error);
            this.status = RequestStatus.failed;
        }

        return this.response;
    }

    public cancel(): void {
        if (this.status !== RequestStatus.loading) {
            return;
        }

        this.abortController.abort();
        this.status = RequestStatus.cancelled;
    }
}
