import { Application, Color, Scene, Video } from 'exojs';
import { createInfoElement, formatErrorMessage, getExampleMeta, showInfo, supportsWebGpu } from '@examples/runtime';

const exampleMeta = getExampleMeta();
const infoElement = createInfoElement();

if (!supportsWebGpu()) {
    showInfo(infoElement, 'WebGPU Unavailable', exampleMeta.unsupportedNote || '', true);
} else {
    const app = new Application({
        width: 800,
        height: 600,
        clearColor: Color.black,
        resourcePath: 'assets/',
        backend: { type: 'webgpu' },
    });

    document.body.append(app.canvas, infoElement);
    showInfo(infoElement, exampleMeta.title || 'Video Basics', exampleMeta.description || '');

    app.start(new Scene({

        load(loader) {
            loader.add('video', { example: 'video/example.webm' });
        },

        init(resources) {
            const { width, height } = this.app.canvas;

            this._video = resources.get('video', 'example');
            this._video.setAnchor(0.5);
            this._video.setPosition(width / 2, height / 2);
            this._video.width = 384;
            this._video.height = 216;
            window.__EXAMPLE_PREVIEW_AUTOPLAY__ = () => this._video.play({ loop: true, muted: false, volume: 0.5 });
        },

        update() {
            const time = this.app.activeTime.seconds;

            this._video.x = (this.app.canvas.width / 2) + Math.sin(time * 1.2) * 54;
            this._video.y = (this.app.canvas.height / 2) + Math.cos(time * 1.7) * 22;
            this._video.rotation = Math.sin(time * 0.9) * 6;

            const scale = 1 + (Math.sin(time * 2) * 0.08);
            this._video.setScale(scale);
        },

        draw(renderManager) {
            renderManager.clear();
            this._video.render(renderManager);

        },

        unload() {
            this._video?.stop({ time: 0 });
            this._video?.destroy();
            this._video = null;
        },

        destroy() {
            this._video?.stop({ time: 0 });
            this._video?.destroy();
            this._video = null;
        },
    })).catch((error) => {
        app.canvas.remove();
        app.destroy();

        showInfo(
            infoElement,
            'WebGPU Setup Failed',
            `${exampleMeta.unsupportedNote || ''} ${formatErrorMessage(error)}`.trim(),
            true
        );
    });
}
