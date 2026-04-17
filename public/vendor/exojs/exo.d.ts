declare module "math/Matrix" {
    import type { Cloneable } from "core/types";
    /**
     * | a | b | x |
     * | c | d | y |
     * | e | f | z |
     */
    export class Matrix implements Cloneable {
        a: number;
        b: number;
        x: number;
        c: number;
        d: number;
        y: number;
        e: number;
        f: number;
        z: number;
        private _array;
        constructor(a?: number, b?: number, x?: number, c?: number, d?: number, y?: number, e?: number, f?: number, z?: number);
        set(a?: number, b?: number, x?: number, c?: number, d?: number, y?: number, e?: number, f?: number, z?: number): this;
        copy(matrix: Matrix): this;
        clone(): this;
        equals({ a, b, x, c, d, y, e, f, z }?: Partial<Matrix>): boolean;
        combine(matrix: Matrix): this;
        getInverse(result?: Matrix): Matrix;
        translate(x: number, y?: number): Matrix;
        rotate(angle: number, centerX?: number, centerY?: number): Matrix;
        scale(scaleX: number, scaleY?: number, centerX?: number, centerY?: number): Matrix;
        toArray(transpose?: boolean): Float32Array;
        destroy(): void;
        static readonly identity: Matrix;
        static get temp(): Matrix;
    }
}
declare module "math/Interval" {
    import type { Cloneable } from "core/types";
    export class Interval implements Cloneable {
        min: number;
        max: number;
        constructor(min?: number, max?: number);
        set(min: number, max: number): this;
        copy(interval: Interval): this;
        clone(): this;
        containsInterval(interval: Interval): boolean;
        includes(value: number): boolean;
        overlaps(interval: Interval): boolean;
        getOverlap(interval: Interval): number;
        destroy(): void;
        static readonly zero: Interval;
        static get temp(): Interval;
    }
}
declare module "math/Collision" {
    import type { Vector } from "math/Vector";
    import type { Interval } from "math/Interval";
    export const enum CollisionType {
        Point = 0,
        Line = 1,
        Rectangle = 2,
        Circle = 3,
        Ellipse = 4,
        Polygon = 5,
        SceneNode = 6
    }
    export interface Collidable {
        readonly collisionType: CollisionType;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        contains(x: number, y: number): boolean;
        getNormals(): Array<Vector>;
        project(axis: Vector, interval?: Interval): Interval;
    }
    export interface CollisionResponse {
        readonly shapeA: Collidable;
        readonly shapeB: Collidable;
        readonly overlap: number;
        readonly shapeAinB: boolean;
        readonly shapeBinA: boolean;
        readonly projectionN: Vector;
        readonly projectionV: Vector;
    }
}
declare module "math/ShapeLike" {
    import type { Collidable } from "math/Collision";
    import type { Cloneable, Destroyable, HasBoundingBox } from "core/types";
    export interface ShapeLike extends Collidable, Cloneable, Destroyable, HasBoundingBox {
    }
}
declare module "math/PointLike" {
    export interface PointLike {
        x: number;
        y: number;
    }
}
declare module "math/collision-primitives" {
    import { VoronoiRegion } from "math/utils";
    import type { PointLike } from "math/PointLike";
    interface RectangleLikeLike extends PointLike {
        width: number;
        height: number;
    }
    interface CircleLikeLike extends PointLike {
        radius: number;
    }
    interface EllipseLikeLike extends PointLike {
        rx: number;
        ry: number;
    }
    interface PolygonLikeLike {
        x: number;
        y: number;
        points: Array<PointLike>;
    }
    const buildEllipsePoints: ({ x: centerX, y: centerY, rx, ry }: EllipseLikeLike) => Array<PointLike>;
    const buildCirclePoints: ({ x: centerX, y: centerY, radius }: CircleLikeLike) => Array<PointLike>;
    const buildRectanglePoints: ({ x, y, width, height }: RectangleLikeLike) => Array<PointLike>;
    const buildPolygonWorldPoints: ({ x: offsetX, y: offsetY, points }: PolygonLikeLike) => Array<PointLike>;
    const pointOnSegment: ({ x: px, y: py }: PointLike, { x: x1, y: y1 }: PointLike, { x: x2, y: y2 }: PointLike) => boolean;
    const segmentsIntersect: (a1: PointLike, a2: PointLike, b1: PointLike, b2: PointLike) => boolean;
    const polygonContainsPoint: ({ x, y }: PointLike, points: Array<PointLike>) => boolean;
    const polygonsIntersect: (polygonA: Array<PointLike>, polygonB: Array<PointLike>) => boolean;
    const intersectionPointPoint: ({ x: x1, y: y1 }: PointLike, { x: x2, y: y2 }: PointLike, threshold?: number) => boolean;
    const intersectionPointLineSegment: ({ x, y }: PointLike, { x: x1, y: y1 }: PointLike, { x: x2, y: y2 }: PointLike, threshold?: number) => boolean;
    const intersectionPointRect: ({ x: x1, y: y1 }: PointLike, { x: x2, y: y2, width, height }: RectangleLikeLike) => boolean;
    const intersectionPointCircle: ({ x: x1, y: y1 }: PointLike, { x: x2, y: y2, radius }: CircleLikeLike) => boolean;
    const intersectionPointEllipse: ({ x: x1, y: y1 }: PointLike, { x: x2, y: y2, rx, ry }: EllipseLikeLike) => boolean;
    const intersectionPointPoly: (point: PointLike, { points }: PolygonLikeLike) => boolean;
    const intersectionLineLineSegments: (a1: PointLike, a2: PointLike, b1: PointLike, b2: PointLike) => boolean;
    const intersectionRectRect: ({ x: x1, y: y1, width: w1, height: h1 }: RectangleLikeLike, { x: x2, y: y2, width: w2, height: h2 }: RectangleLikeLike) => boolean;
    const getVectorLength: (x: number, y: number) => number;
    const getVectorLengthSquared: (x: number, y: number) => number;
    const getDotProduct: (x1: number, y1: number, x2: number, y2: number) => number;
    const getVoronoiRegion: (lineX: number, lineY: number, pointX: number, pointY: number) => VoronoiRegion;
    export { buildCirclePoints, buildEllipsePoints, buildPolygonWorldPoints, buildRectanglePoints, getDotProduct, getVectorLength, getVectorLengthSquared, getVoronoiRegion, intersectionLineLineSegments, intersectionPointCircle, intersectionPointEllipse, intersectionPointLineSegment, intersectionPointPoint, intersectionPointPoly, intersectionPointRect, intersectionRectRect, pointOnSegment, polygonContainsPoint, polygonsIntersect, segmentsIntersect, };
}
declare module "math/AbstractVector" {
    import type { Matrix } from "math/Matrix";
    export abstract class AbstractVector {
        abstract x: number;
        abstract y: number;
        get direction(): number;
        set direction(angle: number);
        get angle(): number;
        set angle(angle: number);
        get length(): number;
        set length(magnitude: number);
        get lengthSq(): number;
        set lengthSq(lengthSquared: number);
        get magnitude(): number;
        set magnitude(magnitude: number);
        set(x: number, y?: number): this;
        equals<T extends AbstractVector>({ x, y }?: Partial<T>): boolean;
        add(x: number, y?: number): this;
        subtract(x: number, y?: number): this;
        multiply(x: number, y?: number): this;
        divide(x: number, y?: number): this;
        normalize(): this;
        invert(): this;
        transform(matrix: Matrix): this;
        transformInverse(matrix: Matrix): this;
        perp(): this;
        rperp(): this;
        min(): number;
        max(): number;
        dot(x: number, y: number): number;
        cross<T extends AbstractVector>(vector: T): number;
        distanceTo<T extends AbstractVector>(vector: T): number;
        abstract destroy(): void;
    }
}
declare module "math/ObservableVector" {
    import { AbstractVector } from "math/AbstractVector";
    export class ObservableVector extends AbstractVector {
        private _x;
        private _y;
        private readonly _callback;
        constructor(callback: () => void, x?: number, y?: number);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        set direction(angle: number);
        set length(magnitude: number);
        set(x?: number, y?: number): this;
        add(x: number, y?: number): this;
        subtract(x: number, y?: number): this;
        scale(x: number, y?: number): this;
        divide(x: number, y?: number): this;
        clone(): this;
        copy(vector: AbstractVector): this;
        destroy<T = ObservableVector>(): void;
    }
}
declare module "math/Flags" {
    import type { TypedEnum } from "core/types";
    export class Flags<T extends TypedEnum<T, number>> {
        private _value;
        get value(): number;
        constructor(...flags: Array<number>);
        push<V extends number = T[keyof T]>(...flags: Array<V>): this;
        pop<V extends number = T[keyof T]>(flag: V): boolean;
        remove<V extends number = T[keyof T]>(...flags: Array<V>): this;
        has<V extends number = T[keyof T]>(...flags: Array<V>): boolean;
        clear(): this;
        destroy(): void;
    }
}
declare module "math/Transformable" {
    import { ObservableVector } from "math/ObservableVector";
    import { Matrix } from "math/Matrix";
    import { Flags } from "math/Flags";
    export enum TransformableFlags {
        None = 0,
        Translation = 1,
        Rotation = 2,
        Scaling = 4,
        Origin = 8,
        Transform = 15,
        TransformInverse = 16
    }
    export class Transformable {
        readonly flags: Flags<TransformableFlags>;
        protected _transform: Matrix;
        protected _position: ObservableVector;
        protected _scale: ObservableVector;
        protected _origin: ObservableVector;
        protected _rotation: number;
        protected _sin: number;
        protected _cos: number;
        get position(): ObservableVector;
        set position(position: ObservableVector);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get rotation(): number;
        set rotation(rotation: number);
        get scale(): ObservableVector;
        set scale(scale: ObservableVector);
        get origin(): ObservableVector;
        set origin(origin: ObservableVector);
        setPosition(x: number, y?: number): this;
        setRotation(degrees: number): this;
        setScale(x: number, y?: number): this;
        setOrigin(x: number, y?: number): this;
        move(x: number, y: number): this;
        rotate(degrees: number): this;
        getTransform(): Matrix;
        updateTransform(): this;
        destroy(): void;
        private _setPositionDirty;
        private _setRotationDirty;
        private _setScalingDirty;
        private _setOriginDirty;
    }
}
declare module "core/Bounds" {
    import { Rectangle } from "math/Rectangle";
    import type { Matrix } from "math/Matrix";
    export class Bounds {
        private _minX;
        private _minY;
        private _maxX;
        private _maxY;
        private _dirty;
        private _rect;
        get minX(): number;
        get minY(): number;
        get maxX(): number;
        get maxY(): number;
        addCoords(x: number, y: number): this;
        addRect(rectangle: Rectangle, transform?: Matrix): this;
        getRect(): Rectangle;
        reset(): this;
        destroy(): void;
    }
}
declare module "math/Size" {
    import type { Cloneable } from "core/types";
    export class Size implements Cloneable {
        protected _width: number;
        protected _height: number;
        constructor(width?: number, height?: number);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        set(width: number, height?: number): this;
        add(width: number, height?: number): this;
        subtract(width: number, height?: number): this;
        scale(width: number, height?: number): this;
        divide(width: number, height?: number): this;
        copy(size: {
            width: number;
            height: number;
        }): this;
        clone(): this;
        equals({ width, height }?: Partial<Size>): boolean;
        destroy(): void;
        static readonly zero: Size;
        static get temp(): Size;
    }
}
declare module "math/Random" {
    export class Random {
        private _state;
        private _iteration;
        private _seed;
        private _value;
        constructor(seed?: number);
        get seed(): number;
        get value(): number;
        get iteration(): number;
        setSeed(seed: number): this;
        reset(): this;
        next(min?: number, max?: number): number;
        destroy(): void;
        private _twist;
    }
}
declare module "core/Time" {
    import type { Cloneable, TimeInterval } from "core/types";
    export class Time implements Cloneable {
        private _milliseconds;
        constructor(time?: number, factor?: TimeInterval);
        get milliseconds(): number;
        set milliseconds(milliseconds: number);
        get seconds(): number;
        set seconds(seconds: number);
        get minutes(): number;
        set minutes(minutes: number);
        get hours(): number;
        set hours(hours: number);
        set(time?: number, factor?: TimeInterval): this;
        setMilliseconds(milliseconds: number): this;
        setSeconds(seconds: number): this;
        setMinutes(minutes: number): this;
        setHours(hours: number): this;
        equals({ milliseconds, seconds, minutes, hours }?: Partial<Time>): boolean;
        greaterThan(time: Time): boolean;
        lessThan(time: Time): boolean;
        clone(): this;
        copy(time: Time): this;
        add(value?: number, factor?: TimeInterval): this;
        addTime(time: Time): this;
        subtract(value?: number, factor?: TimeInterval): this;
        subtractTime(time: Time): this;
        destroy(): void;
        static readonly milliseconds: TimeInterval;
        static readonly seconds: TimeInterval;
        static readonly minutes: TimeInterval;
        static readonly hours: TimeInterval;
        static readonly zero: Time;
        static readonly oneMillisecond: Time;
        static readonly oneSecond: Time;
        static readonly oneMinute: Time;
        static readonly oneHour: Time;
        static get temp(): Time;
    }
}
declare module "core/utils" {
    import { Size } from "math/Size";
    import type { TextureSource } from "core/types";
    import { Time } from "core/Time";
    export const rand: (min?: number, max?: number) => number;
    export const noop: () => void;
    export const stopEvent: (event: Event) => void;
    export const supportsWebAudio: boolean;
    export const supportsIndexedDb: boolean;
    export const supportsTouchEvents: boolean;
    export const supportsPointerEvents: boolean;
    export const supportsEventOptions: () => boolean;
    export const getPreciseTime: () => number;
    export const milliseconds: (value: number) => Time;
    export const seconds: (value: number) => Time;
    export const minutes: (value: number) => Time;
    export const hours: (value: number) => Time;
    export const emptyArrayBuffer: ArrayBuffer;
    export const removeArrayItems: <T = unknown>(array: Array<T>, startIndex: number, amount: number) => Array<T>;
    export const supportsCodec: (...codecs: Array<string>) => boolean;
    export const getCanvasSourceSize: (source: CanvasImageSource) => Size;
    export const getTextureSourceSize: (source: TextureSource) => Size;
    export const canvasSourceToDataUrl: (source: CanvasImageSource) => string;
}
declare module "core/Color" {
    import type { Cloneable } from "core/types";
    export class Color implements Cloneable {
        private _r;
        private _g;
        private _b;
        private _a;
        private _rgba;
        private _array;
        constructor(r?: number, g?: number, b?: number, a?: number);
        get r(): number;
        set r(red: number);
        get g(): number;
        set g(green: number);
        get b(): number;
        set b(blue: number);
        get a(): number;
        set a(alpha: number);
        get red(): number;
        set red(red: number);
        get green(): number;
        set green(green: number);
        get blue(): number;
        set blue(blue: number);
        get alpha(): number;
        set alpha(alpha: number);
        set(r?: number, g?: number, b?: number, a?: number): this;
        copy(color: Color): this;
        clone(): this;
        equals({ r, g, b, a }?: Partial<Color>): boolean;
        toArray(normalized?: boolean): Float32Array;
        toString(prefixed?: boolean): string;
        toRgba(): number;
        destroy(): void;
        static readonly aliceBlue: Color;
        static readonly antiqueWhite: Color;
        static readonly aqua: Color;
        static readonly aquamarine: Color;
        static readonly azure: Color;
        static readonly beige: Color;
        static readonly bisque: Color;
        static readonly black: Color;
        static readonly blanchedAlmond: Color;
        static readonly blue: Color;
        static readonly blueViolet: Color;
        static readonly brown: Color;
        static readonly burlyWood: Color;
        static readonly cadetBlue: Color;
        static readonly chartreuse: Color;
        static readonly chocolate: Color;
        static readonly coral: Color;
        static readonly cornflowerBlue: Color;
        static readonly cornsilk: Color;
        static readonly crimson: Color;
        static readonly cyan: Color;
        static readonly darkBlue: Color;
        static readonly darkCyan: Color;
        static readonly darkGoldenrod: Color;
        static readonly darkGray: Color;
        static readonly darkGreen: Color;
        static readonly darkKhaki: Color;
        static readonly darkMagenta: Color;
        static readonly darkOliveGreen: Color;
        static readonly darkOrange: Color;
        static readonly darkOrchid: Color;
        static readonly darkRed: Color;
        static readonly darkSalmon: Color;
        static readonly darkSeaGreen: Color;
        static readonly darkSlateBlue: Color;
        static readonly darkSlateGray: Color;
        static readonly darkTurquoise: Color;
        static readonly darkViolet: Color;
        static readonly deepPink: Color;
        static readonly deepSkyBlue: Color;
        static readonly dimGray: Color;
        static readonly dodgerBlue: Color;
        static readonly firebrick: Color;
        static readonly floralWhite: Color;
        static readonly forestGreen: Color;
        static readonly fuchsia: Color;
        static readonly gainsboro: Color;
        static readonly ghostWhite: Color;
        static readonly gold: Color;
        static readonly goldenrod: Color;
        static readonly gray: Color;
        static readonly green: Color;
        static readonly greenYellow: Color;
        static readonly honeydew: Color;
        static readonly hotPink: Color;
        static readonly indianRed: Color;
        static readonly indigo: Color;
        static readonly ivory: Color;
        static readonly khaki: Color;
        static readonly lavender: Color;
        static readonly lavenderBlush: Color;
        static readonly lawnGreen: Color;
        static readonly lemonChiffon: Color;
        static readonly lightBlue: Color;
        static readonly lightCoral: Color;
        static readonly lightCyan: Color;
        static readonly lightGoldenrodYellow: Color;
        static readonly lightGray: Color;
        static readonly lightGreen: Color;
        static readonly lightPink: Color;
        static readonly lightSalmon: Color;
        static readonly lightSeaGreen: Color;
        static readonly lightSkyBlue: Color;
        static readonly lightSlateGray: Color;
        static readonly lightSteelBlue: Color;
        static readonly lightYellow: Color;
        static readonly lime: Color;
        static readonly limeGreen: Color;
        static readonly linen: Color;
        static readonly magenta: Color;
        static readonly maroon: Color;
        static readonly mediumAquamarine: Color;
        static readonly mediumBlue: Color;
        static readonly mediumOrchid: Color;
        static readonly mediumPurple: Color;
        static readonly mediumSeaGreen: Color;
        static readonly mediumSlateBlue: Color;
        static readonly mediumSpringGreen: Color;
        static readonly mediumTurquoise: Color;
        static readonly mediumVioletRed: Color;
        static readonly midnightBlue: Color;
        static readonly mintCream: Color;
        static readonly mistyRose: Color;
        static readonly moccasin: Color;
        static readonly navajoWhite: Color;
        static readonly navy: Color;
        static readonly oldLace: Color;
        static readonly olive: Color;
        static readonly oliveDrab: Color;
        static readonly orange: Color;
        static readonly orangeRed: Color;
        static readonly orchid: Color;
        static readonly paleGoldenrod: Color;
        static readonly paleGreen: Color;
        static readonly paleTurquoise: Color;
        static readonly paleVioletRed: Color;
        static readonly papayaWhip: Color;
        static readonly peachPuff: Color;
        static readonly peru: Color;
        static readonly pink: Color;
        static readonly plum: Color;
        static readonly powderBlue: Color;
        static readonly purple: Color;
        static readonly red: Color;
        static readonly rosyBrown: Color;
        static readonly royalBlue: Color;
        static readonly saddleBrown: Color;
        static readonly salmon: Color;
        static readonly sandyBrown: Color;
        static readonly seaGreen: Color;
        static readonly seaShell: Color;
        static readonly sienna: Color;
        static readonly silver: Color;
        static readonly skyBlue: Color;
        static readonly slateBlue: Color;
        static readonly slateGray: Color;
        static readonly snow: Color;
        static readonly springGreen: Color;
        static readonly steelBlue: Color;
        static readonly tan: Color;
        static readonly teal: Color;
        static readonly thistle: Color;
        static readonly tomato: Color;
        static readonly transparentBlack: Color;
        static readonly transparentWhite: Color;
        static readonly turquoise: Color;
        static readonly violet: Color;
        static readonly wheat: Color;
        static readonly white: Color;
        static readonly whiteSmoke: Color;
        static readonly yellow: Color;
        static readonly yellowGreen: Color;
    }
}
declare module "rendering/RenderBackendType" {
    export enum RenderBackendType {
        WebGl2 = 0,
        WebGpu = 1
    }
}
declare module "math/ObservableSize" {
    import { Size } from "math/Size";
    export class ObservableSize extends Size {
        private readonly _callback;
        constructor(callback: () => void, width?: number, height?: number);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        set(width?: number, height?: number): this;
        add(x: number, y?: number): this;
        subtract(x: number, y?: number): this;
        scale(x: number, y?: number): this;
        divide(x: number, y?: number): this;
        copy(size: Size): this;
        clone(): this;
    }
}
declare module "rendering/View" {
    import { ObservableVector } from "math/ObservableVector";
    import { Rectangle } from "math/Rectangle";
    import { Matrix } from "math/Matrix";
    import { ObservableSize } from "math/ObservableSize";
    export enum ViewFlags {
        None = 0,
        Translation = 1,
        Rotation = 2,
        Scaling = 4,
        Origin = 8,
        Transform = 15,
        TransformInverse = 16,
        BoundingBox = 32,
        TextureCoords = 64,
        VertexTint = 128
    }
    export class View {
        private readonly _center;
        private readonly _size;
        private readonly _viewport;
        private readonly _transform;
        private readonly _inverseTransform;
        private readonly _bounds;
        private readonly _flags;
        private _rotation;
        private _sin;
        private _cos;
        private _updateId;
        constructor(centerX: number, centerY: number, width: number, height: number);
        get center(): ObservableVector;
        set center(center: ObservableVector);
        get size(): ObservableSize;
        set size(size: ObservableSize);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        get rotation(): number;
        set rotation(rotation: number);
        get viewport(): Rectangle;
        set viewport(viewport: Rectangle);
        get updateId(): number;
        setCenter(x: number, y: number): this;
        resize(width: number, height: number): this;
        setRotation(degrees: number): this;
        move(x: number, y: number): this;
        zoom(factor: number): this;
        rotate(degrees: number): this;
        reset(centerX: number, centerY: number, width: number, height: number): this;
        getTransform(): Matrix;
        updateTransform(): this;
        getInverseTransform(): Matrix;
        getBounds(): Rectangle;
        updateBounds(): this;
        destroy(): void;
        private _setDirty;
        private _setPositionDirty;
        private _setRotationDirty;
        private _setScalingDirty;
    }
}
declare module "rendering/RenderTarget" {
    import { Size } from "math/Size";
    import { View } from "rendering/View";
    import { Rectangle } from "math/Rectangle";
    import { Vector } from "math/Vector";
    export class RenderTarget {
        private readonly _root;
        private readonly _destroyListeners;
        private _version;
        protected _size: Size;
        protected _viewport: Rectangle;
        protected _defaultView: View;
        protected _view: View;
        constructor(width: number, height: number, root?: boolean);
        get view(): View;
        set view(view: View);
        get size(): Size;
        set size(size: Size);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        get root(): boolean;
        get version(): number;
        addDestroyListener(listener: () => void): this;
        removeDestroyListener(listener: () => void): this;
        setView(view: View | null): this;
        resize(width: number, height: number): this;
        getViewport(view?: View): Rectangle;
        updateViewport(): this;
        mapPixelToCoords(point: Vector, view?: View): Vector;
        mapCoordsToPixel(point: Vector, view?: View): Vector;
        destroy(): void;
        protected _touch(): void;
    }
}
declare module "rendering/types" {
    export enum BlendModes {
        Normal = 0,
        Additive = 1,
        Subtract = 2,
        Multiply = 3,
        Screen = 4
    }
    export enum ScaleModes {
        Nearest = 9728,
        Linear = 9729,
        NearestMipmapNearest = 9984,
        LinearMipmapNearest = 9985,
        NearestMipmapLinear = 9986,
        LinearMipmapLinear = 9987
    }
    export enum WrapModes {
        Repeat = 10497,
        ClampToEdge = 33071,
        MirroredRepeat = 33648
    }
    export enum RenderingPrimitives {
        Points = 0,
        Lines = 1,
        LineLoop = 2,
        LineStrip = 3,
        Triangles = 4,
        TriangleStrip = 5,
        TriangleFan = 6
    }
    export enum BufferTypes {
        ArrayBuffer = 34962,
        ElementArrayBuffer = 34963,
        CopyReadBuffer = 36662,
        CopyWriteBuffer = 36663,
        TransformFeedbackBuffer = 35982,
        UniformBuffer = 35345,
        PixelPackBuffer = 35051,
        PixelUnpackBuffer = 35052
    }
    export enum BufferUsage {
        StaticDraw = 35044,
        StaticRead = 35045,
        StaticCopy = 35046,
        DynamicDraw = 35048,
        DynamicRead = 35049,
        DynamicCopy = 35050,
        StreamDraw = 35040,
        StreamRead = 35041,
        StreamCopy = 35042
    }
    export enum ShaderPrimitives {
        Int = 5124,
        IntVec2 = 35667,
        IntVec3 = 35668,
        IntVec4 = 35669,
        Float = 5126,
        FloatVec2 = 35664,
        FloatVec3 = 35665,
        FloatVec4 = 35666,
        Bool = 35670,
        BoolVec2 = 35671,
        BoolVec3 = 35672,
        BoolVec4 = 35673,
        FloatMat2 = 35674,
        FloatMat3 = 35675,
        FloatMat4 = 35676,
        Sampler2D = 35678
    }
}
declare module "rendering/Drawable" {
    import { SceneNode } from "core/SceneNode";
    import { Color } from "core/Color";
    import { BlendModes } from "rendering/types";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    export class Drawable extends SceneNode {
        private _tint;
        private _blendMode;
        get tint(): Color;
        set tint(tint: Color);
        get blendMode(): BlendModes;
        set blendMode(blendMode: BlendModes);
        setTint(color: Color): this;
        setBlendMode(blendMode: BlendModes): this;
        render(renderManager: SceneRenderRuntime): this;
        destroy(): void;
    }
}
declare module "rendering/RenderPass" {
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    export interface RenderPass {
        execute(runtime: SceneRenderRuntime): void;
    }
}
declare module "rendering/SceneRenderRuntime" {
    import type { Color } from "core/Color";
    import type { RenderBackendType } from "rendering/RenderBackendType";
    import type { RenderTarget } from "rendering/RenderTarget";
    import type { View } from "rendering/View";
    import type { Drawable } from "rendering/Drawable";
    import type { RenderPass } from "rendering/RenderPass";
    export interface SceneRenderRuntime {
        readonly backendType: RenderBackendType;
        readonly view: View;
        readonly renderTarget: RenderTarget;
        initialize(): Promise<this>;
        clear(color?: Color): this;
        resize(width: number, height: number): this;
        setView(view: View | null): this;
        setRenderTarget(target: RenderTarget | null): this;
        draw(drawable: Drawable): this;
        execute(pass: RenderPass): this;
        flush(): this;
        destroy(): void;
    }
}
declare module "rendering/Container" {
    import { SceneNode } from "core/SceneNode";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    export class Container extends SceneNode {
        private readonly _children;
        get children(): Array<SceneNode>;
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        get left(): number;
        get top(): number;
        get right(): number;
        get bottom(): number;
        addChild(child: SceneNode): this;
        addChildAt(child: SceneNode, index: number): this;
        swapChildren(firstChild: SceneNode, secondChild: SceneNode): this;
        getChildIndex(child: SceneNode): number;
        setChildIndex(child: SceneNode, index: number): this;
        getChildAt(index: number): SceneNode;
        removeChild(child: SceneNode): this;
        removeChildAt(index: number): this;
        removeChildren(begin?: number, end?: number): this;
        render(renderManager: SceneRenderRuntime): this;
        contains(x: number, y: number): boolean;
        updateBounds(): this;
        destroy(): void;
    }
}
declare module "math/Line" {
    import { Vector } from "math/Vector";
    import { Rectangle } from "math/Rectangle";
    import type { ShapeLike } from "math/ShapeLike";
    import { Interval } from "math/Interval";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    export class Line implements ShapeLike {
        readonly collisionType: CollisionType;
        private readonly _fromPosition;
        private readonly _toPosition;
        constructor(x1?: number, y1?: number, x2?: number, y2?: number);
        get fromPosition(): Vector;
        set fromPosition(positionFrom: Vector);
        get fromX(): number;
        set fromX(fromX: number);
        get fromY(): number;
        set fromY(fromY: number);
        get toPosition(): Vector;
        set toPosition(positionTo: Vector);
        get toX(): number;
        set toX(toX: number);
        get toY(): number;
        set toY(toY: number);
        set(x1: number, y1: number, x2: number, y2: number): this;
        copy(line: Line): this;
        clone(): this;
        getBounds(): Rectangle;
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        contains(x: number, y: number, threshold?: number): boolean;
        equals({ fromX, fromY, toX, toY }?: Partial<Line>): boolean;
        destroy(): void;
        static get temp(): Line;
    }
}
declare module "math/Polygon" {
    import { Interval } from "math/Interval";
    import { Vector } from "math/Vector";
    import { Rectangle } from "math/Rectangle";
    import type { ShapeLike } from "math/ShapeLike";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    export class Polygon implements ShapeLike {
        readonly collisionType: CollisionType;
        private readonly _position;
        private readonly _points;
        private readonly _edges;
        private readonly _normals;
        constructor(points?: Array<Vector>, x?: number, y?: number);
        get position(): Vector;
        set position(position: Vector);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get points(): Array<Vector>;
        set points(points: Array<Vector>);
        get edges(): Array<Vector>;
        get normals(): Array<Vector>;
        setPosition(x: number, y: number): this;
        setPoints(newPoints: Array<Vector>): this;
        set(x: number, y: number, points: Array<Vector>): this;
        copy(polygon: Polygon): this;
        clone(): this;
        equals({ x, y, points }?: Partial<Polygon>): boolean;
        getBounds(): Rectangle;
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        contains(x: number, y: number): boolean;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        destroy(): void;
        static get temp(): Polygon;
    }
}
declare module "math/Ellipse" {
    import { Vector } from "math/Vector";
    import { Rectangle } from "math/Rectangle";
    import type { ShapeLike } from "math/ShapeLike";
    import { Interval } from "math/Interval";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    export class Ellipse implements ShapeLike {
        readonly collisionType: CollisionType;
        private readonly _position;
        private readonly _radius;
        constructor(x?: number, y?: number, halfWidth?: number, halfHeight?: number);
        get position(): Vector;
        set position(position: Vector);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get radius(): Vector;
        set radius(size: Vector);
        get rx(): number;
        set rx(radiusX: number);
        get ry(): number;
        set ry(radiusY: number);
        setPosition(x: number, y: number): this;
        setRadius(radiusX: number, radiusY?: number): this;
        set(x: number, y: number, radiusX: number, radiusY: number): this;
        copy(ellipse: Ellipse): this;
        clone(): this;
        getBounds(): Rectangle;
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        contains(x: number, y: number): boolean;
        equals({ x, y, rx, ry }?: Partial<Ellipse>): boolean;
        destroy(): void;
    }
}
declare module "core/SceneNode" {
    import { Transformable } from "math/Transformable";
    import { Matrix } from "math/Matrix";
    import { Rectangle } from "math/Rectangle";
    import { Bounds } from "core/Bounds";
    import { ObservableVector } from "math/ObservableVector";
    import type { Container } from "rendering/Container";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    import type { Vector } from "math/Vector";
    import { Interval } from "math/Interval";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    import type { View } from "rendering/View";
    export class SceneNode extends Transformable implements Collidable {
        readonly collisionType: CollisionType;
        protected _bounds: Bounds;
        private _visible;
        private _globalTransform;
        private _localBounds;
        private _anchor;
        private _parentNode;
        get anchor(): ObservableVector;
        set anchor(anchor: ObservableVector);
        get parent(): Container | null;
        set parent(parent: Container | null);
        get parentNode(): Container | null;
        set parentNode(parentNode: Container | null);
        get visible(): boolean;
        set visible(visible: boolean);
        get globalTransform(): Matrix;
        get localBounds(): Rectangle;
        get bounds(): Rectangle;
        get isAlignedBox(): boolean;
        setAnchor(x: number, y?: number): this;
        getLocalBounds(): Rectangle;
        getBounds(): Rectangle;
        updateBounds(): this;
        updateParentTransform(): this;
        getGlobalTransform(): Matrix;
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        contains(x: number, y: number): boolean;
        inView(view: View): boolean;
        render(_runtime: SceneRenderRuntime): this;
        destroy(): void;
        private _updateOrigin;
    }
}
declare module "math/Circle" {
    import { Vector } from "math/Vector";
    import { Rectangle } from "math/Rectangle";
    import { Interval } from "math/Interval";
    import type { ShapeLike } from "math/ShapeLike";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    export class Circle implements ShapeLike {
        static collisionSegments: number;
        readonly collisionType: CollisionType;
        private readonly _position;
        private _collisionVertices;
        private _radius;
        constructor(x?: number, y?: number, radius?: number);
        get position(): Vector;
        set position(position: Vector);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get radius(): number;
        set radius(radius: number);
        setPosition(x: number, y: number): this;
        setRadius(radius: number): this;
        set(x: number, y: number, radius: number): this;
        copy(circle: Circle): this;
        clone(): this;
        equals({ x, y, radius }?: Partial<Circle>): boolean;
        getBounds(): Rectangle;
        /**
         * todo - cache this
         */
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        contains(x: number, y: number): boolean;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        destroy(): void;
        private getCollisionVertices;
        private getCollisionVertex;
        static get temp(): Circle;
    }
}
declare module "math/collision-detection" {
    import type { Collidable, CollisionResponse } from "math/Collision";
    import type { Circle } from "math/Circle";
    import type { Ellipse } from "math/Ellipse";
    import type { Line } from "math/Line";
    import type { Polygon } from "math/Polygon";
    import type { Rectangle } from "math/Rectangle";
    import type { PointLike } from "math/PointLike";
    /**
     * INTERSECTION
     */
    const intersectionSat: (shapeA: Collidable, shapeB: Collidable) => boolean;
    const intersectionPointPoint: (pointA: PointLike, pointB: PointLike, threshold?: number) => boolean;
    const intersectionPointLine: (point: PointLike, line: Line, threshold?: number) => boolean;
    const intersectionPointRect: (point: PointLike, rectangle: Rectangle) => boolean;
    const intersectionPointCircle: (point: PointLike, circle: Circle) => boolean;
    const intersectionPointEllipse: (point: PointLike, ellipse: Ellipse) => boolean;
    const intersectionPointPoly: (point: PointLike, polygon: Polygon) => boolean;
    const intersectionLineLine: (lineA: Line, lineB: Line) => boolean;
    const intersectionLineRect: (line: Line, rectangle: Rectangle) => boolean;
    const intersectionLineCircle: (line: Line, circle: Circle) => boolean;
    const intersectionLineEllipse: (line: Line, ellipse: Ellipse) => boolean;
    const intersectionLinePoly: (line: Line, polygon: Polygon) => boolean;
    const intersectionRectRect: (rectA: Rectangle, rectB: Rectangle) => boolean;
    const intersectionRectCircle: ({ x: rx, y: ry, width, height }: Rectangle, { x: cx, y: cy, radius }: Circle) => boolean;
    const intersectionRectEllipse: (rectangle: Rectangle, ellipse: Ellipse) => boolean;
    const intersectionRectPoly: (rectangle: Rectangle, polygon: Polygon) => boolean;
    const intersectionCircleCircle: ({ x: x1, y: y1, radius: r1 }: Circle, { x: x2, y: y2, radius: r2 }: Circle) => boolean;
    const intersectionCircleEllipse: (circle: Circle, ellipse: Ellipse) => boolean;
    const intersectionCirclePoly: ({ x: cx, y: cy, radius }: Circle, { x: px, y: py, points, edges }: Polygon) => boolean;
    const intersectionEllipseEllipse: (ellipseA: Ellipse, ellipseB: Ellipse) => boolean;
    const intersectionEllipsePoly: (ellipse: Ellipse, polygon: Polygon) => boolean;
    const intersectionPolyPoly: (polygonA: Polygon, polygonB: Polygon) => boolean;
    /**
     * COLLISION DETECTION
     */
    const getCollisionRectangleRectangle: (rectA: Rectangle, rectB: Rectangle) => CollisionResponse | null;
    const getCollisionCircleCircle: (circleA: Circle, circleB: Circle) => CollisionResponse | null;
    const getCollisionCircleRectangle: (circle: Circle, rect: Rectangle, swap?: boolean) => CollisionResponse | null;
    const getCollisionPolygonCircle: (polygon: Polygon, circle: Circle, swap?: boolean) => CollisionResponse | null;
    const getCollisionSat: (shapeA: Collidable, shapeB: Collidable) => CollisionResponse | null;
    export { intersectionSat, intersectionPointPoint, intersectionPointLine, intersectionPointRect, intersectionPointCircle, intersectionPointEllipse, intersectionPointPoly, intersectionLineLine, intersectionLineRect, intersectionLineCircle, intersectionLineEllipse, intersectionLinePoly, intersectionRectRect, intersectionRectCircle, intersectionRectEllipse, intersectionRectPoly, intersectionCircleCircle, intersectionCircleEllipse, intersectionCirclePoly, intersectionEllipseEllipse, intersectionEllipsePoly, intersectionPolyPoly, getCollisionSat, getCollisionRectangleRectangle, getCollisionCircleRectangle, getCollisionCircleCircle, getCollisionPolygonCircle, };
}
declare module "math/Vector" {
    import type { ShapeLike } from "math/ShapeLike";
    import { Interval } from "math/Interval";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    import { Rectangle } from "math/Rectangle";
    import { AbstractVector } from "math/AbstractVector";
    export class Vector extends AbstractVector implements ShapeLike {
        readonly collisionType: CollisionType;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        clone(): this;
        copy(vector: Vector): this;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        getBounds(): Rectangle;
        contains(x: number, y: number): boolean;
        getNormals(): Array<Vector>;
        project(axis: Vector, interval?: Interval): Interval;
        destroy(): void;
        static get temp(): Vector;
        static readonly zero: Vector;
        static readonly one: Vector;
        static add(v1: Vector, v2: Vector): Vector;
        static subtract(v1: Vector, v2: Vector): Vector;
        static multiply(v1: Vector, v2: Vector): Vector;
        static divide(v1: Vector, v2: Vector): Vector;
    }
}
declare module "math/utils" {
    import type { Vector } from "math/Vector";
    export const tau: number;
    export const radiansPerDegree: number;
    export const degreesPerRadian: number;
    export const enum VoronoiRegion {
        left = -1,
        middle = 0,
        right = 1
    }
    export const trimRotation: (degrees: number) => number;
    export const degreesToRadians: (degree: number) => number;
    export const radiansToDegrees: (radian: number) => number;
    export const clamp: (value: number, min: number, max: number) => number;
    export const sign: (value: number) => number;
    export const lerp: (startValue: number, endValue: number, ratio: number) => number;
    export const isPowerOfTwo: (value: number) => boolean;
    export const inRange: (value: number, min: number, max: number) => boolean;
    export const getDistance: (x1: number, y1: number, x2: number, y2: number) => number;
    export const bezierCurveTo: (fromX: number, fromY: number, cpX1: number, cpY1: number, cpX2: number, cpY2: number, toX: number, toY: number, path?: Array<number>, len?: number) => Array<number>;
    export const quadraticCurveTo: (fromX: number, fromY: number, cpX: number, cpY: number, toX: number, toY: number, path?: Array<number>, len?: number) => Array<number>;
    export const getVoronoiRegion: (line: Vector, point: Vector) => VoronoiRegion;
}
declare module "math/Rectangle" {
    import { Size } from "math/Size";
    import { Interval } from "math/Interval";
    import type { Matrix } from "math/Matrix";
    import type { ShapeLike } from "math/ShapeLike";
    import type { Collidable, CollisionResponse } from "math/Collision";
    import { CollisionType } from "math/Collision";
    import type { Vector } from "math/Vector";
    export class Rectangle implements ShapeLike {
        readonly collisionType: CollisionType;
        private readonly _position;
        private readonly _size;
        private _normals;
        private _normalsDirty;
        constructor(x?: number, y?: number, width?: number, height?: number);
        get position(): Vector;
        set position(position: Vector);
        get x(): number;
        set x(x: number);
        get y(): number;
        set y(y: number);
        get size(): Size;
        set size(size: Size);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        get left(): number;
        get top(): number;
        get right(): number;
        get bottom(): number;
        setPosition(x: number, y: number): this;
        setSize(width: number, height: number): this;
        set(x: number, y: number, width: number, height: number): this;
        copy(rectangle: Rectangle): this;
        clone(): this;
        equals({ x, y, width, height }?: Partial<Rectangle>): boolean;
        getBounds(): Rectangle;
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        transform(matrix: Matrix, result?: Rectangle): Rectangle;
        contains(x: number, y: number): boolean;
        containsRect(rect: Rectangle): boolean;
        intersectsWith(target: Collidable): boolean;
        collidesWith(target: Collidable): CollisionResponse | null;
        destroy(): void;
        private _updateNormals;
        static get temp(): Rectangle;
    }
}
declare module "core/types" {
    import type { Rectangle } from "math/Rectangle";
    export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
    export type TimeInterval = 1 | 1000 | 60000 | 3600000;
    export type TypedEnum<Enum, Type> = {
        [Key in keyof Enum]: Type;
    };
    export type ValueOf<T> = T[keyof T];
    export type Mutable<T> = {
        -readonly [P in keyof T]: T[P];
    };
    export type TextureSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null;
    export interface PlaybackOptions {
        volume: number;
        playbackRate: number;
        loop: boolean;
        muted: boolean;
        time: number;
    }
    export interface Cloneable {
        clone(): this;
        copy(source: this): this;
    }
    export interface Destroyable {
        destroy(): void;
    }
    export interface HasBoundingBox {
        getBounds(): Rectangle;
    }
    export type StreamingLoadEvent = 'loadedmetadata' | 'loadeddata' | 'canplay' | 'canplaythrough';
}
declare module "core/Clock" {
    import { Time } from "core/Time";
    export class Clock {
        private _startTime;
        private _elapsedTime;
        private _running;
        constructor(startTime?: Time, autoStart?: boolean);
        get running(): boolean;
        get elapsedTime(): Time;
        get elapsedMilliseconds(): number;
        get elapsedSeconds(): number;
        get elapsedMinutes(): number;
        get elapsedHours(): number;
        start(): this;
        stop(): this;
        reset(): this;
        restart(): this;
        destroy(): void;
    }
}
declare module "core/Signal" {
    type SignalHandler<Args extends Array<unknown>> = (...params: Args) => void | boolean;
    interface SignalBinding<Args extends Array<unknown>> {
        handler: SignalHandler<Args>;
        context?: object;
    }
    export class Signal<Args extends Array<unknown> = []> {
        private readonly _bindings;
        get bindings(): ReadonlyArray<SignalBinding<Args>>;
        has(handler: SignalHandler<Args>, context?: object): boolean;
        add(handler: SignalHandler<Args>, context?: object): this;
        once(handler: SignalHandler<Args>, context?: object): this;
        remove(handler: SignalHandler<Args>, context?: object): this;
        clearByContext(context?: object): this;
        clear(): this;
        dispatch(...params: Args): this;
        destroy(): void;
    }
}
declare module "rendering/utils" {
    export const createQuadIndices: (size: number) => Uint16Array;
    export interface CreateCanvasOptions {
        canvas?: HTMLCanvasElement;
        fillStyle?: string;
        width?: number;
        height?: number;
    }
    export const createCanvas: (options?: CreateCanvasOptions) => HTMLCanvasElement;
    export const determineFontHeight: (font: string) => number;
}
declare module "rendering/texture/Sampler" {
    import type { ScaleModes, WrapModes } from "rendering/types";
    export interface SamplerOptions {
        scaleMode: ScaleModes;
        wrapMode: WrapModes;
        premultiplyAlpha: boolean;
        generateMipMap: boolean;
        flipY: boolean;
    }
    export class Sampler {
        private readonly _context;
        private readonly _sampler;
        private _scaleMode;
        private _wrapMode;
        private _premultiplyAlpha;
        private _generateMipMap;
        private _flipY;
        constructor(gl: WebGL2RenderingContext, options: SamplerOptions);
        get sampler(): WebGLSampler | null;
        get scaleMode(): ScaleModes;
        set scaleMode(scaleMode: ScaleModes);
        get wrapMode(): WrapModes;
        set wrapMode(wrapMode: WrapModes);
        setScaleMode(scaleMode: ScaleModes): this;
        setWrapMode(wrapMode: WrapModes): this;
        bind(textureUnit: number): this;
        destroy(): void;
        private updateScaleModeParameters;
        private updateWrapModeParameters;
    }
}
declare module "rendering/texture/Texture" {
    import { ScaleModes, WrapModes } from "rendering/types";
    import { Size } from "math/Size";
    import type { SamplerOptions } from "rendering/texture/Sampler";
    import type { TextureSource } from "core/types";
    export class Texture {
        private static _black;
        private static _white;
        static defaultSamplerOptions: SamplerOptions;
        static readonly empty: Texture;
        static get black(): Texture;
        static get white(): Texture;
        private _version;
        private _source;
        private _size;
        private readonly _destroyListeners;
        private _scaleMode;
        private _wrapMode;
        private _premultiplyAlpha;
        private _generateMipMap;
        private _flipY;
        constructor(source?: TextureSource, options?: Partial<SamplerOptions>);
        get source(): TextureSource;
        set source(source: TextureSource);
        get size(): Size;
        set size(size: Size);
        get width(): number;
        set width(width: number);
        get height(): number;
        set height(height: number);
        get scaleMode(): ScaleModes;
        set scaleMode(scaleMode: ScaleModes);
        get wrapMode(): WrapModes;
        set wrapMode(wrapMode: WrapModes);
        get premultiplyAlpha(): boolean;
        set premultiplyAlpha(premultiplyAlpha: boolean);
        get generateMipMap(): boolean;
        set generateMipMap(generateMipMap: boolean);
        get flipY(): boolean;
        set flipY(flipY: boolean);
        get powerOfTwo(): boolean;
        get version(): number;
        addDestroyListener(listener: () => void): this;
        removeDestroyListener(listener: () => void): this;
        setScaleMode(scaleMode: ScaleModes): this;
        setWrapMode(wrapMode: WrapModes): this;
        setPremultiplyAlpha(premultiplyAlpha: boolean): this;
        setSource(source: TextureSource): this;
        updateSource(): this;
        setSize(width: number, height: number): this;
        destroy(): void;
        private _touch;
    }
}
declare module "audio/Media" {
    import type { PlaybackOptions } from "core/types";
    export interface Media {
        readonly duration: number;
        readonly progress: number;
        readonly analyserTarget: AudioNode | null;
        volume: number;
        loop: boolean;
        playbackRate: number;
        currentTime: number;
        muted: boolean;
        paused: boolean;
        playing: boolean;
        play(options?: Partial<PlaybackOptions>): this;
        pause(options?: Partial<PlaybackOptions>): this;
        stop(options?: Partial<PlaybackOptions>): this;
        toggle(options?: Partial<PlaybackOptions>): this;
        applyOptions(options: Partial<PlaybackOptions>): this;
        setVolume(volume: number): this;
        setLoop(loop: boolean): this;
        setPlaybackRate(playbackRate: number): this;
        getTime(): number;
        setTime(time: number): this;
        setMuted(muted: boolean): this;
        destroy(): void;
    }
}
declare module "audio/AbstractMedia" {
    import type { Media } from "audio/Media";
    import { Signal } from "core/Signal";
    import type { PlaybackOptions } from "core/types";
    export interface AbstractMediaInitialState extends Omit<PlaybackOptions, 'time'> {
        duration: number;
    }
    export abstract class AbstractMedia implements Media {
        readonly onStart: Signal<[]>;
        readonly onStop: Signal<[]>;
        protected readonly _duration: number;
        protected _volume: number;
        protected _playbackRate: number;
        protected _loop: boolean;
        protected _muted: boolean;
        abstract get paused(): boolean;
        abstract set paused(paused: boolean);
        abstract get analyserTarget(): AudioNode | null;
        get duration(): number;
        get volume(): number;
        set volume(volume: number);
        get loop(): boolean;
        set loop(loop: boolean);
        get playbackRate(): number;
        set playbackRate(playbackRate: number);
        get currentTime(): number;
        set currentTime(currentTime: number);
        get muted(): boolean;
        set muted(muted: boolean);
        get progress(): number;
        get playing(): boolean;
        set playing(playing: boolean);
        protected constructor(initialState: AbstractMediaInitialState);
        abstract play(options?: Partial<PlaybackOptions>): this;
        abstract pause(options?: Partial<PlaybackOptions>): this;
        abstract setVolume(volume: number): this;
        abstract setLoop(loop: boolean): this;
        abstract setPlaybackRate(playbackRate: number): this;
        abstract getTime(): number;
        abstract setTime(time: number): this;
        abstract setMuted(muted: boolean): this;
        stop(options?: Partial<PlaybackOptions>): this;
        toggle(options?: Partial<PlaybackOptions>): this;
        applyOptions(options?: Partial<PlaybackOptions>): this;
        destroy(): void;
    }
}
declare module "audio/audio-context" {
    import { Signal } from "core/Signal";
    class AudioContextReadySignal extends Signal<[AudioContext]> {
        add(handler: (audioContext: AudioContext) => void | boolean, context?: object): this;
        once(handler: (audioContext: AudioContext) => void | boolean, context?: object): this;
    }
    export const onAudioContextReady: AudioContextReadySignal;
    export const getAudioContext: () => AudioContext;
    export const isAudioContextReady: () => boolean;
    export const getOfflineAudioContext: () => OfflineAudioContext;
    export const decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
}
declare module "audio/Music" {
    import type { PlaybackOptions } from "core/types";
    import { AbstractMedia } from "audio/AbstractMedia";
    export class Music extends AbstractMedia {
        private readonly _audioElement;
        private _audioSetup;
        constructor(audioElement: HTMLAudioElement, options?: Partial<PlaybackOptions>);
        setVolume(value: number): this;
        setLoop(loop: boolean): this;
        setPlaybackRate(value: number): this;
        getTime(): number;
        setTime(currentTime: number): this;
        setMuted(muted: boolean): this;
        get paused(): boolean;
        set paused(paused: boolean);
        get analyserTarget(): AudioNode | null;
        play(options?: Partial<PlaybackOptions>): this;
        pause(options?: Partial<PlaybackOptions>): this;
        destroy(): void;
        private setupWithAudioContext;
    }
}
declare module "audio/Sound" {
    import type { PlaybackOptions } from "core/types";
    import { AbstractMedia } from "audio/AbstractMedia";
    export class Sound extends AbstractMedia {
        private readonly _audioBuffer;
        private _audioSetup;
        private _paused;
        private _startTime;
        private _currentTime;
        private _sourceNode;
        get paused(): boolean;
        set paused(paused: boolean);
        get analyserTarget(): GainNode | null;
        constructor(audioBuffer: AudioBuffer, options?: Partial<PlaybackOptions>);
        setVolume(value: number): this;
        setLoop(loop: boolean): this;
        setPlaybackRate(value: number): this;
        getTime(): number;
        setTime(currentTime: number): this;
        setMuted(muted: boolean): this;
        play(options?: Partial<PlaybackOptions>): this;
        pause(options?: Partial<PlaybackOptions>): this;
        destroy(): void;
        private createSourceNode;
        private setupWithAudioContext;
    }
}
declare module "rendering/texture/RenderTexture" {
    import { RenderTarget } from "rendering/RenderTarget";
    import { ScaleModes, WrapModes } from "rendering/types";
    import type { SamplerOptions } from "rendering/texture/Sampler";
    export class RenderTexture extends RenderTarget {
        static defaultSamplerOptions: SamplerOptions;
        private _source;
        private _textureVersion;
        private _scaleMode;
        private _wrapMode;
        private _premultiplyAlpha;
        private _generateMipMap;
        private _flipY;
        constructor(width: number, height: number, options?: Partial<SamplerOptions>);
        get source(): DataView | null;
        set source(source: DataView | null);
        get scaleMode(): ScaleModes;
        set scaleMode(scaleMode: ScaleModes);
        get wrapMode(): WrapModes;
        set wrapMode(wrapMode: WrapModes);
        get premultiplyAlpha(): boolean;
        set premultiplyAlpha(premultiplyAlpha: boolean);
        get generateMipMap(): boolean;
        set generateMipMap(generateMipMap: boolean);
        get flipY(): boolean;
        set flipY(flipY: boolean);
        get powerOfTwo(): boolean;
        get textureVersion(): number;
        setScaleMode(scaleMode: ScaleModes): this;
        setWrapMode(wrapMode: WrapModes): this;
        setPremultiplyAlpha(premultiplyAlpha: boolean): this;
        setSource(source: DataView | null): this;
        updateSource(): this;
        setSize(width: number, height: number): this;
        destroy(): void;
        private _touchTexture;
    }
}
declare module "rendering/sprite/Sprite" {
    import { Drawable } from "rendering/Drawable";
    import { Rectangle } from "math/Rectangle";
    import { Vector } from "math/Vector";
    import { Interval } from "math/Interval";
    import type { Texture } from "rendering/texture/Texture";
    import type { RenderTexture } from "rendering/texture/RenderTexture";
    export enum SpriteFlags {
        None = 0,
        Translation = 1,
        Rotation = 2,
        Scaling = 4,
        Origin = 8,
        Transform = 15,
        TransformInverse = 16,
        BoundingBox = 32,
        TextureCoords = 64,
        VertexTint = 128
    }
    export class Sprite extends Drawable {
        private _texture;
        private _textureFrame;
        private _vertices;
        private _texCoords;
        constructor(texture: Texture | RenderTexture | null);
        get texture(): Texture | RenderTexture | null;
        set texture(texture: Texture | RenderTexture | null);
        get textureFrame(): Rectangle;
        set textureFrame(frame: Rectangle);
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        get vertices(): Float32Array;
        get texCoords(): Uint32Array;
        setTexture(texture: Texture | RenderTexture | null): this;
        updateTexture(): this;
        setTextureFrame(frame: Rectangle, resetSize?: boolean): this;
        resetTextureFrame(): this;
        getNormals(): Array<Vector>;
        project(axis: Vector, result?: Interval): Interval;
        contains(x: number, y: number): boolean;
        destroy(): void;
    }
}
declare module "rendering/video/Video" {
    import { Sprite } from "rendering/sprite/Sprite";
    import { Signal } from "core/Signal";
    import type { PlaybackOptions } from "core/types";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    import type { SamplerOptions } from "rendering/texture/Sampler";
    import type { Media } from "audio/Media";
    export class Video extends Sprite implements Media {
        readonly onStart: Signal<[]>;
        readonly onStop: Signal<[]>;
        private readonly _videoElement;
        private readonly _duration;
        private _volume;
        private _playbackRate;
        private _loop;
        private _muted;
        private _audioSetup;
        private _textureDirty;
        private _lastVideoTime;
        private _videoFrameCallbackHandle;
        private readonly _onMetadataHandler;
        private readonly _onResizeHandler;
        private readonly _onVideoFrameHandler;
        constructor(videoElement: HTMLVideoElement, playbackOptions?: Partial<PlaybackOptions>, samplerOptions?: Partial<SamplerOptions>);
        get videoElement(): HTMLVideoElement;
        get duration(): number;
        get progress(): number;
        get volume(): number;
        set volume(value: number);
        get loop(): boolean;
        set loop(loop: boolean);
        get playbackRate(): number;
        set playbackRate(value: number);
        get currentTime(): number;
        set currentTime(time: number);
        get muted(): boolean;
        set muted(muted: boolean);
        get paused(): boolean;
        set paused(paused: boolean);
        get playing(): boolean;
        set playing(playing: boolean);
        get analyserTarget(): AudioNode | null;
        play(options?: Partial<PlaybackOptions>): this;
        pause(options?: Partial<PlaybackOptions>): this;
        stop(options?: Partial<PlaybackOptions>): this;
        toggle(options?: Partial<PlaybackOptions>): this;
        applyOptions(options?: Partial<PlaybackOptions>): this;
        setVolume(value: number): this;
        setLoop(loop: boolean): this;
        setPlaybackRate(value: number): this;
        getTime(): number;
        setTime(time: number): this;
        setMuted(muted: boolean): this;
        render(renderManager: SceneRenderRuntime): this;
        updateTexture(): this;
        destroy(): void;
        private _onVideoMetadataUpdated;
        private _onVideoFrame;
        private _markTextureDirtyIfPlaybackAdvanced;
        private _requestVideoFrameCallback;
        private _cancelVideoFrameCallback;
        private setupWithAudioContext;
    }
}
declare module "resources/tokens" {
    /**
     * Dispatch token for generic JSON loading.
     *
     * `loader.load(Json, 'config.json')` returns `Promise<unknown>`.
     * Narrow via generic: `loader.load<Config>(Json, 'config.json')`.
     * Handles all JSON shapes — objects, arrays, scalars.
     */
    export abstract class Json {
    }
    /**
     * Dispatch token for plain text loading.
     *
     * `loader.load(TextAsset, 'greeting.txt')` returns `Promise<string>`.
     */
    export abstract class TextAsset {
    }
    /**
     * Dispatch token for SVG loading.
     *
     * `loader.load(SvgAsset, 'icon.svg')` returns `Promise<HTMLImageElement>`.
     */
    export abstract class SvgAsset {
    }
    /**
     * Dispatch token for WebVTT subtitle loading.
     *
     * `loader.load(VttAsset, 'subs.vtt')` returns `Promise<Array<VTTCue>>`.
     */
    export abstract class VttAsset {
    }
}
declare module "resources/AssetFactory" {
    export interface AssetFactory<T = unknown> {
        readonly storageName: string;
        process(response: Response): Promise<unknown>;
        create(source: unknown, options?: unknown): Promise<T>;
        destroy(): void;
    }
}
declare module "resources/FactoryRegistry" {
    import type { AssetFactory } from "resources/AssetFactory";
    export type AssetConstructor<T = unknown> = abstract new (...args: Array<any>) => T;
    export class FactoryRegistry {
        private readonly _factories;
        register<T>(type: AssetConstructor<T>, factory: AssetFactory<T>): void;
        resolve<T>(type: AssetConstructor<T>): AssetFactory<T>;
        has(type: AssetConstructor): boolean;
        destroy(): void;
    }
}
declare module "resources/AbstractAssetFactory" {
    import type { AssetFactory } from "resources/AssetFactory";
    export abstract class AbstractAssetFactory<T = unknown> implements AssetFactory<T> {
        protected readonly _objectUrls: Array<string>;
        abstract readonly storageName: string;
        abstract process(response: Response): Promise<unknown>;
        abstract create(source: unknown, options?: unknown): Promise<T>;
        createObjectUrl(blob: Blob): string;
        protected revokeObjectUrl(objectUrl: string): void;
        destroy(): void;
    }
}
declare module "resources/factories/FontFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export interface FontFactoryOptions {
        family: string;
        descriptors?: FontFaceDescriptors;
        addToDocument?: boolean;
    }
    export class FontFactory extends AbstractAssetFactory<FontFace> {
        readonly storageName = "font";
        private readonly _addedFontFaces;
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer, options?: FontFactoryOptions): Promise<FontFace>;
        destroy(): void;
    }
}
declare module "resources/utils" {
    export const determineMimeType: (arrayBuffer: ArrayBuffer) => string;
}
declare module "resources/factories/ImageFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    interface ImageFactoryOptions {
        mimeType?: string;
    }
    export class ImageFactory extends AbstractAssetFactory<HTMLImageElement> {
        readonly storageName = "image";
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer, options?: ImageFactoryOptions): Promise<HTMLImageElement>;
    }
}
declare module "resources/factories/JsonFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export class JsonFactory extends AbstractAssetFactory<unknown> {
        readonly storageName = "json";
        process(response: Response): Promise<unknown>;
        create(source: unknown): Promise<unknown>;
    }
}
declare module "resources/factories/MusicFactory" {
    import type { PlaybackOptions, StreamingLoadEvent } from "core/types";
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    import { Music } from "audio/Music";
    interface MusicFactoryOptions {
        mimeType?: string;
        loadEvent?: StreamingLoadEvent;
        playbackOptions?: Partial<PlaybackOptions>;
    }
    export class MusicFactory extends AbstractAssetFactory<Music> {
        readonly storageName = "music";
        private readonly _audioElements;
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer, options?: MusicFactoryOptions): Promise<Music>;
        destroy(): void;
    }
}
declare module "resources/factories/SoundFactory" {
    import type { PlaybackOptions } from "core/types";
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    import { Sound } from "audio/Sound";
    interface SoundFactoryOptions {
        playbackOptions?: Partial<PlaybackOptions>;
    }
    export class SoundFactory extends AbstractAssetFactory<Sound> {
        readonly storageName = "sound";
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer, options?: SoundFactoryOptions): Promise<Sound>;
    }
}
declare module "resources/factories/TextFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export class TextFactory extends AbstractAssetFactory<string> {
        readonly storageName = "text";
        process(response: Response): Promise<string>;
        create(source: string): Promise<string>;
    }
}
declare module "resources/factories/TextureFactory" {
    import { Texture } from "rendering/texture/Texture";
    import type { SamplerOptions } from "rendering/texture/Sampler";
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    interface TextureFactoryOptions {
        mimeType?: string;
        samplerOptions?: SamplerOptions;
    }
    export class TextureFactory extends AbstractAssetFactory<Texture> {
        readonly storageName = "texture";
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer, options?: TextureFactoryOptions): Promise<Texture>;
    }
}
declare module "resources/factories/VideoFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    import type { SamplerOptions } from "rendering/texture/Sampler";
    import type { PlaybackOptions, StreamingLoadEvent } from "core/types";
    import { Video } from "rendering/video/Video";
    interface VideoFactoryOptions {
        mimeType?: string;
        loadEvent?: StreamingLoadEvent;
        playbackOptions?: Partial<PlaybackOptions>;
        samplerOptions?: Partial<SamplerOptions>;
    }
    export class VideoFactory extends AbstractAssetFactory<Video> {
        readonly storageName = "video";
        private readonly _videoElements;
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer, options?: VideoFactoryOptions): Promise<Video>;
        destroy(): void;
    }
}
declare module "resources/factories/SvgFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export class SvgFactory extends AbstractAssetFactory<HTMLImageElement> {
        readonly storageName = "svg";
        process(response: Response): Promise<string>;
        create(source: string): Promise<HTMLImageElement>;
    }
}
declare module "resources/factories/BinaryFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export class BinaryFactory extends AbstractAssetFactory<ArrayBuffer> {
        readonly storageName = "binary";
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer): Promise<ArrayBuffer>;
    }
}
declare module "resources/factories/WasmFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export class WasmFactory extends AbstractAssetFactory<WebAssembly.Module> {
        readonly storageName = "wasm";
        process(response: Response): Promise<ArrayBuffer>;
        create(source: ArrayBuffer): Promise<WebAssembly.Module>;
    }
}
declare module "resources/factories/VttFactory" {
    import { AbstractAssetFactory } from "resources/AbstractAssetFactory";
    export class VttFactory extends AbstractAssetFactory<Array<VTTCue>> {
        readonly storageName = "vtt";
        process(response: Response): Promise<string>;
        create(source: string): Promise<Array<VTTCue>>;
    }
}
declare module "resources/CacheStore" {
    export interface CacheStore {
        load(storageName: string, key: string): Promise<unknown | null>;
        save(storageName: string, key: string, data: unknown): Promise<void>;
        delete(storageName: string, key: string): Promise<boolean>;
        clear(storageName: string): Promise<boolean>;
        destroy(): void;
    }
}
declare module "resources/Loader" {
    import { Signal } from "core/Signal";
    import { Json, TextAsset, SvgAsset, VttAsset } from "resources/tokens";
    import type { AssetFactory } from "resources/AssetFactory";
    import type { AssetConstructor } from "resources/FactoryRegistry";
    import type { CacheStore } from "resources/CacheStore";
    export type Loadable = abstract new (...args: Array<any>) => any;
    export type LoadReturn<T> = T extends typeof Json ? unknown : T extends typeof TextAsset ? string : T extends typeof SvgAsset ? HTMLImageElement : T extends typeof VttAsset ? Array<VTTCue> : T extends abstract new (...args: Array<any>) => infer R ? R : never;
    export interface LoaderOptions {
        resourcePath?: string;
        requestOptions?: RequestInit;
        cache?: CacheStore | ReadonlyArray<CacheStore>;
        concurrency?: number;
    }
    export class Loader {
        private readonly _registry;
        private readonly _resources;
        private readonly _manifest;
        private readonly _inFlight;
        private readonly _typeIds;
        private readonly _preventStoreKeys;
        private readonly _stores;
        private _resourcePath;
        private _requestOptions;
        private _concurrency;
        private _nextTypeId;
        private _backgroundQueue;
        private _backgroundActive;
        private _backgroundTotal;
        private _backgroundLoaded;
        private _backgroundResolve;
        readonly onProgress: Signal<[loaded: number, total: number]>;
        readonly onLoaded: Signal<[type: AssetConstructor, alias: string, resource: unknown]>;
        readonly onError: Signal<[type: AssetConstructor, alias: string, error: Error]>;
        constructor(options?: LoaderOptions);
        register<T>(type: AssetConstructor<T>, factory: AssetFactory<T>): this;
        add(type: Loadable, path: string): this;
        add(type: Loadable, paths: ReadonlyArray<string>): this;
        add(type: Loadable, items: Readonly<Record<string, string>>): this;
        load<T = unknown>(type: typeof Json, path: string, options?: unknown): Promise<T>;
        load<T = unknown>(type: typeof Json, paths: ReadonlyArray<string>, options?: unknown): Promise<Array<T>>;
        load<T = unknown, K extends string = string>(type: typeof Json, items: Readonly<Record<K, string>>, options?: unknown): Promise<Record<K, T>>;
        load<T extends Loadable>(type: T, path: string, options?: unknown): Promise<LoadReturn<T>>;
        load<T extends Loadable>(type: T, paths: ReadonlyArray<string>, options?: unknown): Promise<Array<LoadReturn<T>>>;
        load<T extends Loadable, K extends string>(type: T, items: Readonly<Record<K, string>>, options?: unknown): Promise<Record<K, LoadReturn<T>>>;
        backgroundLoad(): void;
        loadAll(): Promise<void>;
        setConcurrency(n: number): this;
        get<T = unknown>(type: typeof Json, alias: string): T;
        get<T extends Loadable>(type: T, alias: string): LoadReturn<T>;
        peek<T = unknown>(type: typeof Json, alias: string): T | null;
        peek<T extends Loadable>(type: T, alias: string): LoadReturn<T> | null;
        has(type: Loadable, alias: string): boolean;
        unload(type: Loadable, alias: string): this;
        unloadAll(type?: Loadable): this;
        get resourcePath(): string;
        set resourcePath(value: string);
        get requestOptions(): RequestInit;
        set requestOptions(value: RequestInit);
        destroy(): void;
        private _loadSingle;
        private _fetch;
        private _drainBackground;
        private _boostFromQueue;
        private _onBackgroundItemDone;
        private _startBackgroundEntry;
        private _trackInFlight;
        private _addManifestEntry;
        private _getManifestEntry;
        private _hasResource;
        private _storeResource;
        private _key;
        private _resolveUrl;
        private _registerBuiltinFactories;
    }
}
declare module "core/Scene" {
    import type { Time } from "core/Time";
    import type { Loader } from "resources/Loader";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    import { Container } from "rendering/Container";
    import type { SceneNode } from "core/SceneNode";
    import type { Application } from "core/Application";
    export interface SceneData {
        load?: (loader: Loader) => Promise<void> | void;
        init?: (loader: Loader) => Promise<void> | void;
        update?: (delta: Time) => void;
        draw?: (renderManager: SceneRenderRuntime) => void;
        unload?: (loader: Loader) => Promise<void> | void;
    }
    export type SceneInstance<T extends SceneData = SceneData> = Scene & T;
    export class Scene {
        private _app;
        private readonly _root;
        static create<T extends SceneData>(definition: T & ThisType<SceneInstance<T>>): SceneInstance<T>;
        constructor();
        get app(): Application | null;
        set app(app: Application | null);
        get root(): Container;
        addChild(child: SceneNode): this;
        removeChild(child: SceneNode): this;
        load(loader: Loader): Promise<void> | void;
        init(loader: Loader): Promise<void> | void;
        update(delta: Time): void;
        draw(renderManager: SceneRenderRuntime): void;
        unload(loader: Loader): Promise<void> | void;
        destroy(): void;
    }
}
declare module "core/SceneManager" {
    import { Signal } from "core/Signal";
    import type { Time } from "core/Time";
    import type { Scene } from "core/Scene";
    import type { Application } from "core/Application";
    export class SceneManager {
        private readonly _app;
        private _scene;
        readonly onChangeScene: Signal<[Scene | null]>;
        readonly onStartScene: Signal<[Scene]>;
        readonly onUpdateScene: Signal<[Scene]>;
        readonly onStopScene: Signal<[Scene]>;
        constructor(app: Application);
        get scene(): Scene | null;
        set scene(scene: Scene | null);
        setScene(scene: Scene | null): Promise<this>;
        update(delta: Time): this;
        destroy(): void;
        private _unloadScene;
    }
}
declare module "rendering/webgl2/WebGl2ShaderMappings" {
    export const webGl2PrimitiveByteSizeMapping: Record<number, number>;
    export const webGl2PrimitiveArrayConstructors: Record<number, Float32ArrayConstructor | Int32ArrayConstructor | Uint8ArrayConstructor>;
    export const webGl2PrimitiveTypeNames: Record<number, string>;
}
declare module "rendering/shader/ShaderAttribute" {
    export class ShaderAttribute {
        readonly index: number;
        readonly name: string;
        readonly type: number;
        readonly size: number;
        location: number;
        constructor(index: number, name: string, type: number);
        destroy(): void;
    }
}
declare module "rendering/webgl2/WebGl2RenderBuffer" {
    import type { BufferTypes, BufferUsage } from "rendering/types";
    import type { TypedArray } from "core/types";
    type DataContainer = ArrayBuffer | SharedArrayBuffer | ArrayBufferView | TypedArray;
    export interface WebGl2RenderBufferRuntime {
        bind(buffer: WebGl2RenderBuffer): void;
        upload(buffer: WebGl2RenderBuffer, offset: number): void;
        destroy(buffer: WebGl2RenderBuffer): void;
    }
    export class WebGl2RenderBuffer {
        private readonly _type;
        private readonly _usage;
        private _runtime;
        private _data;
        private _version;
        constructor(type: BufferTypes, data: DataContainer, usage: BufferUsage);
        get type(): number;
        get usage(): BufferUsage;
        get data(): DataContainer;
        get version(): number;
        connect(runtime: WebGl2RenderBufferRuntime): this;
        disconnect(): this;
        upload(data: DataContainer, offset?: number): void;
        bind(): void;
        destroy(): void;
    }
}
declare module "rendering/webgl2/WebGl2VertexArrayObject" {
    import { RenderingPrimitives } from "rendering/types";
    import type { ShaderAttribute } from "rendering/shader/ShaderAttribute";
    import type { WebGl2RenderBuffer } from "rendering/webgl2/WebGl2RenderBuffer";
    interface VaoAttribute {
        readonly buffer: WebGl2RenderBuffer;
        readonly location: number;
        readonly size: number;
        readonly type: number;
        readonly normalized: boolean;
        readonly stride: number;
        readonly start: number;
    }
    export interface WebGl2VertexArrayObjectRuntime {
        bind(vao: WebGl2VertexArrayObject): void;
        unbind(vao: WebGl2VertexArrayObject): void;
        draw(vao: WebGl2VertexArrayObject, size: number, start: number, type: RenderingPrimitives): void;
        destroy(vao: WebGl2VertexArrayObject): void;
    }
    export class WebGl2VertexArrayObject {
        private readonly _attributes;
        private _indexBuffer;
        private _drawMode;
        private _runtime;
        private _version;
        constructor(drawMode?: RenderingPrimitives);
        get attributes(): Array<VaoAttribute>;
        get indexBuffer(): WebGl2RenderBuffer | null;
        get drawMode(): RenderingPrimitives;
        get version(): number;
        connect(runtime: WebGl2VertexArrayObjectRuntime): this;
        disconnect(): this;
        bind(): this;
        unbind(): this;
        addAttribute(buffer: WebGl2RenderBuffer, attribute: ShaderAttribute, type?: number, normalized?: boolean, stride?: number, start?: number): this;
        addIndex(buffer: WebGl2RenderBuffer): this;
        clear(): this;
        draw(size: number, start: number, type?: RenderingPrimitives): this;
        destroy(): void;
    }
}
declare module "rendering/Renderer" {
    import type { RenderBackendType } from "rendering/RenderBackendType";
    import type { Drawable } from "rendering/Drawable";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    export interface Renderer<Runtime extends SceneRenderRuntime = SceneRenderRuntime, Target extends Drawable = Drawable> {
        readonly backendType: RenderBackendType;
        connect(runtime: Runtime): void;
        disconnect(): void;
        render(drawable: Target): void;
        flush(): void;
    }
    /**
     * Constructor type used as a registry key for drawable-to-renderer mapping.
     * Supports both concrete and abstract drawable classes.
     */
    export type DrawableConstructor<Target extends Drawable = Drawable> = abstract new (...args: Array<never>) => Target;
}
declare module "rendering/shader/ShaderUniform" {
    import type { TypedArray } from "core/types";
    export class ShaderUniform {
        readonly index: number;
        readonly type: number;
        readonly size: number;
        readonly name: string;
        private readonly _value;
        private _dirty;
        constructor(index: number, type: number, size: number, name: string, data: TypedArray);
        get propName(): string;
        get value(): TypedArray;
        get dirty(): boolean;
        setValue(value: TypedArray): this;
        markClean(): void;
        destroy(): void;
    }
}
declare module "rendering/shader/Shader" {
    import type { ShaderAttribute } from "rendering/shader/ShaderAttribute";
    import type { ShaderUniform } from "rendering/shader/ShaderUniform";
    export interface ShaderRuntime {
        initialize(shader: Shader): void;
        bind(shader: Shader): void;
        unbind(shader: Shader): void;
        sync(shader: Shader): void;
        destroy(shader: Shader): void;
    }
    export class Shader {
        readonly attributes: Map<string, ShaderAttribute>;
        readonly uniforms: Map<string, ShaderUniform>;
        private readonly _vertexSource;
        private readonly _fragmentSource;
        private _runtime;
        constructor(vertexSource: string, fragmentSource: string);
        get vertexSource(): string;
        get fragmentSource(): string;
        connect(runtime: ShaderRuntime): this;
        disconnect(): this;
        bind(): this;
        unbind(): this;
        sync(): this;
        getAttribute(name: string): ShaderAttribute;
        getUniform(name: string): ShaderUniform;
        destroy(): void;
    }
}
declare module "rendering/webgl2/WebGl2RendererRuntime" {
    import type { BlendModes } from "rendering/types";
    import type { RenderBackendType } from "rendering/RenderBackendType";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    import type { Shader } from "rendering/shader/Shader";
    import type { WebGl2VertexArrayObject } from "rendering/webgl2/WebGl2VertexArrayObject";
    import type { Texture } from "rendering/texture/Texture";
    import type { RenderTexture } from "rendering/texture/RenderTexture";
    export interface WebGl2RendererRuntime extends SceneRenderRuntime {
        readonly backendType: RenderBackendType.WebGl2;
        readonly context: WebGL2RenderingContext;
        bindShader(shader: Shader | null): this;
        bindVertexArrayObject(vao: WebGl2VertexArrayObject | null): this;
        bindTexture(texture: Texture | RenderTexture | null, unit?: number): this;
        setBlendMode(blendMode: BlendModes | null): this;
    }
}
declare module "rendering/webgl2/AbstractWebGl2Renderer" {
    import { RenderBackendType } from "rendering/RenderBackendType";
    import type { Drawable } from "rendering/Drawable";
    import type { Renderer } from "rendering/Renderer";
    import type { WebGl2RendererRuntime } from "rendering/webgl2/WebGl2RendererRuntime";
    /**
     * Base class for WebGL2 renderers.
     *
     * Manages the connect/disconnect lifecycle and provides a safe
     * `getRuntime()` accessor that throws if the renderer is not connected.
     *
     * Subclasses must implement:
     * - onConnect(runtime): set up GL resources
     * - onDisconnect(): tear down GL resources
     * - render(drawable): batch or immediately draw the given drawable
     * - flush(): submit any batched draw calls to the GPU
     */
    export abstract class AbstractWebGl2Renderer<Target extends Drawable> implements Renderer<WebGl2RendererRuntime, Target> {
        readonly backendType = RenderBackendType.WebGl2;
        private _runtime;
        connect(runtime: WebGl2RendererRuntime): void;
        disconnect(): void;
        abstract render(drawable: Target): void;
        abstract flush(): void;
        /**
         * Called once when the renderer is first connected to a runtime.
         * Subclasses create GL resources here.
         */
        protected abstract onConnect(runtime: WebGl2RendererRuntime): void;
        /**
         * Called when the renderer is disconnected from its runtime.
         * Subclasses tear down GL resources here.
         */
        protected abstract onDisconnect(): void;
        /**
         * Safe accessor for the connected runtime.
         * @throws Error if the renderer is not connected.
         */
        protected getRuntime(): WebGl2RendererRuntime;
        /**
         * Returns the connected runtime, or null if not connected.
         * Use this for conditional checks where disconnected state is expected.
         */
        protected getRuntimeOrNull(): WebGl2RendererRuntime | null;
    }
}
declare module "rendering/webgl2/WebGl2ShaderBlock" {
    import { ShaderUniform } from "rendering/shader/ShaderUniform";
    export class WebGl2ShaderBlock {
        readonly index: number;
        readonly name: string;
        readonly binding: number;
        readonly dataSize: number;
        private readonly _context;
        private readonly _program;
        private readonly _blockData;
        private readonly _uniformBuffer;
        private readonly _uniforms;
        constructor(gl: WebGL2RenderingContext, program: WebGLProgram, index: number);
        getUniform(name: string): ShaderUniform;
        upload(): void;
        destroy(): void;
        private _extractUniforms;
    }
}
declare module "rendering/webgl2/WebGl2ShaderRuntime" {
    import type { ShaderRuntime } from "rendering/shader/Shader";
    export function createWebGl2ShaderRuntime(gl: WebGL2RenderingContext): ShaderRuntime;
}
declare module "rendering/webgl2/AbstractWebGl2BatchedRenderer" {
    import { AbstractWebGl2Renderer } from "rendering/webgl2/AbstractWebGl2Renderer";
    import { Shader } from "rendering/shader/Shader";
    import type { WebGl2VertexArrayObject, WebGl2VertexArrayObjectRuntime } from "rendering/webgl2/WebGl2VertexArrayObject";
    import { WebGl2RenderBuffer, type WebGl2RenderBufferRuntime } from "rendering/webgl2/WebGl2RenderBuffer";
    import type { Texture } from "rendering/texture/Texture";
    import type { BlendModes } from "rendering/types";
    import type { View } from "rendering/View";
    import type { WebGl2RendererRuntime } from "rendering/webgl2/WebGl2RendererRuntime";
    import type { RenderTexture } from "rendering/texture/RenderTexture";
    import type { Drawable } from "rendering/Drawable";
    interface ManagedBufferState {
        readonly handle: WebGLBuffer;
        dataByteLength: number;
    }
    interface RendererConnection {
        readonly gl: WebGL2RenderingContext;
        readonly buffers: Map<WebGl2RenderBuffer, ManagedBufferState>;
        readonly vaoHandle: WebGLVertexArrayObject;
    }
    export abstract class AbstractWebGl2BatchedRenderer extends AbstractWebGl2Renderer<Drawable> {
        protected readonly attributeCount: number;
        protected readonly batchSize: number;
        protected readonly indexData: Uint16Array;
        protected readonly vertexData: ArrayBuffer;
        protected readonly float32View: Float32Array;
        protected readonly uint32View: Uint32Array;
        protected readonly shader: Shader;
        protected batchIndex: number;
        protected currentTexture: Texture | RenderTexture | null;
        protected currentBlendMode: BlendModes | null;
        protected currentView: View | null;
        protected currentViewId: number;
        protected vao: WebGl2VertexArrayObject | null;
        protected indexBuffer: WebGl2RenderBuffer | null;
        protected vertexBuffer: WebGl2RenderBuffer | null;
        protected connection: RendererConnection | null;
        protected constructor(batchSize: number, attributeCount: number, vertexSource: string, fragmentSource: string);
        flush(): void;
        destroy(): void;
        protected onConnect(runtime: WebGl2RendererRuntime): void;
        protected onDisconnect(): void;
        abstract render(drawable: Drawable): void;
        protected abstract createVao(gl: WebGL2RenderingContext, indexBuffer: WebGl2RenderBuffer, vertexBuffer: WebGl2RenderBuffer): WebGl2VertexArrayObject;
        protected abstract updateView(view: View): void;
        protected createConnection(gl: WebGL2RenderingContext): RendererConnection;
        protected createBufferRuntime(connection: RendererConnection): WebGl2RenderBufferRuntime;
        protected createVaoRuntime(connection: RendererConnection): WebGl2VertexArrayObjectRuntime;
    }
}
declare module "rendering/webgl2/WebGl2SpriteRenderer" {
    import { WebGl2VertexArrayObject } from "rendering/webgl2/WebGl2VertexArrayObject";
    import type { WebGl2RenderBuffer } from "rendering/webgl2/WebGl2RenderBuffer";
    import type { Sprite } from "rendering/sprite/Sprite";
    import { AbstractWebGl2BatchedRenderer } from "rendering/webgl2/AbstractWebGl2BatchedRenderer";
    import type { View } from "rendering/View";
    export class WebGl2SpriteRenderer extends AbstractWebGl2BatchedRenderer {
        constructor(batchSize: number);
        render(sprite: Sprite): this;
        protected createVao(gl: WebGL2RenderingContext, indexBuffer: WebGl2RenderBuffer, vertexBuffer: WebGl2RenderBuffer): WebGl2VertexArrayObject;
        protected updateView(view: View): this;
    }
}
declare module "particles/ParticleProperties" {
    import type { Time } from "core/Time";
    import type { Vector } from "math/Vector";
    import type { Color } from "core/Color";
    export interface ParticleProperties {
        totalLifetime: Time;
        elapsedLifetime: Time;
        position: Vector;
        velocity: Vector;
        scale: Vector;
        rotation: number;
        rotationSpeed: number;
        textureIndex: number;
        tint: Color;
    }
}
declare module "particles/emitters/ParticleOptions" {
    import { Vector } from "math/Vector";
    import { Color } from "core/Color";
    import { Time } from "core/Time";
    import type { ParticleProperties } from "particles/ParticleProperties";
    export class ParticleOptions implements ParticleProperties {
        private readonly _totalLifetime;
        private readonly _elapsedLifetime;
        private readonly _position;
        private readonly _velocity;
        private readonly _scale;
        private readonly _tint;
        private _rotation;
        private _rotationSpeed;
        private _textureIndex;
        constructor(options?: Partial<ParticleProperties>);
        get totalLifetime(): Time;
        set totalLifetime(totalLifetime: Time);
        get elapsedLifetime(): Time;
        set elapsedLifetime(elapsedLifetime: Time);
        get position(): Vector;
        set position(position: Vector);
        get velocity(): Vector;
        set velocity(velocity: Vector);
        get scale(): Vector;
        set scale(scale: Vector);
        get rotation(): number;
        set rotation(degrees: number);
        get rotationSpeed(): number;
        set rotationSpeed(rotationSpeed: number);
        get textureIndex(): number;
        set textureIndex(textureIndex: number);
        get tint(): Color;
        set tint(color: Color);
        destroy(): void;
    }
}
declare module "particles/Particle" {
    import { Vector } from "math/Vector";
    import { Color } from "core/Color";
    import { Time } from "core/Time";
    import type { ParticleOptions } from "particles/emitters/ParticleOptions";
    import type { ParticleProperties } from "particles/ParticleProperties";
    export class Particle implements ParticleProperties {
        private _totalLifetime;
        private _elapsedLifetime;
        private _position;
        private _velocity;
        private _scale;
        private _rotation;
        private _rotationSpeed;
        private _textureIndex;
        private _tint;
        get totalLifetime(): Time;
        set totalLifetime(totalLifetime: Time);
        get elapsedLifetime(): Time;
        set elapsedLifetime(elapsedLifetime: Time);
        get position(): Vector;
        set position(position: Vector);
        get velocity(): Vector;
        set velocity(velocity: Vector);
        get scale(): Vector;
        set scale(scale: Vector);
        get tint(): Color;
        set tint(tint: Color);
        get rotation(): number;
        set rotation(degrees: number);
        get rotationSpeed(): number;
        set rotationSpeed(rotationSpeed: number);
        get textureIndex(): number;
        set textureIndex(textureIndex: number);
        get remainingLifetime(): Time;
        get elapsedRatio(): number;
        get remainingRatio(): number;
        get expired(): boolean;
        applyOptions(options: ParticleOptions): this;
        destroy(): void;
    }
}
declare module "particles/emitters/ParticleEmitter" {
    import type { Time } from "core/Time";
    import type { ParticleSystem } from "particles/ParticleSystem";
    export interface ParticleEmitter {
        apply(system: ParticleSystem, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/affectors/ParticleAffector" {
    import type { Particle } from "particles/Particle";
    import type { Time } from "core/Time";
    export interface ParticleAffector {
        apply(particle: Particle, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/ParticleSystem" {
    import { Particle } from "particles/Particle";
    import { Rectangle } from "math/Rectangle";
    import type { Time } from "core/Time";
    import { Drawable } from "rendering/Drawable";
    import type { Texture } from "rendering/texture/Texture";
    import type { ParticleEmitter } from "particles/emitters/ParticleEmitter";
    import type { ParticleAffector } from "particles/affectors/ParticleAffector";
    export class ParticleSystem extends Drawable {
        private _emitters;
        private _affectors;
        private _particles;
        private _graveyard;
        private _texture;
        private _textureFrame;
        private _vertices;
        private _texCoords;
        private _updateTexCoords;
        private _updateVertices;
        constructor(texture: Texture);
        get texture(): Texture;
        set texture(texture: Texture);
        get textureFrame(): Rectangle;
        set textureFrame(frame: Rectangle);
        get vertices(): Float32Array;
        get texCoords(): Uint32Array;
        get emitters(): Array<ParticleEmitter>;
        get affectors(): Array<ParticleAffector>;
        get particles(): Array<Particle>;
        get graveyard(): Array<Particle>;
        setTexture(texture: Texture): this;
        setTextureFrame(frame: Rectangle): this;
        resetTextureFrame(): this;
        addEmitter(emitter: ParticleEmitter): this;
        clearEmitters(): this;
        addAffector(affector: ParticleAffector): this;
        clearAffectors(): this;
        requestParticle(): Particle;
        emitParticle(particle: Particle): this;
        updateParticle(particle: Particle, delta: Time): this;
        clearParticles(): this;
        update(delta: Time): this;
        destroy(): void;
    }
}
declare module "rendering/webgl2/WebGl2ParticleRenderer" {
    import type { WebGl2RenderBuffer } from "rendering/webgl2/WebGl2RenderBuffer";
    import { WebGl2VertexArrayObject } from "rendering/webgl2/WebGl2VertexArrayObject";
    import type { ParticleSystem } from "particles/ParticleSystem";
    import { AbstractWebGl2BatchedRenderer } from "rendering/webgl2/AbstractWebGl2BatchedRenderer";
    import type { View } from "rendering/View";
    export class WebGl2ParticleRenderer extends AbstractWebGl2BatchedRenderer {
        constructor(batchSize: number);
        render(system: ParticleSystem): this;
        protected createVao(gl: WebGL2RenderingContext, indexBuffer: WebGl2RenderBuffer, vertexBuffer: WebGl2RenderBuffer): WebGl2VertexArrayObject;
        protected updateView(view: View): this;
    }
}
declare module "rendering/primitives/Geometry" {
    interface GeometryOptions {
        vertices?: Array<number>;
        indices?: Array<number>;
        points?: Array<number>;
    }
    export class Geometry {
        readonly vertices: Float32Array;
        readonly indices: Uint16Array;
        readonly points: Array<number>;
        constructor({ vertices, indices, points, }?: GeometryOptions);
        destroy(): void;
    }
}
declare module "rendering/primitives/DrawableShape" {
    import { RenderingPrimitives } from "rendering/types";
    import type { Geometry } from "rendering/primitives/Geometry";
    import type { Color } from "core/Color";
    import { Drawable } from "rendering/Drawable";
    export class DrawableShape extends Drawable {
        readonly geometry: Geometry;
        readonly drawMode: RenderingPrimitives;
        readonly color: Color;
        constructor(geometry: Geometry, color: Color, drawMode?: RenderingPrimitives);
        destroy(): void;
    }
}
declare module "rendering/webgl2/WebGl2PrimitiveRenderer" {
    import { AbstractWebGl2Renderer } from "rendering/webgl2/AbstractWebGl2Renderer";
    import type { DrawableShape } from "rendering/primitives/DrawableShape";
    import type { WebGl2RendererRuntime } from "rendering/webgl2/WebGl2RendererRuntime";
    export class WebGl2PrimitiveRenderer extends AbstractWebGl2Renderer<DrawableShape> {
        private _vertexCapacity;
        private _indexCapacity;
        private _vertexData;
        private _indexData;
        private _float32View;
        private _uint32View;
        private _shader;
        private _connection;
        private _currentBlendMode;
        private _currentView;
        private _viewId;
        constructor(batchSize: number);
        render(shape: DrawableShape): void;
        flush(): void;
        destroy(): void;
        protected onConnect(runtime: WebGl2RendererRuntime): void;
        protected onDisconnect(): void;
        private _ensureVertexCapacity;
        private _ensureIndexCapacity;
        private _createBufferRuntime;
        private _createVaoRuntime;
    }
}
declare module "rendering/RendererRegistry" {
    import type { Drawable } from "rendering/Drawable";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    import type { Renderer, DrawableConstructor } from "rendering/Renderer";
    /**
     * Instance-based renderer registry.
     *
     * Maps drawable constructors to renderer instances. Each drawable type
     * has exactly one renderer. The registry manages connect/disconnect
     * lifecycle for all registered renderers.
     *
     * Resolution walks the prototype chain so sprite-backed subclasses such
     * as Text and Video can intentionally reuse the Sprite renderer.
     *
     * Used internally by backend managers. Exposed publicly for advanced
     * custom renderer registration.
     */
    export class RendererRegistry<Runtime extends SceneRenderRuntime> {
        private readonly _renderers;
        private _runtime;
        /**
         * Register a renderer for a specific drawable type.
         *
         * If the registry is already connected to a runtime, the renderer
         * is connected immediately. Registration must happen before the
         * first draw call for the given drawable type.
         *
         * @throws Error if a renderer is already registered for this drawable type.
         */
        registerRenderer<Target extends Drawable>(drawableType: DrawableConstructor<Target>, renderer: Renderer<Runtime, Target>): void;
        resolve(drawable: Drawable): Renderer<Runtime, Drawable>;
        /**
         * Connect all registered renderers to the given runtime.
         */
        connect(runtime: Runtime): void;
        /**
         * Disconnect all registered renderers from the current runtime.
         */
        disconnect(): void;
        /**
         * Disconnect all registered renderers and clear the registry.
         */
        destroy(): void;
    }
}
declare module "rendering/webgl2/WebGl2RenderManager" {
    import { BlendModes } from "rendering/types";
    import { RenderTarget } from "rendering/RenderTarget";
    import { Color } from "core/Color";
    import { Texture } from "rendering/texture/Texture";
    import { RenderTexture } from "rendering/texture/RenderTexture";
    import { RenderBackendType } from "rendering/RenderBackendType";
    import { RendererRegistry } from "rendering/RendererRegistry";
    import type { RenderPass } from "rendering/RenderPass";
    import type { Drawable } from "rendering/Drawable";
    import type { WebGl2RendererRuntime } from "rendering/webgl2/WebGl2RendererRuntime";
    import type { Shader } from "rendering/shader/Shader";
    import type { WebGl2VertexArrayObject } from "rendering/webgl2/WebGl2VertexArrayObject";
    import type { View } from "rendering/View";
    import type { Application } from "core/Application";
    export class WebGl2RenderManager implements WebGl2RendererRuntime {
        readonly backendType = RenderBackendType.WebGl2;
        readonly rendererRegistry: RendererRegistry<WebGl2RendererRuntime>;
        private readonly _context;
        private readonly _rootRenderTarget;
        private readonly _onContextLostHandler;
        private readonly _onContextRestoredHandler;
        private readonly _textureStates;
        private readonly _renderTargetStates;
        private readonly _textureDestroyHandlers;
        private readonly _renderTargetDestroyHandlers;
        private _canvas;
        private _contextLost;
        private _renderTarget;
        private _renderer;
        private _shader;
        private _blendMode;
        private _texture;
        private _textureUnit;
        private _vao;
        private _clearColor;
        private _cursor;
        private _boundFramebuffer;
        constructor(app: Application);
        get context(): WebGL2RenderingContext;
        get renderTarget(): RenderTarget;
        get view(): View;
        get clearColor(): Color;
        get cursor(): string;
        initialize(): Promise<this>;
        draw(drawable: Drawable): this;
        execute(pass: RenderPass): this;
        setRenderTarget(target: RenderTarget | null): this;
        setView(view: View | null): this;
        bindVertexArrayObject(vao: WebGl2VertexArrayObject | null): this;
        bindShader(shader: Shader | null): this;
        bindTexture(texture: Texture | RenderTexture | null, unit?: number): this;
        setBlendMode(blendMode: BlendModes | null): this;
        private _setTextureUnit;
        setClearColor(color: Color): this;
        setCursor(cursor: string | Texture | HTMLImageElement | HTMLCanvasElement): this;
        clear(color?: Color): this;
        resize(width: number, height: number): this;
        flush(): this;
        destroy(): void;
        private _createContext;
        private _restoreContext;
        private _setupContext;
        private _addEvents;
        private _removeEvents;
        private _onContextLost;
        private _onContextRestored;
        private _createFramebuffer;
        private _createTextureHandle;
        private _destroyManagedResources;
        private _getRenderTargetState;
        private _getTextureState;
        private _subscribeToDestroy;
        private _unsubscribeFromDestroy;
        private _evictRenderTarget;
        private _evictTexture;
        private _bindRenderTarget;
        private _setActiveRenderer;
        private _flushActiveRenderer;
        private _prepareRenderTarget;
        private _syncTexture;
    }
}
declare module "rendering/webgpu/WebGpuRendererRuntime" {
    import type { RenderBackendType } from "rendering/RenderBackendType";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    export interface WebGpuRendererRuntime extends SceneRenderRuntime {
        readonly backendType: RenderBackendType.WebGpu;
        readonly device: GPUDevice;
        readonly context: GPUCanvasContext;
        readonly format: GPUTextureFormat;
    }
}
declare module "rendering/webgpu/AbstractWebGpuRenderer" {
    import { RenderBackendType } from "rendering/RenderBackendType";
    import type { Drawable } from "rendering/Drawable";
    import type { Renderer } from "rendering/Renderer";
    import type { WebGpuRendererRuntime } from "rendering/webgpu/WebGpuRendererRuntime";
    /**
     * Base class for WebGPU renderers.
     *
     * Manages the connect/disconnect lifecycle and provides a safe
     * `getRuntime()` accessor that throws if the renderer is not connected.
     *
     * Subclasses must implement:
     * - onConnect(runtime): set up GPU resources (shader modules, pipelines, buffers)
     * - onDisconnect(): tear down GPU resources
     * - render(drawable): collect draw call data for the given drawable
     * - flush(): encode and submit command buffers for all collected draw calls
     */
    export abstract class AbstractWebGpuRenderer<Target extends Drawable> implements Renderer<WebGpuRendererRuntime, Target> {
        readonly backendType = RenderBackendType.WebGpu;
        private _runtime;
        connect(runtime: WebGpuRendererRuntime): void;
        disconnect(): void;
        abstract render(drawable: Target): void;
        abstract flush(): void;
        protected abstract onConnect(runtime: WebGpuRendererRuntime): void;
        protected abstract onDisconnect(): void;
        protected getRuntime(): WebGpuRendererRuntime;
        protected getRuntimeOrNull(): WebGpuRendererRuntime | null;
    }
}
declare module "rendering/webgpu/WebGpuBlendState" {
    import { BlendModes } from "rendering/types";
    /**
     * Returns the GPUBlendState for a given ExoJS blend mode.
     * Shared by all WebGPU renderers to avoid duplication.
     */
    export function getWebGpuBlendState(blendMode: BlendModes): GPUBlendState;
}
declare module "rendering/webgpu/WebGpuPrimitiveRenderer" {
    import { AbstractWebGpuRenderer } from "rendering/webgpu/AbstractWebGpuRenderer";
    import type { DrawableShape } from "rendering/primitives/DrawableShape";
    import type { WebGpuRendererRuntime } from "rendering/webgpu/WebGpuRendererRuntime";
    export class WebGpuPrimitiveRenderer extends AbstractWebGpuRenderer<DrawableShape> {
        private readonly _combinedTransform;
        private readonly _drawCalls;
        private readonly _pipelines;
        private _renderManager;
        private _device;
        private _shaderModule;
        private _bindGroupLayout;
        private _pipelineLayout;
        private _uniformBuffer;
        private _bindGroup;
        private _vertexBuffer;
        private _indexBuffer;
        private _vertexBufferCapacity;
        private _indexBufferCapacity;
        private _vertexData;
        private _float32View;
        private _uint32View;
        render(shape: DrawableShape): void;
        flush(): void;
        destroy(): void;
        protected onConnect(runtime: WebGpuRendererRuntime): void;
        protected onDisconnect(): void;
        private _createTransformData;
        private _writeVertexData;
        private _ensureVertexCapacity;
        private _ensureIndexCapacity;
        private _getPipeline;
        private _getTopology;
        private _destroyBuffers;
    }
}
declare module "rendering/webgpu/WebGpuSpriteRenderer" {
    import { AbstractWebGpuRenderer } from "rendering/webgpu/AbstractWebGpuRenderer";
    import type { Sprite } from "rendering/sprite/Sprite";
    import type { WebGpuRendererRuntime } from "rendering/webgpu/WebGpuRendererRuntime";
    export class WebGpuSpriteRenderer extends AbstractWebGpuRenderer<Sprite> {
        private readonly _drawCalls;
        private readonly _projectionData;
        private _renderManager;
        private _device;
        private _shaderModule;
        private _uniformBindGroupLayout;
        private _textureBindGroupLayout;
        private _pipelineLayout;
        private _uniformBuffer;
        private _uniformBindGroup;
        private _vertexBuffer;
        private _indexBuffer;
        private _vertexCapacity;
        private _vertexData;
        private _float32View;
        private _uint32View;
        private readonly _pipelines;
        protected onConnect(runtime: WebGpuRendererRuntime): void;
        protected onDisconnect(): void;
        render(sprite: Sprite): void;
        flush(): void;
        destroy(): void;
        private _ensureBatchCapacity;
        private _writeVertexData;
        private _getBatchRange;
        private _getPipeline;
    }
}
declare module "rendering/webgpu/WebGpuParticleRenderer" {
    import { AbstractWebGpuRenderer } from "rendering/webgpu/AbstractWebGpuRenderer";
    import type { WebGpuRendererRuntime } from "rendering/webgpu/WebGpuRendererRuntime";
    import type { ParticleSystem } from "particles/ParticleSystem";
    export class WebGpuParticleRenderer extends AbstractWebGpuRenderer<ParticleSystem> {
        private readonly _drawCalls;
        private readonly _uniformData;
        private _renderManager;
        private _device;
        private _shaderModule;
        private _uniformBindGroupLayout;
        private _textureBindGroupLayout;
        private _pipelineLayout;
        private _uniformBuffer;
        private _uniformBindGroup;
        private _staticVertexBuffer;
        private _instanceBuffer;
        private _indexBuffer;
        private _instanceBufferByteLength;
        private _instanceData;
        private _float32View;
        private _uint32View;
        private readonly _pipelines;
        render(system: ParticleSystem): void;
        flush(): void;
        destroy(): void;
        protected onConnect(runtime: WebGpuRendererRuntime): void;
        protected onDisconnect(): void;
        private _ensureCapacity;
        private _writeUniformData;
        private _writeInstanceData;
        private _getPipeline;
    }
}
declare module "rendering/webgpu/WebGpuRenderManager" {
    import { Color } from "core/Color";
    import type { Application } from "core/Application";
    import { BlendModes } from "rendering/types";
    import { RenderBackendType } from "rendering/RenderBackendType";
    import { RendererRegistry } from "rendering/RendererRegistry";
    import type { Drawable } from "rendering/Drawable";
    import type { RenderPass } from "rendering/RenderPass";
    import type { Shader } from "rendering/shader/Shader";
    import type { Texture } from "rendering/texture/Texture";
    import type { WebGl2VertexArrayObject } from "rendering/webgl2/WebGl2VertexArrayObject";
    import type { View } from "rendering/View";
    import type { WebGpuRendererRuntime } from "rendering/webgpu/WebGpuRendererRuntime";
    import { RenderTarget } from "rendering/RenderTarget";
    import { RenderTexture } from "rendering/texture/RenderTexture";
    export class WebGpuRenderManager implements WebGpuRendererRuntime {
        readonly backendType = RenderBackendType.WebGpu;
        readonly rendererRegistry: RendererRegistry<WebGpuRendererRuntime>;
        private readonly _canvas;
        private readonly _rootRenderTarget;
        private readonly _clearColor;
        private readonly _textureStates;
        private readonly _textureDestroyHandlers;
        private readonly _renderTargetDestroyHandlers;
        private _mipmapShaderModule;
        private _mipmapBindGroupLayout;
        private _mipmapPipelineLayout;
        private _mipmapPipeline;
        private _mipmapSampler;
        private _context;
        private _device;
        private _format;
        private _initializePromise;
        private _renderTarget;
        private _renderer;
        private _blendMode;
        private _texture;
        private _clearRequested;
        private _hasPresentedFrame;
        constructor(app: Application);
        get view(): View;
        get renderTarget(): RenderTarget;
        get device(): GPUDevice;
        get context(): GPUCanvasContext;
        get format(): GPUTextureFormat;
        get renderTargetFormat(): GPUTextureFormat;
        get clearRequested(): boolean;
        initialize(): Promise<this>;
        draw(drawable: Drawable): this;
        execute(pass: RenderPass): this;
        setShader(shader: Shader | null): this;
        setTexture(texture: Texture | RenderTexture | null, _unit?: number): this;
        setBlendMode(blendMode: BlendModes | null): this;
        setVao(vao: WebGl2VertexArrayObject | null): this;
        setRenderTarget(target: RenderTarget | null): this;
        setView(view: View | null): this;
        clear(color?: Color): this;
        resize(width: number, height: number): this;
        flush(): this;
        destroy(): void;
        createColorAttachment(): GPURenderPassColorAttachment;
        submit(commandBuffer: GPUCommandBuffer): void;
        getTextureBinding(texture: Texture | RenderTexture): {
            readonly view: GPUTextureView;
            readonly sampler: GPUSampler;
        };
        shouldPremultiplyTextureSample(texture: Texture | RenderTexture): boolean;
        private _setActiveRenderer;
        private _flushActiveRenderer;
        private _initialize;
        private _getGpuNavigator;
        private _destroyManagedTextures;
        private _getTextureState;
        private _syncTexture;
        private _evictTexture;
        private _subscribeRenderTarget;
        private _unsubscribeRenderTarget;
        private _createSampler;
        private _getTextureUsage;
        private _getAddressMode;
        private _getFilterMode;
        private _getMipmapFilterMode;
        private _getMipLevelCount;
        private _generateMipmaps;
        private _getMipmapResources;
    }
}
declare module "input/types" {
    export enum ChannelSize {
        Container = 768,
        Category = 256,
        Gamepad = 64
    }
    export const enum ChannelOffset {
        Keyboard = 0,
        Pointers = 256,
        Gamepads = 512
    }
    export enum Keyboard {
        Backspace = 8,
        Tab = 9,
        Clear = 12,
        Enter = 13,
        Shift = 16,
        Control = 17,
        Alt = 18,
        Pause = 19,
        CapsLock = 20,
        Escape = 27,
        Space = 32,
        PageUp = 33,
        PageDown = 34,
        End = 35,
        Home = 36,
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,
        Insert = 45,
        Delete = 46,
        Help = 47,
        Zero = 48,
        One = 49,
        Two = 50,
        Three = 51,
        Four = 52,
        Five = 53,
        Six = 54,
        Seven = 55,
        Eight = 56,
        Nine = 57,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        NumPad0 = 96,
        NumPad1 = 97,
        NumPad2 = 98,
        NumPad3 = 99,
        NumPad4 = 100,
        NumPad5 = 101,
        NumPad6 = 102,
        NumPad7 = 103,
        NumPad8 = 104,
        NumPad9 = 105,
        NumPadMultiply = 106,
        NumPadAdd = 107,
        NumPadEnter = 108,
        NumPadSubtract = 109,
        NumPadDecimal = 110,
        NumPadDivide = 111,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        NumLock = 144,
        ScrollLock = 145,
        Colon = 186,
        Equals = 187,
        Comma = 188,
        Dash = 189,
        Period = 190,
        QuestionMark = 191,
        Tilde = 192,
        OpenBracket = 219,
        BackwardSlash = 220,
        ClosedBracket = 221,
        Quotes = 222
    }
}
declare module "input/GamepadChannels" {
    export enum GamepadChannel {
        ButtonSouth = 512,
        ButtonWest = 513,
        ButtonEast = 514,
        ButtonNorth = 515,
        LeftShoulder = 516,
        RightShoulder = 517,
        LeftTrigger = 518,
        RightTrigger = 519,
        Select = 520,
        Start = 521,
        LeftStick = 522,
        RightStick = 523,
        DPadUp = 524,
        DPadDown = 525,
        DPadLeft = 526,
        DPadRight = 527,
        Guide = 528,
        Share = 529,
        Capture = 530,
        Touchpad = 531,
        Paddle1 = 532,
        LeftStickLeft = 533,
        LeftStickRight = 534,
        LeftStickUp = 535,
        LeftStickDown = 536,
        RightStickLeft = 537,
        RightStickRight = 538,
        RightStickUp = 539,
        RightStickDown = 540,
        AuxiliaryAxis0Negative = 541,
        AuxiliaryAxis0Positive = 542,
        AuxiliaryAxis1Negative = 543,
        AuxiliaryAxis1Positive = 544,
        AuxiliaryAxis2Negative = 545,
        AuxiliaryAxis2Positive = 546,
        AuxiliaryAxis3Negative = 547,
        AuxiliaryAxis3Positive = 548
    }
}
declare module "input/GamepadControl" {
    import type { GamepadChannel } from "input/GamepadChannels";
    export interface GamepadControlOptions {
        invert?: boolean;
        normalize?: boolean;
        threshold?: number;
    }
    export class GamepadControl {
        readonly index: number;
        readonly channel: GamepadChannel;
        readonly invert: boolean;
        readonly normalize: boolean;
        readonly threshold: number;
        constructor(index: number, channel: GamepadChannel, options?: GamepadControlOptions);
        transformValue(value: number): number;
    }
}
declare module "input/GamepadMapping" {
    import { GamepadControl } from "input/GamepadControl";
    import type { GamepadControlOptions } from "input/GamepadControl";
    import type { GamepadChannel } from "input/GamepadChannels";
    export enum GamepadMappingFamily {
        GenericDualAnalog = "genericDualAnalog",
        Xbox = "xbox",
        PlayStation = "playStation",
        SwitchPro = "switchPro",
        JoyConLeft = "joyConLeft",
        JoyConRight = "joyConRight",
        GameCube = "gameCube",
        SteamController = "steamController",
        ArcadeStick = "arcadeStick"
    }
    export type GamepadControlDefinition = readonly [number, GamepadChannel, GamepadControlOptions?];
    export abstract class GamepadMapping {
        abstract readonly family: GamepadMappingFamily;
        readonly buttons: Array<GamepadControl>;
        readonly axes: Array<GamepadControl>;
        protected constructor(buttons: Array<GamepadControl>, axes: Array<GamepadControl>);
        destroy(): void;
        static createControls(definitions: ReadonlyArray<GamepadControlDefinition>): Array<GamepadControl>;
    }
}
declare module "input/ArcadeStickGamepadMapping" {
    import { GamepadMapping, GamepadMappingFamily } from "input/GamepadMapping";
    export class ArcadeStickGamepadMapping extends GamepadMapping {
        readonly family = GamepadMappingFamily.ArcadeStick;
        constructor();
    }
}
declare module "input/GenericDualAnalogGamepadMapping" {
    import { GamepadMapping, GamepadMappingFamily } from "input/GamepadMapping";
    export class GenericDualAnalogGamepadMapping extends GamepadMapping {
        readonly family: GamepadMappingFamily;
        constructor();
    }
}
declare module "input/GameCubeGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class GameCubeGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.GameCube;
    }
}
declare module "input/JoyConLeftGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class JoyConLeftGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.JoyConLeft;
    }
}
declare module "input/JoyConRightGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class JoyConRightGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.JoyConRight;
    }
}
declare module "input/PlayStationGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class PlayStationGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.PlayStation;
    }
}
declare module "input/SteamControllerGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class SteamControllerGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.SteamController;
    }
}
declare module "input/SwitchProGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class SwitchProGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.SwitchPro;
    }
}
declare module "input/XboxGamepadMapping" {
    import { GenericDualAnalogGamepadMapping } from "input/GenericDualAnalogGamepadMapping";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export class XboxGamepadMapping extends GenericDualAnalogGamepadMapping {
        readonly family = GamepadMappingFamily.Xbox;
    }
}
declare module "input/GamepadDefinitions" {
    import type { GamepadMapping } from "input/GamepadMapping";
    export type BrowserGamepad = NonNullable<ReturnType<Navigator['getGamepads']>[number]>;
    export type GamepadDefinitionResult = GamepadMapping | {
        name?: string;
        mapping: GamepadMapping;
    } | null | undefined;
    export interface GamepadDescriptor {
        id: string;
        index: number;
        label: string;
        vendorId: string | null;
        productId: string | null;
        productKey: string | null;
        name: string | null;
    }
    export interface GamepadDefinition {
        ids?: string | Array<string>;
        name?: string;
        resolve: (descriptor: GamepadDescriptor) => GamepadDefinitionResult;
    }
    export interface ResolvedGamepadDefinition {
        descriptor: GamepadDescriptor;
        name: string;
        mapping: GamepadMapping;
    }
    export const normalizeIds: (ids?: string | Array<string>) => Array<string>;
    export const matchesIds: (descriptor: GamepadDescriptor, ids?: string | Array<string>) => boolean;
    export const parseGamepadDescriptor: (gamepad: BrowserGamepad) => GamepadDescriptor;
    export const resolveDefinition: (definition: GamepadDefinition, descriptor: GamepadDescriptor) => ResolvedGamepadDefinition | null;
    export const resolveGamepadDefinition: (gamepadOrDescriptor: BrowserGamepad | GamepadDescriptor, definitions?: ReadonlyArray<GamepadDefinition>) => ResolvedGamepadDefinition;
    export const builtInGamepadDefinitions: Array<GamepadDefinition>;
}
declare module "input/Gamepad" {
    import { Signal } from "core/Signal";
    import type { GamepadChannel } from "input/GamepadChannels";
    import type { BrowserGamepad, ResolvedGamepadDefinition } from "input/GamepadDefinitions";
    import type { GamepadMappingFamily, GamepadMapping } from "input/GamepadMapping";
    export interface GamepadInfo {
        name: string;
        label: string;
        vendorId: string | null;
        productId: string | null;
        productKey: string | null;
    }
    export class Gamepad {
        readonly onConnect: Signal<[Gamepad]>;
        readonly onDisconnect: Signal<[Gamepad]>;
        readonly onUpdate: Signal<[GamepadChannel, number, Gamepad]>;
        private readonly indexValue;
        private readonly channelsValue;
        private readonly channelOffset;
        private mappingValue;
        private browserGamepad;
        private info;
        constructor(index: number, channels: Float32Array, mapping: GamepadMapping);
        constructor(gamepad: BrowserGamepad, channels: Float32Array, definition: ResolvedGamepadDefinition);
        get mapping(): GamepadMapping;
        set mapping(mapping: GamepadMapping);
        get mappingFamily(): GamepadMappingFamily;
        get channels(): Float32Array;
        get gamepad(): BrowserGamepad | null;
        get index(): number;
        get connected(): boolean;
        get name(): string;
        get label(): string;
        get vendorId(): string | null;
        get productId(): string | null;
        get productKey(): string | null;
        setInfo(info: GamepadInfo): this;
        connect(gamepad: BrowserGamepad): this;
        disconnect(): this;
        update(): this;
        clearChannels(): this;
        destroy(): void;
        resolveChannelOffset(channel: GamepadChannel): number;
        static resolveChannelOffset(gamepadIndex: number, channel: GamepadChannel): number;
        private clearMappedChannels;
    }
}
declare module "input/Pointer" {
    import { Vector } from "math/Vector";
    import { Size } from "math/Size";
    import { Flags } from "math/Flags";
    export enum PointerStateFlag {
        None = 0,
        Over = 1,
        Leave = 2,
        Down = 4,
        Move = 8,
        Up = 16,
        Cancel = 32
    }
    export enum PointerState {
        Unknown = 0,
        InsideCanvas = 1,
        OutsideCanvas = 2,
        Pressed = 3,
        Moving = 4,
        Released = 5,
        Cancelled = 6
    }
    export class Pointer {
        readonly id: number;
        readonly type: string;
        readonly position: Vector;
        readonly startPos: Vector;
        readonly size: Size;
        readonly tilt: Vector;
        readonly stateFlags: Flags<PointerStateFlag>;
        private _canvas;
        private _buttons;
        private _pressure;
        private _rotation;
        private _currentState;
        constructor(event: PointerEvent, canvas: HTMLCanvasElement);
        get x(): number;
        get y(): number;
        get width(): number;
        get height(): number;
        get buttons(): number;
        get pressure(): number;
        get rotation(): number;
        get currentState(): PointerState;
        handleEnter(event: PointerEvent): void;
        handleLeave(event: PointerEvent): void;
        handlePress(event: PointerEvent): void;
        handleMove(event: PointerEvent): void;
        handleRelease(event: PointerEvent): void;
        handleCancel(event: PointerEvent): void;
        destroy(): void;
        private handleEvent;
    }
}
declare module "core/Timer" {
    import { Clock } from "core/Clock";
    import { Time } from "core/Time";
    export class Timer extends Clock {
        private readonly _limit;
        constructor(limit: Time, autoStart?: boolean);
        set limit(limit: Time);
        get expired(): boolean;
        get remainingMilliseconds(): number;
        get remainingSeconds(): number;
        get remainingMinutes(): number;
        get remainingHours(): number;
    }
}
declare module "input/Input" {
    import { Signal } from "core/Signal";
    import type { Keyboard } from "input/types";
    import type { GamepadChannel } from "input/GamepadChannels";
    interface InputOptions {
        onStart?: () => void;
        onStop?: () => void;
        onActive?: () => void;
        onTrigger?: () => void;
        context?: object;
        threshold?: number;
    }
    export type InputChannel = GamepadChannel | Keyboard;
    export class Input {
        static triggerThreshold: number;
        private readonly channels;
        private readonly triggerTimer;
        private valueState;
        readonly onStart: Signal<[number]>;
        readonly onStop: Signal<[number]>;
        readonly onActive: Signal<[number]>;
        readonly onTrigger: Signal<[number]>;
        constructor(channels: Array<InputChannel> | InputChannel, { onStart, onStop, onActive, onTrigger, context, threshold }?: InputOptions);
        get activeChannels(): Set<number>;
        get value(): number;
        update(channels: Float32Array): this;
        destroy(): void;
    }
}
declare module "input/InputManager" {
    import { Vector } from "math/Vector";
    import { Signal } from "core/Signal";
    import { Gamepad } from "input/Gamepad";
    import { Pointer } from "input/Pointer";
    import type { Application } from "core/Application";
    import type { Input } from "input/Input";
    export class InputManager {
        private readonly canvas;
        private readonly channels;
        private readonly inputs;
        private readonly pointers;
        private readonly gamepadsValue;
        private readonly gamepadsByIndex;
        private readonly gamepadSlotsActive;
        private readonly wheelOffset;
        private readonly flags;
        private readonly channelsPressed;
        private readonly channelsReleased;
        private readonly gamepadDefinitions;
        private canvasFocusedValue;
        private pointerDistanceThreshold;
        private readonly keyDownHandler;
        private readonly keyUpHandler;
        private readonly canvasFocusHandler;
        private readonly canvasBlurHandler;
        private readonly windowBlurHandler;
        private readonly mouseWheelHandler;
        private readonly pointerOverHandler;
        private readonly pointerLeaveHandler;
        private readonly pointerDownHandler;
        private readonly pointerMoveHandler;
        private readonly pointerUpHandler;
        private readonly pointerCancelHandler;
        readonly onPointerEnter: Signal<[Pointer]>;
        readonly onPointerLeave: Signal<[Pointer]>;
        readonly onPointerDown: Signal<[Pointer]>;
        readonly onPointerMove: Signal<[Pointer]>;
        readonly onPointerUp: Signal<[Pointer]>;
        readonly onPointerTap: Signal<[Pointer]>;
        readonly onPointerSwipe: Signal<[Pointer]>;
        readonly onPointerCancel: Signal<[Pointer]>;
        readonly onMouseWheel: Signal<[Vector]>;
        readonly onKeyDown: Signal<[number]>;
        readonly onKeyUp: Signal<[number]>;
        readonly onGamepadConnected: Signal<[Gamepad, Gamepad[]]>;
        readonly onGamepadDisconnected: Signal<[Gamepad, Gamepad[]]>;
        readonly onGamepadUpdated: Signal<[Gamepad, Gamepad[]]>;
        constructor(app: Application);
        get pointersInCanvas(): boolean;
        get canvasFocused(): boolean;
        get gamepads(): Array<Gamepad>;
        getGamepad(index: number): Gamepad | null;
        add(inputs: Input | Array<Input>): this;
        remove(inputs: Input | Array<Input>): this;
        clear(destroyInputs?: boolean): this;
        update(): this;
        destroy(): void;
        private handleKeyDown;
        private handleKeyUp;
        private handlePointerOver;
        private handlePointerLeave;
        private handlePointerDown;
        private handlePointerMove;
        private handlePointerUp;
        private handlePointerCancel;
        private handleMouseWheel;
        private handleCanvasFocus;
        private handleCanvasBlur;
        private handleWindowBlur;
        private addEventListeners;
        private removeEventListeners;
        private updateGamepads;
        private insertGamepadByIndex;
        private updateEvents;
        private updatePointerEvents;
    }
}
declare module "core/Application" {
    import { SceneManager } from "core/SceneManager";
    import { InputManager } from "input/InputManager";
    import { Loader } from "resources/Loader";
    import { Signal } from "core/Signal";
    import { Color } from "core/Color";
    import type { Time } from "core/Time";
    import type { Scene } from "core/Scene";
    import type { CacheStore } from "resources/CacheStore";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    import type { GamepadDefinition } from "input/GamepadDefinitions";
    export enum ApplicationStatus {
        Loading = 1,
        Running = 2,
        Halting = 3,
        Stopped = 4
    }
    export interface ApplicationOptions {
        canvas: HTMLCanvasElement;
        width: number;
        height: number;
        debug: boolean;
        clearColor: Color;
        spriteRendererBatchSize: number;
        particleRendererBatchSize: number;
        primitiveRendererBatchSize: number;
        gamepadDefinitions: Array<GamepadDefinition>;
        pointerDistanceThreshold: number;
        webglAttributes: WebGLContextAttributes;
        resourcePath: string;
        requestOptions: RequestInit;
        cache?: CacheStore | ReadonlyArray<CacheStore>;
        backend?: BackendConfig;
    }
    export interface WebGl2BackendConfig {
        type: 'webgl2';
    }
    export interface WebGpuBackendConfig {
        type: 'webgpu';
    }
    export interface AutoBackendConfig {
        type: 'auto';
    }
    export type BackendConfig = AutoBackendConfig | WebGl2BackendConfig | WebGpuBackendConfig;
    export class Application {
        readonly options: ApplicationOptions;
        readonly canvas: HTMLCanvasElement;
        readonly loader: Loader;
        readonly inputManager: InputManager;
        readonly sceneManager: SceneManager;
        readonly onResize: Signal<[number, number, Application]>;
        private readonly _updateHandler;
        private readonly _startupClock;
        private readonly _activeClock;
        private readonly _frameClock;
        private _status;
        private _frameCount;
        private _frameRequest;
        private _backendType;
        private _renderManager;
        constructor(appSettings?: Partial<ApplicationOptions>);
        get status(): ApplicationStatus;
        get startupTime(): Time;
        get activeTime(): Time;
        get frameTime(): Time;
        get frameCount(): number;
        get renderManager(): SceneRenderRuntime;
        start(scene: Scene): Promise<this>;
        update(): this;
        stop(): this;
        resize(width: number, height: number): this;
        destroy(): void;
        private resolveInitialBackendType;
        private createRenderManager;
        private initializeRenderManager;
        private canUseWebGpu;
    }
}
declare module "core/Quadtree" {
    import { Rectangle } from "math/Rectangle";
    import type { SceneNode } from "core/SceneNode";
    import type { Destroyable, HasBoundingBox } from "core/types";
    export class Quadtree implements HasBoundingBox, Destroyable {
        static maxSceneNodes: number;
        static maxLevel: number;
        readonly level: number;
        private readonly _bounds;
        private readonly _quadTrees;
        private readonly _sceneNodes;
        constructor(bounds: Rectangle, level?: number);
        addSceneNode(sceneNode: SceneNode): this;
        getRelatedChildren(sceneNode: SceneNode): Array<SceneNode>;
        getBounds(): Rectangle;
        clear(): this;
        destroy(): void;
        private _getQuadTree;
        private _split;
        private _passSceneNodesToQuadTrees;
    }
}
declare module "core/index" {
    export * from "core/types";
    export * from "core/utils";
    export * from "core/Application";
    export * from "core/Bounds";
    export * from "core/Clock";
    export * from "core/Color";
    export * from "core/Quadtree";
    export * from "core/Scene";
    export * from "core/SceneManager";
    export * from "core/SceneNode";
    export * from "core/Signal";
    export * from "core/Time";
    export * from "core/Timer";
}
declare module "audio/AudioAnalyser" {
    import type { Media } from "audio/Media";
    export interface AudioAnalyserOptions {
        fftSize: number;
        minDecibels: number;
        maxDecibels: number;
        smoothingTimeConstant: number;
    }
    export class AudioAnalyser {
        private readonly _media;
        private readonly _fftSize;
        private readonly _minDecibels;
        private readonly _maxDecibels;
        private readonly _smoothingTimeConstant;
        private readonly _frequencyBinCount;
        private readonly _timeDomainData;
        private readonly _frequencyData;
        private readonly _preciseTimeDomainData;
        private readonly _preciseFrequencyData;
        private _analyser;
        private _audioContext;
        private _analyserTarget;
        constructor(media: Media, options?: Partial<AudioAnalyserOptions>);
        connect(): this;
        get timeDomainData(): Uint8Array;
        get frequencyData(): Uint8Array;
        get preciseTimeDomainData(): Float32Array;
        get preciseFrequencyData(): Float32Array;
        destroy(): void;
        private setupWithAudioContext;
    }
}
declare module "audio/index" {
    export * from "audio/AbstractMedia";
    export * from "audio/Media";
    export * from "audio/audio-context";
    export * from "audio/AudioAnalyser";
    export * from "audio/Music";
    export * from "audio/Sound";
}
declare module "input/GamepadPromptLayouts" {
    import { GamepadChannel } from "input/GamepadChannels";
    import { GamepadMappingFamily } from "input/GamepadMapping";
    export type GamepadPromptControl = 'DPad' | 'DPadUp' | 'DPadDown' | 'DPadLeft' | 'DPadRight' | 'ButtonNorth' | 'ButtonWest' | 'ButtonEast' | 'ButtonSouth' | 'LeftShoulder' | 'RightShoulder' | 'LeftTrigger' | 'RightTrigger' | 'Select' | 'Start' | 'LeftStick' | 'RightStick';
    export class GamepadPromptLayouts {
        static readonly controls: Array<GamepadPromptControl>;
        static getControlPosition(control: GamepadPromptControl): readonly [number, number];
        static getControlLabels(family: GamepadMappingFamily): ReadonlyMap<GamepadPromptControl, string>;
        static buildControlChannelMap(): ReadonlyMap<GamepadPromptControl, GamepadChannel>;
    }
}
declare module "input/index" {
    export * from "input/types";
    export * from "input/GamepadChannels";
    export * from "input/GamepadControl";
    export * from "input/GamepadMapping";
    export * from "input/GamepadDefinitions";
    export * from "input/Gamepad";
    export * from "input/GamepadPromptLayouts";
    export * from "input/GenericDualAnalogGamepadMapping";
    export * from "input/XboxGamepadMapping";
    export * from "input/PlayStationGamepadMapping";
    export * from "input/SwitchProGamepadMapping";
    export * from "input/JoyConLeftGamepadMapping";
    export * from "input/JoyConRightGamepadMapping";
    export * from "input/GameCubeGamepadMapping";
    export * from "input/SteamControllerGamepadMapping";
    export * from "input/ArcadeStickGamepadMapping";
    export * from "input/Input";
    export * from "input/InputManager";
    export * from "input/Pointer";
}
declare module "math/RectangleLike" {
    export interface RectangleLike {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}
declare module "math/CircleLike" {
    export interface CircleLike {
        x: number;
        y: number;
        radius: number;
    }
}
declare module "math/EllipseLike" {
    export interface EllipseLike {
        x: number;
        y: number;
        rx: number;
        ry: number;
    }
}
declare module "math/LineLike" {
    export interface LineLike {
        fromX: number;
        fromY: number;
        toX: number;
        toY: number;
    }
}
declare module "math/PolygonLike" {
    import type { PointLike } from "math/PointLike";
    export interface PolygonLike {
        x: number;
        y: number;
        points: Array<PointLike>;
    }
}
declare module "math/geometry" {
    import { Geometry } from "rendering/primitives/Geometry";
    export const buildLine: (startX: number, startY: number, endX: number, endY: number, width: number, vertices?: Array<number>, indices?: Array<number>) => Geometry;
    export const buildPath: (points: Array<number>, width: number, vertices?: Array<number>, indices?: Array<number>) => Geometry;
    export const buildCircle: (centerX: number, centerY: number, radius: number, vertices?: Array<number>, indices?: Array<number>) => Geometry;
    export const buildEllipse: (centerX: number, centerY: number, radiusX: number, radiusY: number, vertices?: Array<number>, indices?: Array<number>) => Geometry;
    export const buildPolygon: (points: Array<number>, vertices?: Array<number>, indices?: Array<number>) => Geometry;
    export const buildRectangle: (x: number, y: number, width: number, height: number, vertices?: Array<number>, indices?: Array<number>) => Geometry;
    export const buildStar: (centerX: number, centerY: number, points: number, radius: number, innerRadius?: number, rotation?: number) => Geometry;
}
declare module "math/Segment" {
    import { Vector } from "math/Vector";
    import type { Cloneable } from "core/types";
    export class Segment implements Cloneable {
        private readonly _startPoint;
        private readonly _endPoint;
        constructor(startX?: number, startY?: number, endX?: number, endY?: number);
        get startPoint(): Vector;
        set startPoint(startPoint: Vector);
        get startX(): number;
        set startX(x: number);
        get startY(): number;
        set startY(y: number);
        get endPoint(): Vector;
        set endPoint(endPoint: Vector);
        get endX(): number;
        set endX(x: number);
        get endY(): number;
        set endY(y: number);
        set(startX: number, startY: number, endX: number, endY: number): this;
        copy(segment: Segment): this;
        clone(): this;
        equals({ startX, startY, endX, endY }?: Partial<Segment>): boolean;
        destroy(): void;
        static get temp(): Segment;
    }
}
declare module "math/PolarVector" {
    import { Vector } from "math/Vector";
    export class PolarVector {
        radius: number;
        phi: number;
        constructor(radius?: number, angle?: number);
        static fromVector(vector: Vector): PolarVector;
        toVector(): Vector;
    }
}
declare module "math/index" {
    export * from "math/Collision";
    export * from "math/PointLike";
    export * from "math/RectangleLike";
    export * from "math/CircleLike";
    export * from "math/EllipseLike";
    export * from "math/LineLike";
    export * from "math/PolygonLike";
    export * from "math/utils";
    export * from "math/geometry";
    export * from "math/collision-detection";
    export * from "math/Vector";
    export * from "math/Line";
    export * from "math/Rectangle";
    export * from "math/Circle";
    export * from "math/Ellipse";
    export * from "math/Polygon";
    export * from "math/ShapeLike";
    export * from "math/Flags";
    export * from "math/Interval";
    export * from "math/Matrix";
    export * from "math/ObservableSize";
    export * from "math/ObservableVector";
    export * from "math/Random";
    export * from "math/Segment";
    export * from "math/Size";
    export * from "math/Transformable";
    export * from "math/PolarVector";
}
declare module "particles/affectors/ColorAffector" {
    import type { ParticleAffector } from "particles/affectors/ParticleAffector";
    import type { Color } from "core/Color";
    import type { Particle } from "particles/Particle";
    import type { Time } from "core/Time";
    export class ColorAffector implements ParticleAffector {
        private readonly _fromColor;
        private readonly _toColor;
        constructor(fromColor: Color, toColor: Color);
        get fromColor(): Color;
        set fromColor(color: Color);
        get toColor(): Color;
        set toColor(color: Color);
        setFromColor(color: Color): this;
        setToColor(color: Color): this;
        apply(particle: Particle, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/affectors/ForceAffector" {
    import type { ParticleAffector } from "particles/affectors/ParticleAffector";
    import { Vector } from "math/Vector";
    import type { Particle } from "particles/Particle";
    import type { Time } from "core/Time";
    export class ForceAffector implements ParticleAffector {
        private readonly _acceleration;
        constructor(accelerationX: number, accelerationY: number);
        get acceleration(): Vector;
        set acceleration(acceleration: Vector);
        setAcceleration(acceleration: Vector): this;
        apply(particle: Particle, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/affectors/ScaleAffector" {
    import type { ParticleAffector } from "particles/affectors/ParticleAffector";
    import { Vector } from "math/Vector";
    import type { Time } from "core/Time";
    import type { Particle } from "particles/Particle";
    export class ScaleAffector implements ParticleAffector {
        private readonly _scaleFactor;
        constructor(factorX: number, factorY: number);
        get scaleFactor(): Vector;
        set scaleFactor(scaleFactor: Vector);
        setScaleFactor(scaleFactor: Vector): this;
        apply(particle: Particle, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/affectors/TorqueAffector" {
    import type { ParticleAffector } from "particles/affectors/ParticleAffector";
    import type { Particle } from "particles/Particle";
    import type { Time } from "core/Time";
    export class TorqueAffector implements ParticleAffector {
        private _angularAcceleration;
        constructor(angularAcceleration: number);
        get angularAcceleration(): number;
        set angularAcceleration(angularAcceleration: number);
        setAngularAcceleration(angularAcceleration: number): this;
        apply(particle: Particle, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/emitters/UniversalEmitter" {
    import type { Time } from "core/Time";
    import { ParticleOptions } from "particles/emitters/ParticleOptions";
    import type { ParticleEmitter } from "particles/emitters/ParticleEmitter";
    import type { ParticleSystem } from "particles/ParticleSystem";
    export class UniversalEmitter implements ParticleEmitter {
        private _emissionRate;
        private _particleOptions;
        private _emissionDelta;
        constructor(emissionRate: number, particleOptions?: ParticleOptions);
        get emissionRate(): number;
        set emissionRate(particlesPerSecond: number);
        get particleOptions(): ParticleOptions;
        set particleOptions(particleOptions: ParticleOptions);
        computeParticleCount(time: Time): number;
        apply(system: ParticleSystem, delta: Time): this;
        destroy(): void;
    }
}
declare module "particles/index" {
    export * from "particles/affectors/ColorAffector";
    export * from "particles/affectors/ForceAffector";
    export * from "particles/affectors/ParticleAffector";
    export * from "particles/affectors/ScaleAffector";
    export * from "particles/affectors/TorqueAffector";
    export * from "particles/emitters/ParticleEmitter";
    export * from "particles/emitters/ParticleOptions";
    export * from "particles/emitters/UniversalEmitter";
    export * from "particles/ParticleProperties";
    export * from "particles/Particle";
    export * from "particles/ParticleSystem";
}
declare module "rendering/primitives/CircleGeometry" {
    import { Geometry } from "rendering/primitives/Geometry";
    export class CircleGeometry extends Geometry {
        constructor(centerX: number, centerY: number, radius: number);
    }
}
declare module "rendering/primitives/Graphics" {
    import { Color } from "core/Color";
    import { Container } from "rendering/Container";
    import { Vector } from "math/Vector";
    import type { SceneNode } from "core/SceneNode";
    import { DrawableShape } from "rendering/primitives/DrawableShape";
    export class Graphics extends Container {
        private _lineWidth;
        private _lineColor;
        private _fillColor;
        private _currentPoint;
        get lineWidth(): number;
        set lineWidth(lineWidth: number);
        get lineColor(): Color;
        set lineColor(lineColor: Color);
        get fillColor(): Color;
        set fillColor(fillColor: Color);
        get currentPoint(): Vector;
        getChildAt(index: number): DrawableShape;
        addChild(child: SceneNode): this;
        addChildAt(child: SceneNode, index: number): this;
        moveTo(x: number, y: number): this;
        lineTo(toX: number, toY: number): this;
        quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): this;
        bezierCurveTo(cpX1: number, cpY1: number, cpX2: number, cpY2: number, toX: number, toY: number): this;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
        drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
        drawLine(startX: number, startY: number, endX: number, endY: number): this;
        drawPath(path: Array<number>): this;
        drawPolygon(path: Array<number>): this;
        drawCircle(centerX: number, centerY: number, radius: number): this;
        drawEllipse(centerX: number, centerY: number, radiusX: number, radiusY: number): this;
        drawRectangle(x: number, y: number, width: number, height: number): this;
        drawStar(centerX: number, centerY: number, points: number, radius: number, innerRadius?: number, rotation?: number): this;
        clear(): this;
        destroy(): void;
    }
}
declare module "rendering/sprite/Spritesheet" {
    import type { Texture } from "rendering/texture/Texture";
    import { Rectangle } from "math/Rectangle";
    import { Sprite } from "rendering/sprite/Sprite";
    export interface SpritesheetFrame {
        frame: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
    }
    export interface SpritesheetData {
        frames: {
            [name: string]: SpritesheetFrame;
        };
    }
    export class Spritesheet {
        readonly texture: Texture;
        readonly frames: Map<string, Rectangle>;
        readonly sprites: Map<string, Sprite>;
        constructor(texture: Texture, data: SpritesheetData);
        parse(data: SpritesheetData, keepFrames?: boolean): void;
        addFrame(name: string, data: SpritesheetFrame): void;
        getFrameSprite(name: string): Sprite;
        clear(): this;
        destroy(): void;
    }
}
declare module "rendering/text/TextStyle" {
    export type TextStyleColor = string | CanvasGradient | CanvasPattern;
    export interface TextStyleOptions {
        align?: string;
        fill?: TextStyleColor;
        stroke?: TextStyleColor;
        strokeThickness?: number;
        fontSize?: number;
        fontWeight?: string;
        fontFamily?: string;
        wordWrap?: boolean;
        wordWrapWidth?: number;
        baseline?: CanvasTextBaseline;
        lineJoin?: CanvasLineJoin;
        miterLimit?: number;
        padding?: number;
    }
    export class TextStyle {
        private _align;
        private _fill;
        private _stroke;
        private _strokeThickness;
        private _fontSize;
        private _fontWeight;
        private _fontFamily;
        private _wordWrap;
        private _wordWrapWidth;
        private _baseline;
        private _lineJoin;
        private _miterLimit;
        private _padding;
        private _dirty;
        constructor(options?: TextStyleOptions);
        get align(): string;
        set align(align: string);
        get fill(): TextStyleColor;
        set fill(fill: TextStyleColor);
        get stroke(): TextStyleColor;
        set stroke(stroke: TextStyleColor);
        get strokeThickness(): number;
        set strokeThickness(strokeThickness: number);
        get fontSize(): number;
        set fontSize(fontSize: number);
        get fontWeight(): string;
        set fontWeight(fontWeight: string);
        get fontFamily(): string;
        set fontFamily(fontFamily: string);
        get wordWrap(): boolean;
        set wordWrap(wordWrap: boolean);
        get wordWrapWidth(): number;
        set wordWrapWidth(wordWrapWidth: number);
        get baseline(): CanvasTextBaseline;
        set baseline(baseline: CanvasTextBaseline);
        get lineJoin(): CanvasLineJoin;
        set lineJoin(lineJoin: CanvasLineJoin);
        get miterLimit(): number;
        set miterLimit(miterLimit: number);
        get padding(): number;
        set padding(padding: number);
        get dirty(): boolean;
        set dirty(dirty: boolean);
        get font(): string;
        apply(context: CanvasRenderingContext2D): this;
        copy(style: TextStyle): this;
        clone(): TextStyle;
    }
}
declare module "rendering/text/Text" {
    import { Sprite } from "rendering/sprite/Sprite";
    import type { TextStyleOptions } from "rendering/text/TextStyle";
    import { TextStyle } from "rendering/text/TextStyle";
    import type { SamplerOptions } from "rendering/texture/Sampler";
    import type { SceneRenderRuntime } from "rendering/SceneRenderRuntime";
    export class Text extends Sprite {
        private _text;
        private _style;
        private _canvas;
        private _context;
        private _dirty;
        constructor(text: string, style?: TextStyle | TextStyleOptions, samplerOptions?: Partial<SamplerOptions>, canvas?: HTMLCanvasElement);
        get text(): string;
        set text(text: string);
        get style(): TextStyle;
        set style(style: TextStyle);
        get canvas(): HTMLCanvasElement;
        set canvas(canvas: HTMLCanvasElement);
        setText(text: string): this;
        setStyle(style: TextStyle | TextStyleOptions): this;
        setCanvas(canvas: HTMLCanvasElement): this;
        updateTexture(): this;
        getWordWrappedText(): string;
        render(renderManager: SceneRenderRuntime): this;
        private _getContext;
    }
}
declare module "rendering/index" {
    export * from "rendering/primitives/CircleGeometry";
    export * from "rendering/primitives/Geometry";
    export * from "rendering/primitives/DrawableShape";
    export * from "rendering/primitives/Graphics";
    export * from "rendering/shader/Shader";
    export * from "rendering/shader/ShaderAttribute";
    export * from "rendering/shader/ShaderUniform";
    export * from "rendering/sprite/Sprite";
    export * from "rendering/sprite/Spritesheet";
    export * from "rendering/text/Text";
    export * from "rendering/text/TextStyle";
    export * from "rendering/texture/RenderTexture";
    export * from "rendering/texture/Sampler";
    export * from "rendering/texture/Texture";
    export * from "rendering/video/Video";
    export * from "rendering/webgl2/AbstractWebGl2BatchedRenderer";
    export * from "rendering/webgl2/AbstractWebGl2Renderer";
    export * from "rendering/webgl2/WebGl2RenderBuffer";
    export * from "rendering/webgl2/WebGl2ShaderBlock";
    export * from "rendering/webgl2/WebGl2ShaderMappings";
    export * from "rendering/webgl2/WebGl2VertexArrayObject";
    export * from "rendering/webgl2/WebGl2ParticleRenderer";
    export * from "rendering/webgl2/WebGl2PrimitiveRenderer";
    export type { WebGl2RendererRuntime } from "rendering/webgl2/WebGl2RendererRuntime";
    export * from "rendering/webgl2/WebGl2RenderManager";
    export * from "rendering/webgl2/WebGl2ShaderRuntime";
    export * from "rendering/webgl2/WebGl2SpriteRenderer";
    export * from "rendering/webgpu/AbstractWebGpuRenderer";
    export * from "rendering/webgpu/WebGpuBlendState";
    export * from "rendering/webgpu/WebGpuParticleRenderer";
    export * from "rendering/webgpu/WebGpuPrimitiveRenderer";
    export type { WebGpuRendererRuntime } from "rendering/webgpu/WebGpuRendererRuntime";
    export * from "rendering/webgpu/WebGpuRenderManager";
    export * from "rendering/webgpu/WebGpuSpriteRenderer";
    export * from "rendering/types";
    export * from "rendering/Container";
    export * from "rendering/Drawable";
    export * from "rendering/RenderBackendType";
    export * from "rendering/RenderPass";
    export * from "rendering/RenderTarget";
    export * from "rendering/Renderer";
    export * from "rendering/RendererRegistry";
    export * from "rendering/SceneRenderRuntime";
    export * from "rendering/View";
}
declare module "resources/CacheStrategy" {
    import type { AssetFactory } from "resources/AssetFactory";
    import type { CacheStore } from "resources/CacheStore";
    export interface CacheRequest {
        readonly storageName: string;
        readonly key: string;
        readonly url: string;
        readonly requestOptions: RequestInit;
        readonly factory: AssetFactory;
    }
    export interface CacheStrategy {
        resolve(request: CacheRequest, stores: ReadonlyArray<CacheStore>): Promise<unknown>;
    }
}
declare module "resources/CacheFirstStrategy" {
    import type { CacheRequest, CacheStrategy } from "resources/CacheStrategy";
    import type { CacheStore } from "resources/CacheStore";
    export class CacheFirstStrategy implements CacheStrategy {
        resolve(request: CacheRequest, stores: ReadonlyArray<CacheStore>): Promise<unknown>;
    }
}
declare module "resources/NetworkOnlyStrategy" {
    import type { CacheRequest, CacheStrategy } from "resources/CacheStrategy";
    import type { CacheStore } from "resources/CacheStore";
    export class NetworkOnlyStrategy implements CacheStrategy {
        resolve(request: CacheRequest, _stores: ReadonlyArray<CacheStore>): Promise<unknown>;
    }
}
declare module "resources/Database" {
    export interface Database {
        readonly name: string;
        readonly version: number;
        readonly connected: boolean;
        connect(): Promise<boolean>;
        disconnect(): Promise<boolean>;
        load<T = unknown>(type: string, name: string): Promise<T | null>;
        save(type: string, name: string, data: unknown): Promise<void>;
        delete(type: string, name: string): Promise<boolean>;
        clearStorage(type: string): Promise<boolean>;
        deleteStorage(): Promise<boolean>;
        destroy(): void;
    }
}
declare module "resources/IndexedDbDatabase" {
    import type { Database } from "resources/Database";
    export class IndexedDbDatabase implements Database {
        readonly name: string;
        readonly version: number;
        private readonly _storeNames;
        private readonly _migrations;
        private readonly _onCloseHandler;
        private _connected;
        private _database;
        get connected(): boolean;
        constructor(name: string, version?: number, storeNames?: ReadonlyArray<string>, migrations?: Record<number, (db: IDBDatabase, transaction: IDBTransaction) => boolean>);
        getObjectStore(type: string, transactionMode?: IDBTransactionMode): Promise<IDBObjectStore>;
        connect(): Promise<boolean>;
        disconnect(): Promise<boolean>;
        load<T = unknown>(type: string, name: string): Promise<T | null>;
        save(type: string, name: string, data: unknown): Promise<void>;
        delete(type: string, name: string): Promise<boolean>;
        clearStorage(type: string): Promise<boolean>;
        deleteStorage(): Promise<boolean>;
        destroy(): void;
    }
}
declare module "resources/IndexedDbStore" {
    import type { CacheStore } from "resources/CacheStore";
    export interface IndexedDbStoreOptions {
        name: string;
        version?: number;
        storeNames?: ReadonlyArray<string>;
        migrations?: Record<number, (db: IDBDatabase, transaction: IDBTransaction) => boolean>;
    }
    export class IndexedDbStore implements CacheStore {
        private readonly _db;
        constructor(nameOrOptions: string | IndexedDbStoreOptions);
        load(storageName: string, key: string): Promise<unknown | null>;
        save(storageName: string, key: string, data: unknown): Promise<void>;
        delete(storageName: string, key: string): Promise<boolean>;
        clear(storageName: string): Promise<boolean>;
        destroy(): void;
    }
}
declare module "resources/index" {
    export * from "resources/AssetFactory";
    export * from "resources/AbstractAssetFactory";
    export * from "resources/tokens";
    export * from "resources/CacheStore";
    export * from "resources/CacheStrategy";
    export * from "resources/CacheFirstStrategy";
    export * from "resources/NetworkOnlyStrategy";
    export * from "resources/IndexedDbStore";
    export * from "resources/FactoryRegistry";
    export * from "resources/Loader";
    export * from "resources/Database";
    export * from "resources/IndexedDbDatabase";
    export * from "resources/utils";
    export * from "resources/factories/FontFactory";
    export * from "resources/factories/ImageFactory";
    export * from "resources/factories/JsonFactory";
    export * from "resources/factories/MusicFactory";
    export * from "resources/factories/SoundFactory";
    export * from "resources/factories/SvgFactory";
    export * from "resources/factories/TextFactory";
    export * from "resources/factories/TextureFactory";
    export * from "resources/factories/VideoFactory";
    export * from "resources/factories/BinaryFactory";
    export * from "resources/factories/VttFactory";
    export * from "resources/factories/WasmFactory";
}
declare module "index" {
    export * from "core/index";
    export * from "audio/index";
    export * from "input/index";
    export * from "math/index";
    export * from "particles/index";
    export * from "rendering/index";
    export * from "resources/index";
}
