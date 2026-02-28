var Exo = (function (exports) {
    'use strict';

    let temp = null;
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
            return new this.constructor(this._width, this._height);
        }
        equals({ width, height } = {}) {
            return (width === undefined || this.width === width)
                && (height === undefined || this.height === height);
        }
        destroy() {
            // todo - check if destroy is needed
        }
        static get temp() {
            if (temp === null) {
                temp = new Size();
            }
            return temp;
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

    let temp$1 = null;
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
            return new this.constructor(this._milliseconds);
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
            if (temp$1 === null) {
                temp$1 = new Time();
            }
            return temp$1;
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
    const internalAudioElement = document.createElement('audio');
    const internalCanvasElement = document.createElement('canvas');
    const internalCanvasContext = internalCanvasElement.getContext('2d');
    const internalRandom = new Random();
    const rand = (min, max) => internalRandom.next(min, max);
    const noop = () => { };
    const stopEvent = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
    };
    const supportsWebAudio = ('AudioContext' in window);
    const supportsIndexedDb = ('indexedDB' in window);
    const supportsTouchEvents = ('ontouchstart' in window);
    const supportsPointerEvents = ('PointerEvent' in window);
    const supportsEventOptions = (() => {
        let supportsPassive = false;
        try {
            window.addEventListener('test', noop, {
                get passive() {
                    supportsPassive = true;
                    return false;
                }
            });
        }
        catch (e) {
            // do nothing
        }
        return supportsPassive;
    })();
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
    const supportsCodec = (...codecs) => codecs.some((codec) => internalAudioElement.canPlayType(codec).replace(codecNotSupportedPattern, ''));
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
        internalCanvasElement.width = width;
        internalCanvasElement.height = height;
        internalCanvasContext.drawImage(source, 0, 0, width, height);
        return internalCanvasElement.toDataURL();
    };

    var earcut_1 = earcut;
    var _default = earcut;

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
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

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
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

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
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
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

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
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

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

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
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
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
            eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        outerNode = findHoleBridge(hole, outerNode);
        if (outerNode) {
            var b = splitPolygon(outerNode, hole);

            // filter collinear points around the cuts
            filterPoints(outerNode, outerNode.next);
            filterPoints(b, b.next);
        }
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
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

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
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
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
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

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
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
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
        this.z = null;

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
    earcut_1.default = _default;

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
    const sign$1 = (value) => (value && (value < 0 ? -1 : 1));
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
    const getVoronoiRegion = (line, point) => {
        const product = point.dot(line.x, line.y);
        if (product < 0) {
            return -1 /* left */;
        }
        else if (product > line.lengthSq) {
            return 1 /* right */;
        }
        else {
            return 0 /* middle */;
        }
    };

    let temp$2 = null;
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
            return new this.constructor(this.min, this.max);
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
            if (temp$2 === null) {
                temp$2 = new Interval();
            }
            return temp$2;
        }
    }
    Interval.zero = new Interval(0, 0);

    let temp$3 = null;
    class Rectangle {
        constructor(x = 0, y = x, width = 0, height = width) {
            this.collisionType = 2 /* rectangle */;
            this._normals = null;
            this._normalsDirty = false;
            this._position = new Vector(x, y);
            this._size = new Size(width, height);
        }
        get position() {
            return this._position;
        }
        set position(position) {
            this._position.copy(position);
            this._normalsDirty = true;
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
            return new this.constructor(this.x, this.y, this.width, this.height);
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
                    new Vector(),
                    new Vector(),
                    new Vector(),
                    new Vector(),
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
            const point = Vector.temp.set(this.left, this.top).transform(matrix);
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
            return intersectionPointRect(Vector.temp.set(x, y), this);
        }
        containsRect(rect) {
            return inRange(rect.left, this.left, this.right)
                && inRange(rect.right, this.left, this.right)
                && inRange(rect.top, this.top, this.bottom)
                && inRange(rect.bottom, this.top, this.bottom);
        }
        intersectsWith(target) {
            switch (target.collisionType) {
                case 6 /* sceneNode */:
                    return target.isAlignedBox
                        ? intersectionRectRect(this, target.getBounds())
                        : intersectionSat(this, target);
                case 2 /* rectangle */: return intersectionRectRect(this, target);
                case 5 /* polygon */: return intersectionRectPoly(this, target);
                case 3 /* circle */: return intersectionRectCircle(this, target);
                case 4 /* ellipse */: return intersectionRectEllipse(this, target);
                case 1 /* line */: return intersectionLineRect(target, this);
                case 0 /* point */: return intersectionPointRect(target, this);
                default: return false;
            }
        }
        collidesWith(target) {
            switch (target.collisionType) {
                case 6 /* sceneNode */:
                    return target.isAlignedBox
                        ? getCollisionRectangleRectangle(this, target.getBounds())
                        : getCollisionSat(this, target);
                case 2 /* rectangle */: return getCollisionRectangleRectangle(this, target);
                case 5 /* polygon */: return getCollisionSat(this, target);
                case 3 /* circle */: return getCollisionCircleRectangle(target, this, true);
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
            if (temp$3 === null) {
                temp$3 = new Rectangle();
            }
            return temp$3;
        }
    }

    let temp$4 = null;
    class Line {
        constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
            this.collisionType = 1 /* line */;
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
            return new this.constructor(this.fromX, this.fromY, this.toX, this.toY);
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
                case 6 /* sceneNode */: return intersectionLineRect(this, target.getBounds());
                case 2 /* rectangle */: return intersectionLineRect(this, target);
                case 5 /* polygon */: return intersectionLinePoly(this, target);
                case 3 /* circle */: return intersectionLineCircle(this, target);
                case 4 /* ellipse */: return intersectionLineEllipse(this, target);
                case 1 /* line */: return intersectionLineLine(this, target);
                case 0 /* point */: return intersectionPointLine(target, this);
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
            if (temp$4 === null) {
                temp$4 = new Line();
            }
            return temp$4;
        }
    }

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
    const intersectionPointPoint = ({ x: x1, y: y1 }, { x: x2, y: y2 }, threshold = 0) => (getDistance(x1, y1, x2, y2) <= threshold);
    const intersectionPointLine = ({ x, y }, { fromX, fromY, toX, toY }, threshold = 0.1) => {
        const d1 = getDistance(x, y, fromX, fromY);
        const d2 = getDistance(x, y, toX, toY);
        const d3 = getDistance(fromX, fromY, toX, toY);
        return (d1 + d2) >= (d3 - threshold)
            && (d1 + d2) <= (d3 + threshold);
    };
    const intersectionPointRect = ({ x: x1, y: y1 }, { x: x2, y: y2, width, height }) => (inRange(x1, x2, x2 + width) && inRange(y1, y2, y2 + height));
    const intersectionPointCircle = ({ x: x1, y: y1 }, { x: x2, y: y2, radius }) => (radius > 0 && getDistance(x1, y1, x2, y2) <= radius);
    const intersectionPointEllipse = ({ x: x1, y: y1 }, { x: x2, y: y2, rx, ry }) => {
        if (rx <= 0 || ry <= 0) {
            return false;
        }
        const normX = (x1 - x2) / rx;
        const normY = (y1 - y2) / ry;
        return ((normX * normX) + (normY * normY)) <= 1;
    };
    const intersectionPointPoly = ({ x, y }, { points }) => {
        const len = points.length;
        let inside = false;
        for (let curr = 0, prev = len - 1; curr < len; prev = curr++) {
            const { x: prevX, y: prevY } = points[prev];
            const { x: currX, y: currY } = points[curr];
            if (((currY > y) !== (prevY > y)) && (x < ((prevX - currX) * ((y - currY) / (prevY - currY))) + currX)) {
                inside = !inside;
            }
        }
        return inside;
    };
    const intersectionLineLine = ({ fromX: x1, fromY: y1, toX: x2, toY: y2 }, { fromX: x3, fromY: y3, toX: x4, toY: y4 }) => {
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return uA >= 0 && uA <= 1
            && uB >= 0 && uB <= 1;
    };
    const intersectionLineRect = (line, { x, y, width, height }) => {
        return intersectionLineLine(line, Line.temp.set(x, y, x, y + height))
            || intersectionLineLine(line, Line.temp.set(x + width, y, x + width, y + height))
            || intersectionLineLine(line, Line.temp.set(x, y, x + width, y))
            || intersectionLineLine(line, Line.temp.set(x, y + height, x + width, y + height));
    };
    const intersectionLineCircle = (line, circle) => {
        if (intersectionPointCircle(line.fromPosition, circle) || intersectionPointCircle(line.toPosition, circle)) {
            return true;
        }
        const { fromX: x1, fromY: y1, toX: x2, toY: y2 } = line;
        const { x: cx, y: cy, radius } = circle;
        const len = getDistance(x1, y1, x2, y2);
        const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / (len * len);
        const closestX = x1 + (dot * (x2 - x1));
        const closestY = y1 + (dot * (y2 - y1));
        if (!intersectionPointLine(Vector.temp.set(closestX, closestY), line)) {
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
        if (a <= epsilon) {
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
    const intersectionLinePoly = (line, { points }) => {
        const len = points.length;
        for (let i = 0; i < len; i++) {
            const curr = points[i];
            const next = points[(i + 1) % len];
            if (intersectionLineLine(line, Line.temp.set(curr.x, curr.y, next.x, next.y))) {
                return true;
            }
        }
        return false;
    };
    const intersectionRectRect = ({ x: x1, y: y1, width: w1, height: h1 }, { x: x2, y: y2, width: w2, height: h2 }) => {
        if (x2 > (x1 + w1) || y2 > (y1 + h1)) {
            return false;
        }
        if (x1 > (x2 + w2) || y1 > (y2 + h2)) {
            return false;
        }
        return true;
    };
    const intersectionRectCircle = ({ x: rx, y: ry, width, height }, { x: cx, y: cy, radius }) => {
        const distX = clamp(cx, rx, rx + width);
        const distY = clamp(cy, ry, ry + height);
        return getDistance(cx, cy, distX, distY) <= radius;
    };
    const intersectionRectEllipse = (rectangle, ellipse) => {
        return polygonsIntersect(buildRectanglePoints(rectangle), buildEllipsePoints(ellipse));
    };
    const intersectionRectPoly = (rectangle, polygon) => intersectionSat(rectangle, polygon);
    const intersectionCircleCircle = ({ x: x1, y: y1, radius: r1 }, { x: x2, y: y2, radius: r2 }) => {
        return getDistance(x1, y1, x2, y2) <= (r1 + r2);
    };
    const intersectionCircleEllipse = (circle, ellipse) => {
        return polygonsIntersect(buildCirclePoints(circle), buildEllipsePoints(ellipse));
    };
    const excludeLeftVoronoi = (circlePos, prevPoint, prevEdge, point, radius, edge) => {
        if (getVoronoiRegion(edge, point) !== -1 /* left */) {
            return false;
        }
        const point2 = circlePos.clone().subtract(prevPoint.x, prevPoint.y);
        const region = getVoronoiRegion(prevEdge, point2);
        return region === 1 /* right */ && point.length > radius;
    };
    const excludeRightVoronoi = (circlePos, nextPoint, nextEdge, point, radius, edge) => {
        if (getVoronoiRegion(edge, point) !== 1 /* right */) {
            return false;
        }
        const point2 = circlePos.clone().subtract(nextEdge.x, nextEdge.y);
        const region = getVoronoiRegion(nextEdge, point2);
        return region === -1 /* left */ && point.length > radius;
    };
    const excludeMiddleVoronoi = (currentPoint, currentEdge, radius) => {
        const normal = currentEdge.clone().rperp().normalize();
        const dist = currentPoint.dot(normal.x, normal.y);
        return (dist > 0) && Math.abs(dist) > radius;
    };
    const intersectionCirclePoly = ({ x: cx, y: cy, radius }, { x: px, y: py, points, edges }) => {
        const circlePos = new Vector((px - cx), (py - cy));
        const len = points.length;
        for (let i = 0; i < len; i++) {
            const point = Vector.subtract(circlePos, points[i]);
            const prev = i === 0 ? len - 1 : i - 1;
            const next = (i + 1) % len;
            if (excludeLeftVoronoi(circlePos, points[prev], edges[prev], point, radius, edges[i])) {
                return false;
            }
            if (excludeRightVoronoi(circlePos, points[next], edges[next], point, radius, edges[i])) {
                return false;
            }
            if (excludeMiddleVoronoi(point, edges[i], radius)) {
                return false;
            }
        }
        return true;
    };
    const intersectionEllipseEllipse = (ellipseA, ellipseB) => {
        return polygonsIntersect(buildEllipsePoints(ellipseA), buildEllipsePoints(ellipseB));
    };
    const intersectionEllipsePoly = (ellipse, polygon) => {
        return polygonsIntersect(buildEllipsePoints(ellipse), buildPolygonWorldPoints(polygon));
    };
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
        return {
            shapeA: rectA,
            shapeB: rectB,
            overlap: 0,
            shapeAinB: rectB.containsRect(rectA),
            shapeBinA: rectA.containsRect(rectB),
            projectionN: new Vector(),
            projectionV: new Vector(),
        };
    };
    const getCollisionCircleCircle = (circleA, circleB) => {
        const difference = new Vector(circleB.x - circleA.x, circleB.y - circleA.y), distance = difference.length, overlap = (circleA.radius + circleB.radius) - distance;
        if (overlap < 0) {
            return null;
        }
        return {
            shapeA: circleA,
            shapeB: circleB,
            overlap: overlap,
            shapeAinB: (circleA.radius <= circleB.radius) && (distance <= (circleB.radius - circleA.radius)),
            shapeBinA: (circleB.radius <= circleA.radius) && (distance <= (circleA.radius - circleB.radius)),
            projectionN: difference.normalize(),
            projectionV: difference.multiply(overlap),
        };
    };
    const getCollisionCircleRectangle = (circle, rect, swap = false) => {
        const radius = circle.radius, centerWidth = rect.width / 2, centerHeight = rect.height / 2, distance = getDistance(circle.x, circle.y, rect.x - centerWidth, rect.y - centerHeight), containsA = (radius <= Math.min(centerWidth, centerHeight)) && (distance <= (Math.min(centerWidth, centerHeight) - radius)), containsB = (Math.max(centerWidth, centerHeight) <= radius) && (distance <= (radius - Math.max(centerWidth, centerHeight)));
        if (distance > circle.radius) {
            return null;
        }
        return {
            shapeA: swap ? rect : circle,
            shapeB: swap ? circle : rect,
            overlap: radius - distance,
            shapeAinB: swap ? containsB : containsA,
            shapeBinA: swap ? containsA : containsB,
            projectionN: new Vector(),
            projectionV: new Vector(),
        };
    };
    const getCollisionPolygonCircle = (polygon, circle, swap = false) => {
        const radius = circle.radius;
        const points = polygon.points;
        const x = (circle.x - polygon.x);
        const y = (circle.y - polygon.y);
        const projection = new Vector();
        const positionA = new Vector();
        const positionB = new Vector();
        const edgeA = new Vector();
        const edgeB = new Vector();
        const len = points.length;
        let containsA = true, containsB = true, overlap = 0;
        for (let i = 0; i < len; i++) {
            const pointA = points[i], pointB = points[(i + 1) % len], region = getVoronoiRegion(edgeA.set(pointB.x - pointA.x, pointB.y - pointA.y), positionA.set(x - pointA.x, y - pointA.y));
            if (positionA.length > radius) {
                containsA = false;
            }
            if (region === -1 /* left */) {
                const prev = points[(i === 0 ? len - 1 : i - 1)];
                edgeB.set(pointA.x - prev.x, pointA.y - prev.y);
                positionB.set(x - prev.x, y - prev.y);
                if ((getVoronoiRegion(edgeB, positionB) === 1 /* right */)) {
                    const distance = positionA.length;
                    if (distance > radius) {
                        return null;
                    }
                    if (Math.abs(radius - distance) < Math.abs(overlap)) {
                        overlap = radius - distance;
                        projection.copy(positionA).normalize();
                    }
                    containsB = false;
                }
            }
            else if (region === 1 /* right */) {
                const next = points[(i + 2) % len]; // pointB ?
                edgeB.set(next.x - pointB.x, next.y - pointB.y); // edgeB.set(pointB.x - pointA.x, pointB.y - pointA.y); ?
                positionB.set(x - pointB.x, y - pointB.y); // positionB.set(x - pointB.x, y - pointB.y); ?
                if (getVoronoiRegion(edgeB, positionB) === -1 /* left */) {
                    const distance = positionB.length;
                    if (distance > radius) {
                        return null;
                    }
                    if (Math.abs(radius - distance) < Math.abs(overlap)) {
                        overlap = radius - distance;
                        projection.copy(positionB).normalize();
                    }
                    containsB = false;
                }
            }
            else {
                const normal = edgeA.rperp().normalize();
                const distance = positionA.dot(normal.x, normal.y);
                if (distance > 0 && (Math.abs(distance) > radius)) {
                    return null;
                }
                if (distance >= 0 || (radius - distance) < (2 * radius)) {
                    containsB = false;
                }
                if (Math.abs(radius - distance) < Math.abs(overlap)) {
                    overlap = radius - distance;
                    projection.copy(normal);
                }
            }
        }
        return {
            shapeA: swap ? circle : polygon,
            shapeB: swap ? polygon : circle,
            overlap: overlap,
            shapeAinB: swap ? containsB : containsA,
            shapeBinA: swap ? containsA : containsB,
            projectionN: projection,
            projectionV: projection.multiply(overlap),
        };
    };
    const getCollisionSat = (shapeA, shapeB) => {
        const projection = new Vector();
        const normalsA = shapeA.getNormals();
        const normalsB = shapeB.getNormals();
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
        return {
            shapeA,
            shapeB,
            overlap,
            shapeAinB,
            shapeBinA,
            projectionN: projection,
            projectionV: projection.clone().multiply(overlap, overlap),
        };
    };

    let temp$5 = null;
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
    class Vector extends AbstractVector {
        constructor(x = 0, y = 0) {
            super();
            this.collisionType = 0 /* point */;
            this.x = x;
            this.y = y;
        }
        clone() {
            return new this.constructor(this.x, this.y);
        }
        copy(vector) {
            this.x = vector.x;
            this.y = vector.y;
            return this;
        }
        intersectsWith(target) {
            switch (target.collisionType) {
                case 6 /* sceneNode */: return intersectionPointRect(this, target.getBounds());
                case 2 /* rectangle */: return intersectionPointRect(this, target);
                case 5 /* polygon */: return intersectionPointPoly(this, target);
                case 3 /* circle */: return intersectionPointCircle(this, target);
                case 4 /* ellipse */: return intersectionPointEllipse(this, target);
                case 1 /* line */: return intersectionPointLine(this, target);
                case 0 /* point */: return intersectionPointPoint(this, target);
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
            if (temp$5 === null) {
                temp$5 = new Vector();
            }
            return temp$5;
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
        const index = vertices.length / 6, length = points.length / 2, triangles = earcut_1(points, [], 2);
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
        return 'text/plain';
    };

    class Signal {
        constructor() {
            this.bindings = new Array();
        }
        has(handler, context) {
            return this.bindings.some((binding) => (binding.handler === handler && binding.context === context));
        }
        add(handler, context) {
            if (!this.has(handler, context)) {
                this.bindings.push({ handler, context });
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
            const index = this.bindings.findIndex((binding) => (binding.handler === handler && binding.context === context));
            if (index !== -1) {
                removeArrayItems(this.bindings, index, 1);
            }
            return this;
        }
        clearByContext(context) {
            const bindings = this.bindings.filter(binding => binding.context === context);
            for (const binding of bindings) {
                removeArrayItems(this.bindings, this.bindings.indexOf(binding), 1);
            }
            return this;
        }
        clear() {
            this.bindings.length = 0;
            return this;
        }
        dispatch(...params) {
            if (this.bindings.length) {
                for (const binding of this.bindings) {
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

    const internalAudioContext = new AudioContext();
    const internalOfflineAudioContext = new OfflineAudioContext(1, 2, internalAudioContext.sampleRate);
    const onAudioContextReady = new Signal();
    const getAudioContext = () => internalAudioContext;
    const isAudioContextReady = () => internalAudioContext.state === 'running';
    const getOfflineAudioContext = () => internalOfflineAudioContext;
    const decodeAudioData = async (arrayBuffer) => internalOfflineAudioContext.decodeAudioData(arrayBuffer);
    const onUserInteraction = () => {
        document.removeEventListener('mousedown', onUserInteraction, false);
        document.removeEventListener('touchstart', onUserInteraction, false);
        document.removeEventListener('touchend', onUserInteraction, false);
        if (isAudioContextReady()) {
            onAudioContextReady.dispatch(internalAudioContext);
        }
        else {
            internalAudioContext.resume().then(() => onAudioContextReady.dispatch(internalAudioContext));
        }
    };
    document.addEventListener('mousedown', onUserInteraction, false);
    document.addEventListener('touchstart', onUserInteraction, false);
    document.addEventListener('touchend', onUserInteraction, false);

    (function (ChannelSize) {
        ChannelSize[ChannelSize["container"] = 768] = "container";
        ChannelSize[ChannelSize["category"] = 256] = "category";
        ChannelSize[ChannelSize["gamepad"] = 64] = "gamepad";
    })(exports.ChannelSize || (exports.ChannelSize = {}));
    (function (Keyboard) {
        Keyboard[Keyboard["backspace"] = 8] = "backspace";
        Keyboard[Keyboard["tab"] = 9] = "tab";
        Keyboard[Keyboard["clear"] = 12] = "clear";
        Keyboard[Keyboard["enter"] = 13] = "enter";
        Keyboard[Keyboard["shift"] = 16] = "shift";
        Keyboard[Keyboard["control"] = 17] = "control";
        Keyboard[Keyboard["alt"] = 18] = "alt";
        Keyboard[Keyboard["pause"] = 19] = "pause";
        Keyboard[Keyboard["capsLock"] = 20] = "capsLock";
        Keyboard[Keyboard["escape"] = 27] = "escape";
        Keyboard[Keyboard["space"] = 32] = "space";
        Keyboard[Keyboard["pageUp"] = 33] = "pageUp";
        Keyboard[Keyboard["pageDown"] = 34] = "pageDown";
        Keyboard[Keyboard["end"] = 35] = "end";
        Keyboard[Keyboard["home"] = 36] = "home";
        Keyboard[Keyboard["left"] = 37] = "left";
        Keyboard[Keyboard["up"] = 38] = "up";
        Keyboard[Keyboard["right"] = 39] = "right";
        Keyboard[Keyboard["down"] = 40] = "down";
        Keyboard[Keyboard["insert"] = 45] = "insert";
        Keyboard[Keyboard["delete"] = 46] = "delete";
        Keyboard[Keyboard["help"] = 47] = "help";
        Keyboard[Keyboard["zero"] = 48] = "zero";
        Keyboard[Keyboard["one"] = 49] = "one";
        Keyboard[Keyboard["two"] = 50] = "two";
        Keyboard[Keyboard["three"] = 51] = "three";
        Keyboard[Keyboard["four"] = 52] = "four";
        Keyboard[Keyboard["five"] = 53] = "five";
        Keyboard[Keyboard["six"] = 54] = "six";
        Keyboard[Keyboard["seven"] = 55] = "seven";
        Keyboard[Keyboard["eight"] = 56] = "eight";
        Keyboard[Keyboard["nine"] = 57] = "nine";
        Keyboard[Keyboard["a"] = 65] = "a";
        Keyboard[Keyboard["b"] = 66] = "b";
        Keyboard[Keyboard["c"] = 67] = "c";
        Keyboard[Keyboard["d"] = 68] = "d";
        Keyboard[Keyboard["e"] = 69] = "e";
        Keyboard[Keyboard["f"] = 70] = "f";
        Keyboard[Keyboard["g"] = 71] = "g";
        Keyboard[Keyboard["h"] = 72] = "h";
        Keyboard[Keyboard["i"] = 73] = "i";
        Keyboard[Keyboard["j"] = 74] = "j";
        Keyboard[Keyboard["k"] = 75] = "k";
        Keyboard[Keyboard["l"] = 76] = "l";
        Keyboard[Keyboard["m"] = 77] = "m";
        Keyboard[Keyboard["n"] = 78] = "n";
        Keyboard[Keyboard["o"] = 79] = "o";
        Keyboard[Keyboard["p"] = 80] = "p";
        Keyboard[Keyboard["q"] = 81] = "q";
        Keyboard[Keyboard["r"] = 82] = "r";
        Keyboard[Keyboard["s"] = 83] = "s";
        Keyboard[Keyboard["t"] = 84] = "t";
        Keyboard[Keyboard["u"] = 85] = "u";
        Keyboard[Keyboard["v"] = 86] = "v";
        Keyboard[Keyboard["w"] = 87] = "w";
        Keyboard[Keyboard["x"] = 88] = "x";
        Keyboard[Keyboard["y"] = 89] = "y";
        Keyboard[Keyboard["z"] = 90] = "z";
        Keyboard[Keyboard["numPad0"] = 96] = "numPad0";
        Keyboard[Keyboard["numPad1"] = 97] = "numPad1";
        Keyboard[Keyboard["numPad2"] = 98] = "numPad2";
        Keyboard[Keyboard["numPad3"] = 99] = "numPad3";
        Keyboard[Keyboard["numPad4"] = 100] = "numPad4";
        Keyboard[Keyboard["numPad5"] = 101] = "numPad5";
        Keyboard[Keyboard["numPad6"] = 102] = "numPad6";
        Keyboard[Keyboard["numPad7"] = 103] = "numPad7";
        Keyboard[Keyboard["numPad8"] = 104] = "numPad8";
        Keyboard[Keyboard["numPad9"] = 105] = "numPad9";
        Keyboard[Keyboard["numPadMultiply"] = 106] = "numPadMultiply";
        Keyboard[Keyboard["numPadAdd"] = 107] = "numPadAdd";
        Keyboard[Keyboard["numPadEnter"] = 108] = "numPadEnter";
        Keyboard[Keyboard["numPadSubtract"] = 109] = "numPadSubtract";
        Keyboard[Keyboard["numPadDecimal"] = 110] = "numPadDecimal";
        Keyboard[Keyboard["numPadDivide"] = 111] = "numPadDivide";
        Keyboard[Keyboard["f1"] = 112] = "f1";
        Keyboard[Keyboard["f2"] = 113] = "f2";
        Keyboard[Keyboard["f3"] = 114] = "f3";
        Keyboard[Keyboard["f4"] = 115] = "f4";
        Keyboard[Keyboard["f5"] = 116] = "f5";
        Keyboard[Keyboard["f6"] = 117] = "f6";
        Keyboard[Keyboard["f7"] = 118] = "f7";
        Keyboard[Keyboard["f8"] = 119] = "f8";
        Keyboard[Keyboard["f9"] = 120] = "f9";
        Keyboard[Keyboard["f10"] = 121] = "f10";
        Keyboard[Keyboard["f11"] = 122] = "f11";
        Keyboard[Keyboard["f12"] = 123] = "f12";
        Keyboard[Keyboard["numLock"] = 144] = "numLock";
        Keyboard[Keyboard["scrollLock"] = 145] = "scrollLock";
        Keyboard[Keyboard["colon"] = 186] = "colon";
        Keyboard[Keyboard["equals"] = 187] = "equals";
        Keyboard[Keyboard["comma"] = 188] = "comma";
        Keyboard[Keyboard["dash"] = 189] = "dash";
        Keyboard[Keyboard["period"] = 190] = "period";
        Keyboard[Keyboard["questionMark"] = 191] = "questionMark";
        Keyboard[Keyboard["tilde"] = 192] = "tilde";
        Keyboard[Keyboard["openBracket"] = 219] = "openBracket";
        Keyboard[Keyboard["backwardSlash"] = 220] = "backwardSlash";
        Keyboard[Keyboard["closedBracket"] = 221] = "closedBracket";
        Keyboard[Keyboard["quotes"] = 222] = "quotes";
    })(exports.Keyboard || (exports.Keyboard = {}));

    (function (BlendModes) {
        BlendModes[BlendModes["normal"] = 0] = "normal";
        BlendModes[BlendModes["additive"] = 1] = "additive";
        BlendModes[BlendModes["subtract"] = 2] = "subtract";
        BlendModes[BlendModes["multiply"] = 3] = "multiply";
        BlendModes[BlendModes["screen"] = 4] = "screen";
    })(exports.BlendModes || (exports.BlendModes = {}));
    (function (ScaleModes) {
        ScaleModes[ScaleModes["NEAREST"] = 9728] = "NEAREST";
        ScaleModes[ScaleModes["LINEAR"] = 9729] = "LINEAR";
        ScaleModes[ScaleModes["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
        ScaleModes[ScaleModes["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
        ScaleModes[ScaleModes["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
        ScaleModes[ScaleModes["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
    })(exports.ScaleModes || (exports.ScaleModes = {}));
    (function (WrapModes) {
        WrapModes[WrapModes["REPEAT"] = 10497] = "REPEAT";
        WrapModes[WrapModes["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
        WrapModes[WrapModes["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    })(exports.WrapModes || (exports.WrapModes = {}));
    (function (RenderingPrimitives) {
        RenderingPrimitives[RenderingPrimitives["POINTS"] = 0] = "POINTS";
        RenderingPrimitives[RenderingPrimitives["LINES"] = 1] = "LINES";
        RenderingPrimitives[RenderingPrimitives["LINE_LOOP"] = 2] = "LINE_LOOP";
        RenderingPrimitives[RenderingPrimitives["LINE_STRIP"] = 3] = "LINE_STRIP";
        RenderingPrimitives[RenderingPrimitives["TRIANGLES"] = 4] = "TRIANGLES";
        RenderingPrimitives[RenderingPrimitives["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        RenderingPrimitives[RenderingPrimitives["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(exports.RenderingPrimitives || (exports.RenderingPrimitives = {}));
    (function (BufferTypes) {
        BufferTypes[BufferTypes["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
        BufferTypes[BufferTypes["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
        BufferTypes[BufferTypes["COPY_READ_BUFFER"] = 36662] = "COPY_READ_BUFFER";
        BufferTypes[BufferTypes["COPY_WRITE_BUFFER"] = 36663] = "COPY_WRITE_BUFFER";
        BufferTypes[BufferTypes["TRANSFORM_FEEDBACK_BUFFER"] = 35982] = "TRANSFORM_FEEDBACK_BUFFER";
        BufferTypes[BufferTypes["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
        BufferTypes[BufferTypes["PIXEL_PACK_BUFFER"] = 35051] = "PIXEL_PACK_BUFFER";
        BufferTypes[BufferTypes["PIXEL_UNPACK_BUFFER"] = 35052] = "PIXEL_UNPACK_BUFFER";
    })(exports.BufferTypes || (exports.BufferTypes = {}));
    (function (BufferUsage) {
        BufferUsage[BufferUsage["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
        BufferUsage[BufferUsage["STATIC_READ"] = 35045] = "STATIC_READ";
        BufferUsage[BufferUsage["STATIC_COPY"] = 35046] = "STATIC_COPY";
        BufferUsage[BufferUsage["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
        BufferUsage[BufferUsage["DYNAMIC_READ"] = 35049] = "DYNAMIC_READ";
        BufferUsage[BufferUsage["DYNAMIC_COPY"] = 35050] = "DYNAMIC_COPY";
        BufferUsage[BufferUsage["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
        BufferUsage[BufferUsage["STREAM_READ"] = 35041] = "STREAM_READ";
        BufferUsage[BufferUsage["STREAM_COPY"] = 35042] = "STREAM_COPY";
    })(exports.BufferUsage || (exports.BufferUsage = {}));
    (function (ShaderPrimitives) {
        ShaderPrimitives[ShaderPrimitives["INT"] = 5124] = "INT";
        ShaderPrimitives[ShaderPrimitives["INT_VEC2"] = 35667] = "INT_VEC2";
        ShaderPrimitives[ShaderPrimitives["INT_VEC3"] = 35668] = "INT_VEC3";
        ShaderPrimitives[ShaderPrimitives["INT_VEC4"] = 35669] = "INT_VEC4";
        ShaderPrimitives[ShaderPrimitives["FLOAT"] = 5126] = "FLOAT";
        ShaderPrimitives[ShaderPrimitives["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
        ShaderPrimitives[ShaderPrimitives["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
        ShaderPrimitives[ShaderPrimitives["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
        ShaderPrimitives[ShaderPrimitives["BOOL"] = 35670] = "BOOL";
        ShaderPrimitives[ShaderPrimitives["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
        ShaderPrimitives[ShaderPrimitives["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
        ShaderPrimitives[ShaderPrimitives["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
        ShaderPrimitives[ShaderPrimitives["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
        ShaderPrimitives[ShaderPrimitives["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
        ShaderPrimitives[ShaderPrimitives["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
        ShaderPrimitives[ShaderPrimitives["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
    })(exports.ShaderPrimitives || (exports.ShaderPrimitives = {}));
    const primitiveByteSizeMapping = {
        [exports.ShaderPrimitives.FLOAT]: 1,
        [exports.ShaderPrimitives.FLOAT_VEC2]: 2,
        [exports.ShaderPrimitives.FLOAT_VEC3]: 3,
        [exports.ShaderPrimitives.FLOAT_VEC4]: 4,
        [exports.ShaderPrimitives.INT]: 1,
        [exports.ShaderPrimitives.INT_VEC2]: 2,
        [exports.ShaderPrimitives.INT_VEC3]: 3,
        [exports.ShaderPrimitives.INT_VEC4]: 4,
        [exports.ShaderPrimitives.BOOL]: 1,
        [exports.ShaderPrimitives.BOOL_VEC2]: 2,
        [exports.ShaderPrimitives.BOOL_VEC3]: 3,
        [exports.ShaderPrimitives.BOOL_VEC4]: 4,
        [exports.ShaderPrimitives.FLOAT_MAT2]: 4,
        [exports.ShaderPrimitives.FLOAT_MAT3]: 9,
        [exports.ShaderPrimitives.FLOAT_MAT4]: 16,
        [exports.ShaderPrimitives.SAMPLER_2D]: 1,
    };
    const primitiveArrayConstructors = {
        [exports.ShaderPrimitives.FLOAT]: Float32Array,
        [exports.ShaderPrimitives.FLOAT_VEC2]: Float32Array,
        [exports.ShaderPrimitives.FLOAT_VEC3]: Float32Array,
        [exports.ShaderPrimitives.FLOAT_VEC4]: Float32Array,
        [exports.ShaderPrimitives.INT]: Int32Array,
        [exports.ShaderPrimitives.INT_VEC2]: Int32Array,
        [exports.ShaderPrimitives.INT_VEC3]: Int32Array,
        [exports.ShaderPrimitives.INT_VEC4]: Int32Array,
        [exports.ShaderPrimitives.BOOL]: Uint8Array,
        [exports.ShaderPrimitives.BOOL_VEC2]: Uint8Array,
        [exports.ShaderPrimitives.BOOL_VEC3]: Uint8Array,
        [exports.ShaderPrimitives.BOOL_VEC4]: Uint8Array,
        [exports.ShaderPrimitives.FLOAT_MAT2]: Float32Array,
        [exports.ShaderPrimitives.FLOAT_MAT3]: Float32Array,
        [exports.ShaderPrimitives.FLOAT_MAT4]: Float32Array,
        [exports.ShaderPrimitives.SAMPLER_2D]: Uint8Array,
    };
    const primitiveUploadFunctions = {
        [exports.ShaderPrimitives.FLOAT]: (gl, location, value) => gl.uniform1f(location, value[0]),
        [exports.ShaderPrimitives.FLOAT_VEC2]: (gl, location, value) => gl.uniform2fv(location, value),
        [exports.ShaderPrimitives.FLOAT_VEC3]: (gl, location, value) => gl.uniform3fv(location, value),
        [exports.ShaderPrimitives.FLOAT_VEC4]: (gl, location, value) => gl.uniform4fv(location, value),
        [exports.ShaderPrimitives.INT]: (gl, location, value) => gl.uniform1i(location, value[0]),
        [exports.ShaderPrimitives.INT_VEC2]: (gl, location, value) => gl.uniform2iv(location, value),
        [exports.ShaderPrimitives.INT_VEC3]: (gl, location, value) => gl.uniform3iv(location, value),
        [exports.ShaderPrimitives.INT_VEC4]: (gl, location, value) => gl.uniform4iv(location, value),
        [exports.ShaderPrimitives.BOOL]: (gl, location, value) => gl.uniform1i(location, value[0]),
        [exports.ShaderPrimitives.BOOL_VEC2]: (gl, location, value) => gl.uniform2iv(location, value),
        [exports.ShaderPrimitives.BOOL_VEC3]: (gl, location, value) => gl.uniform3iv(location, value),
        [exports.ShaderPrimitives.BOOL_VEC4]: (gl, location, value) => gl.uniform4iv(location, value),
        [exports.ShaderPrimitives.FLOAT_MAT2]: (gl, location, value) => gl.uniformMatrix2fv(location, false, value),
        [exports.ShaderPrimitives.FLOAT_MAT3]: (gl, location, value) => gl.uniformMatrix3fv(location, false, value),
        [exports.ShaderPrimitives.FLOAT_MAT4]: (gl, location, value) => gl.uniformMatrix4fv(location, false, value),
        [exports.ShaderPrimitives.SAMPLER_2D]: (gl, location, value) => gl.uniform1i(location, value[0]),
    };
    const primitiveTypeNames = {
        [exports.ShaderPrimitives.FLOAT]: 'FLOAT',
        [exports.ShaderPrimitives.FLOAT_VEC2]: 'FLOAT_VEC2',
        [exports.ShaderPrimitives.FLOAT_VEC3]: 'FLOAT_VEC3',
        [exports.ShaderPrimitives.FLOAT_VEC4]: 'FLOAT_VEC4',
        [exports.ShaderPrimitives.INT]: 'INT',
        [exports.ShaderPrimitives.INT_VEC2]: 'INT_VEC2',
        [exports.ShaderPrimitives.INT_VEC3]: 'INT_VEC3',
        [exports.ShaderPrimitives.INT_VEC4]: 'INT_VEC4',
        [exports.ShaderPrimitives.BOOL]: 'BOOL',
        [exports.ShaderPrimitives.BOOL_VEC2]: 'BOOL_VEC2',
        [exports.ShaderPrimitives.BOOL_VEC3]: 'BOOL_VEC3',
        [exports.ShaderPrimitives.BOOL_VEC4]: 'BOOL_VEC4',
        [exports.ShaderPrimitives.FLOAT_MAT2]: 'FLOAT_MAT2',
        [exports.ShaderPrimitives.FLOAT_MAT3]: 'FLOAT_MAT3',
        [exports.ShaderPrimitives.FLOAT_MAT4]: 'FLOAT_MAT4',
        [exports.ShaderPrimitives.SAMPLER_2D]: 'SAMPLER_2D',
    };

    (function (ResourceTypes) {
        ResourceTypes["font"] = "font";
        ResourceTypes["video"] = "video";
        ResourceTypes["music"] = "music";
        ResourceTypes["sound"] = "sound";
        ResourceTypes["image"] = "image";
        ResourceTypes["texture"] = "texture";
        ResourceTypes["text"] = "text";
        ResourceTypes["json"] = "json";
        ResourceTypes["svg"] = "svg";
    })(exports.ResourceTypes || (exports.ResourceTypes = {}));
    (function (StorageNames) {
        StorageNames["font"] = "font";
        StorageNames["video"] = "video";
        StorageNames["music"] = "music";
        StorageNames["sound"] = "sound";
        StorageNames["image"] = "image";
        StorageNames["text"] = "text";
        StorageNames["json"] = "json";
    })(exports.StorageNames || (exports.StorageNames = {}));

    class AbstractMedia {
        constructor(initialState) {
            this.onStart = new Signal();
            this.onStop = new Signal();
            this._audioContext = null;
            const { duration, volume, playbackRate, loop, muted } = initialState;
            this._duration = duration;
            this._volume = volume;
            this._playbackRate = playbackRate;
            this._loop = loop;
            this._muted = muted;
        }
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
            if (scene !== this._scene) {
                this._unloadScene();
                this._scene = scene;
                this.onChangeScene.dispatch(scene);
                if (scene !== null) {
                    scene.app = this._app;
                    await scene.load(this._app.loader);
                    scene.init(await this._app.loader.load());
                    this.onStartScene.dispatch(scene);
                }
            }
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
            this._unloadScene();
            this.onChangeScene.destroy();
            this.onStartScene.destroy();
            this.onUpdateScene.destroy();
            this.onStopScene.destroy();
        }
        _unloadScene() {
            if (this._scene !== null) {
                this.onStopScene.dispatch(this._scene);
                this._scene.unload();
                this._scene.destroy();
                this._scene = null;
            }
            return this;
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
         * @param {number} args The arguments.
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
            return new this.constructor(this._callback, this._x, this._y);
        }
        copy(vector) {
            return this.set(vector.x, vector.y);
        }
        destroy() {
            // todo - check if destroy is needed
        }
    }

    let temp$6 = null;
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
            return new this.constructor(this.a, this.b, this.x, this.c, this.d, this.y, this.e, this.f, this.z);
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
            if (temp$6 === null) {
                temp$6 = new Matrix();
            }
            return temp$6;
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
            return new this.constructor(this._callback, this._width, this._height);
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
        constructor(...flags) {
            this._value = 0;
            if (flags.length) {
                this.push(...flags);
            }
        }
        get value() {
            return this._value;
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

    (function (ViewFlags) {
        ViewFlags[ViewFlags["NONE"] = 0] = "NONE";
        ViewFlags[ViewFlags["TRANSLATION"] = 1] = "TRANSLATION";
        ViewFlags[ViewFlags["ROTATION"] = 2] = "ROTATION";
        ViewFlags[ViewFlags["SCALING"] = 4] = "SCALING";
        ViewFlags[ViewFlags["ORIGIN"] = 8] = "ORIGIN";
        ViewFlags[ViewFlags["TRANSFORM"] = 15] = "TRANSFORM";
        ViewFlags[ViewFlags["TRANSFORM_INV"] = 16] = "TRANSFORM_INV";
        ViewFlags[ViewFlags["BOUNDING_BOX"] = 32] = "BOUNDING_BOX";
        ViewFlags[ViewFlags["TEXTURE_COORDS"] = 64] = "TEXTURE_COORDS";
        ViewFlags[ViewFlags["VERTEX_TINT"] = 128] = "VERTEX_TINT";
    })(exports.ViewFlags || (exports.ViewFlags = {}));
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
            this._flags.push(exports.ViewFlags.TRANSFORM, exports.ViewFlags.TRANSFORM_INV, exports.ViewFlags.BOUNDING_BOX);
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
            this._flags.push(exports.ViewFlags.TRANSFORM);
            return this;
        }
        getTransform() {
            if (this._flags.has(exports.ViewFlags.TRANSFORM)) {
                this.updateTransform();
                this._flags.remove(exports.ViewFlags.TRANSFORM);
            }
            return this._transform;
        }
        updateTransform() {
            const x = 2 / this.width, y = -2 / this.height;
            if (this._flags.has(exports.ViewFlags.ROTATION)) {
                const radians = degreesToRadians(this._rotation);
                this._cos = Math.cos(radians);
                this._sin = Math.sin(radians);
            }
            if (this._flags.has(exports.ViewFlags.ROTATION | exports.ViewFlags.SCALING)) {
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
            if (this._flags.has(exports.ViewFlags.TRANSFORM_INV)) {
                this.getTransform()
                    .getInverse(this._inverseTransform);
                this._flags.remove(exports.ViewFlags.TRANSFORM_INV);
            }
            return this._inverseTransform;
        }
        getBounds() {
            if (this._flags.has(exports.ViewFlags.BOUNDING_BOX)) {
                this.updateBounds();
                this._flags.remove(exports.ViewFlags.BOUNDING_BOX);
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
            this._flags.push(exports.ViewFlags.TRANSFORM_INV, exports.ViewFlags.BOUNDING_BOX);
            this._updateId++;
        }
        _setPositionDirty() {
            this._flags.push(exports.ViewFlags.TRANSLATION);
            this._setDirty();
        }
        _setRotationDirty() {
            this._flags.push(exports.ViewFlags.ROTATION);
            this._setDirty();
        }
        _setScalingDirty() {
            this._flags.push(exports.ViewFlags.SCALING);
            this._setDirty();
        }
    }

    class RenderTarget {
        constructor(width, height, root = false) {
            this._context = null;
            this._framebuffer = null;
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
        connect(context) {
            if (!this._context) {
                this._context = context;
                this._framebuffer = this._root ? null : context.createFramebuffer();
            }
            return this;
        }
        disconnect() {
            this.unbindFramebuffer();
            if (this._context) {
                this._context.deleteFramebuffer(this._framebuffer);
                this._context = null;
                this._framebuffer = null;
            }
            return this;
        }
        bindFramebuffer() {
            if (!this._context) {
                throw new Error('Texture has to be connected first!');
            }
            const gl = this._context;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
            this.updateViewport();
            return this;
        }
        unbindFramebuffer() {
            if (this._context) {
                const gl = this._context;
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            return this;
        }
        setView(view) {
            this._view = view || this._defaultView;
            this.updateViewport();
            return this;
        }
        resize(width, height) {
            if (!this._size.equals({ width, height })) {
                this._size.set(width, height);
                this.updateViewport();
            }
            return this;
        }
        getViewport(view = this._view) {
            const { x, y, width, height } = view.viewport;
            return this._viewport.set(Math.round(x * this.width), Math.round(y * this.height), Math.round(width * this.width), Math.round(height * this.height));
        }
        updateViewport() {
            if (this._context) {
                const gl = this._context;
                const { x, y, width, height } = this.getViewport();
                gl.viewport(x, y, width, height);
            }
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
            this.disconnect();
            if (this._view !== this._defaultView) {
                this._view.destroy();
            }
            this._defaultView.destroy();
            this._viewport.destroy();
            this._size.destroy();
        }
    }

    class VertexArrayObject {
        constructor(gl, drawMode = exports.RenderingPrimitives.TRIANGLES) {
            this._attributes = [];
            this._indexBuffer = null;
            this._dirty = false;
            this._context = gl;
            this._vao = gl.createVertexArray();
            this._drawMode = drawMode;
        }
        bind() {
            const gl = this._context;
            this._context.bindVertexArray(this._vao);
            if (this._dirty) {
                let lastBuffer = null;
                for (const attribute of this._attributes) {
                    if (lastBuffer !== attribute.buffer) {
                        attribute.buffer.bind();
                        lastBuffer = attribute.buffer;
                    }
                    gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.start);
                    gl.enableVertexAttribArray(attribute.location);
                }
                this._dirty = false;
            }
            if (this._indexBuffer) {
                this._indexBuffer.bind();
            }
            return this;
        }
        unbind() {
            this._context.bindVertexArray(null);
            return this;
        }
        addAttribute(buffer, attribute, type = exports.ShaderPrimitives.FLOAT, normalized = false, stride = 0, start = 0) {
            const { location, size } = attribute;
            this._attributes.push({ buffer, location, size, type, normalized, stride, start });
            this._dirty = true;
            return this;
        }
        addIndex(buffer) {
            this._indexBuffer = buffer;
            this._dirty = true;
            return this;
        }
        clear() {
            this.unbind();
            this._attributes.length = 0;
            this._indexBuffer = null;
            return this;
        }
        draw(size, start, type = this._drawMode) {
            const gl = this._context;
            if (this._indexBuffer) {
                gl.drawElements(type, size, gl.UNSIGNED_SHORT, start);
            }
            else {
                gl.drawArrays(type, start, size);
            }
            return this;
        }
        destroy() {
            this._context.deleteVertexArray(this._vao);
            this._indexBuffer = null;
            this._vao = null;
        }
    }

    class ShaderAttribute {
        constructor(gl, program, index, name, type) {
            const location = gl.getAttribLocation(program, name);
            this._context = gl;
            this._program = program;
            this.location = location;
            this.index = index;
            this.name = name;
            this.type = type;
            this.size = primitiveByteSizeMapping[type];
        }
        destroy() {
            // todo - check if destroy is needed
        }
    }

    class ShaderUniform {
        constructor(gl, program, index, type, size, name, data) {
            this._context = gl;
            this._program = program;
            this.name = name.replace(/\[.*?]/, '');
            this.location = gl.getUniformLocation(program, this.name);
            this.index = index;
            this.type = type;
            this.size = size;
            this._value = data;
            this._uploadFn = primitiveUploadFunctions[type];
        }
        get propName() {
            return this.name.substr(this.name.lastIndexOf('.') + 1);
        }
        get value() {
            return this._value;
        }
        setValue(value) {
            this._value.set(value);
            this.upload();
            return this;
        }
        upload() {
            if (this.location) {
                this._uploadFn(this._context, this.location, this._value);
            }
            return this;
        }
        destroy() {
            // todo - check if destroy is needed
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
                const uniform = new ShaderUniform(gl, program, indices[i], type, size, name, data);
                this._uniforms.set(uniform.propName, uniform);
            }
        }
    }

    class Shader {
        constructor(vertexSource, fragmentSource) {
            this.attributes = new Map();
            this.uniforms = new Map();
            this.uniformBlocks = new Map();
            this._context = null;
            this._vertexShader = null;
            this._fragmentShader = null;
            this._program = null;
            this._vertexSource = vertexSource;
            this._fragmentSource = fragmentSource;
        }
        createShader(type, source) {
            if (!this._context) {
                throw Error('Tried to create shader without webgl context.');
            }
            const gl = this._context;
            const shader = gl.createShader(type);
            if (!shader) {
                return null;
            }
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                window.console.log(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
        createProgram(vertexShader, fragmentShader) {
            if (!this._context) {
                throw Error('Tried to create program without webgl context.');
            }
            const gl = this._context;
            const program = gl.createProgram();
            if (!program) {
                return null;
            }
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.detachShader(program, vertexShader);
                gl.detachShader(program, fragmentShader);
                gl.deleteProgram(program);
                console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
                console.error('gl.getError()', gl.getError());
                if (gl.getProgramInfoLog(program)) {
                    console.warn('gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
                }
                return null;
            }
            return program;
        }
        connect(gl) {
            if (!this._context) {
                this._context = gl;
                this._vertexShader = this.createShader(gl.VERTEX_SHADER, this._vertexSource);
                this._fragmentShader = this.createShader(gl.FRAGMENT_SHADER, this._fragmentSource);
                if (!this._vertexShader || !this._fragmentShader) {
                    throw new Error('Could not create vertex/fragment shader.');
                }
                this._program = this.createProgram(this._vertexShader, this._fragmentShader);
                if (!this._program) {
                    throw new Error('Could not create shader program.');
                }
                this._extractAttributes();
                this._extractUniforms();
                this._extractUniformBlocks();
            }
            return this;
        }
        disconnect() {
            this.unbindProgram();
            if (this._context) {
                const gl = this._context;
                gl.deleteShader(this._vertexShader);
                gl.deleteShader(this._fragmentShader);
                gl.deleteProgram(this._program);
                for (const attribute of this.attributes.values()) {
                    attribute.destroy();
                }
                for (const uniform of this.uniforms.values()) {
                    uniform.destroy();
                }
                for (const uniformBlock of this.uniformBlocks.values()) {
                    uniformBlock.destroy();
                }
                this.attributes.clear();
                this.uniforms.clear();
                this.uniformBlocks.clear();
                this._vertexShader = null;
                this._fragmentShader = null;
                this._program = null;
                this._context = null;
            }
            return this;
        }
        bindProgram() {
            if (!this._context) {
                throw new Error('No context!');
            }
            const gl = this._context;
            gl.useProgram(this._program);
            for (const uniform of this.uniforms.values()) {
                uniform.upload();
            }
            for (const uniformBlock of this.uniformBlocks.values()) {
                uniformBlock.upload();
            }
            return this;
        }
        unbindProgram() {
            if (this._context) {
                this._context.useProgram(null);
            }
            return this;
        }
        getAttribute(name) {
            if (!this.attributes.has(name)) {
                throw new Error(`Attribute "${name}" is not available.`);
            }
            return this.attributes.get(name);
        }
        getUniform(name) {
            if (!this.uniforms.has(name)) {
                throw new Error(`Uniform Block "${name}" is not available.`);
            }
            return this.uniforms.get(name);
        }
        getUniformBlock(name) {
            if (!this.uniformBlocks.has(name)) {
                throw new Error(`Uniform Block "${name}" is not available.`);
            }
            return this.uniformBlocks.get(name);
        }
        destroy() {
            this.disconnect();
        }
        _extractAttributes() {
            const gl = this._context;
            const program = this._program;
            const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < activeAttributes; i++) {
                const { name, type } = gl.getActiveAttrib(program, i);
                this.attributes.set(name, new ShaderAttribute(gl, program, i, name, type));
            }
        }
        _extractUniforms() {
            const gl = this._context;
            const program = this._program;
            const activeCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            const activeIndices = new Uint8Array(activeCount).map((value, index) => index);
            const blocks = gl.getActiveUniforms(program, activeIndices, gl.UNIFORM_BLOCK_INDEX);
            const indices = activeIndices.filter((index) => (blocks[index] === -1));
            for (const index of indices) {
                const { type, size, name } = gl.getActiveUniform(program, index);
                const data = new primitiveArrayConstructors[type](primitiveByteSizeMapping[type] * size);
                const uniform = new ShaderUniform(gl, program, index, type, size, name, data);
                this.uniforms.set(uniform.name, uniform);
            }
        }
        _extractUniformBlocks() {
            const gl = this._context;
            const program = this._program;
            const activeBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
            for (let index = 0; index < activeBlocks; index++) {
                const uniformBlock = new ShaderBlock(gl, program, index);
                this.uniformBlocks.set(uniformBlock.name, uniformBlock);
            }
        }
    }

    class RenderBuffer {
        constructor(gl, type, data, usage) {
            this._data = emptyArrayBuffer;
            this._context = gl;
            this._buffer = gl.createBuffer();
            this._type = type;
            this._usage = usage;
            if (data) {
                this.upload(data);
            }
        }
        upload(data, offset = 0) {
            this.bind();
            if (this._data.byteLength >= data.byteLength) {
                this._context.bufferSubData(this._type, offset, data);
            }
            else {
                this._context.bufferData(this._type, data, this._usage);
            }
            this._data = data;
        }
        bind() {
            this._context.bindBuffer(this._type, this._buffer);
        }
        destroy() {
            this._context.deleteBuffer(this._buffer);
        }
    }

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
                const gl = renderManager.context;
                this.gl = gl;
                this.renderManager = renderManager;
                this.shader.connect(gl);
                this.indexBuffer = new RenderBuffer(gl, exports.BufferTypes.ELEMENT_ARRAY_BUFFER, this.indexData, exports.BufferUsage.STATIC_DRAW);
                this.vertexBuffer = new RenderBuffer(gl, exports.BufferTypes.ARRAY_BUFFER, this.vertexData, exports.BufferUsage.DYNAMIC_DRAW);
                this.vao = this.createVao(gl, this.indexBuffer, this.vertexBuffer);
            }
            return this;
        }
        disconnect() {
            if (this.gl) {
                this.unbind();
                this.shader.disconnect();
                this.vao.destroy();
                this.vao = null;
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
            if (this.batchIndex > 0) {
                const view = this.renderManager.view;
                if (this.currentView !== view || this.currentViewId !== view.updateId) {
                    this.currentView = view;
                    this.currentViewId = view.updateId;
                    this.updateView(view);
                }
                this.renderManager.setVao(this.vao);
                this.vertexBuffer.upload(this.float32View.subarray(0, this.batchIndex * this.attributeCount));
                this.vao.draw(this.batchIndex * 6, 0);
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
                    this.renderManager.setTexture(texture);
                }
                if (blendModeChanged) {
                    this.currentBlendMode = blendMode;
                    this.renderManager.setBlendMode(blendMode);
                }
            }
            if (texture) {
                texture.update();
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
            return new VertexArrayObject(gl)
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
            super(batchSize, 36, vertexSource$1, fragmentSource$1);
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
                    this.renderManager.setTexture(texture);
                }
                if (blendModeChanged) {
                    this.currentBlendMode = blendMode;
                    this.renderManager.setBlendMode(blendMode);
                }
            }
            this.shader
                .getUniform('u_translation')
                .setValue(system.getGlobalTransform().toArray(false));
            texture.update();
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
            return new VertexArrayObject(gl)
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

    var vertexSource$2 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) in vec2 a_position;\r\nlayout(location = 1) in vec4 a_color;\r\n\r\nuniform mat3 u_projection;\r\nuniform mat3 u_translation;\r\n\r\nout vec4 v_color;\r\n\r\nvoid main(void) {\r\n    gl_Position = vec4((u_projection * u_translation * vec3(a_position, 1.0)).xy, 0.0, 1.0);\r\n    v_color = vec4(a_color.rgb * a_color.a, a_color.a);\r\n}\r\n";

    var fragmentSource$2 = "#version 300 es\r\nprecision lowp float;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nin vec4 v_color;\r\n\r\nvoid main(void) {\r\n    fragColor = v_color;\r\n}\r\n";

    const minBatchVertexSize = 4;
    const vertexStrideBytes = 12; // vec2 position + packed rgba
    const vertexStrideWords = vertexStrideBytes / 4;
    class PrimitiveRenderer {
        constructor(batchSize) {
            this._shader = new Shader(vertexSource$2, fragmentSource$2);
            this._renderManager = null;
            this._context = null;
            this._currentBlendMode = null;
            this._currentView = null;
            this._viewId = -1;
            this._indexBuffer = null;
            this._vertexBuffer = null;
            this._vao = null;
            this._vertexCapacity = Math.max(minBatchVertexSize, batchSize);
            this._indexCapacity = Math.max(6, this._vertexCapacity * 3);
            this._vertexData = new ArrayBuffer(this._vertexCapacity * vertexStrideBytes);
            this._indexData = new Uint16Array(this._indexCapacity);
            this._float32View = new Float32Array(this._vertexData);
            this._uint32View = new Uint32Array(this._vertexData);
        }
        connect(renderManager) {
            if (!this._context) {
                const gl = renderManager.context;
                this._context = gl;
                this._renderManager = renderManager;
                this._shader.connect(gl);
                this._indexBuffer = new RenderBuffer(gl, exports.BufferTypes.ELEMENT_ARRAY_BUFFER, this._indexData, exports.BufferUsage.DYNAMIC_DRAW);
                this._vertexBuffer = new RenderBuffer(gl, exports.BufferTypes.ARRAY_BUFFER, this._vertexData, exports.BufferUsage.DYNAMIC_DRAW);
                this._vao = new VertexArrayObject(gl)
                    .addIndex(this._indexBuffer)
                    .addAttribute(this._vertexBuffer, this._shader.getAttribute('a_position'), gl.FLOAT, false, vertexStrideBytes, 0)
                    .addAttribute(this._vertexBuffer, this._shader.getAttribute('a_color'), gl.UNSIGNED_BYTE, true, vertexStrideBytes, 8);
            }
            return this;
        }
        disconnect() {
            if (this._context) {
                this.unbind();
                this._shader.disconnect();
                this._vao?.destroy();
                this._renderManager = null;
                this._context = null;
                this._vao = null;
                this._indexBuffer = null;
                this._vertexBuffer = null;
            }
            return this;
        }
        bind() {
            if (!this._context) {
                throw new Error('Renderer has to be connected first!');
            }
            this._renderManager.setVao(this._vao);
            this._renderManager.setShader(this._shader);
            return this;
        }
        unbind() {
            if (this._context) {
                this.flush();
                this._renderManager.setShader(null);
                this._renderManager.setVao(null);
                this._currentBlendMode = null;
                this._currentView = null;
                this._viewId = -1;
            }
            return this;
        }
        render(drawable) {
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
                this._renderManager.setBlendMode(blendMode);
            }
            const view = this._renderManager.view;
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
            this._renderManager.setVao(this._vao);
            this._vertexBuffer.upload(this._float32View.subarray(0, vertexCount * vertexStrideWords));
            this._indexBuffer.upload(this._indexData.subarray(0, indexCount));
            this._vao.draw(indexCount, 0, drawMode);
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
            this._renderManager = null;
            this._context = null;
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
            return new this.constructor(this._r, this._g, this._b, this._a);
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

    var TextureFlags;
    (function (TextureFlags) {
        TextureFlags[TextureFlags["none"] = 0] = "none";
        TextureFlags[TextureFlags["scaleModeDirty"] = 1] = "scaleModeDirty";
        TextureFlags[TextureFlags["wrapModeDirty"] = 2] = "wrapModeDirty";
        TextureFlags[TextureFlags["premultiplyAlphaDirty"] = 4] = "premultiplyAlphaDirty";
        TextureFlags[TextureFlags["sourceDirty"] = 8] = "sourceDirty";
        TextureFlags[TextureFlags["sizeDirty"] = 16] = "sizeDirty";
    })(TextureFlags || (TextureFlags = {}));
    class Texture {
        constructor(source = null, options) {
            this._context = null;
            this._source = null;
            this._texture = null;
            this._size = new Size(0, 0);
            this._premultiplyAlpha = false;
            this._generateMipMap = false;
            this._flipY = false;
            this._flags = new Flags();
            const { scaleMode, wrapMode, premultiplyAlpha, generateMipMap, flipY } = { ...Texture.defaultSamplerOptions, ...options };
            this._scaleMode = scaleMode;
            this._wrapMode = wrapMode;
            this._premultiplyAlpha = premultiplyAlpha;
            this._generateMipMap = generateMipMap;
            this._flipY = flipY;
            this._flags.push(TextureFlags.scaleModeDirty, TextureFlags.wrapModeDirty, TextureFlags.premultiplyAlphaDirty);
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
        connect(gl) {
            if (this._context === null) {
                this._context = gl;
                this._texture = gl.createTexture();
            }
            return this;
        }
        disconnect() {
            this.unbindTexture();
            if (this._context) {
                this._context.deleteTexture(this._texture);
                this._context = null;
                this._texture = null;
            }
            return this;
        }
        bindTexture(unit) {
            if (!this._context) {
                throw new Error('Texture has to be connected first!');
            }
            const gl = this._context;
            if (unit !== undefined) {
                gl.activeTexture(gl.TEXTURE0 + unit);
            }
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            this.update();
            return this;
        }
        unbindTexture() {
            if (this._context) {
                const gl = this._context;
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            return this;
        }
        setScaleMode(scaleMode) {
            if (this._scaleMode !== scaleMode) {
                this._scaleMode = scaleMode;
                this._flags.push(TextureFlags.scaleModeDirty);
            }
            return this;
        }
        setWrapMode(wrapMode) {
            if (this._wrapMode !== wrapMode) {
                this._wrapMode = wrapMode;
                this._flags.push(TextureFlags.wrapModeDirty);
            }
            return this;
        }
        setPremultiplyAlpha(premultiplyAlpha) {
            if (this._premultiplyAlpha !== premultiplyAlpha) {
                this._premultiplyAlpha = premultiplyAlpha;
                this._flags.push(TextureFlags.premultiplyAlphaDirty);
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
            this._flags.push(TextureFlags.sourceDirty);
            const { width, height } = getTextureSourceSize(this._source);
            this.setSize(width, height);
            return this;
        }
        setSize(width, height) {
            if (!this._size.equals({ width, height })) {
                this._size.set(width, height);
                this._flags.push(TextureFlags.sizeDirty);
            }
            return this;
        }
        update() {
            if (this._flags.value !== TextureFlags.none && this._context) {
                const gl = this._context;
                if (this._flags.pop(TextureFlags.scaleModeDirty)) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._scaleMode);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._scaleMode);
                }
                if (this._flags.pop(TextureFlags.wrapModeDirty)) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapMode);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapMode);
                }
                if (this._flags.pop(TextureFlags.premultiplyAlphaDirty)) {
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);
                }
                if (this._flags.pop(TextureFlags.sourceDirty) && this._source) {
                    if (this._flags.pop(TextureFlags.sizeDirty)) {
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
                    }
                    else {
                        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
                    }
                    if (this._generateMipMap) {
                        gl.generateMipmap(gl.TEXTURE_2D);
                    }
                }
            }
            return this;
        }
        destroy() {
            this.disconnect();
            this._size.destroy();
            this._flags.destroy();
            this._source = null;
            this._context = null;
            this._texture = null;
        }
    }
    Texture.defaultSamplerOptions = {
        scaleMode: exports.ScaleModes.LINEAR,
        wrapMode: exports.WrapModes.CLAMP_TO_EDGE,
        premultiplyAlpha: true,
        generateMipMap: true,
        flipY: false,
    };
    Texture.empty = new Texture(null);
    Texture.black = new Texture(createCanvas({ fillStyle: '#000' }));
    Texture.white = new Texture(createCanvas({ fillStyle: '#fff' }));

    (function (RendererType) {
        RendererType[RendererType["sprite"] = 1] = "sprite";
        RendererType[RendererType["particle"] = 2] = "particle";
        RendererType[RendererType["primitive"] = 3] = "primitive";
    })(exports.RendererType || (exports.RendererType = {}));

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
            this._renderer = null;
            this._shader = null;
            this._blendMode = null;
            this._texture = null;
            this._textureUnit = 0;
            this._vao = null;
            this._clearColor = new Color();
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
            this.addRenderer(exports.RendererType.sprite, new SpriteRenderer(spriteRendererBatchSize));
            this.addRenderer(exports.RendererType.particle, new ParticleRenderer(particleRendererBatchSize));
            this.addRenderer(exports.RendererType.primitive, new PrimitiveRenderer(primitiveRendererBatchSize));
            this._connectAndBindRenderTarget();
            this.setBlendMode(exports.BlendModes.normal);
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
        setRenderTarget(target) {
            const renderTarget = target || this._rootRenderTarget;
            if (this._renderTarget !== renderTarget) {
                this._renderTarget.unbindFramebuffer();
                this._renderTarget = renderTarget;
                this._connectAndBindRenderTarget();
            }
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
                    this._shader.unbindProgram();
                    this._shader = null;
                }
                if (shader) {
                    shader.connect(this._context);
                    shader.bindProgram();
                }
                this._shader = shader;
            }
            return this;
        }
        setTexture(texture, unit) {
            if (unit !== undefined) {
                this.setTextureUnit(unit);
            }
            if (this._texture !== texture) {
                if (this._texture) {
                    this._texture.unbindTexture();
                    this._texture = null;
                }
                if (texture) {
                    texture.connect(this._context);
                    texture.bindTexture();
                }
                this._texture = texture;
            }
            return this;
        }
        setBlendMode(blendMode) {
            if (blendMode !== this._blendMode) {
                const gl = this._context;
                this._blendMode = blendMode;
                switch (blendMode) {
                    case exports.BlendModes.additive:
                        gl.blendFunc(gl.ONE, gl.ONE);
                        break;
                    case exports.BlendModes.subtract:
                        gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                        break;
                    case exports.BlendModes.multiply:
                        gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                        break;
                    case exports.BlendModes.screen:
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
            gl.clear(gl.COLOR_BUFFER_BIT);
            return this;
        }
        resize(width, height) {
            this._canvas.width = width;
            this._canvas.height = height;
            this._rootRenderTarget.resize(width, height);
            return this;
        }
        draw(drawable) {
            if (!this._contextLost) {
                drawable.render(this);
            }
            return this;
        }
        display() {
            if (this._renderer && !this._contextLost) {
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
            this._rootRenderTarget.destroy();
            this._vao = null;
            this._renderer = null;
            this._shader = null;
            this._blendMode = null;
            this._texture = null;
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
        _connectAndBindRenderTarget() {
            if (!this._context) {
                throw new Error('Cannot connect rendertarget when no context is provided!');
            }
            this._renderTarget.connect(this._context);
            this._renderTarget.bindFramebuffer();
        }
    }

    (function (PointerStateFlag) {
        PointerStateFlag[PointerStateFlag["none"] = 0] = "none";
        PointerStateFlag[PointerStateFlag["over"] = 1] = "over";
        PointerStateFlag[PointerStateFlag["leave"] = 2] = "leave";
        PointerStateFlag[PointerStateFlag["down"] = 4] = "down";
        PointerStateFlag[PointerStateFlag["move"] = 8] = "move";
        PointerStateFlag[PointerStateFlag["up"] = 16] = "up";
        PointerStateFlag[PointerStateFlag["cancel"] = 32] = "cancel";
    })(exports.PointerStateFlag || (exports.PointerStateFlag = {}));
    (function (PointerState) {
        PointerState[PointerState["unknown"] = 0] = "unknown";
        PointerState[PointerState["insideCanvas"] = 1] = "insideCanvas";
        PointerState[PointerState["outsideCanvas"] = 2] = "outsideCanvas";
        PointerState[PointerState["pressed"] = 3] = "pressed";
        PointerState[PointerState["moving"] = 4] = "moving";
        PointerState[PointerState["released"] = 5] = "released";
        PointerState[PointerState["cancelled"] = 6] = "cancelled";
    })(exports.PointerState || (exports.PointerState = {}));
    class Pointer {
        constructor(event, canvas) {
            this.startPos = new Vector(-1, -1);
            this.stateFlags = new Flags();
            this._currentState = exports.PointerState.unknown;
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
            this.stateFlags.push(exports.PointerStateFlag.over);
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
            this._currentState = exports.PointerState.insideCanvas;
        }
        handleLeave(event) {
            this.handleEvent(event);
            this.stateFlags.push(exports.PointerStateFlag.leave);
            this._currentState = exports.PointerState.outsideCanvas;
        }
        handlePress(event) {
            this.handleEvent(event);
            this.startPos.copy(this.position);
            this.stateFlags.push(exports.PointerStateFlag.down);
            this._currentState = exports.PointerState.pressed;
        }
        handleMove(event) {
            this.handleEvent(event);
            this.stateFlags.push(exports.PointerStateFlag.move);
            this._currentState = exports.PointerState.moving;
        }
        handleRelease(event) {
            this.handleEvent(event);
            this.stateFlags.push(exports.PointerStateFlag.up);
            this._currentState = exports.PointerState.released;
        }
        handleCancel(event) {
            this.handleEvent(event);
            this.stateFlags.push(exports.PointerStateFlag.cancel);
            this._currentState = exports.PointerState.cancelled;
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

    class GamepadChannels {
    }
    GamepadChannels.faceBottom = 512 /* gamepads */ + 0;
    GamepadChannels.faceLeft = 512 /* gamepads */ + 1;
    GamepadChannels.faceRight = 512 /* gamepads */ + 2;
    GamepadChannels.faceTop = 512 /* gamepads */ + 3;
    GamepadChannels.shoulderLeftBottom = 512 /* gamepads */ + 4;
    GamepadChannels.shoulderRightBottom = 512 /* gamepads */ + 5;
    GamepadChannels.shoulderLeftTop = 512 /* gamepads */ + 6;
    GamepadChannels.shoulderRightTop = 512 /* gamepads */ + 7;
    GamepadChannels.menuLeft = 512 /* gamepads */ + 8;
    GamepadChannels.menuRight = 512 /* gamepads */ + 9;
    GamepadChannels.leftStickPress = 512 /* gamepads */ + 10;
    GamepadChannels.rightStickPress = 512 /* gamepads */ + 11;
    GamepadChannels.dPadUp = 512 /* gamepads */ + 12;
    GamepadChannels.dPadDown = 512 /* gamepads */ + 13;
    GamepadChannels.dPadLeft = 512 /* gamepads */ + 14;
    GamepadChannels.dPadRight = 512 /* gamepads */ + 15;
    GamepadChannels.menuCenter = 512 /* gamepads */ + 16;
    GamepadChannels.menuSpecial = 512 /* gamepads */ + 17;
    GamepadChannels.extra1 = 512 /* gamepads */ + 18;
    GamepadChannels.extra2 = 512 /* gamepads */ + 19;
    GamepadChannels.extra3 = 512 /* gamepads */ + 20;
    GamepadChannels.leftStickLeft = 512 /* gamepads */ + 21;
    GamepadChannels.leftStickRight = 512 /* gamepads */ + 22;
    GamepadChannels.leftStickUp = 512 /* gamepads */ + 23;
    GamepadChannels.leftStickDown = 512 /* gamepads */ + 24;
    GamepadChannels.rightStickLeft = 512 /* gamepads */ + 25;
    GamepadChannels.rightStickRight = 512 /* gamepads */ + 26;
    GamepadChannels.rightStickUp = 512 /* gamepads */ + 27;
    GamepadChannels.rightStickDown = 512 /* gamepads */ + 28;
    GamepadChannels.auxiliaryAxis0Negative = 512 /* gamepads */ + 29;
    GamepadChannels.auxiliaryAxis0Positive = 512 /* gamepads */ + 30;
    GamepadChannels.auxiliaryAxis1Negative = 512 /* gamepads */ + 31;
    GamepadChannels.auxiliaryAxis1Positive = 512 /* gamepads */ + 32;
    GamepadChannels.auxiliaryAxis2Negative = 512 /* gamepads */ + 33;
    GamepadChannels.auxiliaryAxis2Positive = 512 /* gamepads */ + 34;
    GamepadChannels.auxiliaryAxis3Negative = 512 /* gamepads */ + 35;
    GamepadChannels.auxiliaryAxis3Positive = 512 /* gamepads */ + 36;
    GamepadChannels.select = GamepadChannels.menuLeft;
    GamepadChannels.start = GamepadChannels.menuRight;
    GamepadChannels.leftStick = GamepadChannels.leftStickPress;
    GamepadChannels.rightStick = GamepadChannels.rightStickPress;
    GamepadChannels.home = GamepadChannels.menuCenter;

    class GamepadControl {
        constructor(index, channel, options = {}) {
            this.index = index;
            this.channel = channel;
            /**
             * Whether or not the value should be inverted.
             */
            this.invert = options.invert ?? false;
            /**
             * If set to true the value ranges from {0..1} instead of {-1..1} and vice versa when inverted is set to true.
             */
            this.normalize = options.normalize ?? false;
            /**
             * Defines the "deadzone" ranging from 0..1.
             * When the value does not exceed this threshold, no update event will be thrown.
             */
            this.threshold = clamp(options.threshold ?? 0.2, -1, 1);
        }
        transformValue(value) {
            let result = clamp(value, -1, 1);
            if (this.invert) {
                result *= -1;
            }
            if (this.normalize) {
                result = (result + 1) / 2;
            }
            return (result > this.threshold) ? result : 0;
        }
        destroy() {
            // todo - check if destroy is needed
        }
    }

    class GamepadMapping {
        constructor(buttons, axes) {
            this._buttons = buttons;
            this._axes = axes;
        }
        get buttons() {
            return this._buttons;
        }
        get axes() {
            return this._axes;
        }
        setButtons(buttons) {
            this.clearButtons();
            this._buttons.push(...buttons);
            return this;
        }
        clearButtons() {
            for (const button of this._buttons) {
                button.destroy();
            }
            this._buttons.length = 0;
            return this;
        }
        setAxes(axes) {
            this.clearAxes();
            this._axes.push(...axes);
            return this;
        }
        clearAxes() {
            for (const axis of this._axes) {
                axis.destroy();
            }
            this._axes.length = 0;
            return this;
        }
        clearControls() {
            this.clearButtons();
            this.clearAxes();
            return this;
        }
        destroy() {
            this.clearControls();
        }
        static createControls(definitions) {
            return definitions.map(([index, channel, options]) => new GamepadControl(index, channel, options));
        }
    }

    class GenericGamepadMapping extends GamepadMapping {
        constructor() {
            super(GamepadMapping.createControls(GenericGamepadMapping._buttonDefinitions), GamepadMapping.createControls(GenericGamepadMapping._axisDefinitions));
        }
    }
    GenericGamepadMapping._buttonDefinitions = [
        [0, GamepadChannels.faceBottom],
        [1, GamepadChannels.faceRight],
        [2, GamepadChannels.faceLeft],
        [3, GamepadChannels.faceTop],
        [4, GamepadChannels.shoulderLeftBottom],
        [5, GamepadChannels.shoulderRightBottom],
        [6, GamepadChannels.shoulderLeftTop],
        [7, GamepadChannels.shoulderRightTop],
        [8, GamepadChannels.menuLeft],
        [9, GamepadChannels.menuRight],
        [10, GamepadChannels.leftStickPress],
        [11, GamepadChannels.rightStickPress],
        [12, GamepadChannels.dPadUp],
        [13, GamepadChannels.dPadDown],
        [14, GamepadChannels.dPadLeft],
        [15, GamepadChannels.dPadRight],
        [16, GamepadChannels.menuCenter],
        [17, GamepadChannels.menuSpecial],
        [18, GamepadChannels.extra1],
        [19, GamepadChannels.extra2],
        [20, GamepadChannels.extra3],
    ];
    GenericGamepadMapping._axisDefinitions = [
        [0, GamepadChannels.leftStickLeft, { invert: true }],
        [0, GamepadChannels.leftStickRight],
        [1, GamepadChannels.leftStickUp, { invert: true }],
        [1, GamepadChannels.leftStickDown],
        [2, GamepadChannels.rightStickLeft, { invert: true }],
        [2, GamepadChannels.rightStickRight],
        [3, GamepadChannels.rightStickUp, { invert: true }],
        [3, GamepadChannels.rightStickDown],
        [4, GamepadChannels.auxiliaryAxis0Negative, { invert: true }],
        [4, GamepadChannels.auxiliaryAxis0Positive],
        [5, GamepadChannels.auxiliaryAxis1Negative, { invert: true }],
        [5, GamepadChannels.auxiliaryAxis1Positive],
        [6, GamepadChannels.auxiliaryAxis2Negative, { invert: true }],
        [6, GamepadChannels.auxiliaryAxis2Positive],
        [7, GamepadChannels.auxiliaryAxis3Negative, { invert: true }],
        [7, GamepadChannels.auxiliaryAxis3Positive],
    ];

    class XboxGamepadMapping extends GenericGamepadMapping {
    }

    class PlayStationGamepadMapping extends GenericGamepadMapping {
    }
    /**
     * @deprecated Use PlayStationGamepadMapping.
     */
    class DualShockGamepadMapping extends PlayStationGamepadMapping {
    }

    class SwitchGamepadMapping extends GenericGamepadMapping {
    }

    (function (GamepadProfile) {
        GamepadProfile["generic"] = "generic";
        GamepadProfile["xbox"] = "xbox";
        GamepadProfile["playStation"] = "playStation";
        GamepadProfile["nintendoSwitch"] = "nintendoSwitch";
    })(exports.GamepadProfile || (exports.GamepadProfile = {}));
    class GamepadProfiles {
        static detectGamepadProfile(gamepad) {
            return this._detectProfileFromId(gamepad.id);
        }
        static getGamepadLabel(gamepad) {
            return this.resolveGamepadInfo(gamepad).label;
        }
        static resolveGamepadInfo(gamepad) {
            const id = gamepad.id;
            const productKey = this._extractVendorProductKey(id);
            const fallbackProfile = this._detectProfileFromId(id);
            if (productKey) {
                const vendorId = this._getVendorIdFromProductKey(productKey);
                const productId = this._getProductIdFromProductKey(productKey);
                const knownSignature = this._knownSignatureByProductKey.get(productKey);
                if (knownSignature) {
                    return {
                        profile: knownSignature.profile,
                        label: knownSignature.label,
                        vendorId,
                        productId,
                    };
                }
                const profile = this._profileByVendorId.get(vendorId) ?? fallbackProfile;
                return {
                    profile,
                    label: `${this._getDefaultLabelForProfile(profile)} (${productKey})`,
                    vendorId,
                    productId,
                };
            }
            return {
                profile: fallbackProfile,
                label: this._getDefaultLabelForProfile(fallbackProfile),
                vendorId: null,
                productId: null,
            };
        }
        static createMappingForProfile(profile) {
            const mappingFactory = this._mappingFactoryByProfile.get(profile) ?? this._mappingFactoryByProfile.get(exports.GamepadProfile.generic);
            return mappingFactory();
        }
        static createAutoGamepadMappingResolver() {
            return this._autoMappingResolver;
        }
        static _detectProfileFromId(id) {
            const productKey = this._extractVendorProductKey(id);
            if (productKey) {
                const knownSignature = this._knownSignatureByProductKey.get(productKey);
                if (knownSignature) {
                    return knownSignature.profile;
                }
                const vendorProfile = this._profileByVendorId.get(this._getVendorIdFromProductKey(productKey));
                if (vendorProfile) {
                    return vendorProfile;
                }
            }
            return this._detectProfileFromText(id);
        }
        static _detectProfileFromText(id) {
            if (this._xboxIdPattern.test(id)) {
                return exports.GamepadProfile.xbox;
            }
            if (this._playStationIdPattern.test(id)) {
                return exports.GamepadProfile.playStation;
            }
            if (this._switchIdPattern.test(id)) {
                return exports.GamepadProfile.nintendoSwitch;
            }
            return exports.GamepadProfile.generic;
        }
        static _getDefaultLabelForProfile(profile) {
            switch (profile) {
                case exports.GamepadProfile.xbox: return 'Microsoft Xbox';
                case exports.GamepadProfile.playStation: return 'Sony PlayStation';
                case exports.GamepadProfile.nintendoSwitch: return 'Nintendo Switch';
                default: return 'Generic Gamepad';
            }
        }
        static _extractVendorProductKey(id) {
            const match = this._vendorProductHexPattern.exec(id)
                || this._vendorProductPattern.exec(id)
                || this._vidPidPattern.exec(id)
                || this._pairPattern.exec(id);
            if (!match) {
                return null;
            }
            return `${match[1].toLowerCase()}:${match[2].toLowerCase()}`;
        }
        static _getVendorIdFromProductKey(productKey) {
            return productKey.slice(0, 4);
        }
        static _getProductIdFromProductKey(productKey) {
            return productKey.slice(5);
        }
    }
    GamepadProfiles._xboxIdPattern = /(xbox|xinput)/i;
    GamepadProfiles._playStationIdPattern = /(playstation|dualshock|dualsense|wireless controller|sony)/i;
    GamepadProfiles._switchIdPattern = /(nintendo|switch|joy-con|pro controller)/i;
    GamepadProfiles._vendorProductPattern = /vendor[:\s]*([0-9a-f]{4})\s*product[:\s]*([0-9a-f]{4})/i;
    GamepadProfiles._pairPattern = /\b([0-9a-f]{4})[-: ]([0-9a-f]{4})\b/i;
    GamepadProfiles._vendorProductHexPattern = /vendor[:\s]*0x([0-9a-f]{4})\s*product[:\s]*0x([0-9a-f]{4})/i;
    GamepadProfiles._vidPidPattern = /vid[_:\s]*([0-9a-f]{4}).{0,8}pid[_:\s]*([0-9a-f]{4})/i;
    GamepadProfiles._knownSignatureByProductKey = new Map([
        ['045e:028e', { profile: exports.GamepadProfile.xbox, label: 'Microsoft Xbox 360' }],
        ['045e:02ea', { profile: exports.GamepadProfile.xbox, label: 'Microsoft Xbox One' }],
        ['045e:0b13', { profile: exports.GamepadProfile.xbox, label: 'Microsoft Xbox Series' }],
        ['054c:05c4', { profile: exports.GamepadProfile.playStation, label: 'Sony DualShock 4' }],
        ['054c:09cc', { profile: exports.GamepadProfile.playStation, label: 'Sony DualShock 4' }],
        ['054c:0ce6', { profile: exports.GamepadProfile.playStation, label: 'Sony DualSense' }],
        ['057e:2009', { profile: exports.GamepadProfile.nintendoSwitch, label: 'Nintendo Switch Pro' }],
        ['057e:2006', { profile: exports.GamepadProfile.nintendoSwitch, label: 'Nintendo Joy-Con' }],
        ['057e:2007', { profile: exports.GamepadProfile.nintendoSwitch, label: 'Nintendo Joy-Con' }],
    ]);
    GamepadProfiles._profileByVendorId = new Map([
        ['045e', exports.GamepadProfile.xbox],
        ['054c', exports.GamepadProfile.playStation],
        ['057e', exports.GamepadProfile.nintendoSwitch],
    ]);
    GamepadProfiles._mappingFactoryByProfile = new Map([
        [exports.GamepadProfile.generic, () => new GenericGamepadMapping()],
        [exports.GamepadProfile.xbox, () => new XboxGamepadMapping()],
        [exports.GamepadProfile.playStation, () => new PlayStationGamepadMapping()],
        [exports.GamepadProfile.nintendoSwitch, () => new SwitchGamepadMapping()],
    ]);
    GamepadProfiles._autoMappingResolver = (gamepad) => {
        return GamepadProfiles.createMappingForProfile(GamepadProfiles.detectGamepadProfile(gamepad));
    };
    // Compatibility exports
    const resolveGamepadInfo = (gamepad) => GamepadProfiles.resolveGamepadInfo(gamepad);
    const detectGamepadProfile = (gamepad) => GamepadProfiles.detectGamepadProfile(gamepad);
    const getGamepadLabel = (gamepad) => GamepadProfiles.getGamepadLabel(gamepad);
    const createGamepadMappingForProfile = (profile) => GamepadProfiles.createMappingForProfile(profile);
    const createAutoGamepadMappingResolver = () => GamepadProfiles.createAutoGamepadMappingResolver();

    class Gamepad {
        constructor(indexOrGamepad, channels, mappingOrResolver) {
            this.onConnect = new Signal();
            this.onDisconnect = new Signal();
            this.onUpdate = new Signal();
            this._gamepad = null;
            this._profile = 'generic';
            this._label = 'Generic Gamepad';
            this._vendorId = null;
            this._productId = null;
            const isRawGamepad = typeof indexOrGamepad !== 'number';
            const rawGamepad = isRawGamepad ? indexOrGamepad : null;
            const index = rawGamepad ? rawGamepad.index : indexOrGamepad;
            this._index = index;
            this._channelOffset = Gamepad.resolveChannelOffset(index, 512 /* gamepads */);
            this._channels = channels;
            this._mapping = rawGamepad
                ? Gamepad._resolveMapping(rawGamepad, mappingOrResolver)
                : mappingOrResolver;
            if (rawGamepad) {
                this.setInfo(GamepadProfiles.resolveGamepadInfo(rawGamepad));
                this.connect(rawGamepad);
            }
        }
        get mapping() {
            return this._mapping;
        }
        set mapping(mapping) {
            this._mapping = mapping;
        }
        get channels() {
            return this._channels;
        }
        get gamepad() {
            return this._gamepad;
        }
        get index() {
            return this._index;
        }
        get connected() {
            return this._gamepad !== null;
        }
        get profile() {
            return this._profile;
        }
        get label() {
            return this._label;
        }
        get vendorId() {
            return this._vendorId;
        }
        get productId() {
            return this._productId;
        }
        setInfo({ profile, label, vendorId, productId }) {
            this._profile = profile;
            this._label = label;
            this._vendorId = vendorId;
            this._productId = productId;
            return this;
        }
        connect(gamepad) {
            const wasConnected = this.connected;
            this._gamepad = gamepad;
            if (!wasConnected) {
                this.onConnect.dispatch(this);
            }
            return this;
        }
        disconnect() {
            if (this.connected) {
                this._gamepad = null;
                this._clearMappedChannels();
                this.onDisconnect.dispatch(this);
            }
            return this;
        }
        update() {
            if (this._gamepad === null) {
                return this;
            }
            const channels = this._channels;
            const { buttons: gamepadButtons, axes: gamepadAxes } = this._gamepad;
            const { buttons: mappingButtons, axes: mappingAxes } = this._mapping;
            for (const mapping of mappingButtons) {
                const { index, channel } = mapping;
                const offsetChannel = this.resolveChannelOffset(channel);
                if (index < gamepadButtons.length) {
                    const value = mapping.transformValue(gamepadButtons[index].value) || 0;
                    if (channels[offsetChannel] !== value) {
                        channels[offsetChannel] = value;
                        this.onUpdate.dispatch(channel, value, this);
                    }
                }
            }
            for (const mapping of mappingAxes) {
                const { index, channel } = mapping;
                const offsetChannel = this.resolveChannelOffset(channel);
                if (index < gamepadAxes.length) {
                    const value = mapping.transformValue(gamepadAxes[index]) || 0;
                    if (channels[offsetChannel] !== value) {
                        channels[offsetChannel] = value;
                        this.onUpdate.dispatch(channel, value, this);
                    }
                }
            }
            return this;
        }
        destroy() {
            this.disconnect();
            this._clearMappedChannels();
            this.onConnect.destroy();
            this.onDisconnect.destroy();
            this.onUpdate.destroy();
        }
        resolveChannelOffset(channel) {
            return this._channelOffset + (channel ^ 512 /* gamepads */);
        }
        clearChannels() {
            this._clearMappedChannels();
            return this;
        }
        static resolveChannelOffset(gamepadIndex, channel) {
            return 512 /* gamepads */ + (gamepadIndex * exports.ChannelSize.gamepad) + (channel ^ 512 /* gamepads */);
        }
        _clearMappedChannels() {
            for (const mapping of this._mapping.buttons) {
                this._channels[this.resolveChannelOffset(mapping.channel)] = 0;
            }
            for (const mapping of this._mapping.axes) {
                this._channels[this.resolveChannelOffset(mapping.channel)] = 0;
            }
        }
        static _resolveMapping(gamepad, mappingResolver) {
            const resolver = mappingResolver || GamepadProfiles.createAutoGamepadMappingResolver();
            return resolver(gamepad);
        }
    }
    Gamepad.faceBottom = GamepadChannels.faceBottom;
    Gamepad.faceLeft = GamepadChannels.faceLeft;
    Gamepad.faceRight = GamepadChannels.faceRight;
    Gamepad.faceTop = GamepadChannels.faceTop;
    Gamepad.shoulderLeftBottom = GamepadChannels.shoulderLeftBottom;
    Gamepad.shoulderRightBottom = GamepadChannels.shoulderRightBottom;
    Gamepad.shoulderLeftTop = GamepadChannels.shoulderLeftTop;
    Gamepad.shoulderRightTop = GamepadChannels.shoulderRightTop;
    Gamepad.menuLeft = GamepadChannels.menuLeft;
    Gamepad.menuRight = GamepadChannels.menuRight;
    Gamepad.leftStickPress = GamepadChannels.leftStickPress;
    Gamepad.rightStickPress = GamepadChannels.rightStickPress;
    Gamepad.dPadUp = GamepadChannels.dPadUp;
    Gamepad.dPadDown = GamepadChannels.dPadDown;
    Gamepad.dPadLeft = GamepadChannels.dPadLeft;
    Gamepad.dPadRight = GamepadChannels.dPadRight;
    Gamepad.menuCenter = GamepadChannels.menuCenter;
    Gamepad.menuSpecial = GamepadChannels.menuSpecial;
    Gamepad.extra1 = GamepadChannels.extra1;
    Gamepad.extra2 = GamepadChannels.extra2;
    Gamepad.extra3 = GamepadChannels.extra3;
    Gamepad.leftStickLeft = GamepadChannels.leftStickLeft;
    Gamepad.leftStickRight = GamepadChannels.leftStickRight;
    Gamepad.leftStickUp = GamepadChannels.leftStickUp;
    Gamepad.leftStickDown = GamepadChannels.leftStickDown;
    Gamepad.rightStickLeft = GamepadChannels.rightStickLeft;
    Gamepad.rightStickRight = GamepadChannels.rightStickRight;
    Gamepad.rightStickUp = GamepadChannels.rightStickUp;
    Gamepad.rightStickDown = GamepadChannels.rightStickDown;
    Gamepad.auxiliaryAxis0Negative = GamepadChannels.auxiliaryAxis0Negative;
    Gamepad.auxiliaryAxis0Positive = GamepadChannels.auxiliaryAxis0Positive;
    Gamepad.auxiliaryAxis1Negative = GamepadChannels.auxiliaryAxis1Negative;
    Gamepad.auxiliaryAxis1Positive = GamepadChannels.auxiliaryAxis1Positive;
    Gamepad.auxiliaryAxis2Negative = GamepadChannels.auxiliaryAxis2Negative;
    Gamepad.auxiliaryAxis2Positive = GamepadChannels.auxiliaryAxis2Positive;
    Gamepad.auxiliaryAxis3Negative = GamepadChannels.auxiliaryAxis3Negative;
    Gamepad.auxiliaryAxis3Positive = GamepadChannels.auxiliaryAxis3Positive;
    Gamepad.select = GamepadChannels.select;
    Gamepad.start = GamepadChannels.start;
    Gamepad.leftStick = GamepadChannels.leftStick;
    Gamepad.rightStick = GamepadChannels.rightStick;
    Gamepad.home = GamepadChannels.home;
    const createButtonLayoutMap = (entries) => {
        return new Map(entries);
    };
    const createButtonLayoutRecord = (buttonLayoutMap) => {
        return Object.freeze(Object.fromEntries(buttonLayoutMap));
    };
    const genericButtonLayoutEntries = [
        ['faceBottom', Gamepad.faceBottom],
        ['faceLeft', Gamepad.faceLeft],
        ['faceRight', Gamepad.faceRight],
        ['faceTop', Gamepad.faceTop],
        ['menuLeft', Gamepad.menuLeft],
        ['menuRight', Gamepad.menuRight],
        ['menuCenter', Gamepad.menuCenter],
        ['menuSpecial', Gamepad.menuSpecial],
        ['leftStickPress', Gamepad.leftStickPress],
        ['rightStickPress', Gamepad.rightStickPress],
        ['shoulderLeftBottom', Gamepad.shoulderLeftBottom],
        ['shoulderRightBottom', Gamepad.shoulderRightBottom],
        ['shoulderLeftTop', Gamepad.shoulderLeftTop],
        ['shoulderRightTop', Gamepad.shoulderRightTop],
        ['dPadUp', Gamepad.dPadUp],
        ['dPadDown', Gamepad.dPadDown],
        ['dPadLeft', Gamepad.dPadLeft],
        ['dPadRight', Gamepad.dPadRight],
        ['extra1', Gamepad.extra1],
        ['extra2', Gamepad.extra2],
        ['extra3', Gamepad.extra3],
    ];
    const xboxButtonLayoutEntries = [
        ['a', Gamepad.faceBottom],
        ['b', Gamepad.faceRight],
        ['x', Gamepad.faceLeft],
        ['y', Gamepad.faceTop],
        ['view', Gamepad.menuLeft],
        ['menu', Gamepad.menuRight],
        ['xbox', Gamepad.menuCenter],
        ['share', Gamepad.menuSpecial],
        ['lb', Gamepad.shoulderLeftBottom],
        ['rb', Gamepad.shoulderRightBottom],
        ['lt', Gamepad.shoulderLeftTop],
        ['rt', Gamepad.shoulderRightTop],
        ['l3', Gamepad.leftStickPress],
        ['r3', Gamepad.rightStickPress],
        ['dPadUp', Gamepad.dPadUp],
        ['dPadDown', Gamepad.dPadDown],
        ['dPadLeft', Gamepad.dPadLeft],
        ['dPadRight', Gamepad.dPadRight],
    ];
    const playStationButtonLayoutEntries = [
        ['cross', Gamepad.faceBottom],
        ['circle', Gamepad.faceRight],
        ['square', Gamepad.faceLeft],
        ['triangle', Gamepad.faceTop],
        ['create', Gamepad.menuLeft],
        ['options', Gamepad.menuRight],
        ['ps', Gamepad.menuCenter],
        ['touchpad', Gamepad.menuSpecial],
        ['l1', Gamepad.shoulderLeftBottom],
        ['l2', Gamepad.shoulderLeftTop],
        ['l3', Gamepad.leftStickPress],
        ['r1', Gamepad.shoulderRightBottom],
        ['r2', Gamepad.shoulderRightTop],
        ['r3', Gamepad.rightStickPress],
        ['dPadUp', Gamepad.dPadUp],
        ['dPadDown', Gamepad.dPadDown],
        ['dPadLeft', Gamepad.dPadLeft],
        ['dPadRight', Gamepad.dPadRight],
    ];
    const switchButtonLayoutEntries = [
        ['b', Gamepad.faceBottom],
        ['a', Gamepad.faceRight],
        ['y', Gamepad.faceLeft],
        ['x', Gamepad.faceTop],
        ['minus', Gamepad.menuLeft],
        ['plus', Gamepad.menuRight],
        ['home', Gamepad.menuCenter],
        ['capture', Gamepad.menuSpecial],
        ['sl', Gamepad.extra1],
        ['sr', Gamepad.extra2],
        ['zl', Gamepad.shoulderLeftTop],
        ['zr', Gamepad.shoulderRightTop],
        ['l', Gamepad.shoulderLeftBottom],
        ['r', Gamepad.shoulderRightBottom],
        ['l3', Gamepad.leftStickPress],
        ['r3', Gamepad.rightStickPress],
        ['dPadUp', Gamepad.dPadUp],
        ['dPadDown', Gamepad.dPadDown],
        ['dPadLeft', Gamepad.dPadLeft],
        ['dPadRight', Gamepad.dPadRight],
    ];
    class GamepadButtonLayouts {
    }
    GamepadButtonLayouts.generic = createButtonLayoutMap(genericButtonLayoutEntries);
    GamepadButtonLayouts.xbox = createButtonLayoutMap(xboxButtonLayoutEntries);
    GamepadButtonLayouts.playStation = createButtonLayoutMap(playStationButtonLayoutEntries);
    GamepadButtonLayouts.nintendoSwitch = createButtonLayoutMap(switchButtonLayoutEntries);
    const genericGamepadButtons = createButtonLayoutRecord(GamepadButtonLayouts.generic);
    const xboxGamepadButtons = createButtonLayoutRecord(GamepadButtonLayouts.xbox);
    const playStationGamepadButtons = createButtonLayoutRecord(GamepadButtonLayouts.playStation);
    const switchGamepadButtons = createButtonLayoutRecord(GamepadButtonLayouts.nintendoSwitch);

    var InputManagerFlags;
    (function (InputManagerFlags) {
        InputManagerFlags[InputManagerFlags["NONE"] = 0] = "NONE";
        InputManagerFlags[InputManagerFlags["KEY_DOWN"] = 1] = "KEY_DOWN";
        InputManagerFlags[InputManagerFlags["KEY_UP"] = 2] = "KEY_UP";
        InputManagerFlags[InputManagerFlags["MOUSE_WHEEL"] = 4] = "MOUSE_WHEEL";
        InputManagerFlags[InputManagerFlags["POINTER_UPDATE"] = 8] = "POINTER_UPDATE";
    })(InputManagerFlags || (InputManagerFlags = {}));
    class InputManager {
        constructor(app) {
            this._channels = new Float32Array(exports.ChannelSize.container);
            this._inputs = new Set();
            this._pointers = {};
            this._gamepads = [];
            this._gamepadsByIndex = new Map();
            this._gamepadSlotsActive = new Uint8Array(exports.ChannelSize.category / exports.ChannelSize.gamepad);
            this._wheelOffset = new Vector();
            this._flags = new Flags();
            this._channelsPressed = [];
            this._channelsReleased = [];
            this._keyDownHandler = this._handleKeyDown.bind(this);
            this._keyUpHandler = this._handleKeyUp.bind(this);
            this._canvasFocusHandler = this._handleCanvasFocus.bind(this);
            this._canvasBlurHandler = this._handleCanvasBlur.bind(this);
            this._windowBlurHandler = this._handleWindowBlur.bind(this);
            this._mouseWheelHandler = this._handleMouseWheel.bind(this);
            this._pointerOverHandler = this._handlePointerOver.bind(this);
            this._pointerLeaveHandler = this._handlePointerLeave.bind(this);
            this._pointerDownHandler = this._handlePointerDown.bind(this);
            this._pointerMoveHandler = this._handlePointerMove.bind(this);
            this._pointerUpHandler = this._handlePointerUp.bind(this);
            this._pointerCancelHandler = this._handlePointerCancel.bind(this);
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
            const { gamepadMapping, pointerDistanceThreshold } = app.options;
            this._canvas = app.canvas;
            this._canvasFocused = document.activeElement === this._canvas;
            this._pointerDistanceThreshold = pointerDistanceThreshold;
            this._gamepadMappingResolver = typeof gamepadMapping === 'function'
                ? gamepadMapping
                : () => gamepadMapping;
            this._addEventListeners();
        }
        get pointersInCanvas() {
            return Object.values(this._pointers).some(pointer => (pointer.currentState !== exports.PointerState.outsideCanvas &&
                pointer.currentState !== exports.PointerState.cancelled));
        }
        get canvasFocused() {
            return this._canvasFocused;
        }
        get gamepads() {
            return this._gamepads;
        }
        getGamepad(index) {
            return this._gamepadsByIndex.get(index) ?? null;
        }
        add(inputs) {
            if (Array.isArray(inputs)) {
                inputs.forEach(this.add, this);
                return this;
            }
            this._inputs.add(inputs);
            return this;
        }
        remove(inputs) {
            if (Array.isArray(inputs)) {
                inputs.forEach(this.remove, this);
                return this;
            }
            this._inputs.delete(inputs);
            return this;
        }
        clear(destroyInputs = false) {
            if (destroyInputs) {
                for (const input of this._inputs) {
                    input.destroy();
                }
            }
            this._inputs.clear();
            return this;
        }
        update() {
            this._updateGamepads();
            for (const input of this._inputs) {
                input.update(this._channels);
            }
            if (this._flags.value !== InputManagerFlags.NONE) {
                this._updateEvents();
            }
            return this;
        }
        destroy() {
            this._removeEventListeners();
            for (const pointer of Object.values(this._pointers)) {
                pointer.destroy();
            }
            for (const gamepad of this._gamepads) {
                gamepad.destroy();
            }
            this._inputs.clear();
            this._gamepadsByIndex.clear();
            this._gamepads.length = 0;
            this._channelsPressed.length = 0;
            this._channelsReleased.length = 0;
            this._wheelOffset.destroy();
            this._flags.destroy();
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
        _handleKeyDown(event) {
            const channel = (0 /* keyboard */ + event.keyCode);
            this._channels[channel] = 1;
            this._channelsPressed.push(channel);
            this._flags.push(InputManagerFlags.KEY_DOWN);
        }
        _handleKeyUp(event) {
            const channel = (0 /* keyboard */ + event.keyCode);
            this._channels[channel] = 0;
            this._channelsReleased.push(channel);
            this._flags.push(InputManagerFlags.KEY_UP);
        }
        _handlePointerOver(event) {
            this._pointers[event.pointerId] = new Pointer(event, this._canvas);
            this._flags.push(InputManagerFlags.POINTER_UPDATE);
        }
        _handlePointerLeave(event) {
            this._pointers[event.pointerId].handleLeave(event);
            this._flags.push(InputManagerFlags.POINTER_UPDATE);
        }
        _handlePointerDown(event) {
            this._canvas.focus();
            this._canvasFocused = true;
            this._pointers[event.pointerId].handlePress(event);
            this._flags.push(InputManagerFlags.POINTER_UPDATE);
            event.preventDefault();
        }
        _handlePointerMove(event) {
            this._pointers[event.pointerId].handleMove(event);
            this._flags.push(InputManagerFlags.POINTER_UPDATE);
        }
        _handlePointerUp(event) {
            this._pointers[event.pointerId].handleRelease(event);
            this._flags.push(InputManagerFlags.POINTER_UPDATE);
            event.preventDefault();
        }
        _handlePointerCancel(event) {
            this._pointers[event.pointerId].handleCancel(event);
            this._flags.push(InputManagerFlags.POINTER_UPDATE);
        }
        _handleMouseWheel(event) {
            this._wheelOffset.set(event.deltaX, event.deltaY);
            this._flags.push(InputManagerFlags.MOUSE_WHEEL);
            if (this._canvasFocused) {
                event.preventDefault();
            }
        }
        _handleCanvasFocus() {
            this._canvasFocused = true;
        }
        _handleCanvasBlur() {
            this._canvasFocused = false;
        }
        _handleWindowBlur() {
            this._canvasFocused = false;
        }
        _addEventListeners() {
            const canvas = this._canvas;
            const activeWindow = window;
            const activeListenerOption = { capture: true, passive: false };
            const passiveListenerOption = { capture: true, passive: true };
            activeWindow.addEventListener('keydown', this._keyDownHandler, true);
            activeWindow.addEventListener('keyup', this._keyUpHandler, true);
            activeWindow.addEventListener('blur', this._windowBlurHandler, true);
            canvas.addEventListener('focus', this._canvasFocusHandler, true);
            canvas.addEventListener('blur', this._canvasBlurHandler, true);
            canvas.addEventListener('wheel', this._mouseWheelHandler, activeListenerOption);
            canvas.addEventListener('pointerover', this._pointerOverHandler, passiveListenerOption); // Cancellable
            canvas.addEventListener('pointerleave', this._pointerLeaveHandler, passiveListenerOption);
            canvas.addEventListener('pointerdown', this._pointerDownHandler, activeListenerOption); // Cancellable
            canvas.addEventListener('pointermove', this._pointerMoveHandler, passiveListenerOption); // Cancellable
            canvas.addEventListener('pointerup', this._pointerUpHandler, activeListenerOption); // Cancellable
            canvas.addEventListener('pointercancel', this._pointerCancelHandler, passiveListenerOption);
            canvas.addEventListener('contextmenu', stopEvent, activeListenerOption); // Cancellable
            canvas.addEventListener('selectstart', stopEvent, activeListenerOption); // Cancellable
        }
        _removeEventListeners() {
            const canvas = this._canvas;
            const keyEventTarget = window;
            const activeListenerOption = { capture: true, passive: false };
            const passiveListenerOption = { capture: true, passive: true };
            keyEventTarget.removeEventListener('keydown', this._keyDownHandler, true);
            keyEventTarget.removeEventListener('keyup', this._keyUpHandler, true);
            keyEventTarget.removeEventListener('blur', this._windowBlurHandler, true);
            canvas.removeEventListener('focus', this._canvasFocusHandler, true);
            canvas.removeEventListener('blur', this._canvasBlurHandler, true);
            canvas.removeEventListener('wheel', this._mouseWheelHandler, activeListenerOption);
            canvas.removeEventListener('pointerover', this._pointerOverHandler, passiveListenerOption);
            canvas.removeEventListener('pointerleave', this._pointerLeaveHandler, passiveListenerOption);
            canvas.removeEventListener('pointerdown', this._pointerDownHandler, activeListenerOption);
            canvas.removeEventListener('pointermove', this._pointerMoveHandler, passiveListenerOption);
            canvas.removeEventListener('pointerup', this._pointerUpHandler, activeListenerOption);
            canvas.removeEventListener('pointercancel', this._pointerCancelHandler, passiveListenerOption);
            canvas.removeEventListener('contextmenu', stopEvent, activeListenerOption);
            canvas.removeEventListener('selectstart', stopEvent, activeListenerOption);
        }
        _updateGamepads() {
            const activeGamepads = window.navigator.getGamepads();
            const gamepadSlotsActive = this._gamepadSlotsActive;
            gamepadSlotsActive.fill(0);
            for (const activeGamepad of activeGamepads) {
                if (!activeGamepad) {
                    continue;
                }
                const activeIndex = activeGamepad.index;
                if (activeIndex < 0 || activeIndex >= gamepadSlotsActive.length) {
                    continue;
                }
                gamepadSlotsActive[activeIndex] = 1;
                let gamepad = this._gamepadsByIndex.get(activeIndex);
                if (!gamepad) {
                    gamepad = new Gamepad(activeGamepad, this._channels, this._gamepadMappingResolver);
                    this._gamepadsByIndex.set(activeIndex, gamepad);
                    this._insertGamepadByIndex(gamepad);
                    this.onGamepadConnected.dispatch(gamepad, this._gamepads);
                }
                else {
                    gamepad.connect(activeGamepad);
                }
                gamepad.update();
                this.onGamepadUpdated.dispatch(gamepad, this._gamepads);
            }
            for (let i = this._gamepads.length - 1; i >= 0; i--) {
                const gamepad = this._gamepads[i];
                if (gamepadSlotsActive[gamepad.index] === 0) {
                    gamepad.disconnect();
                    this._gamepads.splice(i, 1);
                    this._gamepadsByIndex.delete(gamepad.index);
                    this.onGamepadDisconnected.dispatch(gamepad, this._gamepads);
                    gamepad.destroy();
                }
            }
            return this;
        }
        _insertGamepadByIndex(gamepad) {
            let insertIndex = 0;
            while (insertIndex < this._gamepads.length && this._gamepads[insertIndex].index < gamepad.index) {
                insertIndex += 1;
            }
            this._gamepads.splice(insertIndex, 0, gamepad);
        }
        _updateEvents() {
            if (this._flags.pop(InputManagerFlags.KEY_DOWN)) {
                for (const channel of this._channelsPressed) {
                    this.onKeyDown.dispatch(channel);
                }
                this._channelsPressed.length = 0;
            }
            if (this._flags.pop(InputManagerFlags.KEY_UP)) {
                for (const channel of this._channelsReleased) {
                    this.onKeyUp.dispatch(channel);
                }
                this._channelsReleased.length = 0;
            }
            if (this._flags.pop(InputManagerFlags.MOUSE_WHEEL)) {
                this.onMouseWheel.dispatch(this._wheelOffset);
                this._wheelOffset.set(0, 0);
            }
            if (this._flags.pop(InputManagerFlags.POINTER_UPDATE)) {
                this._updatePointerEvents();
            }
            return this;
        }
        _updatePointerEvents() {
            for (const pointer of Object.values(this._pointers)) {
                const { stateFlags } = pointer;
                if (stateFlags.value === exports.PointerStateFlag.none) {
                    continue;
                }
                if (stateFlags.pop(exports.PointerStateFlag.over)) {
                    this.onPointerEnter.dispatch(pointer);
                }
                if (stateFlags.pop(exports.PointerStateFlag.down)) {
                    this.onPointerDown.dispatch(pointer);
                }
                if (stateFlags.pop(exports.PointerStateFlag.move)) {
                    this.onPointerMove.dispatch(pointer);
                }
                if (stateFlags.pop(exports.PointerStateFlag.up)) {
                    const { x: startX, y: startY } = pointer.startPos;
                    this.onPointerUp.dispatch(pointer);
                    if (startX >= 0 && startY >= 0) {
                        if (getDistance(startX, startY, pointer.x, pointer.y) < this._pointerDistanceThreshold) {
                            this.onPointerTap.dispatch(pointer);
                        }
                        else {
                            this.onPointerSwipe.dispatch(pointer);
                        }
                    }
                    pointer.startPos.set(-1, -1);
                }
                if (stateFlags.pop(exports.PointerStateFlag.cancel)) {
                    this.onPointerCancel.dispatch(pointer);
                }
                if (stateFlags.pop(exports.PointerStateFlag.leave)) {
                    this.onPointerLeave.dispatch(pointer);
                    delete this._pointers[pointer.id];
                }
            }
        }
    }

    class ResourceContainer {
        constructor() {
            this._resources = new Map();
        }
        get resources() {
            return this._resources;
        }
        get types() {
            return [...this._resources.keys()];
        }
        addType(type) {
            if (!this._resources.has(type)) {
                this._resources.set(type, new Map());
            }
            return this;
        }
        getResources(type) {
            if (!this._resources.has(type)) {
                throw new Error(`Unknown type "${type}".`);
            }
            return this._resources.get(type);
        }
        has(type, name) {
            return this.getResources(type).has(name);
        }
        get(type, name) {
            const resources = this.getResources(type);
            if (!resources.has(name)) {
                throw new Error(`Missing resource "${name}" with type "${type}".`);
            }
            return resources.get(name);
        }
        set(type, name, resource) {
            this.getResources(type).set(name, resource);
            return this;
        }
        remove(type, name) {
            this.getResources(type).delete(name);
            return this;
        }
        clear() {
            for (const container of this._resources.values()) {
                container.clear();
            }
            return this;
        }
        destroy() {
            this.clear();
            this._resources.clear();
        }
    }

    class AbstractResourceFactory {
        constructor() {
            this.objectUrls = [];
        }
        createObjectUrl(blob) {
            const objectUrl = URL.createObjectURL(blob);
            this.objectUrls.push(objectUrl);
            return objectUrl;
        }
        destroy() {
            for (const objectUrl of this.objectUrls) {
                URL.revokeObjectURL(objectUrl);
            }
            this.objectUrls.length = 0;
        }
    }

    class FontFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.font;
        }
        async process(response) {
            return await response.arrayBuffer();
        }
        async create(source, options) {
            const { family, descriptors, addToDocument } = options;
            if (source.byteLength < 4) {
                throw new SyntaxError(`Invalid font data: expected at least 4 bytes, received ${source.byteLength}.`);
            }
            let fontFace = null;
            try {
                fontFace = await new FontFace(family, source, descriptors).load();
            }
            catch (error) {
                throw new SyntaxError(`Invalid font data in ArrayBuffer (${source.byteLength} bytes).`);
            }
            if (addToDocument !== false) {
                document.fonts.add(fontFace);
            }
            return fontFace;
        }
    }

    class ImageFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.image;
        }
        async process(response) {
            return await response.arrayBuffer();
        }
        async create(source, options = {}) {
            const blob = new Blob([source], { type: options.mimeType ?? determineMimeType(source) });
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.addEventListener('load', () => resolve(image));
                image.addEventListener('error', () => reject(Error('Error loading image source.')));
                image.addEventListener('abort', () => reject(Error('Image loading was canceled.')));
                image.src = this.createObjectUrl(blob);
            });
        }
    }

    class JsonFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.json;
        }
        async process(response) {
            return await response.json();
        }
        async create(source) {
            return source;
        }
    }

    class Music extends AbstractMedia {
        constructor(audioElement, options) {
            super(audioElement);
            this._gainNode = null;
            this._sourceNode = null;
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
            if (this._gainNode) {
                this._gainNode.gain.setTargetAtTime(this.muted ? 0 : volume, this._audioContext.currentTime, 10);
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
                if (this._gainNode) {
                    this._gainNode.gain.setTargetAtTime(muted ? 0 : this.volume, this._audioContext.currentTime, 10);
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
            return this._gainNode;
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
            this._sourceNode?.disconnect();
            this._sourceNode = null;
            this._gainNode?.disconnect();
            this._gainNode = null;
        }
        setupWithAudioContext(audioContext) {
            this._audioContext = audioContext;
            this._gainNode = audioContext.createGain();
            this._gainNode.gain.setTargetAtTime(this.muted ? 0 : this.volume, audioContext.currentTime, 10);
            this._gainNode.connect(audioContext.destination);
            this._sourceNode = audioContext.createMediaElementSource(this._audioElement);
            this._sourceNode.connect(this._gainNode);
        }
    }

    const onceListenerOption = { once: true };
    class MusicFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.music;
        }
        async process(response) {
            return await response.arrayBuffer();
        }
        async create(source, options = {}) {
            const { mimeType, loadEvent, playbackOptions } = options;
            const blob = new Blob([source], { type: mimeType ?? determineMimeType(source) });
            return new Promise((resolve, reject) => {
                const audio = document.createElement('audio');
                audio.addEventListener('error', () => reject(Error('Error loading audio source.')), onceListenerOption);
                audio.addEventListener('abort', () => reject(Error('Audio loading was canceled.')), onceListenerOption);
                audio.addEventListener(loadEvent ?? 'canplaythrough', () => resolve(new Music(audio, playbackOptions)), onceListenerOption);
                audio.preload = 'auto';
                audio.src = this.createObjectUrl(blob);
            });
        }
    }

    class Sound extends AbstractMedia {
        constructor(audioBuffer, options) {
            super({
                duration: audioBuffer.duration,
                volume: 1,
                playbackRate: 1,
                loop: false,
                muted: false,
            });
            this._gainNode = null;
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
            return this._gainNode;
        }
        setVolume(value) {
            const volume = clamp(value, 0, 2);
            if (this._volume === volume) {
                return this;
            }
            this._volume = volume;
            if (this._gainNode) {
                this._gainNode.gain.setTargetAtTime(this.muted ? 0 : volume, this._audioContext.currentTime, 10);
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
            if (!this._startTime || !this._audioContext) {
                return 0;
            }
            return (this._currentTime + this._audioContext.currentTime - this._startTime);
        }
        setTime(currentTime) {
            const time = Math.max(0, currentTime);
            if (this.paused || !this._audioContext) {
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
            if (this._gainNode) {
                this._gainNode.gain.setTargetAtTime(muted ? 0 : this.volume, this._audioContext.currentTime, 10);
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
            if (this._audioContext) {
                this.createSourceNode(this._audioContext);
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
            if (this._audioContext) {
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
            this._gainNode?.disconnect();
            this._sourceNode?.disconnect();
        }
        createSourceNode(audioContext) {
            this._sourceNode = audioContext.createBufferSource();
            this._sourceNode.buffer = this._audioBuffer;
            this._sourceNode.loop = this.loop;
            this._sourceNode.playbackRate.value = this.playbackRate;
            this._sourceNode.connect(this._gainNode);
            this._sourceNode.start(0, this._currentTime);
            this._startTime = audioContext.currentTime;
        }
        setupWithAudioContext(audioContext) {
            this._audioContext = audioContext;
            this._gainNode = audioContext.createGain();
            this._gainNode.gain.setTargetAtTime(this.muted ? 0 : this.volume, audioContext.currentTime, 10);
            this._gainNode.connect(audioContext.destination);
            if (!this._paused) {
                this.createSourceNode(this._audioContext);
            }
        }
    }

    class SoundFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.sound;
        }
        async process(response) {
            return await response.arrayBuffer();
        }
        async create(source, options = {}) {
            const audioBuffer = await decodeAudioData(source);
            return new Sound(audioBuffer, options.playbackOptions);
        }
    }

    class TextFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.text;
        }
        async process(response) {
            return await response.text();
        }
        async create(source) {
            return source;
        }
    }

    class TextureFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.image;
        }
        async process(response) {
            return await response.arrayBuffer();
        }
        async create(source, options = {}) {
            const { mimeType, samplerOptions } = options;
            const blob = new Blob([source], { type: mimeType ?? determineMimeType(source) });
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.addEventListener('load', () => resolve(new Texture(image, samplerOptions)));
                image.addEventListener('error', () => reject(Error('Error loading image source.')));
                image.addEventListener('abort', () => reject(Error('Image loading was canceled.')));
                image.src = this.createObjectUrl(blob);
            });
        }
    }

    (function (TransformableFlags) {
        TransformableFlags[TransformableFlags["NONE"] = 0] = "NONE";
        TransformableFlags[TransformableFlags["TRANSLATION"] = 1] = "TRANSLATION";
        TransformableFlags[TransformableFlags["ROTATION"] = 2] = "ROTATION";
        TransformableFlags[TransformableFlags["SCALING"] = 4] = "SCALING";
        TransformableFlags[TransformableFlags["ORIGIN"] = 8] = "ORIGIN";
        TransformableFlags[TransformableFlags["TRANSFORM"] = 15] = "TRANSFORM";
        TransformableFlags[TransformableFlags["TRANSFORM_INV"] = 16] = "TRANSFORM_INV";
    })(exports.TransformableFlags || (exports.TransformableFlags = {}));
    class Transformable {
        constructor() {
            this.flags = new Flags(exports.TransformableFlags.TRANSFORM);
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
            if (this.flags.has(exports.TransformableFlags.TRANSFORM)) {
                this.updateTransform();
                this.flags.remove(exports.TransformableFlags.TRANSFORM);
            }
            return this._transform;
        }
        updateTransform() {
            if (this.flags.has(exports.TransformableFlags.ROTATION)) {
                const radians = degreesToRadians(this._rotation);
                this._cos = Math.cos(radians);
                this._sin = Math.sin(radians);
            }
            if (this.flags.has(exports.TransformableFlags.ROTATION | exports.TransformableFlags.SCALING)) {
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
            this.flags.push(exports.TransformableFlags.TRANSLATION);
        }
        _setRotationDirty() {
            this.flags.push(exports.TransformableFlags.ROTATION);
        }
        _setScalingDirty() {
            this.flags.push(exports.TransformableFlags.SCALING);
        }
        _setOriginDirty() {
            this.flags.push(exports.TransformableFlags.ORIGIN);
        }
    }

    class SceneNode extends Transformable {
        constructor() {
            super(...arguments);
            this.collisionType = 6 /* sceneNode */;
            this._bounds = new Bounds();
            this._globalTransform = new Matrix();
            this._localBounds = new Rectangle();
            this._anchor = new ObservableVector(this._updateOrigin.bind(this), 0, 0);
            this._parent = null;
        }
        get anchor() {
            return this._anchor;
        }
        set anchor(anchor) {
            this._anchor.copy(anchor);
        }
        get parent() {
            return this._parent;
        }
        set parent(parent) {
            this._parent = parent;
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
            if (this._parent) {
                this._parent?.updateParentTransform();
            }
            this.updateTransform();
            return this;
        }
        getGlobalTransform() {
            this._globalTransform.copy(this.getTransform());
            if (this._parent) {
                this._globalTransform.combine(this._parent.getGlobalTransform());
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
                case 6 /* sceneNode */: return intersectionSat(this, target);
                case 2 /* rectangle */: return intersectionSat(this, target);
                case 5 /* polygon */: return intersectionSat(this, target);
                case 3 /* circle */: return intersectionRectCircle(this.getBounds(), target);
                case 4 /* ellipse */: return intersectionRectEllipse(this.getBounds(), target);
                case 1 /* line */: return intersectionLineRect(target, this.getBounds());
                case 0 /* point */: return intersectionPointRect(target, this.getBounds());
                default: return false;
            }
        }
        collidesWith(target) {
            if (this.isAlignedBox) {
                return this.getBounds().collidesWith(target);
            }
            switch (target.collisionType) {
                case 6 /* sceneNode */: return getCollisionSat(this, target);
                case 2 /* rectangle */: return getCollisionSat(this, target);
                case 5 /* polygon */: return getCollisionSat(this, target);
                case 3 /* circle */: return getCollisionSat(this, target);
                default: return null;
            }
        }
        contains(x, y) {
            return this.getBounds().contains(x, y);
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

    class Drawable extends SceneNode {
        constructor() {
            super(...arguments);
            this._visible = true;
            this._tint = Color.white.clone();
            this._blendMode = exports.BlendModes.normal;
        }
        get visible() {
            return this._visible;
        }
        set visible(visible) {
            this._visible = visible;
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
            throw new Error('Method not implemented!');
        }
        inView(view) {
            return view.getBounds().intersectsWith(this.getBounds());
        }
        destroy() {
            super.destroy();
            this._tint.destroy();
        }
    }

    class Container extends Drawable {
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
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
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
            if (child && child.parent === this) {
                child.parent = null;
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
                if (child && child.parent === this) {
                    child.parent = null;
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

    (function (SpriteFlags) {
        SpriteFlags[SpriteFlags["NONE"] = 0] = "NONE";
        SpriteFlags[SpriteFlags["TRANSLATION"] = 1] = "TRANSLATION";
        SpriteFlags[SpriteFlags["ROTATION"] = 2] = "ROTATION";
        SpriteFlags[SpriteFlags["SCALING"] = 4] = "SCALING";
        SpriteFlags[SpriteFlags["ORIGIN"] = 8] = "ORIGIN";
        SpriteFlags[SpriteFlags["TRANSFORM"] = 15] = "TRANSFORM";
        SpriteFlags[SpriteFlags["TRANSFORM_INV"] = 16] = "TRANSFORM_INV";
        SpriteFlags[SpriteFlags["BOUNDING_BOX"] = 32] = "BOUNDING_BOX";
        SpriteFlags[SpriteFlags["TEXTURE_COORDS"] = 64] = "TEXTURE_COORDS";
        SpriteFlags[SpriteFlags["VERTEX_TINT"] = 128] = "VERTEX_TINT";
    })(exports.SpriteFlags || (exports.SpriteFlags = {}));
    class Sprite extends Container {
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
            if (this.flags.pop(exports.SpriteFlags.TEXTURE_COORDS)) {
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
            this.flags.push(exports.SpriteFlags.TEXTURE_COORDS);
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
        render(renderManager) {
            if (this.visible && this.inView(renderManager.view)) {
                const renderer = renderManager.getRenderer(exports.RendererType.sprite);
                renderManager.setRenderer(renderer);
                renderer.render(this);
                for (const child of this.children) {
                    child.render(renderManager);
                }
            }
            return this;
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

    class Video extends Sprite {
        constructor(videoElement, playbackOptions, samplerOptions) {
            super(new Texture(videoElement, samplerOptions));
            this.onStart = new Signal();
            this.onStop = new Signal();
            this._audioContext = null;
            this._volume = 1;
            this._playbackRate = 1;
            this._loop = false;
            this._muted = false;
            this._gainNode = null;
            this._sourceNode = null;
            const { duration, volume, playbackRate, loop, muted } = videoElement;
            this._videoElement = videoElement;
            this._duration = duration;
            this._volume = volume;
            this._playbackRate = playbackRate;
            this._loop = loop;
            this._muted = muted;
            if (playbackOptions) {
                this.applyOptions(playbackOptions);
            }
            if (isAudioContextReady()) {
                this.setupWithAudioContext(getAudioContext());
            }
            else {
                onAudioContextReady.once(this.setupWithAudioContext, this);
            }
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
            return this._gainNode;
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
            if (this._gainNode) {
                this._gainNode.gain.setTargetAtTime(this.muted ? 0 : volume, this._audioContext.currentTime, 10);
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
                if (this._gainNode) {
                    this._gainNode.gain.setTargetAtTime(muted ? 0 : this.volume, this._audioContext.currentTime, 10);
                }
            }
            return this;
        }
        render(renderManager) {
            this.texture.updateSource();
            super.render(renderManager);
            return this;
        }
        destroy() {
            super.destroy();
            this.stop();
            onAudioContextReady.clearByContext(this);
            this._sourceNode?.disconnect();
            this._sourceNode = null;
            this._gainNode?.disconnect();
            this._gainNode = null;
            this.onStart.destroy();
            this.onStop.destroy();
        }
        setupWithAudioContext(audioContext) {
            this._audioContext = audioContext;
            this._gainNode = audioContext.createGain();
            this._gainNode.gain.setTargetAtTime(this.muted ? 0 : this.volume, audioContext.currentTime, 10);
            this._gainNode.connect(audioContext.destination);
            this._sourceNode = audioContext.createMediaElementSource(this._videoElement);
            this._sourceNode.connect(this._gainNode);
        }
    }

    const onceListenerOption$1 = { once: true };
    class VideoFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.video;
        }
        async process(response) {
            return await response.arrayBuffer();
        }
        async create(source, options = {}) {
            const { mimeType, loadEvent, playbackOptions, samplerOptions } = options;
            const blob = new Blob([source], { type: mimeType ?? determineMimeType(source) });
            return new Promise((resolve, reject) => {
                const video = document.createElement('video');
                video.addEventListener('error', () => reject(Error('Video loading error.')), onceListenerOption$1);
                video.addEventListener('abort', () => reject(Error('Video loading error: cancelled.')), onceListenerOption$1);
                video.addEventListener('emptied', () => reject(Error('Video loading error: emptied.')), onceListenerOption$1);
                video.addEventListener('stalled', () => reject(Error('Video loading error: stalled.')), onceListenerOption$1);
                video.addEventListener(loadEvent ?? 'canplaythrough', () => resolve(new Video(video, playbackOptions, samplerOptions)), onceListenerOption$1);
                video.preload = 'auto';
                video.src = this.createObjectUrl(blob);
            });
        }
    }

    class SvgFactory extends AbstractResourceFactory {
        constructor() {
            super(...arguments);
            this.storageName = exports.StorageNames.text;
        }
        async process(response) {
            return await response.text();
        }
        async create(source) {
            const blob = new Blob([source], { type: 'image/svg+xml' });
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.addEventListener('load', () => resolve(image));
                image.addEventListener('error', () => reject(Error('Error loading image source.')));
                image.addEventListener('abort', () => reject(Error('Image loading was canceled.')));
                image.src = this.createObjectUrl(blob);
            });
        }
    }

    class Loader {
        constructor(options) {
            this._factories = new Map();
            this._resources = new ResourceContainer();
            this._queue = [];
            this.onQueueResource = new Signal();
            this.onStartLoading = new Signal();
            this.onLoadResource = new Signal();
            this.onFinishLoading = new Signal();
            const { resourcePath, requestOptions, database } = options;
            this._resourcePath = resourcePath;
            this._requestOptions = requestOptions ?? {};
            this._database = database ?? null;
            this.addFactory(exports.ResourceTypes.font, new FontFactory());
            this.addFactory(exports.ResourceTypes.music, new MusicFactory());
            this.addFactory(exports.ResourceTypes.sound, new SoundFactory());
            this.addFactory(exports.ResourceTypes.video, new VideoFactory());
            this.addFactory(exports.ResourceTypes.image, new ImageFactory());
            this.addFactory(exports.ResourceTypes.texture, new TextureFactory());
            this.addFactory(exports.ResourceTypes.text, new TextFactory());
            this.addFactory(exports.ResourceTypes.json, new JsonFactory());
            this.addFactory(exports.ResourceTypes.svg, new SvgFactory());
        }
        get factories() {
            return this._factories;
        }
        get queue() {
            return this._queue;
        }
        get resources() {
            return this._resources;
        }
        get resourcePath() {
            return this._resourcePath;
        }
        set resourcePath(resourcePath) {
            this._resourcePath = resourcePath;
        }
        get requestOptions() {
            return this._requestOptions;
        }
        set requestOptions(requestOptions) {
            this._requestOptions = requestOptions;
        }
        get database() {
            return this._database;
        }
        set database(database) {
            this._database = database;
        }
        addFactory(type, factory) {
            this._factories.set(type, factory);
            this._resources.addType(type);
            return this;
        }
        getFactory(type) {
            if (!this._factories.has(type)) {
                throw new Error(`No resource factory for type "${type}".`);
            }
            return this._factories.get(type);
        }
        add(type, items, options) {
            if (!this._factories.has(type)) {
                throw new Error(`No resource factory for type "${type}".`);
            }
            for (const [name, path] of Object.entries(items)) {
                this._queue.push({ type, name, path, options });
                this.onQueueResource.dispatch(this._queue[this._queue.length - 1]);
            }
            return this;
        }
        async load(callback) {
            const queue = this._queue.splice(0);
            const length = queue.length;
            let itemsLoaded = 0;
            if (callback) {
                this.onFinishLoading.once(callback, this);
            }
            this.onStartLoading.dispatch(length, itemsLoaded, queue);
            for (const item of queue) {
                this.onLoadResource.dispatch(length, ++itemsLoaded, await this.loadItem(item));
            }
            this.onFinishLoading.dispatch(length, itemsLoaded, this._resources);
            return this._resources;
        }
        async loadItem(queueItem) {
            const { type, name, path, options } = queueItem;
            if (!this._resources.has(type, name)) {
                const factory = this.getFactory(type);
                let source = null;
                let resource = null;
                if (this._database) {
                    source = await this._database.load(factory.storageName, name);
                }
                if (source !== null && source !== undefined) {
                    try {
                        resource = await factory.create(source, options);
                    }
                    catch (error) {
                        if (this._database) {
                            await this._database.delete(factory.storageName, name);
                        }
                        source = null;
                    }
                }
                if (source === null || source === undefined) {
                    const resourcePath = `${this._resourcePath}${path}`;
                    const request = await fetch(resourcePath, this._requestOptions);
                    if (!request.ok) {
                        throw new Error(`Failed to fetch "${type}:${name}" from "${resourcePath}" (${request.status} ${request.statusText}).`);
                    }
                    source = await factory.process(request);
                    if (source instanceof ArrayBuffer && source.byteLength === 0) {
                        throw new Error(`Resource "${type}:${name}" from "${resourcePath}" has no data.`);
                    }
                    resource = await factory.create(source, options);
                    if (this._database) {
                        await this._database.save(factory.storageName, name, source);
                    }
                }
                this._resources.set(type, name, resource);
            }
            return this._resources.get(type, name);
        }
        reset({ signals = true, queue = true, resources = true } = {}) {
            if (signals) {
                this.onQueueResource.clear();
                this.onStartLoading.clear();
                this.onLoadResource.clear();
                this.onFinishLoading.clear();
            }
            if (queue) {
                this._queue.length = 0;
            }
            if (resources) {
                this._resources.clear();
            }
            return this;
        }
        destroy() {
            for (const factory of this._factories.values()) {
                factory.destroy();
            }
            if (this._database) {
                this._database.destroy();
                this._database = null;
            }
            this._factories.clear();
            this._queue.length = 0;
            this._resources.destroy();
            this.onQueueResource.destroy();
            this.onStartLoading.destroy();
            this.onLoadResource.destroy();
            this.onFinishLoading.destroy();
        }
    }

    (function (ApplicationStatus) {
        ApplicationStatus[ApplicationStatus["loading"] = 1] = "loading";
        ApplicationStatus[ApplicationStatus["running"] = 2] = "running";
        ApplicationStatus[ApplicationStatus["halting"] = 3] = "halting";
        ApplicationStatus[ApplicationStatus["stopped"] = 4] = "stopped";
    })(exports.ApplicationStatus || (exports.ApplicationStatus = {}));
    const defaultAppSettings = {
        canvas: document.createElement('canvas'),
        width: 800,
        height: 600,
        clearColor: Color.cornflowerBlue,
        debug: false,
        spriteRendererBatchSize: 4096,
        particleRendererBatchSize: 8192,
        primitiveRendererBatchSize: 65536,
        gamepadMapping: GamepadProfiles.createAutoGamepadMappingResolver(),
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
        database: undefined,
    };
    class Application {
        constructor(appSettings) {
            this.onResize = new Signal();
            this._startupClock = new Clock();
            this._activeClock = new Clock();
            this._frameClock = new Clock();
            this._status = exports.ApplicationStatus.stopped;
            this._frameCount = 0;
            this._frameRequest = 0;
            this.options = { ...defaultAppSettings, ...appSettings };
            this.canvas = this.options.canvas;
            if (!this.canvas.hasAttribute('tabindex')) {
                this.canvas.setAttribute('tabindex', '-1');
            }
            this.loader = new Loader(this.options);
            this.renderManager = new RenderManager(this);
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
        async start(scene) {
            if (this._status === exports.ApplicationStatus.stopped) {
                this._status = exports.ApplicationStatus.loading;
                await this.sceneManager.setScene(scene);
                this._frameRequest = requestAnimationFrame(this._updateHandler);
                this._frameClock.restart();
                this._activeClock.start();
                this._status = exports.ApplicationStatus.running;
            }
            return this;
        }
        update() {
            if (this._status === exports.ApplicationStatus.running) {
                this.inputManager.update();
                this.sceneManager.update(this._frameClock.elapsedTime);
                this.renderManager.display();
                this._frameRequest = requestAnimationFrame(this._updateHandler);
                this._frameClock.restart();
                this._frameCount++;
            }
            return this;
        }
        stop() {
            if (this._status === exports.ApplicationStatus.running) {
                this._status = exports.ApplicationStatus.halting;
                cancelAnimationFrame(this._frameRequest);
                this.sceneManager.setScene(null);
                this._activeClock.stop();
                this._frameClock.stop();
                this._status = exports.ApplicationStatus.stopped;
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
            this.renderManager.destroy();
            this.sceneManager.destroy();
            this._startupClock.destroy();
            this._activeClock.destroy();
            this._frameClock.destroy();
            this.onResize.destroy();
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

    class Scene {
        constructor(prototype) {
            this._app = null;
            if (prototype) {
                Object.assign(this, prototype);
            }
        }
        get app() {
            return this._app;
        }
        set app(app) {
            this._app = app;
        }
        async load(loader) {
            // do nothing
        }
        init(resources) {
            // do nothing
        }
        update(delta) {
            // do nothing
        }
        draw(renderManager) {
            // do nothing
        }
        unload() {
            // do nothing
        }
        destroy() {
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

    class GamepadPromptProfiles {
        static getControlLayoutKeys(profile) {
            return this._controlLayoutKeysByProfile.get(profile) || this._controlLayoutKeysByProfile.get(exports.GamepadProfile.generic);
        }
        static getControlPosition(controlKey) {
            return this._basePositions.get(controlKey) || [0.5, 0.5];
        }
        static buildControlChannelMap(profile) {
            const channelMap = new Map();
            const layoutMap = this._getLayoutMapForProfile(profile);
            const controlLayoutKeys = this.getControlLayoutKeys(profile);
            for (const [controlKey, layoutKey] of controlLayoutKeys) {
                const layoutChannel = layoutMap?.get(layoutKey);
                const fallbackChannel = this._fallbackChannels.get(controlKey);
                const channel = typeof layoutChannel === 'number' ? layoutChannel : fallbackChannel;
                if (typeof channel === 'number') {
                    channelMap.set(controlKey, channel);
                }
            }
            return channelMap;
        }
        static _getLayoutMapForProfile(profile) {
            switch (profile) {
                case exports.GamepadProfile.xbox: return GamepadButtonLayouts.xbox;
                case exports.GamepadProfile.playStation: return GamepadButtonLayouts.playStation;
                case exports.GamepadProfile.nintendoSwitch: return GamepadButtonLayouts.nintendoSwitch;
                case exports.GamepadProfile.generic:
                default: return GamepadButtonLayouts.generic;
            }
        }
    }
    GamepadPromptProfiles.controlKeys = [
        'dPad',
        'dPadUp',
        'dPadDown',
        'dPadLeft',
        'dPadRight',
        'faceTop',
        'faceLeft',
        'faceRight',
        'faceBottom',
        'shoulderLeftBottom',
        'shoulderRightBottom',
        'shoulderLeftTop',
        'shoulderRightTop',
        'select',
        'start',
        'leftStick',
        'rightStick',
    ];
    GamepadPromptProfiles._basePositions = new Map([
        ['dPad', [0.22, 0.58]],
        ['dPadUp', [0.22, 0.50]],
        ['dPadDown', [0.22, 0.66]],
        ['dPadLeft', [0.14, 0.58]],
        ['dPadRight', [0.30, 0.58]],
        ['faceTop', [0.78, 0.50]],
        ['faceLeft', [0.70, 0.58]],
        ['faceRight', [0.86, 0.58]],
        ['faceBottom', [0.78, 0.66]],
        ['shoulderLeftBottom', [0.28, 0.28]],
        ['shoulderRightBottom', [0.72, 0.28]],
        ['shoulderLeftTop', [0.20, 0.16]],
        ['shoulderRightTop', [0.80, 0.16]],
        ['select', [0.46, 0.50]],
        ['start', [0.54, 0.50]],
        ['leftStick', [0.38, 0.66]],
        ['rightStick', [0.62, 0.66]],
    ]);
    GamepadPromptProfiles._fallbackChannels = new Map([
        ['faceTop', Gamepad.faceTop],
        ['faceLeft', Gamepad.faceLeft],
        ['faceRight', Gamepad.faceRight],
        ['faceBottom', Gamepad.faceBottom],
        ['shoulderLeftBottom', Gamepad.shoulderLeftBottom],
        ['shoulderRightBottom', Gamepad.shoulderRightBottom],
        ['shoulderLeftTop', Gamepad.shoulderLeftTop],
        ['shoulderRightTop', Gamepad.shoulderRightTop],
        ['select', Gamepad.select],
        ['start', Gamepad.start],
        ['leftStick', Gamepad.leftStick],
        ['rightStick', Gamepad.rightStick],
        ['dPadUp', Gamepad.dPadUp],
        ['dPadDown', Gamepad.dPadDown],
        ['dPadLeft', Gamepad.dPadLeft],
        ['dPadRight', Gamepad.dPadRight],
    ]);
    GamepadPromptProfiles._controlLayoutKeysByProfile = new Map([
        [exports.GamepadProfile.generic, new Map([
                ['faceTop', 'faceTop'],
                ['faceLeft', 'faceLeft'],
                ['faceRight', 'faceRight'],
                ['faceBottom', 'faceBottom'],
                ['shoulderLeftBottom', 'shoulderLeftBottom'],
                ['shoulderRightBottom', 'shoulderRightBottom'],
                ['shoulderLeftTop', 'shoulderLeftTop'],
                ['shoulderRightTop', 'shoulderRightTop'],
                ['select', 'menuLeft'],
                ['start', 'menuRight'],
                ['leftStick', 'leftStickPress'],
                ['rightStick', 'rightStickPress'],
                ['dPadUp', 'dPadUp'],
                ['dPadDown', 'dPadDown'],
                ['dPadLeft', 'dPadLeft'],
                ['dPadRight', 'dPadRight'],
            ])],
        [exports.GamepadProfile.xbox, new Map([
                ['faceTop', 'y'],
                ['faceLeft', 'x'],
                ['faceRight', 'b'],
                ['faceBottom', 'a'],
                ['shoulderLeftBottom', 'lb'],
                ['shoulderRightBottom', 'rb'],
                ['shoulderLeftTop', 'lt'],
                ['shoulderRightTop', 'rt'],
                ['select', 'view'],
                ['start', 'menu'],
                ['leftStick', 'l3'],
                ['rightStick', 'r3'],
                ['dPadUp', 'dPadUp'],
                ['dPadDown', 'dPadDown'],
                ['dPadLeft', 'dPadLeft'],
                ['dPadRight', 'dPadRight'],
            ])],
        [exports.GamepadProfile.playStation, new Map([
                ['faceTop', 'triangle'],
                ['faceLeft', 'square'],
                ['faceRight', 'circle'],
                ['faceBottom', 'cross'],
                ['shoulderLeftBottom', 'l1'],
                ['shoulderRightBottom', 'r1'],
                ['shoulderLeftTop', 'l2'],
                ['shoulderRightTop', 'r2'],
                ['select', 'create'],
                ['start', 'options'],
                ['leftStick', 'l3'],
                ['rightStick', 'r3'],
                ['dPadUp', 'dPadUp'],
                ['dPadDown', 'dPadDown'],
                ['dPadLeft', 'dPadLeft'],
                ['dPadRight', 'dPadRight'],
            ])],
        [exports.GamepadProfile.nintendoSwitch, new Map([
                ['faceTop', 'x'],
                ['faceLeft', 'y'],
                ['faceRight', 'a'],
                ['faceBottom', 'b'],
                ['shoulderLeftBottom', 'l'],
                ['shoulderRightBottom', 'r'],
                ['shoulderLeftTop', 'zl'],
                ['shoulderRightTop', 'zr'],
                ['select', 'minus'],
                ['start', 'plus'],
                ['leftStick', 'l3'],
                ['rightStick', 'r3'],
                ['dPadUp', 'dPadUp'],
                ['dPadDown', 'dPadDown'],
                ['dPadLeft', 'dPadLeft'],
                ['dPadRight', 'dPadRight'],
            ])],
    ]);

    /**
     * @deprecated Use GenericGamepadMapping.
     */
    class DefaultGamepadMapping extends GenericGamepadMapping {
    }

    class Input {
        constructor(channels, { onStart, onStop, onActive, onTrigger, context, threshold } = {}) {
            this._value = 0;
            this.onStart = new Signal();
            this.onStop = new Signal();
            this.onActive = new Signal();
            this.onTrigger = new Signal();
            this._channels = new Set(Array.isArray(channels) ? channels : [channels]);
            this._triggerTimer = new Timer(milliseconds(threshold ?? Input.triggerThreshold));
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
        get channels() {
            return this._channels;
        }
        get value() {
            return this._value;
        }
        update(channels) {
            this._value = Math.max(0);
            for (const channel of this._channels) {
                this._value = Math.max(channels[channel], this._value);
            }
            if (this._value) {
                if (!this._triggerTimer.running) {
                    this._triggerTimer.restart();
                    this.onStart.dispatch(this._value);
                }
                this.onActive.dispatch(this._value);
            }
            else if (this._triggerTimer.running) {
                this.onStop.dispatch(this._value);
                if (!this._triggerTimer.expired) {
                    this.onTrigger.dispatch(this._value);
                }
                this._triggerTimer.stop();
            }
            return this;
        }
        destroy() {
            this._channels.clear();
            this._triggerTimer.destroy();
            this.onStart.destroy();
            this.onStop.destroy();
            this.onActive.destroy();
            this.onTrigger.destroy();
        }
    }
    Input.triggerThreshold = 300;

    let temp$7 = null;
    class Circle {
        constructor(x = 0, y = 0, radius = 0) {
            this.collisionType = 3 /* circle */;
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
            return new this.constructor(this.x, this.y, this.radius);
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
                case 6 /* sceneNode */: return intersectionRectCircle(target.getBounds(), this);
                case 2 /* rectangle */: return intersectionRectCircle(target, this);
                case 5 /* polygon */: return intersectionCirclePoly(this, target);
                case 3 /* circle */: return intersectionCircleCircle(this, target);
                case 4 /* ellipse */: return intersectionCircleEllipse(this, target);
                case 1 /* line */: return intersectionLineCircle(target, this);
                case 0 /* point */: return intersectionPointCircle(target, this);
                default: return false;
            }
        }
        collidesWith(target) {
            switch (target.collisionType) {
                case 6 /* sceneNode */: return getCollisionCircleRectangle(this, target.getBounds());
                case 2 /* rectangle */: return getCollisionCircleRectangle(this, target);
                case 5 /* polygon */: return getCollisionPolygonCircle(target, this, true);
                case 3 /* circle */: return getCollisionCircleCircle(this, target);
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
            if (temp$7 === null) {
                temp$7 = new Circle();
            }
            return temp$7;
        }
    }
    Circle.collisionSegments = 32;

    class Ellipse {
        constructor(x = 0, y = 0, halfWidth = 0, halfHeight = halfWidth) {
            this.collisionType = 4 /* ellipse */;
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
            return new this.constructor(this.x, this.y, this.rx, this.ry);
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
                case 6 /* sceneNode */: return intersectionRectEllipse(target.getBounds(), this);
                case 2 /* rectangle */: return intersectionRectEllipse(target, this);
                case 5 /* polygon */: return intersectionEllipsePoly(this, target);
                case 3 /* circle */: return intersectionCircleEllipse(target, this);
                case 4 /* ellipse */: return intersectionEllipseEllipse(this, target);
                case 1 /* line */: return intersectionLineEllipse(target, this);
                case 0 /* point */: return intersectionPointEllipse(target, this);
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

    let temp$8 = null;
    class Polygon {
        constructor(points = [], x = 0, y = 0) {
            this.collisionType = 5 /* polygon */;
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
            return new this.constructor(this.points, this.x, this.y);
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
                case 6 /* sceneNode */: return intersectionRectPoly(target.getBounds(), this);
                case 2 /* rectangle */: return intersectionRectPoly(target, this);
                case 5 /* polygon */: return intersectionPolyPoly(this, target);
                case 3 /* circle */: return intersectionCirclePoly(target, this);
                case 4 /* ellipse */: return intersectionEllipsePoly(target, this);
                case 1 /* line */: return intersectionLinePoly(target, this);
                case 0 /* point */: return intersectionPointPoly(target, this);
                default: return false;
            }
        }
        collidesWith(target) {
            switch (target.collisionType) {
                case 6 /* sceneNode */: return getCollisionSat(this, target);
                case 2 /* rectangle */: return getCollisionSat(this, target);
                case 5 /* polygon */: return getCollisionSat(this, target);
                case 3 /* circle */: return getCollisionPolygonCircle(this, target);
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
            if (temp$8 === null) {
                temp$8 = new Polygon();
            }
            return temp$8;
        }
    }

    let temp$9 = null;
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
            return new this.constructor(this.startX, this.startY, this.endX, this.endY);
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
            if (temp$9 === null) {
                temp$9 = new Segment();
            }
            return temp$9;
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

    class ParticleSystem extends Container {
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
        render(renderManager) {
            if (this.visible && this.inView(renderManager.view)) {
                const renderer = renderManager.getRenderer(exports.RendererType.particle);
                renderManager.setRenderer(renderer);
                renderer.render(this);
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

    class DrawableShape extends Container {
        constructor(geometry, color, drawMode = exports.RenderingPrimitives.TRIANGLES) {
            super();
            this.geometry = geometry;
            this.color = color.clone();
            this.drawMode = drawMode;
        }
        render(renderManager) {
            if (this.visible && this.inView(renderManager.view)) {
                const renderer = renderManager.getRenderer(exports.RendererType.primitive);
                renderManager.setRenderer(renderer);
                renderer.render(this);
            }
            return this;
        }
        destroy() {
            super.destroy();
            this.color.destroy();
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
            this.addChild(new DrawableShape(buildLine(startX, startY, endX, endY, this._lineWidth), this._lineColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
            return this;
        }
        drawPath(path) {
            this.addChild(new DrawableShape(buildPath(path, this._lineWidth), this._lineColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
            return this;
        }
        drawPolygon(path) {
            const polygon = buildPolygon(path);
            this.addChild(new DrawableShape(polygon, this._fillColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
            if (this._lineWidth > 0) {
                this.drawPath(polygon.points);
            }
            return this;
        }
        drawCircle(centerX, centerY, radius) {
            const circle = new CircleGeometry(centerX, centerY, radius);
            this.addChild(new DrawableShape(circle, this._fillColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
            if (this._lineWidth > 0) {
                this.drawPath(circle.points);
            }
            return this;
        }
        drawEllipse(centerX, centerY, radiusX, radiusY) {
            const ellipse = buildEllipse(centerX, centerY, radiusX, radiusY);
            this.addChild(new DrawableShape(ellipse, this._fillColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
            if (this._lineWidth > 0) {
                this.drawPath(ellipse.points);
            }
            return this;
        }
        drawRectangle(x, y, width, height) {
            const rectangle = buildRectangle(x, y, width, height);
            this.addChild(new DrawableShape(rectangle, this._fillColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
            if (this._lineWidth > 0) {
                this.drawPath(rectangle.points);
            }
            return this;
        }
        drawStar(centerX, centerY, points, radius, innerRadius = radius / 2, rotation = 0) {
            const star = buildStar(centerX, centerY, points, radius, innerRadius, rotation);
            this.addChild(new DrawableShape(star, this._fillColor, exports.RenderingPrimitives.TRIANGLE_STRIP));
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

    var RenderTextureFlags;
    (function (RenderTextureFlags) {
        RenderTextureFlags[RenderTextureFlags["none"] = 0] = "none";
        RenderTextureFlags[RenderTextureFlags["scaleModeDirty"] = 1] = "scaleModeDirty";
        RenderTextureFlags[RenderTextureFlags["wrapModeDirty"] = 2] = "wrapModeDirty";
        RenderTextureFlags[RenderTextureFlags["premultiplyAlphaDirty"] = 4] = "premultiplyAlphaDirty";
        RenderTextureFlags[RenderTextureFlags["sourceDirty"] = 8] = "sourceDirty";
        RenderTextureFlags[RenderTextureFlags["sizeDirty"] = 16] = "sizeDirty";
    })(RenderTextureFlags || (RenderTextureFlags = {}));
    class RenderTexture extends RenderTarget {
        constructor(width, height, options) {
            super(width, height, false);
            this._source = null;
            this._texture = null;
            this._flags = new Flags();
            const { scaleMode, wrapMode, premultiplyAlpha, generateMipMap, flipY } = { ...RenderTexture.defaultSamplerOptions, ...options };
            this._scaleMode = scaleMode;
            this._wrapMode = wrapMode;
            this._premultiplyAlpha = premultiplyAlpha;
            this._generateMipMap = generateMipMap;
            this._flipY = flipY;
            this._flags.push(RenderTextureFlags.sourceDirty, RenderTextureFlags.sizeDirty, RenderTextureFlags.scaleModeDirty, RenderTextureFlags.wrapModeDirty, RenderTextureFlags.premultiplyAlphaDirty);
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
        connect(gl) {
            if (!this._context) {
                this._context = gl;
                this._texture = gl.createTexture();
                this._framebuffer = gl.createFramebuffer();
                this.bindTexture();
                this.bindFramebuffer();
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);
                this.unbindTexture();
                this.unbindFramebuffer();
            }
            return this;
        }
        disconnect() {
            this.unbindFramebuffer();
            this.unbindTexture();
            if (this._context) {
                this._context.deleteFramebuffer(this._framebuffer);
                this._context.deleteTexture(this._texture);
                this._context = null;
                this._texture = null;
                this._framebuffer = null;
            }
            return this;
        }
        bindTexture(unit) {
            if (!this._context) {
                throw new Error('Texture has to be connected first!');
            }
            const gl = this._context;
            if (unit !== undefined) {
                gl.activeTexture(gl.TEXTURE0 + unit);
            }
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            this.update();
            return this;
        }
        unbindTexture() {
            if (this._context) {
                const gl = this._context;
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            return this;
        }
        setScaleMode(scaleMode) {
            if (this._scaleMode !== scaleMode) {
                this._scaleMode = scaleMode;
                this._flags.push(RenderTextureFlags.scaleModeDirty);
            }
            return this;
        }
        setWrapMode(wrapMode) {
            if (this._wrapMode !== wrapMode) {
                this._wrapMode = wrapMode;
                this._flags.push(RenderTextureFlags.wrapModeDirty);
            }
            return this;
        }
        setPremultiplyAlpha(premultiplyAlpha) {
            if (this._premultiplyAlpha !== premultiplyAlpha) {
                this._premultiplyAlpha = premultiplyAlpha;
                this._flags.push(RenderTextureFlags.premultiplyAlphaDirty);
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
            return this;
        }
        setSize(width, height) {
            if (!this._size.equals({ width, height })) {
                this._size.set(width, height);
                this._defaultView.resize(width, height);
                this.updateViewport();
                this._flags.push(RenderTextureFlags.sizeDirty);
            }
            return this;
        }
        update() {
            if (this._flags.value !== RenderTextureFlags.none && this._context) {
                const gl = this._context;
                if (this._flags.pop(RenderTextureFlags.scaleModeDirty)) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._scaleMode);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._scaleMode);
                }
                if (this._flags.pop(RenderTextureFlags.wrapModeDirty)) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapMode);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapMode);
                }
                if (this._flags.pop(RenderTextureFlags.premultiplyAlphaDirty)) {
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);
                }
                if (this._flags.pop(RenderTextureFlags.sourceDirty)) {
                    if (this._flags.pop(RenderTextureFlags.sizeDirty) || !this._source) {
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
                    }
                    else {
                        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
                    }
                    if (this._generateMipMap) {
                        gl.generateMipmap(gl.TEXTURE_2D);
                    }
                }
            }
            return this;
        }
        destroy() {
            super.destroy();
            this._flags.destroy();
            this._source = null;
            this._texture = null;
        }
    }
    RenderTexture.defaultSamplerOptions = {
        scaleMode: exports.ScaleModes.LINEAR,
        wrapMode: exports.WrapModes.CLAMP_TO_EDGE,
        premultiplyAlpha: true,
        generateMipMap: false,
        flipY: true,
    };

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
                this._context = canvas.getContext('2d');
                this._dirty = true;
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
    }

    exports.AbstractMedia = AbstractMedia;
    exports.AbstractVector = AbstractVector;
    exports.Application = Application;
    exports.AudioAnalyser = AudioAnalyser;
    exports.Bounds = Bounds;
    exports.Circle = Circle;
    exports.CircleGeometry = CircleGeometry;
    exports.Clock = Clock;
    exports.Color = Color;
    exports.ColorAffector = ColorAffector;
    exports.Container = Container;
    exports.DefaultGamepadMapping = DefaultGamepadMapping;
    exports.Drawable = Drawable;
    exports.DrawableShape = DrawableShape;
    exports.DualShockGamepadMapping = DualShockGamepadMapping;
    exports.Ellipse = Ellipse;
    exports.Flags = Flags;
    exports.ForceAffector = ForceAffector;
    exports.Gamepad = Gamepad;
    exports.GamepadButtonLayouts = GamepadButtonLayouts;
    exports.GamepadChannels = GamepadChannels;
    exports.GamepadControl = GamepadControl;
    exports.GamepadMapping = GamepadMapping;
    exports.GamepadProfiles = GamepadProfiles;
    exports.GamepadPromptProfiles = GamepadPromptProfiles;
    exports.GenericGamepadMapping = GenericGamepadMapping;
    exports.Geometry = Geometry;
    exports.Graphics = Graphics;
    exports.Input = Input;
    exports.InputManager = InputManager;
    exports.Interval = Interval;
    exports.Line = Line;
    exports.Matrix = Matrix;
    exports.Music = Music;
    exports.ObservableSize = ObservableSize;
    exports.ObservableVector = ObservableVector;
    exports.Particle = Particle;
    exports.ParticleOptions = ParticleOptions;
    exports.ParticleRenderer = ParticleRenderer;
    exports.ParticleSystem = ParticleSystem;
    exports.PlayStationGamepadMapping = PlayStationGamepadMapping;
    exports.Pointer = Pointer;
    exports.PolarVector = PolarVector;
    exports.Polygon = Polygon;
    exports.PrimitiveRenderer = PrimitiveRenderer;
    exports.Quadtree = Quadtree;
    exports.Random = Random;
    exports.Rectangle = Rectangle;
    exports.RenderBuffer = RenderBuffer;
    exports.RenderManager = RenderManager;
    exports.RenderTarget = RenderTarget;
    exports.RenderTexture = RenderTexture;
    exports.Sampler = Sampler;
    exports.ScaleAffector = ScaleAffector;
    exports.Scene = Scene;
    exports.SceneManager = SceneManager;
    exports.SceneNode = SceneNode;
    exports.Segment = Segment;
    exports.Shader = Shader;
    exports.ShaderAttribute = ShaderAttribute;
    exports.ShaderBlock = ShaderBlock;
    exports.ShaderUniform = ShaderUniform;
    exports.Signal = Signal;
    exports.Size = Size;
    exports.Sound = Sound;
    exports.Sprite = Sprite;
    exports.SpriteRenderer = SpriteRenderer;
    exports.Spritesheet = Spritesheet;
    exports.SwitchGamepadMapping = SwitchGamepadMapping;
    exports.Text = Text;
    exports.TextStyle = TextStyle;
    exports.Texture = Texture;
    exports.Time = Time;
    exports.Timer = Timer;
    exports.TorqueAffector = TorqueAffector;
    exports.Transformable = Transformable;
    exports.UniversalEmitter = UniversalEmitter;
    exports.Vector = Vector;
    exports.VertexArrayObject = VertexArrayObject;
    exports.Video = Video;
    exports.View = View;
    exports.XboxGamepadMapping = XboxGamepadMapping;
    exports.bezierCurveTo = bezierCurveTo;
    exports.buildCircle = buildCircle;
    exports.buildEllipse = buildEllipse;
    exports.buildLine = buildLine;
    exports.buildPath = buildPath;
    exports.buildPolygon = buildPolygon;
    exports.buildRectangle = buildRectangle;
    exports.buildStar = buildStar;
    exports.canvasSourceToDataUrl = canvasSourceToDataUrl;
    exports.clamp = clamp;
    exports.createAutoGamepadMappingResolver = createAutoGamepadMappingResolver;
    exports.createCanvas = createCanvas;
    exports.createGamepadMappingForProfile = createGamepadMappingForProfile;
    exports.createQuadIndices = createQuadIndices;
    exports.decodeAudioData = decodeAudioData;
    exports.degreesPerRadian = degreesPerRadian;
    exports.degreesToRadians = degreesToRadians;
    exports.detectGamepadProfile = detectGamepadProfile;
    exports.determineFontHeight = determineFontHeight;
    exports.determineMimeType = determineMimeType;
    exports.emptyArrayBuffer = emptyArrayBuffer;
    exports.genericGamepadButtons = genericGamepadButtons;
    exports.getAudioContext = getAudioContext;
    exports.getCanvasSourceSize = getCanvasSourceSize;
    exports.getCollisionCircleCircle = getCollisionCircleCircle;
    exports.getCollisionCircleRectangle = getCollisionCircleRectangle;
    exports.getCollisionPolygonCircle = getCollisionPolygonCircle;
    exports.getCollisionRectangleRectangle = getCollisionRectangleRectangle;
    exports.getCollisionSat = getCollisionSat;
    exports.getDistance = getDistance;
    exports.getGamepadLabel = getGamepadLabel;
    exports.getOfflineAudioContext = getOfflineAudioContext;
    exports.getPreciseTime = getPreciseTime;
    exports.getTextureSourceSize = getTextureSourceSize;
    exports.getVoronoiRegion = getVoronoiRegion;
    exports.hours = hours;
    exports.inRange = inRange;
    exports.intersectionCircleCircle = intersectionCircleCircle;
    exports.intersectionCircleEllipse = intersectionCircleEllipse;
    exports.intersectionCirclePoly = intersectionCirclePoly;
    exports.intersectionEllipseEllipse = intersectionEllipseEllipse;
    exports.intersectionEllipsePoly = intersectionEllipsePoly;
    exports.intersectionLineCircle = intersectionLineCircle;
    exports.intersectionLineEllipse = intersectionLineEllipse;
    exports.intersectionLineLine = intersectionLineLine;
    exports.intersectionLinePoly = intersectionLinePoly;
    exports.intersectionLineRect = intersectionLineRect;
    exports.intersectionPointCircle = intersectionPointCircle;
    exports.intersectionPointEllipse = intersectionPointEllipse;
    exports.intersectionPointLine = intersectionPointLine;
    exports.intersectionPointPoint = intersectionPointPoint;
    exports.intersectionPointPoly = intersectionPointPoly;
    exports.intersectionPointRect = intersectionPointRect;
    exports.intersectionPolyPoly = intersectionPolyPoly;
    exports.intersectionRectCircle = intersectionRectCircle;
    exports.intersectionRectEllipse = intersectionRectEllipse;
    exports.intersectionRectPoly = intersectionRectPoly;
    exports.intersectionRectRect = intersectionRectRect;
    exports.intersectionSat = intersectionSat;
    exports.isAudioContextReady = isAudioContextReady;
    exports.isPowerOfTwo = isPowerOfTwo;
    exports.lerp = lerp;
    exports.milliseconds = milliseconds;
    exports.minutes = minutes;
    exports.noop = noop;
    exports.onAudioContextReady = onAudioContextReady;
    exports.playStationGamepadButtons = playStationGamepadButtons;
    exports.primitiveArrayConstructors = primitiveArrayConstructors;
    exports.primitiveByteSizeMapping = primitiveByteSizeMapping;
    exports.primitiveTypeNames = primitiveTypeNames;
    exports.primitiveUploadFunctions = primitiveUploadFunctions;
    exports.quadraticCurveTo = quadraticCurveTo;
    exports.radiansPerDegree = radiansPerDegree;
    exports.radiansToDegrees = radiansToDegrees;
    exports.rand = rand;
    exports.removeArrayItems = removeArrayItems;
    exports.resolveGamepadInfo = resolveGamepadInfo;
    exports.seconds = seconds;
    exports.sign = sign$1;
    exports.stopEvent = stopEvent;
    exports.supportsCodec = supportsCodec;
    exports.supportsEventOptions = supportsEventOptions;
    exports.supportsIndexedDb = supportsIndexedDb;
    exports.supportsPointerEvents = supportsPointerEvents;
    exports.supportsTouchEvents = supportsTouchEvents;
    exports.supportsWebAudio = supportsWebAudio;
    exports.switchGamepadButtons = switchGamepadButtons;
    exports.tau = tau;
    exports.trimRotation = trimRotation;
    exports.xboxGamepadButtons = xboxGamepadButtons;

    return exports;

}({}));
