import { Obj } from '../typings';

export type DependencyFactories<Dependencies extends Obj, Config extends Obj> = {
    [Name in keyof Dependencies]: (
        container: DependencyContainer<Dependencies, Config>,
        data: Config
    ) => Dependencies[Name] | Promise<Dependencies[Name]>;
};

type DependencyMap<Dependencies extends Obj> = Map<keyof Dependencies, Dependencies[keyof Dependencies]>;

export class DependencyContainer<Dependencies extends Obj, Config extends Obj> {
    private readonly dependencyFactories: DependencyFactories<Dependencies, Config>;
    private readonly dependencies: DependencyMap<Dependencies> = new Map();
    private readonly dependencyStack: Set<keyof Dependencies> = new Set();

    public constructor(dependencyFactories: DependencyFactories<Dependencies, Config>) {
        this.dependencyFactories = dependencyFactories;
    }

    public async loadDependencies(config: Config): Promise<DependencyMap<Dependencies>> {
        const keys = Object.keys(this.dependencyFactories) as Array<keyof Dependencies>;

        for (const name of keys) {
            await this.loadDependency(name, config);
        }

        return this.dependencies;
    }

    public get<Name extends keyof Dependencies>(name: Name): Dependencies[Name] {
        if (!this.dependencies.has(name)) {
            throw new Error(`Could not found loaded dependency ${name}!`);
        }

        return this.dependencies.get(name) as Dependencies[Name];
    }

    private async loadDependency<Name extends keyof Dependencies>(
        name: Name,
        config: Config
    ): Promise<Dependencies[Name]> {
        if (this.dependencies.has(name)) {
            return this.dependencies.get(name) as Dependencies[Name];
        }

        if (this.dependencyStack.has(name)) {
            const stack = [...this.dependencyStack, name].join(' > ');
            throw new Error(`Circular dependencies detected! Stack: ${stack}`);
        }

        this.dependencyStack.add(name);
        const dependency = await this.dependencyFactories[name](this, config);
        this.dependencyStack.delete(name);

        this.dependencies.set(name, dependency);

        return dependency;
    }
}
