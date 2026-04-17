const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/EditorCode.gJXeXFEE.js","_astro/vendor-lit.k6Ga9zS-.js","_astro/vendor-monaco.CzT-X8YP.js","_astro/vendor-monaco.BSh7Bils.css"])))=>i.map(i=>d[i]);
import{a as b,b as l,c,e as v,A as C,f as s,g,h as X,j as Q}from"./vendor-lit.k6Ga9zS-.js";import{_ as K}from"./vendor-monaco.CzT-X8YP.js";let H="",W="preview.html",V=".",J="examples";function Y(e){H=e.baseUrl,e.iframeUrl&&(W=e.iframeUrl),e.publicDir&&(V=e.publicDir),e.examplesDir&&(J=e.examplesDir)}function A(e,t){const r=new URL(e,H);if(t)for(const[i,a]of Object.entries(t))r.searchParams.append(i,String(a));return r.toString()}function ee(e){return A(W,e)}function qe(e,t){return A(`${V}/${e}`,t)}function B(e,t){return A(`${J}/${e}`,t)}class te{constructor(t,r){this._response=null,this._status=0,this._url=t,this._abortController=new AbortController,this._requestOptions={...r,signal:this._abortController.signal}}async getJson(){const t=await this.getResponse();if(t===null)return null;try{return await t.json()}catch(r){return console.error(`Error while parsing json response! (${this._url})`,r),null}}async getText(){const t=await this.getResponse();return t&&await t.text()}async getResponse(){if(this._status!==0)return this._response;this._status=1;try{this._response=await fetch(this._url,this._requestOptions),this._status=2,this._response.ok||console.error(`Response was not successful! (${this._url})`,this._response)}catch(t){console.error(`Error while fetching data! (${this._url})`,t),this._status=4}return this._response}cancel(){this._status===1&&(this._abortController.abort(),this._status=3)}}const re={cache:"no-cache",method:"GET",mode:"cors"},F=new Map;function G(e){const t=F.get(e);t&&t.cancel();const r=new te(e,re);return F.set(e,r),r}let k=null,S=null;const z=new Set;function ae(){return S}function q(){return k!==null}function ie(e){return z.add(e),()=>z.delete(e)}function oe(e){return e.split("-").map(t=>[...t].some(r=>r!==r.toUpperCase())?t[0].toUpperCase()+t.substring(1):t).join(" ")}function N(){return k?new Map(Object.entries(k).map(([e,t])=>[oe(e),t.slice().sort((r,i)=>(r.order??0)-(i.order??0)).map(r=>({...r,section:e}))])):new Map}function U(){return Array.from(N().values()).flat()}function ne(){return Array.from(new Set(U().flatMap(e=>e.tags??[]))).sort((e,t)=>e.localeCompare(t))}function se(e){return U().find(t=>t.path===e)??null}async function le(e){const t=B(e,{"no-cache":Date.now()}),i=await G(t).getText();if(i===null)throw new Error(`Could not fetch example source at ${t}!`);return i}async function ce(){const e=B("examples.json",{"no-cache":Date.now()});S=null;try{const r=await G(e).getJson();if(r===null)throw new Error(`Could not load the examples catalog from ${e}.`);k=r,S=null}catch(t){k=null,S=t instanceof Error?t.message:String(t)}for(const t of z)t()}let L="checking",P=!1,M=!1;const D=new Set;function de(e){return D.add(e),()=>D.delete(e)}function j(e){return e?pe(e.backend):{available:!0,reason:null}}function pe(e){if(L==="checking")return{available:!0,reason:null};switch(e){case"core":return L==="unsupported"?{available:!1,reason:"Requires WebGPU or WebGL2 support."}:{available:!0,reason:null};case"webgl2":return M?{available:!0,reason:null}:{available:!1,reason:"Requires WebGL2 support."};case"webgpu":return P?{available:!0,reason:null}:{available:!1,reason:"Requires WebGPU support."};case"advanced":return P?{available:!0,reason:null}:{available:!1,reason:"Requires advanced WebGPU support."};default:return{available:!0,reason:null}}}async function ue(){try{const e=navigator.gpu;return!e||typeof e.requestAdapter!="function"?!1:!!await e.requestAdapter()}catch{return!1}}function he(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}async function fe(){P=await ue(),M=he(),L=P?"webgpu":M?"webgl2":"unsupported";for(const e of D)e()}const be="*{box-sizing:border-box}:host{display:flex;height:100vh;overflow:hidden;flex-direction:row;position:relative}.side-content{flex:0 0 auto;width:280px;max-width:280px;overflow:hidden;transition:max-width .2s ease-in-out}.right-column{flex:1 0 0;min-width:0;display:flex;flex-direction:column;overflow:hidden}.main-content::-webkit-scrollbar{width:6px;height:6px}.main-content::-webkit-scrollbar-button{width:0;height:0}.main-content::-webkit-scrollbar-corner{background:transparent}.main-content::-webkit-scrollbar-thumb,.main-content::-webkit-scrollbar-thumb:hover,.main-content::-webkit-scrollbar-thumb:active{background:#ffffff1a;border:0 none;border-radius:0}.main-content::-webkit-scrollbar-track,.main-content::-webkit-scrollbar-track:hover,.main-content::-webkit-scrollbar-track:active{background:transparent;border:0 none;border-radius:0}.main-content{flex:1 0 0;overflow-x:hidden;overflow-y:auto}.backdrop{position:fixed;inset:0;z-index:199;background:#00000080}@media(min-width:1120px){.backdrop{display:none}}:host([data-resizing]) .side-content{transition:none}@media(min-width:1120px){.side-content:not([data-open]){max-width:0;overflow:hidden}}@media(max-width:1119px){.side-content{position:fixed;top:0;left:0;height:100%;z-index:200;max-width:280px;transform:translate(0);transition:transform .2s ease-in-out}.side-content:not([data-open]){transform:translate(-100%)}}",ve=":host{display:flex;align-items:center;gap:12px;flex:0 0 48px;height:48px;padding:0 16px;background-color:#232323;border-bottom:1px solid rgba(255,255,255,.06);box-sizing:border-box}.menu-button{appearance:none;flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:transparent;color:#ffffffb8;cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.menu-button:hover{background-color:#ffffff1a;color:#fff}.menu-button:focus-visible{outline:2px solid rgba(255,255,0,.6);outline-offset:2px}.title{flex:1 1 auto;min-width:0;font-size:14px;font-weight:500;color:#ffffffd6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.modal-backdrop{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:#0009}.modal-card{width:min(480px,100%);background:#1a1c24;border-radius:14px;border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 64px #0009;overflow:hidden}.modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 16px;border-bottom:1px solid rgba(255,255,255,.08)}.modal-title{margin:0;font-size:15px;font-weight:700;color:#fffffff5}.modal-body{margin:0;padding:16px 20px;font-size:13px;line-height:1.65;color:#ffffffad}.modal-links{display:flex;flex-direction:column;gap:6px;padding:4px 20px 20px}.modal-link{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border-radius:7px;color:#ffffffb8;text-decoration:none;font-size:13px;font-weight:500;transition:background-color .1s ease-in-out,color .1s ease-in-out}.modal-link:hover{background-color:#ffffff12;color:#fffffff5}";var ge=Object.defineProperty,me=Object.getOwnPropertyDescriptor,R=(e,t,r,i)=>{for(var a=i>1?void 0:i?me(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&ge(t,r,a),a};let y=class extends v{constructor(){super(...arguments),this.activeExample=null,this.sidebarOpen=!0,this._showModal=!1}render(){return s`
      <button
        class="menu-button"
        aria-label=${this.sidebarOpen?"Close navigation":"Open navigation"}
        aria-expanded=${String(this.sidebarOpen)}
        @click=${this._onToggleSidebar}
      >
        <svg class="menu-icon" viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true">
          <rect x="2" y="4" width="16" height="2" rx="1" />
          <rect x="2" y="9" width="16" height="2" rx="1" />
          <rect x="2" y="14" width="16" height="2" rx="1" />
        </svg>
      </button>
      <span class="title">${this.activeExample?`Example: ${this.activeExample.title}`:"ExoJS Examples"}</span>
      <button
        class="menu-button"
        aria-label="About ExoJS Examples"
        @click=${this._onToggleModal}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.8"/>
          <rect x="9.3" y="8.5" width="1.4" height="6" rx="0.7" fill="currentColor"/>
          <circle cx="10" cy="6" r="0.9" fill="currentColor"/>
        </svg>
      </button>
      ${this._showModal?this._renderModal():C}
    `}_renderModal(){return s`
      <div class="modal-backdrop" @click=${this._onToggleModal}>
        <div class="modal-card" @click=${this._onCardClick} role="dialog" aria-modal="true" aria-label="About ExoJS Examples">
          <div class="modal-header">
            <h2 class="modal-title">ExoJS Examples</h2>
            <button class="menu-button" aria-label="Close" @click=${this._onToggleModal}>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
                <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <p class="modal-body">
            An interactive playground for exploring and editing ExoJS code examples directly in your browser.
            Select an example from the sidebar, read and modify the source in the editor, and see changes instantly in the preview.
          </p>
          <div class="modal-links">
            <a
              class="modal-link"
              href="https://github.com/Exoridus/ExoJS"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.5a8.5 8.5 0 00-2.688 16.573c.425.078.58-.184.58-.41 0-.202-.007-.737-.011-1.446-2.364.514-2.863-1.14-2.863-1.14-.386-.981-.943-1.242-.943-1.242-.771-.527.058-.516.058-.516.853.06 1.302.876 1.302.876.758 1.299 1.99.924 2.474.707.077-.55.297-.924.54-1.136-1.888-.215-3.872-.944-3.872-4.202 0-.928.331-1.686.875-2.282-.088-.215-.38-1.08.083-2.25 0 0 .713-.228 2.336.87A8.134 8.134 0 0110 5.8c.722.003 1.449.098 2.128.287 1.622-1.098 2.334-.87 2.334-.87.464 1.17.172 2.035.085 2.25.545.596.874 1.354.874 2.282 0 3.266-1.987 3.985-3.88 4.196.305.263.577.781.577 1.574 0 1.136-.01 2.052-.01 2.332 0 .228.153.492.584.409A8.5 8.5 0 0010 1.5Z"/>
              </svg>
              ExoJS on GitHub
            </a>
            <a
              class="modal-link"
              href="https://github.com/Exoridus/ExoJS-examples"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.5a8.5 8.5 0 00-2.688 16.573c.425.078.58-.184.58-.41 0-.202-.007-.737-.011-1.446-2.364.514-2.863-1.14-2.863-1.14-.386-.981-.943-1.242-.943-1.242-.771-.527.058-.516.058-.516.853.06 1.302.876 1.302.876.758 1.299 1.99.924 2.474.707.077-.55.297-.924.54-1.136-1.888-.215-3.872-.944-3.872-4.202 0-.928.331-1.686.875-2.282-.088-.215-.38-1.08.083-2.25 0 0 .713-.228 2.336.87A8.134 8.134 0 0110 5.8c.722.003 1.449.098 2.128.287 1.622-1.098 2.334-.87 2.334-.87.464 1.17.172 2.035.085 2.25.545.596.874 1.354.874 2.282 0 3.266-1.987 3.985-3.88 4.196.305.263.577.781.577 1.574 0 1.136-.01 2.052-.01 2.332 0 .228.153.492.584.409A8.5 8.5 0 0010 1.5Z"/>
              </svg>
              Examples on GitHub
            </a>
          </div>
        </div>
      </div>
    `}_onToggleSidebar(){this.dispatchEvent(new CustomEvent("toggle-sidebar",{bubbles:!0,composed:!0}))}_onToggleModal(){this._showModal=!this._showModal}_onCardClick(e){e.stopPropagation()}};y.styles=b(ve);R([l({attribute:!1})],y.prototype,"activeExample",2);R([l({type:Boolean})],y.prototype,"sidebarOpen",2);R([c()],y.prototype,"_showModal",2);y=R([g("exo-app-header")],y);const xe="*{box-sizing:border-box}:host{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:#232323}.header{flex:0 0 auto;padding:8px 16px 10px}.heading{min-height:42px;padding:0;display:flex;align-items:center;line-height:1.2;font-size:20px;font-weight:500;color:#fff;position:relative;overflow:hidden;cursor:default;margin:0}.filter-bar{flex:0 0 auto;padding:0 16px 14px;border-bottom:1px solid rgba(255,255,255,.06)}.filter-label{display:block;margin-bottom:8px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#ffffffc2}.filter-controls{display:flex;align-items:center;gap:8px}.filter-input{flex:1 1 auto;min-width:0;height:34px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#ffffff0a;color:#fff;padding:0 12px;outline:none}.filter-input::placeholder{color:#ffffff6b}.filter-input:focus{border-color:#ffffff42;background:#ffffff0f}.clear-button{height:34px;padding:0 10px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:#ffffff0f;color:#ffffffe0;cursor:pointer}.clear-button:hover{background:#ffffff1f}nav::-webkit-scrollbar{width:6px;height:6px}nav::-webkit-scrollbar-button{width:0;height:0}nav::-webkit-scrollbar-corner{background:transparent}nav::-webkit-scrollbar-thumb,nav::-webkit-scrollbar-thumb:hover,nav::-webkit-scrollbar-thumb:active{background:#ffffff1a;border:0 none;border-radius:0}nav::-webkit-scrollbar-track,nav::-webkit-scrollbar-track:hover,nav::-webkit-scrollbar-track:active{background:transparent;border:0 none;border-radius:0}nav{flex:1 1 auto;min-height:0;overflow-x:hidden;overflow-y:auto;padding-top:6px}.error{margin:0;padding:16px;color:#ffb8b8;line-height:1.5}",_e=".link{transition:background-color .12s cubic-bezier(0,0,.2,1),border-color .12s cubic-bezier(0,0,.2,1);padding:10px 16px;min-height:42px;-webkit-tap-highlight-color:rgba(0,0,0,0);color:#ffffffc2;text-decoration:none;position:relative;cursor:pointer;display:flex;justify-content:flex-start;align-items:center;gap:10px;box-sizing:border-box;border-left:3px solid transparent}.link:hover{background-color:#ffffff1f}.link:active{background-color:#ffffff2e}.link[data-active]{color:#fff;background-color:#ffffff29;border-left-color:#ffd166}.link[data-unavailable]{color:#ffffff7a;background-color:#ffffff05}.link[data-unavailable]:hover{background-color:#ffffff0f}.link[data-active][data-unavailable]{color:#ffffffb8;background-color:#ffffff1a}.title{font-size:15px;line-height:1.25;font-weight:600;flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badge{flex:0 0 auto;display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;font-size:10px;letter-spacing:.04em;text-transform:uppercase;background:#ffffff14;color:#ffffff9e}";var we=Object.defineProperty,ye=Object.getOwnPropertyDescriptor,x=(e,t,r,i)=>{for(var a=i>1?void 0:i?ye(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&we(t,r,a),a};let p=class extends v{constructor(){super(...arguments),this.href="",this.title="",this.description="",this.active=!1,this.unavailable=!1,this.unavailableReason=""}render(){const e=this.unavailable?`${this.title}
${this.unavailableReason||"Unavailable in this browser."}`:this.description||this.title;return s`
      <a
        href=${this.href}
        class="link"
        title=${e}
        ?data-active=${this.active}
        ?data-unavailable=${this.unavailable}
        aria-current=${this.active?"page":"false"}
      >
        <span class="title">${this.title}</span>
        ${this.unavailable?s`<span class="badge">Unavailable</span>`:""}
      </a>
    `}};p.styles=b(_e);x([l({type:String})],p.prototype,"href",2);x([l({type:String})],p.prototype,"title",2);x([l({type:String})],p.prototype,"description",2);x([l({type:Boolean})],p.prototype,"active",2);x([l({type:Boolean})],p.prototype,"unavailable",2);x([l({type:String})],p.prototype,"unavailableReason",2);p=x([g("exo-nav-link")],p);const Ee=":host{display:block}section{display:block;padding:0 0 10px}.title{flex:1 1 auto;min-width:0;min-height:42px;display:flex;align-items:center;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#ff0;line-height:1.1}.toggle{appearance:none;width:100%;min-height:42px;padding:0 16px;margin:0;border:0;border-radius:0;background:#0000;color:inherit;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-sizing:border-box;font:inherit;text-align:left;transition:background-color .12s ease-in-out,box-shadow .12s ease-in-out}.toggle:hover{background:#ffffff1f}.toggle:focus-visible{outline:none;box-shadow:inset 0 0 0 1px #ffff0052}.meta{display:inline-flex;align-items:center;gap:10px;flex:0 0 auto;padding-left:12px}.count{min-width:18px;height:18px;padding:0 6px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,0,.28);background:#0000;color:#ffff00e6;font-size:10px;font-weight:600;letter-spacing:.02em;line-height:1}.chevron{width:8px;height:8px;border-right:2px solid rgba(255,255,0,.88);border-bottom:2px solid rgba(255,255,0,.88);transform:rotate(45deg);transition:transform .12s ease-in-out}.chevron[data-expanded]{transform:rotate(225deg)}.content{display:block;padding-top:6px}";var Ce=Object.defineProperty,ke=Object.getOwnPropertyDescriptor,T=(e,t,r,i)=>{for(var a=i>1?void 0:i?ke(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&Ce(t,r,a),a};let E=class extends v{constructor(){super(...arguments),this.headline="",this.expanded=!0,this.unavailableCount=0}render(){return s`
      <section>
        <button
          class="toggle"
          type="button"
          aria-expanded=${String(this.expanded)}
          @click=${this._onToggle}
        >
          <span class="title">${this.headline}</span>
          <span class="meta">
            ${this.unavailableCount>0?s`<span
                    class="count"
                    title="${this.unavailableCount} unavailable example${this.unavailableCount===1?"":"s"}"
                >${this.unavailableCount}</span>`:""}
            <span class="chevron" ?data-expanded=${this.expanded}></span>
          </span>
        </button>
        ${this.expanded?s`<div class="content"><slot></slot></div>`:""}
      </section>
    `}_onToggle(){this.dispatchEvent(new CustomEvent("toggle-section",{detail:{headline:this.headline},bubbles:!0,composed:!0}))}};E.styles=b(Ee);T([l({type:String})],E.prototype,"headline",2);T([l({type:Boolean})],E.prototype,"expanded",2);T([l({type:Number})],E.prototype,"unavailableCount",2);E=T([g("exo-nav-section")],E);const $e="@keyframes dash-loading{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35}to{stroke-dasharray:89,200;stroke-dashoffset:-124}}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.indicator{width:100px;height:100px;position:relative;display:inline-block}.centered{position:absolute;inset:0;margin:auto}.spinner{width:100px;height:100px;animation:spin 3s linear infinite;position:relative}.path{animation:dash-loading 1.5s ease-in-out infinite;fill:#0000;stroke:#ff0;stroke-dasharray:1,200;stroke-dashoffset:0;stroke-width:6;stroke-miterlimit:20;stroke-linecap:round}";var Se=Object.defineProperty,Pe=Object.getOwnPropertyDescriptor,Z=(e,t,r,i)=>{for(var a=i>1?void 0:i?Pe(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&Se(t,r,a),a};let O=class extends v{constructor(){super(...arguments),this.centered=!1}render(){return s`
      <div class=${X({indicator:!0,centered:this.centered})}>
        <svg class="spinner" viewBox="0 0 100 100">
          <circle class="path" cx="50" cy="50" r="20" />
        </svg>
      </div>
    `}};O.styles=b($e);Z([l({type:Boolean})],O.prototype,"centered",2);O=Z([g("exo-spinner")],O);var Oe=Object.defineProperty,Re=Object.getOwnPropertyDescriptor,f=(e,t,r,i)=>{for(var a=i>1?void 0:i?Re(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&Oe(t,r,a),a};let d=class extends v{constructor(){super(...arguments),this.examples=new Map,this.activeExample=null,this.availableTags=[],this.loadError=null,this.loaded=!1,this._tagInputValue="",this._activeTagFilter=null,this._overriddenSections=new Map}willUpdate(e){e.has("activeExample")&&this._overriddenSections.size>0&&(this._overriddenSections=new Map)}render(){return s`
      <header class="header">
        <h1 class="heading">ExoJS Examples</h1>
      </header>
      <section class="filter-bar">
        <label class="filter-label" for="tag-filter">Filter by tag</label>
        <div class="filter-controls">
          <input
            id="tag-filter"
            class="filter-input"
            list="tag-filter-options"
            .value=${this._tagInputValue}
            placeholder="Pick a tag"
            @input=${this._onTagInput}
            @change=${this._onTagChange}
            @keydown=${this._onTagKeyDown}
          />
          <datalist id="tag-filter-options">
            ${this.availableTags.map(e=>s`<option value=${e}></option>`)}
          </datalist>
          ${this._activeTagFilter?s`<button class="clear-button" @click=${this._onClearFilter}>Clear</button>`:C}
        </div>
      </section>
      <nav>${this._renderContent()}</nav>
    `}_renderContent(){if(this.loadError)return s`<p class="error">${this.loadError}</p>`;if(!this.loaded)return s`<exo-spinner centered></exo-spinner>`;const e=this._getFilteredExamples();return s`${Array.from(e.entries()).map(([t,r])=>this._renderCategory(t,r))}`}_getFilteredExamples(){if(!this._activeTagFilter)return this.examples;const e=Array.from(this.examples.entries()).map(([t,r])=>[t,r.filter(i=>(i.tags??[]).includes(this._activeTagFilter))]).filter(([,t])=>t.length>0);return new Map(e)}_isSectionExpanded(e,t){return this._overriddenSections.has(e)?this._overriddenSections.get(e):t.some(r=>r.path===this.activeExample?.path)}_renderCategory(e,t){const r=this._isSectionExpanded(e,t),i=t.filter(a=>!j(a).available).length;return s`
      <exo-nav-section
        headline=${e}
        .expanded=${r}
        .unavailableCount=${i}
        @toggle-section=${this._onToggleSection}
      >
        ${t.map(a=>this._renderLink(a))}
      </exo-nav-section>
    `}_renderLink(e){const t=j(e);return s`
      <exo-nav-link
        href="#${e.path}"
        title=${e.title}
        description=${e.description}
        ?active=${this.activeExample?.path===e.path}
        ?unavailable=${!t.available}
        unavailableReason=${t.reason??""}
      ></exo-nav-link>
    `}_onTagInput(e){this._tagInputValue=e.currentTarget.value}_onTagChange(e){this._applyTagFilter(e.currentTarget.value)}_onTagKeyDown(e){e.key==="Enter"&&(e.preventDefault(),this._applyTagFilter(e.currentTarget.value))}_onClearFilter(){this._tagInputValue="",this._activeTagFilter=null}_applyTagFilter(e){const t=e.trim();if(t===""){this._tagInputValue="",this._activeTagFilter=null;return}const r=this.availableTags.find(i=>i===t);if(!r){this._tagInputValue=this._activeTagFilter??"";return}this._tagInputValue=r,this._activeTagFilter=r}_onToggleSection(e){const t=e.detail.headline,r=this.examples.get(t)??[],i=this._isSectionExpanded(t,r),a=new Map(this._overriddenSections);a.set(t,!i),this._overriddenSections=a}};d.styles=b(xe);f([l({attribute:!1})],d.prototype,"examples",2);f([l({attribute:!1})],d.prototype,"activeExample",2);f([l({attribute:!1})],d.prototype,"availableTags",2);f([l({type:String})],d.prototype,"loadError",2);f([l({type:Boolean})],d.prototype,"loaded",2);f([c()],d.prototype,"_tagInputValue",2);f([c()],d.prototype,"_activeTagFilter",2);f([c()],d.prototype,"_overriddenSections",2);d=f([g("exo-navigation")],d);const Te=":host{display:block;width:max-content;max-width:calc(100vw - 48px);margin:0 auto;padding:64px 0 32px;box-sizing:border-box}@media(max-width:1439px){:host{padding-top:32px}}.preview-wrapper{position:relative;display:block;width:max-content;margin:0 auto 32px}.unavailable-overlay{position:absolute;inset:0;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;background:#000000e0;backdrop-filter:blur(2px)}.unavailable-icon{color:#ffb450e6;flex:0 0 auto}.unavailable-message{margin:0;font-size:13px;line-height:1.55;text-align:center;color:#ffffffad}.error-panel{margin-bottom:32px;overflow:hidden;border-radius:10px;border:1px solid rgba(255,131,131,.12);background:#60101624}.error-summary{display:flex;align-items:center;justify-content:space-between;list-style:none;cursor:pointer;padding:12px 14px;background:#ffffff08;font-size:13px;font-weight:600;letter-spacing:.04em}.error-summary::-webkit-details-marker{display:none}.error-summary-label{color:#ffdfdfeb}.error-summary-count{min-width:22px;height:22px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#ffffff1f;color:#fff2f2eb;font-size:11px}.error-body{padding:0 14px 14px}.error-item+.error-item{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08)}.error-item-title{margin:0;font-size:13px;font-weight:600;color:#ffe8e8f0}.error-details{margin:8px 0 0;padding:10px 12px;border-radius:8px;background:#00000024;white-space:pre-wrap;word-break:break-word;color:#fff0f0c7;font-size:12px;line-height:1.5;font-family:JetBrains Mono,Consolas,monospace}@media(max-width:1119px){:host{width:100%;max-width:none;margin:0;padding:0}.preview-wrapper{display:flex;justify-content:center;width:100%;margin:0 0 16px}}",ze=":host{display:block;width:calc(var(--canvas-w, 800px) * var(--preview-zoom, 1));height:calc(var(--canvas-h, 600px) * var(--preview-zoom, 1));position:relative}.preview{width:var(--canvas-w, 100%);height:var(--canvas-h, 100%);border:0;zoom:var(--preview-zoom, 1)}";var Le=Object.defineProperty,Me=Object.getOwnPropertyDescriptor,$=(e,t,r,i)=>{for(var a=i>1?void 0:i?Me(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&Le(t,r,a),a};let m=class extends v{constructor(){super(...arguments),this.sourceCode=null,this.exampleMeta=null,this._updateId=0,this._previewErrors=[],this._canvasMutationObserver=null,this._canvasAttributeObserver=null,this._currentCanvasWidth=0,this._currentCanvasHeight=0,this._windowResizeHandler=()=>this._recalculateZoom(),this._preventScrollHandler=e=>{document.activeElement===this._iframeElement&&[32,33,34,35,36,37,38,39,40].includes(e.keyCode)&&e.preventDefault()}}render(){if(!this.sourceCode)return s`<exo-spinner centered></exo-spinner>`;const e=ee({"no-cache":this._updateId});return s`
      <iframe
        class="preview"
        @load=${this._onLoadIframe}
        @error=${this._onErrorIframe}
        @pointerdown=${this._onInteractWithPreview}
        allow="autoplay"
        tabindex="0"
        src=${e}
      ></iframe>
    `}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this._windowResizeHandler),window.addEventListener("keydown",this._preventScrollHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._windowResizeHandler),window.removeEventListener("keydown",this._preventScrollHandler),this._disconnectCanvasObservers()}willUpdate(e){e.has("sourceCode")&&(this._updateId+=1,this._disconnectCanvasObservers(),this._currentCanvasWidth=0,this._currentCanvasHeight=0,this.style.removeProperty("--canvas-w"),this.style.removeProperty("--canvas-h"),this.style.removeProperty("--preview-zoom"),this._syncShellState())}focusPreviewSurface(){this._iframeElement?.focus(),this._iframeElement?.contentWindow?.focus(),this._iframeElement?.contentDocument?.body?.focus()}_onLoadIframe(e){const t=e.composedPath()[0],r=(t.contentDocument??t.contentWindow?.document)?.body;if(!r||!this.sourceCode)return;const i=t.contentWindow;this._syncPreviewErrors([]),i&&(i.__EXAMPLE_META__=this.exampleMeta,this._installPreviewErrorHandlers(i,r)),r.tabIndex=-1,this._executePreviewSource(r),this._watchForCanvas(r),this.focusPreviewSurface(),this._syncShellState()}_installPreviewErrorHandlers(e,t){e.__EXAMPLE_PREVIEW_ERROR_RENDERED__=!1,e.onerror=(r,i,a,n,o)=>{const I=this._createPreviewErrorEntry(o,r);return this._isRecoverablePreviewError(I.summary)?(this._blankPreviewSurface(t),!0):(this._syncPreviewErrors([I]),this._renderExecutionError(t),!0)},e.onunhandledrejection=r=>{const i=this._createPreviewErrorEntry(r.reason);if(this._isRecoverablePreviewError(i.summary)){r.preventDefault(),this._blankPreviewSurface(t);return}r.preventDefault(),this._syncPreviewErrors([i]),this._renderExecutionError(t)}}_watchForCanvas(e){this._disconnectCanvasObservers();const t=e.querySelector("canvas");if(t){this._observeCanvas(t);return}this._canvasMutationObserver=new MutationObserver(()=>{const r=e.querySelector("canvas");r&&(this._canvasMutationObserver?.disconnect(),this._canvasMutationObserver=null,this._observeCanvas(r))}),this._canvasMutationObserver.observe(e,{childList:!0,subtree:!0})}_observeCanvas(e){this._applyCanvasSize(e.width,e.height),this._canvasAttributeObserver=new MutationObserver(()=>{this._applyCanvasSize(e.width,e.height)}),this._canvasAttributeObserver.observe(e,{attributes:!0,attributeFilter:["width","height"]})}_applyCanvasSize(e,t){!e||!t||(this._currentCanvasWidth=e,this._currentCanvasHeight=t,this.style.setProperty("--canvas-w",`${e}px`),this.style.setProperty("--canvas-h",`${t}px`),this._recalculateZoom())}_recalculateZoom(){if(!this._currentCanvasWidth)return;const e=Math.min(1,window.innerWidth/this._currentCanvasWidth);this.style.setProperty("--preview-zoom",String(e))}_disconnectCanvasObservers(){this._canvasMutationObserver?.disconnect(),this._canvasMutationObserver=null,this._canvasAttributeObserver?.disconnect(),this._canvasAttributeObserver=null}_isRecoverablePreviewError(e){const t=e.toLowerCase();return t.includes("does not support webgl")||t.includes("failed to create a webgl")||t.includes("webgl is not supported")||t.includes("requires browser webgpu support")||t.includes("requires advanced webgpu support")||t.includes("webgpu unavailable")||t.includes("could not acquire a webgpu adapter")||t.includes("webgpu setup failed")}_blankPreviewSurface(e){const t=e.ownerDocument.defaultView;t?.__EXAMPLE_PREVIEW_ERROR_RENDERED__||(t&&(t.__EXAMPLE_PREVIEW_ERROR_RENDERED__=!0),e.setAttribute("data-preview-blanked",""),e.replaceChildren(),Object.assign(e.style,{display:"block",background:"#0b0d12",color:"#f4f6fb",fontFamily:'"Segoe UI", sans-serif'}))}_renderExecutionError(e){e.replaceChildren(),Object.assign(e.style,{display:"block",background:"#0b0d12",color:"#f4f6fb",fontFamily:'"Segoe UI", sans-serif'})}_createPreviewErrorEntry(e,t){return e instanceof Error?{summary:e.message,details:e.stack??e.message}:typeof t=="string"&&t.trim()?{summary:t,details:String(e||t)}:{summary:String(e),details:String(e)}}_syncPreviewErrors(e){const t=e.filter(r=>!!r.summary);t.length===this._previewErrors.length&&t.every((r,i)=>r.summary===this._previewErrors[i]?.summary&&r.details===this._previewErrors[i]?.details)||(this._previewErrors=t,this._syncShellState(),this.dispatchEvent(new CustomEvent("preview-errors",{detail:{errors:t},bubbles:!0,composed:!0})))}_onErrorIframe(e){const t=typeof e=="string"?e:"The preview iframe failed to load.";this._syncPreviewErrors([{summary:t,details:t}])}_syncShellState(){const e={canFocusPreview:!!this._iframeElement};this.dispatchEvent(new CustomEvent("preview-state",{detail:{state:e},bubbles:!0,composed:!0}))}_executePreviewSource(e){if(!this.sourceCode)return;const t=e.ownerDocument.createElement("script");t.type="module",t.textContent=`${this.sourceCode}
`,e.appendChild(t)}_onInteractWithPreview(){this.focusPreviewSurface()}};m.styles=b(ze);$([l({type:String})],m.prototype,"sourceCode",2);$([l({attribute:!1})],m.prototype,"exampleMeta",2);$([c()],m.prototype,"_updateId",2);$([Q("iframe")],m.prototype,"_iframeElement",2);m=$([g("exo-preview")],m);var De=Object.defineProperty,je=Object.getOwnPropertyDescriptor,_=(e,t,r,i)=>{for(var a=i>1?void 0:i?je(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&De(t,r,a),a};let u=class extends v{constructor(){super(...arguments),this.activeExample=null,this.catalogLoadError=null,this._sourceCode=null,this._originalSourceCode=null,this._sourceLoadError=null,this._previewErrors=[],this._lastLoadedPath=null}connectedCallback(){super.connectedCallback(),K(()=>import("./EditorCode.gJXeXFEE.js"),__vite__mapDeps([0,1,2,3]))}willUpdate(e){if(e.has("activeExample")){const t=this.activeExample?.path??null;t!==this._lastLoadedPath&&(this._lastLoadedPath=t,this._loadSourceCode(this.activeExample))}}async _loadSourceCode(e){if(this._sourceCode=null,this._originalSourceCode=null,this._sourceLoadError=null,this._previewErrors=[],e!==null)try{const t=await le(e.path);this._sourceCode=t,this._originalSourceCode=t}catch(t){this._sourceLoadError={summary:"Failed to load example source",details:t instanceof Error?t.message:String(t)}}}render(){const e=this.activeExample,t=this._getCombinedErrors();if(e===null&&t.length>0)return s`${this._renderErrors(t)}`;const r=j(e);return s`
      <div class="preview-wrapper">
        <exo-preview
          .sourceCode=${this._sourceCode}
          .exampleMeta=${e}
          @preview-errors=${this._onPreviewErrors}
        ></exo-preview>
        ${r.available?C:s`
          <div class="unavailable-overlay">
            <svg class="unavailable-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L2 20h20L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <circle cx="12" cy="17.5" r="0.8" fill="currentColor"/>
            </svg>
            <p class="unavailable-message">${r.reason??"This example is not available in the current browser."}</p>
          </div>
        `}
      </div>
      ${this._renderErrors(t)}
      <exo-code-editor
        .sourceCode=${this._sourceCode}
        .sourcePath=${e?.path??null}
        .canReset=${!!this._originalSourceCode&&this._sourceCode!==this._originalSourceCode}
        .exampleTitle=${e?.title??"Loading..."}
        @update-code=${this._onUpdateCode}
        @reset-code=${this._onResetCode}
      ></exo-code-editor>
    `}_onUpdateCode(e){this._sourceCode=e.detail.code}_onResetCode(e){this._originalSourceCode!==null&&(this._previewErrors=[],this._sourceCode=this._originalSourceCode)}_onPreviewErrors(e){this._previewErrors=e.detail.errors}_renderErrors(e){return e.length===0?C:s`
      <details class="error-panel">
        <summary class="error-summary">
          <span class="error-summary-label">Errors</span>
          <span class="error-summary-count">${e.length}</span>
        </summary>
        <div class="error-body">
          ${e.map(t=>s`
            <article class="error-item">
              <h3 class="error-item-title">${t.summary}</h3>
              ${t.details&&t.details!==t.summary?s`<pre class="error-details">${t.details}</pre>`:C}
            </article>
          `)}
        </div>
      </details>
    `}_getCombinedErrors(){return[...this.catalogLoadError?[{summary:"Failed to load examples catalog",details:this.catalogLoadError}]:[],...this._sourceLoadError?[this._sourceLoadError]:[],...this._previewErrors]}};u.styles=b(Te);_([l({attribute:!1})],u.prototype,"activeExample",2);_([l({type:String})],u.prototype,"catalogLoadError",2);_([c()],u.prototype,"_sourceCode",2);_([c()],u.prototype,"_originalSourceCode",2);_([c()],u.prototype,"_sourceLoadError",2);_([c()],u.prototype,"_previewErrors",2);u=_([g("exo-editor")],u);var Ae=Object.defineProperty,Ue=Object.getOwnPropertyDescriptor,w=(e,t,r,i)=>{for(var a=i>1?void 0:i?Ue(t,r):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(i?o(t,r,a):o(a))||a);return i&&a&&Ae(t,r,a),a};let h=class extends v{constructor(){super(...arguments),this._examples=new Map,this._activeExample=null,this._availableTags=[],this._loaded=!1,this._loadError=null,this._sidebarOpen=window.matchMedia("(min-width: 1120px)").matches,this._hashChangeHandler=()=>this._onHashChange(),this._desktopMediaQuery=window.matchMedia("(min-width: 1120px)"),this._breakpointChangeHandler=e=>this._onBreakpointChange(e)}connectedCallback(){super.connectedCallback(),this._desktopMediaQuery.addEventListener("change",this._breakpointChangeHandler),Y({baseUrl:new URL(".",document.baseURI).toString(),iframeUrl:"preview.html",examplesDir:"examples",publicDir:"."}),this._unsubscribeExamples=ie(()=>this._syncStoreState()),this._unsubscribeRuntime=de(()=>this.requestUpdate()),window.addEventListener("hashchange",this._hashChangeHandler),ce(),fe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeExamples?.(),this._unsubscribeRuntime?.(),window.removeEventListener("hashchange",this._hashChangeHandler),this._desktopMediaQuery.removeEventListener("change",this._breakpointChangeHandler)}_onBreakpointChange(e){this.setAttribute("data-resizing",""),e.matches?this._sidebarOpen=!0:this._sidebarOpen=!1,requestAnimationFrame(()=>{this.removeAttribute("data-resizing")})}_syncStoreState(){this._loaded=q(),this._loadError=ae(),this._examples=N(),this._availableTags=ne(),this._onHashChange()}_onHashChange(){if(!q())return;const e=window.location.hash.slice(1);if(!e){const r=U()[0];r&&(window.location.hash=r.path);return}const t=se(e);this._activeExample=t}_onToggleSidebar(){this._sidebarOpen=!this._sidebarOpen}render(){return s`
      <aside class="side-content" ?data-open=${this._sidebarOpen}>
        <exo-navigation
          .examples=${this._examples}
          .activeExample=${this._activeExample}
          .availableTags=${this._availableTags}
          .loadError=${this._loadError}
          .loaded=${this._loaded}
        ></exo-navigation>
      </aside>
      <div class="right-column">
        <exo-app-header
          .activeExample=${this._activeExample}
          .sidebarOpen=${this._sidebarOpen}
          @toggle-sidebar=${this._onToggleSidebar}
        ></exo-app-header>
        <main class="main-content">
          <exo-editor
            .activeExample=${this._activeExample}
            .catalogLoadError=${this._loadError}
          ></exo-editor>
        </main>
      </div>
      ${this._sidebarOpen?s`<div class="backdrop" @click=${this._onToggleSidebar}></div>`:""}
    `}};h.styles=b(be);w([c()],h.prototype,"_examples",2);w([c()],h.prototype,"_activeExample",2);w([c()],h.prototype,"_availableTags",2);w([c()],h.prototype,"_loaded",2);w([c()],h.prototype,"_loadError",2);w([c()],h.prototype,"_sidebarOpen",2);h=w([g("example-browser")],h);export{h as E,qe as b};
