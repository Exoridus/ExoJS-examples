import './LoadingSpinner';

import styles, { css } from './EditorPreview.module.scss';

import {
    CSSResult,
    customElement,
    html,
    internalProperty,
    LitElement,
    property,
    PropertyValues,
    TemplateResult,
    unsafeCSS,
} from 'lit-element';
import { globalDependencies } from '../classes/globalDependencies';
import { UrlService } from '../services/UrlService';
import type { Example } from '../services/ExampleService';

interface ExamplePreviewWindow extends Window {
    __EXAMPLE_META__?: Example | null;
    __EXAMPLE_PREVIEW_AUTOPLAY__?: (() => void | Promise<void>) | null;
    __EXAMPLE_PREVIEW_ERROR_RENDERED__?: boolean;
}

export interface PreviewErrorEntry {
    summary: string;
    details?: string;
}

export interface PreviewErrorsEvent {
    errors: Array<PreviewErrorEntry>;
}

@customElement('my-editor-preview')
export default class EditorPreview extends LitElement {
    public static styles: CSSResult = unsafeCSS(css);

    private urlService: UrlService = globalDependencies.get('urlService');

    @property({ type: String }) public sourceCode: string | null = null;
    @property({ attribute: false }) public exampleMeta: Example | null = null;
    @property({ type: String }) public executionMode: 'defer-media' | 'immediate' = 'defer-media';
    @internalProperty() private updateId = 0;
    @internalProperty() private showMediaPlayOverlay = false;

    private previewErrors: Array<PreviewErrorEntry> = [];
    private mediaOverlayCheckToken = 0;
    private pendingIframeWindow: ExamplePreviewWindow | null = null;
    private pendingIframeBody: HTMLBodyElement | null = null;

    public render(): TemplateResult {
        if (!this.sourceCode) {
            return html`<my-loading-spinner centered></my-loading-spinner>`;
        }

        const iframeUrl = this.urlService.buildIframeUrl({
            'no-cache': this.updateId,
        });

        return html`
            <iframe
                class=${styles.preview}
                @load=${this.onLoadIframe}
                @error=${this.onErrorIframe}
                src=${iframeUrl}
            ></iframe>
            ${this.showMediaPlayOverlay ? html`
                <button
                    class=${styles.mediaPlayOverlay}
                    data-role="media-play-overlay"
                    @click=${this.onClickMediaPlayOverlay}
                    title="Start media playback"
                    aria-label="Start media playback"
                >
                    <span class=${styles.mediaPlayIcon} aria-hidden="true"></span>
                </button>
            ` : ''}
        `;
    }

    protected update(changedProperties: PropertyValues): void {
        if (changedProperties.has('sourceCode')) {
            this.updateId += 1;
            this.mediaOverlayCheckToken += 1;
            this.showMediaPlayOverlay = false;
            this.pendingIframeWindow = null;
            this.pendingIframeBody = null;
        }

        super.update(changedProperties);
    }

    private onLoadIframe(event: Event): void {
        const iframe = event.composedPath()[0] as HTMLIFrameElement;
        const iframeBody = ((iframe.contentDocument || iframe.contentWindow?.document)?.body || null) as HTMLBodyElement | null;

        if (!iframeBody) {
            throw new Error('Could not access iframe body element!');
        }

        if (!this.sourceCode) {
            throw new Error('No source code provided!');
        }

        const iframeWindow = iframe.contentWindow as ExamplePreviewWindow | null;

        this.syncPreviewErrors([]);

        if (iframeWindow) {
            iframeWindow.__EXAMPLE_META__ = this.exampleMeta;
            iframeWindow.__EXAMPLE_PREVIEW_AUTOPLAY__ = null;
            this.installPreviewErrorHandlers(iframeWindow, iframeBody);
        }

        if (iframeWindow && this.shouldDeferMediaExecution()) {
            this.pendingIframeWindow = iframeWindow;
            this.pendingIframeBody = iframeBody;
            this.showMediaPlayOverlay = true;
            return;
        }

        this.executePreviewSource(iframeBody);

        if (iframeWindow && this.shouldAutoStartMedia()) {
            this.scheduleMediaAutoplay(iframeWindow, this.mediaOverlayCheckToken);
        }
    }

    private installPreviewErrorHandlers(iframeWindow: ExamplePreviewWindow, iframeBody: HTMLBodyElement): void {
        iframeWindow.__EXAMPLE_PREVIEW_ERROR_RENDERED__ = false;
        iframeWindow.onerror = (message, _source, _lineno, _colno, error) => {
            const previewError = this.createPreviewErrorEntry(error, message);

            if (this.isRecoverablePreviewError(previewError.summary)) {
                this.renderPreviewError(iframeWindow, iframeBody, previewError.summary);
                return true;
            }

            this.syncPreviewErrors([previewError]);
            this.renderExecutionError(iframeBody, previewError.summary);
            return true;
        };
        iframeWindow.onunhandledrejection = (event: PromiseRejectionEvent) => {
            const previewError = this.createPreviewErrorEntry(event.reason);

            if (this.isRecoverablePreviewError(previewError.summary)) {
                event.preventDefault();
                this.renderPreviewError(iframeWindow, iframeBody, previewError.summary);
                return;
            }

            event.preventDefault();
            this.syncPreviewErrors([previewError]);
            this.renderExecutionError(iframeBody, previewError.summary);
        };
    }

    private isRecoverablePreviewError(message: string): boolean {
        const normalizedMessage = message.toLowerCase();

        return (
            normalizedMessage.includes('does not support webgl') ||
            normalizedMessage.includes('failed to create a webgl') ||
            normalizedMessage.includes('webgl is not supported')
        );
    }

    private renderPreviewError(
        iframeWindow: ExamplePreviewWindow,
        iframeBody: HTMLBodyElement,
        errorMessage: string
    ): void {
        if (iframeWindow.__EXAMPLE_PREVIEW_ERROR_RENDERED__) {
            return;
        }

        iframeWindow.__EXAMPLE_PREVIEW_ERROR_RENDERED__ = true;
        iframeBody.replaceChildren();

        const documentRef = iframeBody.ownerDocument;
        const message = documentRef.createElement('aside');
        const title = documentRef.createElement('strong');
        const detail = documentRef.createElement('span');
        const heading = this.exampleMeta?.title || 'Example unavailable';
        const fallbackDetail = this.exampleMeta?.unsupportedNote || errorMessage;

        Object.assign(iframeBody.style, {
            display: 'grid',
            placeItems: 'center',
            background: '#0b0d12',
            color: '#f4f6fb',
            fontFamily: '"Segoe UI", sans-serif',
        });

        Object.assign(message.style, {
            maxWidth: '420px',
            margin: '24px',
            padding: '16px 18px',
            borderRadius: '12px',
            background: 'rgba(17, 24, 39, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.34)',
        });

        Object.assign(title.style, {
            display: 'block',
            marginBottom: '8px',
            fontSize: '15px',
        });

        Object.assign(detail.style, {
            display: 'block',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'rgba(244, 246, 251, 0.82)',
        });

        title.textContent = heading;
        detail.textContent = fallbackDetail;

        message.append(title, detail);
        iframeBody.append(message);
    }

    private renderExecutionError(iframeBody: HTMLBodyElement, errorMessage: string): void {
        iframeBody.replaceChildren();

        const documentRef = iframeBody.ownerDocument;
        const message = documentRef.createElement('aside');
        const title = documentRef.createElement('strong');
        const detail = documentRef.createElement('span');

        Object.assign(iframeBody.style, {
            display: 'grid',
            placeItems: 'center',
            background: '#0b0d12',
            color: '#f4f6fb',
            fontFamily: '"Segoe UI", sans-serif',
        });

        Object.assign(message.style, {
            maxWidth: '420px',
            margin: '24px',
            padding: '16px 18px',
            borderRadius: '12px',
            background: 'rgba(34, 12, 17, 0.92)',
            border: '1px solid rgba(255, 136, 136, 0.22)',
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.34)',
        });

        Object.assign(title.style, {
            display: 'block',
            marginBottom: '8px',
            fontSize: '15px',
            color: '#ffcece',
        });

        Object.assign(detail.style, {
            display: 'block',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'rgba(255, 235, 235, 0.82)',
        });

        title.textContent = 'Preview execution failed';
        detail.textContent = errorMessage;

        message.append(title, detail);
        iframeBody.append(message);
    }

    private createPreviewErrorEntry(error: unknown, fallbackMessage?: string | Event): PreviewErrorEntry {
        if (error instanceof Error) {
            return {
                summary: error.message,
                details: error.stack || error.message,
            };
        }

        if (typeof fallbackMessage === 'string' && fallbackMessage.trim()) {
            const details = String(error || fallbackMessage);

            return {
                summary: fallbackMessage,
                details,
            };
        }

        return {
            summary: String(error),
            details: String(error),
        };
    }

    private syncPreviewErrors(errors: Array<PreviewErrorEntry>): void {
        const nextErrors = errors.filter((error) => !!error.summary);

        if (
            nextErrors.length === this.previewErrors.length &&
            nextErrors.every((error, index) => (
                error.summary === this.previewErrors[index]?.summary &&
                error.details === this.previewErrors[index]?.details
            ))
        ) {
            return;
        }

        this.previewErrors = nextErrors;
        if (nextErrors.length > 0) {
            this.showMediaPlayOverlay = false;
        }
        this.dispatchEvent(new CustomEvent<PreviewErrorsEvent>('preview-errors', {
            detail: {
                errors: nextErrors,
            },
            bubbles: true,
            composed: true,
        }));
    }

    private onErrorIframe(event: Event | string): void {
        const summary = typeof event === 'string' ? event : 'The preview iframe failed to load.';

        this.syncPreviewErrors([{
            summary,
            details: summary,
        }]);
    }

    private scheduleMediaAutoplay(iframeWindow: ExamplePreviewWindow, token: number, attempt = 0): void {
        if (token !== this.mediaOverlayCheckToken) {
            return;
        }

        const play = iframeWindow.__EXAMPLE_PREVIEW_AUTOPLAY__;

        if (typeof play === 'function') {
            void Promise.resolve(play()).catch(() => {
            });
            return;
        }

        if (attempt >= 200) {
            return;
        }

        window.setTimeout(() => this.scheduleMediaAutoplay(iframeWindow, token, attempt + 1), 100);
    }

    private requiresMediaPlayOverlay(): boolean {
        const tags = this.exampleMeta?.tags || [];

        return tags.includes('audio') || tags.includes('video');
    }

    private shouldDeferMediaExecution(): boolean {
        return this.executionMode === 'defer-media' && this.requiresMediaPlayOverlay();
    }

    private shouldAutoStartMedia(): boolean {
        return this.executionMode === 'immediate' && this.requiresMediaPlayOverlay();
    }

    private executePreviewSource(iframeBody: HTMLBodyElement): void {
        if (!this.sourceCode) {
            throw new Error('No source code provided!');
        }

        const script = iframeBody.ownerDocument.createElement('script');

        script.type = 'module';
        script.textContent = `${this.sourceCode}\n`;

        iframeBody.appendChild(script);
    }

    private async onClickMediaPlayOverlay(): Promise<void> {
        if (!this.pendingIframeWindow || !this.pendingIframeBody) {
            return;
        }

        const iframeWindow = this.pendingIframeWindow;
        const iframeBody = this.pendingIframeBody;

        this.pendingIframeWindow = null;
        this.pendingIframeBody = null;
        this.showMediaPlayOverlay = false;

        try {
            this.executePreviewSource(iframeBody);
            this.scheduleMediaAutoplay(iframeWindow, this.mediaOverlayCheckToken);
        } catch (error) {
            const previewError = this.createPreviewErrorEntry(error, 'Media playback could not be started.');

            this.syncPreviewErrors([previewError]);
        }
    }
}
