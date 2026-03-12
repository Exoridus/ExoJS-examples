class Shader {
    constructor(vertexSource, fragmentSource) {
        this.attributes = new Map();
        this.uniforms = new Map();
        this._runtime = null;
        this._vertexSource = vertexSource;
        this._fragmentSource = fragmentSource;
    }
    get vertexSource() {
        return this._vertexSource;
    }
    get fragmentSource() {
        return this._fragmentSource;
    }
    connect(runtime) {
        this._runtime = runtime;
        runtime.initialize(this);
        return this;
    }
    disconnect() {
        this._runtime = null;
        this.attributes.clear();
        this.uniforms.clear();
        return this;
    }
    bind() {
        this._runtime?.bind(this);
        return this;
    }
    unbind() {
        this._runtime?.unbind(this);
        return this;
    }
    sync() {
        this._runtime?.sync(this);
        return this;
    }
    getAttribute(name) {
        const attribute = this.attributes.get(name);
        if (!attribute) {
            throw new Error(`Attribute "${name}" is not available.`);
        }
        return attribute;
    }
    getUniform(name) {
        const uniform = this.uniforms.get(name);
        if (!uniform) {
            throw new Error(`Uniform "${name}" is not available.`);
        }
        return uniform;
    }
    destroy() {
        this._runtime?.destroy(this);
        this._runtime = null;
        this.attributes.clear();
        this.uniforms.clear();
    }
}

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

const primitiveByteSizeMapping = {
    [ShaderPrimitives.Float]: 1,
    [ShaderPrimitives.FloatVec2]: 2,
    [ShaderPrimitives.FloatVec3]: 3,
    [ShaderPrimitives.FloatVec4]: 4,
    [ShaderPrimitives.Int]: 1,
    [ShaderPrimitives.IntVec2]: 2,
    [ShaderPrimitives.IntVec3]: 3,
    [ShaderPrimitives.IntVec4]: 4,
    [ShaderPrimitives.Bool]: 1,
    [ShaderPrimitives.BoolVec2]: 2,
    [ShaderPrimitives.BoolVec3]: 3,
    [ShaderPrimitives.BoolVec4]: 4,
    [ShaderPrimitives.FloatMat2]: 4,
    [ShaderPrimitives.FloatMat3]: 9,
    [ShaderPrimitives.FloatMat4]: 16,
    [ShaderPrimitives.Sampler2D]: 1,
};
const primitiveArrayConstructors = {
    [ShaderPrimitives.Float]: Float32Array,
    [ShaderPrimitives.FloatVec2]: Float32Array,
    [ShaderPrimitives.FloatVec3]: Float32Array,
    [ShaderPrimitives.FloatVec4]: Float32Array,
    [ShaderPrimitives.Int]: Int32Array,
    [ShaderPrimitives.IntVec2]: Int32Array,
    [ShaderPrimitives.IntVec3]: Int32Array,
    [ShaderPrimitives.IntVec4]: Int32Array,
    [ShaderPrimitives.Bool]: Uint8Array,
    [ShaderPrimitives.BoolVec2]: Uint8Array,
    [ShaderPrimitives.BoolVec3]: Uint8Array,
    [ShaderPrimitives.BoolVec4]: Uint8Array,
    [ShaderPrimitives.FloatMat2]: Float32Array,
    [ShaderPrimitives.FloatMat3]: Float32Array,
    [ShaderPrimitives.FloatMat4]: Float32Array,
    [ShaderPrimitives.Sampler2D]: Uint8Array,
};
({
    [ShaderPrimitives.Float]: 'FLOAT',
    [ShaderPrimitives.FloatVec2]: 'FLOAT_VEC2',
    [ShaderPrimitives.FloatVec3]: 'FLOAT_VEC3',
    [ShaderPrimitives.FloatVec4]: 'FLOAT_VEC4',
    [ShaderPrimitives.Int]: 'INT',
    [ShaderPrimitives.IntVec2]: 'INT_VEC2',
    [ShaderPrimitives.IntVec3]: 'INT_VEC3',
    [ShaderPrimitives.IntVec4]: 'INT_VEC4',
    [ShaderPrimitives.Bool]: 'BOOL',
    [ShaderPrimitives.BoolVec2]: 'BOOL_VEC2',
    [ShaderPrimitives.BoolVec3]: 'BOOL_VEC3',
    [ShaderPrimitives.BoolVec4]: 'BOOL_VEC4',
    [ShaderPrimitives.FloatMat2]: 'FLOAT_MAT2',
    [ShaderPrimitives.FloatMat3]: 'FLOAT_MAT3',
    [ShaderPrimitives.FloatMat4]: 'FLOAT_MAT4',
    [ShaderPrimitives.Sampler2D]: 'SAMPLER_2D',
});

class ShaderAttribute {
    constructor(index, name, type) {
        this.location = -1;
        this.index = index;
        this.name = name;
        this.type = type;
        this.size = primitiveByteSizeMapping[type];
    }
    destroy() {
        // no-op — metadata only
    }
}

class ShaderUniform {
    constructor(index, type, size, name, data) {
        this._dirty = true;
        this.name = name.replace(/\[.*?]/, '');
        this.index = index;
        this.type = type;
        this.size = size;
        this._value = data;
    }
    get propName() {
        return this.name.substr(this.name.lastIndexOf('.') + 1);
    }
    get value() {
        return this._value;
    }
    get dirty() {
        return this._dirty;
    }
    setValue(value) {
        this._value.set(value);
        this._dirty = true;
        return this;
    }
    markClean() {
        this._dirty = false;
    }
    destroy() {
        // no-op — value container only
    }
}

class ShaderBlock {
    constructor(gl, program, index) {
        this._uniforms = new Map();
        this._context = gl;
        this._program = program;
        this.index = index;
        this.name = gl.getActiveUniformBlockName(program, index) || '';
        this.binding = gl.getActiveUniformBlockParameter(program, index, gl.UNIFORM_BLOCK_BINDING);
        this.dataSize = gl.getActiveUniformBlockParameter(program, index, gl.UNIFORM_BLOCK_DATA_SIZE);
        this._uniformBuffer = gl.createBuffer();
        this._blockData = new ArrayBuffer(this.dataSize);
        this._extractUniforms();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this._uniformBuffer);
        gl.bufferData(gl.UNIFORM_BUFFER, this._blockData, gl.DYNAMIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.binding, this._uniformBuffer);
        gl.uniformBlockBinding(this._program, this.index, this.binding);
    }
    getUniform(name) {
        if (!this._uniforms.has(name)) {
            throw new Error(`Uniform "${name}" is not available.`);
        }
        return this._uniforms.get(name);
    }
    upload() {
        const gl = this._context;
        gl.bindBuffer(gl.UNIFORM_BUFFER, this._uniformBuffer);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this._blockData);
    }
    destroy() {
        for (const uniform of this._uniforms.values()) {
            uniform.destroy();
        }
        this._uniforms.clear();
    }
    _extractUniforms() {
        const gl = this._context;
        const program = this._program;
        const blockData = this._blockData;
        const indices = gl.getActiveUniformBlockParameter(program, this.index, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
        const offsets = gl.getActiveUniforms(program, indices, gl.UNIFORM_OFFSET);
        const len = indices.length;
        for (let i = 0; i < len; i++) {
            const { type, size, name } = gl.getActiveUniform(program, indices[i]);
            const data = new primitiveArrayConstructors[type](blockData, offsets[i], primitiveByteSizeMapping[type] * size);
            const uniform = new ShaderUniform(indices[i], type, size, name, data);
            this._uniforms.set(uniform.propName, uniform);
        }
    }
}

const uniformUploadFunctions = {
    [ShaderPrimitives.Float]: (gl, location, value) => { gl.uniform1f(location, value[0]); },
    [ShaderPrimitives.FloatVec2]: (gl, location, value) => { gl.uniform2fv(location, value); },
    [ShaderPrimitives.FloatVec3]: (gl, location, value) => { gl.uniform3fv(location, value); },
    [ShaderPrimitives.FloatVec4]: (gl, location, value) => { gl.uniform4fv(location, value); },
    [ShaderPrimitives.Int]: (gl, location, value) => { gl.uniform1i(location, value[0]); },
    [ShaderPrimitives.IntVec2]: (gl, location, value) => { gl.uniform2iv(location, value); },
    [ShaderPrimitives.IntVec3]: (gl, location, value) => { gl.uniform3iv(location, value); },
    [ShaderPrimitives.IntVec4]: (gl, location, value) => { gl.uniform4iv(location, value); },
    [ShaderPrimitives.Bool]: (gl, location, value) => { gl.uniform1i(location, value[0]); },
    [ShaderPrimitives.BoolVec2]: (gl, location, value) => { gl.uniform2iv(location, value); },
    [ShaderPrimitives.BoolVec3]: (gl, location, value) => { gl.uniform3iv(location, value); },
    [ShaderPrimitives.BoolVec4]: (gl, location, value) => { gl.uniform4iv(location, value); },
    [ShaderPrimitives.FloatMat2]: (gl, location, value) => { gl.uniformMatrix2fv(location, false, value); },
    [ShaderPrimitives.FloatMat3]: (gl, location, value) => { gl.uniformMatrix3fv(location, false, value); },
    [ShaderPrimitives.FloatMat4]: (gl, location, value) => { gl.uniformMatrix4fv(location, false, value); },
    [ShaderPrimitives.Sampler2D]: (gl, location, value) => { gl.uniform1i(location, value[0]); },
};
function createWebGlShaderRuntime(gl) {
    let program = null;
    let vertexShader = null;
    let fragmentShader = null;
    const managedUniforms = [];
    const uniformBlocks = [];
    function initialize(shader) {
        if (program) {
            return;
        }
        vertexShader = compileShader(gl, gl.VERTEX_SHADER, shader.vertexSource);
        fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, shader.fragmentSource);
        program = linkProgram(gl, vertexShader, fragmentShader);
        extractAttributes(gl, program, shader);
        extractUniforms(gl, program, shader, managedUniforms);
        extractUniformBlocks(gl, program, uniformBlocks);
    }
    function syncUniforms() {
        for (const managed of managedUniforms) {
            if (managed.uniform.dirty) {
                managed.uploadFn(gl, managed.location, managed.uniform.value);
                managed.uniform.markClean();
            }
        }
        for (const block of uniformBlocks) {
            block.upload();
        }
    }
    return {
        initialize,
        bind: (shader) => {
            initialize(shader);
            gl.useProgram(program);
            syncUniforms();
        },
        unbind: () => {
            gl.useProgram(null);
        },
        sync: () => {
            syncUniforms();
        },
        destroy: (shader) => {
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteProgram(program);
            for (const block of uniformBlocks) {
                block.destroy();
            }
            vertexShader = null;
            fragmentShader = null;
            program = null;
            managedUniforms.length = 0;
            uniformBlocks.length = 0;
            shader.disconnect();
        },
    };
}
function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error('Could not create shader.');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Shader compilation failed: ${log}`);
    }
    return shader;
}
function linkProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error('Could not create shader program.');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteProgram(program);
        throw new Error(`Shader program linking failed: ${log}`);
    }
    return program;
}
function extractAttributes(gl, program, shader) {
    const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < activeAttributes; i++) {
        const info = gl.getActiveAttrib(program, i);
        if (!info) {
            continue;
        }
        const attribute = new ShaderAttribute(i, info.name, info.type);
        attribute.location = gl.getAttribLocation(program, info.name);
        shader.attributes.set(info.name, attribute);
    }
}
function extractUniforms(gl, program, shader, managedUniforms) {
    const activeCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const activeIndices = new Uint8Array(activeCount).map((_, index) => index);
    const blocks = gl.getActiveUniforms(program, activeIndices, gl.UNIFORM_BLOCK_INDEX);
    const indices = activeIndices.filter((index) => (blocks[index] === -1));
    for (const index of indices) {
        const info = gl.getActiveUniform(program, index);
        if (!info) {
            continue;
        }
        const data = new primitiveArrayConstructors[info.type](primitiveByteSizeMapping[info.type] * info.size);
        const uniform = new ShaderUniform(index, info.type, info.size, info.name, data);
        const location = gl.getUniformLocation(program, uniform.name);
        const uploadFn = uniformUploadFunctions[info.type];
        shader.uniforms.set(uniform.name, uniform);
        if (location) {
            managedUniforms.push({ location, uploadFn, uniform });
        }
    }
}
function extractUniformBlocks(gl, program, uniformBlocks) {
    const activeBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
    for (let index = 0; index < activeBlocks; index++) {
        const block = new ShaderBlock(gl, program, index);
        uniformBlocks.push(block);
    }
}

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

let internalCanvasElement = null;
let internalCanvasContext = null;
const canUseDocument = () => typeof document !== 'undefined';
const getCanvasElement = () => {
    if (!canUseDocument()) {
        throw new Error('Canvas operations require a document context.');
    }
    if (internalCanvasElement === null) {
        internalCanvasElement = document.createElement('canvas');
    }
    return internalCanvasElement;
};
const getCanvasContext = () => {
    if (internalCanvasContext === null) {
        const context = getCanvasElement().getContext('2d');
        if (!context) {
            throw new Error('Could not create a 2D canvas context.');
        }
        internalCanvasContext = context;
    }
    return internalCanvasContext;
};
const emptyArrayBuffer = new ArrayBuffer(0);
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
const canvasSourceToDataUrl = (source) => {
    const { width, height } = getCanvasSourceSize(source);
    const canvasElement = getCanvasElement();
    canvasElement.width = width;
    canvasElement.height = height;
    getCanvasContext().drawImage(source, 0, 0, width, height);
    return canvasElement.toDataURL();
};

class RenderBuffer {
    constructor(type, data, usage) {
        this._runtime = null;
        this._data = emptyArrayBuffer;
        this._version = 0;
        this._type = type;
        this._usage = usage;
        if (data) {
            this.upload(data);
        }
    }
    get type() {
        return this._type;
    }
    get usage() {
        return this._usage;
    }
    get data() {
        return this._data;
    }
    get version() {
        return this._version;
    }
    connect(runtime) {
        this._runtime = runtime;
        if (this._data.byteLength > 0) {
            runtime.upload(this, 0);
        }
        return this;
    }
    disconnect() {
        this._runtime = null;
        return this;
    }
    upload(data, offset = 0) {
        this._data = data;
        this._version++;
        this._runtime?.upload(this, offset);
    }
    bind() {
        this._runtime?.bind(this);
    }
    destroy() {
        this._runtime?.destroy(this);
        this._runtime = null;
    }
}

const createQuadIndices = (size) => {
    const data = new Uint16Array(size * 6);
    const len = data.length;
    for (let i = 0, offset = 0; i < len; i += 6, offset += 4) {
        data[i] = offset;
        data[i + 1] = offset + 1;
        data[i + 2] = offset + 2;
        data[i + 3] = offset;
        data[i + 4] = offset + 2;
        data[i + 5] = offset + 3;
    }
    return data;
};
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

class AbstractRenderer {
    constructor(batchSize, attributeCount, vertexSource, fragmentSource) {
        this.batchIndex = 0;
        this.renderManager = null;
        this.gl = null;
        this.currentTexture = null;
        this.currentBlendMode = null;
        this.currentView = null;
        this.currentViewId = -1;
        this.vao = null;
        this.indexBuffer = null;
        this.vertexBuffer = null;
        this.connection = null;
        this.batchSize = batchSize;
        this.attributeCount = attributeCount;
        this.vertexData = new ArrayBuffer(batchSize * attributeCount * 4);
        this.float32View = new Float32Array(this.vertexData);
        this.uint32View = new Uint32Array(this.vertexData);
        this.indexData = createQuadIndices(batchSize);
        this.shader = new Shader(vertexSource, fragmentSource);
    }
    connect(renderManager) {
        if (!this.gl) {
            const webGl2RenderManager = renderManager;
            const gl = webGl2RenderManager.context;
            this.gl = gl;
            this.renderManager = webGl2RenderManager;
            this.shader.connect(createWebGlShaderRuntime(gl));
            this.connection = this.createConnection(gl);
            this.indexBuffer = new RenderBuffer(BufferTypes.ElementArrayBuffer, this.indexData, BufferUsage.StaticDraw)
                .connect(this.createBufferRuntime(this.connection));
            this.vertexBuffer = new RenderBuffer(BufferTypes.ArrayBuffer, this.vertexData, BufferUsage.DynamicDraw)
                .connect(this.createBufferRuntime(this.connection));
            this.vao = this.createVao(gl, this.indexBuffer, this.vertexBuffer)
                .connect(this.createVaoRuntime(this.connection));
        }
        return this;
    }
    disconnect() {
        if (this.gl) {
            this.unbind();
            this.shader.disconnect();
            this.indexBuffer?.destroy();
            this.indexBuffer = null;
            this.vertexBuffer?.destroy();
            this.vertexBuffer = null;
            this.vao?.destroy();
            this.vao = null;
            this.connection = null;
            this.renderManager = null;
            this.gl = null;
        }
        return this;
    }
    bind() {
        if (!this.renderManager) {
            throw new Error('Renderer has to be connected first!');
        }
        this.renderManager.setVao(this.vao);
        this.renderManager.setShader(this.shader);
        return this;
    }
    unbind() {
        if (this.renderManager) {
            this.flush();
            this.renderManager.setShader(null);
            this.renderManager.setVao(null);
            this.currentTexture = null;
            this.currentBlendMode = null;
            this.currentView = null;
            this.currentViewId = -1;
        }
        return this;
    }
    flush() {
        const renderManager = this.renderManager;
        const vertexBuffer = this.vertexBuffer;
        const vao = this.vao;
        if (this.batchIndex > 0 && renderManager && vertexBuffer && vao) {
            const view = renderManager.view;
            if (this.currentView !== view || this.currentViewId !== view.updateId) {
                this.currentView = view;
                this.currentViewId = view.updateId;
                this.updateView(view);
            }
            this.shader.sync();
            renderManager.setVao(vao);
            vertexBuffer.upload(this.float32View.subarray(0, this.batchIndex * this.attributeCount));
            vao.draw(this.batchIndex * 6, 0);
            this.batchIndex = 0;
        }
        return this;
    }
    destroy() {
        this.disconnect();
        this.shader.destroy();
        this.currentTexture = null;
        this.currentBlendMode = null;
        this.currentView = null;
        this.renderManager = null;
        this.gl = null;
        this.connection = null;
    }
    createConnection(gl) {
        const vaoHandle = gl.createVertexArray();
        if (vaoHandle === null) {
            throw new Error('Could not create vertex array object.');
        }
        return {
            gl,
            buffers: new Map(),
            vaoHandle,
        };
    }
    createBufferRuntime(connection) {
        const handle = connection.gl.createBuffer();
        if (handle === null) {
            throw new Error('Could not create render buffer.');
        }
        return {
            bind: (buffer) => {
                connection.gl.bindBuffer(buffer.type, handle);
            },
            upload: (buffer, offset) => {
                const gl = connection.gl;
                const data = buffer.data;
                const state = connection.buffers.get(buffer);
                gl.bindBuffer(buffer.type, handle);
                if (state && state.dataByteLength >= data.byteLength) {
                    gl.bufferSubData(buffer.type, offset, data);
                    state.dataByteLength = data.byteLength;
                }
                else {
                    gl.bufferData(buffer.type, data, buffer.usage);
                    connection.buffers.set(buffer, { handle, dataByteLength: data.byteLength });
                }
            },
            destroy: (buffer) => {
                connection.gl.deleteBuffer(handle);
                connection.buffers.delete(buffer);
                buffer.disconnect();
            },
        };
    }
    createVaoRuntime(connection) {
        let appliedVersion = -1;
        return {
            bind: (vao) => {
                const gl = connection.gl;
                gl.bindVertexArray(connection.vaoHandle);
                if (appliedVersion !== vao.version) {
                    let lastBuffer = null;
                    for (const attribute of vao.attributes) {
                        if (lastBuffer !== attribute.buffer) {
                            attribute.buffer.bind();
                            lastBuffer = attribute.buffer;
                        }
                        gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.start);
                        gl.enableVertexAttribArray(attribute.location);
                    }
                    if (vao.indexBuffer) {
                        vao.indexBuffer.bind();
                    }
                    appliedVersion = vao.version;
                }
            },
            unbind: () => {
                connection.gl.bindVertexArray(null);
            },
            draw: (vao, size, start, type) => {
                const gl = connection.gl;
                if (vao.indexBuffer) {
                    gl.drawElements(type, size, gl.UNSIGNED_SHORT, start);
                }
                else {
                    gl.drawArrays(type, start, size);
                }
            },
            destroy: (vao) => {
                connection.gl.deleteVertexArray(connection.vaoHandle);
                vao.disconnect();
            },
        };
    }
}

class VertexArrayObject {
    constructor(drawMode = RenderingPrimitives.Triangles) {
        this._attributes = [];
        this._indexBuffer = null;
        this._runtime = null;
        this._version = 0;
        this._drawMode = drawMode;
    }
    get attributes() {
        return this._attributes;
    }
    get indexBuffer() {
        return this._indexBuffer;
    }
    get drawMode() {
        return this._drawMode;
    }
    get version() {
        return this._version;
    }
    connect(runtime) {
        this._runtime = runtime;
        return this;
    }
    disconnect() {
        this._runtime = null;
        return this;
    }
    bind() {
        this._runtime?.bind(this);
        return this;
    }
    unbind() {
        this._runtime?.unbind(this);
        return this;
    }
    addAttribute(buffer, attribute, type = ShaderPrimitives.Float, normalized = false, stride = 0, start = 0) {
        const { location, size } = attribute;
        this._attributes.push({ buffer, location, size, type, normalized, stride, start });
        this._version++;
        return this;
    }
    addIndex(buffer) {
        this._indexBuffer = buffer;
        this._version++;
        return this;
    }
    clear() {
        this._attributes.length = 0;
        this._indexBuffer = null;
        this._version++;
        return this;
    }
    draw(size, start, type = this._drawMode) {
        this._runtime?.draw(this, size, start, type);
        return this;
    }
    destroy() {
        this._runtime?.destroy(this);
        this._runtime = null;
        this._indexBuffer = null;
    }
}

var vertexSource$2 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec2 a_texcoord;\r\nlayout(location = 2) in vec2 a_translation;\r\nlayout(location = 3) in vec2 a_scale;\r\nlayout(location = 4) in float a_rotation;\r\nlayout(location = 5) in vec4 a_color;\n\nuniform mat3 u_projection;\nuniform mat3 u_translation;\n\r\nout vec2 v_texcoord;\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\n    vec2 rotation = vec2(sin(radians(a_rotation)), cos(radians(a_rotation)));\n    vec3 position = vec3(\n        (a_position.x * (a_scale.x * rotation.y)) + (a_position.y * (a_scale.y * rotation.x)) + a_translation.x,\n        (a_position.x * (a_scale.x * -rotation.x)) + (a_position.y * (a_scale.y * rotation.y)) + a_translation.y,\n        1.0\n    );\n\n    gl_Position = vec4((u_projection * u_translation * position).xy, 0.0, 1.0);\n\r\n    v_texcoord = a_texcoord;\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

var fragmentSource$2 = "#version 300 es\r\nprecision lowp float;\r\n\r\nuniform sampler2D u_texture;\r\n\r\nin vec2 v_texcoord;\r\nin vec4 v_color;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nvoid main(void) {\r\n    fragColor = texture(u_texture, v_texcoord) * v_color;\r\n}\r\n";

class ParticleRenderer extends AbstractRenderer {
    constructor(batchSize) {
        /**
         * 4 x 9 Attributes:
         * 2 = vertexPos     (x, y) +
         * 1 = texCoord (packed uv) +
         * 2 = position      (x, y) +
         * 2 = scale         (x, y) +
         * 1 = rotation      (x, y) +
         * 1 = color         (ARGB int)
         */
        super(batchSize, 36, vertexSource$2, fragmentSource$2);
    }
    render(system) {
        const { texture, vertices, texCoords, particles, blendMode } = system;
        const textureChanged = (texture !== this.currentTexture);
        const blendModeChanged = (blendMode !== this.currentBlendMode);
        const float32View = this.float32View;
        const uint32View = this.uint32View;
        // System transform is a uniform, so mixing systems in one batch is invalid.
        this.flush();
        if (textureChanged || blendModeChanged) {
            if (textureChanged) {
                this.currentTexture = texture;
            }
            if (blendModeChanged) {
                this.currentBlendMode = blendMode;
                this.renderManager.setBlendMode(blendMode);
            }
        }
        this.renderManager.setTexture(texture);
        this.shader
            .getUniform('u_translation')
            .setValue(system.getGlobalTransform().toArray(false));
        for (const particle of particles) {
            if (this.batchIndex >= this.batchSize) {
                this.flush();
            }
            const { position, scale, rotation, tint } = particle;
            const index = (this.batchIndex * this.attributeCount);
            float32View[index + 0] = float32View[index + 27] = vertices[0];
            float32View[index + 1] = float32View[index + 10] = vertices[1];
            float32View[index + 9] = float32View[index + 18] = vertices[2];
            float32View[index + 19] = float32View[index + 28] = vertices[3];
            uint32View[index + 2] = texCoords[0];
            uint32View[index + 11] = texCoords[1];
            uint32View[index + 20] = texCoords[2];
            uint32View[index + 29] = texCoords[3];
            float32View[index + 3]
                = float32View[index + 12]
                    = float32View[index + 21]
                        = float32View[index + 30]
                            = position.x;
            float32View[index + 4]
                = float32View[index + 13]
                    = float32View[index + 22]
                        = float32View[index + 31]
                            = position.y;
            float32View[index + 5]
                = float32View[index + 14]
                    = float32View[index + 23]
                        = float32View[index + 32]
                            = scale.x;
            float32View[index + 6]
                = float32View[index + 15]
                    = float32View[index + 24]
                        = float32View[index + 33]
                            = scale.y;
            float32View[index + 7]
                = float32View[index + 16]
                    = float32View[index + 25]
                        = float32View[index + 34]
                            = rotation;
            uint32View[index + 8]
                = uint32View[index + 17]
                    = uint32View[index + 26]
                        = uint32View[index + 35]
                            = tint.toRgba();
            this.batchIndex++;
        }
        return this;
    }
    createVao(gl, indexBuffer, vertexBuffer) {
        return new VertexArrayObject()
            .addIndex(indexBuffer)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_position'), gl.FLOAT, false, this.attributeCount, 0)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_texcoord'), gl.UNSIGNED_SHORT, true, this.attributeCount, 8)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_translation'), gl.FLOAT, false, this.attributeCount, 12)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_scale'), gl.FLOAT, false, this.attributeCount, 20)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_rotation'), gl.FLOAT, false, this.attributeCount, 28)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_color'), gl.UNSIGNED_BYTE, true, this.attributeCount, 32);
    }
    updateView(view) {
        this.shader
            .getUniform('u_projection')
            .setValue(view.getTransform().toArray(false));
        return this;
    }
}

var vertexSource$1 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec4 a_color;\r\n\r\nuniform mat3 u_projection;\r\nuniform mat3 u_translation;\r\n\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\r\n    gl_Position = vec4((u_projection * u_translation * vec3(a_position, 1.0)).xy, 0.0, 1.0);\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

var fragmentSource$1 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nin vec4 v_color;\r\n\r\nvoid main(void) {\r\n    fragColor = v_color;\r\n}\r\n";

const minBatchVertexSize = 4;
const vertexStrideBytes = 12; // vec2 position + packed rgba
const vertexStrideWords = vertexStrideBytes / 4;
class PrimitiveRenderer {
    constructor(batchSize) {
        this._shader = new Shader(vertexSource$1, fragmentSource$1);
        this._connection = null;
        this._currentBlendMode = null;
        this._currentView = null;
        this._viewId = -1;
        this._vertexCapacity = Math.max(minBatchVertexSize, batchSize);
        this._indexCapacity = Math.max(6, this._vertexCapacity * 3);
        this._vertexData = new ArrayBuffer(this._vertexCapacity * vertexStrideBytes);
        this._indexData = new Uint16Array(this._indexCapacity);
        this._float32View = new Float32Array(this._vertexData);
        this._uint32View = new Uint32Array(this._vertexData);
    }
    connect(renderManager) {
        if (!this._connection) {
            const webGl2RenderManager = renderManager;
            const gl = webGl2RenderManager.context;
            const vaoHandle = gl.createVertexArray();
            this._shader.connect(createWebGlShaderRuntime(gl));
            if (vaoHandle === null) {
                throw new Error('Could not create vertex array object.');
            }
            const buffers = new Map();
            const indexBuffer = new RenderBuffer(BufferTypes.ElementArrayBuffer, this._indexData, BufferUsage.DynamicDraw)
                .connect(this._createBufferRuntime(gl, buffers));
            const vertexBuffer = new RenderBuffer(BufferTypes.ArrayBuffer, this._vertexData, BufferUsage.DynamicDraw)
                .connect(this._createBufferRuntime(gl, buffers));
            const vao = new VertexArrayObject()
                .addIndex(indexBuffer)
                .addAttribute(vertexBuffer, this._shader.getAttribute('a_position'), gl.FLOAT, false, vertexStrideBytes, 0)
                .addAttribute(vertexBuffer, this._shader.getAttribute('a_color'), gl.UNSIGNED_BYTE, true, vertexStrideBytes, 8)
                .connect(this._createVaoRuntime(gl, vaoHandle));
            this._connection = { gl, renderManager: webGl2RenderManager, buffers, vaoHandle, vao, indexBuffer, vertexBuffer };
        }
        return this;
    }
    disconnect() {
        const conn = this._connection;
        if (conn) {
            this.unbind();
            this._shader.disconnect();
            conn.indexBuffer.destroy();
            conn.vertexBuffer.destroy();
            conn.vao.destroy();
            this._connection = null;
        }
        return this;
    }
    bind() {
        const conn = this._connection;
        if (!conn) {
            throw new Error('Renderer has to be connected first!');
        }
        conn.renderManager.setVao(conn.vao);
        conn.renderManager.setShader(this._shader);
        return this;
    }
    unbind() {
        const conn = this._connection;
        if (conn) {
            this.flush();
            conn.renderManager.setShader(null);
            conn.renderManager.setVao(null);
            this._currentBlendMode = null;
            this._currentView = null;
            this._viewId = -1;
        }
        return this;
    }
    render(drawable) {
        const conn = this._connection;
        if (!conn) {
            throw new Error('Renderer not connected');
        }
        const shape = drawable;
        const { geometry, drawMode, color, blendMode } = shape;
        const vertices = geometry.vertices;
        const sourceIndices = geometry.indices;
        const vertexCount = vertices.length / 2;
        const indexCount = sourceIndices.length > 0 ? sourceIndices.length : vertexCount;
        if (vertexCount === 0 || indexCount === 0) {
            return this;
        }
        this._ensureVertexCapacity(vertexCount);
        this._ensureIndexCapacity(indexCount);
        if (blendMode !== this._currentBlendMode) {
            this._currentBlendMode = blendMode;
            conn.renderManager.setBlendMode(blendMode);
        }
        const view = conn.renderManager.view;
        if (this._currentView !== view || this._viewId !== view.updateId) {
            this._currentView = view;
            this._viewId = view.updateId;
            this._shader.getUniform('u_projection').setValue(view.getTransform().toArray(false));
        }
        this._shader.getUniform('u_translation').setValue(shape.getGlobalTransform().toArray(false));
        const packedColor = color.toRgba();
        for (let i = 0; i < vertexCount; i++) {
            const sourceIndex = i * 2;
            const targetIndex = i * vertexStrideWords;
            this._float32View[targetIndex] = vertices[sourceIndex];
            this._float32View[targetIndex + 1] = vertices[sourceIndex + 1];
            this._uint32View[targetIndex + 2] = packedColor;
        }
        if (sourceIndices.length > 0) {
            this._indexData.set(sourceIndices, 0);
        }
        else {
            for (let i = 0; i < vertexCount; i++) {
                this._indexData[i] = i;
            }
        }
        this._shader.sync();
        conn.renderManager.setVao(conn.vao);
        conn.vertexBuffer.upload(this._float32View.subarray(0, vertexCount * vertexStrideWords));
        conn.indexBuffer.upload(this._indexData.subarray(0, indexCount));
        conn.vao.draw(indexCount, 0, drawMode);
        return this;
    }
    flush() {
        return this;
    }
    destroy() {
        this.disconnect();
        this._shader.destroy();
        this._currentBlendMode = null;
        this._currentView = null;
    }
    _ensureVertexCapacity(vertexCount) {
        if (vertexCount <= this._vertexCapacity) {
            return;
        }
        while (this._vertexCapacity < vertexCount) {
            this._vertexCapacity *= 2;
        }
        this._vertexData = new ArrayBuffer(this._vertexCapacity * vertexStrideBytes);
        this._float32View = new Float32Array(this._vertexData);
        this._uint32View = new Uint32Array(this._vertexData);
    }
    _ensureIndexCapacity(indexCount) {
        if (indexCount <= this._indexCapacity) {
            return;
        }
        while (this._indexCapacity < indexCount) {
            this._indexCapacity *= 2;
        }
        this._indexData = new Uint16Array(this._indexCapacity);
    }
    _createBufferRuntime(gl, buffers) {
        const handle = gl.createBuffer();
        if (handle === null) {
            throw new Error('Could not create render buffer.');
        }
        return {
            bind: (buffer) => {
                gl.bindBuffer(buffer.type, handle);
            },
            upload: (buffer, offset) => {
                const state = buffers.get(buffer);
                const data = buffer.data;
                gl.bindBuffer(buffer.type, handle);
                if (state && state.dataByteLength >= data.byteLength) {
                    gl.bufferSubData(buffer.type, offset, data);
                    state.dataByteLength = data.byteLength;
                }
                else {
                    gl.bufferData(buffer.type, data, buffer.usage);
                    buffers.set(buffer, { handle, dataByteLength: data.byteLength });
                }
            },
            destroy: (buffer) => {
                gl.deleteBuffer(handle);
                buffers.delete(buffer);
                buffer.disconnect();
            },
        };
    }
    _createVaoRuntime(gl, vaoHandle) {
        let appliedVersion = -1;
        return {
            bind: (vao) => {
                gl.bindVertexArray(vaoHandle);
                if (appliedVersion !== vao.version) {
                    let lastBuffer = null;
                    for (const attribute of vao.attributes) {
                        if (lastBuffer !== attribute.buffer) {
                            attribute.buffer.bind();
                            lastBuffer = attribute.buffer;
                        }
                        gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.start);
                        gl.enableVertexAttribArray(attribute.location);
                    }
                    if (vao.indexBuffer) {
                        vao.indexBuffer.bind();
                    }
                    appliedVersion = vao.version;
                }
            },
            unbind: () => {
                gl.bindVertexArray(null);
            },
            draw: (vao, size, start, type) => {
                if (vao.indexBuffer) {
                    gl.drawElements(type, size, gl.UNSIGNED_SHORT, start);
                }
                else {
                    gl.drawArrays(type, start, size);
                }
            },
            destroy: (vao) => {
                gl.deleteVertexArray(vaoHandle);
                vao.disconnect();
            },
        };
    }
}

/*
** Copyright (c) 2012 The Khronos Group Inc.
**
** Permission is hereby granted, free of charge, to any person obtaining a
** copy of this software and/or associated documentation files (the
** "Materials"), to deal in the Materials without restriction, including
** without limitation the rights to use, copy, modify, merge, publish,
** distribute, sublicense, and/or sell copies of the Materials, and to
** permit persons to whom the Materials are furnished to do so, subject to
** the following conditions:
**
** The above copyright notice and this permission notice shall be included
** in all copies or substantial portions of the Materials.
**
** THE MATERIALS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
** MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
** IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
** CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
** TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
** MATERIALS OR THE USE OR OTHER DEALINGS IN THE MATERIALS.
*/
// Various functions for helping debug WebGL apps.
const WebGLDebugUtils = function () {
    /**
     * Wrapped logging function.
     * @param {string} msg Message to log.
     */
    var log = function (msg) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    };
    /**
     * Wrapped error logging function.
     * @param {string} msg Message to log.
     */
    var error = function (msg) {
        if (window.console && window.console.error) {
            window.console.error(msg);
        }
        else {
            log(msg);
        }
    };
    /**
     * Which arguments are enums based on the number of arguments to the function.
     * So
     *    'texImage2D': {
     *       9: { 0:true, 2:true, 6:true, 7:true },
     *       6: { 0:true, 2:true, 3:true, 4:true },
     *    },
     *
     * means if there are 9 arguments then 6 and 7 are enums, if there are 6
     * arguments 3 and 4 are enums
     *
     * @type {!Object.<number, !Object.<number, string>}
     */
    var glValidEnumContexts = {
        // Generic setters and getters
        'enable': { 1: { 0: true } },
        'disable': { 1: { 0: true } },
        'getParameter': { 1: { 0: true } },
        // Rendering
        'drawArrays': { 3: { 0: true } },
        'drawElements': { 4: { 0: true, 2: true } },
        // Shaders
        'createShader': { 1: { 0: true } },
        'getShaderParameter': { 2: { 1: true } },
        'getProgramParameter': { 2: { 1: true } },
        'getShaderPrecisionFormat': { 2: { 0: true, 1: true } },
        // Vertex attributes
        'getVertexAttrib': { 2: { 1: true } },
        'vertexAttribPointer': { 6: { 2: true } },
        // Textures
        'bindTexture': { 2: { 0: true } },
        'activeTexture': { 1: { 0: true } },
        'getTexParameter': { 2: { 0: true, 1: true } },
        'texParameterf': { 3: { 0: true, 1: true } },
        'texParameteri': { 3: { 0: true, 1: true, 2: true } },
        // texImage2D and texSubImage2D are defined below with WebGL 2 entrypoints
        'copyTexImage2D': { 8: { 0: true, 2: true } },
        'copyTexSubImage2D': { 8: { 0: true } },
        'generateMipmap': { 1: { 0: true } },
        // compressedTexImage2D and compressedTexSubImage2D are defined below with WebGL 2 entrypoints
        // Buffer objects
        'bindBuffer': { 2: { 0: true } },
        // bufferData and bufferSubData are defined below with WebGL 2 entrypoints
        'getBufferParameter': { 2: { 0: true, 1: true } },
        // Renderbuffers and framebuffers
        'pixelStorei': { 2: { 0: true, 1: true } },
        // readPixels is defined below with WebGL 2 entrypoints
        'bindRenderbuffer': { 2: { 0: true } },
        'bindFramebuffer': { 2: { 0: true } },
        'checkFramebufferStatus': { 1: { 0: true } },
        'framebufferRenderbuffer': { 4: { 0: true, 1: true, 2: true } },
        'framebufferTexture2D': { 5: { 0: true, 1: true, 2: true } },
        'getFramebufferAttachmentParameter': { 3: { 0: true, 1: true, 2: true } },
        'getRenderbufferParameter': { 2: { 0: true, 1: true } },
        'renderbufferStorage': { 4: { 0: true, 1: true } },
        // Frame buffer operations (clear, blend, depth test, stencil)
        'clear': { 1: { 0: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] } } },
        'depthFunc': { 1: { 0: true } },
        'blendFunc': { 2: { 0: true, 1: true } },
        'blendFuncSeparate': { 4: { 0: true, 1: true, 2: true, 3: true } },
        'blendEquation': { 1: { 0: true } },
        'blendEquationSeparate': { 2: { 0: true, 1: true } },
        'stencilFunc': { 3: { 0: true } },
        'stencilFuncSeparate': { 4: { 0: true, 1: true } },
        'stencilMaskSeparate': { 2: { 0: true } },
        'stencilOp': { 3: { 0: true, 1: true, 2: true } },
        'stencilOpSeparate': { 4: { 0: true, 1: true, 2: true, 3: true } },
        // Culling
        'cullFace': { 1: { 0: true } },
        'frontFace': { 1: { 0: true } },
        // ANGLE_instanced_arrays extension
        'drawArraysInstancedANGLE': { 4: { 0: true } },
        'drawElementsInstancedANGLE': { 5: { 0: true, 2: true } },
        // EXT_blend_minmax extension
        'blendEquationEXT': { 1: { 0: true } },
        // WebGL 2 Buffer objects
        'bufferData': {
            3: { 0: true, 2: true }, // WebGL 1
            4: { 0: true, 2: true }, // WebGL 2
            5: { 0: true, 2: true } // WebGL 2
        },
        'bufferSubData': {
            3: { 0: true }, // WebGL 1
            4: { 0: true }, // WebGL 2
            5: { 0: true } // WebGL 2
        },
        'copyBufferSubData': { 5: { 0: true, 1: true } },
        'getBufferSubData': { 3: { 0: true }, 4: { 0: true }, 5: { 0: true } },
        // WebGL 2 Framebuffer objects
        'blitFramebuffer': { 10: { 8: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] }, 9: true } },
        'framebufferTextureLayer': { 5: { 0: true, 1: true } },
        'invalidateFramebuffer': { 2: { 0: true } },
        'invalidateSubFramebuffer': { 6: { 0: true } },
        'readBuffer': { 1: { 0: true } },
        // WebGL 2 Renderbuffer objects
        'getInternalformatParameter': { 3: { 0: true, 1: true, 2: true } },
        'renderbufferStorageMultisample': { 5: { 0: true, 2: true } },
        // WebGL 2 Texture objects
        'texStorage2D': { 5: { 0: true, 2: true } },
        'texStorage3D': { 6: { 0: true, 2: true } },
        'texImage2D': {
            9: { 0: true, 2: true, 6: true, 7: true }, // WebGL 1 & 2
            6: { 0: true, 2: true, 3: true, 4: true }, // WebGL 1
            10: { 0: true, 2: true, 6: true, 7: true } // WebGL 2
        },
        'texImage3D': {
            10: { 0: true, 2: true, 7: true, 8: true },
            11: { 0: true, 2: true, 7: true, 8: true }
        },
        'texSubImage2D': {
            9: { 0: true, 6: true, 7: true }, // WebGL 1 & 2
            7: { 0: true, 4: true, 5: true }, // WebGL 1
            10: { 0: true, 6: true, 7: true } // WebGL 2
        },
        'texSubImage3D': {
            11: { 0: true, 8: true, 9: true },
            12: { 0: true, 8: true, 9: true }
        },
        'copyTexSubImage3D': { 9: { 0: true } },
        'compressedTexImage2D': {
            7: { 0: true, 2: true }, // WebGL 1 & 2
            8: { 0: true, 2: true }, // WebGL 2
            9: { 0: true, 2: true } // WebGL 2
        },
        'compressedTexImage3D': {
            8: { 0: true, 2: true },
            9: { 0: true, 2: true },
            10: { 0: true, 2: true }
        },
        'compressedTexSubImage2D': {
            8: { 0: true, 6: true }, // WebGL 1 & 2
            9: { 0: true, 6: true }, // WebGL 2
            10: { 0: true, 6: true } // WebGL 2
        },
        'compressedTexSubImage3D': {
            10: { 0: true, 8: true },
            11: { 0: true, 8: true },
            12: { 0: true, 8: true }
        },
        // WebGL 2 Vertex attribs
        'vertexAttribIPointer': { 5: { 2: true } },
        // WebGL 2 Writing to the drawing buffer
        'drawArraysInstanced': { 4: { 0: true } },
        'drawElementsInstanced': { 5: { 0: true, 2: true } },
        'drawRangeElements': { 6: { 0: true, 4: true } },
        // WebGL 2 Reading back pixels
        'readPixels': {
            7: { 4: true, 5: true }, // WebGL 1 & 2
            8: { 4: true, 5: true } // WebGL 2
        },
        // WebGL 2 Multiple Render Targets
        'clearBufferfv': { 3: { 0: true }, 4: { 0: true } },
        'clearBufferiv': { 3: { 0: true }, 4: { 0: true } },
        'clearBufferuiv': { 3: { 0: true }, 4: { 0: true } },
        'clearBufferfi': { 4: { 0: true } },
        // WebGL 2 Query objects
        'beginQuery': { 2: { 0: true } },
        'endQuery': { 1: { 0: true } },
        'getQuery': { 2: { 0: true, 1: true } },
        'getQueryParameter': { 2: { 1: true } },
        // WebGL 2 Sampler objects
        'samplerParameteri': { 3: { 1: true, 2: true } },
        'samplerParameterf': { 3: { 1: true } },
        'getSamplerParameter': { 2: { 1: true } },
        // WebGL 2 Sync objects
        'fenceSync': { 2: { 0: true, 1: { 'enumBitwiseOr': [] } } },
        'clientWaitSync': { 3: { 1: { 'enumBitwiseOr': ['SYNC_FLUSH_COMMANDS_BIT'] } } },
        'waitSync': { 3: { 1: { 'enumBitwiseOr': [] } } },
        'getSyncParameter': { 2: { 1: true } },
        // WebGL 2 Transform Feedback
        'bindTransformFeedback': { 2: { 0: true } },
        'beginTransformFeedback': { 1: { 0: true } },
        'transformFeedbackVaryings': { 3: { 2: true } },
        // WebGL2 Uniform Buffer Objects and Transform Feedback Buffers
        'bindBufferBase': { 3: { 0: true } },
        'bindBufferRange': { 5: { 0: true } },
        'getIndexedParameter': { 2: { 0: true } },
        'getActiveUniforms': { 3: { 2: true } },
        'getActiveUniformBlockParameter': { 3: { 2: true } }
    };
    /**
     * Map of numbers to names.
     * @type {Object}
     */
    var glEnums = null;
    /**
     * Map of names to numbers.
     * @type {Object}
     */
    var enumStringToValue = null;
    /**
     * Initializes this module. Safe to call more than once.
     * @param {!WebGLRenderingContext} ctx A WebGL context. If
     *    you have more than one context it doesn't matter which one
     *    you pass in, it is only used to pull out constants.
     */
    function init(ctx) {
        if (glEnums == null) {
            glEnums = {};
            enumStringToValue = {};
            for (var propertyName in ctx) {
                if (typeof ctx[propertyName] == 'number') {
                    glEnums[ctx[propertyName]] = propertyName;
                    enumStringToValue[propertyName] = ctx[propertyName];
                }
            }
        }
    }
    /**
     * Checks the utils have been initialized.
     */
    function checkInit() {
        if (glEnums == null) {
            throw 'WebGLDebugUtils.init(ctx) not called';
        }
    }
    /**
     * Returns true or false if value matches any WebGL enum
     * @param {*} value Value to check if it might be an enum.
     * @return {boolean} True if value matches one of the WebGL defined enums
     */
    function mightBeEnum(value) {
        checkInit();
        return (glEnums[value] !== undefined);
    }
    /**
     * Gets an string version of an WebGL enum.
     *
     * Example:
     *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
     *
     * @param {number} value Value to return an enum for
     * @return {string} The string version of the enum.
     */
    function glEnumToString(value) {
        checkInit();
        var name = glEnums[value];
        return (name !== undefined) ? ("gl." + name) :
            ("/*UNKNOWN WebGL ENUM*/ 0x" + value.toString(16) + "");
    }
    /**
     * Returns the string version of a WebGL argument.
     * Attempts to convert enum arguments to strings.
     * @param {string} functionName the name of the WebGL function.
     * @param {number} numArgs the number of arguments passed to the function.
     * @param {number} argumentIndx the index of the argument.
     * @param {*} value The value of the argument.
     * @return {string} The value as a string.
     */
    function glFunctionArgToString(functionName, numArgs, argumentIndex, value) {
        var funcInfo = glValidEnumContexts[functionName];
        if (funcInfo !== undefined) {
            var funcInfo = funcInfo[numArgs];
            if (funcInfo !== undefined) {
                if (funcInfo[argumentIndex]) {
                    if (typeof funcInfo[argumentIndex] === 'object' &&
                        funcInfo[argumentIndex]['enumBitwiseOr'] !== undefined) {
                        var enums = funcInfo[argumentIndex]['enumBitwiseOr'];
                        var orResult = 0;
                        var orEnums = [];
                        for (var i = 0; i < enums.length; ++i) {
                            var enumValue = enumStringToValue[enums[i]];
                            if ((value & enumValue) !== 0) {
                                orResult |= enumValue;
                                orEnums.push(glEnumToString(enumValue));
                            }
                        }
                        if (orResult === value) {
                            return orEnums.join(' | ');
                        }
                        else {
                            return glEnumToString(value);
                        }
                    }
                    else {
                        return glEnumToString(value);
                    }
                }
            }
        }
        if (value === null) {
            return "null";
        }
        else if (value === undefined) {
            return "undefined";
        }
        else {
            return value.toString();
        }
    }
    /**
     * Converts the arguments of a WebGL function to a string.
     * Attempts to convert enum arguments to strings.
     *
     * @param {string} functionName the name of the WebGL function.
     * @param {Array<*>} args The arguments.
     * @return {string} The arguments as a string.
     */
    function glFunctionArgsToString(functionName, args) {
        // apparently we can't do args.join(",");
        var argStr = "";
        var numArgs = args.length;
        for (var ii = 0; ii < numArgs; ++ii) {
            argStr += ((ii == 0) ? '' : ', ') +
                glFunctionArgToString(functionName, numArgs, ii, args[ii]);
        }
        return argStr;
    }
    function makePropertyWrapper(wrapper, original, propertyName) {
        //log("wrap prop: " + propertyName);
        wrapper.__defineGetter__(propertyName, function () {
            return original[propertyName];
        });
        // TODO(gmane): this needs to handle properties that take more than
        // one value?
        wrapper.__defineSetter__(propertyName, function (value) {
            //log("set: " + propertyName);
            original[propertyName] = value;
        });
    }
    /**
     * Given a WebGL context returns a wrapped context that calls
     * gl.getError after every command and calls a function if the
     * result is not gl.NO_ERROR.
     *
     * @param {!WebGLRenderingContext} ctx The webgl context to
     *        wrap.
     * @param {!function(err, funcName, args): void} opt_onErrorFunc
     *        The function to call when gl.getError returns an
     *        error. If not specified the default function calls
     *        console.log with a message.
     * @param {!function(funcName, args): void} opt_onFunc The
     *        function to call when each webgl function is called.
     *        You can use this to log all calls for example.
     * @param {!WebGLRenderingContext} opt_err_ctx The webgl context
     *        to call getError on if different than ctx.
     */
    function makeDebugContext(ctx, opt_onErrorFunc, opt_onFunc, opt_err_ctx) {
        opt_err_ctx = opt_err_ctx || ctx;
        init(ctx);
        opt_onErrorFunc = opt_onErrorFunc || function (err, functionName, args) {
            // apparently we can't do args.join(",");
            var argStr = "";
            var numArgs = args.length;
            for (var ii = 0; ii < numArgs; ++ii) {
                argStr += ((ii == 0) ? '' : ', ') +
                    glFunctionArgToString(functionName, numArgs, ii, args[ii]);
            }
            error("WebGL error " + glEnumToString(err) + " in " + functionName +
                "(" + argStr + ")");
        };
        // Holds booleans for each GL error so after we get the error ourselves
        // we can still return it to the client app.
        var glErrorShadow = {};
        // Makes a function that calls a WebGL function and then calls getError.
        function makeErrorWrapper(ctx, functionName) {
            return function () {
                if (opt_onFunc) {
                    opt_onFunc(functionName, arguments);
                }
                var result = ctx[functionName].apply(ctx, arguments);
                var err = opt_err_ctx.getError();
                if (err != 0) {
                    glErrorShadow[err] = true;
                    opt_onErrorFunc(err, functionName, arguments);
                }
                return result;
            };
        }
        // Make a an object that has a copy of every property of the WebGL context
        // but wraps all functions.
        var wrapper = {};
        for (var propertyName in ctx) {
            if (typeof ctx[propertyName] == 'function') {
                if (propertyName != 'getExtension') {
                    wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
                }
                else {
                    var wrapped = makeErrorWrapper(ctx, propertyName);
                    wrapper[propertyName] = function () {
                        var result = wrapped.apply(ctx, arguments);
                        if (!result) {
                            return null;
                        }
                        return makeDebugContext(result, opt_onErrorFunc, opt_onFunc, opt_err_ctx);
                    };
                }
            }
            else {
                makePropertyWrapper(wrapper, ctx, propertyName);
            }
        }
        // Override the getError function with one that returns our saved results.
        wrapper.getError = function () {
            for (var err in glErrorShadow) {
                if (glErrorShadow.hasOwnProperty(err)) {
                    if (glErrorShadow[err]) {
                        glErrorShadow[err] = false;
                        return err;
                    }
                }
            }
            return ctx.NO_ERROR;
        };
        return wrapper;
    }
    function resetToInitialState(ctx) {
        var isWebGL2RenderingContext = !!ctx.createTransformFeedback;
        if (isWebGL2RenderingContext) {
            ctx.bindVertexArray(null);
        }
        var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
        var tmp = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
        for (var ii = 0; ii < numAttribs; ++ii) {
            ctx.disableVertexAttribArray(ii);
            ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
            ctx.vertexAttrib1f(ii, 0);
            if (isWebGL2RenderingContext) {
                ctx.vertexAttribDivisor(ii, 0);
            }
        }
        ctx.deleteBuffer(tmp);
        var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
        for (var ii = 0; ii < numTextureUnits; ++ii) {
            ctx.activeTexture(ctx.TEXTURE0 + ii);
            ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
            if (isWebGL2RenderingContext) {
                ctx.bindTexture(ctx.TEXTURE_2D_ARRAY, null);
                ctx.bindTexture(ctx.TEXTURE_3D, null);
                ctx.bindSampler(ii, null);
            }
        }
        ctx.activeTexture(ctx.TEXTURE0);
        ctx.useProgram(null);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        ctx.disable(ctx.BLEND);
        ctx.disable(ctx.CULL_FACE);
        ctx.disable(ctx.DEPTH_TEST);
        ctx.disable(ctx.DITHER);
        ctx.disable(ctx.SCISSOR_TEST);
        ctx.blendColor(0, 0, 0, 0);
        ctx.blendEquation(ctx.FUNC_ADD);
        ctx.blendFunc(ctx.ONE, ctx.ZERO);
        ctx.clearColor(0, 0, 0, 0);
        ctx.clearDepth(1);
        ctx.clearStencil(-1);
        ctx.colorMask(true, true, true, true);
        ctx.cullFace(ctx.BACK);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(true);
        ctx.depthRange(0, 1);
        ctx.frontFace(ctx.CCW);
        ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
        ctx.lineWidth(1);
        ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        // TODO: Delete this IF.
        if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
            ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
        }
        ctx.polygonOffset(0, 0);
        ctx.sampleCoverage(1, false);
        ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
        ctx.stencilMask(0xFFFFFFFF);
        ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
        ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);
        if (isWebGL2RenderingContext) {
            ctx.drawBuffers([ctx.BACK]);
            ctx.readBuffer(ctx.BACK);
            ctx.bindBuffer(ctx.COPY_READ_BUFFER, null);
            ctx.bindBuffer(ctx.COPY_WRITE_BUFFER, null);
            ctx.bindBuffer(ctx.PIXEL_PACK_BUFFER, null);
            ctx.bindBuffer(ctx.PIXEL_UNPACK_BUFFER, null);
            var numTransformFeedbacks = ctx.getParameter(ctx.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS);
            for (var ii = 0; ii < numTransformFeedbacks; ++ii) {
                ctx.bindBufferBase(ctx.TRANSFORM_FEEDBACK_BUFFER, ii, null);
            }
            var numUBOs = ctx.getParameter(ctx.MAX_UNIFORM_BUFFER_BINDINGS);
            for (var ii = 0; ii < numUBOs; ++ii) {
                ctx.bindBufferBase(ctx.UNIFORM_BUFFER, ii, null);
            }
            ctx.disable(ctx.RASTERIZER_DISCARD);
            ctx.pixelStorei(ctx.UNPACK_IMAGE_HEIGHT, 0);
            ctx.pixelStorei(ctx.UNPACK_SKIP_IMAGES, 0);
            ctx.pixelStorei(ctx.UNPACK_ROW_LENGTH, 0);
            ctx.pixelStorei(ctx.UNPACK_SKIP_ROWS, 0);
            ctx.pixelStorei(ctx.UNPACK_SKIP_PIXELS, 0);
            ctx.pixelStorei(ctx.PACK_ROW_LENGTH, 0);
            ctx.pixelStorei(ctx.PACK_SKIP_ROWS, 0);
            ctx.pixelStorei(ctx.PACK_SKIP_PIXELS, 0);
            ctx.hint(ctx.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx.DONT_CARE);
        }
        // TODO: This should NOT be needed but Firefox fails with 'hint'
        while (ctx.getError())
            ;
    }
    function makeLostContextSimulatingCanvas(canvas) {
        var unwrappedContext_;
        var wrappedContext_;
        var onLost_ = [];
        var onRestored_ = [];
        var wrappedContext_ = {};
        var contextId_ = 1;
        var contextLost_ = false;
        var resourceDb_ = [];
        var numCallsToLoseContext_ = 0;
        var numCalls_ = 0;
        var canRestore_ = false;
        var restoreTimeout_ = 0;
        var isWebGL2RenderingContext;
        // Holds booleans for each GL error so can simulate errors.
        var glErrorShadow_ = {};
        canvas.getContext = function (f) {
            return function () {
                var ctx = f.apply(canvas, arguments);
                // Did we get a context and is it a WebGL context?
                if ((ctx instanceof WebGLRenderingContext) || (window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext))) {
                    if (ctx != unwrappedContext_) {
                        if (unwrappedContext_) {
                            throw "got different context";
                        }
                        isWebGL2RenderingContext = window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext);
                        unwrappedContext_ = ctx;
                        wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
                    }
                    return wrappedContext_;
                }
                return ctx;
            };
        }(canvas.getContext);
        function wrapEvent(listener) {
            if (typeof (listener) == "function") {
                return listener;
            }
            else {
                return function (info) {
                    listener.handleEvent(info);
                };
            }
        }
        var addOnContextLostListener = function (listener) {
            onLost_.push(wrapEvent(listener));
        };
        var addOnContextRestoredListener = function (listener) {
            onRestored_.push(wrapEvent(listener));
        };
        function wrapAddEventListener(canvas) {
            var f = canvas.addEventListener;
            canvas.addEventListener = function (type, listener, bubble) {
                switch (type) {
                    case 'webglcontextlost':
                        addOnContextLostListener(listener);
                        break;
                    case 'webglcontextrestored':
                        addOnContextRestoredListener(listener);
                        break;
                    default:
                        f.apply(canvas, arguments);
                }
            };
        }
        wrapAddEventListener(canvas);
        canvas.loseContext = function () {
            if (!contextLost_) {
                contextLost_ = true;
                numCallsToLoseContext_ = 0;
                ++contextId_;
                while (unwrappedContext_.getError())
                    ;
                clearErrors();
                glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
                var event = makeWebGLContextEvent("context lost");
                var callbacks = onLost_.slice();
                setTimeout(function () {
                    //log("numCallbacks:" + callbacks.length);
                    for (var ii = 0; ii < callbacks.length; ++ii) {
                        //log("calling callback:" + ii);
                        callbacks[ii](event);
                    }
                    if (restoreTimeout_ >= 0) {
                        setTimeout(function () {
                            canvas.restoreContext();
                        }, restoreTimeout_);
                    }
                }, 0);
            }
        };
        canvas.restoreContext = function () {
            if (contextLost_) {
                if (onRestored_.length) {
                    setTimeout(function () {
                        if (!canRestore_) {
                            throw "can not restore. webglcontestlost listener did not call event.preventDefault";
                        }
                        freeResources();
                        resetToInitialState(unwrappedContext_);
                        contextLost_ = false;
                        numCalls_ = 0;
                        canRestore_ = false;
                        var callbacks = onRestored_.slice();
                        var event = makeWebGLContextEvent("context restored");
                        for (var ii = 0; ii < callbacks.length; ++ii) {
                            callbacks[ii](event);
                        }
                    }, 0);
                }
            }
        };
        canvas.loseContextInNCalls = function (numCalls) {
            if (contextLost_) {
                throw "You can not ask a lost contet to be lost";
            }
            numCallsToLoseContext_ = numCalls_ + numCalls;
        };
        canvas.getNumCalls = function () {
            return numCalls_;
        };
        canvas.setRestoreTimeout = function (timeout) {
            restoreTimeout_ = timeout;
        };
        function clearErrors() {
            var k = Object.keys(glErrorShadow_);
            for (var ii = 0; ii < k.length; ++ii) {
                delete glErrorShadow_[k[ii]];
            }
        }
        function loseContextIfTime() {
            ++numCalls_;
            if (!contextLost_) {
                if (numCallsToLoseContext_ == numCalls_) {
                    canvas.loseContext();
                }
            }
        }
        // Makes a function that simulates WebGL when out of context.
        function makeLostContextFunctionWrapper(ctx, functionName) {
            var f = ctx[functionName];
            return function () {
                // log("calling:" + functionName);
                // Only call the functions if the context is not lost.
                loseContextIfTime();
                if (!contextLost_) {
                    //if (!checkResources(arguments)) {
                    //  glErrorShadow_[wrappedContext_.INVALID_OPERATION] = true;
                    //  return;
                    //}
                    var result = f.apply(ctx, arguments);
                    return result;
                }
            };
        }
        function freeResources() {
            for (var ii = 0; ii < resourceDb_.length; ++ii) {
                var resource = resourceDb_[ii];
                if (resource instanceof WebGLBuffer) {
                    unwrappedContext_.deleteBuffer(resource);
                }
                else if (resource instanceof WebGLFramebuffer) {
                    unwrappedContext_.deleteFramebuffer(resource);
                }
                else if (resource instanceof WebGLProgram) {
                    unwrappedContext_.deleteProgram(resource);
                }
                else if (resource instanceof WebGLRenderbuffer) {
                    unwrappedContext_.deleteRenderbuffer(resource);
                }
                else if (resource instanceof WebGLShader) {
                    unwrappedContext_.deleteShader(resource);
                }
                else if (resource instanceof WebGLTexture) {
                    unwrappedContext_.deleteTexture(resource);
                }
                else if (isWebGL2RenderingContext) {
                    if (resource instanceof WebGLQuery) {
                        unwrappedContext_.deleteQuery(resource);
                    }
                    else if (resource instanceof WebGLSampler) {
                        unwrappedContext_.deleteSampler(resource);
                    }
                    else if (resource instanceof WebGLSync) {
                        unwrappedContext_.deleteSync(resource);
                    }
                    else if (resource instanceof WebGLTransformFeedback) {
                        unwrappedContext_.deleteTransformFeedback(resource);
                    }
                    else if (resource instanceof WebGLVertexArrayObject) {
                        unwrappedContext_.deleteVertexArray(resource);
                    }
                }
            }
        }
        function makeWebGLContextEvent(statusMessage) {
            return {
                statusMessage: statusMessage,
                preventDefault: function () {
                    canRestore_ = true;
                }
            };
        }
        return canvas;
        function makeLostContextSimulatingContext(ctx) {
            // copy all functions and properties to wrapper
            for (var propertyName in ctx) {
                if (typeof ctx[propertyName] == 'function') {
                    wrappedContext_[propertyName] = makeLostContextFunctionWrapper(ctx, propertyName);
                }
                else {
                    makePropertyWrapper(wrappedContext_, ctx, propertyName);
                }
            }
            // Wrap a few functions specially.
            wrappedContext_.getError = function () {
                loseContextIfTime();
                if (!contextLost_) {
                    var err;
                    while (err = unwrappedContext_.getError()) {
                        glErrorShadow_[err] = true;
                    }
                }
                for (var err in glErrorShadow_) {
                    if (glErrorShadow_[err]) {
                        delete glErrorShadow_[err];
                        return err;
                    }
                }
                return wrappedContext_.NO_ERROR;
            };
            var creationFunctions = [
                "createBuffer",
                "createFramebuffer",
                "createProgram",
                "createRenderbuffer",
                "createShader",
                "createTexture"
            ];
            if (isWebGL2RenderingContext) {
                creationFunctions.push("createQuery", "createSampler", "fenceSync", "createTransformFeedback", "createVertexArray");
            }
            for (var ii = 0; ii < creationFunctions.length; ++ii) {
                var functionName = creationFunctions[ii];
                wrappedContext_[functionName] = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return null;
                        }
                        var obj = f.apply(ctx, arguments);
                        obj.__webglDebugContextLostId__ = contextId_;
                        resourceDb_.push(obj);
                        return obj;
                    };
                }(ctx[functionName]);
            }
            var functionsThatShouldReturnNull = [
                "getActiveAttrib",
                "getActiveUniform",
                "getBufferParameter",
                "getContextAttributes",
                "getAttachedShaders",
                "getFramebufferAttachmentParameter",
                "getParameter",
                "getProgramParameter",
                "getProgramInfoLog",
                "getRenderbufferParameter",
                "getShaderParameter",
                "getShaderInfoLog",
                "getShaderSource",
                "getTexParameter",
                "getUniform",
                "getUniformLocation",
                "getVertexAttrib"
            ];
            if (isWebGL2RenderingContext) {
                functionsThatShouldReturnNull.push("getInternalformatParameter", "getQuery", "getQueryParameter", "getSamplerParameter", "getSyncParameter", "getTransformFeedbackVarying", "getIndexedParameter", "getUniformIndices", "getActiveUniforms", "getActiveUniformBlockParameter", "getActiveUniformBlockName");
            }
            for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
                var functionName = functionsThatShouldReturnNull[ii];
                wrappedContext_[functionName] = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return null;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_[functionName]);
            }
            var isFunctions = [
                "isBuffer",
                "isEnabled",
                "isFramebuffer",
                "isProgram",
                "isRenderbuffer",
                "isShader",
                "isTexture"
            ];
            if (isWebGL2RenderingContext) {
                isFunctions.push("isQuery", "isSampler", "isSync", "isTransformFeedback", "isVertexArray");
            }
            for (var ii = 0; ii < isFunctions.length; ++ii) {
                var functionName = isFunctions[ii];
                wrappedContext_[functionName] = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return false;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_[functionName]);
            }
            wrappedContext_.checkFramebufferStatus = function (f) {
                return function () {
                    loseContextIfTime();
                    if (contextLost_) {
                        return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.checkFramebufferStatus);
            wrappedContext_.getAttribLocation = function (f) {
                return function () {
                    loseContextIfTime();
                    if (contextLost_) {
                        return -1;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.getAttribLocation);
            wrappedContext_.getVertexAttribOffset = function (f) {
                return function () {
                    loseContextIfTime();
                    if (contextLost_) {
                        return 0;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.getVertexAttribOffset);
            wrappedContext_.isContextLost = function () {
                return contextLost_;
            };
            if (isWebGL2RenderingContext) {
                wrappedContext_.getFragDataLocation = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return -1;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.getFragDataLocation);
                wrappedContext_.clientWaitSync = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return wrappedContext_.WAIT_FAILED;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.clientWaitSync);
                wrappedContext_.getUniformBlockIndex = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return wrappedContext_.INVALID_INDEX;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.getUniformBlockIndex);
            }
            return wrappedContext_;
        }
    }
    return {
        /**
         * Initializes this module. Safe to call more than once.
         * @param {!WebGLRenderingContext} ctx A WebGL context. If
         *    you have more than one context it doesn't matter which one
         *    you pass in, it is only used to pull out constants.
         */
        'init': init,
        /**
         * Returns true or false if value matches any WebGL enum
         * @param {*} value Value to check if it might be an enum.
         * @return {boolean} True if value matches one of the WebGL defined enums
         */
        'mightBeEnum': mightBeEnum,
        /**
         * Gets an string version of an WebGL enum.
         *
         * Example:
         *   WebGLDebugUtil.init(ctx);
         *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
         *
         * @param {number} value Value to return an enum for
         * @return {string} The string version of the enum.
         */
        'glEnumToString': glEnumToString,
        /**
         * Converts the argument of a WebGL function to a string.
         * Attempts to convert enum arguments to strings.
         *
         * Example:
         *   WebGLDebugUtil.init(ctx);
         *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 2, 0, gl.TEXTURE_2D);
         *
         * would return 'TEXTURE_2D'
         *
         * @param {string} functionName the name of the WebGL function.
         * @param {number} numArgs The number of arguments
         * @param {number} argumentIndx the index of the argument.
         * @param {*} value The value of the argument.
         * @return {string} The value as a string.
         */
        'glFunctionArgToString': glFunctionArgToString,
        /**
         * Converts the arguments of a WebGL function to a string.
         * Attempts to convert enum arguments to strings.
         *
         * @param {string} functionName the name of the WebGL function.
         * @param {number} args The arguments.
         * @return {string} The arguments as a string.
         */
        'glFunctionArgsToString': glFunctionArgsToString,
        /**
         * Given a WebGL context returns a wrapped context that calls
         * gl.getError after every command and calls a function if the
         * result is not NO_ERROR.
         *
         * You can supply your own function if you want. For example, if you'd like
         * an exception thrown on any GL error you could do this
         *
         *    function throwOnGLError(err, funcName, args) {
         *      throw WebGLDebugUtils.glEnumToString(err) +
         *            " was caused by call to " + funcName;
         *    };
         *
         *    ctx = WebGLDebugUtils.makeDebugContext(
         *        canvas.getContext("webgl"), throwOnGLError);
         *
         * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
         * @param {!function(err, funcName, args): void} opt_onErrorFunc The function
         *     to call when gl.getError returns an error. If not specified the default
         *     function calls console.log with a message.
         * @param {!function(funcName, args): void} opt_onFunc The
         *     function to call when each webgl function is called. You
         *     can use this to log all calls for example.
         */
        'makeDebugContext': makeDebugContext,
        /**
         * Given a canvas element returns a wrapped canvas element that will
         * simulate lost context. The canvas returned adds the following functions.
         *
         * loseContext:
         *   simulates a lost context event.
         *
         * restoreContext:
         *   simulates the context being restored.
         *
         * lostContextInNCalls:
         *   loses the context after N gl calls.
         *
         * getNumCalls:
         *   tells you how many gl calls there have been so far.
         *
         * setRestoreTimeout:
         *   sets the number of milliseconds until the context is restored
         *   after it has been lost. Defaults to 0. Pass -1 to prevent
         *   automatic restoring.
         *
         * @param {!Canvas} canvas The canvas element to wrap.
         */
        'makeLostContextSimulatingCanvas': makeLostContextSimulatingCanvas,
        /**
         * Resets a context to the initial state.
         * @param {!WebGLRenderingContext} ctx The webgl context to
         *     reset.
         */
        'resetToInitialState': resetToInitialState
    };
}();

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

var vertexSource = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec2 a_texcoord;\r\nlayout(location = 2) in vec4 a_color;\r\n\r\nuniform mat3 u_projection;\r\n\r\nout vec2 v_texcoord;\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\r\n    gl_Position = vec4((u_projection * vec3(a_position, 1.0)).xy, 0.0, 1.0);\r\n\r\n    v_texcoord = a_texcoord;\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

var fragmentSource = "#version 300 es\r\nprecision lowp float;\r\n\r\nuniform sampler2D u_texture;\r\n\r\nin vec2 v_texcoord;\r\nin vec4 v_color;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nvoid main(void) {\r\n    fragColor = texture(u_texture, v_texcoord) * v_color;\r\n}\r\n";

class SpriteRenderer extends AbstractRenderer {
    constructor(batchSize) {
        /**
         * 4 x 4 Attributes:
         * 2 = position (x, y) +
         * 1 = texCoord (packed uv) +
         * 1 = color    (ARGB int)
         */
        super(batchSize, 16, vertexSource, fragmentSource);
    }
    render(sprite) {
        const { texture, blendMode, tint, vertices, texCoords } = sprite;
        const batchFull = (this.batchIndex >= this.batchSize);
        const textureChanged = (texture !== this.currentTexture);
        const blendModeChanged = (blendMode !== this.currentBlendMode);
        const flush = (batchFull || textureChanged || blendModeChanged);
        const index = flush ? 0 : (this.batchIndex * this.attributeCount);
        const float32View = this.float32View;
        const uint32View = this.uint32View;
        if (flush) {
            this.flush();
            if (textureChanged) {
                this.currentTexture = texture;
            }
            if (blendModeChanged) {
                this.currentBlendMode = blendMode;
                this.renderManager.setBlendMode(blendMode);
            }
        }
        if (texture) {
            this.renderManager.setTexture(texture);
        }
        // X / Y
        float32View[index + 0] = vertices[0];
        float32View[index + 1] = vertices[1];
        // X / Y
        float32View[index + 4] = vertices[2];
        float32View[index + 5] = vertices[3];
        // X / Y
        float32View[index + 8] = vertices[4];
        float32View[index + 9] = vertices[5];
        // X / Y
        float32View[index + 12] = vertices[6];
        float32View[index + 13] = vertices[7];
        // U / V
        uint32View[index + 2] = texCoords[0];
        uint32View[index + 6] = texCoords[1];
        // U / V
        uint32View[index + 10] = texCoords[2];
        uint32View[index + 14] = texCoords[3];
        // Tint
        uint32View[index + 3]
            = uint32View[index + 7]
                = uint32View[index + 11]
                    = uint32View[index + 15]
                        = tint.toRgba();
        this.batchIndex++;
        return this;
    }
    createVao(gl, indexBuffer, vertexBuffer) {
        return new VertexArrayObject()
            .addIndex(indexBuffer)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_position'), gl.FLOAT, false, this.attributeCount, 0)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_texcoord'), gl.UNSIGNED_SHORT, true, this.attributeCount, 8)
            .addAttribute(vertexBuffer, this.shader.getAttribute('a_color'), gl.UNSIGNED_BYTE, true, this.attributeCount, 12);
    }
    updateView(view) {
        this.shader
            .getUniform('u_projection')
            .setValue(view.getTransform().toArray(false));
        return this;
    }
}

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

var RendererType;
(function (RendererType) {
    RendererType[RendererType["Sprite"] = 1] = "Sprite";
    RendererType[RendererType["Particle"] = 2] = "Particle";
    RendererType[RendererType["Primitive"] = 3] = "Primitive";
})(RendererType || (RendererType = {}));

const throwOnGlError = (err, funcName) => {
    throw `${WebGLDebugUtils.glEnumToString(err)} was caused by call to: ${funcName}`;
};
const logGlCall = (functionName, args) => {
    console.log(`gl.${functionName}(${WebGLDebugUtils.glFunctionArgsToString(functionName, args)})`);
};
const validateNoneOfTheArgsAreUndefined = (functionName, args) => {
    for (const arg of args) {
        if (arg === undefined) {
            console.error(`undefined passed to gl.${functionName}(${WebGLDebugUtils.glFunctionArgsToString(functionName, args)})`);
        }
    }
};
const logAndValidate = (functionName, args) => {
    logGlCall(functionName, args);
    validateNoneOfTheArgsAreUndefined(functionName, args);
};
class RenderManager {
    constructor(app) {
        this._renderers = new Map();
        this._textureStates = new Map();
        this._renderTargetStates = new Map();
        this._textureDestroyHandlers = new Map();
        this._renderTargetDestroyHandlers = new Map();
        this._renderer = null;
        this._shader = null;
        this._blendMode = null;
        this._texture = null;
        this._textureUnit = 0;
        this._vao = null;
        this._clearColor = new Color();
        this._boundFramebuffer = null;
        const { width, height, clearColor, webglAttributes, debug, spriteRendererBatchSize, particleRendererBatchSize, primitiveRendererBatchSize, } = app.options;
        this._canvas = app.canvas;
        const gl = this._createContext(webglAttributes);
        if (!gl) {
            throw new Error('This browser or hardware does not support WebGL.');
        }
        this._context = debug ? WebGLDebugUtils.makeDebugContext(gl, throwOnGlError, logAndValidate, gl) : gl;
        this._contextLost = this._context.isContextLost();
        if (this._contextLost) {
            this._restoreContext();
        }
        if (clearColor) {
            this.clearColor.copy(clearColor);
        }
        this._rootRenderTarget = new RenderTarget(width, height, true);
        this._renderTarget = this._rootRenderTarget;
        this._cursor = this._canvas.style.cursor;
        this._onContextLostHandler = this._onContextLost.bind(this);
        this._onContextRestoredHandler = this._onContextRestored.bind(this);
        this._setupContext();
        this._addEvents();
        this.addRenderer(RendererType.Sprite, new SpriteRenderer(spriteRendererBatchSize));
        this.addRenderer(RendererType.Particle, new ParticleRenderer(particleRendererBatchSize));
        this.addRenderer(RendererType.Primitive, new PrimitiveRenderer(primitiveRendererBatchSize));
        this._bindRenderTarget(this._renderTarget);
        this.setBlendMode(BlendModes.Normal);
        this.resize(width, height);
    }
    get context() {
        return this._context;
    }
    get renderTarget() {
        return this._renderTarget;
    }
    get view() {
        return this._renderTarget.view;
    }
    get texture() {
        return this._texture;
    }
    get vao() {
        return this._vao;
    }
    set vao(vao) {
        this.setVao(vao);
    }
    get renderer() {
        return this._renderer;
    }
    set renderer(renderer) {
        this.setRenderer(renderer);
    }
    get shader() {
        return this._shader;
    }
    set shader(shader) {
        this.setShader(shader);
    }
    get blendMode() {
        return this._blendMode;
    }
    set blendMode(blendMode) {
        this.setBlendMode(blendMode);
    }
    get textureUnit() {
        return this._textureUnit;
    }
    set textureUnit(textureUnit) {
        this.setTextureUnit(textureUnit);
    }
    get clearColor() {
        return this._clearColor;
    }
    set clearColor(color) {
        this.setClearColor(color);
    }
    get cursor() {
        return this._cursor;
    }
    set cursor(cursor) {
        this.setCursor(cursor);
    }
    async initialize() {
        return this;
    }
    setRenderTarget(target) {
        const renderTarget = target || this._rootRenderTarget;
        if (this._renderTarget !== renderTarget) {
            this._renderTarget = renderTarget;
        }
        this._bindRenderTarget(renderTarget);
        return this;
    }
    setView(view) {
        this._renderTarget.setView(view);
        this._bindRenderTarget(this._renderTarget);
        return this;
    }
    setVao(vao) {
        if (this._vao !== vao) {
            if (vao) {
                vao.bind();
            }
            if (this._vao) {
                this._vao.unbind();
            }
            this._vao = vao;
        }
        return this;
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
        if (this._shader !== shader) {
            if (this._shader) {
                this._shader.unbind();
                this._shader = null;
            }
            if (shader) {
                shader.bind();
            }
            this._shader = shader;
        }
        return this;
    }
    setTexture(texture, unit) {
        if (unit !== undefined) {
            this.setTextureUnit(unit);
        }
        if (texture === null) {
            if (this._texture !== null) {
                this._context.bindTexture(this._context.TEXTURE_2D, null);
                this._texture = null;
            }
            return this;
        }
        const textureState = this._syncTexture(texture);
        this._context.bindTexture(this._context.TEXTURE_2D, textureState.handle);
        this._texture = texture;
        return this;
    }
    setBlendMode(blendMode) {
        if (blendMode !== this._blendMode) {
            const gl = this._context;
            this._blendMode = blendMode;
            switch (blendMode) {
                case BlendModes.Additive:
                    gl.blendFunc(gl.ONE, gl.ONE);
                    break;
                case BlendModes.Subtract:
                    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                    break;
                case BlendModes.Multiply:
                    gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case BlendModes.Screen:
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
                    break;
                default:
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;
            }
        }
        return this;
    }
    setTextureUnit(unit) {
        if (this._textureUnit !== unit) {
            const gl = this._context;
            this._textureUnit = unit;
            gl.activeTexture(gl.TEXTURE0 + unit);
        }
        return this;
    }
    setClearColor(color) {
        if (!this._clearColor.equals(color)) {
            const gl = this._context;
            this._clearColor.copy(color);
            gl.clearColor(color.r / 255, color.g / 255, color.b / 255, color.a);
        }
        return this;
    }
    setCursor(cursor) {
        const source = (cursor instanceof Texture) ? cursor.source : cursor;
        if (source === null) {
            throw new Error('Provided Texture has no source.');
        }
        this._cursor = typeof source === 'string' ? source : `url(${canvasSourceToDataUrl(source)})`;
        this._canvas.style.cursor = this._cursor;
        return this;
    }
    addRenderer(name, renderer) {
        if (this._renderers.has(name)) {
            throw new Error(`Renderer "${name}" was already added.`);
        }
        this._renderers.set(name, renderer);
        return this;
    }
    getRenderer(name) {
        const renderer = this._renderers.get(name);
        if (!renderer) {
            throw new Error(`Could not find renderer "${name}".`);
        }
        return renderer;
    }
    clear(color) {
        const gl = this._context;
        if (color) {
            this.setClearColor(color);
        }
        this._bindRenderTarget(this._renderTarget);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return this;
    }
    resize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
        this._rootRenderTarget.resize(width, height);
        this._bindRenderTarget(this._renderTarget);
        return this;
    }
    display() {
        if (this._renderer && !this._contextLost) {
            this._bindRenderTarget(this._renderTarget);
            this._renderer.flush();
        }
        return this;
    }
    destroy() {
        this._removeEvents();
        this.setRenderTarget(null);
        this.setRenderer(null);
        this.setVao(null);
        this.setShader(null);
        this.setTexture(null);
        for (const renderer of this._renderers.values()) {
            renderer.destroy();
        }
        this._renderers.clear();
        this._clearColor.destroy();
        this._destroyManagedResources();
        this._rootRenderTarget.destroy();
        this._vao = null;
        this._renderer = null;
        this._shader = null;
        this._blendMode = null;
        this._texture = null;
        this._boundFramebuffer = null;
    }
    _createContext(options) {
        try {
            return this._canvas.getContext('webgl2', options);
        }
        catch (e) {
            return null;
        }
    }
    _restoreContext() {
        this._context.getExtension('WEBGL_lose_context')?.restoreContext();
    }
    _setupContext() {
        const gl = this._context;
        const { r, g, b, a } = this._clearColor;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.clearColor(r / 255, g / 255, b / 255, a);
    }
    _addEvents() {
        this._canvas.addEventListener('webglcontextlost', this._onContextLostHandler, false);
        this._canvas.addEventListener('webglcontextrestored', this._onContextRestoredHandler, false);
    }
    _removeEvents() {
        this._canvas.removeEventListener('webglcontextlost', this._onContextLostHandler, false);
        this._canvas.removeEventListener('webglcontextrestored', this._onContextRestoredHandler, false);
    }
    _onContextLost() {
        this._contextLost = true;
        this._restoreContext();
    }
    _onContextRestored() {
        this._contextLost = false;
    }
    _createFramebuffer() {
        const framebuffer = this._context.createFramebuffer();
        if (framebuffer === null) {
            throw new Error('Could not create framebuffer.');
        }
        return framebuffer;
    }
    _createTextureHandle() {
        const texture = this._context.createTexture();
        if (texture === null) {
            throw new Error('Could not create texture.');
        }
        return texture;
    }
    _destroyManagedResources() {
        for (const renderTarget of Array.from(this._renderTargetStates.keys())) {
            this._evictRenderTarget(renderTarget, false);
        }
        for (const texture of Array.from(this._textureStates.keys())) {
            this._evictTexture(texture, false);
        }
    }
    _getRenderTargetState(target) {
        let state = this._renderTargetStates.get(target);
        if (!state) {
            this._subscribeToDestroy(target, this._renderTargetDestroyHandlers, () => {
                this._evictRenderTarget(target, true);
            });
            state = {
                framebuffer: target.root ? null : this._createFramebuffer(),
                version: -1,
                attachedTexture: null,
            };
            this._renderTargetStates.set(target, state);
        }
        return state;
    }
    _getTextureState(texture) {
        let state = this._textureStates.get(texture);
        if (!state) {
            this._subscribeToDestroy(texture, this._textureDestroyHandlers, () => {
                this._evictTexture(texture, true);
            });
            state = {
                handle: this._createTextureHandle(),
                version: -1,
                width: 0,
                height: 0,
            };
            this._textureStates.set(texture, state);
        }
        return state;
    }
    _subscribeToDestroy(descriptor, handlers, handler) {
        if (!handlers.has(descriptor)) {
            descriptor.addDestroyListener(handler);
            handlers.set(descriptor, handler);
        }
    }
    _unsubscribeFromDestroy(descriptor, handlers) {
        const handler = handlers.get(descriptor);
        if (handler) {
            descriptor.removeDestroyListener(handler);
            handlers.delete(descriptor);
        }
    }
    _evictRenderTarget(target, rebind) {
        const state = this._renderTargetStates.get(target);
        this._unsubscribeFromDestroy(target, this._renderTargetDestroyHandlers);
        if (target instanceof RenderTexture) {
            this._evictTexture(target, false);
        }
        if (state) {
            if (this._boundFramebuffer === state.framebuffer) {
                this._context.bindFramebuffer(this._context.FRAMEBUFFER, null);
                this._boundFramebuffer = null;
            }
            if (state.framebuffer !== null) {
                this._context.deleteFramebuffer(state.framebuffer);
            }
            this._renderTargetStates.delete(target);
        }
        if (this._renderTarget === target) {
            this._renderTarget = this._rootRenderTarget;
            if (rebind) {
                this._bindRenderTarget(this._rootRenderTarget);
            }
        }
    }
    _evictTexture(texture, rebind) {
        const state = this._textureStates.get(texture);
        this._unsubscribeFromDestroy(texture, this._textureDestroyHandlers);
        if (state) {
            if (this._texture === texture) {
                this._context.bindTexture(this._context.TEXTURE_2D, null);
                this._texture = null;
            }
            this._context.deleteTexture(state.handle);
            this._textureStates.delete(texture);
        }
        if (this._texture === texture) {
            this._texture = null;
        }
        if (rebind && this._texture !== null) {
            this.setTexture(this._texture);
        }
    }
    _bindRenderTarget(target) {
        const state = this._prepareRenderTarget(target);
        if (this._boundFramebuffer !== state.framebuffer || state.version !== target.version) {
            const gl = this._context;
            const { x, y, width, height } = target.getViewport();
            gl.bindFramebuffer(gl.FRAMEBUFFER, state.framebuffer);
            gl.viewport(x, y, width, height);
            this._boundFramebuffer = state.framebuffer;
            state.version = target.version;
        }
    }
    _prepareRenderTarget(target) {
        const state = this._getRenderTargetState(target);
        if (target instanceof RenderTexture && state.framebuffer) {
            const previousFramebuffer = this._boundFramebuffer;
            const textureState = this._syncTexture(target);
            if (state.attachedTexture !== textureState.handle) {
                const gl = this._context;
                gl.bindFramebuffer(gl.FRAMEBUFFER, state.framebuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureState.handle, 0);
                gl.bindFramebuffer(gl.FRAMEBUFFER, previousFramebuffer);
                state.attachedTexture = textureState.handle;
            }
        }
        return state;
    }
    _syncTexture(texture) {
        const gl = this._context;
        const state = this._getTextureState(texture);
        const version = texture instanceof RenderTexture ? texture.textureVersion : texture.version;
        gl.bindTexture(gl.TEXTURE_2D, state.handle);
        if (state.version !== version) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texture.wrapMode);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texture.wrapMode);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
            if (texture instanceof RenderTexture) {
                if (state.version === -1 || state.width !== texture.width || state.height !== texture.height || texture.source === null) {
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texture.width, texture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
                }
                else {
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, texture.width, texture.height, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
                }
            }
            else if (texture.source) {
                if (state.version === -1 || state.width !== texture.width || state.height !== texture.height) {
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
                }
                else {
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
                }
            }
            if (texture.generateMipMap && (texture instanceof RenderTexture || texture.source !== null)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            state.version = version;
            state.width = texture.width;
            state.height = texture.height;
        }
        return state;
    }
}

class Sampler {
    constructor(gl, options) {
        const { scaleMode, wrapMode, premultiplyAlpha, generateMipMap, flipY } = options;
        this._context = gl;
        this._sampler = gl.createSampler();
        this._scaleMode = scaleMode;
        this._wrapMode = wrapMode;
        this._premultiplyAlpha = premultiplyAlpha;
        this._generateMipMap = generateMipMap;
        this._flipY = flipY;
        this.updateWrapModeParameters();
        this.updateScaleModeParameters();
    }
    get sampler() {
        return this._sampler;
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
    setScaleMode(scaleMode) {
        if (this._scaleMode !== scaleMode) {
            this._scaleMode = scaleMode;
            this.updateScaleModeParameters();
        }
        return this;
    }
    setWrapMode(wrapMode) {
        if (this._wrapMode !== wrapMode) {
            this._wrapMode = wrapMode;
            this.updateWrapModeParameters();
        }
        return this;
    }
    bind(textureUnit) {
        this._context.bindSampler(textureUnit, this._sampler);
        return this;
    }
    destroy() {
        this._context.deleteSampler(this._sampler);
    }
    updateScaleModeParameters() {
        if (this._sampler === null) {
            throw new Error('Sampler is null. Could not update sampler parameters.');
        }
        const gl = this._context;
        gl.samplerParameteri(this._sampler, gl.TEXTURE_MAG_FILTER, this._scaleMode);
        gl.samplerParameteri(this._sampler, gl.TEXTURE_MIN_FILTER, this._scaleMode);
    }
    updateWrapModeParameters() {
        if (this._sampler === null) {
            throw new Error('Sampler is null. Could not update sampler parameters.');
        }
        const gl = this._context;
        gl.samplerParameteri(this._sampler, gl.TEXTURE_WRAP_S, this._wrapMode);
        gl.samplerParameteri(this._sampler, gl.TEXTURE_WRAP_T, this._wrapMode);
    }
}

export { AbstractRenderer, ParticleRenderer, PrimitiveRenderer, RenderManager, Sampler, ShaderBlock, SpriteRenderer, createWebGlShaderRuntime };
//# sourceMappingURL=webgl2.esm.js.map
