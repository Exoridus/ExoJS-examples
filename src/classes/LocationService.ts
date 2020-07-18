import { action, observable } from 'mobx';

export class LocationService {
    @observable
    public currentHash: string = window.location.hash.slice(1);

    public constructor() {
        window.addEventListener('hashchange', this.handleHashChange);
    }

    public setHash(hash: string): void {
        if (hash && hash !== this.currentHash) {
            window.location.hash = hash;
        }
    }

    @action.bound
    private handleHashChange(): void {
        this.currentHash = window.location.hash.slice(1);
    }
}
