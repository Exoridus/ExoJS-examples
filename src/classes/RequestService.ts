import { FetchRequest } from './Request';

export interface UrlParams {
    [param: string]: string | number;
}

export class RequestService {

    private readonly requestOptions: RequestInit;
    private readonly uniqueRequests: Map<string, FetchRequest> = new Map();

    public constructor(requestOptions: RequestInit) {
        this.requestOptions = requestOptions;
    }

    public createRequest(path: string, urlParams?: UrlParams): FetchRequest {

        const url = this.buildUrl(path, urlParams);

        return new FetchRequest(url.toString(), this.requestOptions);
    }

    public createUniqueRequest(path: string, urlParams?: UrlParams): FetchRequest {

        const url = this.buildUrl(path, urlParams);
        const uniqueRequest = this.uniqueRequests.get(url);

        if (uniqueRequest) {
            uniqueRequest.cancel();
        }

        const request = new FetchRequest(url, this.requestOptions);

        this.uniqueRequests.set(url, request);

        return request;
    }

    private buildUrl(path: string, params?: UrlParams): string {

        const { origin, pathname } = window.location;
        const url = new URL(path, `${origin}${pathname}`);

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value.toString());
            }
        }

        return url.toString();
    }
}