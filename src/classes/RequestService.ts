import { FetchRequest } from './Request';

export class RequestService {
    private readonly requestOptions: RequestInit;
    private readonly uniqueRequests: Map<string, FetchRequest> = new Map();

    public constructor(requestOptions: RequestInit) {
        this.requestOptions = requestOptions;
    }

    public createRequest(url: string): FetchRequest {
        return new FetchRequest(url, this.requestOptions);
    }

    public createUniqueRequest(url: string): FetchRequest {
        const uniqueRequest = this.uniqueRequests.get(url);

        if (uniqueRequest) {
            uniqueRequest.cancel();
        }

        const request = new FetchRequest(url, this.requestOptions);

        this.uniqueRequests.set(url, request);

        return request;
    }
}
