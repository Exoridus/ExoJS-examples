import{a as K,b as g,e as T,f as v,g as $,h as W,A as P,c as L,j as A}from"./vendor-lit.k6Ga9zS-.js";import{W as B,a as q,m as J,e as f,K as z,b as V,l as k,U as N,c as U,R as H}from"./vendor-monaco.CzT-X8YP.js";import{b as j}from"./ExampleBrowser.Dd86j8qt.js";const X="exo-code-editor{display:block;width:min(800px,100vw - 48px);margin:0 auto;height:auto;position:relative;overflow:visible;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:#ffffff0d;box-shadow:0 18px 42px #0000002e;box-sizing:border-box}.editor-shell{position:relative}.editor-host{width:100%;min-height:360px;height:480px}.loading-overlay{position:absolute;inset:0;pointer-events:none;background:#1414146b;backdrop-filter:blur(1px)}.diagnostics{margin-left:8px;font-size:12px;line-height:1;color:#ffffff9e}.menu-anchor{position:relative;flex:0 0 auto;margin-left:auto;display:flex;align-items:center;gap:4px}.auto-button{appearance:none;display:flex;align-items:center;justify-content:center;height:22px;padding:0 7px;border:1px solid transparent;border-radius:4px;background:transparent;color:#ffffff6b;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background-color .1s ease-in-out,color .1s ease-in-out,border-color .1s ease-in-out}.auto-button:hover{background-color:#ffffff0f;color:#ffffffb8}.auto-button--active{background-color:#ffffff1a;border-color:#ffffff26;color:#ffffffe6}.more-button{appearance:none;display:flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;border:0;border-radius:50%;background:transparent;color:#ffffffad;cursor:pointer;transition:background-color .1s ease-in-out,color .1s ease-in-out}.more-button:hover,.more-button[data-open]{background-color:#ffffff14;color:#ffffffeb}.menu-dropdown{position:absolute;top:calc(100% + 6px);right:0;z-index:200;min-width:140px;padding:4px;background:#232323;border:1px solid rgba(255,255,255,.1);border-radius:9px;box-shadow:0 8px 24px #0006;box-sizing:border-box}.menu-item{display:flex;align-items:center;width:100%;padding:7px 10px;border:0;border-radius:6px;background:transparent;color:#ffffffd1;font-size:13px;font-weight:500;text-align:left;cursor:pointer;transition:background-color 80ms ease-in-out}.menu-item:hover{background-color:#ffffff14}.menu-item:disabled{opacity:.36;cursor:default}.menu-item[data-variant=danger]{color:#ffa0a0e6}.file-input{display:none}.monaco-error-zone{display:flex;align-items:center;gap:5px;padding:0 16px;height:22px;font-size:11.5px;font-family:JetBrains Mono,Consolas,monospace;line-height:22px;overflow:hidden;color:#ff8c8ce0;border-left:2px solid rgba(255,100,100,.5);background:#b41e1e1f;box-sizing:border-box}.monaco-error-zone--warning{color:#ffd278e0;border-left-color:#ffbe3c80;background:#a078141a}.monaco-error-zone__msg{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:1119px){exo-code-editor{width:100%;max-width:none;margin:0;border:0;border-radius:0;background:transparent;box-shadow:none}}",Y=":host{display:flex;align-items:center;gap:10px;min-height:0;margin:0;padding:12px 16px 10px;box-sizing:border-box;border-bottom:1px solid rgba(255,255,255,.06)}.title{flex:1 0 auto;line-height:1.1;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#ffffff94}::slotted([data-role=toolbar-status]){margin-left:8px;font-size:12px;color:#ffffff9e}";var G=Object.defineProperty,Q=Object.getOwnPropertyDescriptor,Z=(e,t,r,o)=>{for(var i=o>1?void 0:o?Q(t,r):t,n=e.length-1,s;n>=0;n--)(s=e[n])&&(i=(o?s(t,r,i):s(i))||i);return o&&i&&G(t,r,i),i};let E=class extends T{constructor(){super(...arguments),this.title=""}render(){return v`
      <div class="title">${this.title}</div>
      <slot></slot>
    `}};E.styles=K(Y);Z([g({type:String})],E.prototype,"title",2);E=Z([$("exo-toolbar")],E);const ee=".button{transition:background-color .3s linear;height:32px;min-width:56px;padding:0 8px;letter-spacing:.4px;font-size:12px;border-radius:var(--button-radius, 2px);display:inline-flex;align-items:center;justify-content:center;text-transform:uppercase;text-align:center;font-weight:500;position:relative;border:0 none;outline:none;background-color:#0000;color:#ff0;cursor:pointer}.button:hover,.button:focus{background-color:#ffffff1f}.button:active{background-color:#ffffff40}.button:disabled{opacity:.4;cursor:default;pointer-events:none}.danger{color:#ff8a8a}.danger:hover,.danger:focus{background-color:#ff676729}.danger:active{background-color:#ff67673d}";var te=Object.defineProperty,oe=Object.getOwnPropertyDescriptor,R=(e,t,r,o)=>{for(var i=o>1?void 0:o?oe(t,r):t,n=e.length-1,s;n>=0;n--)(s=e[n])&&(i=(o?s(t,r,i):s(i))||i);return o&&i&&te(t,r,i),i};let _=class extends T{constructor(){super(...arguments),this.disabled=!1,this.flat=!1,this.variant="default"}render(){return v`
      <button
        ?disabled=${this.disabled}
        class=${W({button:!0,flat:this.flat,danger:this.variant==="danger"})}
      >
        <slot></slot>
      </button>
    `}};_.styles=K(ee);R([g({type:Boolean})],_.prototype,"disabled",2);R([g({type:Boolean})],_.prototype,"flat",2);R([g({type:String})],_.prototype,"variant",2);_=R([$("exo-button")],_);var re=Object.defineProperty,ie=Object.getOwnPropertyDescriptor,m=(e,t,r,o)=>{for(var i=o>1?void 0:o?ie(t,r):t,n=e.length-1,s;n>=0;n--)(s=e[n])&&(i=(o?s(t,r,i):s(i))||i);return o&&i&&re(t,r,i),i};const ne=[{path:"vendor/exojs/exo.d.ts",virtualPath:"file:///node_modules/exojs/dist/exo.d.ts"},{path:"vendor/exojs/module-shims.d.ts",virtualPath:"file:///node_modules/exojs/dist/module-shims.d.ts"},{path:"examples/shared/runtime.d.ts",virtualPath:"file:///node_modules/@examples/runtime/index.d.ts"},{path:"examples/shared/editor-support.d.ts",virtualPath:"file:///node_modules/@examples/editor-support/index.d.ts"}];let M=null,I=!1,D=!1,F=null,C=null,O=null;const se='"JetBrains Mono", Consolas, "SFMono-Regular", Menlo, Monaco, "Courier New", monospace';function ae(e,t){let r=null;switch(e){case"Texture":case"HTMLImageElement":r="image";break;case"FontFace":r="font";break;case"Music":case"Sound":r="audio";break;case"Json":r="json";break;case"SvgAsset":r="svg";break;case"Video":r="video";break}return r?(t[r]??[]).map(o=>`${r}/${o}`):[]}function le(e,t,r){const o=e.getLineContent(t.lineNumber),i=t.column-1;let n="",s=-1;for(let c=i-1;c>=0;c--){const w=o[c];if(w==='"'||w==="'"){n=w,s=c;break}if(w==="{"||w==="}"||w===";")break}if(s===-1)return null;let a=s-1;for(;a>=0&&(o[a]===" "||o[a]==="	");)a--;if(a<0||o[a]!==":")return null;let x=o.length;for(let c=i;c<o.length;c++)if(o[c]===n){x=c;break}const p=Math.max(1,t.lineNumber-30),d=e.getValueInRange({startLineNumber:p,startColumn:1,endLineNumber:t.lineNumber,endColumn:t.column}),y=/loader\.load\(\s*([A-Z][A-Za-z]*)\s*,/g;let h=null,b;for(;(b=y.exec(d))!==null;)h=b;if(!h)return null;const l=ae(h[1],r);if(!l.length)return null;const S={startLineNumber:t.lineNumber,startColumn:s+2,endLineNumber:t.lineNumber,endColumn:x+1};return{suggestions:l.map(c=>({label:c,kind:k.CompletionItemKind.File,insertText:c,range:S})),incomplete:!1}}let u=class extends T{constructor(){super(...arguments),this.sourceCode=null,this.sourcePath=null,this.canReset=!1,this.exampleTitle="Loading...",this._diagnosticsCount=0,this._hasPendingChanges=!1,this._showMenu=!1,this._autoRefresh=!1,this.editorView=null,this._editorModel=null,this._markerListener=null,this._hoverMouseListeners=[],this._autoRefreshTimer=null,this._errorZoneMap=new Map}createRenderRoot(){return this}render(){return v`
      <exo-toolbar title=${`Edit Code: ${this.exampleTitle}`}>
        ${this._diagnosticsCount>0?v`<span class="diagnostics" data-role="toolbar-status">${this._diagnosticsCount} diagnostic${this._diagnosticsCount===1?"":"s"}</span>`:P}
        <div class="menu-anchor">
          <button
            class="auto-button${this._autoRefresh?" auto-button--active":""}"
            title="Auto-refresh the preview on every code change (800ms debounce)"
            @click=${this._toggleAutoRefresh}
          >Auto</button>
          <button
            class="more-button"
            title="Refresh preview (Ctrl+Enter)"
            @click=${this._triggerRefreshPreview}
          >
            <svg viewBox="0 0 16 16" width="1em" height="1em" style="display:block" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
          <button
            class="more-button"
            aria-label="More options"
            aria-expanded=${String(this._showMenu)}
            ?data-open=${this._showMenu}
            @click=${this._onToggleMenu}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
              <circle cx="10" cy="4.5" r="1.5"/>
              <circle cx="10" cy="10" r="1.5"/>
              <circle cx="10" cy="15.5" r="1.5"/>
            </svg>
          </button>
          ${this._showMenu?v`
            <div class="menu-dropdown" role="menu">
              <button class="menu-item" role="menuitem" @click=${this._exportCode}>Export Code</button>
              <button class="menu-item" role="menuitem" @click=${this._importCode}>Import Code</button>
              <button
                class="menu-item"
                role="menuitem"
                data-variant="danger"
                ?disabled=${!this.canReset}
                @click=${this._resetCode}
              >Reset Code</button>
            </div>
          `:P}
        </div>
      </exo-toolbar>
      <input class="file-input" type="file" accept=".js" @change=${this._onFileImport}>
      <div class="editor-shell">
        <div class="editor-host"></div>
        ${this.sourceCode?P:v`<div class="loading-overlay"><exo-spinner centered></exo-spinner></div>`}
      </div>
    `}updated(e){if(!e.has("sourceCode")&&!e.has("sourcePath")||this.sourceCode===null){this.sourceCode===null&&(this._hasPendingChanges=!1);return}this._ensureEditorState(this.sourceCode,this.sourcePath)}connectedCallback(){super.connectedCallback();const e=this.getRootNode();if((e instanceof ShadowRoot||e instanceof Document)&&!e.querySelector("style[data-exo-code-editor-styles]")){const t=document.createElement("style");t.setAttribute("data-exo-code-editor-styles",""),t.textContent=X,(e instanceof ShadowRoot?e:document.head).appendChild(t)}this._menuClickOutsideHandler=t=>{if(!this._showMenu)return;const r=t.composedPath(),o=this.renderRoot.querySelector(".menu-anchor");o&&r.includes(o)||(this._showMenu=!1)},document.addEventListener("click",this._menuClickOutsideHandler)}disconnectedCallback(){super.disconnectedCallback(),this._menuClickOutsideHandler&&(document.removeEventListener("click",this._menuClickOutsideHandler),this._menuClickOutsideHandler=void 0),this._autoRefreshTimer!==null&&(clearTimeout(this._autoRefreshTimer),this._autoRefreshTimer=null),O=null,this._clearInlineErrors(),this._detachEditorKeydownHandler(),this._editorModel?.dispose(),this._editorModel=null,this._markerListener?.dispose(),this._markerListener=null;for(const e of this._hoverMouseListeners)e.dispose();this._hoverMouseListeners=[],this.editorView?.dispose(),this.editorView=null}async _ensureEditorState(e,t){if(await this._configureMonacoOnce(),this._ensureMonacoStyles(),!!this._editorHostElement){if(this.editorView===null){await Promise.all([document.fonts.load('400 14px "JetBrains Mono"'),document.fonts.load('500 14px "JetBrains Mono"')]),this._initializeEditor(e,t);return}this._updateEditorModel(e,t),this.editorView.layout()}}_initializeEditor(e,t){if(!(!this._editorHostElement||this.editorView!==null)){window.MonacoEnvironment={getWorker(r,o){return o==="typescript"||o==="javascript"?new B:new q}},window.monaco=J,this._editorModel=this._createModel(e,t),this.editorView=f.create(this._editorHostElement,{model:this._editorModel,theme:"vs-dark",automaticLayout:!0,useShadowDOM:!1,fixedOverflowWidgets:!0,fontFamily:se,fontSize:14,glyphMargin:!1,hover:{delay:250,enabled:!0,sticky:!0,hidingDelay:300},lineDecorationsWidth:8,lineHeight:21,lineNumbersMinChars:4,minimap:{enabled:!1},overviewRulerLanes:0,renderValidationDecorations:"on",scrollBeyondLastLine:!1,tabSize:4}),this.editorView.onDidChangeModelContent(()=>{this._syncPendingChangesFromEditor(),this._autoRefresh&&this._hasPendingChanges&&(this._autoRefreshTimer!==null&&clearTimeout(this._autoRefreshTimer),this._autoRefreshTimer=setTimeout(()=>{this._autoRefreshTimer=null,this._autoRefresh&&this._triggerRefreshPreview()},800))}),this._attachCtrlSHandler(),this.editorView.addCommand(z.CtrlCmd|V.Enter,()=>this._triggerRefreshPreview()),typeof V.KeyS=="number"&&this.editorView.addCommand(z.CtrlCmd|V.KeyS,()=>this._triggerRefreshPreview());{let r=null,o=null,i="",n="",s=null;const a=()=>(!s&&this.editorView&&(s=this.editorView.getContribution("editor.contrib.contentHover")),s),x=()=>{o!==null&&(clearTimeout(o),o=null);const p=a();p&&(p.shouldKeepOpenOnEditorMouseMoveOrLeave=!1)};this._hoverMouseListeners.push(this.editorView.onMouseMove(p=>{if(p.target.type!==6||!p.target.position){if(n!==""){const l=a();l&&!l.shouldKeepOpenOnEditorMouseMoveOrLeave&&(l.shouldKeepOpenOnEditorMouseMoveOrLeave=!0,o!==null&&clearTimeout(o),o=setTimeout(()=>{o=null,l&&(l.shouldKeepOpenOnEditorMouseMoveOrLeave=!1)},400))}return}const d=p.target.position,y=this._editorModel;if(!y)return;const h=y.getWordAtPosition(d),b=h?`${d.lineNumber}:${h.startColumn}-${h.endColumn}`:`${d.lineNumber}:${d.column}`;if(b===n){const l=a();l&&(o!==null&&(clearTimeout(o),o=null),l.shouldKeepOpenOnEditorMouseMoveOrLeave=!0);return}x(),b!==i&&(i=b,r!==null&&clearTimeout(r),r=setTimeout(()=>{if(r=null,i="",!this.editorView)return;const l=a();if(!l?.showContentHover)return;const S=h?new H(d.lineNumber,h.startColumn,d.lineNumber,h.endColumn):new H(d.lineNumber,d.column,d.lineNumber,d.column+1);n=b,l.showContentHover(S,1,0,!1)},250))})),this._hoverMouseListeners.push(this.editorView.onMouseLeave(()=>{i="",n=""}))}for(const r of this._getMonacoStyleContainers())r.querySelector('style[data-monaco-widget-overrides="true"]')?.remove(),this._ensureMonacoWidgetOverrides(r);O=r=>this._showInlineErrorForLine(r),F=this.editorView.addCommand(0,()=>{C!==null&&(O?.(C),C=null)})??null,I||(I=!0,k.registerHoverProvider("javascript",{provideHover:(r,o)=>{const i=F;if(!i)return null;const n=f.getModelMarkers({resource:r.uri}).filter(a=>a.severity>=4&&a.startLineNumber<=o.lineNumber&&a.endLineNumber>=o.lineNumber);if(!n.length)return null;C=o.lineNumber;const s=n[0];return{contents:[{value:`[$(arrow-right) View Error Inline](command:${i})`,isTrusted:!0,supportThemeIcons:!0}],range:{startLineNumber:s.startLineNumber,startColumn:s.startColumn,endLineNumber:s.endLineNumber,endColumn:s.endColumn}}}})),this._remeasureEditorFonts(),requestAnimationFrame(()=>this.editorView?.layout()),setTimeout(()=>this.editorView?.layout(),0),setTimeout(()=>this.editorView?.layout(),120),document.fonts.ready.then(()=>{this.editorView&&(this._remeasureEditorFonts(),this.editorView.layout())}),this._installDiagnosticsTracking(),this._updateDiagnostics(),this._syncPendingChangesFromEditor(),this._ensureInputAreaMetadata()}}_updateEditorModel(e,t){if(this.editorView===null)return;const r=N.parse(this._getModelUrl(t)).toString();if(!this._editorModel||this._editorModel.uri.toString()!==r){this._editorModel?.dispose(),this._editorModel=this._createModel(e,t),this.editorView.setModel(this._editorModel),this._clearInlineErrors(),this._updateDiagnostics(),this._syncPendingChangesFromEditor();return}this._editorModel.getValue()!==e&&this._editorModel.setValue(e),this._syncPendingChangesFromEditor()}_createModel(e,t){return f.createModel(e,"javascript",N.parse(this._getModelUrl(t)))}_ensureMonacoStyles(){for(const e of this._getMonacoStyleContainers())this._ensureMonacoCss(e),this._ensureMonacoWidgetOverrides(e)}_ensureMonacoCss(e){if(e.querySelector('style[data-monaco-style="editor-main"]'))return;const t=document.createElement("style");t.dataset.monacoStyle="editor-main",t.textContent=U,e.appendChild(t)}_getMonacoStyleContainers(){const e=[document.head],t=this.getRootNode();return t instanceof ShadowRoot&&e.push(t),e}_ensureMonacoWidgetOverrides(e){if(e.querySelector('style[data-monaco-widget-overrides="true"]'))return;const t=document.createElement("style");t.dataset.monacoWidgetOverrides="true",t.textContent=`
      /* ── Suggest / autocomplete ──────────────────────────────────────── */
      .suggest-widget,
      .monaco-editor .suggest-widget,
      .suggest-details,
      .monaco-editor .suggest-details,
      .parameter-hints-widget {
        z-index: 12000 !important;
        pointer-events: auto !important;
        background: #171b23 !important;
        color: #f2f5fb !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 18px 38px rgba(0, 0, 0, 0.34) !important;
        width: max-content !important;
        min-width: 320px !important;
        max-width: min(960px, calc(100vw - 32px)) !important;
      }
      .suggest-widget .details, .suggest-widget .monaco-list,
      .suggest-widget .monaco-list-rows, .suggest-details,
      .suggest-details .monaco-scrollable-element,
      .parameter-hints-widget {
        background-color: #171b23 !important; color: #f2f5fb !important; opacity: 1 !important;
        max-width: none !important; width: auto !important;
      }
      .suggest-widget .tree, .suggest-widget .monaco-list, .suggest-widget .monaco-list-row,
      .suggest-widget .monaco-list-row > .contents, .suggest-details .body,
      .suggest-details-container {
        width: auto !important; min-width: 0 !important; overflow: visible !important;
      }
      .suggest-widget .monaco-list-row > .contents, .suggest-details .documentation,
      .suggest-details .header, .suggest-details .type {
        white-space: normal !important; max-width: none !important;
        overflow: visible !important; color: #f2f5fb !important;
      }
      .suggest-widget .monaco-list-row, .suggest-widget .monaco-list-row .contents,
      .suggest-widget .monaco-highlighted-label, .suggest-details .documentation,
      .suggest-details .header, .suggest-details .type,
      .parameter-hints-widget .signature, .parameter-hints-widget .docs {
        color: #f2f5fb !important; opacity: 1 !important;
      }
      .suggest-widget .details-label, .suggest-widget .details-type-label,
      .suggest-details .monaco-tokenized-source {
        white-space: normal !important; line-height: 1.35 !important;
      }
      .suggest-widget .monaco-list-row.focused,
      .suggest-widget .monaco-list-row:hover {
        background: rgba(255, 255, 255, 0.08) !important;
      }
      /* ── Hover widget ───────────────────────────────────────────────── */
      .monaco-editor-hover,
      .monaco-hover,
      .monaco-resizable-hover {
        z-index: 12000 !important;
        pointer-events: auto !important;
        background: var(--vscode-editorHoverWidget-background, #1e2028) !important;
        color: var(--vscode-editorHoverWidget-foreground, #f2f5fb) !important;
        border: 1px solid var(--vscode-editorHoverWidget-border, rgba(255,255,255,0.12)) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45) !important;
        border-radius: 4px !important;
      }
      .monaco-editor-hover .hover-row,
      .monaco-editor-hover .markdown-hover,
      .monaco-editor-hover .hover-contents,
      .monaco-editor-hover p,
      .monaco-editor-hover code {
        background: transparent !important;
        color: inherit !important;
      }
      .monaco-editor-hover hr {
        border-color: rgba(255, 255, 255, 0.08) !important;
      }
      /* ── Context menu ────────────────────────────────────────────────── */
      .context-view.monaco-menu-container {
        z-index: 12000 !important;
        pointer-events: auto !important;
      }
      .context-view.monaco-menu-container .monaco-list,
      .context-view.monaco-menu-container .monaco-list-row,
      .context-view.monaco-menu-container .action-item {
        width: auto !important; min-width: 0 !important; overflow: visible !important;
      }
      .context-view.monaco-menu-container .action-label {
        white-space: normal !important; max-width: none !important;
        overflow: visible !important; color: #f2f5fb !important;
      }
      .context-view.monaco-menu-container .action-item,
      .context-view.monaco-menu-container .action-label {
        color: #f2f5fb !important; opacity: 1 !important;
      }
      .context-view.monaco-menu-container .action-item.focused,
      .context-view.monaco-menu-container .action-item:hover {
        background: rgba(255, 255, 255, 0.08) !important;
      }
      .monaco-menu {
        background: #232323 !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 9px !important;
        padding: 4px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        overflow: hidden !important;
      }
      .monaco-menu .monaco-action-bar { background: transparent !important; }
      .monaco-menu .action-item { padding: 0 !important; margin: 0 !important; }
      .monaco-menu .action-label {
        font-size: 12px !important;
        padding: 6px 10px !important;
        border-radius: 5px !important;
        color: rgba(255, 255, 255, 0.82) !important;
        background: transparent !important;
      }
      .monaco-menu .action-item.focused .action-label,
      .monaco-menu .action-item:hover .action-label {
        background: rgba(255, 255, 255, 0.08) !important;
        color: rgba(255, 255, 255, 0.96) !important;
      }
      .monaco-menu .action-item.disabled .action-label {
        color: rgba(255, 255, 255, 0.36) !important;
      }
      .monaco-menu hr { border-color: rgba(255, 255, 255, 0.08) !important; }
      /* ── Squiggles ───────────────────────────────────────────────────── */
      .monaco-editor .squiggly-error, .monaco-editor .squiggly-warning,
      .monaco-editor .squiggly-info { cursor: help !important; }
      /* ── Scrollbars ──────────────────────────────────────────────────── */
      .monaco-scrollable-element > .scrollbar > .slider {
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 0 !important;
      }
      .monaco-scrollable-element > .scrollbar.vertical { width: 6px !important; }
      .monaco-scrollable-element > .scrollbar.horizontal { height: 6px !important; }
      .monaco-scrollable-element > .scrollbar > .slider:hover,
      .monaco-scrollable-element > .scrollbar.active > .slider {
        background: rgba(255, 255, 255, 0.18) !important;
      }
      /* Inline error zones */
      .monaco-error-zone {
        display: flex !important;
        align-items: center !important;
        padding: 0 16px !important;
        height: 22px !important;
        font-size: 11.5px !important;
        font-family: 'JetBrains Mono', Consolas, monospace !important;
        overflow: hidden !important;
        color: rgba(255, 140, 140, 0.88) !important;
        border-left: 2px solid rgba(255, 100, 100, 0.5) !important;
        background: rgba(180, 30, 30, 0.12) !important;
        box-sizing: border-box !important;
      }
      .monaco-error-zone.monaco-error-zone--warning {
        color: rgba(255, 210, 120, 0.88) !important;
        border-left-color: rgba(255, 190, 60, 0.5) !important;
        background: rgba(160, 120, 20, 0.1) !important;
      }
      .monaco-error-zone__msg {
        flex: 1 1 auto !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
    `,e.appendChild(t)}_getModelUrl(e){return`file:///${(e??"examples/active-example.js").replace(/^\/+/,"")}`}_configureMonacoOnce(){return M||(M=this._registerExoJsLibraries(),M)}_installDiagnosticsTracking(){this._markerListener||(this._markerListener=f.onDidChangeMarkers(e=>{this._editorModel&&e.some(t=>t.toString()===this._editorModel?.uri.toString())&&(this._updateDiagnostics(),this._pruneStaleInlineErrors())}))}async _registerExoJsLibraries(){const e=k.typescript,t={allowJs:!0,allowNonTsExtensions:!0,allowSyntheticDefaultImports:!0,checkJs:!0,esModuleInterop:!0,module:e.ModuleKind.ESNext,moduleResolution:e.ModuleResolutionKind.NodeJs,noEmit:!0,noImplicitAny:!1,noImplicitThis:!1,strict:!1,target:e.ScriptTarget.ES2020},r={diagnosticCodesToIgnore:[7044],noSemanticValidation:!1,noSyntaxValidation:!1},o={noSemanticValidation:!1,noSyntaxValidation:!1};e.javascriptDefaults.setEagerModelSync(!0),e.typescriptDefaults.setEagerModelSync(!0),e.javascriptDefaults.setCompilerOptions(t),e.typescriptDefaults.setCompilerOptions(t),e.javascriptDefaults.setDiagnosticsOptions(r),e.typescriptDefaults.setDiagnosticsOptions(o);const i=await Promise.all(ne.map(async n=>({...n,content:await this._fetchTextFile(j(n.path))})));for(const n of i)e.javascriptDefaults.addExtraLib(n.content,n.virtualPath),e.typescriptDefaults.addExtraLib(n.content,n.virtualPath);D||(D=!0,this._registerAssetCompletionProvider())}async _registerAssetCompletionProvider(){let e;try{const t=await fetch(j("assets/assets.json"),{cache:"no-cache"});if(!t.ok)return;e=await t.json()}catch{return}k.registerCompletionItemProvider("javascript",{triggerCharacters:["'",'"'],provideCompletionItems:(t,r)=>le(t,r,e)})}async _fetchTextFile(e){const t=await fetch(e,{cache:"no-cache"});if(!t.ok)throw new Error(`Failed to fetch editor support file at ${e}.`);return t.text()}_updateDiagnostics(){if(!this._editorModel){this._diagnosticsCount=0;return}this._diagnosticsCount=f.getModelMarkers({resource:this._editorModel.uri}).length}_remeasureEditorFonts(){f.remeasureFonts?.()}_triggerRefreshPreview(){this.editorView!==null&&(this.dispatchEvent(new CustomEvent("update-code",{detail:{code:this.editorView.getValue()}})),this._hasPendingChanges=!1)}_onToggleMenu(){this._showMenu=!this._showMenu}_toggleAutoRefresh(){this._autoRefresh=!this._autoRefresh,!this._autoRefresh&&this._autoRefreshTimer!==null&&(clearTimeout(this._autoRefreshTimer),this._autoRefreshTimer=null)}_showInlineErrorForLine(e){if(!this.editorView||!this._editorModel||this._errorZoneMap.has(e))return;const t=f.getModelMarkers({resource:this._editorModel.uri}).filter(i=>i.startLineNumber===e&&i.severity>=4);if(!t.length)return;const r=t.reduce((i,n)=>i.severity>=n.severity?i:n),o=this._createErrorZoneNode(r);this.editorView.changeViewZones(i=>{const n=i.addZone({afterLineNumber:e,heightInPx:22,domNode:o,suppressMouseDown:!0});this._errorZoneMap.set(e,n)})}_pruneStaleInlineErrors(){if(!this.editorView||!this._editorModel||this._errorZoneMap.size===0)return;const e=new Set(f.getModelMarkers({resource:this._editorModel.uri}).filter(r=>r.severity>=4).map(r=>r.startLineNumber)),t=[...this._errorZoneMap.keys()].filter(r=>!e.has(r));t.length!==0&&this.editorView.changeViewZones(r=>{for(const o of t)r.removeZone(this._errorZoneMap.get(o)),this._errorZoneMap.delete(o)})}_createErrorZoneNode(e){const t=e.severity>=8,r=document.createElement("div");r.className=`monaco-error-zone${t?"":" monaco-error-zone--warning"}`;const o=document.createElement("span");return o.className="monaco-error-zone__msg",o.textContent=e.message,r.appendChild(o),r}_clearInlineErrors(){this._errorZoneMap.size!==0&&(this.editorView&&this.editorView.changeViewZones(e=>{for(const t of this._errorZoneMap.values())e.removeZone(t)}),this._errorZoneMap.clear())}_exportCode(){if(this._showMenu=!1,!this.editorView)return;const e=this.editorView.getValue(),t=this.sourcePath?this.sourcePath.split("/").pop()??"example.js":"example.js",r=new Blob([e],{type:"text/javascript"}),o=URL.createObjectURL(r),i=document.createElement("a");i.href=o,i.download=t,i.click(),URL.revokeObjectURL(o)}_importCode(){this._showMenu=!1,this._fileInputElement?.click()}_onFileImport(e){const t=e.target,r=t.files?.[0];if(!r||!this.editorView)return;const o=new FileReader;o.onload=()=>{typeof o.result!="string"||!this.editorView||this._editorModel?.setValue(o.result)},o.readAsText(r),t.value=""}_resetCode(){this._showMenu=!1,!(!this.canReset||!window.confirm("Reset the editor to the original example source?"))&&(this.dispatchEvent(new CustomEvent("reset-code",{detail:{confirmed:!0}})),this._hasPendingChanges=!1)}_syncPendingChangesFromEditor(){if(this.editorView===null||this.sourceCode===null){this._hasPendingChanges=!1;return}this._hasPendingChanges=this.editorView.getValue()!==this.sourceCode}_ensureInputAreaMetadata(){const e=this.renderRoot.querySelector(".inputarea");e&&(e.id||(e.id="example-editor-input"),e.name||(e.name="example-editor-input"))}_attachCtrlSHandler(){this._editorHostElement&&(this._detachEditorKeydownHandler(),this._editorKeydownHandler=e=>{!(e.ctrlKey||e.metaKey)||e.key.toLowerCase()!=="s"||(e.preventDefault(),this._triggerRefreshPreview())},this._editorHostElement.addEventListener("keydown",this._editorKeydownHandler))}_detachEditorKeydownHandler(){!this._editorHostElement||!this._editorKeydownHandler||(this._editorHostElement.removeEventListener("keydown",this._editorKeydownHandler),this._editorKeydownHandler=void 0)}};m([g({type:String})],u.prototype,"sourceCode",2);m([g({type:String})],u.prototype,"sourcePath",2);m([g({type:Boolean})],u.prototype,"canReset",2);m([g({type:String})],u.prototype,"exampleTitle",2);m([L()],u.prototype,"_diagnosticsCount",2);m([L()],u.prototype,"_hasPendingChanges",2);m([L()],u.prototype,"_showMenu",2);m([L()],u.prototype,"_autoRefresh",2);m([A(".editor-host")],u.prototype,"_editorHostElement",2);m([A(".file-input")],u.prototype,"_fileInputElement",2);u=m([$("exo-code-editor")],u);export{u as EditorCode};
