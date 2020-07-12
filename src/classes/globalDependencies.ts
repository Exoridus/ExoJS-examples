import { RequestService } from './RequestService';
import { ExampleService } from './ExampleService';
import { DependencyContainer } from './DependencyContainer';
import { LocationService } from './LocationService';

export interface DependencyTypes {
    requestService: RequestService;
    exampleService: ExampleService;
    locationService: LocationService;
}

export interface DependencyConfig {
    requestOptions: RequestInit;
}

export const globalDependencies = new DependencyContainer<DependencyTypes, DependencyConfig>({
    requestService: (container, config): RequestService => new RequestService(config.requestOptions),
    exampleService: (container): ExampleService => new ExampleService(container.get('requestService')),
    locationService: (): LocationService => new LocationService(),
});