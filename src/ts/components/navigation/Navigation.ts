import { css, customElement, html, LitElement, property } from 'lit-element';

import $ from 'jquery';
import CodeMirror from 'codemirror';
import { CSSResult } from 'lit-element/src/lib/css-tag';
import { IExampleCategory } from 'src/ts/config';

@customElement('my-navigation')
export default class Navigation extends LitElement {
    @property({type : String}) headline: string = '';
    @property({type : Array}) categories: Array<IExampleCategory> = [];

    public static get styles(): CSSResult {
        return css`
            .container {
                @include transition(all 350ms ease);
                @include unitize(width, 320);
                @include box-shadow(0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12));
                background: $color-navigation;
                position: absolute;
                overflow: visible;
                outline: none;
                height: 100%;
                bottom: 0;
                left: 0;
                top: 0;
            }
            
            .viewport {
                position: absolute;
                overflow: auto;
                width: 100%;
                bottom: 0;
                left: 0;
                top: 0;
            }
            
            .headline {
                @include unitize(height, 64);
                @include unitize(padding, 8, 16);
                @include unitize(line-height, 48);
                @include unitize(font-size, 20);
                font-weight: $font-weight-medium;
                color: $color-white;
                position: relative;
                overflow: hidden;
                cursor: default;
                margin: 0;
            }
        `;
    }
    //
    // public render(): string {
    //     return html`
    //         <nav class="container">
    //             <div class="viewport">
    //                 <h1 class="headline">ExoJS Examples</h1>
    //                 <div class="navigation">
    //                     ${this.categories.map(category => this.renderCategory(category))}
    //                 </div>
    //             </div>
    //         </nav>
    //     `;
    // }
    //
    // private renderCategory(category: IExampleCategory): string {
    //
    //     return html`
    //         <div class="navigation-sub-header">${category.title}</div>
    //         ${category.examples.map(example => this.renderExample(example, category))}
    //     `;
    // }
    //
    // private renderExample(example: IExample, category: IExampleCategory): string {
    //
    //     const clickHandler = (): Promise<void> => this.loadExample(example, category);
    //
    //     return html`<div class="navigation-item" @click="${clickHandler}">${example.title}</div>`;
    // }
    //
    // private async loadExample(example: IExample, category: IExampleCategory): Promise<void> {
    //
    //     if (this.activeExample === example) {
    //         return;
    //     }
    //
    //     this.activeExample = example;
    //
    //     const path = `${category.path}${example.path}`;
    //
    //     this.createExample(path);
    //
    //     window.location.hash = path;
    //     this.setTitle(example.title);
    // }
    //
    // private async createExample(path: string): void {
    //     const source = await this.exampleLoader.loadExampleContent(path);
    //
    //     const $frame: JQuery<HTMLIFrameElement> = $('<iframe>', {
    //         'class': 'preview-frame',
    //         'src': 'preview.html',
    //     });
    //
    //     this.$preview.empty();
    //     this.$preview.append($frame);
    //
    //     $frame.contents()
    //         .find('body')
    //         .append($(`<script>window.onload = function() { ${source} }</script>`));
    //
    //     this.$code.html(source);
    //
    //     if (this.activeEditor) {
    //         $(this.activeEditor.getWrapperElement()).remove();
    //     }
    //
    //     this.activeEditor = CodeMirror.fromTextArea(this.$code[0], {
    //         mode: 'javascript',
    //         theme: 'monokai',
    //         lineNumbers: true,
    //         styleActiveLine: true,
    //         matchBrackets: true,
    //         viewportMargin: Infinity,
    //         lineWrapping: true,
    //         indentUnit: 4,
    //     });
    // }
    //
    // private setTitle(title: string): void {
    //     document.title = `${title} - ExoJS Examples`;
    //     this.title = `Example Code: ${title}`;
    // }
}