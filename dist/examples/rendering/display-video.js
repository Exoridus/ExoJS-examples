import { Application, Color, Scene } from 'exojs';

const app = new Application({
    width: 800,
    height: 600,
    clearColor: Color.black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Scene({

    load(loader) {
        loader.add('video', { example: 'video/example.webm' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._video = resources.get('video', 'example');
        this._video.width = width;
        this._video.height = height;
        window.__EXAMPLE_PREVIEW_AUTOPLAY__ = () => this._video.play({ loop: true, muted: false, volume: 0.5 });

        this.app.inputManager.onPointerTap.add(() => {
            if (this._video.paused) {
                window.__EXAMPLE_PREVIEW_AUTOPLAY__?.();
                return;
            }

            this._video.toggle();
        });
    },

    draw(renderManager) {
        renderManager.clear();
        this._video.render(renderManager);
    },
}));
