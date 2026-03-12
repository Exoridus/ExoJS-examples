import './components/App';

import { css } from './index.scss';
import { html, render } from 'lit-html';
import { configure } from 'mobx';
import { globalDependencies } from './classes/globalDependencies';
import { injectStyles } from './classes/utils';

injectStyles(css, document.head);

configure({ enforceActions: 'observed' });

const renderBootError = (error: Error): void => {
    const element = document.createElement('main');

    Object.assign(element.style, {
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        color: '#f4f6fb',
    });

    element.innerHTML = `
        <section style="max-width: 520px; padding: 18px 20px; border-radius: 12px; background: rgba(17, 24, 39, 0.92); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 18px 40px rgba(0,0,0,0.28);">
            <h1 style="margin: 0 0 8px; font-size: 20px;">ExoJS Examples failed to load</h1>
            <p style="margin: 0; line-height: 1.6; color: rgba(244,246,251,0.82);">${error.message}</p>
        </section>
    `;

    document.body.replaceChildren(element);
};

globalDependencies
    .loadDependencies({
        urlConfig: {
            baseUrl: new URL('.', document.baseURI).toString(),
            iframeUrl: 'preview.html',
            assetsDir: 'assets',
            examplesDir: 'examples',
            publicDir: '.',
        },
        requestOptions: {
            cache: 'no-cache',
            method: 'GET',
            mode: 'cors',
        },
    })
    .then(() => render(html`<my-app />`, document.body))
    .catch((error: Error) => {
        console.error('An error occurred while loading dependencies!', error);
        renderBootError(error);
    });
