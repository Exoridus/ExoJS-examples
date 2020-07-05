import './index.scss';
import './components/index';
import { html, render } from 'lit-html';
import { javascript } from '@codemirror/next/lang-javascript';
import { highlightActiveLine } from '@codemirror/next/highlight-selection';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import { globalDependencies } from './classes/globalDependencies';

javascript();
highlightActiveLine();
bracketMatching();

globalDependencies
    .loadDependencies({
        requestOptions: {
            cache: 'no-cache',
            method: 'GET',
            mode: 'cors',
        }
    })
    .then(() => render(html`<my-app></my-app>`, window.document.body))
    .catch((error: Error) => console.error('An error occurred while loading dependencies!', error));