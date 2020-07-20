// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Obj = Record<string, any>;

export enum RequestStatus {
    initialized,
    loading,
    finished,
    cancelled,
    failed,
}

export interface UrlConfig {
    baseUrl: string;
    iframeUrl: string;
    publicDir: string;
    assetsDir: string;
    examplesDir: string;
}

export interface UrlParams {
    [param: string]: string | number;
}
