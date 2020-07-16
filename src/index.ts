import './components/index';
import { css } from './index.scss';
import { html, render } from 'lit-html';
import { configure } from 'mobx';
import { globalDependencies } from './classes/globalDependencies';
import { injectStyles } from './classes/utils';

injectStyles(css, document.head);

configure({ enforceActions: 'observed' });

globalDependencies
  .loadDependencies({
    requestOptions: {
      cache: 'no-cache',
      method: 'GET',
      mode: 'cors',
    }
  })
  .then(() => render(html`<my-app />`, document.body))
  .catch((error: Error) => console.error('An error occurred while loading dependencies!', error));
