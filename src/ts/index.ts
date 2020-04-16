import '../scss/index.scss';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';

import { ExampleLoader } from "./ExampleLoader";

window.document.addEventListener('DOMContentLoaded', async () => {
    const exampleLoader = new ExampleLoader();
    await exampleLoader.init();
});