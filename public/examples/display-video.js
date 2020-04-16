const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.Black,
    loader: {
        resourcePath: 'assets/',
    },
});

document.body.append(app.canvas);

app.start(new Exo.Scene({

    load(loader) {
        loader.add('video', { example: 'video/example.webm' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._video = resources.get('video', 'example');
        this._video.width = width;
        this._video.height = height;
        this._video.play({ loop: true, volume: 0.5 });

        this.app.inputManager.onPointerTap.add(() => {
            this._video.toggle();
        });
    },

    draw(renderManager) {
        renderManager.clear()
            .draw(this._video)
            .display();
    },
}));
