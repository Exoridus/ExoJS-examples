let temp$9 = null;
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
        if (temp$9 === null) {
            temp$9 = new Size();
        }
        return temp$9;
    }
}
Size.zero = new Size(0, 0);

const limit = (2 ** 32) - 1;
class Random {
    constructor(seed = Date.now()) {
        this._state = new Uint32Array(624);
        this._iteration = 0;
        this._seed = 0;
        this._value = 0;
        this.setSeed(seed);
        this._twist();
    }
    get seed() {
        return this._seed;
    }
    get value() {
        return this._value;
    }
    get iteration() {
        return this._iteration;
    }
    setSeed(seed) {
        this._seed = seed;
        this.reset();
        return this;
    }
    reset() {
        this._state[0] = this._seed;
        for (let i = 1; i < 624; i++) {
            const s = this._state[i - 1] ^ (this._state[i - 1] >>> 30);
            this._state[i] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + i;
            this._state[i] |= 0;
        }
        this._iteration = 0;
        return this;
    }
    next(min = 0, max = 1) {
        if (this._iteration >= 624) {
            this._twist();
        }
        this._value = this._state[this._iteration++];
        this._value ^= (this._value >>> 11);
        this._value ^= (this._value << 7) & 0x9d2c5680;
        this._value ^= (this._value << 15) & 0xefc60000;
        this._value ^= (this._value >>> 18);
        this._value = (((this._value >>> 0) / limit) * (max - min)) + min;
        return this._value;
    }
    destroy() {
        // todo - check if destroy is needed
    }
    _twist() {
        const state = this._state;
        // first 624-397=227 words
        for (let i = 0; i < 227; i++) {
            const bits = (state[i] & 0x80000000) | (state[i + 1] & 0x7fffffff);
            state[i] = state[i + 397] ^ (bits >>> 1) ^ ((bits & 1) * 0x9908b0df);
        }
        // remaining words (except the very last one)
        for (let i = 227; i < 623; i++) {
            const bits = (state[i] & 0x80000000) | (state[i + 1] & 0x7fffffff);
            state[i] = state[i - 227] ^ (bits >>> 1) ^ ((bits & 1) * 0x9908b0df);
        }
        // last word is computed pretty much the same way, but i + 1 must wrap around to 0
        const bits = (state[623] & 0x80000000) | (state[0] & 0x7fffffff);
        state[623] = state[396] ^ (bits >>> 1) ^ ((bits & 1) * 0x9908b0df);
        // word used for next random number
        this._iteration = 0;
        this._value = 0;
    }
}

let temp$8 = null;
class Time {
    constructor(time = 0, factor = Time.milliseconds) {
        this._milliseconds = time * factor;
    }
    get milliseconds() {
        return this._milliseconds;
    }
    set milliseconds(milliseconds) {
        this._milliseconds = milliseconds;
    }
    get seconds() {
        return this._milliseconds / Time.seconds;
    }
    set seconds(seconds) {
        this._milliseconds = seconds * Time.seconds;
    }
    get minutes() {
        return this._milliseconds / Time.minutes;
    }
    set minutes(minutes) {
        this._milliseconds = minutes * Time.minutes;
    }
    get hours() {
        return this._milliseconds / Time.hours;
    }
    set hours(hours) {
        this._milliseconds = hours * Time.hours;
    }
    set(time = 0, factor = Time.milliseconds) {
        this._milliseconds = time * factor;
        return this;
    }
    setMilliseconds(milliseconds) {
        this.milliseconds = milliseconds;
        return this;
    }
    setSeconds(seconds) {
        this.seconds = seconds;
        return this;
    }
    setMinutes(minutes) {
        this.minutes = minutes;
        return this;
    }
    setHours(hours) {
        this.hours = hours;
        return this;
    }
    equals({ milliseconds, seconds, minutes, hours } = {}) {
        return (milliseconds === undefined || this.milliseconds === milliseconds)
            && (seconds === undefined || this.seconds === seconds)
            && (minutes === undefined || this.minutes === minutes)
            && (hours === undefined || this.hours === hours);
    }
    greaterThan(time) {
        return this._milliseconds > time.milliseconds;
    }
    lessThan(time) {
        return this._milliseconds < time.milliseconds;
    }
    clone() {
        return new Time(this._milliseconds);
    }
    copy(time) {
        this._milliseconds = time.milliseconds;
        return this;
    }
    add(value = 0, factor = Time.milliseconds) {
        this._milliseconds += (value * factor);
        return this;
    }
    addTime(time) {
        this._milliseconds += time.milliseconds;
        return this;
    }
    subtract(value = 0, factor = Time.milliseconds) {
        this._milliseconds -= (value * factor);
        return this;
    }
    subtractTime(time) {
        this._milliseconds -= time.milliseconds;
        return this;
    }
    destroy() {
        // todo - check if destroy is needed
    }
    static get temp() {
        if (temp$8 === null) {
            temp$8 = new Time();
        }
        return temp$8;
    }
}
Time.milliseconds = 1;
Time.seconds = 1000;
Time.minutes = 60000;
Time.hours = 3600000;
Time.zero = new Time(0);
Time.oneMillisecond = new Time(1);
Time.oneSecond = new Time(1, Time.seconds);
Time.oneMinute = new Time(1, Time.minutes);
Time.oneHour = new Time(1, Time.hours);

const codecNotSupportedPattern = /^no$/;
let internalAudioElement = null;
let internalCanvasElement = null;
let internalCanvasContext = null;
let internalRandom = null;
let supportsEventOptionsValue = null;
const canUseDocument$1 = () => typeof document !== 'undefined';
const canUseWindow = () => typeof window !== 'undefined';
const getAudioElement = () => {
    if (!canUseDocument$1()) {
        throw new Error('Audio codec detection requires a document context.');
    }
    if (internalAudioElement === null) {
        internalAudioElement = document.createElement('audio');
    }
    return internalAudioElement;
};
const getCanvasElement = () => {
    if (!canUseDocument$1()) {
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
const getRandom = () => {
    if (internalRandom === null) {
        internalRandom = new Random();
    }
    return internalRandom;
};
const rand = (min, max) => getRandom().next(min, max);
const noop$1 = () => { };
const stopEvent = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
};
const supportsWebAudio = typeof AudioContext !== 'undefined';
const supportsIndexedDb = typeof indexedDB !== 'undefined';
const supportsTouchEvents = canUseWindow() && 'ontouchstart' in window;
const supportsPointerEvents = typeof PointerEvent !== 'undefined';
const supportsEventOptions = () => {
    if (supportsEventOptionsValue !== null) {
        return supportsEventOptionsValue;
    }
    if (!canUseWindow()) {
        supportsEventOptionsValue = false;
        return supportsEventOptionsValue;
    }
    let supportsPassive = false;
    try {
        window.addEventListener('test', noop$1, {
            get passive() {
                supportsPassive = true;
                return false;
            }
        });
        window.removeEventListener('test', noop$1);
    }
    catch (e) {
        // do nothing
    }
    supportsEventOptionsValue = supportsPassive;
    return supportsEventOptionsValue;
};
const getPreciseTime = () => performance.now();
const milliseconds = (value) => new Time(value, Time.milliseconds);
const seconds = (value) => new Time(value, Time.seconds);
const minutes = (value) => new Time(value, Time.minutes);
const hours = (value) => new Time(value, Time.hours);
const emptyArrayBuffer = new ArrayBuffer(0);
const removeArrayItems = (array, startIndex, amount) => {
    if (startIndex < array.length && amount > 0) {
        const removeCount = (startIndex + amount > array.length)
            ? (array.length - startIndex)
            : amount;
        const newLen = (array.length - removeCount);
        for (let i = startIndex; i < newLen; i++) {
            array[i] = array[i + removeCount];
        }
        array.length = newLen;
    }
    return array;
};
const supportsCodec = (...codecs) => codecs.some((codec) => getAudioElement().canPlayType(codec).replace(codecNotSupportedPattern, ''));
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

class Clock {
    constructor(startTime = Time.zero, autoStart = false) {
        this._elapsedTime = new Time(0);
        this._running = false;
        this._startTime = startTime.clone();
        if (autoStart) {
            this.start();
        }
    }
    get running() {
        return this._running;
    }
    get elapsedTime() {
        if (this._running) {
            const now = getPreciseTime();
            this._elapsedTime.add(now - this._startTime.milliseconds);
            this._startTime.milliseconds = now;
        }
        return this._elapsedTime;
    }
    get elapsedMilliseconds() {
        return this.elapsedTime.milliseconds;
    }
    get elapsedSeconds() {
        return this.elapsedTime.seconds;
    }
    get elapsedMinutes() {
        return this.elapsedTime.minutes;
    }
    get elapsedHours() {
        return this.elapsedTime.hours;
    }
    start() {
        if (!this._running) {
            this._running = true;
            this._startTime.milliseconds = getPreciseTime();
        }
        return this;
    }
    stop() {
        if (this._running) {
            this._running = false;
            this._elapsedTime.add(getPreciseTime() - this._startTime.milliseconds);
        }
        return this;
    }
    reset() {
        this._running = false;
        this._elapsedTime.setMilliseconds(0);
        return this;
    }
    restart() {
        this.reset();
        this.start();
        return this;
    }
    destroy() {
        this._startTime.destroy();
        this._elapsedTime.destroy();
    }
}

class Signal {
    constructor() {
        this._bindings = new Array();
    }
    get bindings() {
        return this._bindings;
    }
    has(handler, context) {
        return this._bindings.some((binding) => (binding.handler === handler && binding.context === context));
    }
    add(handler, context) {
        if (!this.has(handler, context)) {
            this._bindings.push({ handler, context });
        }
        return this;
    }
    once(handler, context) {
        const once = (...params) => {
            this.remove(once, context);
            handler.call(context, ...params);
        };
        this.add(once, context);
        return this;
    }
    remove(handler, context) {
        const index = this._bindings.findIndex((binding) => (binding.handler === handler && binding.context === context));
        if (index !== -1) {
            removeArrayItems(this._bindings, index, 1);
        }
        return this;
    }
    clearByContext(context) {
        const bindings = this._bindings.filter(binding => binding.context === context);
        for (const binding of bindings) {
            removeArrayItems(this._bindings, this._bindings.indexOf(binding), 1);
        }
        return this;
    }
    clear() {
        this._bindings.length = 0;
        return this;
    }
    dispatch(...params) {
        if (this._bindings.length) {
            for (const binding of this._bindings) {
                if (binding.handler.call(binding.context, ...params) === false) {
                    break;
                }
            }
        }
        return this;
    }
    destroy() {
        this.clear();
    }
}

class SceneManager {
    constructor(app) {
        this._scene = null;
        this.onChangeScene = new Signal();
        this.onStartScene = new Signal();
        this.onUpdateScene = new Signal();
        this.onStopScene = new Signal();
        this._app = app;
    }
    get scene() {
        return this._scene;
    }
    set scene(scene) {
        this.setScene(scene);
    }
    async setScene(scene) {
        if (scene === this._scene) {
            return this;
        }
        await this._unloadScene();
        if (scene === null) {
            this.onChangeScene.dispatch(null);
            return this;
        }
        scene.app = this._app;
        try {
            await scene.load(this._app.loader);
            await scene.init(this._app.loader);
        }
        catch (error) {
            let cleanupError = null;
            try {
                await scene.unload(this._app.loader);
            }
            catch (unloadError) {
                cleanupError = unloadError;
            }
            scene.destroy();
            if (cleanupError) {
                const initMessage = error instanceof Error ? error.message : String(error);
                const cleanupMessage = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
                throw new Error(`Failed to initialize scene: ${initMessage}. Cleanup also failed: ${cleanupMessage}.`);
            }
            throw error;
        }
        this._scene = scene;
        this.onChangeScene.dispatch(scene);
        this.onStartScene.dispatch(scene);
        return this;
    }
    update(delta) {
        if (this._scene !== null) {
            this._scene.update(delta);
            this._scene.draw(this._app.renderManager);
            this.onUpdateScene.dispatch(this._scene);
        }
        return this;
    }
    destroy() {
        void this._unloadScene().catch((error) => {
            console.error('SceneManager.destroy() failed to unload the active scene.', error);
        });
        this.onChangeScene.destroy();
        this.onStartScene.destroy();
        this.onUpdateScene.destroy();
        this.onStopScene.destroy();
    }
    async _unloadScene() {
        if (this._scene !== null) {
            this.onStopScene.dispatch(this._scene);
            await this._scene.unload(this._app.loader);
            this._scene.destroy();
            this._scene = null;
        }
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

const WebGLDebugUtils = function() {

    /**
     * Wrapped logging function.
     * @param {string} msg Message to log.
     */
    var log = function(msg) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    };

    /**
     * Wrapped error logging function.
     * @param {string} msg Message to log.
     */
    var error = function(msg) {
        if (window.console && window.console.error) {
            window.console.error(msg);
        } else {
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

        'enable': {1: { 0:true }},
        'disable': {1: { 0:true }},
        'getParameter': {1: { 0:true }},

        // Rendering

        'drawArrays': {3:{ 0:true }},
        'drawElements': {4:{ 0:true, 2:true }},

        // Shaders

        'createShader': {1: { 0:true }},
        'getShaderParameter': {2: { 1:true }},
        'getProgramParameter': {2: { 1:true }},
        'getShaderPrecisionFormat': {2: { 0: true, 1:true }},

        // Vertex attributes

        'getVertexAttrib': {2: { 1:true }},
        'vertexAttribPointer': {6: { 2:true }},

        // Textures

        'bindTexture': {2: { 0:true }},
        'activeTexture': {1: { 0:true }},
        'getTexParameter': {2: { 0:true, 1:true }},
        'texParameterf': {3: { 0:true, 1:true }},
        'texParameteri': {3: { 0:true, 1:true, 2:true }},
        // texImage2D and texSubImage2D are defined below with WebGL 2 entrypoints
        'copyTexImage2D': {8: { 0:true, 2:true }},
        'copyTexSubImage2D': {8: { 0:true }},
        'generateMipmap': {1: { 0:true }},
        // compressedTexImage2D and compressedTexSubImage2D are defined below with WebGL 2 entrypoints

        // Buffer objects

        'bindBuffer': {2: { 0:true }},
        // bufferData and bufferSubData are defined below with WebGL 2 entrypoints
        'getBufferParameter': {2: { 0:true, 1:true }},

        // Renderbuffers and framebuffers

        'pixelStorei': {2: { 0:true, 1:true }},
        // readPixels is defined below with WebGL 2 entrypoints
        'bindRenderbuffer': {2: { 0:true }},
        'bindFramebuffer': {2: { 0:true }},
        'checkFramebufferStatus': {1: { 0:true }},
        'framebufferRenderbuffer': {4: { 0:true, 1:true, 2:true }},
        'framebufferTexture2D': {5: { 0:true, 1:true, 2:true }},
        'getFramebufferAttachmentParameter': {3: { 0:true, 1:true, 2:true }},
        'getRenderbufferParameter': {2: { 0:true, 1:true }},
        'renderbufferStorage': {4: { 0:true, 1:true }},

        // Frame buffer operations (clear, blend, depth test, stencil)

        'clear': {1: { 0: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] }}},
        'depthFunc': {1: { 0:true }},
        'blendFunc': {2: { 0:true, 1:true }},
        'blendFuncSeparate': {4: { 0:true, 1:true, 2:true, 3:true }},
        'blendEquation': {1: { 0:true }},
        'blendEquationSeparate': {2: { 0:true, 1:true }},
        'stencilFunc': {3: { 0:true }},
        'stencilFuncSeparate': {4: { 0:true, 1:true }},
        'stencilMaskSeparate': {2: { 0:true }},
        'stencilOp': {3: { 0:true, 1:true, 2:true }},
        'stencilOpSeparate': {4: { 0:true, 1:true, 2:true, 3:true }},

        // Culling

        'cullFace': {1: { 0:true }},
        'frontFace': {1: { 0:true }},

        // ANGLE_instanced_arrays extension

        'drawArraysInstancedANGLE': {4: { 0:true }},
        'drawElementsInstancedANGLE': {5: { 0:true, 2:true }},

        // EXT_blend_minmax extension

        'blendEquationEXT': {1: { 0:true }},

        // WebGL 2 Buffer objects

        'bufferData': {
            3: { 0:true, 2:true }, // WebGL 1
            4: { 0:true, 2:true }, // WebGL 2
            5: { 0:true, 2:true }  // WebGL 2
        },
        'bufferSubData': {
            3: { 0:true }, // WebGL 1
            4: { 0:true }, // WebGL 2
            5: { 0:true }  // WebGL 2
        },
        'copyBufferSubData': {5: { 0:true, 1:true }},
        'getBufferSubData': {3: { 0:true }, 4: { 0:true }, 5: { 0:true }},

        // WebGL 2 Framebuffer objects

        'blitFramebuffer': {10: { 8: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] }, 9:true }},
        'framebufferTextureLayer': {5: { 0:true, 1:true }},
        'invalidateFramebuffer': {2: { 0:true }},
        'invalidateSubFramebuffer': {6: { 0:true }},
        'readBuffer': {1: { 0:true }},

        // WebGL 2 Renderbuffer objects

        'getInternalformatParameter': {3: { 0:true, 1:true, 2:true }},
        'renderbufferStorageMultisample': {5: { 0:true, 2:true }},

        // WebGL 2 Texture objects

        'texStorage2D': {5: { 0:true, 2:true }},
        'texStorage3D': {6: { 0:true, 2:true }},
        'texImage2D': {
            9: { 0:true, 2:true, 6:true, 7:true }, // WebGL 1 & 2
            6: { 0:true, 2:true, 3:true, 4:true }, // WebGL 1
            10: { 0:true, 2:true, 6:true, 7:true } // WebGL 2
        },
        'texImage3D': {
            10: { 0:true, 2:true, 7:true, 8:true },
            11: { 0:true, 2:true, 7:true, 8:true }
        },
        'texSubImage2D': {
            9: { 0:true, 6:true, 7:true }, // WebGL 1 & 2
            7: { 0:true, 4:true, 5:true }, // WebGL 1
            10: { 0:true, 6:true, 7:true } // WebGL 2
        },
        'texSubImage3D': {
            11: { 0:true, 8:true, 9:true },
            12: { 0:true, 8:true, 9:true }
        },
        'copyTexSubImage3D': {9: { 0:true }},
        'compressedTexImage2D': {
            7: { 0: true, 2:true }, // WebGL 1 & 2
            8: { 0: true, 2:true }, // WebGL 2
            9: { 0: true, 2:true }  // WebGL 2
        },
        'compressedTexImage3D': {
            8: { 0: true, 2:true },
            9: { 0: true, 2:true },
            10: { 0: true, 2:true }
        },
        'compressedTexSubImage2D': {
            8: { 0: true, 6:true }, // WebGL 1 & 2
            9: { 0: true, 6:true }, // WebGL 2
            10: { 0: true, 6:true } // WebGL 2
        },
        'compressedTexSubImage3D': {
            10: { 0: true, 8:true },
            11: { 0: true, 8:true },
            12: { 0: true, 8:true }
        },

        // WebGL 2 Vertex attribs

        'vertexAttribIPointer': {5: { 2:true }},

        // WebGL 2 Writing to the drawing buffer

        'drawArraysInstanced': {4: { 0:true }},
        'drawElementsInstanced': {5: { 0:true, 2:true }},
        'drawRangeElements': {6: { 0:true, 4:true }},

        // WebGL 2 Reading back pixels

        'readPixels': {
            7: { 4:true, 5:true }, // WebGL 1 & 2
            8: { 4:true, 5:true }  // WebGL 2
        },

        // WebGL 2 Multiple Render Targets

        'clearBufferfv': {3: { 0:true }, 4: { 0:true }},
        'clearBufferiv': {3: { 0:true }, 4: { 0:true }},
        'clearBufferuiv': {3: { 0:true }, 4: { 0:true }},
        'clearBufferfi': {4: { 0:true }},

        // WebGL 2 Query objects

        'beginQuery': {2: { 0:true }},
        'endQuery': {1: { 0:true }},
        'getQuery': {2: { 0:true, 1:true }},
        'getQueryParameter': {2: { 1:true }},

        // WebGL 2 Sampler objects

        'samplerParameteri': {3: { 1:true, 2:true }},
        'samplerParameterf': {3: { 1:true }},
        'getSamplerParameter': {2: { 1:true }},

        // WebGL 2 Sync objects

        'fenceSync': {2: { 0:true, 1: { 'enumBitwiseOr': [] } }},
        'clientWaitSync': {3: { 1: { 'enumBitwiseOr': ['SYNC_FLUSH_COMMANDS_BIT'] } }},
        'waitSync': {3: { 1: { 'enumBitwiseOr': [] } }},
        'getSyncParameter': {2: { 1:true }},

        // WebGL 2 Transform Feedback

        'bindTransformFeedback': {2: { 0:true }},
        'beginTransformFeedback': {1: { 0:true }},
        'transformFeedbackVaryings': {3: { 2:true }},

        // WebGL2 Uniform Buffer Objects and Transform Feedback Buffers

        'bindBufferBase': {3: { 0:true }},
        'bindBufferRange': {5: { 0:true }},
        'getIndexedParameter': {2: { 0:true }},
        'getActiveUniforms': {3: { 2:true }},
        'getActiveUniformBlockParameter': {3: { 2:true }}
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
            glEnums = { };
            enumStringToValue = { };
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
                        } else {
                            return glEnumToString(value);
                        }
                    } else {
                        return glEnumToString(value);
                    }
                }
            }
        }
        if (value === null) {
            return "null";
        } else if (value === undefined) {
            return "undefined";
        } else {
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
        wrapper.__defineGetter__(propertyName, function() {
            return original[propertyName];
        });
        // TODO(gmane): this needs to handle properties that take more than
        // one value?
        wrapper.__defineSetter__(propertyName, function(value) {
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
        opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
            // apparently we can't do args.join(",");
            var argStr = "";
            var numArgs = args.length;
            for (var ii = 0; ii < numArgs; ++ii) {
                argStr += ((ii == 0) ? '' : ', ') +
                    glFunctionArgToString(functionName, numArgs, ii, args[ii]);
            }
            error("WebGL error "+ glEnumToString(err) + " in "+ functionName +
                "(" + argStr + ")");
        };

        // Holds booleans for each GL error so after we get the error ourselves
        // we can still return it to the client app.
        var glErrorShadow = { };

        // Makes a function that calls a WebGL function and then calls getError.
        function makeErrorWrapper(ctx, functionName) {
            return function() {
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
                } else {
                    var wrapped = makeErrorWrapper(ctx, propertyName);
                    wrapper[propertyName] = function () {
                        var result = wrapped.apply(ctx, arguments);
                        if (!result) {
                            return null;
                        }
                        return makeDebugContext(result, opt_onErrorFunc, opt_onFunc, opt_err_ctx);
                    };
                }
            } else {
                makePropertyWrapper(wrapper, ctx, propertyName);
            }
        }

        // Override the getError function with one that returns our saved results.
        wrapper.getError = function() {
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
        while(ctx.getError());
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
        var glErrorShadow_ = { };

        canvas.getContext = function(f) {
            return function() {
                var ctx = f.apply(canvas, arguments);
                // Did we get a context and is it a WebGL context?
                if ((ctx instanceof WebGLRenderingContext) || (window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext))) {
                    if (ctx != unwrappedContext_) {
                        if (unwrappedContext_) {
                            throw "got different context"
                        }
                        isWebGL2RenderingContext = window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext);
                        unwrappedContext_ = ctx;
                        wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
                    }
                    return wrappedContext_;
                }
                return ctx;
            }
        }(canvas.getContext);

        function wrapEvent(listener) {
            if (typeof(listener) == "function") {
                return listener;
            } else {
                return function(info) {
                    listener.handleEvent(info);
                }
            }
        }

        var addOnContextLostListener = function(listener) {
            onLost_.push(wrapEvent(listener));
        };

        var addOnContextRestoredListener = function(listener) {
            onRestored_.push(wrapEvent(listener));
        };


        function wrapAddEventListener(canvas) {
            var f = canvas.addEventListener;
            canvas.addEventListener = function(type, listener, bubble) {
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

        canvas.loseContext = function() {
            if (!contextLost_) {
                contextLost_ = true;
                numCallsToLoseContext_ = 0;
                ++contextId_;
                while (unwrappedContext_.getError());
                clearErrors();
                glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
                var event = makeWebGLContextEvent("context lost");
                var callbacks = onLost_.slice();
                setTimeout(function() {
                    //log("numCallbacks:" + callbacks.length);
                    for (var ii = 0; ii < callbacks.length; ++ii) {
                        //log("calling callback:" + ii);
                        callbacks[ii](event);
                    }
                    if (restoreTimeout_ >= 0) {
                        setTimeout(function() {
                            canvas.restoreContext();
                        }, restoreTimeout_);
                    }
                }, 0);
            }
        };

        canvas.restoreContext = function() {
            if (contextLost_) {
                if (onRestored_.length) {
                    setTimeout(function() {
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

        canvas.loseContextInNCalls = function(numCalls) {
            if (contextLost_) {
                throw "You can not ask a lost contet to be lost";
            }
            numCallsToLoseContext_ = numCalls_ + numCalls;
        };

        canvas.getNumCalls = function() {
            return numCalls_;
        };

        canvas.setRestoreTimeout = function(timeout) {
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
            return function() {
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
                } else if (resource instanceof WebGLFramebuffer) {
                    unwrappedContext_.deleteFramebuffer(resource);
                } else if (resource instanceof WebGLProgram) {
                    unwrappedContext_.deleteProgram(resource);
                } else if (resource instanceof WebGLRenderbuffer) {
                    unwrappedContext_.deleteRenderbuffer(resource);
                } else if (resource instanceof WebGLShader) {
                    unwrappedContext_.deleteShader(resource);
                } else if (resource instanceof WebGLTexture) {
                    unwrappedContext_.deleteTexture(resource);
                }
                else if (isWebGL2RenderingContext) {
                    if (resource instanceof WebGLQuery) {
                        unwrappedContext_.deleteQuery(resource);
                    } else if (resource instanceof WebGLSampler) {
                        unwrappedContext_.deleteSampler(resource);
                    } else if (resource instanceof WebGLSync) {
                        unwrappedContext_.deleteSync(resource);
                    } else if (resource instanceof WebGLTransformFeedback) {
                        unwrappedContext_.deleteTransformFeedback(resource);
                    } else if (resource instanceof WebGLVertexArrayObject) {
                        unwrappedContext_.deleteVertexArray(resource);
                    }
                }
            }
        }

        function makeWebGLContextEvent(statusMessage) {
            return {
                statusMessage: statusMessage,
                preventDefault: function() {
                    canRestore_ = true;
                }
            };
        }

        return canvas;

        function makeLostContextSimulatingContext(ctx) {
            // copy all functions and properties to wrapper
            for (var propertyName in ctx) {
                if (typeof ctx[propertyName] == 'function') {
                    wrappedContext_[propertyName] = makeLostContextFunctionWrapper(
                        ctx, propertyName);
                } else {
                    makePropertyWrapper(wrappedContext_, ctx, propertyName);
                }
            }

            // Wrap a few functions specially.
            wrappedContext_.getError = function() {
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
                creationFunctions.push(
                    "createQuery",
                    "createSampler",
                    "fenceSync",
                    "createTransformFeedback",
                    "createVertexArray"
                );
            }
            for (var ii = 0; ii < creationFunctions.length; ++ii) {
                var functionName = creationFunctions[ii];
                wrappedContext_[functionName] = function(f) {
                    return function() {
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
                functionsThatShouldReturnNull.push(
                    "getInternalformatParameter",
                    "getQuery",
                    "getQueryParameter",
                    "getSamplerParameter",
                    "getSyncParameter",
                    "getTransformFeedbackVarying",
                    "getIndexedParameter",
                    "getUniformIndices",
                    "getActiveUniforms",
                    "getActiveUniformBlockParameter",
                    "getActiveUniformBlockName"
                );
            }
            for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
                var functionName = functionsThatShouldReturnNull[ii];
                wrappedContext_[functionName] = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return null;
                        }
                        return f.apply(ctx, arguments);
                    }
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
                isFunctions.push(
                    "isQuery",
                    "isSampler",
                    "isSync",
                    "isTransformFeedback",
                    "isVertexArray"
                );
            }
            for (var ii = 0; ii < isFunctions.length; ++ii) {
                var functionName = isFunctions[ii];
                wrappedContext_[functionName] = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return false;
                        }
                        return f.apply(ctx, arguments);
                    }
                }(wrappedContext_[functionName]);
            }

            wrappedContext_.checkFramebufferStatus = function(f) {
                return function() {
                    loseContextIfTime();
                    if (contextLost_) {
                        return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.checkFramebufferStatus);

            wrappedContext_.getAttribLocation = function(f) {
                return function() {
                    loseContextIfTime();
                    if (contextLost_) {
                        return -1;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.getAttribLocation);

            wrappedContext_.getVertexAttribOffset = function(f) {
                return function() {
                    loseContextIfTime();
                    if (contextLost_) {
                        return 0;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrappedContext_.getVertexAttribOffset);

            wrappedContext_.isContextLost = function() {
                return contextLost_;
            };

            if (isWebGL2RenderingContext) {
                wrappedContext_.getFragDataLocation = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return -1;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.getFragDataLocation);

                wrappedContext_.clientWaitSync = function(f) {
                    return function() {
                        loseContextIfTime();
                        if (contextLost_) {
                            return wrappedContext_.WAIT_FAILED;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.clientWaitSync);

                wrappedContext_.getUniformBlockIndex = function(f) {
                    return function() {
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

const tau = Math.PI * 2;
const radiansPerDegree = Math.PI / 180;
const degreesPerRadian = 180 / Math.PI;
const trimRotation = (degrees) => {
    const rotation = degrees % 360;
    return rotation < 0 ? rotation + 360 : rotation;
};
const degreesToRadians = (degree) => degree * radiansPerDegree;
const radiansToDegrees = (radian) => radian * degreesPerRadian;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const sign = (value) => (value && (value < 0 ? -1 : 1));
const lerp = (startValue, endValue, ratio) => (((1 - ratio) * startValue) + (ratio * endValue));
const isPowerOfTwo = (value) => ((value !== 0) && ((value & (value - 1)) === 0));
const inRange = (value, min, max) => (value >= Math.min(min, max) && value <= Math.max(min, max));
const getDistance = (x1, y1, x2, y2) => {
    const offsetX = x1 - x2;
    const offsetY = y1 - y2;
    return Math.sqrt((offsetX * offsetX) + (offsetY * offsetY));
};
const bezierCurveTo = (fromX, fromY, cpX1, cpY1, cpX2, cpY2, toX, toY, path = [], len = 20) => {
    path.push(fromX, fromY);
    for (let i = 1, j = 0, dt1 = 0, dt2 = 0, dt3 = 0, t2 = 0, t3 = 0; i <= len; i++) {
        j = i / len;
        dt1 = (1 - j);
        dt2 = dt1 * dt1;
        dt3 = dt2 * dt1;
        t2 = j * j;
        t3 = t2 * j;
        path.push((dt3 * fromX) + (3 * dt2 * j * cpX1) + (3 * dt1 * t2 * cpX2) + (t3 * toX), (dt3 * fromY) + (3 * dt2 * j * cpY1) + (3 * dt1 * t2 * cpY2) + (t3 * toY));
    }
    return path;
};
const quadraticCurveTo = (fromX, fromY, cpX, cpY, toX, toY, path = [], len = 20) => {
    for (let i = 0; i <= len; i++) {
        const ratio = i / len;
        path.push(lerp(lerp(fromX, cpX, ratio), lerp(cpX, toX, ratio), ratio), lerp(lerp(fromY, cpY, ratio), lerp(cpY, toY, ratio), ratio));
    }
    return path;
};
const getVoronoiRegion$1 = (line, point) => {
    const product = point.dot(line.x, line.y);
    if (product < 0) {
        return -1 /* VoronoiRegion.left */;
    }
    else if (product > line.lengthSq) {
        return 1 /* VoronoiRegion.right */;
    }
    else {
        return 0 /* VoronoiRegion.middle */;
    }
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

let temp$7 = null;
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
        if (temp$7 === null) {
            temp$7 = new Interval();
        }
        return temp$7;
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
const buildCirclePoints = ({ x: centerX, y: centerY, radius }) => {
    if (radius <= 0) {
        return [];
    }
    const segments = getCurveSegments(radius);
    const delta = (Math.PI * 2) / segments;
    const points = [];
    for (let i = 0; i < segments; i++) {
        const angle = i * delta;
        points.push({
            x: centerX + (Math.cos(angle) * radius),
            y: centerY + (Math.sin(angle) * radius),
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
const buildPolygonWorldPoints = ({ x: offsetX, y: offsetY, points }) => (points.map(({ x, y }) => ({ x: x + offsetX, y: y + offsetY })));
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
const getVectorLength = (x, y) => Math.sqrt((x * x) + (y * y));
const getVectorLengthSquared = (x, y) => (x * x) + (y * y);
const getDotProduct = (x1, y1, x2, y2) => (x1 * x2) + (y1 * y2);
const getVoronoiRegion = (lineX, lineY, pointX, pointY) => {
    const product = getDotProduct(pointX, pointY, lineX, lineY);
    const lengthSq = getVectorLengthSquared(lineX, lineY);
    if (product < 0) {
        return -1 /* VoronoiRegion.left */;
    }
    if (product > lengthSq) {
        return 1 /* VoronoiRegion.right */;
    }
    return 0 /* VoronoiRegion.middle */;
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
const intersectionLineLine = (lineA, lineB) => (intersectionLineLineSegments(lineA.fromPosition, lineA.toPosition, lineB.fromPosition, lineB.toPosition));
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
const intersectionLineCircle = (line, circle) => {
    if (intersectionPointCircle(line.fromPosition, circle) || intersectionPointCircle(line.toPosition, circle)) {
        return true;
    }
    const { fromX: x1, fromY: y1, toX: x2, toY: y2 } = line;
    const { x: cx, y: cy, radius } = circle;
    const len = getDistance(x1, y1, x2, y2);
    if (len === 0) {
        return false;
    }
    const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / (len * len);
    const closestX = x1 + (dot * (x2 - x1));
    const closestY = y1 + (dot * (y2 - y1));
    if (!intersectionPointLineSegment({ x: closestX, y: closestY }, line.fromPosition, line.toPosition)) {
        return false;
    }
    return getDistance(closestX, closestY, cx, cy) <= radius;
};
const intersectionLineEllipse = (line, ellipse) => {
    const { x: centerX, y: centerY, rx, ry } = ellipse;
    if (rx <= 0 || ry <= 0) {
        return false;
    }
    const x1 = (line.fromX - centerX) / rx;
    const y1 = (line.fromY - centerY) / ry;
    const x2 = (line.toX - centerX) / rx;
    const y2 = (line.toY - centerY) / ry;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const a = (dx * dx) + (dy * dy);
    const b = 2 * ((x1 * dx) + (y1 * dy));
    const c = (x1 * x1) + (y1 * y1) - 1;
    if (c <= 0) {
        return true;
    }
    if (a <= Number.EPSILON) {
        return false;
    }
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
        return false;
    }
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const tA = (-b - sqrtDiscriminant) / (2 * a);
    const tB = (-b + sqrtDiscriminant) / (2 * a);
    return (tA >= 0 && tA <= 1) || (tB >= 0 && tB <= 1);
};
const intersectionLinePoly = (line, polygon) => {
    const { x: offsetX, y: offsetY, points } = polygon;
    const len = points.length;
    for (let i = 0; i < len; i++) {
        const curr = points[i];
        const next = points[(i + 1) % len];
        if (intersectionLineLineSegments(line.fromPosition, line.toPosition, { x: curr.x + offsetX, y: curr.y + offsetY }, { x: next.x + offsetX, y: next.y + offsetY })) {
            return true;
        }
    }
    return false;
};
const intersectionRectRect = (rectA, rectB) => (intersectionRectRect$1(rectA, rectB));
const intersectionRectCircle = ({ x: rx, y: ry, width, height }, { x: cx, y: cy, radius }) => {
    const distX = clamp(cx, rx, rx + width);
    const distY = clamp(cy, ry, ry + height);
    return getDistance(cx, cy, distX, distY) <= radius;
};
const intersectionRectEllipse = (rectangle, ellipse) => (polygonsIntersect(buildRectanglePoints(rectangle), buildEllipsePoints(ellipse)));
const intersectionRectPoly = (rectangle, polygon) => intersectionSat(rectangle, polygon);
const intersectionCircleCircle = ({ x: x1, y: y1, radius: r1 }, { x: x2, y: y2, radius: r2 }) => (getDistance(x1, y1, x2, y2) <= (r1 + r2));
const intersectionCircleEllipse = (circle, ellipse) => (polygonsIntersect(buildCirclePoints(circle), buildEllipsePoints(ellipse)));
const shouldExcludeLeftVoronoi = (circleX, circleY, prevPoint, prevEdge, pointX, pointY, radius, edgeX, edgeY) => {
    if (getVoronoiRegion(edgeX, edgeY, pointX, pointY) !== -1 /* VoronoiRegion.left */) {
        return false;
    }
    const region = getVoronoiRegion(prevEdge.x, prevEdge.y, circleX - prevPoint.x, circleY - prevPoint.y);
    return region === 1 /* VoronoiRegion.right */ && getVectorLength(pointX, pointY) > radius;
};
const shouldExcludeRightVoronoi = (circleX, circleY, nextPoint, nextEdge, pointX, pointY, radius, edgeX, edgeY) => {
    if (getVoronoiRegion(edgeX, edgeY, pointX, pointY) !== 1 /* VoronoiRegion.right */) {
        return false;
    }
    const region = getVoronoiRegion(nextEdge.x, nextEdge.y, circleX - nextPoint.x, circleY - nextPoint.y);
    return region === -1 /* VoronoiRegion.left */ && getVectorLength(pointX, pointY) > radius;
};
const shouldExcludeMiddleVoronoi = (pointX, pointY, radius, edgeX, edgeY) => {
    const normalX = edgeY;
    const normalY = -edgeX;
    const normalLength = getVectorLength(normalX, normalY);
    if (normalLength === 0) {
        return false;
    }
    const distance = ((pointX * normalX) + (pointY * normalY)) / normalLength;
    return distance > 0 && Math.abs(distance) > radius;
};
const intersectionCirclePoly = ({ x: cx, y: cy, radius }, { x: px, y: py, points, edges }) => {
    const circleX = px - cx;
    const circleY = py - cy;
    const len = points.length;
    for (let i = 0; i < len; i++) {
        const point = points[i];
        const pointX = circleX - point.x;
        const pointY = circleY - point.y;
        const prev = i === 0 ? len - 1 : i - 1;
        const next = (i + 1) % len;
        const edge = edges[i];
        if (shouldExcludeLeftVoronoi(circleX, circleY, points[prev], edges[prev], pointX, pointY, radius, edge.x, edge.y)) {
            return false;
        }
        if (shouldExcludeRightVoronoi(circleX, circleY, points[next], edges[next], pointX, pointY, radius, edge.x, edge.y)) {
            return false;
        }
        if (shouldExcludeMiddleVoronoi(pointX, pointY, radius, edge.x, edge.y)) {
            return false;
        }
    }
    return true;
};
const intersectionEllipseEllipse = (ellipseA, ellipseB) => (polygonsIntersect(buildEllipsePoints(ellipseA), buildEllipsePoints(ellipseB)));
const intersectionEllipsePoly = (ellipse, polygon) => (polygonsIntersect(buildEllipsePoints(ellipse), buildPolygonWorldPoints(polygon)));
const intersectionPolyPoly = (polygonA, polygonB) => intersectionSat(polygonA, polygonB);
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
const getCollisionCircleCircle = (circleA, circleB) => {
    const difference = circleB.position.clone().subtract(circleA.x, circleA.y);
    const distance = difference.length;
    const overlap = (circleA.radius + circleB.radius) - distance;
    if (overlap < 0) {
        difference.destroy();
        return null;
    }
    const projectionN = difference.clone().normalize();
    const projectionV = difference.multiply(overlap);
    return {
        shapeA: circleA,
        shapeB: circleB,
        overlap,
        shapeAinB: (circleA.radius <= circleB.radius) && (distance <= (circleB.radius - circleA.radius)),
        shapeBinA: (circleB.radius <= circleA.radius) && (distance <= (circleA.radius - circleB.radius)),
        projectionN,
        projectionV,
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
const getCollisionPolygonCircle = (polygon, circle, swap = false) => {
    const radius = circle.radius;
    const points = polygon.points;
    const x = circle.x - polygon.x;
    const y = circle.y - polygon.y;
    const projection = circle.position.clone().set(0, 0);
    const len = points.length;
    let containsA = true;
    let containsB = true;
    let overlap = Infinity;
    for (let i = 0; i < len; i++) {
        const pointA = points[i];
        const pointB = points[(i + 1) % len];
        const edgeAx = pointB.x - pointA.x;
        const edgeAy = pointB.y - pointA.y;
        const positionAx = x - pointA.x;
        const positionAy = y - pointA.y;
        const region = getVoronoiRegion(edgeAx, edgeAy, positionAx, positionAy);
        const pointDistanceA = getVectorLength(positionAx, positionAy);
        if (pointDistanceA > radius) {
            containsA = false;
        }
        if (region === -1 /* VoronoiRegion.left */) {
            const prev = points[i === 0 ? len - 1 : i - 1];
            const edgeBx = pointA.x - prev.x;
            const edgeBy = pointA.y - prev.y;
            const positionBx = x - prev.x;
            const positionBy = y - prev.y;
            if (getVoronoiRegion(edgeBx, edgeBy, positionBx, positionBy) === 1 /* VoronoiRegion.right */) {
                if (pointDistanceA > radius) {
                    projection.destroy();
                    return null;
                }
                const candidateOverlap = radius - pointDistanceA;
                if (Math.abs(candidateOverlap) < Math.abs(overlap)) {
                    overlap = candidateOverlap;
                    projection.set(positionAx, positionAy).normalize();
                }
                containsB = false;
            }
        }
        else if (region === 1 /* VoronoiRegion.right */) {
            const next = points[(i + 2) % len];
            const edgeBx = next.x - pointB.x;
            const edgeBy = next.y - pointB.y;
            const positionBx = x - pointB.x;
            const positionBy = y - pointB.y;
            const pointDistanceB = getVectorLength(positionBx, positionBy);
            if (getVoronoiRegion(edgeBx, edgeBy, positionBx, positionBy) === -1 /* VoronoiRegion.left */) {
                if (pointDistanceB > radius) {
                    projection.destroy();
                    return null;
                }
                const candidateOverlap = radius - pointDistanceB;
                if (Math.abs(candidateOverlap) < Math.abs(overlap)) {
                    overlap = candidateOverlap;
                    projection.set(positionBx, positionBy).normalize();
                }
                containsB = false;
            }
        }
        else {
            const normalX = edgeAy;
            const normalY = -edgeAx;
            const normalLength = getVectorLength(normalX, normalY);
            const distance = normalLength === 0 ? 0 : ((positionAx * normalX) + (positionAy * normalY)) / normalLength;
            if (distance > 0 && Math.abs(distance) > radius) {
                projection.destroy();
                return null;
            }
            if (distance >= 0 || (radius - distance) < (2 * radius)) {
                containsB = false;
            }
            const candidateOverlap = radius - distance;
            if (Math.abs(candidateOverlap) < Math.abs(overlap)) {
                overlap = candidateOverlap;
                projection.set(normalX, normalY).normalize();
            }
        }
    }
    const projectionV = projection.clone().multiply(overlap);
    return {
        shapeA: swap ? circle : polygon,
        shapeB: swap ? polygon : circle,
        overlap,
        shapeAinB: swap ? containsB : containsA,
        shapeBinA: swap ? containsA : containsB,
        projectionN: projection,
        projectionV,
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

let temp$6 = null;
const noop = () => { };
const tempPoint = new ObservableVector(noop);
class Rectangle {
    constructor(x = 0, y = x, width = 0, height = width) {
        this.collisionType = 2 /* CollisionType.Rectangle */;
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
            case 6 /* CollisionType.SceneNode */:
                return target.isAlignedBox
                    ? intersectionRectRect(this, target.getBounds())
                    : intersectionSat(this, target);
            case 2 /* CollisionType.Rectangle */: return intersectionRectRect(this, target);
            case 5 /* CollisionType.Polygon */: return intersectionRectPoly(this, target);
            case 3 /* CollisionType.Circle */: return intersectionRectCircle(this, target);
            case 4 /* CollisionType.Ellipse */: return intersectionRectEllipse(this, target);
            case 1 /* CollisionType.Line */: return intersectionLineRect(target, this);
            case 0 /* CollisionType.Point */: return intersectionPointRect(target, this);
            default: return false;
        }
    }
    collidesWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */:
                return target.isAlignedBox
                    ? getCollisionRectangleRectangle(this, target.getBounds())
                    : getCollisionSat(this, target);
            case 2 /* CollisionType.Rectangle */: return getCollisionRectangleRectangle(this, target);
            case 5 /* CollisionType.Polygon */: return getCollisionSat(this, target);
            case 3 /* CollisionType.Circle */: return getCollisionCircleRectangle(target, this, true);
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
        if (temp$6 === null) {
            temp$6 = new Rectangle();
        }
        return temp$6;
    }
}

let temp$5 = null;
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
        if (temp$5 === null) {
            temp$5 = new Matrix();
        }
        return temp$5;
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

let temp$4 = null;
class Vector extends AbstractVector {
    constructor(x = 0, y = 0) {
        super();
        this.collisionType = 0 /* CollisionType.Point */;
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
            case 6 /* CollisionType.SceneNode */: return intersectionPointRect(this, target.getBounds());
            case 2 /* CollisionType.Rectangle */: return intersectionPointRect(this, target);
            case 5 /* CollisionType.Polygon */: return intersectionPointPoly(this, target);
            case 3 /* CollisionType.Circle */: return intersectionPointCircle(this, target);
            case 4 /* CollisionType.Ellipse */: return intersectionPointEllipse(this, target);
            case 1 /* CollisionType.Line */: return intersectionPointLine(this, target);
            case 0 /* CollisionType.Point */: return intersectionPointPoint(this, target);
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
        if (temp$4 === null) {
            temp$4 = new Vector();
        }
        return temp$4;
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

class WebGl2VertexArrayObject {
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

var RenderBackendType;
(function (RenderBackendType) {
    RenderBackendType[RenderBackendType["WebGl2"] = 0] = "WebGl2";
    RenderBackendType[RenderBackendType["WebGpu"] = 1] = "WebGpu";
})(RenderBackendType || (RenderBackendType = {}));

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
class AbstractWebGl2Renderer {
    constructor() {
        this.backendType = RenderBackendType.WebGl2;
        this._runtime = null;
    }
    connect(runtime) {
        if (this._runtime !== null) {
            return;
        }
        if (runtime.backendType !== RenderBackendType.WebGl2) {
            throw new Error(`${this.constructor.name} requires a WebGL2 runtime, `
                + `but received backendType ${String(runtime.backendType)}.`);
        }
        this._runtime = runtime;
        this.onConnect(runtime);
    }
    disconnect() {
        if (this._runtime === null) {
            return;
        }
        this.flush();
        this.onDisconnect();
        this._runtime = null;
    }
    /**
     * Safe accessor for the connected runtime.
     * @throws Error if the renderer is not connected.
     */
    getRuntime() {
        if (this._runtime === null) {
            throw new Error(`${this.constructor.name} is not connected to a runtime.`);
        }
        return this._runtime;
    }
    /**
     * Returns the connected runtime, or null if not connected.
     * Use this for conditional checks where disconnected state is expected.
     */
    getRuntimeOrNull() {
        return this._runtime;
    }
}

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

const webGl2PrimitiveByteSizeMapping = {
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
const webGl2PrimitiveArrayConstructors = {
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
const webGl2PrimitiveTypeNames = {
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
};

class ShaderAttribute {
    constructor(index, name, type) {
        this.location = -1;
        this.index = index;
        this.name = name;
        this.type = type;
        this.size = webGl2PrimitiveByteSizeMapping[type];
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

class WebGl2ShaderBlock {
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
            const data = new webGl2PrimitiveArrayConstructors[type](blockData, offsets[i], webGl2PrimitiveByteSizeMapping[type] * size);
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
function createWebGl2ShaderRuntime(gl) {
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
        const data = new webGl2PrimitiveArrayConstructors[info.type](webGl2PrimitiveByteSizeMapping[info.type] * info.size);
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
        const block = new WebGl2ShaderBlock(gl, program, index);
        uniformBlocks.push(block);
    }
}

class WebGl2RenderBuffer {
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
const heightCache = new Map();
const determineFontHeight = (font) => {
    if (!heightCache.has(font)) {
        const body = document.body;
        const dummy = document.createElement('div');
        dummy.appendChild(document.createTextNode('M'));
        dummy.setAttribute('style', `font: ${font};position:absolute;top:0;left:0`);
        body.appendChild(dummy);
        heightCache.set(font, dummy.offsetHeight);
        body.removeChild(dummy);
    }
    return heightCache.get(font);
};

class AbstractWebGl2BatchedRenderer extends AbstractWebGl2Renderer {
    constructor(batchSize, attributeCount, vertexSource, fragmentSource) {
        super();
        this.batchIndex = 0;
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
    flush() {
        const runtime = this.getRuntimeOrNull();
        const vertexBuffer = this.vertexBuffer;
        const vao = this.vao;
        if (this.batchIndex === 0 || runtime === null || vertexBuffer === null || vao === null) {
            return;
        }
        const view = runtime.view;
        if (this.currentView !== view || this.currentViewId !== view.updateId) {
            this.currentView = view;
            this.currentViewId = view.updateId;
            this.updateView(view);
        }
        this.shader.sync();
        runtime.bindVertexArrayObject(vao);
        vertexBuffer.upload(this.float32View.subarray(0, this.batchIndex * this.attributeCount));
        vao.draw(this.batchIndex * 6, 0);
        this.batchIndex = 0;
    }
    destroy() {
        this.disconnect();
        this.shader.destroy();
        this.currentTexture = null;
        this.currentBlendMode = null;
        this.currentView = null;
        this.connection = null;
    }
    onConnect(runtime) {
        const gl = runtime.context;
        this.shader.connect(createWebGl2ShaderRuntime(gl));
        this.connection = this.createConnection(gl);
        this.indexBuffer = new WebGl2RenderBuffer(BufferTypes.ElementArrayBuffer, this.indexData, BufferUsage.StaticDraw)
            .connect(this.createBufferRuntime(this.connection));
        this.vertexBuffer = new WebGl2RenderBuffer(BufferTypes.ArrayBuffer, this.vertexData, BufferUsage.DynamicDraw)
            .connect(this.createBufferRuntime(this.connection));
        this.vao = this.createVao(gl, this.indexBuffer, this.vertexBuffer)
            .connect(this.createVaoRuntime(this.connection));
    }
    onDisconnect() {
        this.flush();
        this.shader.disconnect();
        this.indexBuffer?.destroy();
        this.indexBuffer = null;
        this.vertexBuffer?.destroy();
        this.vertexBuffer = null;
        this.vao?.destroy();
        this.vao = null;
        this.connection = null;
        this.currentTexture = null;
        this.currentBlendMode = null;
        this.currentView = null;
        this.currentViewId = -1;
        this.batchIndex = 0;
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

var vertexSource$2 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec2 a_texcoord;\r\nlayout(location = 2) in vec4 a_color;\r\n\r\nuniform mat3 u_projection;\r\n\r\nout vec2 v_texcoord;\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\r\n    gl_Position = vec4((u_projection * vec3(a_position, 1.0)).xy, 0.0, 1.0);\r\n\r\n    v_texcoord = a_texcoord;\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

var fragmentSource$2 = "#version 300 es\r\nprecision lowp float;\r\n\r\nuniform sampler2D u_texture;\r\n\r\nin vec2 v_texcoord;\r\nin vec4 v_color;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nvoid main(void) {\r\n    fragColor = texture(u_texture, v_texcoord) * v_color;\r\n}\r\n";

class WebGl2SpriteRenderer extends AbstractWebGl2BatchedRenderer {
    constructor(batchSize) {
        /**
         * 4 x 4 Attributes:
         * 2 = position (x, y) +
         * 1 = texCoord (packed uv) +
         * 1 = color    (ARGB int)
         */
        super(batchSize, 16, vertexSource$2, fragmentSource$2);
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
                this.getRuntime().setBlendMode(blendMode);
            }
        }
        if (texture) {
            this.getRuntime().bindTexture(texture);
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
        return new WebGl2VertexArrayObject()
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

var vertexSource$1 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec2 a_texcoord;\r\nlayout(location = 2) in vec2 a_translation;\r\nlayout(location = 3) in vec2 a_scale;\r\nlayout(location = 4) in float a_rotation;\r\nlayout(location = 5) in vec4 a_color;\n\nuniform mat3 u_projection;\nuniform mat3 u_translation;\n\r\nout vec2 v_texcoord;\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\n    vec2 rotation = vec2(sin(radians(a_rotation)), cos(radians(a_rotation)));\n    vec3 position = vec3(\n        (a_position.x * (a_scale.x * rotation.y)) + (a_position.y * (a_scale.y * rotation.x)) + a_translation.x,\n        (a_position.x * (a_scale.x * -rotation.x)) + (a_position.y * (a_scale.y * rotation.y)) + a_translation.y,\n        1.0\n    );\n\n    gl_Position = vec4((u_projection * u_translation * position).xy, 0.0, 1.0);\n\r\n    v_texcoord = a_texcoord;\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

var fragmentSource$1 = "#version 300 es\r\nprecision lowp float;\r\n\r\nuniform sampler2D u_texture;\r\n\r\nin vec2 v_texcoord;\r\nin vec4 v_color;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nvoid main(void) {\r\n    fragColor = texture(u_texture, v_texcoord) * v_color;\r\n}\r\n";

class WebGl2ParticleRenderer extends AbstractWebGl2BatchedRenderer {
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
        super(batchSize, 36, vertexSource$1, fragmentSource$1);
    }
    render(system) {
        const { texture, vertices, texCoords, particles, blendMode } = system;
        const textureChanged = (texture !== this.currentTexture);
        const blendModeChanged = (blendMode !== this.currentBlendMode);
        const float32View = this.float32View;
        const uint32View = this.uint32View;
        const runtime = this.getRuntime();
        // System transform is a uniform, so mixing systems in one batch is invalid.
        this.flush();
        if (textureChanged || blendModeChanged) {
            if (textureChanged) {
                this.currentTexture = texture;
            }
            if (blendModeChanged) {
                this.currentBlendMode = blendMode;
                runtime.setBlendMode(blendMode);
            }
        }
        runtime.bindTexture(texture);
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
        return new WebGl2VertexArrayObject()
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

var vertexSource = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec4 a_color;\r\n\r\nuniform mat3 u_projection;\r\nuniform mat3 u_translation;\r\n\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\r\n    gl_Position = vec4((u_projection * u_translation * vec3(a_position, 1.0)).xy, 0.0, 1.0);\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

var fragmentSource = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nin vec4 v_color;\r\n\r\nvoid main(void) {\r\n    fragColor = v_color;\r\n}\r\n";

const minBatchVertexSize = 4;
const vertexStrideBytes$2 = 12;
const vertexStrideWords = vertexStrideBytes$2 / 4;
class WebGl2PrimitiveRenderer extends AbstractWebGl2Renderer {
    constructor(batchSize) {
        super();
        this._shader = new Shader(vertexSource, fragmentSource);
        this._connection = null;
        this._currentBlendMode = null;
        this._currentView = null;
        this._viewId = -1;
        this._vertexCapacity = Math.max(minBatchVertexSize, batchSize);
        this._indexCapacity = Math.max(6, this._vertexCapacity * 3);
        this._vertexData = new ArrayBuffer(this._vertexCapacity * vertexStrideBytes$2);
        this._indexData = new Uint16Array(this._indexCapacity);
        this._float32View = new Float32Array(this._vertexData);
        this._uint32View = new Uint32Array(this._vertexData);
    }
    render(shape) {
        const connection = this._connection;
        if (!connection) {
            throw new Error('Renderer not connected');
        }
        const runtime = this.getRuntime();
        const { geometry, drawMode, color, blendMode } = shape;
        const vertices = geometry.vertices;
        const sourceIndices = geometry.indices;
        const vertexCount = vertices.length / 2;
        const indexCount = sourceIndices.length > 0 ? sourceIndices.length : vertexCount;
        if (vertexCount === 0 || indexCount === 0) {
            return;
        }
        this._ensureVertexCapacity(vertexCount);
        this._ensureIndexCapacity(indexCount);
        if (blendMode !== this._currentBlendMode) {
            this._currentBlendMode = blendMode;
            runtime.setBlendMode(blendMode);
        }
        const view = runtime.view;
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
        runtime.bindVertexArrayObject(connection.vao);
        connection.vertexBuffer.upload(this._float32View.subarray(0, vertexCount * vertexStrideWords));
        connection.indexBuffer.upload(this._indexData.subarray(0, indexCount));
        connection.vao.draw(indexCount, 0, drawMode);
    }
    flush() {
        // Primitive rendering is immediate per shape in this bridge stage.
    }
    destroy() {
        this.disconnect();
        this._shader.destroy();
        this._currentBlendMode = null;
        this._currentView = null;
    }
    onConnect(runtime) {
        const gl = runtime.context;
        const vaoHandle = gl.createVertexArray();
        this._shader.connect(createWebGl2ShaderRuntime(gl));
        if (vaoHandle === null) {
            throw new Error('Could not create vertex array object.');
        }
        const buffers = new Map();
        const indexBuffer = new WebGl2RenderBuffer(BufferTypes.ElementArrayBuffer, this._indexData, BufferUsage.DynamicDraw)
            .connect(this._createBufferRuntime(gl, buffers));
        const vertexBuffer = new WebGl2RenderBuffer(BufferTypes.ArrayBuffer, this._vertexData, BufferUsage.DynamicDraw)
            .connect(this._createBufferRuntime(gl, buffers));
        const vao = new WebGl2VertexArrayObject()
            .addIndex(indexBuffer)
            .addAttribute(vertexBuffer, this._shader.getAttribute('a_position'), gl.FLOAT, false, vertexStrideBytes$2, 0)
            .addAttribute(vertexBuffer, this._shader.getAttribute('a_color'), gl.UNSIGNED_BYTE, true, vertexStrideBytes$2, 8)
            .connect(this._createVaoRuntime(gl, vaoHandle));
        this._connection = { gl, buffers, vaoHandle, vao, indexBuffer, vertexBuffer };
    }
    onDisconnect() {
        const connection = this._connection;
        if (!connection) {
            return;
        }
        this._shader.disconnect();
        connection.indexBuffer.destroy();
        connection.vertexBuffer.destroy();
        connection.vao.destroy();
        this._connection = null;
        this._currentBlendMode = null;
        this._currentView = null;
        this._viewId = -1;
    }
    _ensureVertexCapacity(vertexCount) {
        if (vertexCount <= this._vertexCapacity) {
            return;
        }
        while (this._vertexCapacity < vertexCount) {
            this._vertexCapacity *= 2;
        }
        this._vertexData = new ArrayBuffer(this._vertexCapacity * vertexStrideBytes$2);
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

var TransformableFlags;
(function (TransformableFlags) {
    TransformableFlags[TransformableFlags["None"] = 0] = "None";
    TransformableFlags[TransformableFlags["Translation"] = 1] = "Translation";
    TransformableFlags[TransformableFlags["Rotation"] = 2] = "Rotation";
    TransformableFlags[TransformableFlags["Scaling"] = 4] = "Scaling";
    TransformableFlags[TransformableFlags["Origin"] = 8] = "Origin";
    TransformableFlags[TransformableFlags["Transform"] = 15] = "Transform";
    TransformableFlags[TransformableFlags["TransformInverse"] = 16] = "TransformInverse";
})(TransformableFlags || (TransformableFlags = {}));
class Transformable {
    constructor() {
        this.flags = new Flags(TransformableFlags.Transform);
        this._transform = new Matrix();
        this._position = new ObservableVector(this._setPositionDirty.bind(this), 0, 0);
        this._scale = new ObservableVector(this._setScalingDirty.bind(this), 1, 1);
        this._origin = new ObservableVector(this._setOriginDirty.bind(this), 0, 0);
        this._rotation = 0;
        this._sin = 0;
        this._cos = 1;
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
    }
    get y() {
        return this._position.y;
    }
    set y(y) {
        this._position.y = y;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this.setRotation(rotation);
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale.copy(scale);
    }
    get origin() {
        return this._origin;
    }
    set origin(origin) {
        this._origin.copy(origin);
    }
    setPosition(x, y = x) {
        this._position.set(x, y);
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
    setScale(x, y = x) {
        this._scale.set(x, y);
        return this;
    }
    setOrigin(x, y = x) {
        this._origin.set(x, y);
        return this;
    }
    move(x, y) {
        return this.setPosition(this.x + x, this.y + y);
    }
    rotate(degrees) {
        return this.setRotation(this._rotation + degrees);
    }
    getTransform() {
        if (this.flags.has(TransformableFlags.Transform)) {
            this.updateTransform();
            this.flags.remove(TransformableFlags.Transform);
        }
        return this._transform;
    }
    updateTransform() {
        if (this.flags.has(TransformableFlags.Rotation)) {
            const radians = degreesToRadians(this._rotation);
            this._cos = Math.cos(radians);
            this._sin = Math.sin(radians);
        }
        if (this.flags.has(TransformableFlags.Rotation | TransformableFlags.Scaling)) {
            const { x, y } = this._scale;
            this._transform.a = x * this._cos;
            this._transform.b = y * this._sin;
            this._transform.c = -x * this._sin;
            this._transform.d = y * this._cos;
        }
        if (this._rotation) {
            const { x, y } = this._origin;
            this._transform.x = (x * -this._transform.a) - (y * this._transform.b) + this._position.x;
            this._transform.y = (x * -this._transform.c) - (y * this._transform.d) + this._position.y;
        }
        else {
            this._transform.x = (this._origin.x * -this._scale.x) + this._position.x;
            this._transform.y = (this._origin.y * -this._scale.y) + this._position.y;
        }
        return this;
    }
    destroy() {
        this._transform.destroy();
        this._position.destroy();
        this._scale.destroy();
        this._origin.destroy();
        this.flags.destroy();
    }
    _setPositionDirty() {
        this.flags.push(TransformableFlags.Translation);
    }
    _setRotationDirty() {
        this.flags.push(TransformableFlags.Rotation);
    }
    _setScalingDirty() {
        this.flags.push(TransformableFlags.Scaling);
    }
    _setOriginDirty() {
        this.flags.push(TransformableFlags.Origin);
    }
}

class SceneNode extends Transformable {
    constructor() {
        super(...arguments);
        this.collisionType = 6 /* CollisionType.SceneNode */;
        this._bounds = new Bounds();
        this._visible = true;
        this._globalTransform = new Matrix();
        this._localBounds = new Rectangle();
        this._anchor = new ObservableVector(this._updateOrigin.bind(this), 0, 0);
        this._parentNode = null;
    }
    get anchor() {
        return this._anchor;
    }
    set anchor(anchor) {
        this._anchor.copy(anchor);
    }
    get parent() {
        return this._parentNode;
    }
    set parent(parent) {
        this._parentNode = parent;
    }
    get parentNode() {
        return this._parentNode;
    }
    set parentNode(parentNode) {
        this._parentNode = parentNode;
    }
    get visible() {
        return this._visible;
    }
    set visible(visible) {
        this._visible = visible;
    }
    get globalTransform() {
        return this.getGlobalTransform();
    }
    get localBounds() {
        return this.getLocalBounds();
    }
    get bounds() {
        return this.getBounds();
    }
    get isAlignedBox() {
        return this.rotation % 90 === 0;
    }
    setAnchor(x, y = x) {
        this._anchor.set(x, y);
        return this;
    }
    getLocalBounds() {
        return this._localBounds;
    }
    getBounds() {
        this.updateParentTransform();
        this.updateBounds();
        return this._bounds.getRect();
    }
    updateBounds() {
        this._bounds.reset()
            .addRect(this.getLocalBounds(), this.getGlobalTransform());
        return this;
    }
    updateParentTransform() {
        if (this._parentNode) {
            this._parentNode.updateParentTransform();
        }
        this.updateTransform();
        return this;
    }
    getGlobalTransform() {
        this._globalTransform.copy(this.getTransform());
        if (this._parentNode) {
            this._globalTransform.combine(this._parentNode.getGlobalTransform());
        }
        return this._globalTransform;
    }
    getNormals() {
        return this.getBounds().getNormals();
    }
    project(axis, result = new Interval()) {
        return this.getBounds().project(axis, result);
    }
    intersectsWith(target) {
        if (this.isAlignedBox) {
            return this.getBounds().intersectsWith(target);
        }
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return intersectionSat(this, target);
            case 2 /* CollisionType.Rectangle */: return intersectionSat(this, target);
            case 5 /* CollisionType.Polygon */: return intersectionSat(this, target);
            case 3 /* CollisionType.Circle */: return intersectionRectCircle(this.getBounds(), target);
            case 4 /* CollisionType.Ellipse */: return intersectionRectEllipse(this.getBounds(), target);
            case 1 /* CollisionType.Line */: return intersectionLineRect(target, this.getBounds());
            case 0 /* CollisionType.Point */: return intersectionPointRect(target, this.getBounds());
            default: return false;
        }
    }
    collidesWith(target) {
        if (this.isAlignedBox) {
            return this.getBounds().collidesWith(target);
        }
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return getCollisionSat(this, target);
            case 2 /* CollisionType.Rectangle */: return getCollisionSat(this, target);
            case 5 /* CollisionType.Polygon */: return getCollisionSat(this, target);
            case 3 /* CollisionType.Circle */: return getCollisionSat(this, target);
            default: return null;
        }
    }
    contains(x, y) {
        return this.getBounds().contains(x, y);
    }
    inView(view) {
        return view.getBounds().intersectsWith(this.getBounds());
    }
    render(_runtime) {
        return this;
    }
    destroy() {
        super.destroy();
        this._globalTransform.destroy();
        this._localBounds.destroy();
        this._bounds.destroy();
        this._anchor.destroy();
    }
    _updateOrigin() {
        const { x, y } = this._anchor;
        const { width, height } = this.getBounds();
        this.setOrigin(width * x, height * y);
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

class Drawable extends SceneNode {
    constructor() {
        super(...arguments);
        this._tint = Color.white.clone();
        this._blendMode = BlendModes.Normal;
    }
    get tint() {
        return this._tint;
    }
    set tint(tint) {
        this.setTint(tint);
    }
    get blendMode() {
        return this._blendMode;
    }
    set blendMode(blendMode) {
        this.setBlendMode(blendMode);
    }
    setTint(color) {
        if (color) {
            this._tint.copy(color);
        }
        return this;
    }
    setBlendMode(blendMode) {
        this._blendMode = blendMode;
        return this;
    }
    render(renderManager) {
        if (this.visible && this.inView(renderManager.view)) {
            renderManager.draw(this);
        }
        return this;
    }
    destroy() {
        super.destroy();
        this._tint.destroy();
    }
}

var SpriteFlags;
(function (SpriteFlags) {
    SpriteFlags[SpriteFlags["None"] = 0] = "None";
    SpriteFlags[SpriteFlags["Translation"] = 1] = "Translation";
    SpriteFlags[SpriteFlags["Rotation"] = 2] = "Rotation";
    SpriteFlags[SpriteFlags["Scaling"] = 4] = "Scaling";
    SpriteFlags[SpriteFlags["Origin"] = 8] = "Origin";
    SpriteFlags[SpriteFlags["Transform"] = 15] = "Transform";
    SpriteFlags[SpriteFlags["TransformInverse"] = 16] = "TransformInverse";
    SpriteFlags[SpriteFlags["BoundingBox"] = 32] = "BoundingBox";
    SpriteFlags[SpriteFlags["TextureCoords"] = 64] = "TextureCoords";
    SpriteFlags[SpriteFlags["VertexTint"] = 128] = "VertexTint";
})(SpriteFlags || (SpriteFlags = {}));
class Sprite extends Drawable {
    constructor(texture) {
        super();
        this._texture = null;
        this._textureFrame = new Rectangle();
        this._vertices = new Float32Array(8);
        this._texCoords = new Uint32Array(4);
        if (texture !== null) {
            this.setTexture(texture);
        }
    }
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        this.setTexture(texture);
    }
    get textureFrame() {
        return this._textureFrame;
    }
    set textureFrame(frame) {
        this.setTextureFrame(frame);
    }
    get width() {
        return Math.abs(this.scale.x) * this._textureFrame.width;
    }
    set width(value) {
        this.scale.x = (value / this._textureFrame.width);
    }
    get height() {
        return Math.abs(this.scale.y) * this._textureFrame.height;
    }
    set height(value) {
        this.scale.y = (value / this._textureFrame.height);
    }
    // todo cache this
    get vertices() {
        const { left, top, right, bottom } = this.getLocalBounds();
        const { a, b, x, c, d, y } = this.getGlobalTransform();
        this._vertices[0] = (left * a) + (top * b) + x;
        this._vertices[1] = (left * c) + (top * d) + y;
        this._vertices[2] = (right * a) + (top * b) + x;
        this._vertices[3] = (right * c) + (top * d) + y;
        this._vertices[4] = (right * a) + (bottom * b) + x;
        this._vertices[5] = (right * c) + (bottom * d) + y;
        this._vertices[6] = (left * a) + (bottom * b) + x;
        this._vertices[7] = (left * c) + (bottom * d) + y;
        return this._vertices;
    }
    get texCoords() {
        if (this._texture === null) {
            throw new Error('texCoords can only be calculated when the sprite has a texture');
        }
        if (this.flags.pop(SpriteFlags.TextureCoords)) {
            const { width, height } = this._texture;
            const { left, top, right, bottom } = this._textureFrame;
            const minX = ((left / width) * 65535 & 65535);
            const minY = ((top / height) * 65535 & 65535) << 16;
            const maxX = ((right / width) * 65535 & 65535);
            const maxY = ((bottom / height) * 65535 & 65535) << 16;
            if (this._texture.flipY) {
                this._texCoords[0] = (maxY | minX);
                this._texCoords[1] = (maxY | maxX);
                this._texCoords[2] = (minY | maxX);
                this._texCoords[3] = (minY | minX);
            }
            else {
                this._texCoords[0] = (minY | minX);
                this._texCoords[1] = (minY | maxX);
                this._texCoords[2] = (maxY | maxX);
                this._texCoords[3] = (maxY | minX);
            }
        }
        return this._texCoords;
    }
    setTexture(texture) {
        if (this._texture !== texture) {
            this._texture = texture;
            this.updateTexture();
        }
        return this;
    }
    updateTexture() {
        if (this._texture) {
            this._texture.updateSource();
            this.resetTextureFrame();
        }
        return this;
    }
    setTextureFrame(frame, resetSize = true) {
        const width = this.width;
        const height = this.height;
        this._textureFrame.copy(frame);
        this.flags.push(SpriteFlags.TextureCoords);
        this.localBounds.set(0, 0, frame.width, frame.height);
        if (resetSize) {
            this.width = frame.width;
            this.height = frame.height;
        }
        else {
            this.width = width;
            this.height = height;
        }
        return this;
    }
    resetTextureFrame() {
        if (!this._texture) {
            throw new Error('Cannot reset texture frame when no texture was set');
        }
        return this.setTextureFrame(Rectangle.temp.set(0, 0, this._texture.width, this._texture.height));
    }
    // todo cache this
    getNormals() {
        const [x1, y1, x2, y2, x3, y3, x4, y4] = this.vertices;
        return [
            new Vector(x2 - x1, y2 - y1).rperp().normalize(),
            new Vector(x3 - x2, y3 - y2).rperp().normalize(),
            new Vector(x4 - x3, y4 - y3).rperp().normalize(),
            new Vector(x1 - x4, y1 - y4).rperp().normalize(),
        ];
    }
    project(axis, result = new Interval()) {
        const [x1, y1, x2, y2, x3, y3, x4, y4] = this.vertices;
        const proj1 = axis.dot(x1, y1);
        const proj2 = axis.dot(x2, y2);
        const proj3 = axis.dot(x3, y3);
        const proj4 = axis.dot(x4, y4);
        return result.set(Math.min(proj1, proj2, proj3, proj4), Math.max(proj1, proj2, proj3, proj4));
    }
    contains(x, y) {
        if ((this.rotation % 90 === 0)) {
            return this.getBounds().contains(x, y);
        }
        const [x1, y1, x2, y2, x3, y3] = this.vertices, temp = Vector.temp, vecA = temp.set(x2 - x1, y2 - y1), dotA = vecA.dot(x - x1, y - y1), lenA = vecA.lengthSq, vecB = temp.set(x3 - x2, y3 - y2), dotB = vecB.dot(x - x2, y - y2), lenB = vecB.lengthSq;
        return (dotA > 0) && (dotA <= lenA)
            && (dotB > 0) && (dotB <= lenB);
    }
    destroy() {
        super.destroy();
        this._textureFrame.destroy();
        this._texture = null;
    }
}

class DrawableShape extends Drawable {
    constructor(geometry, color, drawMode = RenderingPrimitives.Triangles) {
        super();
        this.geometry = geometry;
        this.color = color.clone();
        this.drawMode = drawMode;
    }
    destroy() {
        super.destroy();
        this.color.destroy();
    }
}

class Particle {
    constructor() {
        this._totalLifetime = Time.oneSecond.clone();
        this._elapsedLifetime = Time.zero.clone();
        this._position = Vector.zero.clone();
        this._velocity = Vector.zero.clone();
        this._scale = Vector.one.clone();
        this._rotation = 0;
        this._rotationSpeed = 0;
        this._textureIndex = 0;
        this._tint = Color.white.clone();
    }
    get totalLifetime() {
        return this._totalLifetime;
    }
    set totalLifetime(totalLifetime) {
        this._totalLifetime.copy(totalLifetime);
    }
    get elapsedLifetime() {
        return this._elapsedLifetime;
    }
    set elapsedLifetime(elapsedLifetime) {
        this._elapsedLifetime.copy(elapsedLifetime);
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position.copy(position);
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(velocity) {
        this._velocity.copy(velocity);
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale.copy(scale);
    }
    get tint() {
        return this._tint;
    }
    set tint(tint) {
        this._tint.copy(tint);
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(degrees) {
        this._rotation = trimRotation(degrees);
    }
    get rotationSpeed() {
        return this._rotationSpeed;
    }
    set rotationSpeed(rotationSpeed) {
        this._rotationSpeed = rotationSpeed;
    }
    get textureIndex() {
        return this._textureIndex;
    }
    set textureIndex(textureIndex) {
        this._textureIndex = textureIndex;
    }
    get remainingLifetime() {
        return Time.temp.set(this._totalLifetime.milliseconds - this._elapsedLifetime.milliseconds);
    }
    get elapsedRatio() {
        return this._elapsedLifetime.milliseconds / this._totalLifetime.milliseconds;
    }
    get remainingRatio() {
        return this.remainingLifetime.milliseconds / this._totalLifetime.milliseconds;
    }
    get expired() {
        return this._elapsedLifetime.greaterThan(this._totalLifetime);
    }
    applyOptions(options) {
        const { totalLifetime, elapsedLifetime, position, velocity, scale, tint, rotation, rotationSpeed, textureIndex, } = options;
        this._totalLifetime.copy(totalLifetime);
        this._elapsedLifetime.copy(elapsedLifetime);
        this._position.copy(position);
        this._velocity.copy(velocity);
        this._scale.copy(scale);
        this._tint.copy(tint);
        this._rotation = rotation;
        this._rotationSpeed = rotationSpeed;
        this._textureIndex = textureIndex;
        return this;
    }
    destroy() {
        this._totalLifetime.destroy();
        this._elapsedLifetime.destroy();
        this._position.destroy();
        this._velocity.destroy();
        this._scale.destroy();
        this._tint.destroy();
    }
}

class ParticleSystem extends Drawable {
    constructor(texture) {
        super();
        this._emitters = [];
        this._affectors = [];
        this._particles = [];
        this._graveyard = [];
        this._textureFrame = new Rectangle();
        this._vertices = new Float32Array(4);
        this._texCoords = new Uint32Array(4);
        this._updateTexCoords = true;
        this._updateVertices = true;
        this._texture = texture;
        this.resetTextureFrame();
    }
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        this.setTexture(texture);
    }
    get textureFrame() {
        return this._textureFrame;
    }
    set textureFrame(frame) {
        this.setTextureFrame(frame);
    }
    get vertices() {
        if (this._updateVertices) {
            const { x, y, width, height } = this._textureFrame;
            const offsetX = (width / 2);
            const offsetY = (height / 2);
            this._vertices[0] = x - offsetX;
            this._vertices[1] = y - offsetY;
            this._vertices[2] = width - offsetX;
            this._vertices[3] = height - offsetY;
            this._updateVertices = false;
        }
        return this._vertices;
    }
    get texCoords() {
        if (this._updateTexCoords) {
            const { width, height } = this._texture;
            const { left, top, right, bottom } = this._textureFrame;
            const minX = ((left / width) * 65535 & 65535);
            const minY = ((top / height) * 65535 & 65535) << 16;
            const maxX = ((right / width) * 65535 & 65535);
            const maxY = ((bottom / height) * 65535 & 65535) << 16;
            if (this._texture.flipY) {
                this._texCoords[0] = (maxY | minX);
                this._texCoords[1] = (maxY | maxX);
                this._texCoords[2] = (minY | maxX);
                this._texCoords[3] = (minY | minX);
            }
            else {
                this._texCoords[0] = (minY | minX);
                this._texCoords[1] = (minY | maxX);
                this._texCoords[2] = (maxY | maxX);
                this._texCoords[3] = (maxY | minX);
            }
            this._updateTexCoords = false;
        }
        return this._texCoords;
    }
    get emitters() {
        return this._emitters;
    }
    get affectors() {
        return this._affectors;
    }
    get particles() {
        return this._particles;
    }
    get graveyard() {
        return this._graveyard;
    }
    setTexture(texture) {
        if (this._texture !== texture) {
            this._texture = texture;
            this.resetTextureFrame();
        }
        return this;
    }
    setTextureFrame(frame) {
        this._textureFrame.copy(frame);
        this._updateTexCoords = true;
        this._updateVertices = true;
        this.localBounds.set(0, 0, frame.width, frame.height);
        return this;
    }
    resetTextureFrame() {
        return this.setTextureFrame(Rectangle.temp.set(0, 0, this._texture.width, this._texture.height));
    }
    addEmitter(emitter) {
        this._emitters.push(emitter);
        return this;
    }
    clearEmitters() {
        for (const emitter of this._emitters) {
            emitter.destroy();
        }
        this._emitters.length = 0;
        return this;
    }
    addAffector(affector) {
        this._affectors.push(affector);
        return this;
    }
    clearAffectors() {
        for (const affector of this._affectors) {
            affector.destroy();
        }
        this._affectors.length = 0;
        return this;
    }
    requestParticle() {
        return this._graveyard.pop() || new Particle();
    }
    emitParticle(particle) {
        this._particles.push(particle);
        return this;
    }
    updateParticle(particle, delta) {
        const seconds = delta.seconds;
        particle.elapsedLifetime.addTime(delta);
        particle.position.add(seconds * particle.velocity.x, seconds * particle.velocity.y);
        particle.rotation += (seconds * particle.rotationSpeed);
        return this;
    }
    clearParticles() {
        for (const particle of this._particles) {
            particle.destroy();
        }
        for (const particle of this._graveyard) {
            particle.destroy();
        }
        this._particles.length = 0;
        this._graveyard.length = 0;
        return this;
    }
    update(delta) {
        const emitters = this._emitters;
        const affectors = this._affectors;
        const particles = this._particles;
        const graveyard = this._graveyard;
        const len = particles.length;
        for (const emitter of emitters) {
            emitter.apply(this, delta);
        }
        let expireCount = 0;
        for (let i = len - 1; i >= 0; i--) {
            this.updateParticle(particles[i], delta);
            if (particles[i].expired) {
                graveyard.push(particles[i]);
                expireCount++;
                continue;
            }
            if (expireCount > 0) {
                particles.splice(i + 1, expireCount);
                expireCount = 0;
            }
            for (const affector of affectors) {
                affector.apply(particles[i], delta);
            }
        }
        if (expireCount > 0) {
            particles.splice(0, expireCount);
        }
        return this;
    }
    destroy() {
        super.destroy();
        this.clearEmitters();
        this.clearAffectors();
        this.clearParticles();
        this._textureFrame.destroy();
    }
}

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
class RendererRegistry {
    constructor() {
        this._renderers = new Map();
        this._runtime = null;
    }
    /**
     * Register a renderer for a specific drawable type.
     *
     * If the registry is already connected to a runtime, the renderer
     * is connected immediately. Registration must happen before the
     * first draw call for the given drawable type.
     *
     * @throws Error if a renderer is already registered for this drawable type.
     */
    registerRenderer(drawableType, renderer) {
        if (this._renderers.has(drawableType)) {
            throw new Error(`A renderer is already registered for ${drawableType.name}.`);
        }
        // Widen TDrawable to Drawable for storage. Safe because the map key
        // guarantees the correct drawable type is always paired at lookup.
        this._renderers.set(drawableType, renderer);
        if (this._runtime !== null) {
            renderer.connect(this._runtime);
        }
    }
    resolve(drawable) {
        let constructor = drawable.constructor;
        let renderer = undefined;
        while (constructor !== null && !renderer) {
            renderer = this._renderers.get(constructor);
            if (!renderer) {
                const prototype = Object.getPrototypeOf(constructor.prototype);
                constructor = prototype?.constructor ?? null;
            }
        }
        if (!renderer) {
            throw new Error(`No renderer registered for ${drawable.constructor.name}. `
                + 'Register one with registry.registerRenderer() before the first draw call.');
        }
        return renderer;
    }
    /**
     * Connect all registered renderers to the given runtime.
     */
    connect(runtime) {
        this._runtime = runtime;
        for (const renderer of this._renderers.values()) {
            renderer.connect(runtime);
        }
    }
    /**
     * Disconnect all registered renderers from the current runtime.
     */
    disconnect() {
        for (const renderer of this._renderers.values()) {
            renderer.disconnect();
        }
        this._runtime = null;
    }
    /**
     * Disconnect all registered renderers and clear the registry.
     */
    destroy() {
        this.disconnect();
        for (const renderer of this._renderers.values()) {
            if ('destroy' in renderer && typeof renderer.destroy === 'function') {
                renderer.destroy();
            }
        }
        this._renderers.clear();
    }
}

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
class WebGl2RenderManager {
    constructor(app) {
        this.backendType = RenderBackendType.WebGl2;
        this.rendererRegistry = new RendererRegistry();
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
        this.rendererRegistry.registerRenderer(Sprite, new WebGl2SpriteRenderer(spriteRendererBatchSize));
        this.rendererRegistry.registerRenderer(ParticleSystem, new WebGl2ParticleRenderer(particleRendererBatchSize));
        this.rendererRegistry.registerRenderer(DrawableShape, new WebGl2PrimitiveRenderer(primitiveRendererBatchSize));
        this.rendererRegistry.connect(this);
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
    get clearColor() {
        return this._clearColor;
    }
    get cursor() {
        return this._cursor;
    }
    async initialize() {
        return this;
    }
    draw(drawable) {
        const renderer = this.rendererRegistry.resolve(drawable);
        this._setActiveRenderer(renderer);
        renderer.render(drawable);
        return this;
    }
    execute(pass) {
        this._flushActiveRenderer();
        pass.execute(this);
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
        this._flushActiveRenderer();
        this._renderTarget.setView(view);
        this._bindRenderTarget(this._renderTarget);
        return this;
    }
    bindVertexArrayObject(vao) {
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
    bindShader(shader) {
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
    bindTexture(texture, unit) {
        if (unit !== undefined) {
            this._setTextureUnit(unit);
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
    _setTextureUnit(unit) {
        if (this._textureUnit !== unit) {
            const gl = this._context;
            this._textureUnit = unit;
            gl.activeTexture(gl.TEXTURE0 + unit);
        }
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
    flush() {
        this._flushActiveRenderer();
        return this;
    }
    destroy() {
        this._removeEvents();
        this.setRenderTarget(null);
        this._setActiveRenderer(null);
        this.bindVertexArrayObject(null);
        this.bindShader(null);
        this.bindTexture(null);
        this.rendererRegistry.destroy();
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
            this.bindTexture(this._texture);
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
    _setActiveRenderer(renderer) {
        if (this._renderer !== renderer) {
            this._flushActiveRenderer();
            this._renderer = renderer;
        }
    }
    _flushActiveRenderer() {
        if (this._renderer && !this._contextLost) {
            this._bindRenderTarget(this._renderTarget);
            this._renderer.flush();
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

/// <reference types="@webgpu/types" />
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
class AbstractWebGpuRenderer {
    constructor() {
        this.backendType = RenderBackendType.WebGpu;
        this._runtime = null;
    }
    connect(runtime) {
        if (this._runtime !== null) {
            return;
        }
        if (runtime.backendType !== RenderBackendType.WebGpu) {
            throw new Error(`${this.constructor.name} requires a WebGPU runtime, `
                + `but received backendType ${String(runtime.backendType)}.`);
        }
        this._runtime = runtime;
        this.onConnect(runtime);
    }
    disconnect() {
        if (this._runtime === null) {
            return;
        }
        this.flush();
        this.onDisconnect();
        this._runtime = null;
    }
    getRuntime() {
        if (this._runtime === null) {
            throw new Error(`${this.constructor.name} is not connected to a runtime.`);
        }
        return this._runtime;
    }
    getRuntimeOrNull() {
        return this._runtime;
    }
}

/// <reference types="@webgpu/types" />
/**
 * Returns the GPUBlendState for a given ExoJS blend mode.
 * Shared by all WebGPU renderers to avoid duplication.
 */
function getWebGpuBlendState(blendMode) {
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
class WebGpuPrimitiveRenderer extends AbstractWebGpuRenderer {
    constructor() {
        super(...arguments);
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
    render(shape) {
        const runtime = this._renderManager;
        if (runtime === null) {
            throw new Error('Renderer not connected');
        }
        if (shape.drawMode !== RenderingPrimitives.Points
            && shape.drawMode !== RenderingPrimitives.Lines
            && shape.drawMode !== RenderingPrimitives.LineStrip
            && shape.drawMode !== RenderingPrimitives.Triangles
            && shape.drawMode !== RenderingPrimitives.TriangleStrip) {
            throw new Error(`WebGPU primitive renderer does not support draw mode "${shape.drawMode}" yet.`);
        }
        runtime.setBlendMode(shape.blendMode);
        if (shape.geometry.vertices.length === 0) {
            return;
        }
        this._drawCalls.push({
            vertices: shape.geometry.vertices,
            indices: shape.geometry.indices,
            color: shape.color.toRgba(),
            drawMode: shape.drawMode,
            blendMode: shape.blendMode,
            transform: this._createTransformData(runtime, shape),
        });
    }
    flush() {
        const runtime = this._renderManager;
        const device = this._device;
        const bindGroup = this._bindGroup;
        const uniformBuffer = this._uniformBuffer;
        if (!runtime || !device || !bindGroup || !uniformBuffer) {
            return;
        }
        if (this._drawCalls.length === 0 && !runtime.clearRequested) {
            return;
        }
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [runtime.createColorAttachment()],
        });
        for (const drawCall of this._drawCalls) {
            const vertexCount = drawCall.vertices.length / 2;
            const indexCount = drawCall.indices.length;
            const pipeline = this._getPipeline({
                drawMode: drawCall.drawMode,
                blendMode: drawCall.blendMode,
                format: runtime.renderTargetFormat,
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
        runtime.submit(encoder.finish());
        this._drawCalls.length = 0;
    }
    destroy() {
        this.disconnect();
        this._combinedTransform.destroy();
    }
    onConnect(runtime) {
        this._renderManager = runtime;
        this._device = this._renderManager.device;
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
    onDisconnect() {
        this.flush();
        this._destroyBuffers();
        this._pipelines.clear();
        this._uniformBuffer?.destroy();
        this._uniformBuffer = null;
        this._bindGroup = null;
        this._bindGroupLayout = null;
        this._pipelineLayout = null;
        this._shaderModule = null;
        this._device = null;
        this._renderManager = null;
        this._drawCalls.length = 0;
    }
    _createTransformData(runtime, shape) {
        const matrix = this._combinedTransform
            .copy(runtime.view.getTransform())
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
                        blend: getWebGpuBlendState(key.blendMode),
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
}

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
class WebGpuSpriteRenderer extends AbstractWebGpuRenderer {
    constructor() {
        super(...arguments);
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
    onConnect(runtime) {
        if (!this._renderManager) {
            this._renderManager = runtime;
            this._device = this._renderManager.device;
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
    }
    onDisconnect() {
        this.flush();
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
    }
    render(sprite) {
        const renderManager = this._renderManager;
        const texture = sprite.texture;
        if (renderManager === null
            ||
                (!(texture instanceof Texture) && !(texture instanceof RenderTexture))
            || texture.width === 0
            || texture.height === 0
            || (texture instanceof Texture && texture.source === null)) {
            return;
        }
        renderManager.setBlendMode(sprite.blendMode);
        this._drawCalls.push({
            texture,
            vertices: new Float32Array(sprite.vertices),
            texCoords: new Uint32Array(sprite.texCoords),
            color: sprite.tint.toRgba(),
            blendMode: sprite.blendMode,
        });
    }
    flush() {
        const renderManager = this._renderManager;
        const device = this._device;
        const uniformBuffer = this._uniformBuffer;
        const uniformBindGroup = this._uniformBindGroup;
        const vertexBuffer = this._vertexBuffer;
        const indexBuffer = this._indexBuffer;
        if (!renderManager || !device || !uniformBuffer || !uniformBindGroup || !vertexBuffer || !indexBuffer) {
            return;
        }
        if (this._drawCalls.length === 0 && !renderManager.clearRequested) {
            return;
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
                        blend: getWebGpuBlendState(blendMode),
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
class WebGpuParticleRenderer extends AbstractWebGpuRenderer {
    constructor() {
        super(...arguments);
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
    render(system) {
        const runtime = this._renderManager;
        const texture = system.texture;
        if (runtime === null
            || !(texture instanceof Texture)
            || texture.source === null
            || texture.width === 0
            || texture.height === 0
            || system.particles.length === 0) {
            return;
        }
        runtime.setBlendMode(system.blendMode);
        this._drawCalls.push({
            texture,
            vertices: new Float32Array(system.vertices),
            texCoords: new Uint32Array(system.texCoords),
            particles: system.particles.slice(),
            transform: new Float32Array(system.getGlobalTransform().toArray(false)),
            blendMode: system.blendMode,
        });
    }
    flush() {
        const runtime = this._renderManager;
        const device = this._device;
        const uniformBuffer = this._uniformBuffer;
        const uniformBindGroup = this._uniformBindGroup;
        const staticVertexBuffer = this._staticVertexBuffer;
        const indexBuffer = this._indexBuffer;
        if (!runtime || !device || !uniformBuffer || !uniformBindGroup || !staticVertexBuffer || !this._instanceBuffer || !indexBuffer) {
            return;
        }
        if (this._drawCalls.length === 0 && !runtime.clearRequested) {
            return;
        }
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [runtime.createColorAttachment()],
        });
        pass.setBindGroup(0, uniformBindGroup);
        for (const drawCall of this._drawCalls) {
            const pipeline = this._getPipeline(drawCall.blendMode, runtime.renderTargetFormat);
            const textureBinding = runtime.getTextureBinding(drawCall.texture);
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
            this._writeUniformData(runtime, drawCall.transform, drawCall.texture);
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
        runtime.submit(encoder.finish());
        this._drawCalls.length = 0;
    }
    destroy() {
        this.disconnect();
    }
    onConnect(runtime) {
        this._renderManager = runtime;
        this._device = this._renderManager.device;
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
    onDisconnect() {
        this.flush();
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
        this._drawCalls.length = 0;
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
    _writeUniformData(runtime, transform, texture) {
        const projection = runtime.view.getTransform().toArray(false);
        const shouldPremultiplySample = runtime.shouldPremultiplyTextureSample(texture);
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
                        blend: getWebGpuBlendState(blendMode),
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
}

/// <reference types="@webgpu/types" />
const managedTextureFormat = 'rgba8unorm';
class WebGpuRenderManager {
    constructor(app) {
        this.backendType = RenderBackendType.WebGpu;
        this.rendererRegistry = new RendererRegistry();
        this._clearColor = new Color();
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
        this.rendererRegistry.registerRenderer(DrawableShape, new WebGpuPrimitiveRenderer());
        this.rendererRegistry.registerRenderer(Sprite, new WebGpuSpriteRenderer());
        this.rendererRegistry.registerRenderer(ParticleSystem, new WebGpuParticleRenderer());
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
    draw(drawable) {
        const renderer = this.rendererRegistry.resolve(drawable);
        this._setActiveRenderer(renderer);
        renderer.render(drawable);
        return this;
    }
    execute(pass) {
        this._flushActiveRenderer();
        pass.execute(this);
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
            this._flushActiveRenderer();
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
        this._flushActiveRenderer();
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
    flush() {
        if (!this._device || !this._context) {
            return this;
        }
        if (this._renderer) {
            this._flushActiveRenderer();
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
        this._setActiveRenderer(null);
        this.rendererRegistry.destroy();
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
    _setActiveRenderer(renderer) {
        if (this._renderer !== renderer) {
            this._flushActiveRenderer();
            this._renderer = renderer;
        }
    }
    _flushActiveRenderer() {
        this._renderer?.flush();
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
        this.rendererRegistry.connect(this);
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

var ChannelSize;
(function (ChannelSize) {
    ChannelSize[ChannelSize["Container"] = 768] = "Container";
    ChannelSize[ChannelSize["Category"] = 256] = "Category";
    ChannelSize[ChannelSize["Gamepad"] = 64] = "Gamepad";
})(ChannelSize || (ChannelSize = {}));
var Keyboard;
(function (Keyboard) {
    Keyboard[Keyboard["Backspace"] = 8] = "Backspace";
    Keyboard[Keyboard["Tab"] = 9] = "Tab";
    Keyboard[Keyboard["Clear"] = 12] = "Clear";
    Keyboard[Keyboard["Enter"] = 13] = "Enter";
    Keyboard[Keyboard["Shift"] = 16] = "Shift";
    Keyboard[Keyboard["Control"] = 17] = "Control";
    Keyboard[Keyboard["Alt"] = 18] = "Alt";
    Keyboard[Keyboard["Pause"] = 19] = "Pause";
    Keyboard[Keyboard["CapsLock"] = 20] = "CapsLock";
    Keyboard[Keyboard["Escape"] = 27] = "Escape";
    Keyboard[Keyboard["Space"] = 32] = "Space";
    Keyboard[Keyboard["PageUp"] = 33] = "PageUp";
    Keyboard[Keyboard["PageDown"] = 34] = "PageDown";
    Keyboard[Keyboard["End"] = 35] = "End";
    Keyboard[Keyboard["Home"] = 36] = "Home";
    Keyboard[Keyboard["Left"] = 37] = "Left";
    Keyboard[Keyboard["Up"] = 38] = "Up";
    Keyboard[Keyboard["Right"] = 39] = "Right";
    Keyboard[Keyboard["Down"] = 40] = "Down";
    Keyboard[Keyboard["Insert"] = 45] = "Insert";
    Keyboard[Keyboard["Delete"] = 46] = "Delete";
    Keyboard[Keyboard["Help"] = 47] = "Help";
    Keyboard[Keyboard["Zero"] = 48] = "Zero";
    Keyboard[Keyboard["One"] = 49] = "One";
    Keyboard[Keyboard["Two"] = 50] = "Two";
    Keyboard[Keyboard["Three"] = 51] = "Three";
    Keyboard[Keyboard["Four"] = 52] = "Four";
    Keyboard[Keyboard["Five"] = 53] = "Five";
    Keyboard[Keyboard["Six"] = 54] = "Six";
    Keyboard[Keyboard["Seven"] = 55] = "Seven";
    Keyboard[Keyboard["Eight"] = 56] = "Eight";
    Keyboard[Keyboard["Nine"] = 57] = "Nine";
    Keyboard[Keyboard["A"] = 65] = "A";
    Keyboard[Keyboard["B"] = 66] = "B";
    Keyboard[Keyboard["C"] = 67] = "C";
    Keyboard[Keyboard["D"] = 68] = "D";
    Keyboard[Keyboard["E"] = 69] = "E";
    Keyboard[Keyboard["F"] = 70] = "F";
    Keyboard[Keyboard["G"] = 71] = "G";
    Keyboard[Keyboard["H"] = 72] = "H";
    Keyboard[Keyboard["I"] = 73] = "I";
    Keyboard[Keyboard["J"] = 74] = "J";
    Keyboard[Keyboard["K"] = 75] = "K";
    Keyboard[Keyboard["L"] = 76] = "L";
    Keyboard[Keyboard["M"] = 77] = "M";
    Keyboard[Keyboard["N"] = 78] = "N";
    Keyboard[Keyboard["O"] = 79] = "O";
    Keyboard[Keyboard["P"] = 80] = "P";
    Keyboard[Keyboard["Q"] = 81] = "Q";
    Keyboard[Keyboard["R"] = 82] = "R";
    Keyboard[Keyboard["S"] = 83] = "S";
    Keyboard[Keyboard["T"] = 84] = "T";
    Keyboard[Keyboard["U"] = 85] = "U";
    Keyboard[Keyboard["V"] = 86] = "V";
    Keyboard[Keyboard["W"] = 87] = "W";
    Keyboard[Keyboard["X"] = 88] = "X";
    Keyboard[Keyboard["Y"] = 89] = "Y";
    Keyboard[Keyboard["Z"] = 90] = "Z";
    Keyboard[Keyboard["NumPad0"] = 96] = "NumPad0";
    Keyboard[Keyboard["NumPad1"] = 97] = "NumPad1";
    Keyboard[Keyboard["NumPad2"] = 98] = "NumPad2";
    Keyboard[Keyboard["NumPad3"] = 99] = "NumPad3";
    Keyboard[Keyboard["NumPad4"] = 100] = "NumPad4";
    Keyboard[Keyboard["NumPad5"] = 101] = "NumPad5";
    Keyboard[Keyboard["NumPad6"] = 102] = "NumPad6";
    Keyboard[Keyboard["NumPad7"] = 103] = "NumPad7";
    Keyboard[Keyboard["NumPad8"] = 104] = "NumPad8";
    Keyboard[Keyboard["NumPad9"] = 105] = "NumPad9";
    Keyboard[Keyboard["NumPadMultiply"] = 106] = "NumPadMultiply";
    Keyboard[Keyboard["NumPadAdd"] = 107] = "NumPadAdd";
    Keyboard[Keyboard["NumPadEnter"] = 108] = "NumPadEnter";
    Keyboard[Keyboard["NumPadSubtract"] = 109] = "NumPadSubtract";
    Keyboard[Keyboard["NumPadDecimal"] = 110] = "NumPadDecimal";
    Keyboard[Keyboard["NumPadDivide"] = 111] = "NumPadDivide";
    Keyboard[Keyboard["F1"] = 112] = "F1";
    Keyboard[Keyboard["F2"] = 113] = "F2";
    Keyboard[Keyboard["F3"] = 114] = "F3";
    Keyboard[Keyboard["F4"] = 115] = "F4";
    Keyboard[Keyboard["F5"] = 116] = "F5";
    Keyboard[Keyboard["F6"] = 117] = "F6";
    Keyboard[Keyboard["F7"] = 118] = "F7";
    Keyboard[Keyboard["F8"] = 119] = "F8";
    Keyboard[Keyboard["F9"] = 120] = "F9";
    Keyboard[Keyboard["F10"] = 121] = "F10";
    Keyboard[Keyboard["F11"] = 122] = "F11";
    Keyboard[Keyboard["F12"] = 123] = "F12";
    Keyboard[Keyboard["NumLock"] = 144] = "NumLock";
    Keyboard[Keyboard["ScrollLock"] = 145] = "ScrollLock";
    Keyboard[Keyboard["Colon"] = 186] = "Colon";
    Keyboard[Keyboard["Equals"] = 187] = "Equals";
    Keyboard[Keyboard["Comma"] = 188] = "Comma";
    Keyboard[Keyboard["Dash"] = 189] = "Dash";
    Keyboard[Keyboard["Period"] = 190] = "Period";
    Keyboard[Keyboard["QuestionMark"] = 191] = "QuestionMark";
    Keyboard[Keyboard["Tilde"] = 192] = "Tilde";
    Keyboard[Keyboard["OpenBracket"] = 219] = "OpenBracket";
    Keyboard[Keyboard["BackwardSlash"] = 220] = "BackwardSlash";
    Keyboard[Keyboard["ClosedBracket"] = 221] = "ClosedBracket";
    Keyboard[Keyboard["Quotes"] = 222] = "Quotes";
})(Keyboard || (Keyboard = {}));

class Gamepad {
    constructor(indexOrGamepad, channels, mappingOrDefinition) {
        this.onConnect = new Signal();
        this.onDisconnect = new Signal();
        this.onUpdate = new Signal();
        this.browserGamepad = null;
        this.info = {
            name: 'Generic Gamepad',
            label: 'Generic Gamepad',
            vendorId: null,
            productId: null,
            productKey: null,
        };
        const isBrowserGamepad = typeof indexOrGamepad !== 'number';
        const gamepad = isBrowserGamepad ? indexOrGamepad : null;
        const index = isBrowserGamepad ? indexOrGamepad.index : indexOrGamepad;
        this.indexValue = index;
        this.channelsValue = channels;
        this.channelOffset = 512 /* ChannelOffset.Gamepads */ + (index * ChannelSize.Gamepad);
        this.mappingValue = gamepad
            ? mappingOrDefinition.mapping
            : mappingOrDefinition;
        if (gamepad) {
            const definition = mappingOrDefinition;
            this.setInfo({
                name: definition.name,
                label: definition.descriptor.label,
                vendorId: definition.descriptor.vendorId,
                productId: definition.descriptor.productId,
                productKey: definition.descriptor.productKey,
            });
            this.connect(gamepad);
        }
    }
    get mapping() {
        return this.mappingValue;
    }
    set mapping(mapping) {
        this.mappingValue = mapping;
    }
    get mappingFamily() {
        return this.mappingValue.family;
    }
    get channels() {
        return this.channelsValue;
    }
    get gamepad() {
        return this.browserGamepad;
    }
    get index() {
        return this.indexValue;
    }
    get connected() {
        return this.browserGamepad !== null;
    }
    get name() {
        return this.info.name;
    }
    get label() {
        return this.info.label;
    }
    get vendorId() {
        return this.info.vendorId;
    }
    get productId() {
        return this.info.productId;
    }
    get productKey() {
        return this.info.productKey;
    }
    setInfo(info) {
        this.info = info;
        return this;
    }
    connect(gamepad) {
        const wasConnected = this.connected;
        this.browserGamepad = gamepad;
        if (!wasConnected) {
            this.onConnect.dispatch(this);
        }
        return this;
    }
    disconnect() {
        if (this.connected) {
            this.browserGamepad = null;
            this.clearMappedChannels();
            this.onDisconnect.dispatch(this);
        }
        return this;
    }
    update() {
        if (this.browserGamepad === null) {
            return this;
        }
        const channels = this.channelsValue;
        const { buttons: gamepadButtons, axes: gamepadAxes } = this.browserGamepad;
        for (const control of this.mappingValue.buttons) {
            const offsetChannel = this.resolveChannelOffset(control.channel);
            if (control.index < gamepadButtons.length) {
                const value = control.transformValue(gamepadButtons[control.index].value) || 0;
                if (channels[offsetChannel] !== value) {
                    channels[offsetChannel] = value;
                    this.onUpdate.dispatch(control.channel, value, this);
                }
            }
        }
        for (const control of this.mappingValue.axes) {
            const offsetChannel = this.resolveChannelOffset(control.channel);
            if (control.index < gamepadAxes.length) {
                const value = control.transformValue(gamepadAxes[control.index]) || 0;
                if (channels[offsetChannel] !== value) {
                    channels[offsetChannel] = value;
                    this.onUpdate.dispatch(control.channel, value, this);
                }
            }
        }
        return this;
    }
    clearChannels() {
        this.clearMappedChannels();
        return this;
    }
    destroy() {
        this.disconnect();
        this.clearMappedChannels();
        this.onConnect.destroy();
        this.onDisconnect.destroy();
        this.onUpdate.destroy();
    }
    resolveChannelOffset(channel) {
        return this.channelOffset + (channel ^ 512 /* ChannelOffset.Gamepads */);
    }
    static resolveChannelOffset(gamepadIndex, channel) {
        return 512 /* ChannelOffset.Gamepads */ + (gamepadIndex * ChannelSize.Gamepad) + (channel ^ 512 /* ChannelOffset.Gamepads */);
    }
    clearMappedChannels() {
        for (const control of this.mappingValue.buttons) {
            this.channelsValue[this.resolveChannelOffset(control.channel)] = 0;
        }
        for (const control of this.mappingValue.axes) {
            this.channelsValue[this.resolveChannelOffset(control.channel)] = 0;
        }
    }
}

var PointerStateFlag;
(function (PointerStateFlag) {
    PointerStateFlag[PointerStateFlag["None"] = 0] = "None";
    PointerStateFlag[PointerStateFlag["Over"] = 1] = "Over";
    PointerStateFlag[PointerStateFlag["Leave"] = 2] = "Leave";
    PointerStateFlag[PointerStateFlag["Down"] = 4] = "Down";
    PointerStateFlag[PointerStateFlag["Move"] = 8] = "Move";
    PointerStateFlag[PointerStateFlag["Up"] = 16] = "Up";
    PointerStateFlag[PointerStateFlag["Cancel"] = 32] = "Cancel";
})(PointerStateFlag || (PointerStateFlag = {}));
var PointerState;
(function (PointerState) {
    PointerState[PointerState["Unknown"] = 0] = "Unknown";
    PointerState[PointerState["InsideCanvas"] = 1] = "InsideCanvas";
    PointerState[PointerState["OutsideCanvas"] = 2] = "OutsideCanvas";
    PointerState[PointerState["Pressed"] = 3] = "Pressed";
    PointerState[PointerState["Moving"] = 4] = "Moving";
    PointerState[PointerState["Released"] = 5] = "Released";
    PointerState[PointerState["Cancelled"] = 6] = "Cancelled";
})(PointerState || (PointerState = {}));
class Pointer {
    constructor(event, canvas) {
        this.startPos = new Vector(-1, -1);
        this.stateFlags = new Flags();
        this._currentState = PointerState.Unknown;
        const { pointerId, pointerType, clientX, clientY, width, height, tiltX, tiltY, buttons, pressure, twist } = event;
        const { left, top } = canvas.getBoundingClientRect();
        this._canvas = canvas;
        this.id = pointerId;
        this.type = pointerType;
        this.position = new Vector(clientX - left, clientY - top);
        this.size = new Size(width, height);
        this.tilt = new Vector(tiltX, tiltY);
        this._buttons = buttons;
        this._pressure = pressure;
        this._rotation = twist;
        this.stateFlags.push(PointerStateFlag.Over);
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get width() {
        return this.size.width;
    }
    get height() {
        return this.size.height;
    }
    get buttons() {
        return this._buttons;
    }
    get pressure() {
        return this._pressure;
    }
    get rotation() {
        return this._rotation;
    }
    get currentState() {
        return this._currentState;
    }
    handleEnter(event) {
        this.handleEvent(event);
        this._currentState = PointerState.InsideCanvas;
    }
    handleLeave(event) {
        this.handleEvent(event);
        this.stateFlags.push(PointerStateFlag.Leave);
        this._currentState = PointerState.OutsideCanvas;
    }
    handlePress(event) {
        this.handleEvent(event);
        this.startPos.copy(this.position);
        this.stateFlags.push(PointerStateFlag.Down);
        this._currentState = PointerState.Pressed;
    }
    handleMove(event) {
        this.handleEvent(event);
        this.stateFlags.push(PointerStateFlag.Move);
        this._currentState = PointerState.Moving;
    }
    handleRelease(event) {
        this.handleEvent(event);
        this.stateFlags.push(PointerStateFlag.Up);
        this._currentState = PointerState.Released;
    }
    handleCancel(event) {
        this.handleEvent(event);
        this.stateFlags.push(PointerStateFlag.Cancel);
        this._currentState = PointerState.Cancelled;
    }
    destroy() {
        this.position.destroy();
        this.startPos.destroy();
        this.size.destroy();
        this.tilt.destroy();
        this._canvas = null;
    }
    handleEvent(event) {
        const { clientX, clientY, width, height, tiltX, tiltY, buttons, pressure, twist } = event;
        const { left, top } = this._canvas.getBoundingClientRect();
        this.position.set(clientX - left, clientY - top);
        this.size.set(width, height);
        this.tilt.set(tiltX, tiltY);
        this._buttons = buttons;
        this._pressure = pressure;
        this._rotation = twist;
        return this;
    }
}

var GamepadChannel;
(function (GamepadChannel) {
    GamepadChannel[GamepadChannel["ButtonSouth"] = 512] = "ButtonSouth";
    GamepadChannel[GamepadChannel["ButtonWest"] = 513] = "ButtonWest";
    GamepadChannel[GamepadChannel["ButtonEast"] = 514] = "ButtonEast";
    GamepadChannel[GamepadChannel["ButtonNorth"] = 515] = "ButtonNorth";
    GamepadChannel[GamepadChannel["LeftShoulder"] = 516] = "LeftShoulder";
    GamepadChannel[GamepadChannel["RightShoulder"] = 517] = "RightShoulder";
    GamepadChannel[GamepadChannel["LeftTrigger"] = 518] = "LeftTrigger";
    GamepadChannel[GamepadChannel["RightTrigger"] = 519] = "RightTrigger";
    GamepadChannel[GamepadChannel["Select"] = 520] = "Select";
    GamepadChannel[GamepadChannel["Start"] = 521] = "Start";
    GamepadChannel[GamepadChannel["LeftStick"] = 522] = "LeftStick";
    GamepadChannel[GamepadChannel["RightStick"] = 523] = "RightStick";
    GamepadChannel[GamepadChannel["DPadUp"] = 524] = "DPadUp";
    GamepadChannel[GamepadChannel["DPadDown"] = 525] = "DPadDown";
    GamepadChannel[GamepadChannel["DPadLeft"] = 526] = "DPadLeft";
    GamepadChannel[GamepadChannel["DPadRight"] = 527] = "DPadRight";
    GamepadChannel[GamepadChannel["Guide"] = 528] = "Guide";
    GamepadChannel[GamepadChannel["Share"] = 529] = "Share";
    GamepadChannel[GamepadChannel["Capture"] = 530] = "Capture";
    GamepadChannel[GamepadChannel["Touchpad"] = 531] = "Touchpad";
    GamepadChannel[GamepadChannel["Paddle1"] = 532] = "Paddle1";
    GamepadChannel[GamepadChannel["LeftStickLeft"] = 533] = "LeftStickLeft";
    GamepadChannel[GamepadChannel["LeftStickRight"] = 534] = "LeftStickRight";
    GamepadChannel[GamepadChannel["LeftStickUp"] = 535] = "LeftStickUp";
    GamepadChannel[GamepadChannel["LeftStickDown"] = 536] = "LeftStickDown";
    GamepadChannel[GamepadChannel["RightStickLeft"] = 537] = "RightStickLeft";
    GamepadChannel[GamepadChannel["RightStickRight"] = 538] = "RightStickRight";
    GamepadChannel[GamepadChannel["RightStickUp"] = 539] = "RightStickUp";
    GamepadChannel[GamepadChannel["RightStickDown"] = 540] = "RightStickDown";
    GamepadChannel[GamepadChannel["AuxiliaryAxis0Negative"] = 541] = "AuxiliaryAxis0Negative";
    GamepadChannel[GamepadChannel["AuxiliaryAxis0Positive"] = 542] = "AuxiliaryAxis0Positive";
    GamepadChannel[GamepadChannel["AuxiliaryAxis1Negative"] = 543] = "AuxiliaryAxis1Negative";
    GamepadChannel[GamepadChannel["AuxiliaryAxis1Positive"] = 544] = "AuxiliaryAxis1Positive";
    GamepadChannel[GamepadChannel["AuxiliaryAxis2Negative"] = 545] = "AuxiliaryAxis2Negative";
    GamepadChannel[GamepadChannel["AuxiliaryAxis2Positive"] = 546] = "AuxiliaryAxis2Positive";
    GamepadChannel[GamepadChannel["AuxiliaryAxis3Negative"] = 547] = "AuxiliaryAxis3Negative";
    GamepadChannel[GamepadChannel["AuxiliaryAxis3Positive"] = 548] = "AuxiliaryAxis3Positive";
})(GamepadChannel || (GamepadChannel = {}));

class GamepadControl {
    constructor(index, channel, options = {}) {
        this.index = index;
        this.channel = channel;
        this.invert = options.invert ?? false;
        this.normalize = options.normalize ?? false;
        this.threshold = clamp(options.threshold ?? 0.2, 0, 1);
    }
    transformValue(value) {
        let result = clamp(value, -1, 1);
        if (this.invert) {
            result *= -1;
        }
        if (this.normalize) {
            result = (result + 1) / 2;
        }
        return result > this.threshold ? result : 0;
    }
}

var GamepadMappingFamily;
(function (GamepadMappingFamily) {
    GamepadMappingFamily["GenericDualAnalog"] = "genericDualAnalog";
    GamepadMappingFamily["Xbox"] = "xbox";
    GamepadMappingFamily["PlayStation"] = "playStation";
    GamepadMappingFamily["SwitchPro"] = "switchPro";
    GamepadMappingFamily["JoyConLeft"] = "joyConLeft";
    GamepadMappingFamily["JoyConRight"] = "joyConRight";
    GamepadMappingFamily["GameCube"] = "gameCube";
    GamepadMappingFamily["SteamController"] = "steamController";
    GamepadMappingFamily["ArcadeStick"] = "arcadeStick";
})(GamepadMappingFamily || (GamepadMappingFamily = {}));
class GamepadMapping {
    constructor(buttons, axes) {
        this.buttons = buttons;
        this.axes = axes;
    }
    destroy() {
        this.buttons.length = 0;
        this.axes.length = 0;
    }
    static createControls(definitions) {
        return definitions.map(([index, channel, options]) => new GamepadControl(index, channel, options));
    }
}

const arcadeStickButtonDefinitions = [
    [0, GamepadChannel.ButtonSouth],
    [1, GamepadChannel.ButtonEast],
    [2, GamepadChannel.ButtonWest],
    [3, GamepadChannel.ButtonNorth],
    [4, GamepadChannel.LeftShoulder],
    [5, GamepadChannel.RightShoulder],
    [6, GamepadChannel.LeftTrigger],
    [7, GamepadChannel.RightTrigger],
    [8, GamepadChannel.Select],
    [9, GamepadChannel.Start],
    [12, GamepadChannel.DPadUp],
    [13, GamepadChannel.DPadDown],
    [14, GamepadChannel.DPadLeft],
    [15, GamepadChannel.DPadRight],
    [16, GamepadChannel.Guide],
];
class ArcadeStickGamepadMapping extends GamepadMapping {
    constructor() {
        super(GamepadMapping.createControls(arcadeStickButtonDefinitions), []);
        this.family = GamepadMappingFamily.ArcadeStick;
    }
}

const genericDualAnalogButtonDefinitions = [
    [0, GamepadChannel.ButtonSouth],
    [1, GamepadChannel.ButtonEast],
    [2, GamepadChannel.ButtonWest],
    [3, GamepadChannel.ButtonNorth],
    [4, GamepadChannel.LeftShoulder],
    [5, GamepadChannel.RightShoulder],
    [6, GamepadChannel.LeftTrigger],
    [7, GamepadChannel.RightTrigger],
    [8, GamepadChannel.Select],
    [9, GamepadChannel.Start],
    [10, GamepadChannel.LeftStick],
    [11, GamepadChannel.RightStick],
    [12, GamepadChannel.DPadUp],
    [13, GamepadChannel.DPadDown],
    [14, GamepadChannel.DPadLeft],
    [15, GamepadChannel.DPadRight],
    [16, GamepadChannel.Guide],
    [17, GamepadChannel.Share],
    [18, GamepadChannel.Capture],
    [19, GamepadChannel.Touchpad],
    [20, GamepadChannel.Paddle1],
];
const genericDualAnalogAxisDefinitions = [
    [0, GamepadChannel.LeftStickLeft, { invert: true }],
    [0, GamepadChannel.LeftStickRight],
    [1, GamepadChannel.LeftStickUp, { invert: true }],
    [1, GamepadChannel.LeftStickDown],
    [2, GamepadChannel.RightStickLeft, { invert: true }],
    [2, GamepadChannel.RightStickRight],
    [3, GamepadChannel.RightStickUp, { invert: true }],
    [3, GamepadChannel.RightStickDown],
    [4, GamepadChannel.AuxiliaryAxis0Negative, { invert: true }],
    [4, GamepadChannel.AuxiliaryAxis0Positive],
    [5, GamepadChannel.AuxiliaryAxis1Negative, { invert: true }],
    [5, GamepadChannel.AuxiliaryAxis1Positive],
    [6, GamepadChannel.AuxiliaryAxis2Negative, { invert: true }],
    [6, GamepadChannel.AuxiliaryAxis2Positive],
    [7, GamepadChannel.AuxiliaryAxis3Negative, { invert: true }],
    [7, GamepadChannel.AuxiliaryAxis3Positive],
];
class GenericDualAnalogGamepadMapping extends GamepadMapping {
    constructor() {
        super(GamepadMapping.createControls(genericDualAnalogButtonDefinitions), GamepadMapping.createControls(genericDualAnalogAxisDefinitions));
        this.family = GamepadMappingFamily.GenericDualAnalog;
    }
}

class GameCubeGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.GameCube;
    }
}

class JoyConLeftGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.JoyConLeft;
    }
}

class JoyConRightGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.JoyConRight;
    }
}

class PlayStationGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.PlayStation;
    }
}

class SteamControllerGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.SteamController;
    }
}

class SwitchProGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.SwitchPro;
    }
}

class XboxGamepadMapping extends GenericDualAnalogGamepadMapping {
    constructor() {
        super(...arguments);
        this.family = GamepadMappingFamily.Xbox;
    }
}

const vendorProductPattern = /vendor[:\s]*([0-9a-f]{4})\s*product[:\s]*([0-9a-f]{4})/i;
const vendorProductHexPattern = /vendor[:\s]*0x([0-9a-f]{4})\s*product[:\s]*0x([0-9a-f]{4})/i;
const vendorProductPairPattern = /\b([0-9a-f]{4})[-: ]([0-9a-f]{4})\b/i;
const vidPidPattern = /vid[_:\s]*([0-9a-f]{4}).{0,8}pid[_:\s]*([0-9a-f]{4})/i;
const createStaticGamepadDefinition = (name, createMapping, ids) => ({
    ids,
    name,
    resolve: () => ({
        name,
        mapping: createMapping(),
    }),
});
const normalizeId = (id) => id.trim().toLowerCase();
const parseProductKey = (id) => {
    const match = vendorProductHexPattern.exec(id)
        || vendorProductPattern.exec(id)
        || vidPidPattern.exec(id)
        || vendorProductPairPattern.exec(id);
    if (!match) {
        return null;
    }
    return `${match[1].toLowerCase()}:${match[2].toLowerCase()}`;
};
const parseName = (label) => {
    const name = label
        .replace(vendorProductHexPattern, '')
        .replace(vendorProductPattern, '')
        .replace(vidPidPattern, '')
        .replace(vendorProductPairPattern, '')
        .replace(/\s+/g, ' ')
        .trim();
    return name.length > 0 ? name : null;
};
const resolveDefinitionResult = (definition, descriptor) => {
    const result = definition.resolve(descriptor);
    if (result == null) {
        return null;
    }
    if ('mapping' in result) {
        return {
            descriptor,
            name: result.name ?? definition.name ?? descriptor.name ?? descriptor.label,
            mapping: result.mapping,
        };
    }
    return {
        descriptor,
        name: definition.name ?? descriptor.name ?? descriptor.label,
        mapping: result,
    };
};
const normalizeIds = (ids) => {
    if (!ids) {
        return [];
    }
    const values = Array.isArray(ids) ? ids : [ids];
    return values.map(normalizeId);
};
const matchesIds = (descriptor, ids) => {
    if (!ids) {
        return true;
    }
    for (const id of normalizeIds(ids)) {
        if (id.includes(':')) {
            if (descriptor.productKey === id) {
                return true;
            }
            continue;
        }
        if (descriptor.vendorId === id) {
            return true;
        }
    }
    return false;
};
const parseGamepadDescriptor = (gamepad) => {
    const label = gamepad.id.trim() || `Gamepad ${gamepad.index}`;
    const productKey = parseProductKey(label);
    const vendorId = productKey?.slice(0, 4) ?? null;
    const productId = productKey?.slice(5) ?? null;
    return {
        id: gamepad.id,
        index: gamepad.index,
        label,
        vendorId,
        productId,
        productKey,
        name: parseName(label),
    };
};
const resolveDefinition = (definition, descriptor) => {
    if (!matchesIds(descriptor, definition.ids)) {
        return null;
    }
    return resolveDefinitionResult(definition, descriptor);
};
const resolveGamepadDefinition = (gamepadOrDescriptor, definitions = builtInGamepadDefinitions) => {
    const descriptor = 'connected' in gamepadOrDescriptor
        ? parseGamepadDescriptor(gamepadOrDescriptor)
        : gamepadOrDescriptor;
    for (const definition of definitions) {
        const resolvedDefinition = resolveDefinition(definition, descriptor);
        if (resolvedDefinition) {
            return resolvedDefinition;
        }
    }
    return {
        descriptor,
        name: descriptor.name ?? descriptor.label,
        mapping: new GenericDualAnalogGamepadMapping(),
    };
};
const exactDeviceDefinitions = [
    createStaticGamepadDefinition('Xbox 360 Controller', () => new XboxGamepadMapping(), '045e:028e'),
    createStaticGamepadDefinition('Xbox One Controller', () => new XboxGamepadMapping(), ['045e:02d1', '045e:02dd']),
    createStaticGamepadDefinition('Xbox Wireless Controller', () => new XboxGamepadMapping(), ['045e:02e0', '045e:02ea', '045e:02fd', '045e:0b20']),
    createStaticGamepadDefinition('Xbox One Elite Controller', () => new XboxGamepadMapping(), '045e:02e3'),
    createStaticGamepadDefinition('Xbox Elite Wireless Controller Series 2', () => new XboxGamepadMapping(), ['045e:0b00', '045e:0b05', '045e:0b22']),
    createStaticGamepadDefinition('Xbox Series Controller', () => new XboxGamepadMapping(), ['045e:0b12', '045e:0b13']),
    createStaticGamepadDefinition('PlayStation 3 Controller', () => new PlayStationGamepadMapping(), '054c:0268'),
    createStaticGamepadDefinition('DualShock 4 Controller', () => new PlayStationGamepadMapping(), ['054c:05c4', '054c:09cc', '054c:0ba0']),
    createStaticGamepadDefinition('DualSense Controller', () => new PlayStationGamepadMapping(), '054c:0ce6'),
    createStaticGamepadDefinition('DualSense Edge Controller', () => new PlayStationGamepadMapping(), '054c:0df2'),
    createStaticGamepadDefinition('GameCube Controller Adapter', () => new GameCubeGamepadMapping(), '057e:0337'),
    createStaticGamepadDefinition('Joy-Con (L)', () => new JoyConLeftGamepadMapping(), '057e:2006'),
    createStaticGamepadDefinition('Joy-Con (R)', () => new JoyConRightGamepadMapping(), '057e:2007'),
    createStaticGamepadDefinition('Joy-Con Charging Grip', () => new SwitchProGamepadMapping(), '057e:200e'),
    createStaticGamepadDefinition('Switch Pro Controller', () => new SwitchProGamepadMapping(), '057e:2009'),
    createStaticGamepadDefinition('Joy-Con 2 (L)', () => new JoyConLeftGamepadMapping(), '057e:2066'),
    createStaticGamepadDefinition('Joy-Con 2 (R)', () => new JoyConRightGamepadMapping(), '057e:2067'),
    createStaticGamepadDefinition('Switch 2 Pro Controller', () => new SwitchProGamepadMapping(), '057e:2069'),
    createStaticGamepadDefinition('Switch 2 GameCube Controller', () => new GameCubeGamepadMapping(), '057e:2073'),
    createStaticGamepadDefinition('Steam Controller', () => new SteamControllerGamepadMapping(), ['28de:1102', '28de:1142']),
    createStaticGamepadDefinition('F310 Gamepad', () => new GenericDualAnalogGamepadMapping(), '046d:c216'),
    createStaticGamepadDefinition('F710 Gamepad', () => new GenericDualAnalogGamepadMapping(), ['046d:c219', '046d:c21f']),
    createStaticGamepadDefinition('8BitDo P30 Controller', () => new GenericDualAnalogGamepadMapping(), ['2dc8:5107', '2dc8:5108']),
    createStaticGamepadDefinition('8BitDo SF30 Pro Controller', () => new SwitchProGamepadMapping(), ['2dc8:3000', '2dc8:6100', '2dc8:6101']),
    createStaticGamepadDefinition('8BitDo SN30 Controller', () => new SwitchProGamepadMapping(), ['2dc8:3001', '2dc8:5103', '2dc8:9020', '2dc8:ab20', '2dc8:2840', '2dc8:2862']),
    createStaticGamepadDefinition('8BitDo NES30 Controller', () => new GenericDualAnalogGamepadMapping(), '2dc8:ab12'),
    createStaticGamepadDefinition('PowerA Switch Controller', () => new SwitchProGamepadMapping(), '20d6:a713'),
    createStaticGamepadDefinition('PowerA OPS Pro Wireless Controller', () => new GenericDualAnalogGamepadMapping(), '20d6:4033'),
    createStaticGamepadDefinition('PowerA OPS Wireless Controller', () => new GenericDualAnalogGamepadMapping(), '20d6:4026'),
    createStaticGamepadDefinition('Nacon Revolution 3 Controller', () => new PlayStationGamepadMapping(), '146b:0611'),
    createStaticGamepadDefinition('Nacon Revolution Unlimited Pro Controller', () => new PlayStationGamepadMapping(), '146b:0d08'),
    createStaticGamepadDefinition('Nacon Revolution Infinity Controller', () => new PlayStationGamepadMapping(), '146b:0d10'),
    createStaticGamepadDefinition('Nacon Revolution 5 Pro Controller', () => new PlayStationGamepadMapping(), ['3285:0d17', '3285:0d19']),
    createStaticGamepadDefinition('Razer Raiju Controller', () => new PlayStationGamepadMapping(), '1532:1000'),
    createStaticGamepadDefinition('Razer Raiju Mobile Controller', () => new PlayStationGamepadMapping(), ['1532:0705', '1532:0707']),
    createStaticGamepadDefinition('Razer Raiju Tournament Edition Controller', () => new PlayStationGamepadMapping(), ['1532:1007', '1532:100a']),
    createStaticGamepadDefinition('Razer Raiju Ultimate Controller', () => new PlayStationGamepadMapping(), ['1532:1004', '1532:1009']),
    createStaticGamepadDefinition('Razer Raion Controller', () => new ArcadeStickGamepadMapping(), '1532:1100'),
];
const vendorFallbackDefinitions = [
    createStaticGamepadDefinition('Microsoft Controller', () => new XboxGamepadMapping(), '045e'),
    createStaticGamepadDefinition('Sony Controller', () => new PlayStationGamepadMapping(), '054c'),
];
const genericFallbackDefinition = createStaticGamepadDefinition('Generic Gamepad', () => new GenericDualAnalogGamepadMapping());
const builtInGamepadDefinitions = [
    ...exactDeviceDefinitions,
    ...vendorFallbackDefinitions,
    genericFallbackDefinition,
];

var InputManagerFlag;
(function (InputManagerFlag) {
    InputManagerFlag[InputManagerFlag["None"] = 0] = "None";
    InputManagerFlag[InputManagerFlag["KeyDown"] = 1] = "KeyDown";
    InputManagerFlag[InputManagerFlag["KeyUp"] = 2] = "KeyUp";
    InputManagerFlag[InputManagerFlag["MouseWheel"] = 4] = "MouseWheel";
    InputManagerFlag[InputManagerFlag["PointerUpdate"] = 8] = "PointerUpdate";
})(InputManagerFlag || (InputManagerFlag = {}));
class InputManager {
    constructor(app) {
        this.channels = new Float32Array(ChannelSize.Container);
        this.inputs = new Set();
        this.pointers = {};
        this.gamepadsValue = [];
        this.gamepadsByIndex = new Map();
        this.gamepadSlotsActive = new Uint8Array(ChannelSize.Category / ChannelSize.Gamepad);
        this.wheelOffset = new Vector();
        this.flags = new Flags();
        this.channelsPressed = [];
        this.channelsReleased = [];
        this.keyDownHandler = this.handleKeyDown.bind(this);
        this.keyUpHandler = this.handleKeyUp.bind(this);
        this.canvasFocusHandler = this.handleCanvasFocus.bind(this);
        this.canvasBlurHandler = this.handleCanvasBlur.bind(this);
        this.windowBlurHandler = this.handleWindowBlur.bind(this);
        this.mouseWheelHandler = this.handleMouseWheel.bind(this);
        this.pointerOverHandler = this.handlePointerOver.bind(this);
        this.pointerLeaveHandler = this.handlePointerLeave.bind(this);
        this.pointerDownHandler = this.handlePointerDown.bind(this);
        this.pointerMoveHandler = this.handlePointerMove.bind(this);
        this.pointerUpHandler = this.handlePointerUp.bind(this);
        this.pointerCancelHandler = this.handlePointerCancel.bind(this);
        this.onPointerEnter = new Signal();
        this.onPointerLeave = new Signal();
        this.onPointerDown = new Signal();
        this.onPointerMove = new Signal();
        this.onPointerUp = new Signal();
        this.onPointerTap = new Signal();
        this.onPointerSwipe = new Signal();
        this.onPointerCancel = new Signal();
        this.onMouseWheel = new Signal();
        this.onKeyDown = new Signal();
        this.onKeyUp = new Signal();
        this.onGamepadConnected = new Signal();
        this.onGamepadDisconnected = new Signal();
        this.onGamepadUpdated = new Signal();
        const { gamepadDefinitions = [], pointerDistanceThreshold } = app.options;
        this.canvas = app.canvas;
        this.canvasFocusedValue = document.activeElement === this.canvas;
        this.pointerDistanceThreshold = pointerDistanceThreshold;
        this.gamepadDefinitions = [...gamepadDefinitions, ...builtInGamepadDefinitions];
        this.addEventListeners();
    }
    get pointersInCanvas() {
        return Object.values(this.pointers).some((pointer) => (pointer.currentState !== PointerState.OutsideCanvas
            && pointer.currentState !== PointerState.Cancelled));
    }
    get canvasFocused() {
        return this.canvasFocusedValue;
    }
    get gamepads() {
        return this.gamepadsValue;
    }
    getGamepad(index) {
        return this.gamepadsByIndex.get(index) ?? null;
    }
    add(inputs) {
        if (Array.isArray(inputs)) {
            inputs.forEach((input) => this.add(input));
            return this;
        }
        this.inputs.add(inputs);
        return this;
    }
    remove(inputs) {
        if (Array.isArray(inputs)) {
            inputs.forEach((input) => this.remove(input));
            return this;
        }
        this.inputs.delete(inputs);
        return this;
    }
    clear(destroyInputs = false) {
        if (destroyInputs) {
            for (const input of this.inputs) {
                input.destroy();
            }
        }
        this.inputs.clear();
        return this;
    }
    update() {
        this.updateGamepads();
        for (const input of this.inputs) {
            input.update(this.channels);
        }
        if (this.flags.value !== InputManagerFlag.None) {
            this.updateEvents();
        }
        return this;
    }
    destroy() {
        this.removeEventListeners();
        for (const pointer of Object.values(this.pointers)) {
            pointer.destroy();
        }
        for (const gamepad of this.gamepadsValue) {
            gamepad.destroy();
        }
        this.inputs.clear();
        this.gamepadsByIndex.clear();
        this.gamepadsValue.length = 0;
        this.channelsPressed.length = 0;
        this.channelsReleased.length = 0;
        this.wheelOffset.destroy();
        this.flags.destroy();
        this.onPointerEnter.destroy();
        this.onPointerLeave.destroy();
        this.onPointerDown.destroy();
        this.onPointerMove.destroy();
        this.onPointerUp.destroy();
        this.onPointerTap.destroy();
        this.onPointerSwipe.destroy();
        this.onPointerCancel.destroy();
        this.onMouseWheel.destroy();
        this.onKeyDown.destroy();
        this.onKeyUp.destroy();
        this.onGamepadConnected.destroy();
        this.onGamepadDisconnected.destroy();
        this.onGamepadUpdated.destroy();
    }
    handleKeyDown(event) {
        const channel = 0 /* ChannelOffset.Keyboard */ + event.keyCode;
        this.channels[channel] = 1;
        this.channelsPressed.push(channel);
        this.flags.push(InputManagerFlag.KeyDown);
    }
    handleKeyUp(event) {
        const channel = 0 /* ChannelOffset.Keyboard */ + event.keyCode;
        this.channels[channel] = 0;
        this.channelsReleased.push(channel);
        this.flags.push(InputManagerFlag.KeyUp);
    }
    handlePointerOver(event) {
        this.pointers[event.pointerId] = new Pointer(event, this.canvas);
        this.flags.push(InputManagerFlag.PointerUpdate);
    }
    handlePointerLeave(event) {
        this.pointers[event.pointerId].handleLeave(event);
        this.flags.push(InputManagerFlag.PointerUpdate);
    }
    handlePointerDown(event) {
        this.canvas.focus();
        this.canvasFocusedValue = true;
        this.pointers[event.pointerId].handlePress(event);
        this.flags.push(InputManagerFlag.PointerUpdate);
        event.preventDefault();
    }
    handlePointerMove(event) {
        this.pointers[event.pointerId].handleMove(event);
        this.flags.push(InputManagerFlag.PointerUpdate);
    }
    handlePointerUp(event) {
        this.pointers[event.pointerId].handleRelease(event);
        this.flags.push(InputManagerFlag.PointerUpdate);
        event.preventDefault();
    }
    handlePointerCancel(event) {
        this.pointers[event.pointerId].handleCancel(event);
        this.flags.push(InputManagerFlag.PointerUpdate);
    }
    handleMouseWheel(event) {
        this.wheelOffset.set(event.deltaX, event.deltaY);
        this.flags.push(InputManagerFlag.MouseWheel);
        if (this.canvasFocusedValue) {
            event.preventDefault();
        }
    }
    handleCanvasFocus() {
        this.canvasFocusedValue = true;
    }
    handleCanvasBlur() {
        this.canvasFocusedValue = false;
    }
    handleWindowBlur() {
        this.canvasFocusedValue = false;
    }
    addEventListeners() {
        const activeWindow = window;
        const activeListenerOption = { capture: true, passive: false };
        const passiveListenerOption = { capture: true, passive: true };
        activeWindow.addEventListener('keydown', this.keyDownHandler, true);
        activeWindow.addEventListener('keyup', this.keyUpHandler, true);
        activeWindow.addEventListener('blur', this.windowBlurHandler, true);
        this.canvas.addEventListener('focus', this.canvasFocusHandler, true);
        this.canvas.addEventListener('blur', this.canvasBlurHandler, true);
        this.canvas.addEventListener('wheel', this.mouseWheelHandler, activeListenerOption);
        this.canvas.addEventListener('pointerover', this.pointerOverHandler, passiveListenerOption);
        this.canvas.addEventListener('pointerleave', this.pointerLeaveHandler, passiveListenerOption);
        this.canvas.addEventListener('pointerdown', this.pointerDownHandler, activeListenerOption);
        this.canvas.addEventListener('pointermove', this.pointerMoveHandler, passiveListenerOption);
        this.canvas.addEventListener('pointerup', this.pointerUpHandler, activeListenerOption);
        this.canvas.addEventListener('pointercancel', this.pointerCancelHandler, passiveListenerOption);
        this.canvas.addEventListener('contextmenu', stopEvent, activeListenerOption);
        this.canvas.addEventListener('selectstart', stopEvent, activeListenerOption);
    }
    removeEventListeners() {
        const activeListenerOption = { capture: true, passive: false };
        const passiveListenerOption = { capture: true, passive: true };
        window.removeEventListener('keydown', this.keyDownHandler, true);
        window.removeEventListener('keyup', this.keyUpHandler, true);
        window.removeEventListener('blur', this.windowBlurHandler, true);
        this.canvas.removeEventListener('focus', this.canvasFocusHandler, true);
        this.canvas.removeEventListener('blur', this.canvasBlurHandler, true);
        this.canvas.removeEventListener('wheel', this.mouseWheelHandler, activeListenerOption);
        this.canvas.removeEventListener('pointerover', this.pointerOverHandler, passiveListenerOption);
        this.canvas.removeEventListener('pointerleave', this.pointerLeaveHandler, passiveListenerOption);
        this.canvas.removeEventListener('pointerdown', this.pointerDownHandler, activeListenerOption);
        this.canvas.removeEventListener('pointermove', this.pointerMoveHandler, passiveListenerOption);
        this.canvas.removeEventListener('pointerup', this.pointerUpHandler, activeListenerOption);
        this.canvas.removeEventListener('pointercancel', this.pointerCancelHandler, passiveListenerOption);
        this.canvas.removeEventListener('contextmenu', stopEvent, activeListenerOption);
        this.canvas.removeEventListener('selectstart', stopEvent, activeListenerOption);
    }
    updateGamepads() {
        const activeGamepads = window.navigator.getGamepads();
        this.gamepadSlotsActive.fill(0);
        for (const activeGamepad of activeGamepads) {
            if (!activeGamepad) {
                continue;
            }
            const activeIndex = activeGamepad.index;
            if (activeIndex < 0 || activeIndex >= this.gamepadSlotsActive.length) {
                continue;
            }
            this.gamepadSlotsActive[activeIndex] = 1;
            let gamepad = this.gamepadsByIndex.get(activeIndex);
            if (!gamepad) {
                const definition = resolveGamepadDefinition(activeGamepad, this.gamepadDefinitions);
                gamepad = new Gamepad(activeGamepad, this.channels, definition);
                this.gamepadsByIndex.set(activeIndex, gamepad);
                this.insertGamepadByIndex(gamepad);
                this.onGamepadConnected.dispatch(gamepad, this.gamepadsValue);
            }
            else {
                gamepad.connect(activeGamepad);
            }
            gamepad.update();
            this.onGamepadUpdated.dispatch(gamepad, this.gamepadsValue);
        }
        for (let index = this.gamepadsValue.length - 1; index >= 0; index -= 1) {
            const gamepad = this.gamepadsValue[index];
            if (this.gamepadSlotsActive[gamepad.index] === 0) {
                gamepad.disconnect();
                this.gamepadsValue.splice(index, 1);
                this.gamepadsByIndex.delete(gamepad.index);
                this.onGamepadDisconnected.dispatch(gamepad, this.gamepadsValue);
                gamepad.destroy();
            }
        }
        return this;
    }
    insertGamepadByIndex(gamepad) {
        let insertIndex = 0;
        while (insertIndex < this.gamepadsValue.length && this.gamepadsValue[insertIndex].index < gamepad.index) {
            insertIndex += 1;
        }
        this.gamepadsValue.splice(insertIndex, 0, gamepad);
    }
    updateEvents() {
        if (this.flags.pop(InputManagerFlag.KeyDown)) {
            for (const channel of this.channelsPressed) {
                this.onKeyDown.dispatch(channel);
            }
            this.channelsPressed.length = 0;
        }
        if (this.flags.pop(InputManagerFlag.KeyUp)) {
            for (const channel of this.channelsReleased) {
                this.onKeyUp.dispatch(channel);
            }
            this.channelsReleased.length = 0;
        }
        if (this.flags.pop(InputManagerFlag.MouseWheel)) {
            this.onMouseWheel.dispatch(this.wheelOffset);
            this.wheelOffset.set(0, 0);
        }
        if (this.flags.pop(InputManagerFlag.PointerUpdate)) {
            this.updatePointerEvents();
        }
        return this;
    }
    updatePointerEvents() {
        for (const pointer of Object.values(this.pointers)) {
            const { stateFlags } = pointer;
            if (stateFlags.value === PointerStateFlag.None) {
                continue;
            }
            if (stateFlags.pop(PointerStateFlag.Over)) {
                this.onPointerEnter.dispatch(pointer);
            }
            if (stateFlags.pop(PointerStateFlag.Down)) {
                this.onPointerDown.dispatch(pointer);
            }
            if (stateFlags.pop(PointerStateFlag.Move)) {
                this.onPointerMove.dispatch(pointer);
            }
            if (stateFlags.pop(PointerStateFlag.Up)) {
                const { x: startX, y: startY } = pointer.startPos;
                this.onPointerUp.dispatch(pointer);
                if (startX >= 0 && startY >= 0) {
                    if (getDistance(startX, startY, pointer.x, pointer.y) < this.pointerDistanceThreshold) {
                        this.onPointerTap.dispatch(pointer);
                    }
                    else {
                        this.onPointerSwipe.dispatch(pointer);
                    }
                }
                pointer.startPos.set(-1, -1);
            }
            if (stateFlags.pop(PointerStateFlag.Cancel)) {
                this.onPointerCancel.dispatch(pointer);
            }
            if (stateFlags.pop(PointerStateFlag.Leave)) {
                this.onPointerLeave.dispatch(pointer);
                delete this.pointers[pointer.id];
            }
        }
    }
}

class AbstractMedia {
    get duration() {
        return this._duration;
    }
    get volume() {
        return this._volume;
    }
    set volume(volume) {
        this.setVolume(volume);
    }
    get loop() {
        return this._loop;
    }
    set loop(loop) {
        this.setLoop(loop);
    }
    get playbackRate() {
        return this._playbackRate;
    }
    set playbackRate(playbackRate) {
        this.setPlaybackRate(playbackRate);
    }
    get currentTime() {
        return this.getTime();
    }
    set currentTime(currentTime) {
        this.setTime(currentTime);
    }
    get muted() {
        return this._muted;
    }
    set muted(muted) {
        this.setMuted(muted);
    }
    get progress() {
        const elapsed = this.currentTime;
        const duration = this.duration;
        return ((elapsed % duration) / duration);
    }
    get playing() {
        return !this.paused;
    }
    set playing(playing) {
        if (playing) {
            this.play();
        }
        else {
            this.pause();
        }
    }
    constructor(initialState) {
        this.onStart = new Signal();
        this.onStop = new Signal();
        const { duration, volume, playbackRate, loop, muted } = initialState;
        this._duration = duration;
        this._volume = volume;
        this._playbackRate = playbackRate;
        this._loop = loop;
        this._muted = muted;
    }
    stop(options) {
        this.pause(options);
        this.currentTime = 0;
        return this;
    }
    toggle(options) {
        return this.paused ? this.play(options) : this.pause(options);
    }
    applyOptions(options = {}) {
        const { volume, loop, playbackRate, time, muted } = options;
        if (volume !== undefined) {
            this.volume = volume;
        }
        if (loop !== undefined) {
            this.loop = loop;
        }
        if (playbackRate !== undefined) {
            this.playbackRate = playbackRate;
        }
        if (time !== undefined) {
            this.currentTime = time;
        }
        if (muted !== undefined) {
            this.muted = muted;
        }
        return this;
    }
    destroy() {
        this.stop();
        this.onStart.destroy();
        this.onStop.destroy();
    }
}

const interactionEvents = ['mousedown', 'touchstart', 'touchend'];
let internalAudioContext = null;
let internalOfflineAudioContext = null;
let interactionListenersAdded = false;
let stateChangeListenerAdded = false;
let readyDispatched = false;
const supportsAudioContext = () => typeof AudioContext !== 'undefined';
const supportsOfflineAudioContext = () => typeof OfflineAudioContext !== 'undefined';
const canUseDocument = () => typeof document !== 'undefined';
const getExistingAudioContext = () => internalAudioContext;
const getOrCreateAudioContext = () => {
    if (!supportsAudioContext()) {
        throw new Error('This environment does not support AudioContext.');
    }
    if (internalAudioContext === null) {
        internalAudioContext = new AudioContext();
    }
    return internalAudioContext;
};
const getOrCreateOfflineAudioContext = () => {
    if (!supportsOfflineAudioContext()) {
        throw new Error('This environment does not support OfflineAudioContext.');
    }
    if (internalOfflineAudioContext === null) {
        const audioContext = getOrCreateAudioContext();
        internalOfflineAudioContext = new OfflineAudioContext(1, 2, audioContext.sampleRate);
    }
    return internalOfflineAudioContext;
};
const removeInteractionListeners = () => {
    if (!interactionListenersAdded || !canUseDocument()) {
        return;
    }
    for (const eventName of interactionEvents) {
        document.removeEventListener(eventName, onUserInteraction, false);
    }
    interactionListenersAdded = false;
};
const dispatchReadyIfRunning = () => {
    const audioContext = getExistingAudioContext();
    if (!audioContext || audioContext.state !== 'running' || readyDispatched) {
        return;
    }
    readyDispatched = true;
    removeInteractionListeners();
    onAudioContextReady.dispatch(audioContext);
};
const onAudioContextStateChange = () => {
    dispatchReadyIfRunning();
};
const addInteractionListeners = () => {
    if (interactionListenersAdded || !canUseDocument()) {
        return;
    }
    for (const eventName of interactionEvents) {
        document.addEventListener(eventName, onUserInteraction, false);
    }
    interactionListenersAdded = true;
};
const ensureAudioContextReadyMonitoring = () => {
    const audioContext = getOrCreateAudioContext();
    const audioContextEventTarget = audioContext;
    if (!stateChangeListenerAdded && typeof audioContextEventTarget.addEventListener === 'function') {
        audioContextEventTarget.addEventListener('statechange', onAudioContextStateChange);
        stateChangeListenerAdded = true;
    }
    dispatchReadyIfRunning();
    if (!readyDispatched) {
        addInteractionListeners();
    }
};
const onUserInteraction = () => {
    const audioContext = getOrCreateAudioContext();
    if (audioContext.state === 'running') {
        dispatchReadyIfRunning();
        return;
    }
    void audioContext.resume().then(() => {
        dispatchReadyIfRunning();
    });
};
class AudioContextReadySignal extends Signal {
    add(handler, context) {
        super.add(handler, context);
        ensureAudioContextReadyMonitoring();
        return this;
    }
    once(handler, context) {
        super.once(handler, context);
        ensureAudioContextReadyMonitoring();
        return this;
    }
}
const onAudioContextReady = new AudioContextReadySignal();
const getAudioContext = () => {
    const audioContext = getOrCreateAudioContext();
    ensureAudioContextReadyMonitoring();
    return audioContext;
};
const isAudioContextReady = () => {
    const audioContext = getExistingAudioContext();
    return audioContext !== null && audioContext.state === 'running';
};
const getOfflineAudioContext = () => getOrCreateOfflineAudioContext();
// Decodes audio data using a shared OfflineAudioContext whose sample rate is derived from
// the live AudioContext. OfflineAudioContext.decodeAudioData is spec-compliant and works
// in all major browsers. On some older mobile WebKit versions, decodeAudioData may only
// succeed on a live (running) AudioContext — in those environments, sound loading may
// fail with a browser-level error rather than an ExoJS-shaped error.
const decodeAudioData = async (arrayBuffer) => getOrCreateOfflineAudioContext().decodeAudioData(arrayBuffer);

class Music extends AbstractMedia {
    constructor(audioElement, options) {
        super(audioElement);
        this._audioSetup = null;
        this._audioElement = audioElement;
        if (options) {
            this.applyOptions(options);
        }
        if (isAudioContextReady()) {
            this.setupWithAudioContext(getAudioContext());
        }
        else {
            onAudioContextReady.once(this.setupWithAudioContext, this);
        }
    }
    setVolume(value) {
        const volume = clamp(value, 0, 2);
        if (this._volume === volume) {
            return this;
        }
        this._volume = volume;
        if (this._audioSetup) {
            const { gainNode, audioContext } = this._audioSetup;
            gainNode.gain.setTargetAtTime(this.muted ? 0 : volume, audioContext.currentTime, 10);
        }
        return this;
    }
    setLoop(loop) {
        if (this._loop !== loop) {
            this._loop = loop;
            this._audioElement.loop = loop;
        }
        return this;
    }
    setPlaybackRate(value) {
        const playbackRate = clamp(value, 0.1, 20);
        if (this._playbackRate !== playbackRate) {
            this._playbackRate = playbackRate;
            this._audioElement.playbackRate = playbackRate;
        }
        return this;
    }
    getTime() {
        return this._audioElement.currentTime;
    }
    setTime(currentTime) {
        this._audioElement.currentTime = Math.max(0, currentTime);
        return this;
    }
    setMuted(muted) {
        if (this._muted !== muted) {
            this._muted = muted;
            if (this._audioSetup) {
                const { gainNode, audioContext } = this._audioSetup;
                gainNode.gain.setTargetAtTime(muted ? 0 : this.volume, audioContext.currentTime, 10);
            }
        }
        return this;
    }
    get paused() {
        return this._audioElement.paused;
    }
    set paused(paused) {
        if (paused) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    get analyserTarget() {
        return this._audioSetup?.gainNode ?? null;
    }
    play(options) {
        if (options) {
            this.applyOptions(options);
        }
        if (this.paused) {
            this._audioElement.play();
            this.onStart.dispatch();
        }
        return this;
    }
    pause(options) {
        if (options) {
            this.applyOptions(options);
        }
        if (this.playing) {
            this._audioElement.pause();
            this.onStop.dispatch();
        }
        return this;
    }
    destroy() {
        super.destroy();
        onAudioContextReady.clearByContext(this);
        if (this._audioSetup) {
            this._audioSetup.sourceNode.disconnect();
            this._audioSetup.gainNode.disconnect();
            this._audioSetup = null;
        }
    }
    setupWithAudioContext(audioContext) {
        const gainNode = audioContext.createGain();
        gainNode.gain.setTargetAtTime(this.muted ? 0 : this.volume, audioContext.currentTime, 10);
        gainNode.connect(audioContext.destination);
        const sourceNode = audioContext.createMediaElementSource(this._audioElement);
        sourceNode.connect(gainNode);
        this._audioSetup = { audioContext, gainNode, sourceNode };
    }
}

class Sound extends AbstractMedia {
    get paused() {
        if (this._paused) {
            return true;
        }
        if (this._loop) {
            return false;
        }
        return this.currentTime >= this.duration;
    }
    set paused(paused) {
        if (paused) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    get analyserTarget() {
        return this._audioSetup?.gainNode ?? null;
    }
    constructor(audioBuffer, options) {
        super({
            duration: audioBuffer.duration,
            volume: 1,
            playbackRate: 1,
            loop: false,
            muted: false,
        });
        this._audioSetup = null;
        this._paused = true;
        this._startTime = 0;
        this._currentTime = 0;
        this._sourceNode = null;
        this._audioBuffer = audioBuffer;
        if (options) {
            this.applyOptions(options);
        }
        if (isAudioContextReady()) {
            this.setupWithAudioContext(getAudioContext());
        }
        else {
            onAudioContextReady.once(this.setupWithAudioContext, this);
        }
    }
    setVolume(value) {
        const volume = clamp(value, 0, 2);
        if (this._volume === volume) {
            return this;
        }
        this._volume = volume;
        if (this._audioSetup) {
            const { gainNode, audioContext } = this._audioSetup;
            gainNode.gain.setTargetAtTime(this.muted ? 0 : volume, audioContext.currentTime, 10);
        }
        return this;
    }
    setLoop(loop) {
        this._loop = loop;
        if (this._sourceNode) {
            this._sourceNode.loop = loop;
        }
        return this;
    }
    setPlaybackRate(value) {
        this._playbackRate = clamp(value, 0.1, 20);
        if (this._sourceNode) {
            this._sourceNode.playbackRate.value = this._playbackRate;
        }
        return this;
    }
    getTime() {
        if (!this._startTime || !this._audioSetup) {
            return 0;
        }
        return (this._currentTime + this._audioSetup.audioContext.currentTime - this._startTime);
    }
    setTime(currentTime) {
        const time = Math.max(0, currentTime);
        if (this.paused || !this._audioSetup) {
            this._currentTime = time;
            return this;
        }
        this.pause();
        this._currentTime = time;
        this.play();
        return this;
    }
    setMuted(muted) {
        this._muted = muted;
        if (this._audioSetup) {
            const { gainNode, audioContext } = this._audioSetup;
            gainNode.gain.setTargetAtTime(muted ? 0 : this.volume, audioContext.currentTime, 10);
        }
        return this;
    }
    play(options) {
        if (options) {
            this.applyOptions(options);
        }
        if (!this._paused) {
            return this;
        }
        if (this._audioSetup) {
            this.createSourceNode(this._audioSetup);
        }
        this._paused = false;
        this.onStart.dispatch();
        return this;
    }
    pause(options) {
        if (options) {
            this.applyOptions(options);
        }
        if (this._paused) {
            return this;
        }
        if (this._audioSetup) {
            const duration = this.duration;
            const currentTime = this.currentTime;
            if (currentTime <= duration) {
                this._currentTime = currentTime;
            }
            else {
                this._currentTime = (currentTime - duration) * ((currentTime / duration) | 0);
            }
            if (this._sourceNode) {
                this._sourceNode.stop(0);
                this._sourceNode.disconnect();
                this._sourceNode = null;
            }
        }
        this._paused = true;
        this.onStop.dispatch();
        return this;
    }
    destroy() {
        super.destroy();
        onAudioContextReady.clearByContext(this);
        this._audioSetup?.gainNode.disconnect();
        this._sourceNode?.disconnect();
    }
    createSourceNode(setup) {
        const { audioContext, gainNode } = setup;
        this._sourceNode = audioContext.createBufferSource();
        this._sourceNode.buffer = this._audioBuffer;
        this._sourceNode.loop = this.loop;
        this._sourceNode.playbackRate.value = this.playbackRate;
        this._sourceNode.connect(gainNode);
        this._sourceNode.start(0, this._currentTime);
        this._startTime = audioContext.currentTime;
    }
    setupWithAudioContext(audioContext) {
        const gainNode = audioContext.createGain();
        gainNode.gain.setTargetAtTime(this.muted ? 0 : this.volume, audioContext.currentTime, 10);
        gainNode.connect(audioContext.destination);
        this._audioSetup = { audioContext, gainNode };
        if (!this._paused) {
            this.createSourceNode(this._audioSetup);
        }
    }
}

class Video extends Sprite {
    constructor(videoElement, playbackOptions, samplerOptions) {
        super(new Texture(videoElement, samplerOptions));
        this.onStart = new Signal();
        this.onStop = new Signal();
        this._volume = 1;
        this._playbackRate = 1;
        this._loop = false;
        this._muted = false;
        this._audioSetup = null;
        this._textureDirty = true;
        this._lastVideoTime = Number.NaN;
        this._videoFrameCallbackHandle = null;
        const { duration, volume, playbackRate, loop, muted } = videoElement;
        this._videoElement = videoElement;
        this._duration = duration;
        this._volume = volume;
        this._playbackRate = playbackRate;
        this._loop = loop;
        this._muted = muted;
        this._onMetadataHandler = this._onVideoMetadataUpdated.bind(this);
        this._onResizeHandler = this._onVideoMetadataUpdated.bind(this);
        this._onVideoFrameHandler = this._onVideoFrame.bind(this);
        if (this._videoElement.videoWidth === 0 || this._videoElement.videoHeight === 0) {
            this._videoElement.addEventListener('loadedmetadata', this._onMetadataHandler);
            this._videoElement.addEventListener('resize', this._onResizeHandler);
        }
        if (playbackOptions) {
            this.applyOptions(playbackOptions);
        }
        if (isAudioContextReady()) {
            this.setupWithAudioContext(getAudioContext());
        }
        else {
            onAudioContextReady.once(this.setupWithAudioContext, this);
        }
        // Initialize frame bounds early when metadata is already available.
        this.updateTexture();
        this._requestVideoFrameCallback();
    }
    get videoElement() {
        return this._videoElement;
    }
    get duration() {
        return this._duration;
    }
    get progress() {
        const elapsed = this.currentTime, duration = this.duration;
        return ((elapsed % duration) / duration);
    }
    get volume() {
        return this._volume;
    }
    set volume(value) {
        this.setVolume(value);
    }
    get loop() {
        return this._loop;
    }
    set loop(loop) {
        this.setLoop(loop);
    }
    get playbackRate() {
        return this._playbackRate;
    }
    set playbackRate(value) {
        this.setPlaybackRate(value);
    }
    get currentTime() {
        return this.getTime();
    }
    set currentTime(time) {
        this.setTime(time);
    }
    get muted() {
        return this._muted;
    }
    set muted(muted) {
        this.setMuted(muted);
    }
    get paused() {
        return this._videoElement.paused;
    }
    set paused(paused) {
        if (paused) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    get playing() {
        return !this.paused;
    }
    set playing(playing) {
        if (playing) {
            this.play();
        }
        else {
            this.pause();
        }
    }
    get analyserTarget() {
        return this._audioSetup?.gainNode ?? null;
    }
    play(options) {
        if (options) {
            this.applyOptions(options);
        }
        if (this.paused) {
            this._videoElement.play();
            this.onStart.dispatch();
        }
        return this;
    }
    pause(options) {
        if (options) {
            this.applyOptions(options);
        }
        if (this.playing) {
            this._videoElement.pause();
            this.onStop.dispatch();
        }
        return this;
    }
    stop(options) {
        this.pause(options);
        this.currentTime = 0;
        return this;
    }
    toggle(options) {
        return this.paused ? this.play(options) : this.pause(options);
    }
    applyOptions(options = {}) {
        const { volume, loop, playbackRate, time, muted } = options;
        if (volume !== undefined) {
            this.volume = volume;
        }
        if (loop !== undefined) {
            this.loop = loop;
        }
        if (playbackRate !== undefined) {
            this.playbackRate = playbackRate;
        }
        if (time !== undefined) {
            this.currentTime = time;
        }
        if (muted !== undefined) {
            this.muted = muted;
        }
        return this;
    }
    setVolume(value) {
        const volume = clamp(value, 0, 2);
        if (this._volume === volume) {
            return this;
        }
        this._volume = volume;
        if (this._audioSetup) {
            const { gainNode, audioContext } = this._audioSetup;
            gainNode.gain.setTargetAtTime(this.muted ? 0 : volume, audioContext.currentTime, 10);
        }
        return this;
    }
    setLoop(loop) {
        if (this._loop !== loop) {
            this._loop = loop;
            this._videoElement.loop = loop;
        }
        return this;
    }
    setPlaybackRate(value) {
        const playbackRate = clamp(value, 0.1, 20);
        if (this._playbackRate !== playbackRate) {
            this._playbackRate = playbackRate;
            this._videoElement.playbackRate = playbackRate;
        }
        return this;
    }
    getTime() {
        return this._videoElement.currentTime;
    }
    setTime(time) {
        this._videoElement.currentTime = Math.max(0, time);
        return this;
    }
    setMuted(muted) {
        if (this._muted !== muted) {
            this._muted = muted;
            if (this._audioSetup) {
                const { gainNode, audioContext } = this._audioSetup;
                gainNode.gain.setTargetAtTime(muted ? 0 : this.volume, audioContext.currentTime, 10);
            }
        }
        return this;
    }
    render(renderManager) {
        if (this.visible) {
            this._markTextureDirtyIfPlaybackAdvanced();
            this.updateTexture();
            super.render(renderManager);
        }
        return this;
    }
    updateTexture() {
        const texture = this.texture;
        if (!texture || !this._videoElement) {
            return this;
        }
        if (this._videoElement.videoWidth === 0 || this._videoElement.videoHeight === 0) {
            return this;
        }
        if (!this._textureDirty) {
            return this;
        }
        const preserveSize = this.textureFrame.width > 0 && this.textureFrame.height > 0;
        texture.updateSource();
        if (texture.width > 0 && texture.height > 0) {
            this.setTextureFrame(Rectangle.temp.set(0, 0, texture.width, texture.height), !preserveSize);
        }
        this._textureDirty = false;
        return this;
    }
    destroy() {
        super.destroy();
        this.stop();
        this._videoElement.removeEventListener('loadedmetadata', this._onMetadataHandler);
        this._videoElement.removeEventListener('resize', this._onResizeHandler);
        this._cancelVideoFrameCallback();
        onAudioContextReady.clearByContext(this);
        if (this._audioSetup) {
            this._audioSetup.sourceNode.disconnect();
            this._audioSetup.gainNode.disconnect();
            this._audioSetup = null;
        }
        this.onStart.destroy();
        this.onStop.destroy();
    }
    _onVideoMetadataUpdated() {
        this._textureDirty = true;
        this.updateTexture();
    }
    _onVideoFrame(_now, _metadata) {
        this._videoFrameCallbackHandle = null;
        this._textureDirty = true;
        this._requestVideoFrameCallback();
    }
    _markTextureDirtyIfPlaybackAdvanced() {
        const currentTime = this._videoElement.currentTime;
        if (this._lastVideoTime !== currentTime) {
            this._lastVideoTime = currentTime;
            this._textureDirty = true;
        }
    }
    _requestVideoFrameCallback() {
        const frameCallbackVideo = this._videoElement;
        if (!frameCallbackVideo.requestVideoFrameCallback || this._videoFrameCallbackHandle !== null) {
            return;
        }
        this._videoFrameCallbackHandle = frameCallbackVideo.requestVideoFrameCallback(this._onVideoFrameHandler);
    }
    _cancelVideoFrameCallback() {
        const frameCallbackVideo = this._videoElement;
        if (!frameCallbackVideo.cancelVideoFrameCallback || this._videoFrameCallbackHandle === null) {
            return;
        }
        frameCallbackVideo.cancelVideoFrameCallback(this._videoFrameCallbackHandle);
        this._videoFrameCallbackHandle = null;
    }
    setupWithAudioContext(audioContext) {
        const gainNode = audioContext.createGain();
        gainNode.gain.setTargetAtTime(this.muted ? 0 : this.volume, audioContext.currentTime, 10);
        gainNode.connect(audioContext.destination);
        const sourceNode = audioContext.createMediaElementSource(this._videoElement);
        sourceNode.connect(gainNode);
        this._audioSetup = { audioContext, gainNode, sourceNode };
    }
}

/**
 * Dispatch token for generic JSON loading.
 *
 * `loader.load(Json, 'config.json')` returns `Promise<unknown>`.
 * Narrow via generic: `loader.load<Config>(Json, 'config.json')`.
 * Handles all JSON shapes — objects, arrays, scalars.
 */
class Json {
}
/**
 * Dispatch token for plain text loading.
 *
 * `loader.load(TextAsset, 'greeting.txt')` returns `Promise<string>`.
 */
class TextAsset {
}
/**
 * Dispatch token for SVG loading.
 *
 * `loader.load(SvgAsset, 'icon.svg')` returns `Promise<HTMLImageElement>`.
 */
class SvgAsset {
}
/**
 * Dispatch token for WebVTT subtitle loading.
 *
 * `loader.load(VttAsset, 'subs.vtt')` returns `Promise<Array<VTTCue>>`.
 */
class VttAsset {
}

class FactoryRegistry {
    constructor() {
        this._factories = new Map();
    }
    register(type, factory) {
        this._factories.set(type, factory);
    }
    resolve(type) {
        let constructor = type;
        let factory = undefined;
        while (constructor !== null && !factory) {
            factory = this._factories.get(constructor);
            if (!factory) {
                const prototype = Object.getPrototypeOf(constructor.prototype);
                constructor = prototype?.constructor ?? null;
            }
        }
        if (!factory) {
            throw new Error(`No factory registered for ${type.name}. `
                + 'Register one with loader.register() before loading.');
        }
        return factory;
    }
    has(type) {
        let constructor = type;
        while (constructor !== null) {
            if (this._factories.has(constructor)) {
                return true;
            }
            const prototype = Object.getPrototypeOf(constructor.prototype);
            constructor = prototype?.constructor ?? null;
        }
        return false;
    }
    destroy() {
        for (const factory of this._factories.values()) {
            factory.destroy();
        }
        this._factories.clear();
    }
}

class AbstractAssetFactory {
    constructor() {
        this._objectUrls = [];
    }
    createObjectUrl(blob) {
        const objectUrl = URL.createObjectURL(blob);
        this._objectUrls.push(objectUrl);
        return objectUrl;
    }
    revokeObjectUrl(objectUrl) {
        URL.revokeObjectURL(objectUrl);
        const index = this._objectUrls.indexOf(objectUrl);
        if (index !== -1) {
            this._objectUrls.splice(index, 1);
        }
    }
    destroy() {
        for (const objectUrl of this._objectUrls) {
            URL.revokeObjectURL(objectUrl);
        }
        this._objectUrls.length = 0;
    }
}

class FontFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'font';
        this._addedFontFaces = [];
    }
    async process(response) {
        return await response.arrayBuffer();
    }
    async create(source, options) {
        if (!options?.family) {
            throw new Error('FontFactory.create requires options with a "family" property.');
        }
        const { family, descriptors, addToDocument } = options;
        if (source.byteLength < 4) {
            throw new SyntaxError(`Invalid font data: expected at least 4 bytes, received ${source.byteLength}.`);
        }
        const fontFace = await new FontFace(family, source, descriptors).load().catch(() => {
            throw new SyntaxError(`Invalid font data in ArrayBuffer (${source.byteLength} bytes).`);
        });
        if (addToDocument !== false) {
            document.fonts.add(fontFace);
            this._addedFontFaces.push(fontFace);
        }
        return fontFace;
    }
    destroy() {
        for (const fontFace of this._addedFontFaces) {
            document.fonts.delete(fontFace);
        }
        this._addedFontFaces.length = 0;
        super.destroy();
    }
}

const fileTypes = [
    {
        mimeType: 'image/x-icon',
        pattern: [0x00, 0x00, 0x01, 0x00],
        mask: [0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'image/x-icon',
        pattern: [0x00, 0x00, 0x02, 0x00],
        mask: [0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'image/bmp',
        pattern: [0x42, 0x4D],
        mask: [0xFF, 0xFF],
    },
    {
        mimeType: 'image/gif',
        pattern: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'image/gif',
        pattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'image/webp',
        pattern: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'image/png',
        pattern: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'image/jpeg',
        pattern: [0xFF, 0xD8, 0xFF],
        mask: [0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'audio/basic',
        pattern: [0x2E, 0x73, 0x6E, 0x64],
        mask: [0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'audio/mpeg',
        pattern: [0x49, 0x44, 0x33],
        mask: [0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'audio/wave',
        pattern: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'audio/midi',
        pattern: [0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'audio/aiff',
        pattern: [0x46, 0x4F, 0x52, 0x4D, 0x00, 0x00, 0x00, 0x00, 0x41, 0x49, 0x46, 0x46],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'video/avi',
        pattern: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x41, 0x56, 0x49, 0x20],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF],
    },
    {
        mimeType: 'application/ogg',
        pattern: [0x4F, 0x67, 0x67, 0x53, 0x00],
        mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    }
];
const matchesMp4Video = (arrayBuffer) => {
    const header = new Uint8Array(arrayBuffer), view = new DataView(arrayBuffer), boxSize = view.getUint32(0, false);
    if (header.length < Math.max(12, boxSize) || boxSize % 4 !== 0) {
        return false;
    }
    return String.fromCharCode(...header.subarray(4, 11)) === 'ftypmp4';
};
const matchesAvifImage = (arrayBuffer) => {
    if (arrayBuffer.byteLength < 12) {
        return false;
    }
    const header = new Uint8Array(arrayBuffer);
    if (String.fromCharCode(header[4], header[5], header[6], header[7]) !== 'ftyp') {
        return false;
    }
    const brand = String.fromCharCode(header[8], header[9], header[10], header[11]);
    return brand === 'avif' || brand === 'avis';
};
const matchesWebmVideo = (arrayBuffer) => {
    const header = new Uint8Array(arrayBuffer), matching = [0x1A, 0x45, 0xDF, 0xA3].every((byte, i) => (byte === header[i])), sliced = header.subarray(4, 4 + 4096), index = sliced.findIndex((el, i, arr) => (arr[i] === 0x42 && arr[i + 1] === 0x82));
    if (!matching || index === -1) {
        return false;
    }
    return String.fromCharCode(...sliced.subarray(index + 3, index + 7)) === 'webm';
};
const determineMimeType = (arrayBuffer) => {
    const header = new Uint8Array(arrayBuffer);
    if (!header.length) {
        throw new Error('Cannot determine mime type: No data.');
    }
    for (const type of fileTypes) {
        if (header.length < type.pattern.length) {
            continue;
        }
        if (type.pattern.every((p, i) => (header[i] & type.mask[i]) === p)) {
            return type.mimeType;
        }
    }
    if (matchesMp4Video(arrayBuffer)) {
        return 'video/mp4';
    }
    if (matchesWebmVideo(arrayBuffer)) {
        return 'video/webm';
    }
    if (matchesAvifImage(arrayBuffer)) {
        return 'image/avif';
    }
    return 'text/plain';
};

class ImageFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'image';
    }
    async process(response) {
        return await response.arrayBuffer();
    }
    async create(source, options = {}) {
        const blob = new Blob([source], { type: options.mimeType ?? determineMimeType(source) });
        const objectUrl = this.createObjectUrl(blob);
        return new Promise((resolve, reject) => {
            const image = new Image();
            const finalize = () => {
                this.revokeObjectUrl(objectUrl);
            };
            image.addEventListener('load', () => {
                finalize();
                resolve(image);
            }, { once: true });
            image.addEventListener('error', () => {
                finalize();
                reject(Error('Error loading image source.'));
            }, { once: true });
            image.addEventListener('abort', () => {
                finalize();
                reject(Error('Image loading was canceled.'));
            }, { once: true });
            image.src = objectUrl;
        });
    }
}

class JsonFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'json';
    }
    async process(response) {
        return await response.json();
    }
    async create(source) {
        return source;
    }
}

const onceListenerOption$1 = { once: true };
class MusicFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'music';
        this._audioElements = [];
    }
    async process(response) {
        return await response.arrayBuffer();
    }
    async create(source, options = {}) {
        const { mimeType, loadEvent, playbackOptions } = options;
        const blob = new Blob([source], { type: mimeType ?? determineMimeType(source) });
        return new Promise((resolve, reject) => {
            const audio = document.createElement('audio');
            this._audioElements.push(audio);
            audio.addEventListener('error', () => reject(Error('Error loading audio source.')), onceListenerOption$1);
            audio.addEventListener('abort', () => reject(Error('Audio loading was canceled.')), onceListenerOption$1);
            audio.addEventListener(loadEvent ?? 'canplaythrough', () => resolve(new Music(audio, playbackOptions)), onceListenerOption$1);
            audio.preload = 'auto';
            audio.src = this.createObjectUrl(blob);
        });
    }
    destroy() {
        for (const audio of this._audioElements) {
            audio.pause();
            audio.src = '';
            audio.load();
        }
        this._audioElements.length = 0;
        super.destroy();
    }
}

class SoundFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'sound';
    }
    async process(response) {
        return await response.arrayBuffer();
    }
    async create(source, options = {}) {
        const audioBuffer = await decodeAudioData(source);
        return new Sound(audioBuffer, options.playbackOptions);
    }
}

class TextFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'text';
    }
    async process(response) {
        return await response.text();
    }
    async create(source) {
        return source;
    }
}

class TextureFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'texture';
    }
    async process(response) {
        return await response.arrayBuffer();
    }
    async create(source, options = {}) {
        const { mimeType, samplerOptions } = options;
        const blob = new Blob([source], { type: mimeType ?? determineMimeType(source) });
        const objectUrl = this.createObjectUrl(blob);
        return new Promise((resolve, reject) => {
            const image = new Image();
            const finalize = () => {
                this.revokeObjectUrl(objectUrl);
            };
            image.addEventListener('load', () => {
                finalize();
                resolve(new Texture(image, samplerOptions));
            }, { once: true });
            image.addEventListener('error', () => {
                finalize();
                reject(Error('Error loading image source.'));
            }, { once: true });
            image.addEventListener('abort', () => {
                finalize();
                reject(Error('Image loading was canceled.'));
            }, { once: true });
            image.src = objectUrl;
        });
    }
}

const onceListenerOption = { once: true };
class VideoFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'video';
        this._videoElements = [];
    }
    async process(response) {
        return await response.arrayBuffer();
    }
    async create(source, options = {}) {
        const { mimeType, loadEvent, playbackOptions, samplerOptions } = options;
        const blob = new Blob([source], { type: mimeType ?? determineMimeType(source) });
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            this._videoElements.push(video);
            video.addEventListener('error', () => reject(Error('Video loading error.')), onceListenerOption);
            video.addEventListener('abort', () => reject(Error('Video loading error: cancelled.')), onceListenerOption);
            video.addEventListener('emptied', () => reject(Error('Video loading error: emptied.')), onceListenerOption);
            // 'stalled' is intentionally omitted: it fires transiently during normal buffering
            // and would cause spurious rejections for large files on slow connections.
            video.addEventListener(loadEvent ?? 'canplaythrough', () => resolve(new Video(video, playbackOptions, samplerOptions)), onceListenerOption);
            video.preload = 'auto';
            video.src = this.createObjectUrl(blob);
        });
    }
    destroy() {
        for (const video of this._videoElements) {
            video.pause();
            video.src = '';
            video.load();
        }
        this._videoElements.length = 0;
        super.destroy();
    }
}

class SvgFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'svg';
    }
    async process(response) {
        return await response.text();
    }
    async create(source) {
        const blob = new Blob([source], { type: 'image/svg+xml' });
        const objectUrl = this.createObjectUrl(blob);
        return new Promise((resolve, reject) => {
            const image = new Image();
            const finalize = () => {
                this.revokeObjectUrl(objectUrl);
            };
            image.addEventListener('load', () => {
                finalize();
                resolve(image);
            }, { once: true });
            image.addEventListener('error', () => {
                finalize();
                reject(Error('Error loading image source.'));
            }, { once: true });
            image.addEventListener('abort', () => {
                finalize();
                reject(Error('Image loading was canceled.'));
            }, { once: true });
            image.src = objectUrl;
        });
    }
}

class BinaryFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'binary';
    }
    async process(response) {
        return response.arrayBuffer();
    }
    async create(source) {
        return source;
    }
}

class WasmFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'wasm';
    }
    async process(response) {
        return response.arrayBuffer();
    }
    async create(source) {
        return WebAssembly.compile(source);
    }
}

const parseTimestamp = (value) => {
    const parts = value.split(':');
    let seconds = 0;
    if (parts.length === 3) {
        seconds = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
    }
    else if (parts.length === 2) {
        seconds = Number(parts[0]) * 60 + Number(parts[1]);
    }
    else {
        seconds = Number(parts[0]);
    }
    return seconds;
};
class VttFactory extends AbstractAssetFactory {
    constructor() {
        super(...arguments);
        this.storageName = 'vtt';
    }
    async process(response) {
        return response.text();
    }
    async create(source) {
        const cues = [];
        const lines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
        let i = 0;
        // Skip header and any blank lines/metadata before first cue
        while (i < lines.length && !lines[i].includes('-->')) {
            i++;
        }
        while (i < lines.length) {
            const line = lines[i].trim();
            if (line.includes('-->')) {
                const arrowIndex = line.indexOf('-->');
                const startStr = line.slice(0, arrowIndex).trim();
                const rest = line.slice(arrowIndex + 3).trim();
                // rest may have cue settings after the end timestamp
                const endStr = rest.split(/\s+/)[0];
                const start = parseTimestamp(startStr);
                const end = parseTimestamp(endStr);
                i++;
                const textLines = [];
                while (i < lines.length && lines[i].trim() !== '') {
                    textLines.push(lines[i]);
                    i++;
                }
                cues.push(new VTTCue(start, end, textLines.join('\n')));
            }
            else {
                i++;
            }
        }
        return cues;
    }
}

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------
class Loader {
    constructor(options = {}) {
        this._registry = new FactoryRegistry();
        this._resources = new Map();
        this._manifest = new Map();
        this._inFlight = new Map();
        this._typeIds = new WeakMap();
        this._preventStoreKeys = new Set();
        this._nextTypeId = 1;
        this._backgroundQueue = [];
        this._backgroundActive = 0;
        this._backgroundTotal = 0;
        this._backgroundLoaded = 0;
        this._backgroundResolve = null;
        this.onProgress = new Signal();
        this.onLoaded = new Signal();
        this.onError = new Signal();
        this._resourcePath = options.resourcePath ?? '';
        this._requestOptions = options.requestOptions ?? {};
        this._concurrency = options.concurrency ?? 6;
        this._stores = options.cache
            ? (Array.isArray(options.cache) ? options.cache : [options.cache])
            : [];
        this._registerBuiltinFactories();
    }
    // -----------------------------------------------------------------------
    // Factory registration
    // -----------------------------------------------------------------------
    register(type, factory) {
        this._registry.register(type, factory);
        return this;
    }
    add(type, source) {
        const ctor = type;
        if (typeof source === 'string') {
            this._addManifestEntry(ctor, source, source);
        }
        else if (Array.isArray(source)) {
            for (const path of source) {
                this._addManifestEntry(ctor, path, path);
            }
        }
        else {
            for (const [alias, path] of Object.entries(source)) {
                this._addManifestEntry(ctor, alias, path);
            }
        }
        return this;
    }
    // -----------------------------------------------------------------------
    // Loading — implementation
    // -----------------------------------------------------------------------
    async load(type, source, options) {
        const ctor = type;
        if (typeof source === 'string') {
            return this._loadSingle(ctor, source, options);
        }
        if (Array.isArray(source)) {
            return Promise.all(source.map(path => this._loadSingle(ctor, path, options)));
        }
        const entries = Object.entries(source);
        const result = {};
        await Promise.all(entries.map(async ([alias, path]) => {
            result[alias] = await this._loadSingle(ctor, alias, options, path);
        }));
        return result;
    }
    // -----------------------------------------------------------------------
    // Background loading
    // -----------------------------------------------------------------------
    backgroundLoad() {
        for (const [type, entries] of this._manifest) {
            for (const [alias, entry] of entries) {
                if (this._hasResource(type, alias))
                    continue;
                const key = this._key(type, alias);
                if (this._inFlight.has(key))
                    continue;
                this._backgroundQueue.push({
                    type, alias, path: entry.path, options: entry.options,
                });
            }
        }
        this._backgroundTotal = this._backgroundQueue.length;
        this._backgroundLoaded = 0;
        this._drainBackground();
    }
    loadAll() {
        return new Promise((resolve) => {
            this._backgroundResolve = resolve;
            this.backgroundLoad();
            if (this._backgroundQueue.length === 0 && this._backgroundActive === 0) {
                this._backgroundResolve = null;
                resolve();
            }
        });
    }
    setConcurrency(n) {
        this._concurrency = n;
        return this;
    }
    get(type, alias) {
        const ctor = type;
        const typeMap = this._resources.get(ctor);
        if (!typeMap?.has(alias)) {
            throw new Error(`Missing resource "${alias}" for type ${ctor.name}.`);
        }
        return typeMap.get(alias);
    }
    peek(type, alias) {
        const ctor = type;
        return this._resources.get(ctor)?.get(alias) ?? null;
    }
    has(type, alias) {
        const ctor = type;
        return this._resources.get(ctor)?.has(alias) ?? false;
    }
    // -----------------------------------------------------------------------
    // Unload
    // -----------------------------------------------------------------------
    unload(type, alias) {
        const ctor = type;
        const key = this._key(ctor, alias);
        this._resources.get(ctor)?.delete(alias);
        if (this._inFlight.has(key)) {
            this._preventStoreKeys.add(key);
        }
        return this;
    }
    unloadAll(type) {
        if (type) {
            this._resources.get(type)?.clear();
        }
        else {
            for (const typeMap of this._resources.values()) {
                typeMap.clear();
            }
        }
        return this;
    }
    // -----------------------------------------------------------------------
    // Configuration
    // -----------------------------------------------------------------------
    get resourcePath() {
        return this._resourcePath;
    }
    set resourcePath(value) {
        this._resourcePath = value;
    }
    get requestOptions() {
        return this._requestOptions;
    }
    set requestOptions(value) {
        this._requestOptions = value;
    }
    // -----------------------------------------------------------------------
    // Lifecycle
    // -----------------------------------------------------------------------
    destroy() {
        this._registry.destroy();
        for (const store of this._stores) {
            store.destroy();
        }
        this._resources.clear();
        this._manifest.clear();
        this._inFlight.clear();
        this._preventStoreKeys.clear();
        this._backgroundQueue.length = 0;
        this.onProgress.destroy();
        this.onLoaded.destroy();
        this.onError.destroy();
    }
    // -----------------------------------------------------------------------
    // Internal — loading
    // -----------------------------------------------------------------------
    async _loadSingle(type, alias, options, explicitPath) {
        if (this._hasResource(type, alias)) {
            return this._resources.get(type).get(alias);
        }
        const key = this._key(type, alias);
        if (this._inFlight.has(key)) {
            return this._inFlight.get(key);
        }
        this._boostFromQueue(type, alias);
        if (this._inFlight.has(key)) {
            return this._inFlight.get(key);
        }
        const entry = this._getManifestEntry(type, alias);
        const path = explicitPath ?? entry?.path ?? alias;
        const resolvedOptions = options ?? entry?.options;
        return this._trackInFlight(key, this._fetch(type, alias, path, resolvedOptions));
    }
    async _fetch(type, alias, path, options) {
        const factory = this._registry.resolve(type);
        const url = this._resolveUrl(path);
        let source = null;
        // Check caches
        for (const store of this._stores) {
            source = await store.load(factory.storageName, alias);
            if (source !== null && source !== undefined) {
                try {
                    const resource = await factory.create(source, options);
                    this._storeResource(type, alias, resource);
                    return resource;
                }
                catch {
                    await store.delete(factory.storageName, alias);
                    source = null;
                }
            }
        }
        // Network fetch
        const response = await fetch(url, this._requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch "${alias}" from "${url}" (${response.status} ${response.statusText}).`);
        }
        source = await factory.process(response);
        const resource = await factory.create(source, options).catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to create "${alias}" from "${url}": ${message}`);
        });
        // Write to caches
        for (const store of this._stores) {
            try {
                await store.save(factory.storageName, alias, source);
            }
            catch {
                // Quota exceeded or non-cloneable — continue without caching.
            }
        }
        this._storeResource(type, alias, resource);
        return resource;
    }
    // -----------------------------------------------------------------------
    // Internal — background queue
    // -----------------------------------------------------------------------
    _drainBackground() {
        while (this._backgroundActive < this._concurrency && this._backgroundQueue.length > 0) {
            const entry = this._backgroundQueue.shift();
            const key = this._key(entry.type, entry.alias);
            if (this._hasResource(entry.type, entry.alias) || this._inFlight.has(key)) {
                this._backgroundLoaded++;
                this._onBackgroundItemDone();
                continue;
            }
            this._startBackgroundEntry(entry);
        }
    }
    _boostFromQueue(type, alias) {
        const index = this._backgroundQueue.findIndex(e => e.type === type && e.alias === alias);
        if (index === -1)
            return;
        const [entry] = this._backgroundQueue.splice(index, 1);
        this._startBackgroundEntry(entry);
    }
    _onBackgroundItemDone() {
        this.onProgress.dispatch(this._backgroundLoaded, this._backgroundTotal);
        if (this._backgroundResolve
            && this._backgroundQueue.length === 0
            && this._backgroundActive === 0) {
            const resolve = this._backgroundResolve;
            this._backgroundResolve = null;
            resolve();
        }
    }
    _startBackgroundEntry(entry) {
        const key = this._key(entry.type, entry.alias);
        this._backgroundActive++;
        this._trackInFlight(key, this._fetch(entry.type, entry.alias, entry.path, entry.options))
            .catch(error => {
            const err = error instanceof Error ? error : new Error(String(error));
            this.onError.dispatch(entry.type, entry.alias, err);
        })
            .finally(() => {
            this._backgroundActive--;
            this._backgroundLoaded++;
            this._onBackgroundItemDone();
            this._drainBackground();
        });
    }
    _trackInFlight(key, promise) {
        const trackedPromise = promise.finally(() => {
            this._inFlight.delete(key);
            this._preventStoreKeys.delete(key);
        });
        this._inFlight.set(key, trackedPromise);
        return trackedPromise;
    }
    // -----------------------------------------------------------------------
    // Internal — manifest & storage
    // -----------------------------------------------------------------------
    _addManifestEntry(type, alias, path, options) {
        if (!this._manifest.has(type)) {
            this._manifest.set(type, new Map());
        }
        this._manifest.get(type).set(alias, { path, options });
    }
    _getManifestEntry(type, alias) {
        return this._manifest.get(type)?.get(alias);
    }
    _hasResource(type, alias) {
        return this._resources.get(type)?.has(alias) ?? false;
    }
    _storeResource(type, alias, resource) {
        const key = this._key(type, alias);
        if (this._preventStoreKeys.delete(key)) {
            return;
        }
        if (!this._resources.has(type)) {
            this._resources.set(type, new Map());
        }
        this._resources.get(type).set(alias, resource);
        this.onLoaded.dispatch(type, alias, resource);
    }
    _key(type, alias) {
        let typeId = this._typeIds.get(type);
        if (typeId === undefined) {
            typeId = this._nextTypeId++;
            this._typeIds.set(type, typeId);
        }
        return `${typeId}:${alias}`;
    }
    _resolveUrl(path) {
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
            return path;
        }
        return `${this._resourcePath}${path}`;
    }
    // -----------------------------------------------------------------------
    // Internal — built-in factory registration
    // -----------------------------------------------------------------------
    _registerBuiltinFactories() {
        this._registry.register(Texture, new TextureFactory());
        this._registry.register(Sound, new SoundFactory());
        this._registry.register(Music, new MusicFactory());
        this._registry.register(Video, new VideoFactory());
        this._registry.register(Json, new JsonFactory());
        this._registry.register(TextAsset, new TextFactory());
        this._registry.register(SvgAsset, new SvgFactory());
        this._registry.register(VttAsset, new VttFactory());
        this._registry.register(ArrayBuffer, new BinaryFactory());
        if (typeof FontFace !== 'undefined') {
            this._registry.register(FontFace, new FontFactory());
        }
        if (typeof HTMLImageElement !== 'undefined') {
            this._registry.register(HTMLImageElement, new ImageFactory());
        }
        if (typeof WebAssembly !== 'undefined') {
            this._registry.register(WebAssembly.Module, new WasmFactory());
        }
    }
}

var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus[ApplicationStatus["Loading"] = 1] = "Loading";
    ApplicationStatus[ApplicationStatus["Running"] = 2] = "Running";
    ApplicationStatus[ApplicationStatus["Halting"] = 3] = "Halting";
    ApplicationStatus[ApplicationStatus["Stopped"] = 4] = "Stopped";
})(ApplicationStatus || (ApplicationStatus = {}));
const createDefaultCanvas = () => document.createElement('canvas');
const defaultBackendConfig = { type: 'auto' };
const defaultAppSettings = {
    width: 800,
    height: 600,
    clearColor: Color.cornflowerBlue,
    debug: false,
    spriteRendererBatchSize: 4096, // ~ 262kb
    particleRendererBatchSize: 8192, // ~ 1.18mb
    primitiveRendererBatchSize: 65536, // ~ 786kb
    gamepadDefinitions: [],
    pointerDistanceThreshold: 10,
    webglAttributes: {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        stencil: false,
        depth: false,
    },
    resourcePath: '',
    requestOptions: {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
    },
    cache: undefined,
    backend: defaultBackendConfig,
};
class Application {
    constructor(appSettings) {
        this.onResize = new Signal();
        this._startupClock = new Clock();
        this._activeClock = new Clock();
        this._frameClock = new Clock();
        this._status = ApplicationStatus.Stopped;
        this._frameCount = 0;
        this._frameRequest = 0;
        this.options = {
            canvas: appSettings?.canvas ?? createDefaultCanvas(),
            ...defaultAppSettings,
            ...appSettings,
            backend: appSettings?.backend ?? defaultBackendConfig,
        };
        this.canvas = this.options.canvas;
        if (!this.canvas.hasAttribute('tabindex')) {
            this.canvas.setAttribute('tabindex', '-1');
        }
        this.loader = new Loader({
            resourcePath: this.options.resourcePath,
            requestOptions: this.options.requestOptions,
            cache: this.options.cache,
        });
        this._backendType = this.resolveInitialBackendType();
        this._renderManager = this.createRenderManager(this._backendType);
        this.inputManager = new InputManager(this);
        this.sceneManager = new SceneManager(this);
        this._updateHandler = this.update.bind(this);
        this._startupClock.start();
    }
    get status() {
        return this._status;
    }
    get startupTime() {
        return this._startupClock.elapsedTime;
    }
    get activeTime() {
        return this._activeClock.elapsedTime;
    }
    get frameTime() {
        return this._frameClock.elapsedTime;
    }
    get frameCount() {
        return this._frameCount;
    }
    get renderManager() {
        return this._renderManager;
    }
    async start(scene) {
        if (this._status === ApplicationStatus.Stopped) {
            this._status = ApplicationStatus.Loading;
            try {
                await this.initializeRenderManager();
                await this.sceneManager.setScene(scene);
                this._frameRequest = requestAnimationFrame(this._updateHandler);
                this._frameClock.restart();
                this._activeClock.start();
                this._status = ApplicationStatus.Running;
            }
            catch (error) {
                this._status = ApplicationStatus.Stopped;
                throw error;
            }
        }
        return this;
    }
    update() {
        if (this._status === ApplicationStatus.Running) {
            this.inputManager.update();
            this.sceneManager.update(this._frameClock.elapsedTime);
            this.renderManager.flush();
            this._frameRequest = requestAnimationFrame(this._updateHandler);
            this._frameClock.restart();
            this._frameCount++;
        }
        return this;
    }
    stop() {
        if (this._status === ApplicationStatus.Running) {
            this._status = ApplicationStatus.Halting;
            cancelAnimationFrame(this._frameRequest);
            void this.sceneManager.setScene(null).catch((error) => {
                console.error('Application.stop() failed to unload the active scene.', error);
            });
            this._activeClock.stop();
            this._frameClock.stop();
            this._status = ApplicationStatus.Stopped;
        }
        return this;
    }
    resize(width, height) {
        this.renderManager.resize(width, height);
        this.onResize.dispatch(width, height, this);
        return this;
    }
    destroy() {
        this.stop();
        this.loader.destroy();
        this.inputManager.destroy();
        this._renderManager.destroy();
        this.sceneManager.destroy();
        this._startupClock.destroy();
        this._activeClock.destroy();
        this._frameClock.destroy();
        this.onResize.destroy();
    }
    resolveInitialBackendType() {
        const backendType = this.options.backend?.type;
        if (backendType === 'webgl2') {
            return 'webgl2';
        }
        if (backendType === 'webgpu') {
            return 'webgpu';
        }
        return this.canUseWebGpu() ? 'webgpu' : 'webgl2';
    }
    createRenderManager(backendType) {
        if (backendType === 'webgpu') {
            return new WebGpuRenderManager(this);
        }
        return new WebGl2RenderManager(this);
    }
    async initializeRenderManager() {
        try {
            await this._renderManager.initialize();
        }
        catch (error) {
            if (this.options.backend?.type !== 'auto' || this._backendType !== 'webgpu') {
                throw error;
            }
            this._renderManager.destroy();
            this._backendType = 'webgl2';
            this._renderManager = this.createRenderManager(this._backendType);
            await this._renderManager.initialize();
        }
    }
    canUseWebGpu() {
        const gpuNavigator = navigator;
        return !!gpuNavigator.gpu;
    }
}

class Quadtree {
    constructor(bounds, level = 0) {
        this._quadTrees = new Map();
        this._sceneNodes = new Set();
        this._bounds = bounds.clone();
        this.level = level;
    }
    addSceneNode(sceneNode) {
        const quadTree = this._getQuadTree(sceneNode);
        if (quadTree) {
            quadTree.addSceneNode(sceneNode);
            return this;
        }
        this._sceneNodes.add(sceneNode);
        if (this._sceneNodes.size > Quadtree.maxSceneNodes && this.level < Quadtree.maxLevel) {
            this._split();
        }
        return this;
    }
    getRelatedChildren(sceneNode) {
        const quadTree = this._getQuadTree(sceneNode);
        if (quadTree === null) {
            return [...this._sceneNodes];
        }
        return [...quadTree.getRelatedChildren(sceneNode), ...this._sceneNodes];
    }
    getBounds() {
        return this._bounds;
    }
    clear() {
        if (this._quadTrees.size > 0) {
            for (const quadTree of this._quadTrees.values()) {
                quadTree.destroy();
            }
            this._quadTrees.clear();
        }
        this._sceneNodes.clear();
        return this;
    }
    destroy() {
        this.clear();
        this._bounds.destroy();
    }
    _getQuadTree(sceneNode) {
        if (this._quadTrees.size > 0) {
            const bounds = sceneNode.getBounds();
            for (const quadTree of this._quadTrees.values()) {
                if (quadTree.getBounds().containsRect(bounds)) {
                    return quadTree;
                }
            }
        }
        return null;
    }
    _split() {
        if (this._quadTrees.size === 0) {
            const { top, left, width, height } = this.getBounds();
            const halfWidth = (width / 2) | 0;
            const halfHeight = (height / 2) | 0;
            const nextLevel = this.level + 1;
            this._quadTrees.set(0, new Quadtree(Rectangle.temp.set(left, top, halfWidth, halfHeight), nextLevel));
            this._quadTrees.set(1, new Quadtree(Rectangle.temp.set(left + halfWidth, top, halfWidth, halfHeight), nextLevel));
            this._quadTrees.set(2, new Quadtree(Rectangle.temp.set(left, top + halfHeight, halfWidth, halfHeight), nextLevel));
            this._quadTrees.set(3, new Quadtree(Rectangle.temp.set(left + halfWidth, top + halfHeight, halfWidth, halfHeight), nextLevel));
        }
        this._passSceneNodesToQuadTrees();
    }
    _passSceneNodesToQuadTrees() {
        for (const sceneNode of this._sceneNodes) {
            const quadTree = this._getQuadTree(sceneNode);
            if (quadTree) {
                this._sceneNodes.delete(sceneNode);
                quadTree.addSceneNode(sceneNode);
            }
        }
    }
}
Quadtree.maxSceneNodes = 50;
Quadtree.maxLevel = 5;

class Container extends SceneNode {
    constructor() {
        super(...arguments);
        this._children = [];
    }
    get children() {
        return this._children;
    }
    get width() {
        return Math.abs(this.scale.x) * this.bounds.width;
    }
    set width(value) {
        this.scale.x = value / this.bounds.width;
    }
    get height() {
        return Math.abs(this.scale.y) * this.bounds.height;
    }
    set height(value) {
        this.scale.y = value / this.bounds.height;
    }
    get left() {
        return this.x - (this.width * this.origin.x);
    }
    get top() {
        return this.y - (this.height * this.origin.y);
    }
    get right() {
        return (this.x + this.width - this.origin.x);
    }
    get bottom() {
        return (this.y + this.height - this.origin.y);
    }
    addChild(child) {
        return this.addChildAt(child, this._children.length);
    }
    addChildAt(child, index) {
        if (index < 0 || index > this._children.length) {
            throw new Error(`The index ${index} is out of bounds ${this._children.length}`);
        }
        if (child === this) {
            return this;
        }
        if (child.parentNode) {
            child.parentNode.removeChild(child);
        }
        child.parentNode = this;
        this._children.splice(index, 0, child);
        return this;
    }
    swapChildren(firstChild, secondChild) {
        if (firstChild !== secondChild) {
            const firstIndex = this.getChildIndex(firstChild);
            const secondIndex = this.getChildIndex(secondChild);
            this._children[firstIndex] = secondChild;
            this._children[secondIndex] = firstChild;
        }
        return this;
    }
    getChildIndex(child) {
        const index = this._children.indexOf(child);
        if (index === -1) {
            throw new Error('Drawable is not a child of the container.');
        }
        return index;
    }
    setChildIndex(child, index) {
        if (index < 0 || index >= this._children.length) {
            throw new Error(`The index ${index} is out of bounds ${this._children.length}`);
        }
        removeArrayItems(this._children, this.getChildIndex(child), 1);
        this._children.splice(index, 0, child);
        return this;
    }
    getChildAt(index) {
        if (index < 0 || index >= this._children.length) {
            throw new Error(`getChildAt: Index (${index}) does not exist.`);
        }
        return this._children[index];
    }
    removeChild(child) {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            this.removeChildAt(index);
        }
        return this;
    }
    removeChildAt(index) {
        const child = this._children[index];
        removeArrayItems(this._children, index, 1);
        if (child && child.parentNode === this) {
            child.parentNode = null;
        }
        return this;
    }
    removeChildren(begin = 0, end = this._children.length) {
        const range = (end - begin);
        if (range < 0 || range > end) {
            throw new Error('Values are outside the acceptable range.');
        }
        for (let i = begin; i < end; i++) {
            const child = this._children[i];
            if (child && child.parentNode === this) {
                child.parentNode = null;
            }
        }
        removeArrayItems(this._children, begin, range);
        return this;
    }
    render(renderManager) {
        if (this.visible && this.inView(renderManager.view)) {
            for (const child of this._children) {
                child.render(renderManager);
            }
        }
        return this;
    }
    contains(x, y) {
        return this._children.some((child) => child.contains(x, y));
    }
    updateBounds() {
        this._bounds.reset()
            .addRect(this.getLocalBounds(), this.getGlobalTransform());
        for (const child of this._children) {
            if (child.visible) {
                this._bounds.addRect(child.getBounds());
            }
        }
        return this;
    }
    destroy() {
        this.removeChildren();
        super.destroy();
    }
}

class Scene {
    static create(definition) {
        return Object.assign(new Scene(), definition);
    }
    constructor() {
        this._app = null;
        this._root = new Container();
    }
    get app() {
        return this._app;
    }
    set app(app) {
        this._app = app;
    }
    get root() {
        return this._root;
    }
    addChild(child) {
        this._root.addChild(child);
        return this;
    }
    removeChild(child) {
        this._root.removeChild(child);
        return this;
    }
    load(loader) {
        // override in subclass or via Scene.create()
    }
    init(loader) {
        // override in subclass or via Scene.create()
    }
    update(delta) {
        // override in subclass or via Scene.create()
    }
    draw(renderManager) {
        // override in subclass or via Scene.create()
    }
    unload(loader) {
        // override in subclass or via Scene.create()
    }
    destroy() {
        this._root.destroy();
        this._app = null;
    }
}

class Timer extends Clock {
    constructor(limit, autoStart = false) {
        super();
        this._limit = limit.clone();
        if (autoStart) {
            this.restart();
        }
    }
    set limit(limit) {
        this._limit.copy(limit);
    }
    get expired() {
        return this.elapsedMilliseconds >= this._limit.milliseconds;
    }
    get remainingMilliseconds() {
        return Math.max(0, this._limit.milliseconds - this.elapsedMilliseconds);
    }
    get remainingSeconds() {
        return this.remainingMilliseconds / Time.seconds;
    }
    get remainingMinutes() {
        return this.remainingMilliseconds / Time.minutes;
    }
    get remainingHours() {
        return this.remainingMilliseconds / Time.hours;
    }
}

class AudioAnalyser {
    constructor(media, options = {}) {
        this._analyser = null;
        this._audioContext = null;
        this._analyserTarget = null;
        const { fftSize, minDecibels, maxDecibels, smoothingTimeConstant } = options;
        this._media = media;
        this._fftSize = fftSize ?? 2048;
        this._minDecibels = minDecibels ?? -100;
        this._maxDecibels = maxDecibels ?? -30;
        this._smoothingTimeConstant = smoothingTimeConstant ?? 0.8;
        this._frequencyBinCount = this._fftSize / 2;
        this._timeDomainData = new Uint8Array(this._frequencyBinCount);
        this._frequencyData = new Uint8Array(this._frequencyBinCount);
        this._preciseTimeDomainData = new Float32Array(this._frequencyBinCount);
        this._preciseFrequencyData = new Float32Array(this._frequencyBinCount);
        if (isAudioContextReady()) {
            this.setupWithAudioContext(getAudioContext());
        }
        else {
            onAudioContextReady.once(this.setupWithAudioContext, this);
        }
    }
    connect() {
        if (!this._analyser || this._analyserTarget !== null) {
            return this;
        }
        const analyserTarget = this._media.analyserTarget;
        if (!analyserTarget) {
            throw new Error('No AudioNode on property analyserTarget.');
        }
        this._analyserTarget = analyserTarget;
        analyserTarget.connect(this._analyser);
        return this;
    }
    get timeDomainData() {
        if (this._analyser) {
            this.connect();
            this._analyser.getByteTimeDomainData(this._timeDomainData);
        }
        return this._timeDomainData;
    }
    get frequencyData() {
        if (this._analyser) {
            this.connect();
            this._analyser.getByteFrequencyData(this._frequencyData);
        }
        return this._frequencyData;
    }
    get preciseTimeDomainData() {
        if (this._analyser) {
            this.connect();
            this._analyser.getFloatTimeDomainData(this._preciseTimeDomainData);
        }
        return this._preciseTimeDomainData;
    }
    get preciseFrequencyData() {
        if (this._analyser) {
            this.connect();
            this._analyser.getFloatFrequencyData(this._preciseFrequencyData);
        }
        return this._preciseFrequencyData;
    }
    destroy() {
        onAudioContextReady.clearByContext(this);
        this._analyserTarget?.disconnect();
        this._analyser?.disconnect();
    }
    setupWithAudioContext(audioContext) {
        this._audioContext = audioContext;
        this._analyser = audioContext.createAnalyser();
        this._analyser.fftSize = this._fftSize;
        this._analyser.minDecibels = this._minDecibels;
        this._analyser.maxDecibels = this._maxDecibels;
        this._analyser.smoothingTimeConstant = this._smoothingTimeConstant;
    }
}

const basePositions = new Map([
    ['DPad', [0.22, 0.58]],
    ['DPadUp', [0.22, 0.50]],
    ['DPadDown', [0.22, 0.66]],
    ['DPadLeft', [0.14, 0.58]],
    ['DPadRight', [0.30, 0.58]],
    ['ButtonNorth', [0.78, 0.50]],
    ['ButtonWest', [0.70, 0.58]],
    ['ButtonEast', [0.86, 0.58]],
    ['ButtonSouth', [0.78, 0.66]],
    ['LeftShoulder', [0.28, 0.28]],
    ['RightShoulder', [0.72, 0.28]],
    ['LeftTrigger', [0.20, 0.16]],
    ['RightTrigger', [0.80, 0.16]],
    ['Select', [0.46, 0.50]],
    ['Start', [0.54, 0.50]],
    ['LeftStick', [0.38, 0.66]],
    ['RightStick', [0.62, 0.66]],
]);
const channelMap = new Map([
    ['ButtonNorth', GamepadChannel.ButtonNorth],
    ['ButtonWest', GamepadChannel.ButtonWest],
    ['ButtonEast', GamepadChannel.ButtonEast],
    ['ButtonSouth', GamepadChannel.ButtonSouth],
    ['LeftShoulder', GamepadChannel.LeftShoulder],
    ['RightShoulder', GamepadChannel.RightShoulder],
    ['LeftTrigger', GamepadChannel.LeftTrigger],
    ['RightTrigger', GamepadChannel.RightTrigger],
    ['Select', GamepadChannel.Select],
    ['Start', GamepadChannel.Start],
    ['LeftStick', GamepadChannel.LeftStick],
    ['RightStick', GamepadChannel.RightStick],
    ['DPadUp', GamepadChannel.DPadUp],
    ['DPadDown', GamepadChannel.DPadDown],
    ['DPadLeft', GamepadChannel.DPadLeft],
    ['DPadRight', GamepadChannel.DPadRight],
]);
const genericLabels = new Map([
    ['ButtonNorth', 'North'],
    ['ButtonWest', 'West'],
    ['ButtonEast', 'East'],
    ['ButtonSouth', 'South'],
    ['LeftShoulder', 'L1'],
    ['RightShoulder', 'R1'],
    ['LeftTrigger', 'L2'],
    ['RightTrigger', 'R2'],
    ['Select', 'Select'],
    ['Start', 'Start'],
    ['LeftStick', 'L3'],
    ['RightStick', 'R3'],
]);
const xboxLabels = new Map([
    ['ButtonNorth', 'Y'],
    ['ButtonWest', 'X'],
    ['ButtonEast', 'B'],
    ['ButtonSouth', 'A'],
    ['LeftShoulder', 'LB'],
    ['RightShoulder', 'RB'],
    ['LeftTrigger', 'LT'],
    ['RightTrigger', 'RT'],
    ['Select', 'View'],
    ['Start', 'Menu'],
    ['LeftStick', 'L3'],
    ['RightStick', 'R3'],
]);
const playStationLabels = new Map([
    ['ButtonNorth', 'Triangle'],
    ['ButtonWest', 'Square'],
    ['ButtonEast', 'Circle'],
    ['ButtonSouth', 'Cross'],
    ['LeftShoulder', 'L1'],
    ['RightShoulder', 'R1'],
    ['LeftTrigger', 'L2'],
    ['RightTrigger', 'R2'],
    ['Select', 'Create'],
    ['Start', 'Options'],
    ['LeftStick', 'L3'],
    ['RightStick', 'R3'],
]);
const switchLabels = new Map([
    ['ButtonNorth', 'X'],
    ['ButtonWest', 'Y'],
    ['ButtonEast', 'A'],
    ['ButtonSouth', 'B'],
    ['LeftShoulder', 'L'],
    ['RightShoulder', 'R'],
    ['LeftTrigger', 'ZL'],
    ['RightTrigger', 'ZR'],
    ['Select', 'Minus'],
    ['Start', 'Plus'],
    ['LeftStick', 'L3'],
    ['RightStick', 'R3'],
]);
const promptLabelsByFamily = new Map([
    [GamepadMappingFamily.GenericDualAnalog, genericLabels],
    [GamepadMappingFamily.Xbox, xboxLabels],
    [GamepadMappingFamily.PlayStation, playStationLabels],
    [GamepadMappingFamily.SwitchPro, switchLabels],
    [GamepadMappingFamily.JoyConLeft, switchLabels],
    [GamepadMappingFamily.JoyConRight, switchLabels],
    [GamepadMappingFamily.GameCube, genericLabels],
    [GamepadMappingFamily.SteamController, genericLabels],
    [GamepadMappingFamily.ArcadeStick, genericLabels],
]);
class GamepadPromptLayouts {
    static getControlPosition(control) {
        return basePositions.get(control) ?? [0.5, 0.5];
    }
    static getControlLabels(family) {
        return promptLabelsByFamily.get(family) ?? genericLabels;
    }
    static buildControlChannelMap() {
        return channelMap;
    }
}
GamepadPromptLayouts.controls = [
    'DPad',
    'DPadUp',
    'DPadDown',
    'DPadLeft',
    'DPadRight',
    'ButtonNorth',
    'ButtonWest',
    'ButtonEast',
    'ButtonSouth',
    'LeftShoulder',
    'RightShoulder',
    'LeftTrigger',
    'RightTrigger',
    'Select',
    'Start',
    'LeftStick',
    'RightStick',
];

class Input {
    constructor(channels, { onStart, onStop, onActive, onTrigger, context, threshold } = {}) {
        this.channels = new Set();
        this.valueState = 0;
        this.onStart = new Signal();
        this.onStop = new Signal();
        this.onActive = new Signal();
        this.onTrigger = new Signal();
        this.channels = new Set(Array.isArray(channels) ? channels : [channels]);
        this.triggerTimer = new Timer(milliseconds(threshold ?? Input.triggerThreshold));
        if (onStart) {
            this.onStart.add(onStart, context);
        }
        if (onStop) {
            this.onStop.add(onStop, context);
        }
        if (onActive) {
            this.onActive.add(onActive, context);
        }
        if (onTrigger) {
            this.onTrigger.add(onTrigger, context);
        }
    }
    get activeChannels() {
        return this.channels;
    }
    get value() {
        return this.valueState;
    }
    update(channels) {
        this.valueState = 0;
        for (const channel of this.channels) {
            this.valueState = Math.max(channels[channel], this.valueState);
        }
        if (this.valueState) {
            if (!this.triggerTimer.running) {
                this.triggerTimer.restart();
                this.onStart.dispatch(this.valueState);
            }
            this.onActive.dispatch(this.valueState);
        }
        else if (this.triggerTimer.running) {
            this.onStop.dispatch(this.valueState);
            if (!this.triggerTimer.expired) {
                this.onTrigger.dispatch(this.valueState);
            }
            this.triggerTimer.stop();
        }
        return this;
    }
    destroy() {
        this.channels.clear();
        this.triggerTimer.destroy();
        this.onStart.destroy();
        this.onStop.destroy();
        this.onActive.destroy();
        this.onTrigger.destroy();
    }
}
Input.triggerThreshold = 300;

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var earcut$1 = {exports: {}};

var hasRequiredEarcut;

function requireEarcut () {
	if (hasRequiredEarcut) return earcut$1.exports;
	hasRequiredEarcut = 1;

	earcut$1.exports = earcut;
	earcut$1.exports.default = earcut;

	function earcut(data, holeIndices, dim) {

	    dim = dim || 2;

	    var hasHoles = holeIndices && holeIndices.length,
	        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
	        outerNode = linkedList(data, 0, outerLen, dim, true),
	        triangles = [];

	    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

	    var minX, minY, maxX, maxY, x, y, invSize;

	    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

	    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
	    if (data.length > 80 * dim) {
	        minX = maxX = data[0];
	        minY = maxY = data[1];

	        for (var i = dim; i < outerLen; i += dim) {
	            x = data[i];
	            y = data[i + 1];
	            if (x < minX) minX = x;
	            if (y < minY) minY = y;
	            if (x > maxX) maxX = x;
	            if (y > maxY) maxY = y;
	        }

	        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
	        invSize = Math.max(maxX - minX, maxY - minY);
	        invSize = invSize !== 0 ? 32767 / invSize : 0;
	    }

	    earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);

	    return triangles;
	}

	// create a circular doubly linked list from polygon points in the specified winding order
	function linkedList(data, start, end, dim, clockwise) {
	    var i, last;

	    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
	        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
	    } else {
	        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
	    }

	    if (last && equals(last, last.next)) {
	        removeNode(last);
	        last = last.next;
	    }

	    return last;
	}

	// eliminate colinear or duplicate points
	function filterPoints(start, end) {
	    if (!start) return start;
	    if (!end) end = start;

	    var p = start,
	        again;
	    do {
	        again = false;

	        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
	            removeNode(p);
	            p = end = p.prev;
	            if (p === p.next) break;
	            again = true;

	        } else {
	            p = p.next;
	        }
	    } while (again || p !== end);

	    return end;
	}

	// main ear slicing loop which triangulates a polygon (given as a linked list)
	function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
	    if (!ear) return;

	    // interlink polygon nodes in z-order
	    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

	    var stop = ear,
	        prev, next;

	    // iterate through ears, slicing them one by one
	    while (ear.prev !== ear.next) {
	        prev = ear.prev;
	        next = ear.next;

	        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
	            // cut off the triangle
	            triangles.push(prev.i / dim | 0);
	            triangles.push(ear.i / dim | 0);
	            triangles.push(next.i / dim | 0);

	            removeNode(ear);

	            // skipping the next vertex leads to less sliver triangles
	            ear = next.next;
	            stop = next.next;

	            continue;
	        }

	        ear = next;

	        // if we looped through the whole remaining polygon and can't find any more ears
	        if (ear === stop) {
	            // try filtering points and slicing again
	            if (!pass) {
	                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

	            // if this didn't work, try curing all small self-intersections locally
	            } else if (pass === 1) {
	                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
	                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

	            // as a last resort, try splitting the remaining polygon into two
	            } else if (pass === 2) {
	                splitEarcut(ear, triangles, dim, minX, minY, invSize);
	            }

	            break;
	        }
	    }
	}

	// check whether a polygon node forms a valid ear with adjacent nodes
	function isEar(ear) {
	    var a = ear.prev,
	        b = ear,
	        c = ear.next;

	    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

	    // now make sure we don't have other points inside the potential ear
	    var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

	    // triangle bbox; min & max are calculated like this for speed
	    var x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
	        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
	        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
	        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

	    var p = c.next;
	    while (p !== a) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
	            area(p.prev, p, p.next) >= 0) return false;
	        p = p.next;
	    }

	    return true;
	}

	function isEarHashed(ear, minX, minY, invSize) {
	    var a = ear.prev,
	        b = ear,
	        c = ear.next;

	    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

	    var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

	    // triangle bbox; min & max are calculated like this for speed
	    var x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
	        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
	        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
	        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

	    // z-order range for the current triangle bbox;
	    var minZ = zOrder(x0, y0, minX, minY, invSize),
	        maxZ = zOrder(x1, y1, minX, minY, invSize);

	    var p = ear.prevZ,
	        n = ear.nextZ;

	    // look for points inside the triangle in both directions
	    while (p && p.z >= minZ && n && n.z <= maxZ) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
	        p = p.prevZ;

	        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
	        n = n.nextZ;
	    }

	    // look for remaining points in decreasing z-order
	    while (p && p.z >= minZ) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
	        p = p.prevZ;
	    }

	    // look for remaining points in increasing z-order
	    while (n && n.z <= maxZ) {
	        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
	        n = n.nextZ;
	    }

	    return true;
	}

	// go through all polygon nodes and cure small local self-intersections
	function cureLocalIntersections(start, triangles, dim) {
	    var p = start;
	    do {
	        var a = p.prev,
	            b = p.next.next;

	        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

	            triangles.push(a.i / dim | 0);
	            triangles.push(p.i / dim | 0);
	            triangles.push(b.i / dim | 0);

	            // remove two nodes involved
	            removeNode(p);
	            removeNode(p.next);

	            p = start = b;
	        }
	        p = p.next;
	    } while (p !== start);

	    return filterPoints(p);
	}

	// try splitting polygon into two and triangulate them independently
	function splitEarcut(start, triangles, dim, minX, minY, invSize) {
	    // look for a valid diagonal that divides the polygon into two
	    var a = start;
	    do {
	        var b = a.next.next;
	        while (b !== a.prev) {
	            if (a.i !== b.i && isValidDiagonal(a, b)) {
	                // split the polygon in two by the diagonal
	                var c = splitPolygon(a, b);

	                // filter colinear points around the cuts
	                a = filterPoints(a, a.next);
	                c = filterPoints(c, c.next);

	                // run earcut on each half
	                earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
	                earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
	                return;
	            }
	            b = b.next;
	        }
	        a = a.next;
	    } while (a !== start);
	}

	// link every hole into the outer loop, producing a single-ring polygon without holes
	function eliminateHoles(data, holeIndices, outerNode, dim) {
	    var queue = [],
	        i, len, start, end, list;

	    for (i = 0, len = holeIndices.length; i < len; i++) {
	        start = holeIndices[i] * dim;
	        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
	        list = linkedList(data, start, end, dim, false);
	        if (list === list.next) list.steiner = true;
	        queue.push(getLeftmost(list));
	    }

	    queue.sort(compareX);

	    // process holes from left to right
	    for (i = 0; i < queue.length; i++) {
	        outerNode = eliminateHole(queue[i], outerNode);
	    }

	    return outerNode;
	}

	function compareX(a, b) {
	    return a.x - b.x;
	}

	// find a bridge between vertices that connects hole with an outer ring and and link it
	function eliminateHole(hole, outerNode) {
	    var bridge = findHoleBridge(hole, outerNode);
	    if (!bridge) {
	        return outerNode;
	    }

	    var bridgeReverse = splitPolygon(bridge, hole);

	    // filter collinear points around the cuts
	    filterPoints(bridgeReverse, bridgeReverse.next);
	    return filterPoints(bridge, bridge.next);
	}

	// David Eberly's algorithm for finding a bridge between hole and outer polygon
	function findHoleBridge(hole, outerNode) {
	    var p = outerNode,
	        hx = hole.x,
	        hy = hole.y,
	        qx = -Infinity,
	        m;

	    // find a segment intersected by a ray from the hole's leftmost point to the left;
	    // segment's endpoint with lesser x will be potential connection point
	    do {
	        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
	            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
	            if (x <= hx && x > qx) {
	                qx = x;
	                m = p.x < p.next.x ? p : p.next;
	                if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
	            }
	        }
	        p = p.next;
	    } while (p !== outerNode);

	    if (!m) return null;

	    // look for points inside the triangle of hole point, segment intersection and endpoint;
	    // if there are no points found, we have a valid connection;
	    // otherwise choose the point of the minimum angle with the ray as connection point

	    var stop = m,
	        mx = m.x,
	        my = m.y,
	        tanMin = Infinity,
	        tan;

	    p = m;

	    do {
	        if (hx >= p.x && p.x >= mx && hx !== p.x &&
	                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

	            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

	            if (locallyInside(p, hole) &&
	                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
	                m = p;
	                tanMin = tan;
	            }
	        }

	        p = p.next;
	    } while (p !== stop);

	    return m;
	}

	// whether sector in vertex m contains sector in vertex p in the same coordinates
	function sectorContainsSector(m, p) {
	    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
	}

	// interlink polygon nodes in z-order
	function indexCurve(start, minX, minY, invSize) {
	    var p = start;
	    do {
	        if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
	        p.prevZ = p.prev;
	        p.nextZ = p.next;
	        p = p.next;
	    } while (p !== start);

	    p.prevZ.nextZ = null;
	    p.prevZ = null;

	    sortLinked(p);
	}

	// Simon Tatham's linked list merge sort algorithm
	// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
	function sortLinked(list) {
	    var i, p, q, e, tail, numMerges, pSize, qSize,
	        inSize = 1;

	    do {
	        p = list;
	        list = null;
	        tail = null;
	        numMerges = 0;

	        while (p) {
	            numMerges++;
	            q = p;
	            pSize = 0;
	            for (i = 0; i < inSize; i++) {
	                pSize++;
	                q = q.nextZ;
	                if (!q) break;
	            }
	            qSize = inSize;

	            while (pSize > 0 || (qSize > 0 && q)) {

	                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
	                    e = p;
	                    p = p.nextZ;
	                    pSize--;
	                } else {
	                    e = q;
	                    q = q.nextZ;
	                    qSize--;
	                }

	                if (tail) tail.nextZ = e;
	                else list = e;

	                e.prevZ = tail;
	                tail = e;
	            }

	            p = q;
	        }

	        tail.nextZ = null;
	        inSize *= 2;

	    } while (numMerges > 1);

	    return list;
	}

	// z-order of a point given coords and inverse of the longer side of data bbox
	function zOrder(x, y, minX, minY, invSize) {
	    // coords are transformed into non-negative 15-bit integer range
	    x = (x - minX) * invSize | 0;
	    y = (y - minY) * invSize | 0;

	    x = (x | (x << 8)) & 0x00FF00FF;
	    x = (x | (x << 4)) & 0x0F0F0F0F;
	    x = (x | (x << 2)) & 0x33333333;
	    x = (x | (x << 1)) & 0x55555555;

	    y = (y | (y << 8)) & 0x00FF00FF;
	    y = (y | (y << 4)) & 0x0F0F0F0F;
	    y = (y | (y << 2)) & 0x33333333;
	    y = (y | (y << 1)) & 0x55555555;

	    return x | (y << 1);
	}

	// find the leftmost node of a polygon ring
	function getLeftmost(start) {
	    var p = start,
	        leftmost = start;
	    do {
	        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
	        p = p.next;
	    } while (p !== start);

	    return leftmost;
	}

	// check if a point lies within a convex triangle
	function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
	    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
	           (ax - px) * (by - py) >= (bx - px) * (ay - py) &&
	           (bx - px) * (cy - py) >= (cx - px) * (by - py);
	}

	// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
	function isValidDiagonal(a, b) {
	    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
	           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
	            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
	            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
	}

	// signed area of a triangle
	function area(p, q, r) {
	    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	}

	// check if two points are equal
	function equals(p1, p2) {
	    return p1.x === p2.x && p1.y === p2.y;
	}

	// check if two segments intersect
	function intersects(p1, q1, p2, q2) {
	    var o1 = sign(area(p1, q1, p2));
	    var o2 = sign(area(p1, q1, q2));
	    var o3 = sign(area(p2, q2, p1));
	    var o4 = sign(area(p2, q2, q1));

	    if (o1 !== o2 && o3 !== o4) return true; // general case

	    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
	    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
	    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
	    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

	    return false;
	}

	// for collinear points p, q, r, check if point q lies on segment pr
	function onSegment(p, q, r) {
	    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
	}

	function sign(num) {
	    return num > 0 ? 1 : num < 0 ? -1 : 0;
	}

	// check if a polygon diagonal intersects any polygon segments
	function intersectsPolygon(a, b) {
	    var p = a;
	    do {
	        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
	                intersects(p, p.next, a, b)) return true;
	        p = p.next;
	    } while (p !== a);

	    return false;
	}

	// check if a polygon diagonal is locally inside the polygon
	function locallyInside(a, b) {
	    return area(a.prev, a, a.next) < 0 ?
	        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
	        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
	}

	// check if the middle point of a polygon diagonal is inside the polygon
	function middleInside(a, b) {
	    var p = a,
	        inside = false,
	        px = (a.x + b.x) / 2,
	        py = (a.y + b.y) / 2;
	    do {
	        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
	                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
	            inside = !inside;
	        p = p.next;
	    } while (p !== a);

	    return inside;
	}

	// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
	// if one belongs to the outer ring and another to a hole, it merges it into a single ring
	function splitPolygon(a, b) {
	    var a2 = new Node(a.i, a.x, a.y),
	        b2 = new Node(b.i, b.x, b.y),
	        an = a.next,
	        bp = b.prev;

	    a.next = b;
	    b.prev = a;

	    a2.next = an;
	    an.prev = a2;

	    b2.next = a2;
	    a2.prev = b2;

	    bp.next = b2;
	    b2.prev = bp;

	    return b2;
	}

	// create a node and optionally link it with previous one (in a circular doubly linked list)
	function insertNode(i, x, y, last) {
	    var p = new Node(i, x, y);

	    if (!last) {
	        p.prev = p;
	        p.next = p;

	    } else {
	        p.next = last.next;
	        p.prev = last;
	        last.next.prev = p;
	        last.next = p;
	    }
	    return p;
	}

	function removeNode(p) {
	    p.next.prev = p.prev;
	    p.prev.next = p.next;

	    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
	    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
	}

	function Node(i, x, y) {
	    // vertex index in coordinates array
	    this.i = i;

	    // vertex coordinates
	    this.x = x;
	    this.y = y;

	    // previous and next vertex nodes in a polygon ring
	    this.prev = null;
	    this.next = null;

	    // z-order curve value
	    this.z = 0;

	    // previous and next nodes in z-order
	    this.prevZ = null;
	    this.nextZ = null;

	    // indicates whether this is a steiner point
	    this.steiner = false;
	}

	// return a percentage difference between the polygon area and its triangulation area;
	// used to verify correctness of triangulation
	earcut.deviation = function (data, holeIndices, dim, triangles) {
	    var hasHoles = holeIndices && holeIndices.length;
	    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

	    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
	    if (hasHoles) {
	        for (var i = 0, len = holeIndices.length; i < len; i++) {
	            var start = holeIndices[i] * dim;
	            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
	            polygonArea -= Math.abs(signedArea(data, start, end, dim));
	        }
	    }

	    var trianglesArea = 0;
	    for (i = 0; i < triangles.length; i += 3) {
	        var a = triangles[i] * dim;
	        var b = triangles[i + 1] * dim;
	        var c = triangles[i + 2] * dim;
	        trianglesArea += Math.abs(
	            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
	            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
	    }

	    return polygonArea === 0 && trianglesArea === 0 ? 0 :
	        Math.abs((trianglesArea - polygonArea) / polygonArea);
	};

	function signedArea(data, start, end, dim) {
	    var sum = 0;
	    for (var i = start, j = end - dim; i < end; i += dim) {
	        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
	        j = i;
	    }
	    return sum;
	}

	// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
	earcut.flatten = function (data) {
	    var dim = data[0][0].length,
	        result = {vertices: [], holes: [], dimensions: dim},
	        holeIndex = 0;

	    for (var i = 0; i < data.length; i++) {
	        for (var j = 0; j < data[i].length; j++) {
	            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
	        }
	        if (i > 0) {
	            holeIndex += data[i - 1].length;
	            result.holes.push(holeIndex);
	        }
	    }
	    return result;
	};
	return earcut$1.exports;
}

var earcutExports = requireEarcut();
var earcut = /*@__PURE__*/getDefaultExportFromCjs(earcutExports);

class Geometry {
    constructor({ vertices = [], indices = [], points = [], } = {}) {
        this.vertices = new Float32Array(vertices);
        this.indices = new Uint16Array(indices);
        this.points = points;
    }
    destroy() {
        // todo - check if destroy is needed
    }
}

const buildLine = (startX, startY, endX, endY, width, vertices = [], indices = []) => {
    const points = [startX, startY, endX, endY];
    const distance = width / 2;
    const index = vertices.length / 6;
    const perpA = new Vector(startX - endX, startY - endY).perp().normalize().multiply(distance);
    const perpB = new Vector(endX - startX, endY - startY).perp().normalize().multiply(distance);
    vertices.push(startX - perpA.x, startY - perpA.y);
    vertices.push(startX + perpA.x, startY + perpA.y);
    vertices.push(endX - perpB.x, endY - perpB.y);
    vertices.push(endX + perpB.x, endY + perpB.y);
    indices.push(index, index, index + 1, index + 2, index + 3, index + 3);
    return new Geometry({ vertices, indices, points });
};
const buildPath = (points, width, vertices = [], indices = []) => {
    if (points.length < 4) {
        throw new Error('At least two X/Y pairs are required to build a line.');
    }
    const lineWidth = width / 2, firstPoint = new Vector(points[0], points[1]), lastPoint = new Vector(points[points.length - 2], points[points.length - 1]);
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
        points = points.slice();
        points.pop();
        points.pop();
        lastPoint.set(points[points.length - 2], points[points.length - 1]);
        const midPointX = lastPoint.x + ((firstPoint.x - lastPoint.x) * 0.5);
        const midPointY = lastPoint.y + ((firstPoint.y - lastPoint.y) * 0.5);
        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }
    const length = points.length / 2;
    let indexCount = points.length;
    let indexStart = vertices.length / 6;
    let p1x = points[0];
    let p1y = points[1];
    let p2x = points[2];
    let p2y = points[3];
    let p3x = 0;
    let p3y = 0;
    let perpx = -(p1y - p2y);
    let perpy = p1x - p2x;
    let perp2x = 0;
    let perp2y = 0;
    let perp3x = 0;
    let perp3y = 0;
    let dist = Math.sqrt((perpx * perpx) + (perpy * perpy));
    perpx /= dist;
    perpy /= dist;
    perpx *= lineWidth;
    perpy *= lineWidth;
    vertices.push(p1x - perpx, p1y - perpy);
    vertices.push(p1x + perpx, p1y + perpy);
    for (let i = 1; i < length - 1; i++) {
        p1x = points[(i - 1) * 2];
        p1y = points[((i - 1) * 2) + 1];
        p2x = points[i * 2];
        p2y = points[(i * 2) + 1];
        p3x = points[(i + 1) * 2];
        p3y = points[((i + 1) * 2) + 1];
        perpx = -(p1y - p2y);
        perpy = p1x - p2x;
        dist = Math.sqrt((perpx * perpx) + (perpy * perpy));
        perpx /= dist;
        perpy /= dist;
        perpx *= lineWidth;
        perpy *= lineWidth;
        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;
        dist = Math.sqrt((perp2x * perp2x) + (perp2y * perp2y));
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= lineWidth;
        perp2y *= lineWidth;
        const a1 = (-perpy + p1y) - (-perpy + p2y);
        const b1 = (-perpx + p2x) - (-perpx + p1x);
        const c1 = ((-perpx + p1x) * (-perpy + p2y)) - ((-perpx + p2x) * (-perpy + p1y));
        const a2 = (-perp2y + p3y) - (-perp2y + p2y);
        const b2 = (-perp2x + p2x) - (-perp2x + p3x);
        const c2 = ((-perp2x + p3x) * (-perp2y + p2y)) - ((-perp2x + p2x) * (-perp2y + p3y));
        let denom = (a1 * b2) - (a2 * b1);
        if (Math.abs(denom) < 0.1) {
            denom += 10.1;
            vertices.push(p2x - perpx, p2y - perpy);
            vertices.push(p2x + perpx, p2y + perpy);
            continue;
        }
        const px = ((b1 * c2) - (b2 * c1)) / denom;
        const py = ((a2 * c1) - (a1 * c2)) / denom;
        const pdist = ((px - p2x) * (px - p2x)) + ((py - p2y) * (py - p2y));
        if (pdist > (196 * lineWidth * lineWidth)) {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;
            dist = Math.sqrt((perp3x * perp3x) + (perp3y * perp3y));
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= lineWidth;
            perp3y *= lineWidth;
            vertices.push(p2x - perp3x, p2y - perp3y);
            vertices.push(p2x + perp3x, p2y + perp3y);
            vertices.push(p2x - perp3x, p2y - perp3y);
            indexCount++;
        }
        else {
            vertices.push(px, py);
            vertices.push(p2x - (px - p2x), p2y - (py - p2y));
        }
    }
    p1x = points[(length - 2) * 2];
    p1y = points[((length - 2) * 2) + 1];
    p2x = points[(length - 1) * 2];
    p2y = points[((length - 1) * 2) + 1];
    perpx = -(p1y - p2y);
    perpy = p1x - p2x;
    dist = Math.sqrt((perpx * perpx) + (perpy * perpy));
    perpx /= dist;
    perpy /= dist;
    perpx *= lineWidth;
    perpy *= lineWidth;
    vertices.push(p2x - perpx, p2y - perpy);
    vertices.push(p2x + perpx, p2y + perpy);
    indices.push(indexStart);
    for (let i = 0; i < indexCount; i++) {
        indices.push(indexStart++);
    }
    indices.push(indexStart - 1);
    return new Geometry({ vertices, indices, points });
};
const buildCircle = (centerX, centerY, radius, vertices = [], indices = []) => {
    const length = Math.floor(15 * Math.sqrt(radius + radius)), segment = (Math.PI * 2) / length, points = [];
    let index = vertices.length / 6;
    indices.push(index);
    for (let i = 0; i < length + 1; i++) {
        const segmentX = centerX + (Math.sin(segment * i) * radius), segmentY = centerY + (Math.cos(segment * i) * radius);
        points.push(segmentX, segmentY);
        vertices.push(centerX, centerY);
        vertices.push(segmentX, segmentY);
        indices.push(index++, index++);
    }
    indices.push(index - 1);
    return new Geometry({ vertices, indices, points });
};
const buildEllipse = (centerX, centerY, radiusX, radiusY, vertices = [], indices = []) => {
    const length = Math.floor(15 * Math.sqrt(radiusX + radiusY)), segment = (Math.PI * 2) / length, points = [];
    let index = vertices.length / 6;
    indices.push(index);
    for (let i = 0; i < length + 1; i++) {
        const segmentX = centerX + (Math.sin(segment * i) * radiusX), segmentY = centerY + (Math.cos(segment * i) * radiusY);
        points.push(segmentX, segmentY);
        vertices.push(centerX, centerY);
        vertices.push(segmentX, segmentY);
        indices.push(index++, index++);
    }
    indices.push(index - 1);
    return new Geometry({ vertices, indices, points });
};
const buildPolygon = (points, vertices = [], indices = []) => {
    if (points.length < 6) {
        throw new Error('At least three X/Y pairs are required to build a polygon.');
    }
    const index = vertices.length / 6, length = points.length / 2, triangles = earcut(points, [], 2);
    if (triangles) {
        for (let i = 0; i < triangles.length; i += 3) {
            indices.push(triangles[i] + index);
            indices.push(triangles[i] + index);
            indices.push(triangles[i + 1] + index);
            indices.push(triangles[i + 2] + index);
            indices.push(triangles[i + 2] + index);
        }
        for (let i = 0; i < length; i++) {
            vertices.push(points[i * 2], points[(i * 2) + 1]);
        }
    }
    return new Geometry({ vertices, indices, points });
};
const buildRectangle = (x, y, width, height, vertices = [], indices = []) => {
    const points = [x, y, x + width, y, x, y + height, x + width, y + height], index = vertices.length / 6;
    vertices.push(...points);
    indices.push(index, index, index + 1, index + 2, index + 3, index + 3);
    return new Geometry({ vertices, indices, points });
};
const buildStar = (centerX, centerY, points, radius, innerRadius = radius / 2, rotation = 0) => {
    const startAngle = (Math.PI / -2) + rotation, length = points * 2, delta = tau / length, path = [];
    for (let i = 0; i < length; i++) {
        const angle = startAngle + (i * delta);
        const rad = i % 2 ? innerRadius : radius;
        path.push(centerX + (rad * Math.cos(angle)), centerY + (rad * Math.sin(angle)));
    }
    return buildPolygon(path);
};

let temp$3 = null;
class Line {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        this.collisionType = 1 /* CollisionType.Line */;
        this._fromPosition = new Vector(x1, y1);
        this._toPosition = new Vector(x2, y2);
    }
    get fromPosition() {
        return this._fromPosition;
    }
    set fromPosition(positionFrom) {
        this._fromPosition.copy(positionFrom);
    }
    get fromX() {
        return this._fromPosition.x;
    }
    set fromX(fromX) {
        this._fromPosition.x = fromX;
    }
    get fromY() {
        return this._fromPosition.y;
    }
    set fromY(fromY) {
        this._fromPosition.y = fromY;
    }
    get toPosition() {
        return this._toPosition;
    }
    set toPosition(positionTo) {
        this._toPosition.copy(positionTo);
    }
    get toX() {
        return this._toPosition.x;
    }
    set toX(toX) {
        this._toPosition.x = toX;
    }
    get toY() {
        return this._toPosition.y;
    }
    set toY(toY) {
        this._toPosition.y = toY;
    }
    set(x1, y1, x2, y2) {
        this._fromPosition.set(x1, y1);
        this._toPosition.set(x2, y2);
        return this;
    }
    copy(line) {
        this._fromPosition.copy(line.fromPosition);
        this.toPosition.copy(line.toPosition);
        return this;
    }
    clone() {
        return new Line(this.fromX, this.fromY, this.toX, this.toY);
    }
    getBounds() {
        const { fromX, fromY, toX, toY } = this;
        const minX = Math.min(fromX, toX);
        const minY = Math.min(fromY, toY);
        return new Rectangle(minX, minY, Math.max(fromX, toX) - minX, Math.max(fromY, toY) - minY);
    }
    getNormals() {
        return [];
    }
    project(axis, result = new Interval()) {
        return result;
    }
    intersectsWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return intersectionLineRect(this, target.getBounds());
            case 2 /* CollisionType.Rectangle */: return intersectionLineRect(this, target);
            case 5 /* CollisionType.Polygon */: return intersectionLinePoly(this, target);
            case 3 /* CollisionType.Circle */: return intersectionLineCircle(this, target);
            case 4 /* CollisionType.Ellipse */: return intersectionLineEllipse(this, target);
            case 1 /* CollisionType.Line */: return intersectionLineLine(this, target);
            case 0 /* CollisionType.Point */: return intersectionPointLine(target, this);
            default: return false;
        }
    }
    collidesWith(target) {
        return null;
    }
    contains(x, y, threshold = 0.1) {
        return intersectionPointLine(Vector.temp.set(x, y), this, threshold);
    }
    equals({ fromX, fromY, toX, toY } = {}) {
        return (fromX === undefined || this.fromX === fromX)
            && (fromY === undefined || this.fromY === fromY)
            && (toX === undefined || this.toX === toX)
            && (toY === undefined || this.toY === toY);
    }
    destroy() {
        this._fromPosition.destroy();
        this._toPosition.destroy();
    }
    static get temp() {
        if (temp$3 === null) {
            temp$3 = new Line();
        }
        return temp$3;
    }
}

let temp$2 = null;
class Circle {
    constructor(x = 0, y = 0, radius = 0) {
        this.collisionType = 3 /* CollisionType.Circle */;
        this._collisionVertices = null;
        this._position = new Vector(x, y);
        this._radius = radius;
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
    }
    get y() {
        return this._position.y;
    }
    set y(y) {
        this._position.y = y;
    }
    get radius() {
        return this._radius;
    }
    set radius(radius) {
        this._radius = radius;
    }
    setPosition(x, y) {
        this._position.set(x, y);
        return this;
    }
    setRadius(radius) {
        this._radius = radius;
        return this;
    }
    set(x, y, radius) {
        this._position.set(x, y);
        this._radius = radius;
        return this;
    }
    copy(circle) {
        this._position.copy(circle.position);
        this._radius = circle.radius;
        return this;
    }
    clone() {
        return new Circle(this.x, this.y, this.radius);
    }
    equals({ x, y, radius } = {}) {
        return (x === undefined || this.x === x)
            && (y === undefined || this.y === y)
            && (radius === undefined || this.radius === radius);
    }
    getBounds() {
        return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    /**
     * todo - cache this
     */
    getNormals() {
        const points = this.getCollisionVertices();
        return points.map((point, i, arr) => arr[(i + 1) % arr.length].clone().subtract(point.x, point.y).rperp().normalize());
    }
    project(axis, result = new Interval()) {
        const center = axis.dot(this.x, this.y);
        const radius = this.radius * axis.length;
        return result.set(center - radius, center + radius);
    }
    contains(x, y) {
        return intersectionPointCircle(Vector.temp.set(x, y), this);
    }
    intersectsWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return intersectionRectCircle(target.getBounds(), this);
            case 2 /* CollisionType.Rectangle */: return intersectionRectCircle(target, this);
            case 5 /* CollisionType.Polygon */: return intersectionCirclePoly(this, target);
            case 3 /* CollisionType.Circle */: return intersectionCircleCircle(this, target);
            case 4 /* CollisionType.Ellipse */: return intersectionCircleEllipse(this, target);
            case 1 /* CollisionType.Line */: return intersectionLineCircle(target, this);
            case 0 /* CollisionType.Point */: return intersectionPointCircle(target, this);
            default: return false;
        }
    }
    collidesWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return getCollisionCircleRectangle(this, target.getBounds());
            case 2 /* CollisionType.Rectangle */: return getCollisionCircleRectangle(this, target);
            case 5 /* CollisionType.Polygon */: return getCollisionPolygonCircle(target, this, true);
            case 3 /* CollisionType.Circle */: return getCollisionCircleCircle(this, target);
            // case CollisionType.Ellipse: return intersectionCircleEllipse(this, target as Ellipse);
            // case CollisionType.Line: return intersectionLineCircle(target as Line, this);
            // case CollisionType.Point: return intersectionPointCircle(target as Vector, this);
            default: return null;
        }
    }
    destroy() {
        this._position.destroy();
    }
    getCollisionVertices() {
        if (this._collisionVertices === null) {
            this._collisionVertices = [];
            for (let i = 0; i < Circle.collisionSegments; i++) {
                this._collisionVertices.push(this.getCollisionVertex(i));
            }
        }
        return this._collisionVertices;
    }
    getCollisionVertex(index) {
        const angle = index * 2 * Math.PI / Circle.collisionSegments - Math.PI / 2;
        const x = Math.cos(angle) * this._radius;
        const y = Math.sin(angle) * this._radius;
        return new Vector(this._radius + x, this._radius + y);
    }
    static get temp() {
        if (temp$2 === null) {
            temp$2 = new Circle();
        }
        return temp$2;
    }
}
Circle.collisionSegments = 32;

class Ellipse {
    constructor(x = 0, y = 0, halfWidth = 0, halfHeight = halfWidth) {
        this.collisionType = 4 /* CollisionType.Ellipse */;
        this._position = new Vector(x, y);
        this._radius = new Vector(halfWidth, halfHeight);
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
    }
    get y() {
        return this._position.y;
    }
    set y(y) {
        this._position.y = y;
    }
    get radius() {
        return this._radius;
    }
    set radius(size) {
        this._radius.copy(size);
    }
    get rx() {
        return this._radius.x;
    }
    set rx(radiusX) {
        this._radius.x = radiusX;
    }
    get ry() {
        return this._radius.y;
    }
    set ry(radiusY) {
        this._radius.y = radiusY;
    }
    setPosition(x, y) {
        this._position.set(x, y);
        return this;
    }
    setRadius(radiusX, radiusY = radiusX) {
        this._radius.set(radiusX, radiusY);
        return this;
    }
    set(x, y, radiusX, radiusY) {
        this._position.set(x, y);
        this._radius.set(radiusX, radiusY);
        return this;
    }
    copy(ellipse) {
        this._position.copy(ellipse.position);
        this._radius.copy(ellipse.radius);
        return this;
    }
    clone() {
        return new Ellipse(this.x, this.y, this.rx, this.ry);
    }
    getBounds() {
        return new Rectangle(this.x - this.rx, this.y - this.ry, this.rx * 2, this.ry * 2);
    }
    getNormals() {
        return [];
    }
    project(axis, result = new Interval()) {
        return result;
    }
    intersectsWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return intersectionRectEllipse(target.getBounds(), this);
            case 2 /* CollisionType.Rectangle */: return intersectionRectEllipse(target, this);
            case 5 /* CollisionType.Polygon */: return intersectionEllipsePoly(this, target);
            case 3 /* CollisionType.Circle */: return intersectionCircleEllipse(target, this);
            case 4 /* CollisionType.Ellipse */: return intersectionEllipseEllipse(this, target);
            case 1 /* CollisionType.Line */: return intersectionLineEllipse(target, this);
            case 0 /* CollisionType.Point */: return intersectionPointEllipse(target, this);
            default: return false;
        }
    }
    collidesWith(target) {
        return null;
    }
    contains(x, y) {
        return intersectionPointEllipse(Vector.temp.set(x, y), this);
    }
    equals({ x, y, rx, ry } = {}) {
        return (x === undefined || this.x === x)
            && (y === undefined || this.y === y)
            && (rx === undefined || this.rx === rx)
            && (ry === undefined || this.ry === ry);
    }
    destroy() {
        this._position.destroy();
        this._radius.destroy();
    }
}

let temp$1 = null;
class Polygon {
    constructor(points = [], x = 0, y = 0) {
        this.collisionType = 5 /* CollisionType.Polygon */;
        this._points = [];
        this._edges = [];
        this._normals = [];
        this._position = new Vector(x, y);
        this.setPoints(points);
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
    }
    get y() {
        return this._position.y;
    }
    set y(y) {
        this._position.y = y;
    }
    get points() {
        return this._points;
    }
    set points(points) {
        this.setPoints(points);
    }
    get edges() {
        return this._edges;
    }
    get normals() {
        return this._normals;
    }
    setPosition(x, y) {
        this._position.set(x, y);
        return this;
    }
    setPoints(newPoints) {
        const len = this._points.length;
        const newLen = newPoints.length;
        const diff = len - newLen;
        const sharedLength = Math.min(len, newLen);
        for (let i = 0; i < sharedLength; i++) {
            this._points[i].copy(newPoints[i]);
        }
        if (diff > 0) {
            this._points.splice(newLen).forEach(point => point.destroy());
            this._edges.splice(newLen).forEach(point => point.destroy());
            this._normals.splice(newLen).forEach(point => point.destroy());
        }
        else if (diff < 0) {
            for (let i = len; i < newLen; i++) {
                this._points.push(newPoints[i].clone());
                this._edges.push(newPoints[i].clone());
                this._normals.push(newPoints[i].clone());
            }
        }
        for (let i = 0; i < newLen; i++) {
            const curr = this._points[i];
            const next = this._points[(i + 1) % newLen];
            this._edges[i].set(next.x - curr.x, next.y - curr.y);
            this._normals[i].copy(this._edges[i]).rperp().normalize();
        }
        return this;
    }
    set(x, y, points) {
        this._position.set(x, y);
        this.setPoints(points);
        return this;
    }
    copy(polygon) {
        this._position.copy(polygon.position);
        this.setPoints(polygon.points);
        return this;
    }
    clone() {
        return new Polygon(this.points, this.x, this.y);
    }
    equals({ x, y, points } = {}) {
        return (x === undefined || this.x === x)
            && (y === undefined || this.y === y)
            && (points === undefined || ((this.points.length === points.length)
                && (this.points.every((point, index) => point.equals(points[index])))));
    }
    getBounds() {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const point of this._points) {
            minX = Math.min(point.x, minX);
            minY = Math.min(point.y, minY);
            maxX = Math.max(point.x, maxX);
            maxY = Math.max(point.y, maxY);
        }
        return new Rectangle(this.x + minX, this.y + minY, maxX - minX, maxY - minY);
    }
    getNormals() {
        return this._normals;
    }
    project(axis, result = new Interval()) {
        const normal = axis.clone().normalize();
        const projections = this._points.map(point => normal.dot(point.x, point.y));
        return result.set(Math.min(...projections), Math.max(...projections));
    }
    contains(x, y) {
        return intersectionPointPoly(Vector.temp.set(x, y), this);
    }
    intersectsWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return intersectionRectPoly(target.getBounds(), this);
            case 2 /* CollisionType.Rectangle */: return intersectionRectPoly(target, this);
            case 5 /* CollisionType.Polygon */: return intersectionPolyPoly(this, target);
            case 3 /* CollisionType.Circle */: return intersectionCirclePoly(target, this);
            case 4 /* CollisionType.Ellipse */: return intersectionEllipsePoly(target, this);
            case 1 /* CollisionType.Line */: return intersectionLinePoly(target, this);
            case 0 /* CollisionType.Point */: return intersectionPointPoly(target, this);
            default: return false;
        }
    }
    collidesWith(target) {
        switch (target.collisionType) {
            case 6 /* CollisionType.SceneNode */: return getCollisionSat(this, target);
            case 2 /* CollisionType.Rectangle */: return getCollisionSat(this, target);
            case 5 /* CollisionType.Polygon */: return getCollisionSat(this, target);
            case 3 /* CollisionType.Circle */: return getCollisionPolygonCircle(this, target);
            // case CollisionType.Ellipse: return intersectionEllipsePoly(target as Ellipse, this);
            // case CollisionType.Line: return intersectionLinePoly(target as Line, this);
            // case CollisionType.Point: return intersectionPointPoly(target as Vector, this);
            default: return null;
        }
    }
    destroy() {
        for (const point of this._points) {
            point.destroy();
        }
        this._position.destroy();
        this._points.length = 0;
    }
    static get temp() {
        if (temp$1 === null) {
            temp$1 = new Polygon();
        }
        return temp$1;
    }
}

let temp = null;
class Segment {
    constructor(startX = 0, startY = 0, endX = 0, endY = 0) {
        this._startPoint = new Vector(startX, startY);
        this._endPoint = new Vector(endX, endY);
    }
    get startPoint() {
        return this._startPoint;
    }
    set startPoint(startPoint) {
        this._startPoint.copy(startPoint);
    }
    get startX() {
        return this._startPoint.x;
    }
    set startX(x) {
        this._startPoint.x = x;
    }
    get startY() {
        return this._startPoint.y;
    }
    set startY(y) {
        this._startPoint.y = y;
    }
    get endPoint() {
        return this._endPoint;
    }
    set endPoint(endPoint) {
        this._endPoint.copy(endPoint);
    }
    get endX() {
        return this._endPoint.x;
    }
    set endX(x) {
        this._endPoint.x = x;
    }
    get endY() {
        return this._endPoint.y;
    }
    set endY(y) {
        this._endPoint.y = y;
    }
    set(startX, startY, endX, endY) {
        this._startPoint.set(startX, startY);
        this._endPoint.set(endX, endY);
        return this;
    }
    copy(segment) {
        this._startPoint.copy(segment.startPoint);
        this._endPoint.copy(segment.endPoint);
        return this;
    }
    clone() {
        return new Segment(this.startX, this.startY, this.endX, this.endY);
    }
    equals({ startX, startY, endX, endY } = {}) {
        return (startX === undefined || this.startX === startX)
            && (startY === undefined || this.startY === startY)
            && (endX === undefined || this.endX === endX)
            && (endY === undefined || this.endY === endY);
    }
    destroy() {
        this._startPoint.destroy();
        this._endPoint.destroy();
    }
    static get temp() {
        if (temp === null) {
            temp = new Segment();
        }
        return temp;
    }
}

class PolarVector {
    constructor(radius = 0, angle = 0) {
        this.radius = radius;
        this.phi = angle;
    }
    static fromVector(vector) {
        return new PolarVector(vector.length, 0);
    }
    toVector() {
        return Vector.temp.set(this.radius * Math.cos(this.phi), this.radius * Math.sin(this.phi));
    }
}

class ColorAffector {
    constructor(fromColor, toColor) {
        this._fromColor = fromColor.clone();
        this._toColor = toColor.clone();
    }
    get fromColor() {
        return this._fromColor;
    }
    set fromColor(color) {
        this.setFromColor(color);
    }
    get toColor() {
        return this._toColor;
    }
    set toColor(color) {
        this.setToColor(color);
    }
    setFromColor(color) {
        this._fromColor.copy(color);
        return this;
    }
    setToColor(color) {
        this._toColor.copy(color);
        return this;
    }
    apply(particle, delta) {
        const ratio = particle.elapsedRatio;
        const { r: r1, g: g1, b: b1, a: a1 } = this._fromColor;
        const { r: r2, g: g2, b: b2, a: a2 } = this._toColor;
        particle.tint.set(((r2 - r1) * ratio) + r1, ((g2 - g1) * ratio) + g1, ((b2 - b1) * ratio) + b1, ((a2 - a1) * ratio) + a1);
        return this;
    }
    destroy() {
        this._fromColor.destroy();
        this._toColor.destroy();
    }
}

class ForceAffector {
    constructor(accelerationX, accelerationY) {
        this._acceleration = new Vector(accelerationX, accelerationY);
    }
    get acceleration() {
        return this._acceleration;
    }
    set acceleration(acceleration) {
        this.setAcceleration(acceleration);
    }
    setAcceleration(acceleration) {
        this._acceleration.copy(acceleration);
        return this;
    }
    apply(particle, delta) {
        particle.velocity.add(delta.seconds * this._acceleration.x, delta.seconds * this._acceleration.y);
        return this;
    }
    destroy() {
        this._acceleration.destroy();
    }
}

class ScaleAffector {
    constructor(factorX, factorY) {
        this._scaleFactor = new Vector(factorX, factorY);
    }
    get scaleFactor() {
        return this._scaleFactor;
    }
    set scaleFactor(scaleFactor) {
        this.setScaleFactor(scaleFactor);
    }
    setScaleFactor(scaleFactor) {
        this._scaleFactor.copy(scaleFactor);
        return this;
    }
    apply(particle, delta) {
        particle.scale.add(delta.seconds * this._scaleFactor.x, delta.seconds * this._scaleFactor.y);
        return this;
    }
    destroy() {
        this._scaleFactor.destroy();
    }
}

class TorqueAffector {
    constructor(angularAcceleration) {
        this._angularAcceleration = angularAcceleration;
    }
    get angularAcceleration() {
        return this._angularAcceleration;
    }
    set angularAcceleration(angularAcceleration) {
        this.setAngularAcceleration(angularAcceleration);
    }
    setAngularAcceleration(angularAcceleration) {
        this._angularAcceleration = angularAcceleration;
        return this;
    }
    apply(particle, delta) {
        particle.rotationSpeed += (delta.seconds * this._angularAcceleration);
        return this;
    }
    destroy() {
        // todo - check if destroy is needed
    }
}

class ParticleOptions {
    constructor(options = {}) {
        const { totalLifetime, elapsedLifetime, position, velocity, scale, rotation, rotationSpeed, textureIndex, tint, } = options;
        this._totalLifetime = (totalLifetime ?? Time.oneSecond).clone();
        this._elapsedLifetime = (elapsedLifetime ?? Time.zero).clone();
        this._position = (position ?? Vector.zero).clone();
        this._velocity = (velocity ?? Vector.zero).clone();
        this._scale = (scale ?? Vector.one).clone();
        this._tint = (tint ?? Color.white).clone();
        this._rotation = rotation ?? 0;
        this._rotationSpeed = rotationSpeed ?? 0;
        this._textureIndex = textureIndex ?? 0;
    }
    get totalLifetime() {
        return this._totalLifetime;
    }
    set totalLifetime(totalLifetime) {
        this._totalLifetime.copy(totalLifetime);
    }
    get elapsedLifetime() {
        return this._elapsedLifetime;
    }
    set elapsedLifetime(elapsedLifetime) {
        this._elapsedLifetime.copy(elapsedLifetime);
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position.copy(position);
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(velocity) {
        this._velocity.copy(velocity);
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale.copy(scale);
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(degrees) {
        this._rotation = trimRotation(degrees);
    }
    get rotationSpeed() {
        return this._rotationSpeed;
    }
    set rotationSpeed(rotationSpeed) {
        this._rotationSpeed = rotationSpeed;
    }
    get textureIndex() {
        return this._textureIndex;
    }
    set textureIndex(textureIndex) {
        this._textureIndex = textureIndex;
    }
    get tint() {
        return this._tint;
    }
    set tint(color) {
        this._tint.copy(color);
    }
    destroy() {
        this._totalLifetime.destroy();
        this._elapsedLifetime.destroy();
        this._position.destroy();
        this._velocity.destroy();
        this._scale.destroy();
        this._tint.destroy();
    }
}

class UniversalEmitter {
    constructor(emissionRate, particleOptions) {
        this._emissionDelta = 0;
        this._emissionRate = emissionRate;
        this._particleOptions = particleOptions ?? new ParticleOptions();
    }
    get emissionRate() {
        return this._emissionRate;
    }
    set emissionRate(particlesPerSecond) {
        this._emissionRate = particlesPerSecond;
    }
    get particleOptions() {
        return this._particleOptions;
    }
    set particleOptions(particleOptions) {
        this._particleOptions = particleOptions;
    }
    computeParticleCount(time) {
        const particleAmount = (this._emissionRate * time.seconds) + this._emissionDelta;
        const particles = particleAmount | 0;
        this._emissionDelta = (particleAmount - particles);
        return particles;
    }
    apply(system, delta) {
        const count = this.computeParticleCount(delta);
        const options = this._particleOptions;
        for (let i = 0; i < count; i++) {
            const particle = system.requestParticle();
            particle.applyOptions(options);
            system.emitParticle(particle);
        }
        return this;
    }
    destroy() {
        this._particleOptions.destroy();
    }
}

class CircleGeometry extends Geometry {
    constructor(centerX, centerY, radius) {
        const length = Math.floor(15 * Math.sqrt(radius + radius)), segment = (Math.PI * 2) / length, vertices = [], indices = [], points = [];
        let index = vertices.length / 6;
        indices.push(index);
        for (let i = 0; i < length + 1; i++) {
            const segmentX = centerX + (Math.sin(segment * i) * radius), segmentY = centerY + (Math.cos(segment * i) * radius);
            points.push(segmentX, segmentY);
            vertices.push(centerX, centerY);
            vertices.push(segmentX, segmentY);
            indices.push(index++, index++);
        }
        indices.push(index - 1);
        super({ vertices, indices, points });
    }
}

class Graphics extends Container {
    constructor() {
        super(...arguments);
        this._lineWidth = 0;
        this._lineColor = new Color();
        this._fillColor = new Color();
        this._currentPoint = new Vector(0, 0);
    }
    get lineWidth() {
        return this._lineWidth;
    }
    set lineWidth(lineWidth) {
        this._lineWidth = lineWidth;
    }
    get lineColor() {
        return this._lineColor;
    }
    set lineColor(lineColor) {
        this._lineColor.copy(lineColor);
    }
    get fillColor() {
        return this._fillColor;
    }
    set fillColor(fillColor) {
        this._fillColor.copy(fillColor);
    }
    get currentPoint() {
        return this._currentPoint;
    }
    getChildAt(index) {
        return super.getChildAt(index);
    }
    addChild(child) {
        if (!(child instanceof DrawableShape)) {
            throw new Error('Graphics can only contain DrawableShape children.');
        }
        return super.addChild(child);
    }
    addChildAt(child, index) {
        if (!(child instanceof DrawableShape)) {
            throw new Error('Graphics can only contain DrawableShape children.');
        }
        return super.addChildAt(child, index);
    }
    moveTo(x, y) {
        this._currentPoint.set(x, y);
        return this;
    }
    lineTo(toX, toY) {
        const { x: fromX, y: fromY } = this._currentPoint;
        this.drawPath([fromX, fromY, toX, toY]);
        this.moveTo(toX, toY);
        return this;
    }
    quadraticCurveTo(cpX, cpY, toX, toY) {
        const { x: fromX, y: fromY } = this._currentPoint;
        this.drawPath(quadraticCurveTo(fromX, fromY, cpX, cpY, toX, toY));
        this.moveTo(toX, toY);
        return this;
    }
    bezierCurveTo(cpX1, cpY1, cpX2, cpY2, toX, toY) {
        const { x: fromX, y: fromY } = this._currentPoint;
        this.drawPath(bezierCurveTo(fromX, fromY, cpX1, cpY1, cpX2, cpY2, toX, toY));
        this.moveTo(toX, toY);
        return this;
    }
    arcTo(x1, y1, x2, y2, radius) {
        const { x: fromX, y: fromY } = this._currentPoint;
        const r = Math.abs(radius);
        if (r === 0 || (fromX === x1 && fromY === y1) || (x1 === x2 && y1 === y2)) {
            return this.lineTo(x1, y1);
        }
        const inX = x1 - fromX;
        const inY = y1 - fromY;
        const outX = x2 - x1;
        const outY = y2 - y1;
        const inLen = Math.hypot(inX, inY);
        const outLen = Math.hypot(outX, outY);
        if (inLen === 0 || outLen === 0) {
            return this.lineTo(x1, y1);
        }
        const inDirX = inX / inLen;
        const inDirY = inY / inLen;
        const outDirX = outX / outLen;
        const outDirY = outY / outLen;
        const dot = clamp((inDirX * outDirX) + (inDirY * outDirY), -1, 1);
        const angle = Math.acos(dot);
        if (angle === 0 || angle === Math.PI) {
            return this.lineTo(x1, y1);
        }
        const distanceToTangent = r / Math.tan(angle / 2);
        if (!Number.isFinite(distanceToTangent) || distanceToTangent > inLen || distanceToTangent > outLen) {
            return this.lineTo(x1, y1);
        }
        const startX = x1 - (inDirX * distanceToTangent);
        const startY = y1 - (inDirY * distanceToTangent);
        const endX = x1 + (outDirX * distanceToTangent);
        const endY = y1 + (outDirY * distanceToTangent);
        const cross = (inDirX * outDirY) - (inDirY * outDirX);
        const leftTurn = cross > 0;
        const normalX = leftTurn ? -inDirY : inDirY;
        const normalY = leftTurn ? inDirX : -inDirX;
        const centerX = startX + (normalX * r);
        const centerY = startY + (normalY * r);
        const startAngle = Math.atan2(startY - centerY, startX - centerX);
        const endAngle = Math.atan2(endY - centerY, endX - centerX);
        this.lineTo(startX, startY);
        return this.drawArc(centerX, centerY, r, startAngle, endAngle, leftTurn);
    }
    drawArc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
        const r = Math.abs(radius);
        if (r === 0) {
            return this;
        }
        let sweep = endAngle - startAngle;
        if (!anticlockwise && sweep < 0) {
            sweep += tau;
        }
        else if (anticlockwise && sweep > 0) {
            sweep -= tau;
        }
        if (sweep === 0) {
            return this;
        }
        const segments = Math.max(2, Math.ceil(Math.abs(sweep) / (Math.PI / 16)));
        const path = [];
        for (let i = 0; i <= segments; i++) {
            const ratio = i / segments;
            const angle = startAngle + (sweep * ratio);
            path.push(x + (Math.cos(angle) * r), y + (Math.sin(angle) * r));
        }
        this.drawPath(path);
        this.moveTo(path[path.length - 2], path[path.length - 1]);
        return this;
    }
    drawLine(startX, startY, endX, endY) {
        this.addChild(new DrawableShape(buildLine(startX, startY, endX, endY, this._lineWidth), this._lineColor, RenderingPrimitives.TriangleStrip));
        return this;
    }
    drawPath(path) {
        this.addChild(new DrawableShape(buildPath(path, this._lineWidth), this._lineColor, RenderingPrimitives.TriangleStrip));
        return this;
    }
    drawPolygon(path) {
        const polygon = buildPolygon(path);
        this.addChild(new DrawableShape(polygon, this._fillColor, RenderingPrimitives.TriangleStrip));
        if (this._lineWidth > 0) {
            this.drawPath(polygon.points);
        }
        return this;
    }
    drawCircle(centerX, centerY, radius) {
        const circle = new CircleGeometry(centerX, centerY, radius);
        this.addChild(new DrawableShape(circle, this._fillColor, RenderingPrimitives.TriangleStrip));
        if (this._lineWidth > 0) {
            this.drawPath(circle.points);
        }
        return this;
    }
    drawEllipse(centerX, centerY, radiusX, radiusY) {
        const ellipse = buildEllipse(centerX, centerY, radiusX, radiusY);
        this.addChild(new DrawableShape(ellipse, this._fillColor, RenderingPrimitives.TriangleStrip));
        if (this._lineWidth > 0) {
            this.drawPath(ellipse.points);
        }
        return this;
    }
    drawRectangle(x, y, width, height) {
        const rectangle = buildRectangle(x, y, width, height);
        this.addChild(new DrawableShape(rectangle, this._fillColor, RenderingPrimitives.TriangleStrip));
        if (this._lineWidth > 0) {
            this.drawPath(rectangle.points);
        }
        return this;
    }
    drawStar(centerX, centerY, points, radius, innerRadius = radius / 2, rotation = 0) {
        const star = buildStar(centerX, centerY, points, radius, innerRadius, rotation);
        this.addChild(new DrawableShape(star, this._fillColor, RenderingPrimitives.TriangleStrip));
        if (this._lineWidth > 0) {
            this.drawPath(star.points);
        }
        return this;
    }
    clear() {
        this.removeChildren();
        this._lineWidth = 0;
        this._lineColor.copy(Color.black);
        this._fillColor.copy(Color.black);
        this._currentPoint.set(0, 0);
        return this;
    }
    destroy() {
        super.destroy();
        this.clear();
        this._lineColor.destroy();
        this._fillColor.destroy();
        this._currentPoint.destroy();
    }
}

class Spritesheet {
    constructor(texture, data) {
        this.frames = new Map();
        this.sprites = new Map();
        this.texture = texture;
        this.parse(data);
    }
    parse(data, keepFrames = false) {
        if (!keepFrames) {
            this.clear();
        }
        for (const [name, frame] of Object.entries(data.frames)) {
            this.addFrame(name, frame);
        }
    }
    addFrame(name, data) {
        const { x, y, w, h } = data.frame;
        const frame = new Rectangle(x, y, w, h);
        const sprite = new Sprite(this.texture);
        sprite.setTextureFrame(frame);
        this.frames.set(name, frame);
        this.sprites.set(name, sprite);
    }
    getFrameSprite(name) {
        const sprite = this.sprites.get(name);
        if (!sprite) {
            throw new Error(`Spritesheet frame named ${name} is not available!`);
        }
        return sprite;
    }
    clear() {
        for (const frame of this.frames.values()) {
            frame.destroy();
        }
        this.frames.clear();
        for (const sprite of this.sprites.values()) {
            sprite.destroy();
        }
        this.sprites.clear();
        return this;
    }
    destroy() {
        this.clear();
    }
}

class TextStyle {
    constructor(options = {}) {
        this._dirty = true;
        this._align = options.align ?? 'left';
        this._fill = options.fill ?? 'black';
        this._stroke = options.stroke ?? 'black';
        this._strokeThickness = options.strokeThickness ?? 1;
        this._fontSize = options.fontSize ?? 20;
        this._fontWeight = options.fontWeight ?? 'bold';
        this._fontFamily = options.fontFamily ?? 'Arial';
        this._wordWrap = options.wordWrap ?? false;
        this._wordWrapWidth = options.wordWrapWidth ?? 100;
        this._baseline = options.baseline ?? 'alphabetic';
        this._lineJoin = options.lineJoin ?? 'miter';
        this._miterLimit = options.miterLimit ?? 10;
        this._padding = options.padding ?? 0;
    }
    get align() {
        return this._align;
    }
    set align(align) {
        if (this._align !== align) {
            this._align = align;
            this._dirty = true;
        }
    }
    get fill() {
        return this._fill;
    }
    set fill(fill) {
        if (this._fill !== fill) {
            this._fill = fill;
            this._dirty = true;
        }
    }
    get stroke() {
        return this._stroke;
    }
    set stroke(stroke) {
        if (this._stroke !== stroke) {
            this._stroke = stroke;
            this._dirty = true;
        }
    }
    get strokeThickness() {
        return this._strokeThickness;
    }
    set strokeThickness(strokeThickness) {
        if (this._strokeThickness !== strokeThickness) {
            this._strokeThickness = strokeThickness;
            this._dirty = true;
        }
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(fontSize) {
        if (this._fontSize !== fontSize) {
            this._fontSize = fontSize;
            this._dirty = true;
        }
    }
    get fontWeight() {
        return this._fontWeight;
    }
    set fontWeight(fontWeight) {
        if (this._fontWeight !== fontWeight) {
            this._fontWeight = fontWeight;
            this._dirty = true;
        }
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(fontFamily) {
        if (this._fontFamily !== fontFamily) {
            this._fontFamily = fontFamily;
            this._dirty = true;
        }
    }
    get wordWrap() {
        return this._wordWrap;
    }
    set wordWrap(wordWrap) {
        if (this._wordWrap !== wordWrap) {
            this._wordWrap = wordWrap;
            this._dirty = true;
        }
    }
    get wordWrapWidth() {
        return this._wordWrapWidth;
    }
    set wordWrapWidth(wordWrapWidth) {
        if (this._wordWrapWidth !== wordWrapWidth) {
            this._wordWrapWidth = wordWrapWidth;
            this._dirty = true;
        }
    }
    get baseline() {
        return this._baseline;
    }
    set baseline(baseline) {
        if (this._baseline !== baseline) {
            this._baseline = baseline;
            this._dirty = true;
        }
    }
    get lineJoin() {
        return this._lineJoin;
    }
    set lineJoin(lineJoin) {
        if (this._lineJoin !== lineJoin) {
            this._lineJoin = lineJoin;
            this._dirty = true;
        }
    }
    get miterLimit() {
        return this._miterLimit;
    }
    set miterLimit(miterLimit) {
        if (this._miterLimit !== miterLimit) {
            this._miterLimit = miterLimit;
            this._dirty = true;
        }
    }
    get padding() {
        return this._padding;
    }
    set padding(padding) {
        if (this._padding !== padding) {
            this._padding = padding;
            this._dirty = true;
        }
    }
    get dirty() {
        return this._dirty;
    }
    set dirty(dirty) {
        this._dirty = dirty;
    }
    get font() {
        return `${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`;
    }
    apply(context) {
        context.font = this.font;
        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;
        context.lineWidth = this.strokeThickness;
        context.textBaseline = this.baseline;
        context.lineJoin = this.lineJoin;
        context.miterLimit = this.miterLimit;
        return this;
    }
    copy(style) {
        if (style !== this) {
            this.align = style.align;
            this.fill = style.fill;
            this.stroke = style.stroke;
            this.strokeThickness = style.strokeThickness;
            this.fontSize = style.fontSize;
            this.fontWeight = style.fontWeight;
            this.fontFamily = style.fontFamily;
            this.wordWrap = style.wordWrap;
            this.wordWrapWidth = style.wordWrapWidth;
            this.baseline = style.baseline;
            this.lineJoin = style.lineJoin;
            this.miterLimit = style.miterLimit;
            this.padding = style.padding;
            this.dirty = style.dirty;
        }
        return this;
    }
    clone() {
        return new TextStyle().copy(this);
    }
}

const newLinePattern = /(?:\r\n|\r|\n)/;
class Text extends Sprite {
    constructor(text, style, samplerOptions, canvas = document.createElement('canvas')) {
        super(new Texture(canvas, samplerOptions));
        this._dirty = true;
        this._text = text;
        this._style = (style && style instanceof TextStyle) ? style : new TextStyle(style);
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this.updateTexture();
    }
    get text() {
        return this._text;
    }
    set text(text) {
        this.setText(text);
    }
    get style() {
        return this._style;
    }
    set style(style) {
        this.setStyle(style);
    }
    get canvas() {
        return this._canvas;
    }
    set canvas(canvas) {
        this.setCanvas(canvas);
    }
    setText(text) {
        if (this._text !== text) {
            this._text = text;
            this._dirty = true;
        }
        return this;
    }
    setStyle(style) {
        this._style = (style instanceof TextStyle) ? style : new TextStyle(style);
        this._dirty = true;
        return this;
    }
    setCanvas(canvas) {
        if (this._canvas !== canvas) {
            this._canvas = canvas;
            this._context = this._getContext(canvas);
            this._dirty = true;
            this.texture.setSource.call(this.texture, canvas);
            this.setTextureFrame(Rectangle.temp.set(0, 0, canvas.width, canvas.height));
        }
        return this;
    }
    updateTexture() {
        if (this._style && (this._dirty || this._style.dirty)) {
            const canvas = this._canvas, context = this._context, style = this._style.apply(context), text = style.wordWrap ? this.getWordWrappedText() : this._text, lineHeight = determineFontHeight(context.font) + style.strokeThickness, lines = text.split(newLinePattern), lineMetrics = lines.map((line) => context.measureText(line)), maxLineWidth = lineMetrics.reduce((max, measure) => Math.max(max, measure.width), 0), canvasWidth = Math.ceil((maxLineWidth + style.strokeThickness) + (style.padding * 2)), canvasHeight = Math.ceil((lineHeight * lines.length) + (style.padding * 2));
            if (canvasWidth !== canvas.width || canvasHeight !== canvas.height) {
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                this.setTextureFrame(Rectangle.temp.set(0, 0, canvasWidth, canvasHeight));
            }
            else {
                context.clearRect(0, 0, canvasWidth, canvasHeight);
            }
            style.apply(context);
            for (let i = 0; i < lines.length; i++) {
                const metrics = lineMetrics[i], lineWidth = (maxLineWidth - metrics.width), offset = (style.align === 'right') ? lineWidth : lineWidth / 2, padding = style.padding + (style.strokeThickness / 2), lineX = metrics.actualBoundingBoxLeft + (style.align === 'left' ? 0 : offset) + padding, lineY = metrics.actualBoundingBoxAscent + (lineHeight * i) + padding;
                if (style.stroke && style.strokeThickness) {
                    context.strokeText(lines[i], lineX, lineY);
                }
                if (style.fill) {
                    context.fillText(lines[i], lineX, lineY);
                }
            }
            this.texture.updateSource();
            this._dirty = false;
            this._style.dirty = false;
        }
        return this;
    }
    getWordWrappedText() {
        const context = this._context, wrapWidth = this._style.wordWrapWidth, lines = this._text.split('\n'), spaceWidth = context.measureText(' ').width;
        let spaceLeft = wrapWidth, result = '';
        for (let y = 0; y < lines.length; y++) {
            const words = lines[y].split(' ');
            if (y > 0) {
                result += '\n';
            }
            for (let x = 0; x < words.length; x++) {
                const word = words[x], wordWidth = context.measureText(word).width, pairWidth = wordWidth + spaceWidth;
                if (pairWidth > spaceLeft) {
                    if (x > 0) {
                        result += '\n';
                    }
                    spaceLeft = wrapWidth;
                }
                else {
                    spaceLeft -= pairWidth;
                }
                result += `${word} `;
            }
        }
        return result;
    }
    render(renderManager) {
        if (this.visible) {
            this.updateTexture();
            super.render(renderManager);
        }
        return this;
    }
    _getContext(canvas) {
        const context = canvas.getContext('2d');
        if (context === null) {
            throw new Error('Could not create a 2D canvas context.');
        }
        return context;
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

class CacheFirstStrategy {
    async resolve(request, stores) {
        const { storageName, key, url, requestOptions, factory } = request;
        for (const store of stores) {
            const cached = await store.load(storageName, key);
            if (cached !== null && cached !== undefined) {
                try {
                    await factory.create(cached);
                    return cached;
                }
                catch {
                    await store.delete(storageName, key);
                }
            }
        }
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch "${url}" (${response.status} ${response.statusText}).`);
        }
        const source = await factory.process(response);
        for (const store of stores) {
            try {
                await store.save(storageName, key, source);
            }
            catch {
                // Quota exceeded or non-cloneable value — continue without caching.
            }
        }
        return source;
    }
}

class NetworkOnlyStrategy {
    async resolve(request, _stores) {
        const response = await fetch(request.url, request.requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch "${request.url}" (${response.status} ${response.statusText}).`);
        }
        return request.factory.process(response);
    }
}

const defaultStoreNames = [
    'font', 'video', 'music', 'sound', 'image', 'texture',
    'text', 'svg', 'json', 'binary', 'wasm', 'vtt',
];
class IndexedDbDatabase {
    get connected() {
        return this._connected;
    }
    constructor(name, version = 1, storeNames = defaultStoreNames, migrations) {
        this._onCloseHandler = this.disconnect.bind(this);
        this._connected = false;
        this._database = null;
        if (!supportsIndexedDb) {
            throw new Error('This browser does not support indexedDB!');
        }
        this.name = name;
        this.version = version;
        this._storeNames = storeNames;
        this._migrations = migrations;
    }
    async getObjectStore(type, transactionMode = 'readonly') {
        await this.connect();
        return this._database.transaction([type], transactionMode).objectStore(type);
    }
    async connect() {
        if (this._connected && this._database) {
            return true;
        }
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, this.version);
            request.addEventListener('upgradeneeded', (event) => {
                const database = request.result;
                const transaction = request.transaction;
                const currentStores = [...transaction.objectStoreNames];
                const { oldVersion, newVersion } = event;
                database.addEventListener('error', () => reject(Error('An error occurred while opening the database.')));
                database.addEventListener('abort', () => reject(Error('The database opening was aborted.')));
                if (this._migrations) {
                    const migrationKeys = Object.keys(this._migrations)
                        .map(Number)
                        .filter(v => v > oldVersion && v <= (newVersion ?? this.version))
                        .sort((a, b) => a - b);
                    for (const v of migrationKeys) {
                        const ok = this._migrations[v](database, transaction);
                        if (!ok) {
                            transaction.abort();
                            return;
                        }
                    }
                }
                else {
                    for (const store of currentStores) {
                        if (!this._storeNames.includes(store)) {
                            database.deleteObjectStore(store);
                        }
                    }
                    for (const name of this._storeNames) {
                        if (!currentStores.includes(name)) {
                            database.createObjectStore(name, { keyPath: 'name' });
                        }
                    }
                }
            });
            request.addEventListener('success', () => {
                this._database = request.result;
                this._database.addEventListener('close', this._onCloseHandler);
                this._database.addEventListener('versionchange', this._onCloseHandler);
                this._connected = true;
                resolve(true);
            });
            request.addEventListener('error', () => reject(Error('An error occurred while requesting the database connection.')));
            request.addEventListener('blocked', () => reject(Error('The request for the database connection has been blocked.')));
        });
    }
    async disconnect() {
        if (this._database) {
            this._database.removeEventListener('close', this._onCloseHandler);
            this._database.removeEventListener('versionchange', this._onCloseHandler);
            this._database.close();
            this._database = null;
            this._connected = false;
        }
        return true;
    }
    async load(type, name) {
        const store = await this.getObjectStore(type);
        return new Promise((resolve, reject) => {
            const request = store.get(name);
            request.addEventListener('success', () => resolve(request.result?.data ?? null));
            request.addEventListener('error', () => reject(Error('An error occurred while loading an item.')));
        });
    }
    async save(type, name, data) {
        const store = await this.getObjectStore(type, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put({ name, data });
            request.addEventListener('success', () => resolve());
            request.addEventListener('error', () => reject(Error('An error occurred while saving an item.')));
        });
    }
    async delete(type, name) {
        const store = await this.getObjectStore(type, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(name);
            request.addEventListener('success', () => resolve(true));
            request.addEventListener('error', () => reject(Error('An error occurred while deleting an item.')));
        });
    }
    async clearStorage(type) {
        const store = await this.getObjectStore(type, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.addEventListener('success', () => resolve(true));
            request.addEventListener('error', () => reject(Error('An error occurred while clearing a storage.')));
        });
    }
    async deleteStorage() {
        await this.disconnect();
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.name);
            request.addEventListener('success', () => resolve(true));
            request.addEventListener('error', () => reject(Error('An error occurred while deleting a storage.')));
        });
    }
    destroy() {
        if (this._database) {
            this._database.removeEventListener('close', this._onCloseHandler);
            this._database.removeEventListener('versionchange', this._onCloseHandler);
            this._database.close();
        }
        this._database = null;
        this._connected = false;
    }
}

class IndexedDbStore {
    constructor(nameOrOptions) {
        const options = typeof nameOrOptions === 'string'
            ? { name: nameOrOptions }
            : nameOrOptions;
        this._db = new IndexedDbDatabase(options.name, options.version ?? 1, options.storeNames ?? [
            'font', 'video', 'music', 'sound', 'image', 'texture',
            'text', 'svg', 'json', 'binary', 'wasm', 'vtt',
        ], options.migrations);
    }
    async load(storageName, key) {
        return this._db.load(storageName, key);
    }
    async save(storageName, key, data) {
        return this._db.save(storageName, key, data);
    }
    async delete(storageName, key) {
        return this._db.delete(storageName, key);
    }
    async clear(storageName) {
        return this._db.clearStorage(storageName);
    }
    destroy() {
        this._db.destroy();
    }
}

export { AbstractAssetFactory, AbstractMedia, AbstractWebGl2BatchedRenderer, AbstractWebGl2Renderer, AbstractWebGpuRenderer, Application, ApplicationStatus, ArcadeStickGamepadMapping, AudioAnalyser, BinaryFactory, BlendModes, Bounds, BufferTypes, BufferUsage, CacheFirstStrategy, ChannelSize, Circle, CircleGeometry, Clock, Color, ColorAffector, Container, Drawable, DrawableShape, Ellipse, FactoryRegistry, Flags, FontFactory, ForceAffector, GameCubeGamepadMapping, Gamepad, GamepadChannel, GamepadControl, GamepadMapping, GamepadMappingFamily, GamepadPromptLayouts, GenericDualAnalogGamepadMapping, Geometry, Graphics, ImageFactory, IndexedDbDatabase, IndexedDbStore, Input, InputManager, Interval, JoyConLeftGamepadMapping, JoyConRightGamepadMapping, Json, JsonFactory, Keyboard, Line, Loader, Matrix, Music, MusicFactory, NetworkOnlyStrategy, ObservableSize, ObservableVector, Particle, ParticleOptions, ParticleSystem, PlayStationGamepadMapping, Pointer, PointerState, PointerStateFlag, PolarVector, Polygon, Quadtree, Random, Rectangle, RenderBackendType, RenderTarget, RenderTexture, RendererRegistry, RenderingPrimitives, Sampler, ScaleAffector, ScaleModes, Scene, SceneManager, SceneNode, Segment, Shader, ShaderAttribute, ShaderPrimitives, ShaderUniform, Signal, Size, Sound, SoundFactory, Sprite, SpriteFlags, Spritesheet, SteamControllerGamepadMapping, SvgAsset, SvgFactory, SwitchProGamepadMapping, Text, TextAsset, TextFactory, TextStyle, Texture, TextureFactory, Time, Timer, TorqueAffector, Transformable, TransformableFlags, UniversalEmitter, Vector, Video, VideoFactory, View, ViewFlags, VttAsset, VttFactory, WasmFactory, WebGl2ParticleRenderer, WebGl2PrimitiveRenderer, WebGl2RenderBuffer, WebGl2RenderManager, WebGl2ShaderBlock, WebGl2SpriteRenderer, WebGl2VertexArrayObject, WebGpuParticleRenderer, WebGpuPrimitiveRenderer, WebGpuRenderManager, WebGpuSpriteRenderer, WrapModes, XboxGamepadMapping, bezierCurveTo, buildCircle, buildEllipse, buildLine, buildPath, buildPolygon, buildRectangle, buildStar, builtInGamepadDefinitions, canvasSourceToDataUrl, clamp, createWebGl2ShaderRuntime, decodeAudioData, degreesPerRadian, degreesToRadians, determineMimeType, emptyArrayBuffer, getAudioContext, getCanvasSourceSize, getCollisionCircleCircle, getCollisionCircleRectangle, getCollisionPolygonCircle, getCollisionRectangleRectangle, getCollisionSat, getDistance, getOfflineAudioContext, getPreciseTime, getTextureSourceSize, getVoronoiRegion$1 as getVoronoiRegion, getWebGpuBlendState, hours, inRange, intersectionCircleCircle, intersectionCircleEllipse, intersectionCirclePoly, intersectionEllipseEllipse, intersectionEllipsePoly, intersectionLineCircle, intersectionLineEllipse, intersectionLineLine, intersectionLinePoly, intersectionLineRect, intersectionPointCircle, intersectionPointEllipse, intersectionPointLine, intersectionPointPoint, intersectionPointPoly, intersectionPointRect, intersectionPolyPoly, intersectionRectCircle, intersectionRectEllipse, intersectionRectPoly, intersectionRectRect, intersectionSat, isAudioContextReady, isPowerOfTwo, lerp, matchesIds, milliseconds, minutes, noop$1 as noop, normalizeIds, onAudioContextReady, parseGamepadDescriptor, quadraticCurveTo, radiansPerDegree, radiansToDegrees, rand, removeArrayItems, resolveDefinition, resolveGamepadDefinition, seconds, sign, stopEvent, supportsCodec, supportsEventOptions, supportsIndexedDb, supportsPointerEvents, supportsTouchEvents, supportsWebAudio, tau, trimRotation, webGl2PrimitiveArrayConstructors, webGl2PrimitiveByteSizeMapping, webGl2PrimitiveTypeNames };
//# sourceMappingURL=exo.esm.js.map
