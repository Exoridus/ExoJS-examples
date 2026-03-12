import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import test from 'node:test';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const defaultMountPath = '/nested/exo/';
const examplesCatalogPath = path.join(projectRoot, 'public', 'examples', 'examples.json');
const readmePath = path.join(projectRoot, 'README.md');
const examplesCatalog = JSON.parse(fs.readFileSync(examplesCatalogPath, 'utf8'));
const allExampleRoutes = Object.entries(examplesCatalog).flatMap(([section, examples]) =>
    examples.map((example) => ({
        ...example,
        section,
        routeHash: `#${example.path}`,
    }))
);

const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
        case '.html':
            return 'text/html; charset=utf-8';
        case '.js':
            return 'application/javascript; charset=utf-8';
        case '.json':
            return 'application/json; charset=utf-8';
        case '.css':
            return 'text/css; charset=utf-8';
        case '.svg':
            return 'image/svg+xml';
        case '.png':
            return 'image/png';
        case '.webm':
            return 'video/webm';
        case '.ogg':
            return 'audio/ogg';
        case '.woff2':
            return 'font/woff2';
        default:
            return 'application/octet-stream';
    }
};

const createStaticServer = (mountPath) => {
    const normalizedMountPath = mountPath.endsWith('/') ? mountPath : `${mountPath}/`;
    const bareMountPath = normalizedMountPath.slice(0, -1);
    const server = http.createServer((req, res) => {
        const requestUrl = req.url || '/';

        if (requestUrl === bareMountPath) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
            return;
        }

        if (!requestUrl.startsWith(normalizedMountPath)) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        const relativePath = decodeURIComponent(requestUrl.slice(normalizedMountPath.length).split('?')[0].split('#')[0]);
        const normalizedPath = relativePath === '' ? 'index.html' : relativePath;
        const filePath = path.resolve(distDir, normalizedPath);

        if (!filePath.startsWith(distDir)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
    });

    return server;
};

const runSmokeForMountPath = async (mountPath, routeHash = '', options = {}) => {
    const {
        expectCanvas = true,
        fallbackText = '',
        afterLoad = null,
        entryPath = 'index.html',
        allowMediaOverlay = false,
    } = options;

    assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html missing. Run `npm run build` first.');

    const server = createStaticServer(mountPath);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

    const address = server.address();
    assert.ok(address && typeof address === 'object', 'Failed to create local test server.');
    const trimmedMountPath = mountPath.endsWith('/') ? mountPath.slice(0, -1) : mountPath;
    const baseUrl = entryPath === ''
        ? `http://127.0.0.1:${address.port}${trimmedMountPath}${routeHash}`
        : `http://127.0.0.1:${address.port}${mountPath}${entryPath}${routeHash}`;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const pageErrors = [];
    const consoleErrors = [];
    const consoleWarnings = [];
    const exoModuleRequests = [];
    const legacyBundleRequests = [];
    const statsVendorRequests = [];
    const localHttpErrors = [];

    page.on('pageerror', (error) => {
        pageErrors.push(String(error));
    });

    page.on('console', (message) => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }

        if (message.type() === 'warning') {
            consoleWarnings.push(message.text());
        }
    });

    page.on('requestfinished', (request) => {
        if (request.url().includes('/vendor/exojs/exo.esm.js')) {
            exoModuleRequests.push(request.url());
        }

        if (request.url().includes('/vendor/exojs/exo.bundle.js')) {
            legacyBundleRequests.push(request.url());
        }

        if (request.url().includes('/vendor/stats.min.js')) {
            statsVendorRequests.push(request.url());
        }
    });

    page.on('response', (response) => {
        const requestUrl = response.url();
        const requestStatus = response.status();

        if (requestUrl.startsWith(`http://127.0.0.1:${address.port}${mountPath}`) && requestStatus >= 400) {
            localHttpErrors.push(`${requestStatus}:${requestUrl}`);
        }
    });

    try {
        await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForSelector('my-editor-preview iframe', { timeout: 30000 });

        const iframeHandle = await page.$('my-editor-preview iframe');
        assert.ok(iframeHandle, 'Preview iframe was not rendered.');

        const frame = await iframeHandle.contentFrame();
        assert.ok(frame, 'Could not access preview iframe frame context.');

        await page.waitForFunction(
            ({ expectCanvas, fallbackText, allowMediaOverlay }) => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const iframe = previewRoot?.querySelector('iframe');
                const iframeDocument = iframe?.contentDocument || iframe?.contentWindow?.document;
                const hasCanvas = iframeDocument?.querySelector('canvas') !== null;
                const bodyText = iframeDocument?.body?.innerText || '';
                const hasMediaOverlay = !!previewRoot?.querySelector('[data-role="media-play-overlay"]');

                if (allowMediaOverlay && hasMediaOverlay) {
                    return true;
                }

                return expectCanvas ? hasCanvas : hasCanvas || bodyText.includes(fallbackText);
            },
            { expectCanvas, fallbackText, allowMediaOverlay },
            { timeout: 45000 }
        );

        const frameState = await frame.evaluate(() => ({
            hasImportMap: !!document.querySelector('script[type="importmap"]'),
            canvasCount: document.querySelectorAll('canvas').length,
            bodyText: document.body?.innerText || '',
        }));
        const previewState = await page.evaluate(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;

            return {
                hasMediaOverlay: !!previewRoot?.querySelector('[data-role="media-play-overlay"]'),
            };
        });

        await page.waitForFunction(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const editorCodeElement = editorRoot?.querySelector('my-editor-code');
            const editorCodeRoot = editorCodeElement?.shadowRoot;
            const editorView = editorCodeElement?.editorView;
            const editorElement = editorCodeRoot?.querySelector('.monaco-editor');

            return !!editorCodeRoot && !!editorView && !!editorElement;
        }, { timeout: 45000 });

        const editorState = await page.evaluate(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const editorCodeRoot = editorRoot?.querySelector('my-editor-code')?.shadowRoot;
            const editorCodeElement = editorRoot?.querySelector('my-editor-code');
            const editorElement = editorCodeRoot?.querySelector('.monaco-editor');
            const editorView = editorCodeElement?.editorView;
            const inputArea = editorCodeRoot?.querySelector('.inputarea');
            const monacoStylesheet = editorCodeRoot?.querySelector('link[data-monaco-style="editor-main"]');
            const globalMonacoStylesheet = document.head.querySelector('link[data-monaco-style="editor-main-global"]');
            const monacoWidgetOverrides = document.head.querySelector('style[data-monaco-widget-overrides="true"]');
            const inputAreaStyle = inputArea ? window.getComputedStyle(inputArea) : null;
            const text = editorView?.getValue?.() || '';
            const editorHasBaseClass = !!editorElement && !!editorView;
            const editorOptions = editorView?.getRawOptions?.() || null;

            return {
                hasEditorCodeRoot: !!editorCodeRoot,
                textLength: text.length,
                editorHasBaseClass,
                fixedOverflowWidgets: !!editorOptions?.fixedOverflowWidgets,
                glyphMargin: !!editorOptions?.glyphMargin,
                inputAreaHidden: !inputArea || (
                    inputAreaStyle?.position === 'absolute' &&
                    inputAreaStyle?.opacity === '0' &&
                    inputAreaStyle?.width === '0px'
                ),
                lineDecorationsWidth: editorOptions?.lineDecorationsWidth ?? null,
                lineNumbersMinChars: editorOptions?.lineNumbersMinChars ?? null,
                globalMonacoStylesLoaded: !!globalMonacoStylesheet && (
                    globalMonacoStylesheet.getAttribute('data-loaded') === 'true' ||
                    !!globalMonacoStylesheet.sheet
                ),
                hasMonacoWidgetOverrides: !!monacoWidgetOverrides,
                monacoStylesLoaded: !!monacoStylesheet && (
                    monacoStylesheet.getAttribute('data-loaded') === 'true' ||
                    !!monacoStylesheet.sheet
                ),
            };
        });

        assert.equal(frameState.hasImportMap, true, 'Preview iframe did not expose the module import map.');
        if (expectCanvas) {
            assert.ok(frameState.canvasCount > 0, 'Example preview did not render any canvas.');
        } else {
            assert.ok(
                frameState.canvasCount > 0 ||
                frameState.bodyText.includes(fallbackText) ||
                (allowMediaOverlay && previewState.hasMediaOverlay),
                `Example preview neither rendered a canvas, displayed the expected fallback text, nor exposed the expected media overlay: ${fallbackText}`
            );
        }
        assert.ok(
            allowMediaOverlay || exoModuleRequests.length > 0,
            'No request to local vendor/exojs/exo.esm.js was observed.'
        );
        assert.ok(
            allowMediaOverlay || statsVendorRequests.length > 0,
            'No request to local vendor/stats.min.js was observed.'
        );
        assert.equal(editorState.hasEditorCodeRoot, true, 'Code editor root was not rendered.');
        assert.equal(editorState.editorHasBaseClass, true, 'Code editor did not initialize with Monaco classes.');
        assert.equal(editorState.monacoStylesLoaded, true, 'Monaco stylesheet was not loaded before editor use.');
        assert.equal(editorState.globalMonacoStylesLoaded, true, 'Global Monaco stylesheet was not loaded for overflow widgets.');
        assert.equal(editorState.hasMonacoWidgetOverrides, true, 'Monaco overflow widget overrides were not installed.');
        assert.equal(editorState.fixedOverflowWidgets, true, 'Monaco overflow widgets are not configured as fixed.');
        assert.equal(editorState.glyphMargin, false, 'Monaco glyph margin should be disabled for a tighter gutter.');
        assert.equal(editorState.inputAreaHidden, true, 'Monaco input/IME textarea is visibly rendered.');
        assert.equal(editorState.lineDecorationsWidth, 8, 'Monaco line decoration width drifted.');
        assert.equal(editorState.lineNumbersMinChars, 4, 'Monaco line-number gutter width drifted.');
        assert.ok(editorState.textLength > 50, 'Code editor did not render example source text.');

        const initialIframeUrl = await page.evaluate(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const editorPreviewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
            const iframe = editorPreviewRoot?.querySelector('iframe');
            return iframe?.getAttribute('src') || '';
        });

        await page.evaluate(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const editorCodeElement = editorRoot?.querySelector('my-editor-code');
            const editorView = editorCodeElement?.editorView;

            if (!editorView) {
                throw new Error('Monaco editor instance was not found.');
            }

            const markerScript = '\nwindow.__refreshApplied = "ok";\n';
            editorView.setValue(editorView.getValue() + markerScript);
        });

        await page.evaluate(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const editorCodeRoot = editorRoot?.querySelector('my-editor-code')?.shadowRoot;
            const refreshButton = editorCodeRoot?.querySelector('my-button');

            if (!refreshButton) {
                throw new Error('Refresh button not found.');
            }

            refreshButton.click();
        });

        await page.waitForFunction(
            (previousUrl) => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorPreviewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const iframe = editorPreviewRoot?.querySelector('iframe');
                const currentUrl = iframe?.getAttribute('src') || '';

                return currentUrl !== '' && currentUrl !== previousUrl;
            },
            initialIframeUrl,
            { timeout: 45000 }
        );

        const refreshedIframeHandle = await page.$('my-editor-preview iframe');
        assert.ok(refreshedIframeHandle, 'Preview iframe was not rendered after refresh.');

        const refreshedFrame = await refreshedIframeHandle.contentFrame();
        assert.ok(refreshedFrame, 'Could not access preview iframe after refresh.');

        await refreshedFrame.waitForFunction(() => window.__refreshApplied === 'ok', { timeout: 45000 });

        if (afterLoad) {
            await afterLoad({
                page,
                frame: refreshedFrame,
                baseUrl,
            });
        }

        assert.deepEqual(pageErrors, [], `Runtime errors were thrown: ${pageErrors.join(' | ')}`);
        assert.deepEqual(consoleErrors, [], `Console errors were emitted: ${consoleErrors.join(' | ')}`);
        assert.ok(
            !consoleWarnings.some((warning) => warning.toLowerCase().includes('process.env.node_env')),
            `MobX production warning still present: ${consoleWarnings.join(' | ')}`
        );
        assert.deepEqual(
            legacyBundleRequests,
            [],
            `Legacy bundle requests were emitted: ${legacyBundleRequests.join(' | ')}`
        );
        assert.deepEqual(localHttpErrors, [], `Local HTTP errors were emitted: ${localHttpErrors.join(' | ')}`);
    } finally {
        await page.close();
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
};

const assertMonacoExoPackageSupport = async (page) => {
    const diagnostics = await page.evaluate(async () => {
        const appRoot = document.querySelector('my-app')?.shadowRoot;
        const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
        const editorCodeElement = editorRoot?.querySelector('my-editor-code');
        const editorView = editorCodeElement?.editorView;
        const monaco = window.monaco;

        if (!editorView || !monaco) {
            throw new Error('Monaco editor instance is not available.');
        }

        const model = editorView.getModel();

        if (!model) {
            throw new Error('Monaco model is not available.');
        }

        const supportSource = [
            "import * as Exo from 'exojs';",
            "import * as ExoWebGl2 from 'exojs/webgl2';",
            "import * as ExoWebGpu from 'exojs/webgpu';",
            '',
            'const app = new Exo.Application({ width: 64, height: 64, clearColor: Exo.Color.black });',
            'const webgl2RenderManagerCtor = ExoWebGl2.RenderManager;',
            'const webGpuRenderManagerCtor = ExoWebGpu.WebGpuRenderManager;',
            'app.canvas;',
            'webgl2RenderManagerCtor;',
            'webGpuRenderManagerCtor;',
            '',
        ].join('\n');

        editorView.setValue(supportSource);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const resource = model.uri;
        const markers = monaco.editor.getModelMarkers({ resource });
        const workerFactory = await monaco.languages.typescript.getJavaScriptWorker();
        const worker = await workerFactory(resource);
        const fullText = model.getValue();
        const applicationOffset = fullText.indexOf('Application') + 2;
        const webgl2RenderManagerOffset = fullText.indexOf('RenderManager') + 2;
        const webGpuRenderManagerOffset = fullText.indexOf('WebGpuRenderManager') + 2;
        const applicationQuickInfo = await worker.getQuickInfoAtPosition(resource.toString(), applicationOffset);
        const webgl2RenderManagerQuickInfo = await worker.getQuickInfoAtPosition(
            resource.toString(),
            webgl2RenderManagerOffset
        );
        const webGpuRenderManagerQuickInfo = await worker.getQuickInfoAtPosition(
            resource.toString(),
            webGpuRenderManagerOffset
        );

        return {
            markers: markers.map((marker) => ({
                code: marker.code,
                message: marker.message,
                startLineNumber: marker.startLineNumber,
                startColumn: marker.startColumn,
            })),
            exoHasApplication: !!applicationQuickInfo?.displayParts?.some((part) => part.text.includes('Application')),
            webgl2HasRenderManager: !!webgl2RenderManagerQuickInfo?.displayParts?.some(
                (part) => part.text.includes('RenderManager')
            ),
            webgpuHasRenderManager: !!webGpuRenderManagerQuickInfo?.displayParts?.some(
                (part) => part.text.includes('WebGpuRenderManager')
            ),
        };
    });

    assert.deepEqual(diagnostics.markers, [], `Monaco emitted ExoJS diagnostics: ${JSON.stringify(diagnostics.markers)}`);
    assert.equal(diagnostics.exoHasApplication, true, 'Monaco completions did not expose exojs.Application.');
    assert.equal(
        diagnostics.webgl2HasRenderManager,
        true,
        'Monaco symbol info did not expose exojs/webgl2.RenderManager.'
    );
    assert.equal(
        diagnostics.webgpuHasRenderManager,
        true,
        'Monaco symbol info did not expose exojs/webgpu.WebGpuRenderManager.'
    );
};

const assertExampleDiagnosticsAreSane = async (page, disallowedMarkerFragments) => {
    const markers = await page.evaluate(async () => {
        const appRoot = document.querySelector('my-app')?.shadowRoot;
        const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
        const editorCodeElement = editorRoot?.querySelector('my-editor-code');
        const editorView = editorCodeElement?.editorView;
        const monaco = window.monaco;

        if (!editorView || !monaco) {
            throw new Error('Monaco editor instance is not available.');
        }

        const model = editorView.getModel();

        if (!model) {
            throw new Error('Monaco model is not available.');
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));

        return monaco.editor.getModelMarkers({ resource: model.uri }).map((marker) => ({
            code: String(marker.code || ''),
            message: marker.message,
            severity: marker.severity,
            startLineNumber: marker.startLineNumber,
            startColumn: marker.startColumn,
        }));
    });

    const matchedMarkers = markers.filter((marker) =>
        disallowedMarkerFragments.some((fragment) => marker.message.includes(fragment))
    );

    assert.deepEqual(
        matchedMarkers,
        [],
        `Monaco emitted stale diagnostics for the active example: ${JSON.stringify(matchedMarkers)}`
    );
};

test('dist app opens in nested path and initializes Exo preview without runtime errors', async () => {
    await runSmokeForMountPath(defaultMountPath, '', {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
    });
});

test('dist app also works from a deeper nested mount path', async () => {
    await runSmokeForMountPath('/foo/bar/exo-preview/', '', {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
    });
});

test('dist app also works from a GitHub Pages-style path without a trailing slash', async () => {
    await runSmokeForMountPath(defaultMountPath, '', {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
        entryPath: '',
    });
});

test('examples catalog entries exist on disk and README links match the route hashes', () => {
    const readmeContents = fs.readFileSync(readmePath, 'utf8');
    const missingFiles = [];
    const missingReadmeLinks = [];
    const metadataViolations = [];

    for (const route of allExampleRoutes) {
        const examplePath = path.join(projectRoot, 'public', 'examples', route.path);

        if (!fs.existsSync(examplePath)) {
            missingFiles.push(path.relative(projectRoot, examplePath));
        }

        if (!readmeContents.includes(route.routeHash)) {
            missingReadmeLinks.push(route.routeHash);
        }

        if (route.slug !== path.basename(route.path, '.js')) {
            metadataViolations.push(`${route.routeHash}: slug does not match path basename`);
        }

        if (path.dirname(route.path) !== route.section) {
            metadataViolations.push(`${route.routeHash}: path directory does not match section`);
        }

        if (typeof route.title !== 'string' || route.title.trim() === '') {
            metadataViolations.push(`${route.routeHash}: missing title`);
        }

        if (typeof route.description !== 'string' || route.description.trim() === '') {
            metadataViolations.push(`${route.routeHash}: missing description`);
        }

        if (!Array.isArray(route.tags) || route.tags.length === 0) {
            metadataViolations.push(`${route.routeHash}: missing tags`);
        }

        if (route.backend === 'webgpu' || route.backend === 'advanced') {
            if (typeof route.unsupportedNote !== 'string' || route.unsupportedNote.trim() === '') {
                metadataViolations.push(`${route.routeHash}: missing unsupportedNote`);
            }
        }
    }

    assert.deepEqual(missingFiles, [], `Catalog examples missing on disk: ${missingFiles.join(' | ')}`);
    assert.deepEqual(missingReadmeLinks, [], `README missing example links: ${missingReadmeLinks.join(' | ')}`);
    assert.deepEqual(metadataViolations, [], `Catalog metadata issues detected: ${metadataViolations.join(' | ')}`);
});

test('backend policy stays aligned: normal examples use default backend, webgpu examples stay explicit', () => {
    const policyViolations = [];

    for (const route of allExampleRoutes) {
        const examplePath = path.join(projectRoot, 'public', 'examples', route.path);
        const source = fs.readFileSync(examplePath, 'utf8');
        const hasExplicitWebGpuBackend = source.includes(`backend: { type: 'webgpu' }`);
        const importsWebGpuSubpath = source.includes(`from 'exojs/webgpu'`) || source.includes(`from "exojs/webgpu"`);
        const importsWebGl2Subpath = source.includes(`from 'exojs/webgl2'`) || source.includes(`from "exojs/webgl2"`);

        if (route.section === 'webgpu') {
            if (!hasExplicitWebGpuBackend) {
                policyViolations.push(`${route.routeHash}: missing explicit webgpu backend`);
            }

            if (route.routeHash !== '#webgpu/custom-triangle-renderer.js' && importsWebGpuSubpath) {
                policyViolations.push(`${route.routeHash}: unexpected raw exojs/webgpu import`);
            }

            if (!['webgpu', 'advanced'].includes(route.backend)) {
                policyViolations.push(`${route.routeHash}: webgpu section entry should be labeled webgpu or advanced`);
            }

            continue;
        }

        if (route.backend !== 'core') {
            policyViolations.push(`${route.routeHash}: normal example should be labeled core`);
        }

        if (hasExplicitWebGpuBackend) {
            policyViolations.push(`${route.routeHash}: normal example should use default backend`);
        }

        if (importsWebGpuSubpath) {
            policyViolations.push(`${route.routeHash}: normal example should not import exojs/webgpu`);
        }

        if (importsWebGl2Subpath) {
            policyViolations.push(`${route.routeHash}: normal example should not import exojs/webgl2`);
        }
    }

    assert.deepEqual(policyViolations, [], `Backend policy drift detected: ${policyViolations.join(' | ')}`);
});

test('Monaco resolves current ExoJS package declarations and subpath completions', async () => {
    await runSmokeForMountPath(defaultMountPath, '#webgpu/graphics-basics.js', {
        expectCanvas: false,
        fallbackText: 'requires browser WebGPU support',
        afterLoad: async ({ page }) => {
            await assertMonacoExoPackageSupport(page);
        },
    });
});

test('Monaco does not emit stale diagnostics for valid example scene patterns', async () => {
    await runSmokeForMountPath(defaultMountPath, '#extras/audio-visualisation.js', {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
        allowMediaOverlay: true,
        afterLoad: async ({ page }) => {
            await assertExampleDiagnosticsAreSane(page, [
                'Type \'(loader: Loader) => void\' is not assignable to type \'(loader: Loader) => Promise<void>\'',
                'Argument of type \'"music"\' is not assignable to parameter of type \'ResourceTypes\'',
                'Property \'_music\' does not exist on type \'SceneData\'',
                'Property \'app\' does not exist on type \'SceneData\'',
                'Property \'clear\' does not exist on type \'RenderBackend\'',
            ]);
        },
    });
});

test('editor shows metadata, reports preview errors, and reset restores the original example code', async () => {
    const route = allExampleRoutes.find((example) => example.path === 'rendering/sprite.js');
    assert.ok(route, 'rendering/sprite.js route metadata not found.');

    await runSmokeForMountPath(defaultMountPath, route.routeHash, {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
        afterLoad: async ({ page }) => {
            const initialState = await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorView = editorCodeElement?.editorView;

                return {
                    title: editorRoot?.querySelector('[data-role=\"example-title\"]')?.textContent?.trim() || '',
                    description: editorRoot?.querySelector('[data-role=\"example-description\"]')?.textContent?.trim() || '',
                    tags: Array.from(editorRoot?.querySelectorAll('[data-role=\"example-tags\"] [data-role=\"example-tag\"]') || []).map((element) => element.textContent?.trim() || ''),
                    source: editorView?.getValue?.() || '',
                    sourcePrefix: (editorView?.getValue?.() || '').slice(0, 80),
                };
            });

            assert.equal(initialState.title, route.title, 'Example title was not rendered from metadata.');
            assert.equal(initialState.description, route.description, 'Example description was not rendered from metadata.');
            assert.deepEqual(initialState.tags, route.tags, 'Example tags were not rendered from metadata.');
            assert.ok(initialState.source.length > 50, 'Original editor source was not available.');

            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorView = editorCodeElement?.editorView;

                if (!editorView) {
                    throw new Error('Monaco editor instance was not found.');
                }

                editorView.setValue('throw new Error(\"Intentional preview failure\");');
            });

            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeRoot = editorRoot?.querySelector('my-editor-code')?.shadowRoot;
                const refreshButton = editorCodeRoot?.querySelector('my-button[data-action=\"refresh\"]');

                if (!refreshButton) {
                    throw new Error('Refresh button not found.');
                }

                refreshButton.click();
            });

            await page.waitForFunction(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const errorPanel = editorRoot?.querySelector('[data-role=\"error-panel\"]');

                return (errorPanel?.textContent || '').includes('Intentional preview failure');
            }, { timeout: 45000 });

            page.once('dialog', async (dialog) => {
                await dialog.accept();
            });

            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeRoot = editorRoot?.querySelector('my-editor-code')?.shadowRoot;
                const resetButton = editorCodeRoot?.querySelector('my-button[data-action=\"reset\"]');

                if (!resetButton) {
                    throw new Error('Reset button not found.');
                }

                resetButton.click();
            });

            await page.waitForFunction((originalSource) => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorView = editorCodeElement?.editorView;
                const errorPanel = editorRoot?.querySelector('[data-role=\"error-panel\"]');
                const currentSource = editorView?.getValue?.() || '';

                return currentSource.startsWith(originalSource) && !errorPanel;
            }, initialState.sourcePrefix, { timeout: 45000 });
        },
    });
});

test('clicking a header tag applies the sidebar tag filter and narrows the catalog', async () => {
    const route = allExampleRoutes.find((example) => example.path === 'rendering/sprite.js');
    assert.ok(route, 'rendering/sprite.js route metadata not found.');

    await runSmokeForMountPath(defaultMountPath, route.routeHash, {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
        afterLoad: async ({ page }) => {
            const clickedTag = await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const tagButton = editorRoot?.querySelector('[data-role=\"example-tag\"]');

                if (!(tagButton instanceof HTMLElement)) {
                    throw new Error('No clickable example tag was rendered.');
                }

                const nextTag = tagButton.textContent?.trim() || '';

                tagButton.click();

                return nextTag;
            });

            await page.waitForFunction((expectedTag) => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const navigationRoot = appRoot?.querySelector('my-navigation')?.shadowRoot;
                const filterInput = navigationRoot?.querySelector('#tag-filter');
                return filterInput?.value === expectedTag;
            }, clickedTag, { timeout: 45000 });

            const filterState = await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const navigationRoot = appRoot?.querySelector('my-navigation')?.shadowRoot;
                const filterInput = navigationRoot?.querySelector('#tag-filter');
                const visibleTitles = Array.from(navigationRoot?.querySelectorAll('my-navigation-link') || [])
                    .map((element) => element.shadowRoot?.querySelector('a')?.textContent?.trim() || '')
                    .filter(Boolean);
                const activeLink = Array.from(navigationRoot?.querySelectorAll('my-navigation-link') || [])
                    .find((element) => element.shadowRoot?.querySelector('a[data-active]'));

                return {
                    filterValue: filterInput?.value || '',
                    visibleTitles,
                    activeTitle: activeLink?.shadowRoot?.querySelector('a')?.textContent?.trim() || '',
                };
            });

            assert.ok(route.tags.includes(clickedTag), 'Clicked tag did not come from the current example metadata.');
            assert.equal(filterState.filterValue, clickedTag, 'Sidebar tag filter did not mirror the clicked tag.');
            assert.ok(filterState.visibleTitles.includes(route.title), 'Filtered sidebar hid the active example unexpectedly.');
            assert.equal(filterState.activeTitle, route.title, 'Active sidebar highlight drifted after applying a tag filter.');
            assert.ok(filterState.visibleTitles.length > 0, 'Tag filtering removed all sidebar entries.');
        },
    });
});

test('switching examples keeps the Monaco editor populated and usable', async () => {
    await runSmokeForMountPath(defaultMountPath, '#rendering/sprite.js', {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
        afterLoad: async ({ page }) => {
            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const navigationRoot = appRoot?.querySelector('my-navigation')?.shadowRoot;
                const targetLink = Array.from(navigationRoot?.querySelectorAll('my-navigation-link') || [])
                    .find((element) => element.shadowRoot?.querySelector('a')?.getAttribute('href') === '#rendering/display-text.js');
                const anchor = targetLink?.shadowRoot?.querySelector('a');

                if (!(anchor instanceof HTMLElement)) {
                    throw new Error('Could not find the display-text navigation link.');
                }

                anchor.click();
            });

            await page.waitForFunction(() => window.location.hash === '#rendering/display-text.js', { timeout: 45000 });

            await page.waitForFunction(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorCodeRoot = editorCodeElement?.shadowRoot;
                const editorView = editorCodeElement?.editorView;
                const source = editorView?.getValue?.() || '';
                const loadingOverlay = editorCodeRoot?.querySelector('[class*="loadingOverlay"]');

                return source.includes("new Text('Hello World!'") && !loadingOverlay;
            }, { timeout: 45000 });

            const switchedState = await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorCodeRoot = editorCodeElement?.shadowRoot;
                const editorView = editorCodeElement?.editorView;
                const editorElement = editorCodeRoot?.querySelector('.monaco-editor');

                return {
                    title: editorRoot?.querySelector('[data-role="example-title"]')?.textContent?.trim() || '',
                    sourceLength: editorView?.getValue?.().length || 0,
                    hasEditor: !!editorElement && !!editorView,
                };
            });

            assert.equal(switchedState.title, 'Display Text', 'Example header did not update after navigation.');
            assert.equal(switchedState.hasEditor, true, 'Monaco editor did not remain initialized after navigation.');
            assert.ok(switchedState.sourceLength > 50, 'Monaco editor lost its source content after navigation.');
        },
    });
});

test('media examples show a central play overlay and hide it after activation', async () => {
    await runSmokeForMountPath(defaultMountPath, '#rendering/display-video.js', {
        expectCanvas: false,
        fallbackText: 'does not support WebGL',
        allowMediaOverlay: true,
        afterLoad: async ({ page }) => {
            const previewState = await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const iframe = previewRoot?.querySelector('iframe');
                const iframeDocument = iframe?.contentDocument || iframe?.contentWindow?.document;
                const frameText = iframeDocument?.body?.innerText || '';
                const hasCanvas = !!iframeDocument?.querySelector('canvas');

                return {
                    hasCanvas,
                    hasOverlay: !!previewRoot?.querySelector('[data-role="media-play-overlay"]'),
                    frameText,
                };
            });

            if (!previewState.hasCanvas) {
                assert.ok(
                    previewState.frameText.includes('does not support WebGL'),
                    'Media preview neither rendered nor showed the expected unsupported-backend fallback.'
                );
                return;
            }

            await page.waitForFunction(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                return !!previewRoot?.querySelector('[data-role="media-play-overlay"]');
            }, { timeout: 45000 });

            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const playOverlay = previewRoot?.querySelector('[data-role="media-play-overlay"]');

                if (!(playOverlay instanceof HTMLElement)) {
                    throw new Error('Media play overlay was not rendered.');
                }

                playOverlay.click();
            });

            await page.waitForFunction(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                return !previewRoot?.querySelector('[data-role="media-play-overlay"]');
            }, { timeout: 45000 });

            const mediaIframeUrl = await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const iframe = previewRoot?.querySelector('iframe');
                return iframe?.getAttribute('src') || '';
            });

            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const editorCodeRoot = editorRoot?.querySelector('my-editor-code')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorView = editorCodeElement?.editorView;
                const refreshButton = editorCodeRoot?.querySelector('my-button[data-action="refresh"]');

                if (!editorView || !(refreshButton instanceof HTMLElement)) {
                    throw new Error('Media example refresh controls are unavailable.');
                }

                editorView.setValue(`${editorView.getValue()}\nwindow.__mediaRefreshApplied = true;\n`);
                refreshButton.click();
            });

            await page.waitForFunction((previousUrl) => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const iframe = previewRoot?.querySelector('iframe');
                const currentUrl = iframe?.getAttribute('src') || '';

                return currentUrl !== '' && currentUrl !== previousUrl;
            }, mediaIframeUrl, { timeout: 45000 });

            await page.waitForFunction(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                return !previewRoot?.querySelector('[data-role="media-play-overlay"]');
            }, { timeout: 45000 });

            await page.evaluate(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const navigationRoot = appRoot?.querySelector('my-navigation')?.shadowRoot;
                const targetLink = Array.from(navigationRoot?.querySelectorAll('my-navigation-link') || [])
                    .find((element) => element.shadowRoot?.querySelector('a')?.getAttribute('href') === '#extras/audio-visualisation.js');
                const anchor = targetLink?.shadowRoot?.querySelector('a');

                if (!(anchor instanceof HTMLElement)) {
                    throw new Error('Could not find the audio-visualisation navigation link.');
                }

                anchor.click();
            });

            await page.waitForFunction(() => window.location.hash === '#extras/audio-visualisation.js', { timeout: 45000 });
            await page.waitForFunction(() => {
                const appRoot = document.querySelector('my-app')?.shadowRoot;
                const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
                const previewRoot = editorRoot?.querySelector('my-editor-preview')?.shadowRoot;
                const editorCodeElement = editorRoot?.querySelector('my-editor-code');
                const editorView = editorCodeElement?.editorView;
                const source = editorView?.getValue?.() || '';

                return source.includes('AudioAnalyser') && !previewRoot?.querySelector('[data-role="media-play-overlay"]');
            }, { timeout: 45000 });
        },
    });
});

for (const route of allExampleRoutes) {
    const expectsGracefulFallback = route.section === 'webgpu';
    const fallbackText = expectsGracefulFallback ? 'requires browser WebGPU support' : 'does not support WebGL';
    const allowMediaOverlay = Array.isArray(route.tags) && route.tags.some((tag) => tag === 'audio' || tag === 'video');
    const testLabel = expectsGracefulFallback
        ? `dist route ${route.routeHash} renders or shows a graceful unsupported-environment message`
        : `dist route ${route.routeHash} renders or shows a graceful unsupported-backend message`;

    test(testLabel, async () => {
        await runSmokeForMountPath(defaultMountPath, route.routeHash, {
            expectCanvas: false,
            fallbackText,
            allowMediaOverlay,
        });
    });
}
