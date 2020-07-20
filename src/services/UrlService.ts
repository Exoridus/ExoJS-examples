import { UrlConfig, UrlParams } from '../classes/types';

export class UrlService {
    private readonly baseUrl: string;
    private readonly iframeUrl: string;
    private readonly publicDir: string;
    private readonly assetsDir: string;
    private readonly examplesDir: string;

    public constructor(config: UrlConfig) {
        this.baseUrl = config.baseUrl;
        this.iframeUrl = config.iframeUrl;
        this.publicDir = config.publicDir;
        this.assetsDir = config.assetsDir;
        this.examplesDir = config.examplesDir;
    }

    public buildIframeUrl(urlParams?: UrlParams): string {
        return this.buildUrl(this.iframeUrl, urlParams);
    }

    public buildPublicUrl(path: string, urlParams?: UrlParams): string {
        return this.buildUrl(`${this.publicDir}/${path}`, urlParams);
    }

    public buildAssetUrl(path: string, urlParams?: UrlParams): string {
        return this.buildUrl(`${this.assetsDir}/${path}`, urlParams);
    }

    public buildExampleUrl(path: string, urlParams?: UrlParams): string {
        return this.buildUrl(`${this.examplesDir}/${path}`, urlParams);
    }

    private buildUrl(path: string, params?: UrlParams): string {
        const url = new URL(path, this.baseUrl);

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value.toString());
            }
        }

        return url.toString();
    }
}
