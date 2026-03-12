declare module "core/Scene" {
    import type { Time } from "core/Time";
    import type { Loader } from "resources/Loader";
    import type { ResourceContainer } from "resources/ResourceContainer";
    import type { RenderRuntime } from "rendering/RenderRuntime";

    interface ExampleSceneData {
        load?: (this: any, loader: Loader) => void | Promise<void>;
        init?: (this: any, resources: ResourceContainer) => void;
        update?: (this: any, delta: Time) => void;
        draw?: (this: any, renderManager: RenderRuntime) => void;
        unload?: (this: any) => void;
        destroy?: (this: any) => void;
        [key: string]: unknown;
    }

    class Scene {
        constructor(definition: ExampleSceneData);
    }
}

declare module "exojs" {
    import type { Time } from "core/Time";
    import type { Loader } from "resources/Loader";
    import type { ResourceContainer } from "resources/ResourceContainer";
    import type { RenderRuntime } from "rendering/RenderRuntime";
    import type { ResourceTypes } from "types/types";

    export interface ExampleSceneData {
        load?: (this: any, loader: Loader) => void | Promise<void>;
        init?: (this: any, resources: ResourceContainer) => void;
        update?: (this: any, delta: Time) => void;
        draw?: (this: any, renderManager: RenderRuntime) => void;
        unload?: (this: any) => void;
        destroy?: (this: any) => void;
        [key: string]: unknown;
    }

    export class Scene {
        constructor(definition: ExampleSceneData);
    }

    export interface Loader {
        add(
            type: ResourceTypes | 'font' | 'video' | 'music' | 'sound' | 'image' | 'texture' | 'text' | 'json' | 'svg',
            items: Record<string, string>,
            options?: unknown
        ): this;
    }

    export interface ResourceContainer {
        get<K extends ResourceTypes>(
            type: K | 'font' | 'video' | 'music' | 'sound' | 'image' | 'texture' | 'text' | 'json' | 'svg',
            name: string
        ): unknown;
    }

    export interface RenderRuntime {
        clear(color?: unknown): this;
        setRenderTarget(target: unknown): this;
        readonly renderTarget: {
            setView(view: unknown): void;
        };
    }
}

declare module "resources/Loader" {
    import type { ResourceTypes } from "types/types";

    interface Loader {
        add(
            type: ResourceTypes | 'font' | 'video' | 'music' | 'sound' | 'image' | 'texture' | 'text' | 'json' | 'svg',
            items: Record<string, string>,
            options?: unknown
        ): this;
    }
}

declare module "resources/ResourceContainer" {
    import type { ResourceTypes } from "types/types";

    interface ResourceContainer {
        get<K extends ResourceTypes>(
            type: K | 'font' | 'video' | 'music' | 'sound' | 'image' | 'texture' | 'text' | 'json' | 'svg',
            name: string
        ): unknown;
    }
}

declare module "rendering/RenderRuntime" {
    interface RenderRuntime {
        clear(color?: unknown): this;
        setRenderTarget(target: unknown): this;
        readonly renderTarget: {
            setView(view: unknown): void;
        };
    }
}

export {};
