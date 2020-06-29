import { javascript } from '@codemirror/next/lang-javascript';
import { highlightActiveLine } from '@codemirror/next/highlight-selection';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import './components/index';

javascript();
highlightActiveLine();
bracketMatching();
