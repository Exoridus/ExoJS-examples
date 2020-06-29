import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement, property,
    TemplateResult,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('my-loading-spinner')
export default class LoadingSpinner extends LitElement {

    @property({ type: Boolean }) public centered = false;

    public static get styles(): CSSResult {

        return css`
            @keyframes dash-loading {
                0%{
                    stroke-dasharray: 1,200;
                    stroke-dashoffset: 0;
                }
                50%{
                    stroke-dasharray: 89,200;
                    stroke-dashoffset: -35;
                }
                100%{
                    stroke-dasharray: 89,200;
                    stroke-dashoffset: -124;
                }
            }
        
            .loading-indicator {
                width:  100px;
                height:  100px;
                position: relative;
                display: inline-block;
            }
            
            .centered {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
            
            .spinner {
                width:  100px;
                height:  100px;
                animation: spin 3s linear infinite;
                position: relative;
            }
            
            .path {
                animation: dash-loading 1.5s ease-in-out infinite;
                fill: rgba(0, 0, 0, 0);
                stroke: $color-primary;
                stroke-dasharray: 1,200;
                stroke-dashoffset: 0;
                stroke-width: 6;
                stroke-miterlimit: 20;
                stroke-linecap: round;
            }
        `;
    }

    public render(): TemplateResult {

        return html`
            <div class="${classMap({ 'loading-indicator': true, centered: this.centered })}">
                <svg class="spinner">
                    <circle class="path" cx="50" cy="50" r="20"/>
                </svg>
            </div>
        `;
    }
}
