import { css, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import config from '../config.json';

import $ from 'jquery';
import CodeMirror from 'codemirror';
import { IExample, ILoadExamplesEvent } from "../types";
import { Config } from "../classes/Config";

@customElement('my-app')
export default class App extends LitElement {

  @property({ type: String }) editorTitle = 'Example Code';
  private activeExample: IExample | null = null;
  private activeEditor: CodeMirror.EditorFromTextArea | null = null;
  private config: Config = new Config(config);

  static get styles() {

    return css`
            .app {
                padding: 16px;
                overflow: hidden;
                min-height: 100vh;
                margin-bottom: 57px
            }
        `;
  }

  public render(): TemplateResult {
    return html`
            <div class="page-wrap">
                <my-navigation categories="${this.config.examples}" @click-example="${this.handleExampleClick}"/>
                ${this.renderContent()}
            </div>
        `;
  }

  private renderContent(): TemplateResult {

    return html`
            <main class="main">
                <div class="main-content">
                    <div class="example-preview"></div>
                    <div class="example-editor">
                        <div class="editor-header">
                            <div class="editor-title">${this.editorTitle}</div>
                            <div class="refresh-button">
                                <div class="button-content">REFRESH</div>
                            </div>
                        </div>
                        <div class="editor-content">
                            <textarea class="editor-code"></textarea>
                        </div>
                    </div>
                </div>
            </main>
        `;
  }

  private async handleExampleClick(event: CustomEvent<ILoadExamplesEvent>): Promise<void> {

    const example = event.detail?.example ? ? null;

    if (this.activeExample === example || example === null) {
      return;
    }

    this.activeExample = example;

    const { path, title } = example;

    window.location.hash = path;

    this.setTitle(title);

    await this.initExample(example);
  }

  private async loadExampleText(path: string): Promise<string | null> {

    const { examplesPath, requestOptions } = this.config;

    try {
      const response = await fetch(`${examplesPath}/${path}?no-cache=${Date.now()}`, requestOptions);

      return response && response.text() || null;
    } catch (e) {
      return null;
    }
  }

  private async initExample(example: IExample): Promise<void> {

    const source = await this.loadExampleText(example.path);

    const $frame: JQuery<HTMLIFrameElement> = $('<iframe>', {
      'class': 'preview-frame',
      'src': 'preview.html',
    });

    this.$preview.empty();
    this.$preview.append($frame);

    $frame.contents()
      .find('body')
      .append($(`<script>window.onload = function() { ${source} }</script>`));

    this.$code.html(source);

    if (this.activeEditor) {
      $(this.activeEditor.getWrapperElement()).remove();
    }

    this.activeEditor = CodeMirror.fromTextArea(this.$code[0], {
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      viewportMargin: Infinity,
      lineWrapping: true,
      indentUnit: 4,
    });
  }

  private setTitle(title: string): void {
    document.title = `${title} - ExoJS Examples`;
    this.editorTitle = `Example Code: ${title}`;
  }
}
