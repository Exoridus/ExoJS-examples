import { action, observable } from 'mobx';
import autobind from 'autobind-decorator';

export class LocationService {

    @observable
    public currentHash: string = window.location.hash.slice(1);

    public constructor() {
        window.addEventListener('hashchange', this.handleHashChange);
    }

    @autobind
    private handleHashChange(): void {
        this.updateCurrentHash();
    }

    @action
    private updateCurrentHash(): void {
        const hash = window.location.hash.slice(1);

        if (this.currentHash !== hash) {
            this.currentHash = hash;
        }
    }
}