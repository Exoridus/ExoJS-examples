const radiansPerDegree = Math.PI / 180;
const trimRotation = (degrees) => {
    const rotation = degrees % 360;
    return rotation < 0 ? rotation + 360 : rotation;
};
const degreesToRadians = (degree) => degree * radiansPerDegree;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const isPowerOfTwo = (value) => ((value !== 0) && ((value & (value - 1)) === 0));
const inRange = (value, min, max) => (value >= Math.min(min, max) && value <= Math.max(min, max));
const getDistance = (x1, y1, x2, y2) => {
    const offsetX = x1 - x2;
    const offsetY = y1 - y2;
    return Math.sqrt((offsetX * offsetX) + (offsetY * offsetY));
};

class Color {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this._rgba = null;
        this._array = null;
        this._r = r & 255;
        this._g = g & 255;
        this._b = b & 255;
        this._a = clamp(a, 0, 1);
    }
    get r() {
        return this._r;
    }
    set r(red) {
        this._r = red & 255;
        this._rgba = null;
    }
    get g() {
        return this._g;
    }
    set g(green) {
        this._g = green & 255;
        this._rgba = null;
    }
    get b() {
        return this._b;
    }
    set b(blue) {
        this._b = blue & 255;
        this._rgba = null;
    }
    get a() {
        return this._a;
    }
    set a(alpha) {
        this._a = clamp(alpha, 0, 1);
        this._rgba = null;
    }
    get red() {
        return this.r;
    }
    set red(red) {
        this.r = red;
    }
    get green() {
        return this.g;
    }
    set green(green) {
        this.g = green;
    }
    get blue() {
        return this.b;
    }
    set blue(blue) {
        this.b = blue;
    }
    get alpha() {
        return this.a;
    }
    set alpha(alpha) {
        this.a = alpha;
    }
    set(r = this._r, g = this._g, b = this._b, a = this._a) {
        this._r = r & 255;
        this._g = g & 255;
        this._b = b & 255;
        this._a = clamp(a, 0, 1);
        this._rgba = null;
        return this;
    }
    copy(color) {
        return this.set(color.r, color.g, color.b, color.a);
    }
    clone() {
        return new Color(this._r, this._g, this._b, this._a);
    }
    equals({ r, g, b, a } = {}) {
        return (r === undefined || this.r === r)
            && (g === undefined || this.g === g)
            && (b === undefined || this.b === b)
            && (a === undefined || this.a === a);
    }
    toArray(normalized = false) {
        if (!this._array) {
            this._array = new Float32Array(4);
        }
        if (normalized) {
            this._array[0] = this._r / 255;
            this._array[1] = this._g / 255;
            this._array[2] = this._b / 255;
            this._array[3] = this._a;
        }
        else {
            this._array[0] = this._r;
            this._array[1] = this._g;
            this._array[2] = this._b;
            this._array[3] = this._a;
        }
        return this._array;
    }
    toString(prefixed = true) {
        return `${prefixed ? '#' : ''}${((1 << 24) + (this._r << 16) + (this._g << 8) + this._b).toString(16).substr(1)}`;
    }
    toRgba() {
        if (this._rgba === null) {
            this._rgba = this._a && (((this._a * 255 | 0) << 24) + (this._b << 16) + (this._g << 8) + this._r) >>> 0;
        }
        return this._rgba;
    }
    destroy() {
        if (this._array) {
            this._array = null;
        }
    }
}
Color.aliceBlue = new Color(240, 248, 255, 1);
Color.antiqueWhite = new Color(250, 235, 215, 1);
Color.aqua = new Color(0, 255, 255, 1);
Color.aquamarine = new Color(127, 255, 212, 1);
Color.azure = new Color(240, 255, 255, 1);
Color.beige = new Color(245, 245, 220, 1);
Color.bisque = new Color(255, 228, 196, 1);
Color.black = new Color(0, 0, 0, 1);
Color.blanchedAlmond = new Color(255, 235, 205, 1);
Color.blue = new Color(0, 0, 255, 1);
Color.blueViolet = new Color(138, 43, 226, 1);
Color.brown = new Color(165, 42, 42, 1);
Color.burlyWood = new Color(222, 184, 135, 1);
Color.cadetBlue = new Color(95, 158, 160, 1);
Color.chartreuse = new Color(127, 255, 0, 1);
Color.chocolate = new Color(210, 105, 30, 1);
Color.coral = new Color(255, 127, 80, 1);
Color.cornflowerBlue = new Color(100, 149, 237, 1);
Color.cornsilk = new Color(255, 248, 220, 1);
Color.crimson = new Color(220, 20, 60, 1);
Color.cyan = new Color(0, 255, 255, 1);
Color.darkBlue = new Color(0, 0, 139, 1);
Color.darkCyan = new Color(0, 139, 139, 1);
Color.darkGoldenrod = new Color(184, 134, 11, 1);
Color.darkGray = new Color(169, 169, 169, 1);
Color.darkGreen = new Color(0, 100, 0, 1);
Color.darkKhaki = new Color(189, 183, 107, 1);
Color.darkMagenta = new Color(139, 0, 139, 1);
Color.darkOliveGreen = new Color(85, 107, 47, 1);
Color.darkOrange = new Color(255, 140, 0, 1);
Color.darkOrchid = new Color(153, 50, 204, 1);
Color.darkRed = new Color(139, 0, 0, 1);
Color.darkSalmon = new Color(233, 150, 122, 1);
Color.darkSeaGreen = new Color(143, 188, 139, 1);
Color.darkSlateBlue = new Color(72, 61, 139, 1);
Color.darkSlateGray = new Color(47, 79, 79, 1);
Color.darkTurquoise = new Color(0, 206, 209, 1);
Color.darkViolet = new Color(148, 0, 211, 1);
Color.deepPink = new Color(255, 20, 147, 1);
Color.deepSkyBlue = new Color(0, 191, 255, 1);
Color.dimGray = new Color(105, 105, 105, 1);
Color.dodgerBlue = new Color(30, 144, 255, 1);
Color.firebrick = new Color(178, 34, 34, 1);
Color.floralWhite = new Color(255, 250, 240, 1);
Color.forestGreen = new Color(34, 139, 34, 1);
Color.fuchsia = new Color(255, 0, 255, 1);
Color.gainsboro = new Color(220, 220, 220, 1);
Color.ghostWhite = new Color(248, 248, 255, 1);
Color.gold = new Color(255, 215, 0, 1);
Color.goldenrod = new Color(218, 165, 32, 1);
Color.gray = new Color(128, 128, 128, 1);
Color.green = new Color(0, 128, 0, 1);
Color.greenYellow = new Color(173, 255, 47, 1);
Color.honeydew = new Color(240, 255, 240, 1);
Color.hotPink = new Color(255, 105, 180, 1);
Color.indianRed = new Color(205, 92, 92, 1);
Color.indigo = new Color(75, 0, 130, 1);
Color.ivory = new Color(255, 255, 240, 1);
Color.khaki = new Color(240, 230, 140, 1);
Color.lavender = new Color(230, 230, 250, 1);
Color.lavenderBlush = new Color(255, 240, 245, 1);
Color.lawnGreen = new Color(124, 252, 0, 1);
Color.lemonChiffon = new Color(255, 250, 205, 1);
Color.lightBlue = new Color(173, 216, 230, 1);
Color.lightCoral = new Color(240, 128, 128, 1);
Color.lightCyan = new Color(224, 255, 255, 1);
Color.lightGoldenrodYellow = new Color(250, 250, 210, 1);
Color.lightGray = new Color(211, 211, 211, 1);
Color.lightGreen = new Color(144, 238, 144, 1);
Color.lightPink = new Color(255, 182, 193, 1);
Color.lightSalmon = new Color(255, 160, 122, 1);
Color.lightSeaGreen = new Color(32, 178, 170, 1);
Color.lightSkyBlue = new Color(135, 206, 250, 1);
Color.lightSlateGray = new Color(119, 136, 153, 1);
Color.lightSteelBlue = new Color(176, 196, 222, 1);
Color.lightYellow = new Color(255, 255, 224, 1);
Color.lime = new Color(0, 255, 0, 1);
Color.limeGreen = new Color(50, 205, 50, 1);
Color.linen = new Color(250, 240, 230, 1);
Color.magenta = new Color(255, 0, 255, 1);
Color.maroon = new Color(128, 0, 0, 1);
Color.mediumAquamarine = new Color(102, 205, 170, 1);
Color.mediumBlue = new Color(0, 0, 205, 1);
Color.mediumOrchid = new Color(186, 85, 211, 1);
Color.mediumPurple = new Color(147, 112, 219, 1);
Color.mediumSeaGreen = new Color(60, 179, 113, 1);
Color.mediumSlateBlue = new Color(123, 104, 238, 1);
Color.mediumSpringGreen = new Color(0, 250, 154, 1);
Color.mediumTurquoise = new Color(72, 209, 204, 1);
Color.mediumVioletRed = new Color(199, 21, 133, 1);
Color.midnightBlue = new Color(25, 25, 112, 1);
Color.mintCream = new Color(245, 255, 250, 1);
Color.mistyRose = new Color(255, 228, 225, 1);
Color.moccasin = new Color(255, 228, 181, 1);
Color.navajoWhite = new Color(255, 222, 173, 1);
Color.navy = new Color(0, 0, 128, 1);
Color.oldLace = new Color(253, 245, 230, 1);
Color.olive = new Color(128, 128, 0, 1);
Color.oliveDrab = new Color(107, 142, 35, 1);
Color.orange = new Color(255, 165, 0, 1);
Color.orangeRed = new Color(255, 69, 0, 1);
Color.orchid = new Color(218, 112, 214, 1);
Color.paleGoldenrod = new Color(238, 232, 170, 1);
Color.paleGreen = new Color(152, 251, 152, 1);
Color.paleTurquoise = new Color(175, 238, 238, 1);
Color.paleVioletRed = new Color(219, 112, 147, 1);
Color.papayaWhip = new Color(255, 239, 213, 1);
Color.peachPuff = new Color(255, 218, 185, 1);
Color.peru = new Color(205, 133, 63, 1);
Color.pink = new Color(255, 192, 203, 1);
Color.plum = new Color(221, 160, 221, 1);
Color.powderBlue = new Color(176, 224, 230, 1);
Color.purple = new Color(128, 0, 128, 1);
Color.red = new Color(255, 0, 0, 1);
Color.rosyBrown = new Color(188, 143, 143, 1);
Color.royalBlue = new Color(65, 105, 225, 1);
Color.saddleBrown = new Color(139, 69, 19, 1);
Color.salmon = new Color(250, 128, 114, 1);
Color.sandyBrown = new Color(244, 164, 96, 1);
Color.seaGreen = new Color(46, 139, 87, 1);
Color.seaShell = new Color(255, 245, 238, 1);
Color.sienna = new Color(160, 82, 45, 1);
Color.silver = new Color(192, 192, 192, 1);
Color.skyBlue = new Color(135, 206, 235, 1);
Color.slateBlue = new Color(106, 90, 205, 1);
Color.slateGray = new Color(112, 128, 144, 1);
Color.snow = new Color(255, 250, 250, 1);
Color.springGreen = new Color(0, 255, 127, 1);
Color.steelBlue = new Color(70, 130, 180, 1);
Color.tan = new Color(210, 180, 140, 1);
Color.teal = new Color(0, 128, 128, 1);
Color.thistle = new Color(216, 191, 216, 1);
Color.tomato = new Color(255, 99, 71, 1);
Color.transparentBlack = new Color(0, 0, 0, 0);
Color.transparentWhite = new Color(255, 255, 255, 0);
Color.turquoise = new Color(64, 224, 208, 1);
Color.violet = new Color(238, 130, 238, 1);
Color.wheat = new Color(245, 222, 179, 1);
Color.white = new Color(255, 255, 255, 1);
Color.whiteSmoke = new Color(245, 245, 245, 1);
Color.yellow = new Color(255, 255, 0, 1);
Color.yellowGreen = new Color(154, 205, 50, 1);

var BlendModes;
(function (BlendModes) {
    BlendModes[BlendModes["Normal"] = 0] = "Normal";
    BlendModes[BlendModes["Additive"] = 1] = "Additive";
    BlendModes[BlendModes["Subtract"] = 2] = "Subtract";
    BlendModes[BlendModes["Multiply"] = 3] = "Multiply";
    BlendModes[BlendModes["Screen"] = 4] = "Screen";
})(BlendModes || (BlendModes = {}));
var ScaleModes;
(function (ScaleModes) {
    ScaleModes[ScaleModes["Nearest"] = 9728] = "Nearest";
    ScaleModes[ScaleModes["Linear"] = 9729] = "Linear";
    ScaleModes[ScaleModes["NearestMipmapNearest"] = 9984] = "NearestMipmapNearest";
    ScaleModes[ScaleModes["LinearMipmapNearest"] = 9985] = "LinearMipmapNearest";
    ScaleModes[ScaleModes["NearestMipmapLinear"] = 9986] = "NearestMipmapLinear";
    ScaleModes[ScaleModes["LinearMipmapLinear"] = 9987] = "LinearMipmapLinear";
})(ScaleModes || (ScaleModes = {}));
var WrapModes;
(function (WrapModes) {
    WrapModes[WrapModes["Repeat"] = 10497] = "Repeat";
    WrapModes[WrapModes["ClampToEdge"] = 33071] = "ClampToEdge";
    WrapModes[WrapModes["MirroredRepeat"] = 33648] = "MirroredRepeat";
})(WrapModes || (WrapModes = {}));
var RenderingPrimitives;
(function (RenderingPrimitives) {
    RenderingPrimitives[RenderingPrimitives["Points"] = 0] = "Points";
    RenderingPrimitives[RenderingPrimitives["Lines"] = 1] = "Lines";
    RenderingPrimitives[RenderingPrimitives["LineLoop"] = 2] = "LineLoop";
    RenderingPrimitives[RenderingPrimitives["LineStrip"] = 3] = "LineStrip";
    RenderingPrimitives[RenderingPrimitives["Triangles"] = 4] = "Triangles";
    RenderingPrimitives[RenderingPrimitives["TriangleStrip"] = 5] = "TriangleStrip";
    RenderingPrimitives[RenderingPrimitives["TriangleFan"] = 6] = "TriangleFan";
})(RenderingPrimitives || (RenderingPrimitives = {}));
var BufferTypes;
(function (BufferTypes) {
    BufferTypes[BufferTypes["ArrayBuffer"] = 34962] = "ArrayBuffer";
    BufferTypes[BufferTypes["ElementArrayBuffer"] = 34963] = "ElementArrayBuffer";
    BufferTypes[BufferTypes["CopyReadBuffer"] = 36662] = "CopyReadBuffer";
    BufferTypes[BufferTypes["CopyWriteBuffer"] = 36663] = "CopyWriteBuffer";
    BufferTypes[BufferTypes["TransformFeedbackBuffer"] = 35982] = "TransformFeedbackBuffer";
    BufferTypes[BufferTypes["UniformBuffer"] = 35345] = "UniformBuffer";
    BufferTypes[BufferTypes["PixelPackBuffer"] = 35051] = "PixelPackBuffer";
    BufferTypes[BufferTypes["PixelUnpackBuffer"] = 35052] = "PixelUnpackBuffer";
})(BufferTypes || (BufferTypes = {}));
var BufferUsage;
(function (BufferUsage) {
    BufferUsage[BufferUsage["StaticDraw"] = 35044] = "StaticDraw";
    BufferUsage[BufferUsage["StaticRead"] = 35045] = "StaticRead";
    BufferUsage[BufferUsage["StaticCopy"] = 35046] = "StaticCopy";
    BufferUsage[BufferUsage["DynamicDraw"] = 35048] = "DynamicDraw";
    BufferUsage[BufferUsage["DynamicRead"] = 35049] = "DynamicRead";
    BufferUsage[BufferUsage["DynamicCopy"] = 35050] = "DynamicCopy";
    BufferUsage[BufferUsage["StreamDraw"] = 35040] = "StreamDraw";
    BufferUsage[BufferUsage["StreamRead"] = 35041] = "StreamRead";
    BufferUsage[BufferUsage["StreamCopy"] = 35042] = "StreamCopy";
})(BufferUsage || (BufferUsage = {}));
// @eslint-ignore
var ShaderPrimitives;
(function (ShaderPrimitives) {
    ShaderPrimitives[ShaderPrimitives["Int"] = 5124] = "Int";
    ShaderPrimitives[ShaderPrimitives["IntVec2"] = 35667] = "IntVec2";
    ShaderPrimitives[ShaderPrimitives["IntVec3"] = 35668] = "IntVec3";
    ShaderPrimitives[ShaderPrimitives["IntVec4"] = 35669] = "IntVec4";
    ShaderPrimitives[ShaderPrimitives["Float"] = 5126] = "Float";
    ShaderPrimitives[ShaderPrimitives["FloatVec2"] = 35664] = "FloatVec2";
    ShaderPrimitives[ShaderPrimitives["FloatVec3"] = 35665] = "FloatVec3";
    ShaderPrimitives[ShaderPrimitives["FloatVec4"] = 35666] = "FloatVec4";
    ShaderPrimitives[ShaderPrimitives["Bool"] = 35670] = "Bool";
    ShaderPrimitives[ShaderPrimitives["BoolVec2"] = 35671] = "BoolVec2";
    ShaderPrimitives[ShaderPrimitives["BoolVec3"] = 35672] = "BoolVec3";
    ShaderPrimitives[ShaderPrimitives["BoolVec4"] = 35673] = "BoolVec4";
    ShaderPrimitives[ShaderPrimitives["FloatMat2"] = 35674] = "FloatMat2";
    ShaderPrimitives[ShaderPrimitives["FloatMat3"] = 35675] = "FloatMat3";
    ShaderPrimitives[ShaderPrimitives["FloatMat4"] = 35676] = "FloatMat4";
    ShaderPrimitives[ShaderPrimitives["Sampler2D"] = 35678] = "Sampler2D";
})(ShaderPrimitives || (ShaderPrimitives = {}));

var RendererType;
(function (RendererType) {
    RendererType[RendererType["Sprite"] = 1] = "Sprite";
    RendererType[RendererType["Particle"] = 2] = "Particle";
    RendererType[RendererType["Primitive"] = 3] = "Primitive";
})(RendererType || (RendererType = {}));

let temp$4 = null;
class Size {
    constructor(width = 0, height = 0) {
        this._width = width;
        this._height = height;
    }
    get width() {
        return this._width;
    }
    set width(width) {
        this._width = width;
    }
    get height() {
        return this._height;
    }
    set height(height) {
        this._height = height;
    }
    set(width, height = width) {
        this._width = width;
        this._height = height;
        return this;
    }
    add(width, height = width) {
        this._width += width;
        this._height += height;
        return this;
    }
    subtract(width, height = width) {
        this._width -= width;
        this._height -= height;
        return this;
    }
    scale(width, height = width) {
        this._width *= width;
        this._height *= height;
        return this;
    }
    divide(width, height = width) {
        this._width /= width;
        this._height /= height;
        return this;
    }
    copy(size) {
        this._width = size.width;
        this._height = size.height;
        return this;
    }
    clone() {
        return new Size(this._width, this._height);
    }
    equals({ width, height } = {}) {
        return (width === undefined || this.width === width)
            && (height === undefined || this.height === height);
    }
    destroy() {
        // todo - check if destroy is needed
    }
    static get temp() {
        if (temp$4 === null) {
            temp$4 = new Size();
        }
        return temp$4;
    }
}
Size.zero = new Size(0, 0);

class AbstractVector {
    get direction() {
        return Math.atan2(this.x, this.y);
    }
    set direction(angle) {
        const length = this.length;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }
    get angle() {
        return this.direction;
    }
    set angle(angle) {
        this.direction = angle;
    }
    get length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    set length(magnitude) {
        const direction = this.direction;
        this.x = Math.cos(direction) * magnitude;
        this.y = Math.sin(direction) * magnitude;
    }
    get lengthSq() {
        return (this.x * this.x) + (this.y * this.y);
    }
    set lengthSq(lengthSquared) {
        this.length = Math.sqrt(lengthSquared);
    }
    get magnitude() {
        return this.length;
    }
    set magnitude(magnitude) {
        this.length = magnitude;
    }
    set(x, y = x) {
        this.x = x;
        this.y = y;
        return this;
    }
    equals({ x, y } = {}) {
        return (x === undefined || this.x === x)
            && (y === undefined || this.y === y);
    }
    add(x, y = x) {
        this.x += x;
        this.y += y;
        return this;
    }
    subtract(x, y = x) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    multiply(x, y = x) {
        this.x *= x;
        this.y *= y;
        return this;
    }
    divide(x, y = x) {
        if (x !== 0 && y !== 0) {
            this.x /= x;
            this.y /= y;
        }
        return this;
    }
    normalize() {
        return this.divide(this.length);
    }
    invert() {
        return this.multiply(-1, -1);
    }
    transform(matrix) {
        return this.set((this.x * matrix.a) + (this.y * matrix.b) + matrix.x, (this.x * matrix.c) + (this.y * matrix.d) + matrix.y);
    }
    transformInverse(matrix) {
        const id = 1 / ((matrix.a * matrix.d) + (matrix.c * -matrix.b));
        return this.set((this.x * matrix.d * id) + (this.y * -matrix.c * id) + (((matrix.y * matrix.c) - (matrix.x * matrix.d)) * id), (this.y * matrix.a * id) + (this.x * -matrix.b * id) + (((-matrix.y * matrix.a) + (matrix.x * matrix.b)) * id));
    }
    perp() {
        return this.set(-this.y, this.x);
    }
    rperp() {
        return this.set(this.y, -this.x);
    }
    min() {
        return Math.min(this.x, this.y);
    }
    max() {
        return Math.max(this.x, this.y);
    }
    dot(x, y) {
        return (this.x * x) + (this.y * y);
    }
    cross(vector) {
        return (this.x * vector.y) - (this.y * vector.x);
    }
    distanceTo(vector) {
        return getDistance(this.x, this.y, vector.x, vector.y);
    }
}

class ObservableVector extends AbstractVector {
    constructor(callback, x = 0, y = 0) {
        super();
        this._x = x;
        this._y = y;
        this._callback = callback;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        if (this._x !== x) {
            this._x = x;
            this._callback?.();
        }
    }
    get y() {
        return this._y;
    }
    set y(y) {
        if (this._y !== y) {
            this._y = y;
            this._callback?.();
        }
    }
    set direction(angle) {
        const length = this.length;
        this.set(Math.cos(angle) * length, Math.sin(angle) * length);
    }
    set length(magnitude) {
        const direction = this.direction;
        this.set(Math.cos(direction) * magnitude, Math.sin(direction) * magnitude);
    }
    set(x = this._x, y = this._y) {
        if (this._x !== x || this._y !== y) {
            this._x = x;
            this._y = y;
            this._callback?.();
        }
        return this;
    }
    add(x, y = x) {
        return this.set(this._x + x, this._y + y);
    }
    subtract(x, y = x) {
        return this.set(this._x - x, this._y - y);
    }
    scale(x, y = x) {
        return this.set(this._x * x, this._y * y);
    }
    divide(x, y = x) {
        if (x !== 0 && y !== 0) {
            return this.set(this._x / x, this._y / y);
        }
        return this;
    }
    clone() {
        return new ObservableVector(this._callback, this._x, this._y);
    }
    copy(vector) {
        return this.set(vector.x, vector.y);
    }
    destroy() {
        // todo - check if destroy is needed
    }
}

let temp$3 = null;
class Interval {
    constructor(min = 0, max = min) {
        this.min = min;
        this.max = max;
    }
    set(min, max) {
        this.min = min;
        this.max = max;
        return this;
    }
    copy(interval) {
        return this.set(interval.min, interval.max);
    }
    clone() {
        return new Interval(this.min, this.max);
    }
    containsInterval(interval) {
        return interval.min > this.min && interval.max < this.max;
    }
    includes(value) {
        return value <= this.max && value >= this.min;
    }
    overlaps(interval) {
        return !(this.min > interval.max || interval.min > this.max);
    }
    getOverlap(interval) {
        return this.max < interval.max ? this.max - interval.min : interval.max - this.min;
    }
    destroy() {
        // todo - check if destroy is needed
    }
    static get temp() {
        if (temp$3 === null) {
            temp$3 = new Interval();
        }
        return temp$3;
    }
}
Interval.zero = new Interval(0, 0);

const epsilon = 1e-10;
const getCurveSegments = (radiusA, radiusB = radiusA) => (Math.max(16, Math.ceil(Math.sqrt(Math.max(radiusA, radiusB)) * 8)));
const buildEllipsePoints = ({ x: centerX, y: centerY, rx, ry }) => {
    if (rx <= 0 || ry <= 0) {
        return [];
    }
    const segments = getCurveSegments(rx, ry);
    const delta = (Math.PI * 2) / segments;
    const points = [];
    for (let i = 0; i < segments; i++) {
        const angle = i * delta;
        points.push({
            x: centerX + (Math.cos(angle) * rx),
            y: centerY + (Math.sin(angle) * ry),
        });
    }
    return points;
};
const buildRectanglePoints = ({ x, y, width, height }) => ([
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
]);
const pointOnSegment = ({ x: px, y: py }, { x: x1, y: y1 }, { x: x2, y: y2 }) => (px <= Math.max(x1, x2) + epsilon
    && px >= Math.min(x1, x2) - epsilon
    && py <= Math.max(y1, y2) + epsilon
    && py >= Math.min(y1, y2) - epsilon);
const orientation = ({ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }) => {
    const determinant = ((y2 - y1) * (x3 - x2)) - ((x2 - x1) * (y3 - y2));
    if (Math.abs(determinant) <= epsilon) {
        return 0;
    }
    return determinant > 0 ? 1 : 2;
};
const segmentsIntersect = (a1, a2, b1, b2) => {
    const o1 = orientation(a1, a2, b1);
    const o2 = orientation(a1, a2, b2);
    const o3 = orientation(b1, b2, a1);
    const o4 = orientation(b1, b2, a2);
    if (o1 !== o2 && o3 !== o4) {
        return true;
    }
    if (o1 === 0 && pointOnSegment(b1, a1, a2)) {
        return true;
    }
    if (o2 === 0 && pointOnSegment(b2, a1, a2)) {
        return true;
    }
    if (o3 === 0 && pointOnSegment(a1, b1, b2)) {
        return true;
    }
    if (o4 === 0 && pointOnSegment(a2, b1, b2)) {
        return true;
    }
    return false;
};
const polygonContainsPoint = ({ x, y }, points) => {
    const len = points.length;
    if (len < 3) {
        return false;
    }
    let inside = false;
    for (let current = 0, previous = len - 1; current < len; previous = current++) {
        const prev = points[previous];
        const curr = points[current];
        if (((curr.y > y) !== (prev.y > y)) && (x < ((prev.x - curr.x) * ((y - curr.y) / (prev.y - curr.y))) + curr.x)) {
            inside = !inside;
        }
    }
    return inside;
};
const polygonsIntersect = (polygonA, polygonB) => {
    if (polygonA.length === 0 || polygonB.length === 0) {
        return false;
    }
    for (let i = 0; i < polygonA.length; i++) {
        const a1 = polygonA[i];
        const a2 = polygonA[(i + 1) % polygonA.length];
        for (let j = 0; j < polygonB.length; j++) {
            const b1 = polygonB[j];
            const b2 = polygonB[(j + 1) % polygonB.length];
            if (segmentsIntersect(a1, a2, b1, b2)) {
                return true;
            }
        }
    }
    return polygonContainsPoint(polygonA[0], polygonB)
        || polygonContainsPoint(polygonB[0], polygonA);
};
const intersectionPointPoint$1 = ({ x: x1, y: y1 }, { x: x2, y: y2 }, threshold = 0) => (getDistance(x1, y1, x2, y2) <= threshold);
const intersectionPointLineSegment = ({ x, y }, { x: x1, y: y1 }, { x: x2, y: y2 }, threshold = 0.1) => {
    const d1 = getDistance(x, y, x1, y1);
    const d2 = getDistance(x, y, x2, y2);
    const d3 = getDistance(x1, y1, x2, y2);
    return (d1 + d2) >= (d3 - threshold)
        && (d1 + d2) <= (d3 + threshold);
};
const intersectionPointRect$1 = ({ x: x1, y: y1 }, { x: x2, y: y2, width, height }) => (inRange(x1, x2, x2 + width) && inRange(y1, y2, y2 + height));
const intersectionPointCircle$1 = ({ x: x1, y: y1 }, { x: x2, y: y2, radius }) => (radius > 0 && getDistance(x1, y1, x2, y2) <= radius);
const intersectionPointEllipse$1 = ({ x: x1, y: y1 }, { x: x2, y: y2, rx, ry }) => {
    if (rx <= 0 || ry <= 0) {
        return false;
    }
    const normX = (x1 - x2) / rx;
    const normY = (y1 - y2) / ry;
    return ((normX * normX) + (normY * normY)) <= 1;
};
const intersectionPointPoly$1 = (point, { points }) => (polygonContainsPoint(point, points));
const intersectionLineLineSegments = (a1, a2, b1, b2) => {
    const denominator = ((a2.x - a1.x) * (b2.y - b1.y)) - ((b2.x - b1.x) * (a2.y - a1.y));
    if (Math.abs(denominator) <= epsilon) {
        return false;
    }
    const uA = (((b2.x - b1.x) * (a1.y - b1.y)) - ((b2.y - b1.y) * (a1.x - b1.x))) / denominator;
    const uB = (((a2.x - a1.x) * (a1.y - b1.y)) - ((a2.y - a1.y) * (a1.x - b1.x))) / denominator;
    return uA >= 0 && uA <= 1
        && uB >= 0 && uB <= 1;
};
const intersectionRectRect$1 = ({ x: x1, y: y1, width: w1, height: h1 }, { x: x2, y: y2, width: w2, height: h2 }) => {
    if (x2 > (x1 + w1) || y2 > (y1 + h1)) {
        return false;
    }
    if (x1 > (x2 + w2) || y1 > (y2 + h2)) {
        return false;
    }
    return true;
};

/**
 * INTERSECTION
 */
const intersectionSat = (shapeA, shapeB) => {
    const normalsA = shapeA.getNormals();
    const normalsB = shapeB.getNormals();
    const projectionA = new Interval();
    const projectionB = new Interval();
    for (const normal of normalsA) {
        shapeA.project(normal, projectionA);
        shapeB.project(normal, projectionB);
        if (!projectionA.overlaps(projectionB)) {
            return false;
        }
    }
    for (const normal of normalsB) {
        shapeA.project(normal, projectionA);
        shapeB.project(normal, projectionB);
        if (!projectionA.overlaps(projectionB)) {
            return false;
        }
    }
    return true;
};
const intersectionPointPoint = (pointA, pointB, threshold = 0) => (intersectionPointPoint$1(pointA, pointB, threshold));
const intersectionPointLine = (point, line, threshold = 0.1) => (intersectionPointLineSegment(point, line.fromPosition, line.toPosition, threshold));
const intersectionPointRect = (point, rectangle) => (intersectionPointRect$1(point, rectangle));
const intersectionPointCircle = (point, circle) => (intersectionPointCircle$1(point, circle));
const intersectionPointEllipse = (point, ellipse) => (intersectionPointEllipse$1(point, ellipse));
const intersectionPointPoly = (point, polygon) => (intersectionPointPoly$1(point, polygon));
const intersectionLineRect = (line, rectangle) => {
    const { x, y, width, height } = rectangle;
    const topLeft = { x, y };
    const topRight = { x: x + width, y };
    const bottomLeft = { x, y: y + height };
    const bottomRight = { x: x + width, y: y + height };
    return intersectionLineLineSegments(line.fromPosition, line.toPosition, topLeft, bottomLeft)
        || intersectionLineLineSegments(line.fromPosition, line.toPosition, topRight, bottomRight)
        || intersectionLineLineSegments(line.fromPosition, line.toPosition, topLeft, topRight)
        || intersectionLineLineSegments(line.fromPosition, line.toPosition, bottomLeft, bottomRight);
};
const intersectionRectRect = (rectA, rectB) => (intersectionRectRect$1(rectA, rectB));
const intersectionRectCircle = ({ x: rx, y: ry, width, height }, { x: cx, y: cy, radius }) => {
    const distX = clamp(cx, rx, rx + width);
    const distY = clamp(cy, ry, ry + height);
    return getDistance(cx, cy, distX, distY) <= radius;
};
const intersectionRectEllipse = (rectangle, ellipse) => (polygonsIntersect(buildRectanglePoints(rectangle), buildEllipsePoints(ellipse)));
const intersectionRectPoly = (rectangle, polygon) => intersectionSat(rectangle, polygon);
/**
 * COLLISION DETECTION
 */
const getCollisionRectangleRectangle = (rectA, rectB) => {
    if ((rectB.left > rectA.right) || (rectB.top > rectA.bottom)) {
        return null;
    }
    if ((rectA.left > rectB.right) || (rectA.top > rectB.bottom)) {
        return null;
    }
    const zeroNormal = rectA.position.clone().set(0, 0);
    const zeroVector = rectA.position.clone().set(0, 0);
    return {
        shapeA: rectA,
        shapeB: rectB,
        overlap: 0, // todo
        shapeAinB: rectB.containsRect(rectA),
        shapeBinA: rectA.containsRect(rectB),
        projectionN: zeroNormal,
        projectionV: zeroVector,
    };
};
const getCollisionCircleRectangle = (circle, rect, swap = false) => {
    const radius = circle.radius;
    const centerWidth = rect.width / 2;
    const centerHeight = rect.height / 2;
    const distance = getDistance(circle.x, circle.y, rect.x - centerWidth, rect.y - centerHeight);
    const containsA = (radius <= Math.min(centerWidth, centerHeight)) && (distance <= (Math.min(centerWidth, centerHeight) - radius));
    const containsB = (Math.max(centerWidth, centerHeight) <= radius) && (distance <= (radius - Math.max(centerWidth, centerHeight)));
    if (distance > circle.radius) {
        return null;
    }
    const zeroNormal = circle.position.clone().set(0, 0);
    const zeroVector = circle.position.clone().set(0, 0);
    return {
        shapeA: swap ? rect : circle,
        shapeB: swap ? circle : rect,
        overlap: radius - distance,
        shapeAinB: swap ? containsB : containsA,
        shapeBinA: swap ? containsA : containsB,
        projectionN: zeroNormal,
        projectionV: zeroVector,
    };
};
const getCollisionSat = (shapeA, shapeB) => {
    const normalsA = shapeA.getNormals();
    const normalsB = shapeB.getNormals();
    const projection = (normalsA[0] || normalsB[0]).clone();
    const projA = new Interval();
    const projB = new Interval();
    let overlap = Infinity;
    let shapeAinB = true;
    let shapeBinA = true;
    let containsA = false;
    let containsB = false;
    let distance = 0;
    for (const normal of normalsA) {
        shapeA.project(normal, projA);
        shapeB.project(normal, projB);
        if (!projA.overlaps(projB)) {
            projection.destroy();
            return null;
        }
        distance = projA.getOverlap(projB);
        containsA = projB.containsInterval(projA);
        containsB = projA.containsInterval(projB);
        if (!containsA && shapeAinB) {
            shapeAinB = false;
        }
        if (!containsB && shapeBinA) {
            shapeBinA = false;
        }
        if (containsA || containsB) {
            distance += Math.min(Math.abs(projA.min - projB.min), Math.abs(projA.max - projB.max));
        }
        if (distance < overlap) {
            overlap = distance;
            projection.copy(normal);
        }
    }
    for (const normal of normalsB) {
        shapeA.project(normal, projA);
        shapeB.project(normal, projB);
        if (!projA.overlaps(projB)) {
            projection.destroy();
            return null;
        }
        distance = projA.getOverlap(projB);
        containsA = projB.containsInterval(projA);
        containsB = projA.containsInterval(projB);
        if (!containsA && shapeAinB) {
            shapeAinB = false;
        }
        if (!containsB && shapeBinA) {
            shapeBinA = false;
        }
        if (containsA || containsB) {
            distance += Math.min(Math.abs(projA.min - projB.min), Math.abs(projA.max - projB.max));
        }
        if (distance < overlap) {
            overlap = distance;
            projection.copy(normal);
        }
    }
    const projectionV = projection.clone().multiply(overlap, overlap);
    return {
        shapeA,
        shapeB,
        overlap,
        shapeAinB,
        shapeBinA,
        projectionN: projection,
        projectionV,
    };
};

let temp$2 = null;
const noop = () => { };
const tempPoint = new ObservableVector(noop);
class Rectangle {
    constructor(x = 0, y = x, width = 0, height = width) {
        this.collisionType = 2 /* CollisionType.rectangle */;
        this._normals = null;
        this._normalsDirty = false;
        this._position = new ObservableVector(() => {
            this._normalsDirty = true;
        }, x, y);
        this._size = new Size(width, height);
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position.copy(position);
    }
    get x() {
        return this._position.x;
    }
    set x(x) {
        this._position.x = x;
        this._normalsDirty = true;
    }
    get y() {
        return this._position.y;
    }
    set y(y) {
        this._position.y = y;
        this._normalsDirty = true;
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this._size.copy(size);
        this._normalsDirty = true;
    }
    get width() {
        return this._size.width;
    }
    set width(width) {
        this._size.width = width;
        this._normalsDirty = true;
    }
    get height() {
        return this._size.height;
    }
    set height(height) {
        this._size.height = height;
        this._normalsDirty = true;
    }
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y + this.height;
    }
    setPosition(x, y) {
        this._position.set(x, y);
        this._normalsDirty = true;
        return this;
    }
    setSize(width, height) {
        this._size.set(width, height);
        this._normalsDirty = true;
        return this;
    }
    set(x, y, width, height) {
        this.setPosition(x, y);
        this.setSize(width, height);
        return this;
    }
    copy(rectangle) {
        this.position = rectangle.position;
        this.size = rectangle.size;
        return this;
    }
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
    equals({ x, y, width, height } = {}) {
        return (x === undefined || this.x === x)
            && (y === undefined || this.y === y)
            && (width === undefined || this.width === width)
            && (height === undefined || this.height === height);
    }
    getBounds() {
        return this.clone();
    }
    getNormals() {
        if (this._normalsDirty || this._normals === null) {
            this._updateNormals(this._normals || (this._normals = [
                new ObservableVector(noop),
                new ObservableVector(noop),
                new ObservableVector(noop),
                new ObservableVector(noop),
            ]));
            this._normalsDirty = false;
        }
        return this._normals;
    }
    project(axis, result = new Interval()) {
        const projection1 = axis.dot(this.left, this.top);
        const projection2 = axis.dot(this.right, this.top);
        const projection3 = axis.dot(this.right, this.bottom);
        const projection4 = axis.dot(this.left, this.bottom);
        return result.set(Math.min(projection1, projection2, projection3, projection4), Math.max(projection1, projection2, projection3, projection4));
    }
    transform(matrix, result = this) {
        const point = tempPoint.set(this.left, this.top).transform(matrix);
        let minX = point.x, maxX = point.x, minY = point.y, maxY = point.y;
        point.set(this.left, this.bottom).transform(matrix);
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
        point.set(this.right, this.top).transform(matrix);
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
        point.set(this.right, this.bottom).transform(matrix);
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
        return result.set(minX, minY, maxX - minX, maxY - minY);
    }
    contains(x, y) {
        return intersectionPointRect(tempPoint.set(x, y), this);
    }
    containsRect(rect) {
        return inRange(rect.left, this.left, this.right)
            && inRange(rect.right, this.left, this.right)
            && inRange(rect.top, this.top, this.bottom)
            && inRange(rect.bottom, this.top, this.bottom);
    }
    intersectsWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.sceneNode */:
                return target.isAlignedBox
                    ? intersectionRectRect(this, target.getBounds())
                    : intersectionSat(this, target);
            case 2 /* CollisionType.rectangle */: return intersectionRectRect(this, target);
            case 5 /* CollisionType.polygon */: return intersectionRectPoly(this, target);
            case 3 /* CollisionType.circle */: return intersectionRectCircle(this, target);
            case 4 /* CollisionType.ellipse */: return intersectionRectEllipse(this, target);
            case 1 /* CollisionType.line */: return intersectionLineRect(target, this);
            case 0 /* CollisionType.point */: return intersectionPointRect(target, this);
            default: return false;
        }
    }
    collidesWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.sceneNode */:
                return target.isAlignedBox
                    ? getCollisionRectangleRectangle(this, target.getBounds())
                    : getCollisionSat(this, target);
            case 2 /* CollisionType.rectangle */: return getCollisionRectangleRectangle(this, target);
            case 5 /* CollisionType.polygon */: return getCollisionSat(this, target);
            case 3 /* CollisionType.circle */: return getCollisionCircleRectangle(target, this, true);
            // case CollisionType.Ellipse: return intersectionRectEllipse(this, target as Ellipse);
            // case CollisionType.Line: return intersectionLineRect(target as Line, this);
            // case CollisionType.Point: return intersectionPointRect(target as Vector, this);
            default: return null;
        }
    }
    destroy() {
        this._position.destroy();
        this._size.destroy();
        if (this._normals) {
            this._normals = null;
        }
    }
    _updateNormals(normals) {
        normals[0].set(this.right - this.left, 0).rperp().normalize();
        normals[1].set(0, this.bottom - this.top).rperp().normalize();
        normals[2].set(this.left - this.right, 0).rperp().normalize();
        normals[3].set(0, this.top - this.bottom).rperp().normalize();
    }
    static get temp() {
        if (temp$2 === null) {
            temp$2 = new Rectangle();
        }
        return temp$2;
    }
}

let temp$1 = null;
/**
 * | a | b | x |
 * | c | d | y |
 * | e | f | z |
 */
class Matrix {
    constructor(a = 1, b = 0, x = 0, c = 0, d = 1, y = 0, e = 0, f = 0, z = 1) {
        this._array = null;
        this.a = a;
        this.b = b;
        this.x = x;
        this.c = c;
        this.d = d;
        this.y = y;
        this.e = e;
        this.f = f;
        this.z = z;
    }
    set(a = this.a, b = this.b, x = this.x, c = this.c, d = this.d, y = this.y, e = this.e, f = this.f, z = this.z) {
        this.a = a;
        this.b = b;
        this.x = x;
        this.c = c;
        this.d = d;
        this.y = y;
        this.e = e;
        this.f = f;
        this.z = z;
        return this;
    }
    copy(matrix) {
        this.a = matrix.a;
        this.b = matrix.b;
        this.x = matrix.x;
        this.c = matrix.c;
        this.d = matrix.d;
        this.y = matrix.y;
        this.e = matrix.e;
        this.f = matrix.f;
        this.z = matrix.z;
        return this;
    }
    clone() {
        return new Matrix(this.a, this.b, this.x, this.c, this.d, this.y, this.e, this.f, this.z);
    }
    equals({ a, b, x, c, d, y, e, f, z } = {}) {
        return (a === undefined || this.a === a)
            && (b === undefined || this.b === b)
            && (x === undefined || this.x === x)
            && (c === undefined || this.c === c)
            && (d === undefined || this.d === d)
            && (y === undefined || this.y === y)
            && (e === undefined || this.e === e)
            && (f === undefined || this.f === f)
            && (z === undefined || this.z === z);
    }
    combine(matrix) {
        return this.set((this.a * matrix.a) + (this.c * matrix.b) + (this.e * matrix.x), (this.b * matrix.a) + (this.d * matrix.b) + (this.f * matrix.x), (this.x * matrix.a) + (this.y * matrix.b) + (this.z * matrix.x), (this.a * matrix.c) + (this.c * matrix.d) + (this.e * matrix.y), (this.b * matrix.c) + (this.d * matrix.d) + (this.f * matrix.y), (this.x * matrix.c) + (this.y * matrix.d) + (this.z * matrix.y), (this.a * matrix.e) + (this.c * matrix.f) + (this.e * matrix.z), (this.b * matrix.e) + (this.d * matrix.f) + (this.f * matrix.z), (this.x * matrix.e) + (this.y * matrix.f) + (this.z * matrix.z));
    }
    getInverse(result = this) {
        const determinant = (this.a * (this.z * this.d - this.y * this.f)) -
            (this.b * (this.z * this.c - this.y * this.e)) +
            (this.x * (this.f * this.c - this.d * this.e));
        if (determinant === 0) {
            return result.copy(Matrix.identity);
        }
        return result.set(((this.z * this.d) - (this.y * this.f)) / determinant, ((this.z * this.c) - (this.y * this.e)) / -determinant, ((this.f * this.c) - (this.d * this.e)) / determinant, ((this.z * this.b) - (this.x * this.f)) / -determinant, ((this.z * this.a) - (this.x * this.e)) / determinant, ((this.f * this.a) - (this.b * this.e)) / -determinant, ((this.y * this.b) - (this.x * this.d)) / determinant, ((this.y * this.a) - (this.x * this.c)) / -determinant, ((this.d * this.a) - (this.b * this.c)) / determinant);
    }
    translate(x, y = x) {
        return this.combine(Matrix.temp.set(1, 0, x, 0, 1, y, 0, 0, 1));
    }
    rotate(angle, centerX = 0, centerY = centerX) {
        const radian = degreesToRadians(angle);
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        return this.combine(Matrix.temp.set(cos, -sin, (centerX * (1 - cos)) + (centerY * sin), sin, cos, (centerY * (1 - cos)) - (centerX * sin), 0, 0, 1));
    }
    scale(scaleX, scaleY = scaleX, centerX = 0, centerY = centerX) {
        return this.combine(Matrix.temp.set(scaleX, 0, (centerX * (1 - scaleX)), 0, scaleY, (centerY * (1 - scaleY)), 0, 0, 1));
    }
    toArray(transpose = false) {
        const array = this._array || (this._array = new Float32Array(9));
        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = this.x;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = this.y;
            array[6] = this.e;
            array[7] = this.f;
            array[8] = this.z;
        }
        else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.e;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.f;
            array[6] = this.x;
            array[7] = this.y;
            array[8] = this.z;
        }
        return array;
    }
    destroy() {
        if (this._array) {
            this._array = null;
        }
    }
    static get temp() {
        if (temp$1 === null) {
            temp$1 = new Matrix();
        }
        return temp$1;
    }
}
Matrix.identity = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);

class ObservableSize extends Size {
    constructor(callback, width = 0, height = 0) {
        super(width, height);
        this._callback = callback;
    }
    get width() {
        return this._width;
    }
    set width(width) {
        if (this._width !== width) {
            this._width = width;
            this._callback();
        }
    }
    get height() {
        return this._height;
    }
    set height(height) {
        if (this._height !== height) {
            this._height = height;
            this._callback();
        }
    }
    set(width = this._width, height = this._height) {
        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;
            this._callback();
        }
        return this;
    }
    add(x, y = x) {
        return this.set(this._width + x, this._height + y);
    }
    subtract(x, y = x) {
        return this.set(this._width - x, this._height - y);
    }
    scale(x, y = x) {
        return this.set(this._width * x, this._height * y);
    }
    divide(x, y = x) {
        return this.set(this._width / x, this._height / y);
    }
    copy(size) {
        return this.set(size.width, size.height);
    }
    clone() {
        return new ObservableSize(this._callback, this._width, this._height);
    }
}

class Bounds {
    constructor() {
        this._minX = Infinity;
        this._minY = Infinity;
        this._maxX = -Infinity;
        this._maxY = -Infinity;
        this._dirty = true;
        this._rect = new Rectangle();
    }
    get minX() {
        return this._minX;
    }
    get minY() {
        return this._minY;
    }
    get maxX() {
        return this._maxX;
    }
    get maxY() {
        return this._maxY;
    }
    addCoords(x, y) {
        this._minX = Math.min(this._minX, x);
        this._minY = Math.min(this._minY, y);
        this._maxX = Math.max(this._maxX, x);
        this._maxY = Math.max(this._maxY, y);
        this._dirty = true;
        return this;
    }
    addRect(rectangle, transform) {
        if (transform) {
            rectangle = rectangle.transform(transform, Rectangle.temp);
        }
        return this
            .addCoords(rectangle.left, rectangle.top)
            .addCoords(rectangle.right, rectangle.bottom);
    }
    getRect() {
        if (this._dirty) {
            this._rect.set(this._minX, this._minY, this._maxX - this._minX, this._maxY - this._minY);
            this._dirty = false;
        }
        return this._rect;
    }
    reset() {
        this._minX = Infinity;
        this._minY = Infinity;
        this._maxX = -Infinity;
        this._maxY = -Infinity;
        this._dirty = true;
        return this;
    }
    destroy() {
        this._rect.destroy();
    }
}

class Flags {
    get value() {
        return this._value;
    }
    constructor(...flags) {
        this._value = 0;
        if (flags.length) {
            this.push(...flags);
        }
    }
    push(...flags) {
        for (const flag of flags) {
            this._value |= flag;
        }
        return this;
    }
    pop(flag) {
        const active = this.has(flag);
        this.remove(flag);
        return active;
    }
    remove(...flags) {
        for (const flag of flags) {
            this._value &= ~flag;
        }
        return this;
    }
    has(...flags) {
        return flags.some(flag => (this._value & flag) !== 0);
    }
    clear() {
        this._value = 0;
        return this;
    }
    destroy() {
        this.clear();
    }
}

var ViewFlags;
(function (ViewFlags) {
    ViewFlags[ViewFlags["None"] = 0] = "None";
    ViewFlags[ViewFlags["Translation"] = 1] = "Translation";
    ViewFlags[ViewFlags["Rotation"] = 2] = "Rotation";
    ViewFlags[ViewFlags["Scaling"] = 4] = "Scaling";
    ViewFlags[ViewFlags["Origin"] = 8] = "Origin";
    ViewFlags[ViewFlags["Transform"] = 15] = "Transform";
    ViewFlags[ViewFlags["TransformInverse"] = 16] = "TransformInverse";
    ViewFlags[ViewFlags["BoundingBox"] = 32] = "BoundingBox";
    ViewFlags[ViewFlags["TextureCoords"] = 64] = "TextureCoords";
    ViewFlags[ViewFlags["VertexTint"] = 128] = "VertexTint";
})(ViewFlags || (ViewFlags = {}));
class View {
    constructor(centerX, centerY, width, height) {
        this._viewport = new Rectangle(0, 0, 1, 1);
        this._transform = new Matrix();
        this._inverseTransform = new Matrix();
        this._bounds = new Bounds();
        this._flags = new Flags();
        this._rotation = 0;
        this._sin = 0;
        this._cos = 1;
        this._updateId = 0;
        this._center = new ObservableVector(this._setPositionDirty.bind(this), centerX, centerY);
        this._size = new ObservableSize(this._setScalingDirty.bind(this), width, height);
        this._flags.push(ViewFlags.Transform, ViewFlags.TransformInverse, ViewFlags.BoundingBox);
    }
    get center() {
        return this._center;
    }
    set center(center) {
        this._center.copy(center);
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this._size.copy(size);
    }
    get width() {
        return this._size.width;
    }
    set width(width) {
        this._size.width = width;
    }
    get height() {
        return this._size.height;
    }
    set height(height) {
        this._size.height = height;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this.setRotation(rotation);
    }
    get viewport() {
        return this._viewport;
    }
    set viewport(viewport) {
        if (!this._viewport.equals(viewport)) {
            this._viewport.copy(viewport);
            this._setDirty();
        }
    }
    get updateId() {
        return this._updateId;
    }
    setCenter(x, y) {
        this._center.set(x, y);
        return this;
    }
    resize(width, height) {
        this._size.set(width, height);
        return this;
    }
    setRotation(degrees) {
        const rotation = trimRotation(degrees);
        if (this._rotation !== rotation) {
            this._rotation = rotation;
            this._setRotationDirty();
        }
        return this;
    }
    move(x, y) {
        this.setCenter(this._center.x + x, this._center.y + y);
        return this;
    }
    zoom(factor) {
        this.resize(this._size.width * factor, this._size.height * factor);
        return this;
    }
    rotate(degrees) {
        this.setRotation(this._rotation + degrees);
        return this;
    }
    reset(centerX, centerY, width, height) {
        this._size.set(width, height);
        this._center.set(centerX, centerY);
        this._viewport.set(0, 0, 1, 1);
        this._rotation = 0;
        this._sin = 0;
        this._cos = 1;
        this._flags.push(ViewFlags.Transform);
        return this;
    }
    getTransform() {
        if (this._flags.has(ViewFlags.Transform)) {
            this.updateTransform();
            this._flags.remove(ViewFlags.Transform);
        }
        return this._transform;
    }
    updateTransform() {
        const x = 2 / this.width, y = -2 / this.height;
        if (this._flags.has(ViewFlags.Rotation)) {
            const radians = degreesToRadians(this._rotation);
            this._cos = Math.cos(radians);
            this._sin = Math.sin(radians);
        }
        if (this._flags.has(ViewFlags.Rotation | ViewFlags.Scaling)) {
            this._transform.a = x * this._cos;
            this._transform.b = x * this._sin;
            this._transform.c = -y * this._sin;
            this._transform.d = y * this._cos;
        }
        this._transform.x = (x * -this._transform.a) - (y * this._transform.b) + (-x * this._center.x);
        this._transform.y = (x * -this._transform.c) - (y * this._transform.d) + (-y * this._center.y);
        return this;
    }
    getInverseTransform() {
        if (this._flags.has(ViewFlags.TransformInverse)) {
            this.getTransform()
                .getInverse(this._inverseTransform);
            this._flags.remove(ViewFlags.TransformInverse);
        }
        return this._inverseTransform;
    }
    getBounds() {
        if (this._flags.has(ViewFlags.BoundingBox)) {
            this.updateBounds();
            this._flags.remove(ViewFlags.BoundingBox);
        }
        return this._bounds.getRect();
    }
    updateBounds() {
        const offsetX = this.width / 2;
        const offsetY = this.height / 2;
        this._bounds.reset()
            .addCoords(this._center.x - offsetX, this._center.y - offsetY)
            .addCoords(this._center.x + offsetX, this._center.y + offsetY);
        return this;
    }
    destroy() {
        this._center.destroy();
        this._size.destroy();
        this._viewport.destroy();
        this._transform.destroy();
        this._inverseTransform.destroy();
        this._bounds.destroy();
        this._flags.destroy();
    }
    _setDirty() {
        this._flags.push(ViewFlags.TransformInverse, ViewFlags.BoundingBox);
        this._updateId++;
    }
    _setPositionDirty() {
        this._flags.push(ViewFlags.Translation);
        this._setDirty();
    }
    _setRotationDirty() {
        this._flags.push(ViewFlags.Rotation);
        this._setDirty();
    }
    _setScalingDirty() {
        this._flags.push(ViewFlags.Scaling);
        this._setDirty();
    }
}

let temp = null;
class Vector extends AbstractVector {
    constructor(x = 0, y = 0) {
        super();
        this.collisionType = 0 /* CollisionType.point */;
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    copy(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }
    intersectsWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.sceneNode */: return intersectionPointRect(this, target.getBounds());
            case 2 /* CollisionType.rectangle */: return intersectionPointRect(this, target);
            case 5 /* CollisionType.polygon */: return intersectionPointPoly(this, target);
            case 3 /* CollisionType.circle */: return intersectionPointCircle(this, target);
            case 4 /* CollisionType.ellipse */: return intersectionPointEllipse(this, target);
            case 1 /* CollisionType.line */: return intersectionPointLine(this, target);
            case 0 /* CollisionType.point */: return intersectionPointPoint(this, target);
            default: return false;
        }
    }
    collidesWith(target) {
        return null;
    }
    getBounds() {
        return Rectangle.temp.set(this.x, this.y, 0, 0);
    }
    contains(x, y) {
        return intersectionPointPoint(Vector.temp.set(x, y), this);
    }
    getNormals() {
        return [
            this.clone().rperp().normalize()
        ];
    }
    project(axis, interval = new Interval()) {
        return interval;
    }
    destroy() {
        // todo - check if destroy is needed
    }
    static get temp() {
        if (temp === null) {
            temp = new Vector();
        }
        return temp;
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static multiply(v1, v2) {
        return new Vector(v1.x * v2.x, v1.y * v2.y);
    }
    static divide(v1, v2) {
        return new Vector(v1.x / v2.x, v1.y / v2.y);
    }
}
Vector.zero = new Vector(0, 0);
Vector.one = new Vector(1, 1);

class RenderTarget {
    constructor(width, height, root = false) {
        this._destroyListeners = new Set();
        this._version = 0;
        this._viewport = new Rectangle();
        this._size = new Size(width, height);
        this._root = root;
        this._defaultView = new View(width / 2, height / 2, width, height);
        this._view = this._defaultView;
    }
    get view() {
        return this._view;
    }
    set view(view) {
        this.setView(view);
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this.resize(size.width, size.height);
    }
    get width() {
        return this._size.width;
    }
    set width(width) {
        this.resize(width, this.height);
    }
    get height() {
        return this._size.height;
    }
    set height(height) {
        this.resize(this.width, height);
    }
    get root() {
        return this._root;
    }
    get version() {
        return this._version;
    }
    addDestroyListener(listener) {
        this._destroyListeners.add(listener);
        return this;
    }
    removeDestroyListener(listener) {
        this._destroyListeners.delete(listener);
        return this;
    }
    setView(view) {
        const nextView = view || this._defaultView;
        if (this._view !== nextView) {
            this._view = nextView;
            this._touch();
        }
        return this;
    }
    resize(width, height) {
        if (!this._size.equals({ width, height })) {
            this._size.set(width, height);
            this._touch();
        }
        return this;
    }
    getViewport(view = this._view) {
        const { x, y, width, height } = view.viewport;
        return this._viewport.set(Math.round(x * this.width), Math.round(y * this.height), Math.round(width * this.width), Math.round(height * this.height));
    }
    updateViewport() {
        this._touch();
        return this;
    }
    mapPixelToCoords(point, view = this._view) {
        const viewport = this.getViewport(view);
        const normalized = new Vector(-1 + (2 * (point.x - viewport.left) / viewport.width), 1 - (2 * (point.y - viewport.top) / viewport.height));
        return normalized.transform(view.getInverseTransform());
    }
    mapCoordsToPixel(point, view = this._view) {
        const viewport = this.getViewport(view);
        const normalized = point.clone().transform(view.getTransform());
        return normalized.set((((normalized.x + 1) / 2 * viewport.width) + viewport.left) | 0, (((-normalized.y + 1) / 2 * viewport.height) + viewport.top) | 0);
    }
    destroy() {
        for (const listener of Array.from(this._destroyListeners)) {
            listener();
        }
        this._destroyListeners.clear();
        if (this._view !== this._defaultView) {
            this._view.destroy();
        }
        this._defaultView.destroy();
        this._viewport.destroy();
        this._size.destroy();
    }
    _touch() {
        this._version++;
    }
}

/// <reference types="@webgpu/types" />
const primitiveShaderSource = `
struct TransformUniforms {
    matrix: mat4x4<f32>,
};

@group(0) @binding(0)
var<uniform> uniforms: TransformUniforms;

struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) color: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    output.position = uniforms.matrix * vec4<f32>(input.position, 0.0, 1.0);
    output.color = vec4<f32>(input.color.rgb * input.color.a, input.color.a);

    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    return input.color;
}
`;
const vertexStrideBytes$1 = 12;
const transformByteLength = 64;
class WebGpuPrimitiveRenderer {
    constructor() {
        this._combinedTransform = new Matrix();
        this._drawCalls = [];
        this._pipelines = new Map();
        this._renderManager = null;
        this._device = null;
        this._shaderModule = null;
        this._bindGroupLayout = null;
        this._pipelineLayout = null;
        this._uniformBuffer = null;
        this._bindGroup = null;
        this._vertexBuffer = null;
        this._indexBuffer = null;
        this._vertexBufferCapacity = 0;
        this._indexBufferCapacity = 0;
        this._vertexData = new ArrayBuffer(0);
        this._float32View = new Float32Array(this._vertexData);
        this._uint32View = new Uint32Array(this._vertexData);
    }
    connect(renderManager) {
        if (!this._renderManager) {
            const webGpuRenderManager = renderManager;
            this._renderManager = webGpuRenderManager;
            this._device = webGpuRenderManager.device;
            this._shaderModule = this._device.createShaderModule({ code: primitiveShaderSource });
            this._bindGroupLayout = this._device.createBindGroupLayout({
                entries: [{
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {
                            type: 'uniform',
                        },
                    }],
            });
            this._pipelineLayout = this._device.createPipelineLayout({
                bindGroupLayouts: [this._bindGroupLayout],
            });
            this._uniformBuffer = this._device.createBuffer({
                size: transformByteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this._bindGroup = this._device.createBindGroup({
                layout: this._bindGroupLayout,
                entries: [{
                        binding: 0,
                        resource: {
                            buffer: this._uniformBuffer,
                        },
                    }],
            });
        }
        return this;
    }
    disconnect() {
        this.unbind();
        this._destroyBuffers();
        this._destroyPipelines();
        this._uniformBuffer?.destroy();
        this._uniformBuffer = null;
        this._bindGroup = null;
        this._bindGroupLayout = null;
        this._pipelineLayout = null;
        this._shaderModule = null;
        this._device = null;
        this._renderManager = null;
        return this;
    }
    bind() {
        if (!this._renderManager || !this._device || !this._bindGroup || !this._pipelineLayout || !this._shaderModule) {
            throw new Error('Renderer has to be connected first!');
        }
        return this;
    }
    unbind() {
        this.flush();
        this._drawCalls.length = 0;
        return this;
    }
    render(drawable) {
        const renderManager = this._renderManager;
        if (!renderManager) {
            throw new Error('Renderer has to be connected first!');
        }
        const shape = drawable;
        if (shape.drawMode !== RenderingPrimitives.Points
            && shape.drawMode !== RenderingPrimitives.Lines
            && shape.drawMode !== RenderingPrimitives.LineStrip
            && shape.drawMode !== RenderingPrimitives.Triangles
            && shape.drawMode !== RenderingPrimitives.TriangleStrip) {
            throw new Error(`WebGPU primitive renderer does not support draw mode "${shape.drawMode}" yet.`);
        }
        renderManager.setBlendMode(shape.blendMode);
        if (shape.geometry.vertices.length === 0) {
            return this;
        }
        this._drawCalls.push({
            vertices: shape.geometry.vertices,
            indices: shape.geometry.indices,
            color: shape.color.toRgba(),
            drawMode: shape.drawMode,
            blendMode: shape.blendMode,
            transform: this._createTransformData(renderManager, shape),
        });
        return this;
    }
    flush() {
        const renderManager = this._renderManager;
        const device = this._device;
        const bindGroup = this._bindGroup;
        const uniformBuffer = this._uniformBuffer;
        if (!renderManager || !device || !bindGroup || !uniformBuffer) {
            return this;
        }
        if (this._drawCalls.length === 0 && !renderManager.clearRequested) {
            return this;
        }
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [renderManager.createColorAttachment()],
        });
        for (const drawCall of this._drawCalls) {
            const vertexCount = drawCall.vertices.length / 2;
            const indexCount = drawCall.indices.length;
            const pipeline = this._getPipeline({
                drawMode: drawCall.drawMode,
                blendMode: drawCall.blendMode,
                format: renderManager.renderTargetFormat,
            });
            this._ensureVertexCapacity(vertexCount);
            this._writeVertexData(drawCall.vertices, drawCall.color);
            device.queue.writeBuffer(this._vertexBuffer, 0, this._vertexData, 0, vertexCount * vertexStrideBytes$1);
            device.queue.writeBuffer(uniformBuffer, 0, drawCall.transform.buffer, drawCall.transform.byteOffset, drawCall.transform.byteLength);
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.setVertexBuffer(0, this._vertexBuffer);
            if (indexCount > 0) {
                this._ensureIndexCapacity(indexCount);
                device.queue.writeBuffer(this._indexBuffer, 0, drawCall.indices.buffer, drawCall.indices.byteOffset, drawCall.indices.byteLength);
                pass.setIndexBuffer(this._indexBuffer, 'uint16');
                pass.drawIndexed(indexCount);
            }
            else {
                pass.draw(vertexCount);
            }
        }
        pass.end();
        renderManager.submit(encoder.finish());
        this._drawCalls.length = 0;
        return this;
    }
    destroy() {
        this.disconnect();
        this._combinedTransform.destroy();
    }
    _createTransformData(renderManager, shape) {
        const matrix = this._combinedTransform
            .copy(renderManager.view.getTransform())
            .combine(shape.getGlobalTransform());
        return new Float32Array([
            matrix.a, matrix.c, 0, 0,
            matrix.b, matrix.d, 0, 0,
            0, 0, 1, 0,
            matrix.x, matrix.y, 0, matrix.z,
        ]);
    }
    _writeVertexData(vertices, color) {
        const vertexCount = vertices.length / 2;
        for (let i = 0; i < vertexCount; i++) {
            const sourceIndex = i * 2;
            const targetIndex = i * 3;
            this._float32View[targetIndex] = vertices[sourceIndex];
            this._float32View[targetIndex + 1] = vertices[sourceIndex + 1];
            this._uint32View[targetIndex + 2] = color;
        }
    }
    _ensureVertexCapacity(vertexCount) {
        const requiredBytes = vertexCount * vertexStrideBytes$1;
        if (requiredBytes > this._vertexData.byteLength) {
            const byteLength = Math.max(requiredBytes, this._vertexData.byteLength === 0 ? vertexStrideBytes$1 : this._vertexData.byteLength * 2);
            this._vertexData = new ArrayBuffer(byteLength);
            this._float32View = new Float32Array(this._vertexData);
            this._uint32View = new Uint32Array(this._vertexData);
        }
        if (requiredBytes > this._vertexBufferCapacity) {
            this._vertexBuffer?.destroy();
            this._vertexBufferCapacity = Math.max(requiredBytes, this._vertexBufferCapacity === 0 ? vertexStrideBytes$1 : this._vertexBufferCapacity * 2);
            this._vertexBuffer = this._device.createBuffer({
                size: this._vertexBufferCapacity,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
        }
    }
    _ensureIndexCapacity(indexCount) {
        const requiredBytes = indexCount * Uint16Array.BYTES_PER_ELEMENT;
        if (requiredBytes > this._indexBufferCapacity) {
            this._indexBuffer?.destroy();
            this._indexBufferCapacity = Math.max(requiredBytes, this._indexBufferCapacity === 0 ? Uint16Array.BYTES_PER_ELEMENT : this._indexBufferCapacity * 2);
            this._indexBuffer = this._device.createBuffer({
                size: this._indexBufferCapacity,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            });
        }
    }
    _getPipeline(key) {
        const pipelineKey = `${key.drawMode}:${key.blendMode}:${key.format}`;
        const existingPipeline = this._pipelines.get(pipelineKey);
        if (existingPipeline) {
            return existingPipeline;
        }
        const topology = this._getTopology(key.drawMode);
        const pipeline = this._device.createRenderPipeline({
            layout: this._pipelineLayout,
            vertex: {
                module: this._shaderModule,
                entryPoint: 'vertexMain',
                buffers: [{
                        arrayStride: vertexStrideBytes$1,
                        attributes: [{
                                shaderLocation: 0,
                                offset: 0,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 1,
                                offset: 8,
                                format: 'unorm8x4',
                            }],
                    }],
            },
            fragment: {
                module: this._shaderModule,
                entryPoint: 'fragmentMain',
                targets: [{
                        format: key.format,
                        blend: this._getBlendState(key.blendMode),
                        writeMask: GPUColorWrite.ALL,
                    }],
            },
            primitive: {
                topology,
                stripIndexFormat: (key.drawMode === RenderingPrimitives.TriangleStrip
                    || key.drawMode === RenderingPrimitives.LineStrip) ? 'uint16' : undefined,
            },
        });
        this._pipelines.set(pipelineKey, pipeline);
        return pipeline;
    }
    _getBlendState(blendMode) {
        switch (blendMode) {
            case BlendModes.Additive:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one',
                    },
                };
            case BlendModes.Subtract:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'zero',
                        dstFactor: 'one-minus-src',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'zero',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            case BlendModes.Multiply:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'dst',
                        dstFactor: 'one-minus-src-alpha',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'dst-alpha',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            case BlendModes.Screen:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            default:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
        }
    }
    _getTopology(drawMode) {
        switch (drawMode) {
            case RenderingPrimitives.Points:
                return 'point-list';
            case RenderingPrimitives.Lines:
                return 'line-list';
            case RenderingPrimitives.LineStrip:
                return 'line-strip';
            case RenderingPrimitives.Triangles:
                return 'triangle-list';
            case RenderingPrimitives.TriangleStrip:
                return 'triangle-strip';
            default:
                throw new Error(`WebGPU primitive renderer does not support draw mode "${drawMode}" yet.`);
        }
    }
    _destroyBuffers() {
        this._vertexBuffer?.destroy();
        this._indexBuffer?.destroy();
        this._vertexBuffer = null;
        this._indexBuffer = null;
        this._vertexBufferCapacity = 0;
        this._indexBufferCapacity = 0;
    }
    _destroyPipelines() {
        this._pipelines.clear();
    }
}

const createCanvas = (options = {}) => {
    const { canvas, fillStyle, width, height } = options;
    const newCanvas = canvas ?? document.createElement('canvas');
    const context = newCanvas.getContext('2d');
    newCanvas.width = width ?? 10;
    newCanvas.height = height ?? 10;
    context.fillStyle = fillStyle ?? '#6495ed';
    context.fillRect(0, 0, newCanvas.width, newCanvas.height);
    return newCanvas;
};

const getCanvasSourceSize = (source) => {
    const dynamicSource = source;
    if (source instanceof HTMLImageElement) {
        return Size.temp.set(source.naturalWidth, source.naturalHeight);
    }
    if (source instanceof HTMLVideoElement) {
        return Size.temp.set(source.videoWidth, source.videoHeight);
    }
    if (source instanceof SVGElement) {
        return Size.temp.copy(source.getBoundingClientRect());
    }
    if (typeof dynamicSource.displayWidth === 'number' && typeof dynamicSource.displayHeight === 'number') {
        return Size.temp.set(dynamicSource.displayWidth, dynamicSource.displayHeight);
    }
    if (typeof dynamicSource.width === 'number' && typeof dynamicSource.height === 'number') {
        return Size.temp.set(dynamicSource.width, dynamicSource.height);
    }
    return Size.zero;
};
const getTextureSourceSize = (source) => {
    if (source === null) {
        return Size.zero;
    }
    return getCanvasSourceSize(source);
};

class Texture {
    static get black() {
        if (Texture._black === null) {
            Texture._black = new Texture(createCanvas({ fillStyle: '#000' }));
        }
        return Texture._black;
    }
    static get white() {
        if (Texture._white === null) {
            Texture._white = new Texture(createCanvas({ fillStyle: '#fff' }));
        }
        return Texture._white;
    }
    constructor(source = null, options) {
        this._version = 0;
        this._source = null;
        this._size = new Size(0, 0);
        this._destroyListeners = new Set();
        this._premultiplyAlpha = false;
        this._generateMipMap = false;
        this._flipY = false;
        const { scaleMode, wrapMode, premultiplyAlpha, generateMipMap, flipY } = { ...Texture.defaultSamplerOptions, ...options };
        this._scaleMode = scaleMode;
        this._wrapMode = wrapMode;
        this._premultiplyAlpha = premultiplyAlpha;
        this._generateMipMap = generateMipMap;
        this._flipY = flipY;
        if (source !== null) {
            this.setSource(source);
        }
    }
    get source() {
        return this._source;
    }
    set source(source) {
        this.setSource(source);
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this.setSize(size.width, size.height);
    }
    get width() {
        return this._size.width;
    }
    set width(width) {
        this.setSize(width, this.height);
    }
    get height() {
        return this._size.height;
    }
    set height(height) {
        this.setSize(this.width, height);
    }
    get scaleMode() {
        return this._scaleMode;
    }
    set scaleMode(scaleMode) {
        this.setScaleMode(scaleMode);
    }
    get wrapMode() {
        return this._wrapMode;
    }
    set wrapMode(wrapMode) {
        this.setWrapMode(wrapMode);
    }
    get premultiplyAlpha() {
        return this._premultiplyAlpha;
    }
    set premultiplyAlpha(premultiplyAlpha) {
        this.setPremultiplyAlpha(premultiplyAlpha);
    }
    get generateMipMap() {
        return this._generateMipMap;
    }
    set generateMipMap(generateMipMap) {
        this._generateMipMap = generateMipMap;
    }
    get flipY() {
        return this._flipY;
    }
    set flipY(flipY) {
        this._flipY = flipY;
    }
    get powerOfTwo() {
        return isPowerOfTwo(this.width) && isPowerOfTwo(this.height);
    }
    get version() {
        return this._version;
    }
    addDestroyListener(listener) {
        this._destroyListeners.add(listener);
        return this;
    }
    removeDestroyListener(listener) {
        this._destroyListeners.delete(listener);
        return this;
    }
    setScaleMode(scaleMode) {
        if (this._scaleMode !== scaleMode) {
            this._scaleMode = scaleMode;
            this._touch();
        }
        return this;
    }
    setWrapMode(wrapMode) {
        if (this._wrapMode !== wrapMode) {
            this._wrapMode = wrapMode;
            this._touch();
        }
        return this;
    }
    setPremultiplyAlpha(premultiplyAlpha) {
        if (this._premultiplyAlpha !== premultiplyAlpha) {
            this._premultiplyAlpha = premultiplyAlpha;
            this._touch();
        }
        return this;
    }
    setSource(source) {
        if (this._source !== source) {
            this._source = source;
            this.updateSource();
        }
        return this;
    }
    updateSource() {
        const { width, height } = getTextureSourceSize(this._source);
        this.setSize(width, height);
        this._touch();
        return this;
    }
    setSize(width, height) {
        if (!this._size.equals({ width, height })) {
            this._size.set(width, height);
            this._touch();
        }
        return this;
    }
    destroy() {
        for (const listener of Array.from(this._destroyListeners)) {
            listener();
        }
        this._destroyListeners.clear();
        this._size.destroy();
        this._source = null;
    }
    _touch() {
        this._version++;
    }
}
Texture._black = null;
Texture._white = null;
Texture.defaultSamplerOptions = {
    scaleMode: ScaleModes.Linear,
    wrapMode: WrapModes.ClampToEdge,
    premultiplyAlpha: true,
    generateMipMap: true,
    flipY: false,
};
Texture.empty = new Texture(null);

class RenderTexture extends RenderTarget {
    constructor(width, height, options) {
        super(width, height, false);
        this._source = null;
        this._textureVersion = 0;
        const { scaleMode, wrapMode, premultiplyAlpha, generateMipMap, flipY } = { ...RenderTexture.defaultSamplerOptions, ...options };
        this._scaleMode = scaleMode;
        this._wrapMode = wrapMode;
        this._premultiplyAlpha = premultiplyAlpha;
        this._generateMipMap = generateMipMap;
        this._flipY = flipY;
        this._touchTexture();
    }
    get source() {
        return this._source;
    }
    set source(source) {
        this.setSource(source);
    }
    get scaleMode() {
        return this._scaleMode;
    }
    set scaleMode(scaleMode) {
        this.setScaleMode(scaleMode);
    }
    get wrapMode() {
        return this._wrapMode;
    }
    set wrapMode(wrapMode) {
        this.setWrapMode(wrapMode);
    }
    get premultiplyAlpha() {
        return this._premultiplyAlpha;
    }
    set premultiplyAlpha(premultiplyAlpha) {
        this.setPremultiplyAlpha(premultiplyAlpha);
    }
    get generateMipMap() {
        return this._generateMipMap;
    }
    set generateMipMap(generateMipMap) {
        this._generateMipMap = generateMipMap;
    }
    get flipY() {
        return this._flipY;
    }
    set flipY(flipY) {
        this._flipY = flipY;
    }
    get powerOfTwo() {
        return isPowerOfTwo(this.width) && isPowerOfTwo(this.height);
    }
    get textureVersion() {
        return this._textureVersion;
    }
    setScaleMode(scaleMode) {
        if (this._scaleMode !== scaleMode) {
            this._scaleMode = scaleMode;
            this._touchTexture();
        }
        return this;
    }
    setWrapMode(wrapMode) {
        if (this._wrapMode !== wrapMode) {
            this._wrapMode = wrapMode;
            this._touchTexture();
        }
        return this;
    }
    setPremultiplyAlpha(premultiplyAlpha) {
        if (this._premultiplyAlpha !== premultiplyAlpha) {
            this._premultiplyAlpha = premultiplyAlpha;
            this._touchTexture();
        }
        return this;
    }
    setSource(source) {
        if (this._source !== source) {
            this._source = source;
            this.updateSource();
        }
        return this;
    }
    updateSource() {
        this._touchTexture();
        return this;
    }
    setSize(width, height) {
        if (!this._size.equals({ width, height })) {
            this._size.set(width, height);
            this._defaultView.resize(width, height);
            this.updateViewport();
            this._touchTexture();
        }
        return this;
    }
    destroy() {
        super.destroy();
        this._source = null;
    }
    _touchTexture() {
        this._textureVersion++;
    }
}
RenderTexture.defaultSamplerOptions = {
    scaleMode: ScaleModes.Linear,
    wrapMode: WrapModes.ClampToEdge,
    premultiplyAlpha: true,
    generateMipMap: false,
    flipY: true,
};

/// <reference types="@webgpu/types" />
const spriteShaderSource = `
struct ProjectionUniforms {
    matrix: mat4x4<f32>,
};

@group(0) @binding(0)
var<uniform> projection: ProjectionUniforms;

@group(1) @binding(0)
var spriteTexture: texture_2d<f32>;
@group(1) @binding(1)
var spriteSampler: sampler;

struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) texcoord: vec2<f32>,
    @location(2) color: vec4<f32>,
    @location(3) premultiplySample: u32,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texcoord: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) @interpolate(flat) premultiplySample: u32,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    output.position = projection.matrix * vec4<f32>(input.position, 0.0, 1.0);
    output.texcoord = input.texcoord;
    output.color = vec4(input.color.rgb * input.color.a, input.color.a);
    output.premultiplySample = input.premultiplySample;

    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    let sample = textureSample(spriteTexture, spriteSampler, input.texcoord);
    let resolvedSample = select(sample, vec4(sample.rgb * sample.a, sample.a), input.premultiplySample == 1u);

    return resolvedSample * input.color;
}
`;
const vertexStrideBytes = 24;
const spriteVertexCount = 4;
const spriteIndexCount = 6;
const projectionByteLength = 64;
const initialBatchCapacity = 32;
const wordsPerVertex = 6;
class WebGpuSpriteRenderer {
    constructor() {
        this._drawCalls = [];
        this._projectionData = new Float32Array(projectionByteLength / Float32Array.BYTES_PER_ELEMENT);
        this._renderManager = null;
        this._device = null;
        this._shaderModule = null;
        this._uniformBindGroupLayout = null;
        this._textureBindGroupLayout = null;
        this._pipelineLayout = null;
        this._uniformBuffer = null;
        this._uniformBindGroup = null;
        this._vertexBuffer = null;
        this._indexBuffer = null;
        this._vertexCapacity = 0;
        this._vertexData = new ArrayBuffer(0);
        this._float32View = new Float32Array(this._vertexData);
        this._uint32View = new Uint32Array(this._vertexData);
        this._pipelines = new Map();
    }
    connect(renderManager) {
        if (!this._renderManager) {
            const webGpuRenderManager = renderManager;
            this._renderManager = webGpuRenderManager;
            this._device = webGpuRenderManager.device;
            this._shaderModule = this._device.createShaderModule({ code: spriteShaderSource });
            this._uniformBindGroupLayout = this._device.createBindGroupLayout({
                entries: [{
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {
                            type: 'uniform',
                        },
                    }],
            });
            this._textureBindGroupLayout = this._device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.FRAGMENT,
                        texture: {
                            sampleType: 'float',
                        },
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.FRAGMENT,
                        sampler: {
                            type: 'filtering',
                        },
                    }
                ],
            });
            this._pipelineLayout = this._device.createPipelineLayout({
                bindGroupLayouts: [this._uniformBindGroupLayout, this._textureBindGroupLayout],
            });
            this._uniformBuffer = this._device.createBuffer({
                size: projectionByteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this._uniformBindGroup = this._device.createBindGroup({
                layout: this._uniformBindGroupLayout,
                entries: [{
                        binding: 0,
                        resource: {
                            buffer: this._uniformBuffer,
                        },
                    }],
            });
            this._ensureBatchCapacity(initialBatchCapacity);
        }
        return this;
    }
    disconnect() {
        this.unbind();
        this._vertexBuffer?.destroy();
        this._indexBuffer?.destroy();
        this._uniformBuffer?.destroy();
        this._pipelines.clear();
        this._vertexBuffer = null;
        this._indexBuffer = null;
        this._uniformBindGroup = null;
        this._uniformBuffer = null;
        this._pipelineLayout = null;
        this._textureBindGroupLayout = null;
        this._uniformBindGroupLayout = null;
        this._shaderModule = null;
        this._device = null;
        this._renderManager = null;
        this._vertexCapacity = 0;
        this._vertexData = new ArrayBuffer(0);
        this._float32View = new Float32Array(this._vertexData);
        this._uint32View = new Uint32Array(this._vertexData);
        return this;
    }
    bind() {
        if (!this._renderManager || !this._device || !this._uniformBindGroup || !this._vertexBuffer || !this._indexBuffer) {
            throw new Error('Renderer has to be connected first!');
        }
        return this;
    }
    unbind() {
        this.flush();
        this._drawCalls.length = 0;
        return this;
    }
    render(drawable) {
        const renderManager = this._renderManager;
        if (!renderManager) {
            throw new Error('Renderer has to be connected first!');
        }
        const sprite = drawable;
        const texture = sprite.texture;
        if ((!(texture instanceof Texture) && !(texture instanceof RenderTexture))
            || texture.width === 0
            || texture.height === 0
            || (texture instanceof Texture && texture.source === null)) {
            return this;
        }
        renderManager.setBlendMode(sprite.blendMode);
        this._drawCalls.push({
            texture,
            vertices: new Float32Array(sprite.vertices),
            texCoords: new Uint32Array(sprite.texCoords),
            color: sprite.tint.toRgba(),
            blendMode: sprite.blendMode,
        });
        return this;
    }
    flush() {
        const renderManager = this._renderManager;
        const device = this._device;
        const uniformBuffer = this._uniformBuffer;
        const uniformBindGroup = this._uniformBindGroup;
        const vertexBuffer = this._vertexBuffer;
        const indexBuffer = this._indexBuffer;
        if (!renderManager || !device || !uniformBuffer || !uniformBindGroup || !vertexBuffer || !indexBuffer) {
            return this;
        }
        if (this._drawCalls.length === 0 && !renderManager.clearRequested) {
            return this;
        }
        const viewMatrix = renderManager.view.getTransform();
        this._projectionData.set([
            viewMatrix.a, viewMatrix.c, 0, 0,
            viewMatrix.b, viewMatrix.d, 0, 0,
            0, 0, 1, 0,
            viewMatrix.x, viewMatrix.y, 0, viewMatrix.z,
        ]);
        device.queue.writeBuffer(uniformBuffer, 0, this._projectionData.buffer, this._projectionData.byteOffset, this._projectionData.byteLength);
        if (this._drawCalls.length > 0) {
            this._ensureBatchCapacity(this._drawCalls.length);
            this._writeVertexData(this._drawCalls);
            device.queue.writeBuffer(this._vertexBuffer, 0, this._vertexData, 0, this._drawCalls.length * spriteVertexCount * vertexStrideBytes);
        }
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [renderManager.createColorAttachment()],
        });
        if (this._drawCalls.length > 0) {
            pass.setBindGroup(0, uniformBindGroup);
            pass.setVertexBuffer(0, this._vertexBuffer);
            pass.setIndexBuffer(this._indexBuffer, 'uint32');
            for (let start = 0; start < this._drawCalls.length;) {
                const batch = this._getBatchRange(start);
                const pipeline = this._getPipeline(this._drawCalls[start].blendMode, renderManager.renderTargetFormat);
                const textureBinding = renderManager.getTextureBinding(batch.texture);
                const textureBindGroup = device.createBindGroup({
                    layout: this._textureBindGroupLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: textureBinding.view,
                        },
                        {
                            binding: 1,
                            resource: textureBinding.sampler,
                        }
                    ],
                });
                pass.setPipeline(pipeline);
                pass.setBindGroup(1, textureBindGroup);
                pass.drawIndexed(batch.spriteCount * spriteIndexCount, 1, start * spriteIndexCount, 0, 0);
                start = batch.end;
            }
        }
        pass.end();
        renderManager.submit(encoder.finish());
        this._drawCalls.length = 0;
        return this;
    }
    destroy() {
        this.disconnect();
    }
    _ensureBatchCapacity(spriteCount) {
        if (!this._device || spriteCount <= this._vertexCapacity) {
            return;
        }
        let nextCapacity = Math.max(this._vertexCapacity, initialBatchCapacity);
        while (nextCapacity < spriteCount) {
            nextCapacity *= 2;
        }
        const vertexData = new ArrayBuffer(nextCapacity * spriteVertexCount * vertexStrideBytes);
        const vertexBuffer = this._device.createBuffer({
            size: vertexData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        const indexData = new Uint32Array(nextCapacity * spriteIndexCount);
        const indexBuffer = this._device.createBuffer({
            size: indexData.byteLength * Uint32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        });
        for (let spriteIndex = 0; spriteIndex < nextCapacity; spriteIndex++) {
            const baseVertex = spriteIndex * spriteVertexCount;
            const targetIndex = spriteIndex * spriteIndexCount;
            indexData[targetIndex] = baseVertex;
            indexData[targetIndex + 1] = baseVertex + 1;
            indexData[targetIndex + 2] = baseVertex + 2;
            indexData[targetIndex + 3] = baseVertex;
            indexData[targetIndex + 4] = baseVertex + 2;
            indexData[targetIndex + 5] = baseVertex + 3;
        }
        this._device.queue.writeBuffer(indexBuffer, 0, indexData.buffer, indexData.byteOffset, indexData.byteLength);
        this._vertexBuffer?.destroy();
        this._indexBuffer?.destroy();
        this._vertexCapacity = nextCapacity;
        this._vertexData = vertexData;
        this._float32View = new Float32Array(vertexData);
        this._uint32View = new Uint32Array(vertexData);
        this._vertexBuffer = vertexBuffer;
        this._indexBuffer = indexBuffer;
    }
    _writeVertexData(drawCalls) {
        let vertexOffset = 0;
        for (const drawCall of drawCalls) {
            for (let i = 0; i < spriteVertexCount; i++) {
                const vertexIndex = i * 2;
                const packedTexCoord = drawCall.texCoords[i];
                this._float32View[vertexOffset] = drawCall.vertices[vertexIndex];
                this._float32View[vertexOffset + 1] = drawCall.vertices[vertexIndex + 1];
                this._float32View[vertexOffset + 2] = (packedTexCoord & 0xFFFF) / 65535;
                this._float32View[vertexOffset + 3] = ((packedTexCoord >>> 16) & 0xFFFF) / 65535;
                this._uint32View[vertexOffset + 4] = drawCall.color;
                this._uint32View[vertexOffset + 5] = this._renderManager.shouldPremultiplyTextureSample(drawCall.texture) ? 1 : 0;
                vertexOffset += wordsPerVertex;
            }
        }
    }
    _getBatchRange(start) {
        const drawCall = this._drawCalls[start];
        let end = start + 1;
        while (end < this._drawCalls.length) {
            const nextDrawCall = this._drawCalls[end];
            if (nextDrawCall.blendMode !== drawCall.blendMode) {
                break;
            }
            if (nextDrawCall.texture !== drawCall.texture) {
                break;
            }
            end++;
        }
        return {
            end,
            spriteCount: end - start,
            texture: drawCall.texture,
        };
    }
    _getPipeline(blendMode, format) {
        const pipelineKey = `${blendMode}:${format}`;
        const existingPipeline = this._pipelines.get(pipelineKey);
        if (existingPipeline) {
            return existingPipeline;
        }
        if (!this._device || !this._shaderModule || !this._pipelineLayout || !this._renderManager) {
            throw new Error('Renderer has to be connected first!');
        }
        const pipeline = this._device.createRenderPipeline({
            layout: this._pipelineLayout,
            vertex: {
                module: this._shaderModule,
                entryPoint: 'vertexMain',
                buffers: [{
                        arrayStride: vertexStrideBytes,
                        attributes: [{
                                shaderLocation: 0,
                                offset: 0,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 1,
                                offset: 8,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 2,
                                offset: 16,
                                format: 'unorm8x4',
                            }, {
                                shaderLocation: 3,
                                offset: 20,
                                format: 'uint32',
                            }],
                    }],
            },
            fragment: {
                module: this._shaderModule,
                entryPoint: 'fragmentMain',
                targets: [{
                        format,
                        blend: this._getBlendState(blendMode),
                        writeMask: GPUColorWrite.ALL,
                    }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
        this._pipelines.set(pipelineKey, pipeline);
        return pipeline;
    }
    _getBlendState(blendMode) {
        switch (blendMode) {
            case BlendModes.Additive:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one',
                    },
                };
            case BlendModes.Subtract:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'zero',
                        dstFactor: 'one-minus-src',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'zero',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            case BlendModes.Multiply:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'dst',
                        dstFactor: 'one-minus-src-alpha',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'dst-alpha',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            case BlendModes.Screen:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            default:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
        }
    }
}

/// <reference types="@webgpu/types" />
const particleShaderSource = `
struct ProjectionUniforms {
    projection: mat4x4<f32>,
    translation: mat4x4<f32>,
    flags: vec4<f32>,
};

@group(0) @binding(0)
var<uniform> uniforms: ProjectionUniforms;

@group(1) @binding(0)
var particleTexture: texture_2d<f32>;

@group(1) @binding(1)
var particleSampler: sampler;

struct VertexInput {
    @location(0) unitPosition: vec2<f32>,
    @location(1) quadMin: vec2<f32>,
    @location(2) quadSize: vec2<f32>,
    @location(3) uvMin: vec2<f32>,
    @location(4) uvMax: vec2<f32>,
    @location(5) translation: vec2<f32>,
    @location(6) scale: vec2<f32>,
    @location(7) rotation: f32,
    @location(8) color: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texcoord: vec2<f32>,
    @location(1) color: vec4<f32>,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    let localPosition = input.quadMin + (input.unitPosition * input.quadSize);
    let radians = radians(input.rotation);
    let sinValue = sin(radians);
    let cosValue = cos(radians);
    let rotated = vec2<f32>(
        (localPosition.x * (input.scale.x * cosValue)) + (localPosition.y * (input.scale.y * sinValue)) + input.translation.x,
        (localPosition.x * (input.scale.x * -sinValue)) + (localPosition.y * (input.scale.y * cosValue)) + input.translation.y
    );

    var output: VertexOutput;

    output.position = uniforms.projection * uniforms.translation * vec4<f32>(rotated, 0.0, 1.0);
    output.texcoord = input.uvMin + ((input.uvMax - input.uvMin) * input.unitPosition);
    output.color = vec4(input.color.rgb * input.color.a, input.color.a);

    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    let sample = textureSample(particleTexture, particleSampler, input.texcoord);
    let premultipliedSample = select(sample, vec4(sample.rgb * sample.a, sample.a), uniforms.flags.x > 0.5);

    return premultipliedSample * input.color;
}
`;
const staticVertexStrideBytes = 8;
const instanceWords = 14;
const instanceStrideBytes = 56;
const indicesPerParticle = 6;
const uniformByteLength = 144;
const initialParticleCapacity = 1;
const staticVertexData = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1,
]);
const staticIndexData = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
]);
class WebGpuParticleRenderer {
    constructor() {
        this._drawCalls = [];
        this._uniformData = new Float32Array(uniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this._renderManager = null;
        this._device = null;
        this._shaderModule = null;
        this._uniformBindGroupLayout = null;
        this._textureBindGroupLayout = null;
        this._pipelineLayout = null;
        this._uniformBuffer = null;
        this._uniformBindGroup = null;
        this._staticVertexBuffer = null;
        this._instanceBuffer = null;
        this._indexBuffer = null;
        this._instanceBufferByteLength = 0;
        this._instanceData = new ArrayBuffer(instanceStrideBytes * initialParticleCapacity);
        this._float32View = new Float32Array(this._instanceData);
        this._uint32View = new Uint32Array(this._instanceData);
        this._pipelines = new Map();
    }
    connect(renderManager) {
        if (!this._renderManager) {
            const webGpuRenderManager = renderManager;
            this._renderManager = webGpuRenderManager;
            this._device = webGpuRenderManager.device;
            this._shaderModule = this._device.createShaderModule({ code: particleShaderSource });
            this._uniformBindGroupLayout = this._device.createBindGroupLayout({
                entries: [{
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                        buffer: {
                            type: 'uniform',
                        },
                    }],
            });
            this._textureBindGroupLayout = this._device.createBindGroupLayout({
                entries: [{
                        binding: 0,
                        visibility: GPUShaderStage.FRAGMENT,
                        texture: {
                            sampleType: 'float',
                        },
                    }, {
                        binding: 1,
                        visibility: GPUShaderStage.FRAGMENT,
                        sampler: {
                            type: 'filtering',
                        },
                    }],
            });
            this._pipelineLayout = this._device.createPipelineLayout({
                bindGroupLayouts: [this._uniformBindGroupLayout, this._textureBindGroupLayout],
            });
            this._uniformBuffer = this._device.createBuffer({
                size: uniformByteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this._uniformBindGroup = this._device.createBindGroup({
                layout: this._uniformBindGroupLayout,
                entries: [{
                        binding: 0,
                        resource: {
                            buffer: this._uniformBuffer,
                        },
                    }],
            });
            this._staticVertexBuffer = this._device.createBuffer({
                size: staticVertexData.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            this._device.queue.writeBuffer(this._staticVertexBuffer, 0, staticVertexData.buffer, staticVertexData.byteOffset, staticVertexData.byteLength);
            this._indexBuffer = this._device.createBuffer({
                size: staticIndexData.byteLength,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            });
            this._device.queue.writeBuffer(this._indexBuffer, 0, staticIndexData.buffer, staticIndexData.byteOffset, staticIndexData.byteLength);
            this._ensureCapacity(initialParticleCapacity);
        }
        return this;
    }
    disconnect() {
        this.unbind();
        this._staticVertexBuffer?.destroy();
        this._instanceBuffer?.destroy();
        this._indexBuffer?.destroy();
        this._uniformBuffer?.destroy();
        this._pipelines.clear();
        this._indexBuffer = null;
        this._staticVertexBuffer = null;
        this._instanceBuffer = null;
        this._uniformBindGroup = null;
        this._uniformBuffer = null;
        this._pipelineLayout = null;
        this._textureBindGroupLayout = null;
        this._uniformBindGroupLayout = null;
        this._shaderModule = null;
        this._device = null;
        this._renderManager = null;
        this._instanceBufferByteLength = 0;
        this._instanceData = new ArrayBuffer(instanceStrideBytes * initialParticleCapacity);
        this._float32View = new Float32Array(this._instanceData);
        this._uint32View = new Uint32Array(this._instanceData);
        return this;
    }
    bind() {
        if (!this._renderManager || !this._device || !this._uniformBindGroup || !this._staticVertexBuffer || !this._instanceBuffer || !this._indexBuffer) {
            throw new Error('Renderer has to be connected first!');
        }
        return this;
    }
    unbind() {
        this.flush();
        this._drawCalls.length = 0;
        return this;
    }
    render(drawable) {
        const renderManager = this._renderManager;
        if (!renderManager) {
            throw new Error('Renderer has to be connected first!');
        }
        const system = drawable;
        const texture = system.texture;
        if (!(texture instanceof Texture) || texture.source === null || texture.width === 0 || texture.height === 0 || system.particles.length === 0) {
            return this;
        }
        renderManager.setBlendMode(system.blendMode);
        this._drawCalls.push({
            texture,
            vertices: new Float32Array(system.vertices),
            texCoords: new Uint32Array(system.texCoords),
            particles: system.particles.slice(),
            transform: new Float32Array(system.getGlobalTransform().toArray(false)),
            blendMode: system.blendMode,
        });
        return this.flush();
    }
    flush() {
        const renderManager = this._renderManager;
        const device = this._device;
        const uniformBuffer = this._uniformBuffer;
        const uniformBindGroup = this._uniformBindGroup;
        const staticVertexBuffer = this._staticVertexBuffer;
        const indexBuffer = this._indexBuffer;
        if (!renderManager || !device || !uniformBuffer || !uniformBindGroup || !staticVertexBuffer || !this._instanceBuffer || !indexBuffer) {
            return this;
        }
        if (this._drawCalls.length === 0 && !renderManager.clearRequested) {
            return this;
        }
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [renderManager.createColorAttachment()],
        });
        pass.setBindGroup(0, uniformBindGroup);
        for (const drawCall of this._drawCalls) {
            const pipeline = this._getPipeline(drawCall.blendMode, renderManager.renderTargetFormat);
            const textureBinding = renderManager.getTextureBinding(drawCall.texture);
            const textureBindGroup = device.createBindGroup({
                layout: this._textureBindGroupLayout,
                entries: [{
                        binding: 0,
                        resource: textureBinding.view,
                    }, {
                        binding: 1,
                        resource: textureBinding.sampler,
                    }],
            });
            const particleCount = drawCall.particles.length;
            this._ensureCapacity(particleCount);
            this._writeInstanceData(drawCall);
            this._writeUniformData(renderManager, drawCall.transform, drawCall.texture);
            device.queue.writeBuffer(this._instanceBuffer, 0, this._instanceData, 0, particleCount * instanceStrideBytes);
            device.queue.writeBuffer(uniformBuffer, 0, this._uniformData.buffer, this._uniformData.byteOffset, this._uniformData.byteLength);
            pass.setPipeline(pipeline);
            pass.setBindGroup(1, textureBindGroup);
            pass.setVertexBuffer(0, staticVertexBuffer);
            pass.setVertexBuffer(1, this._instanceBuffer);
            pass.setIndexBuffer(indexBuffer, 'uint16');
            pass.drawIndexed(indicesPerParticle, particleCount, 0, 0, 0);
        }
        pass.end();
        renderManager.submit(encoder.finish());
        this._drawCalls.length = 0;
        return this;
    }
    destroy() {
        this.disconnect();
    }
    _ensureCapacity(particleCount) {
        const requiredInstanceBytes = particleCount * instanceStrideBytes;
        if (requiredInstanceBytes > this._instanceData.byteLength) {
            let byteLength = this._instanceData.byteLength;
            while (byteLength < requiredInstanceBytes) {
                byteLength *= 2;
            }
            this._instanceData = new ArrayBuffer(byteLength);
            this._float32View = new Float32Array(this._instanceData);
            this._uint32View = new Uint32Array(this._instanceData);
        }
        if (requiredInstanceBytes > this._instanceBufferByteLength) {
            let byteLength = this._instanceBufferByteLength || instanceStrideBytes;
            while (byteLength < requiredInstanceBytes) {
                byteLength *= 2;
            }
            this._instanceBuffer?.destroy();
            this._instanceBuffer = this._device.createBuffer({
                size: byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            this._instanceBufferByteLength = byteLength;
        }
    }
    _writeUniformData(renderManager, transform, texture) {
        const projection = renderManager.view.getTransform().toArray(false);
        const shouldPremultiplySample = renderManager.shouldPremultiplyTextureSample(texture);
        this._uniformData.set([
            projection[0], projection[1], 0, 0,
            projection[3], projection[4], 0, 0,
            0, 0, 1, 0,
            projection[6], projection[7], 0, projection[8],
            transform[0], transform[1], 0, 0,
            transform[3], transform[4], 0, 0,
            0, 0, 1, 0,
            transform[6], transform[7], 0, transform[8],
            shouldPremultiplySample ? 1 : 0, 0, 0, 0,
        ]);
    }
    _writeInstanceData(drawCall) {
        const { vertices, texCoords, particles } = drawCall;
        const quadMinX = vertices[0];
        const quadMinY = vertices[1];
        const quadSizeX = vertices[2] - vertices[0];
        const quadSizeY = vertices[3] - vertices[1];
        const uvMinX = (texCoords[0] & 0xFFFF) / 65535;
        const uvMinY = ((texCoords[0] >>> 16) & 0xFFFF) / 65535;
        const uvMaxX = (texCoords[2] & 0xFFFF) / 65535;
        const uvMaxY = ((texCoords[2] >>> 16) & 0xFFFF) / 65535;
        for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            const particle = particles[particleIndex];
            const targetIndex = particleIndex * instanceWords;
            this._float32View[targetIndex] = quadMinX;
            this._float32View[targetIndex + 1] = quadMinY;
            this._float32View[targetIndex + 2] = quadSizeX;
            this._float32View[targetIndex + 3] = quadSizeY;
            this._float32View[targetIndex + 4] = uvMinX;
            this._float32View[targetIndex + 5] = uvMinY;
            this._float32View[targetIndex + 6] = uvMaxX;
            this._float32View[targetIndex + 7] = uvMaxY;
            this._float32View[targetIndex + 8] = particle.position.x;
            this._float32View[targetIndex + 9] = particle.position.y;
            this._float32View[targetIndex + 10] = particle.scale.x;
            this._float32View[targetIndex + 11] = particle.scale.y;
            this._float32View[targetIndex + 12] = particle.rotation;
            this._uint32View[targetIndex + 13] = particle.tint.toRgba();
        }
    }
    _getPipeline(blendMode, format) {
        const pipelineKey = `${blendMode}:${format}`;
        const existingPipeline = this._pipelines.get(pipelineKey);
        if (existingPipeline) {
            return existingPipeline;
        }
        if (!this._device || !this._shaderModule || !this._pipelineLayout || !this._renderManager) {
            throw new Error('Renderer has to be connected first!');
        }
        const pipeline = this._device.createRenderPipeline({
            layout: this._pipelineLayout,
            vertex: {
                module: this._shaderModule,
                entryPoint: 'vertexMain',
                buffers: [{
                        arrayStride: staticVertexStrideBytes,
                        attributes: [{
                                shaderLocation: 0,
                                offset: 0,
                                format: 'float32x2',
                            }],
                    }, {
                        arrayStride: instanceStrideBytes,
                        stepMode: 'instance',
                        attributes: [{
                                shaderLocation: 1,
                                offset: 0,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 2,
                                offset: 8,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 3,
                                offset: 16,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 4,
                                offset: 24,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 5,
                                offset: 32,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 6,
                                offset: 40,
                                format: 'float32x2',
                            }, {
                                shaderLocation: 7,
                                offset: 48,
                                format: 'float32',
                            }, {
                                shaderLocation: 8,
                                offset: 52,
                                format: 'unorm8x4',
                            }],
                    }],
            },
            fragment: {
                module: this._shaderModule,
                entryPoint: 'fragmentMain',
                targets: [{
                        format,
                        blend: this._getBlendState(blendMode),
                        writeMask: GPUColorWrite.ALL,
                    }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
        this._pipelines.set(pipelineKey, pipeline);
        return pipeline;
    }
    _getBlendState(blendMode) {
        switch (blendMode) {
            case BlendModes.Additive:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one',
                    },
                };
            case BlendModes.Subtract:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'zero',
                        dstFactor: 'one-minus-src',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'zero',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            case BlendModes.Multiply:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'dst',
                        dstFactor: 'one-minus-src-alpha',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'dst-alpha',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            case BlendModes.Screen:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
            default:
                return {
                    color: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                    alpha: {
                        operation: 'add',
                        srcFactor: 'one',
                        dstFactor: 'one-minus-src-alpha',
                    },
                };
        }
    }
}

/// <reference types="@webgpu/types" />
const managedTextureFormat = 'rgba8unorm';
class WebGpuRenderManager {
    constructor(app) {
        this._clearColor = new Color();
        this._renderers = new Map();
        this._textureStates = new Map();
        this._textureDestroyHandlers = new Map();
        this._renderTargetDestroyHandlers = new Map();
        this._mipmapShaderModule = null;
        this._mipmapBindGroupLayout = null;
        this._mipmapPipelineLayout = null;
        this._mipmapPipeline = null;
        this._mipmapSampler = null;
        this._context = null;
        this._device = null;
        this._format = null;
        this._initializePromise = null;
        this._renderer = null;
        this._blendMode = null;
        this._texture = null;
        this._clearRequested = false;
        this._hasPresentedFrame = false;
        const { width, height, clearColor, } = app.options;
        this._canvas = app.canvas;
        this._rootRenderTarget = new RenderTarget(width, height, true);
        this._renderTarget = this._rootRenderTarget;
        if (clearColor) {
            this._clearColor.copy(clearColor);
        }
        this.addRenderer(RendererType.Primitive, new WebGpuPrimitiveRenderer());
        this.addRenderer(RendererType.Sprite, new WebGpuSpriteRenderer());
        this.addRenderer(RendererType.Particle, new WebGpuParticleRenderer());
        this.resize(width, height);
    }
    get view() {
        return this._renderTarget.view;
    }
    get renderTarget() {
        return this._renderTarget;
    }
    get device() {
        if (this._device === null) {
            throw new Error('WebGPU device is not initialized yet.');
        }
        return this._device;
    }
    get context() {
        if (this._context === null) {
            throw new Error('WebGPU canvas context is not initialized yet.');
        }
        return this._context;
    }
    get format() {
        if (this._format === null) {
            throw new Error('WebGPU canvas format is not initialized yet.');
        }
        return this._format;
    }
    get renderTargetFormat() {
        return this._renderTarget === this._rootRenderTarget ? this.format : managedTextureFormat;
    }
    get clearRequested() {
        return this._clearRequested;
    }
    initialize() {
        if (!this._initializePromise) {
            this._initializePromise = this._initialize();
        }
        return this._initializePromise;
    }
    getRenderer(_name) {
        const renderer = this._renderers.get(_name);
        if (!renderer) {
            throw new Error(`WebGPU renderer "${_name}" is not implemented yet.`);
        }
        return renderer;
    }
    setRenderer(renderer) {
        if (this._renderer !== renderer) {
            if (this._renderer) {
                this._renderer.unbind();
                this._renderer = null;
            }
            if (renderer) {
                renderer.connect(this);
                renderer.bind();
            }
            this._renderer = renderer;
        }
        return this;
    }
    setShader(shader) {
        if (shader !== null) {
            throw new Error('WebGPU shaders are not implemented yet.');
        }
        return this;
    }
    setTexture(texture, _unit) {
        if (texture === null) {
            this._texture = null;
            return this;
        }
        if (texture instanceof RenderTarget && !(texture instanceof RenderTexture)) {
            throw new Error('WebGPU render textures are not implemented yet.');
        }
        this._syncTexture(texture);
        this._texture = texture;
        return this;
    }
    setBlendMode(blendMode) {
        if (blendMode === null) {
            this._blendMode = null;
            return this;
        }
        if (blendMode !== BlendModes.Normal
            && blendMode !== BlendModes.Additive
            && blendMode !== BlendModes.Subtract
            && blendMode !== BlendModes.Multiply
            && blendMode !== BlendModes.Screen) {
            throw new Error(`WebGPU blend mode "${blendMode}" is not implemented yet.`);
        }
        this._blendMode = blendMode;
        return this;
    }
    setVao(vao) {
        if (vao !== null) {
            throw new Error('WebGPU vertex array objects are not implemented yet.');
        }
        return this;
    }
    setRenderTarget(target) {
        const nextRenderTarget = target ?? this._rootRenderTarget;
        if (!nextRenderTarget.root && !(nextRenderTarget instanceof RenderTexture)) {
            throw new Error('WebGPU currently supports only root targets and RenderTexture targets.');
        }
        if (this._renderTarget !== nextRenderTarget) {
            if (this._renderer) {
                this._renderer.flush();
            }
            if (this._renderTarget !== this._rootRenderTarget) {
                this._unsubscribeRenderTarget(this._renderTarget);
            }
            this._renderTarget = nextRenderTarget;
            if (nextRenderTarget !== this._rootRenderTarget) {
                this._subscribeRenderTarget(nextRenderTarget);
            }
        }
        return this;
    }
    setView(view) {
        this._renderTarget.setView(view);
        return this;
    }
    clear(color) {
        if (color) {
            this._clearColor.copy(color);
        }
        this._clearRequested = true;
        return this;
    }
    resize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
        this._rootRenderTarget.resize(width, height);
        this._hasPresentedFrame = false;
        return this;
    }
    display() {
        if (!this._device || !this._context) {
            return this;
        }
        if (this._renderer) {
            this._renderer.flush();
        }
        else if (this._clearRequested) {
            const encoder = this._device.createCommandEncoder();
            const pass = encoder.beginRenderPass({
                colorAttachments: [this.createColorAttachment()],
            });
            pass.end();
            this.submit(encoder.finish());
        }
        return this;
    }
    destroy() {
        this.setRenderer(null);
        for (const renderer of this._renderers.values()) {
            renderer.destroy();
        }
        this._renderers.clear();
        this._destroyManagedTextures();
        for (const target of Array.from(this._renderTargetDestroyHandlers.keys())) {
            this._unsubscribeRenderTarget(target);
        }
        this._context?.unconfigure();
        this._context = null;
        this._device = null;
        this._format = null;
        this._initializePromise = null;
        this._clearRequested = false;
        this._hasPresentedFrame = false;
        this._texture = null;
        this._mipmapShaderModule = null;
        this._mipmapBindGroupLayout = null;
        this._mipmapPipelineLayout = null;
        this._mipmapPipeline = null;
        this._mipmapSampler = null;
        this._renderTarget = this._rootRenderTarget;
        this._clearColor.destroy();
        this._rootRenderTarget.destroy();
    }
    addRenderer(name, renderer) {
        if (this._renderers.has(name)) {
            throw new Error(`Renderer "${name}" was already added.`);
        }
        this._renderers.set(name, renderer);
        return this;
    }
    createColorAttachment() {
        const renderTarget = this._renderTarget;
        let attachmentState = null;
        if (renderTarget === this._rootRenderTarget) {
            attachmentState = {
                view: this.context.getCurrentTexture().createView(),
                shouldClear: this._clearRequested || !this._hasPresentedFrame,
            };
        }
        else if (renderTarget instanceof RenderTexture) {
            const state = this._syncTexture(renderTarget);
            attachmentState = {
                view: state.view,
                shouldClear: this._clearRequested || !state.hasContent,
            };
        }
        else {
            throw new Error('WebGPU currently supports only root targets and RenderTexture targets.');
        }
        this._clearRequested = false;
        return {
            view: attachmentState.view,
            clearValue: {
                r: this._clearColor.r / 255,
                g: this._clearColor.g / 255,
                b: this._clearColor.b / 255,
                a: this._clearColor.a,
            },
            loadOp: attachmentState.shouldClear ? 'clear' : 'load',
            storeOp: 'store',
        };
    }
    submit(commandBuffer) {
        this.device.queue.submit([commandBuffer]);
        if (this._renderTarget === this._rootRenderTarget) {
            this._hasPresentedFrame = true;
        }
        else if (this._renderTarget instanceof RenderTexture) {
            const state = this._syncTexture(this._renderTarget);
            state.hasContent = true;
            if (state.mipLevelCount > 1) {
                this._generateMipmaps(state.texture, state.mipLevelCount);
            }
        }
    }
    getTextureBinding(texture) {
        const state = this._syncTexture(texture);
        return {
            view: state.view,
            sampler: state.sampler,
        };
    }
    shouldPremultiplyTextureSample(texture) {
        return !(texture instanceof RenderTexture) && texture.premultiplyAlpha;
    }
    async _initialize() {
        const gpuNavigator = this._getGpuNavigator();
        if (gpuNavigator === null) {
            throw new Error('This browser does not support WebGPU.');
        }
        const context = this._canvas.getContext('webgpu');
        if (context === null) {
            throw new Error('Could not create WebGPU canvas context.');
        }
        const adapter = await gpuNavigator.gpu.requestAdapter();
        if (adapter === null) {
            throw new Error('Could not acquire a WebGPU adapter.');
        }
        const device = await adapter.requestDevice();
        const format = gpuNavigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device,
            format,
            alphaMode: 'opaque',
        });
        this._context = context;
        this._device = device;
        this._format = format;
        this._blendMode = BlendModes.Normal;
        this._hasPresentedFrame = false;
        this.resize(this._canvas.width, this._canvas.height);
        return this;
    }
    _getGpuNavigator() {
        const gpuNavigator = navigator;
        return gpuNavigator.gpu ? gpuNavigator : null;
    }
    _destroyManagedTextures() {
        for (const texture of Array.from(this._textureStates.keys())) {
            this._evictTexture(texture);
        }
    }
    _getTextureState(texture) {
        let state = this._textureStates.get(texture);
        if (!state) {
            const gpuTexture = this.device.createTexture({
                size: {
                    width: Math.max(texture.width, 1),
                    height: Math.max(texture.height, 1),
                },
                format: managedTextureFormat,
                mipLevelCount: this._getMipLevelCount(texture),
                usage: this._getTextureUsage(texture),
            });
            state = {
                texture: gpuTexture,
                view: gpuTexture.createView(),
                sampler: this._createSampler(texture),
                version: -1,
                width: texture.width,
                height: texture.height,
                mipLevelCount: this._getMipLevelCount(texture),
                hasContent: false,
            };
            const destroyHandler = () => {
                this._evictTexture(texture);
            };
            texture.addDestroyListener(destroyHandler);
            this._textureDestroyHandlers.set(texture, destroyHandler);
            this._textureStates.set(texture, state);
        }
        return state;
    }
    _syncTexture(texture) {
        if (!(texture instanceof RenderTexture) && (texture.source === null || texture.width === 0 || texture.height === 0)) {
            throw new Error('WebGPU sprite rendering requires a texture with a valid source and non-zero dimensions.');
        }
        const state = this._getTextureState(texture);
        const textureVersion = texture instanceof RenderTexture ? texture.textureVersion : texture.version;
        const mipLevelCount = this._getMipLevelCount(texture);
        if (state.version !== textureVersion) {
            if (state.width !== texture.width || state.height !== texture.height || state.mipLevelCount !== mipLevelCount) {
                state.texture.destroy();
                const resizedTexture = this.device.createTexture({
                    size: {
                        width: texture.width,
                        height: texture.height,
                    },
                    format: managedTextureFormat,
                    mipLevelCount,
                    usage: this._getTextureUsage(texture),
                });
                state.texture = resizedTexture;
                state.view = resizedTexture.createView();
                state.width = texture.width;
                state.height = texture.height;
                state.mipLevelCount = mipLevelCount;
                state.hasContent = false;
            }
            state.sampler = this._createSampler(texture);
            if (!(texture instanceof RenderTexture)) {
                const source = texture.source;
                this.device.queue.copyExternalImageToTexture({
                    source,
                    flipY: false,
                }, {
                    texture: state.texture,
                }, {
                    width: texture.width,
                    height: texture.height,
                });
                if (state.mipLevelCount > 1) {
                    this._generateMipmaps(state.texture, state.mipLevelCount);
                }
            }
            state.version = textureVersion;
        }
        return state;
    }
    _evictTexture(texture) {
        const state = this._textureStates.get(texture);
        const destroyHandler = this._textureDestroyHandlers.get(texture);
        if (destroyHandler) {
            texture.removeDestroyListener(destroyHandler);
            this._textureDestroyHandlers.delete(texture);
        }
        if (state) {
            state.texture.destroy();
            this._textureStates.delete(texture);
        }
        if (this._texture === texture) {
            this._texture = null;
        }
    }
    _subscribeRenderTarget(target) {
        if (!this._renderTargetDestroyHandlers.has(target)) {
            const destroyHandler = () => {
                if (this._renderTarget === target) {
                    this._renderTarget = this._rootRenderTarget;
                }
                this._renderTargetDestroyHandlers.delete(target);
            };
            target.addDestroyListener(destroyHandler);
            this._renderTargetDestroyHandlers.set(target, destroyHandler);
        }
    }
    _unsubscribeRenderTarget(target) {
        const destroyHandler = this._renderTargetDestroyHandlers.get(target);
        if (destroyHandler) {
            target.removeDestroyListener(destroyHandler);
            this._renderTargetDestroyHandlers.delete(target);
        }
    }
    _createSampler(texture) {
        return this.device.createSampler({
            addressModeU: this._getAddressMode(texture.wrapMode),
            addressModeV: this._getAddressMode(texture.wrapMode),
            magFilter: this._getFilterMode(texture.scaleMode),
            minFilter: this._getFilterMode(texture.scaleMode),
            mipmapFilter: this._getMipmapFilterMode(texture.scaleMode),
        });
    }
    _getTextureUsage(texture) {
        const mipmapUsage = this._getMipLevelCount(texture) > 1 ? GPUTextureUsage.RENDER_ATTACHMENT : 0;
        if (texture instanceof RenderTexture) {
            return GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | mipmapUsage;
        }
        return GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | mipmapUsage;
    }
    _getAddressMode(wrapMode) {
        switch (wrapMode) {
            case WrapModes.Repeat:
                return 'repeat';
            case WrapModes.MirroredRepeat:
                return 'mirror-repeat';
            default:
                return 'clamp-to-edge';
        }
    }
    _getFilterMode(scaleMode) {
        switch (scaleMode) {
            case ScaleModes.Nearest:
            case ScaleModes.NearestMipmapNearest:
            case ScaleModes.NearestMipmapLinear:
                return 'nearest';
            default:
                return 'linear';
        }
    }
    _getMipmapFilterMode(scaleMode) {
        switch (scaleMode) {
            case ScaleModes.NearestMipmapLinear:
            case ScaleModes.LinearMipmapLinear:
                return 'linear';
            default:
                return 'nearest';
        }
    }
    _getMipLevelCount(texture) {
        if (!texture.generateMipMap) {
            return 1;
        }
        const maxSize = Math.max(texture.width, texture.height);
        if (maxSize <= 1) {
            return 1;
        }
        return Math.floor(Math.log2(maxSize)) + 1;
    }
    _generateMipmaps(texture, mipLevelCount) {
        if (mipLevelCount <= 1) {
            return;
        }
        const resources = this._getMipmapResources();
        const encoder = this.device.createCommandEncoder();
        for (let mipLevel = 1; mipLevel < mipLevelCount; mipLevel++) {
            const bindGroup = this.device.createBindGroup({
                layout: resources.bindGroupLayout,
                entries: [{
                        binding: 0,
                        resource: texture.createView({
                            baseMipLevel: mipLevel - 1,
                            mipLevelCount: 1,
                        }),
                    }, {
                        binding: 1,
                        resource: resources.sampler,
                    }],
            });
            const pass = encoder.beginRenderPass({
                colorAttachments: [{
                        view: texture.createView({
                            baseMipLevel: mipLevel,
                            mipLevelCount: 1,
                        }),
                        clearValue: { r: 0, g: 0, b: 0, a: 0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
            });
            pass.setPipeline(resources.pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.draw(3);
            pass.end();
        }
        this.device.queue.submit([encoder.finish()]);
    }
    _getMipmapResources() {
        if (this._mipmapShaderModule === null || this._mipmapBindGroupLayout === null || this._mipmapPipelineLayout === null || this._mipmapPipeline === null || this._mipmapSampler === null) {
            this._mipmapShaderModule = this.device.createShaderModule({
                code: `
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texcoord: vec2<f32>,
};

@group(0) @binding(0)
var sourceTexture: texture_2d<f32>;
@group(0) @binding(1)
var sourceSampler: sampler;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var positions = array<vec2<f32>, 3>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(3.0, -1.0),
        vec2<f32>(-1.0, 3.0)
    );
    var texcoords = array<vec2<f32>, 3>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(2.0, 0.0),
        vec2<f32>(0.0, 2.0)
    );
    var output: VertexOutput;

    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texcoord = texcoords[vertexIndex];

    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    return textureSample(sourceTexture, sourceSampler, input.texcoord);
}
`,
            });
            this._mipmapBindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                        binding: 0,
                        visibility: GPUShaderStage.FRAGMENT,
                        texture: {
                            sampleType: 'float',
                        },
                    }, {
                        binding: 1,
                        visibility: GPUShaderStage.FRAGMENT,
                        sampler: {
                            type: 'filtering',
                        },
                    }],
            });
            this._mipmapPipelineLayout = this.device.createPipelineLayout({
                bindGroupLayouts: [this._mipmapBindGroupLayout],
            });
            this._mipmapPipeline = this.device.createRenderPipeline({
                layout: this._mipmapPipelineLayout,
                vertex: {
                    module: this._mipmapShaderModule,
                    entryPoint: 'vertexMain',
                },
                fragment: {
                    module: this._mipmapShaderModule,
                    entryPoint: 'fragmentMain',
                    targets: [{
                            format: managedTextureFormat,
                            writeMask: GPUColorWrite.ALL,
                        }],
                },
                primitive: {
                    topology: 'triangle-list',
                },
            });
            this._mipmapSampler = this.device.createSampler({
                minFilter: 'linear',
                magFilter: 'linear',
                mipmapFilter: 'nearest',
            });
        }
        return {
            bindGroupLayout: this._mipmapBindGroupLayout,
            pipeline: this._mipmapPipeline,
            sampler: this._mipmapSampler,
        };
    }
}

export { WebGpuRenderManager };
//# sourceMappingURL=webgpu.esm.js.map
