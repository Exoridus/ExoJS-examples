import { RequestService } from '../services/RequestService';
import { ExampleService } from '../services/ExampleService';
import { DependencyContainer } from './DependencyContainer';
import { LocationService } from '../services/LocationService';
import { UrlService } from '../services/UrlService';
import { UrlConfig } from './types';

export interface DependencyTypes {
    urlService: UrlService;
    requestService: RequestService;
    exampleService: ExampleService;
    locationService: LocationService;
}

export interface DependencyConfig {
    urlConfig: UrlConfig;
    requestOptions: RequestInit;
}

export const globalDependencies = new DependencyContainer<DependencyTypes, DependencyConfig>({
    urlService: (container, config): UrlService => new UrlService(config.urlConfig),
    requestService: (container, config): RequestService => new RequestService(config.requestOptions),
    exampleService: (container): ExampleService => {
        const urlService = container.get('urlService');
        const requestService = container.get('requestService');

        return new ExampleService(urlService, requestService);
    },
    locationService: (): LocationService => new LocationService(),
});
