import './components/App';

import { css } from './index.scss';
import { html, render } from 'lit-html';
import { configure } from 'mobx';
import { globalDependencies } from './classes/globalDependencies';
import { injectStyles } from './classes/utils';

injectStyles(css, document.head);

configure({ enforceActions: 'observed' });

const resolveBasePath = (pathname: string): string => {
    if (pathname.endsWith('/')) {
        return pathname;
    }

    const lastSegment = pathname.split('/').pop() || '';

    if (lastSegment.includes('.')) {
        return pathname.slice(0, pathname.lastIndexOf('/') + 1) || '/';
    }

    return `${pathname}/`;
};

const { origin, pathname } = window.location;
const basePath = resolveBasePath(pathname);

globalDependencies
    .loadDependencies({
        urlConfig: {
            baseUrl: new URL(basePath, origin).toString(),
            iframeUrl: 'preview.html',
            assetsDir: 'assets',
            examplesDir: 'examples',
            publicDir: 'public',
        },
        requestOptions: {
            cache: 'no-cache',
            method: 'GET',
            mode: 'cors',
        },
    })
    .then(() => render(html`<my-app />`, document.body))
    .catch((error: Error) => console.error('An error occurred while loading dependencies!', error));
