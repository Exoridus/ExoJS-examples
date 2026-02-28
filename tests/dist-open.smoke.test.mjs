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
    const server = http.createServer((req, res) => {
        const requestUrl = req.url || '/';

        if (!requestUrl.startsWith(mountPath)) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        const relativePath = decodeURIComponent(requestUrl.slice(mountPath.length).split('?')[0].split('#')[0]);
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

const runSmokeForMountPath = async (mountPath, routeHash = '') => {
    assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html missing. Run `npm run build` first.');

    const server = createStaticServer(mountPath);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

    const address = server.address();
    assert.ok(address && typeof address === 'object', 'Failed to create local test server.');
    const baseUrl = `http://127.0.0.1:${address.port}${mountPath}index.html${routeHash}`;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const pageErrors = [];
    const consoleErrors = [];
    const consoleWarnings = [];
    const exoVendorRequests = [];
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
        if (request.url().includes('/vendor/exo.bundle.js')) {
            exoVendorRequests.push(request.url());
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

        await frame.waitForFunction(
            () =>
                typeof window.Exo !== 'undefined' &&
                typeof window.Exo.Application === 'function' &&
                document.querySelector('canvas') !== null,
            { timeout: 45000 }
        );

        const frameState = await frame.evaluate(() => ({
            hasExo: typeof window.Exo !== 'undefined',
            hasExoApplication: typeof window.Exo?.Application === 'function',
            canvasCount: document.querySelectorAll('canvas').length,
        }));

        const editorState = await page.evaluate(() => {
            const appRoot = document.querySelector('my-app')?.shadowRoot;
            const editorRoot = appRoot?.querySelector('my-editor')?.shadowRoot;
            const editorCodeRoot = editorRoot?.querySelector('my-editor-code')?.shadowRoot;
            const editorElement = editorCodeRoot?.querySelector('.cm-editor');
            const scrollerElement = editorCodeRoot?.querySelector('.cm-scroller');
            const contentElement = editorCodeRoot?.querySelector('.cm-content');
            const text = contentElement?.textContent || '';
            const contentColor = contentElement ? window.getComputedStyle(contentElement).color : null;
            const scrollerDisplay = scrollerElement ? window.getComputedStyle(scrollerElement).display : null;
            const editorHasBaseClass = !!editorElement?.classList.contains('cm-focused') || !!editorElement;

            return {
                hasEditorCodeRoot: !!editorCodeRoot,
                textLength: text.length,
                contentColor,
                scrollerDisplay,
                editorHasBaseClass,
            };
        });

        assert.equal(frameState.hasExo, true, 'Exo vendor did not load in preview iframe.');
        assert.equal(frameState.hasExoApplication, true, 'Exo Application API was not initialized.');
        assert.ok(frameState.canvasCount > 0, 'Example preview did not render any canvas.');
        assert.ok(exoVendorRequests.length > 0, 'No request to local vendor/exo.bundle.js was observed.');
        assert.ok(statsVendorRequests.length > 0, 'No request to local vendor/stats.min.js was observed.');
        assert.equal(editorState.hasEditorCodeRoot, true, 'Code editor root was not rendered.');
        assert.equal(editorState.editorHasBaseClass, true, 'Code editor did not initialize with CodeMirror classes.');
        assert.ok(editorState.textLength > 50, 'Code editor did not render example source text.');
        assert.equal(editorState.scrollerDisplay, 'flex', 'Code editor layout is broken (scroller is not flex).');
        assert.notEqual(editorState.contentColor, 'rgb(0, 0, 0)', 'Code text is rendered black and not visible on dark background.');

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
                throw new Error('CodeMirror editor instance was not found.');
            }

            const markerScript = '\nwindow.__refreshApplied = "ok";\n';
            editorView.dispatch({
                changes: {
                    from: editorView.state.doc.length,
                    to: editorView.state.doc.length,
                    insert: markerScript,
                },
            });
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

        assert.deepEqual(pageErrors, [], `Runtime errors were thrown: ${pageErrors.join(' | ')}`);
        assert.deepEqual(consoleErrors, [], `Console errors were emitted: ${consoleErrors.join(' | ')}`);
        assert.ok(
            !consoleWarnings.some((warning) => warning.toLowerCase().includes('process.env.node_env')),
            `MobX production warning still present: ${consoleWarnings.join(' | ')}`
        );
        assert.deepEqual(localHttpErrors, [], `Local HTTP errors were emitted: ${localHttpErrors.join(' | ')}`);
    } finally {
        await page.close();
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
};

test('dist app opens in nested path and initializes Exo preview without runtime errors', async () => {
    await runSmokeForMountPath(defaultMountPath);
});

test('dist app also works from a deeper nested mount path', async () => {
    await runSmokeForMountPath('/foo/bar/exo-preview/');
});

test('dist display-text example loads font assets without runtime/HTTP errors', async () => {
    await runSmokeForMountPath(defaultMountPath, '#rendering/display-text.js');
});
