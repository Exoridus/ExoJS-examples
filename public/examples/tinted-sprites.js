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
        loader.add('texture', { bunny: 'image/bunny.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._bunnyTexture = resources.get('texture', 'bunny');
        this._bunnies = new Exo.Container();

        for (let i = 0; i < 25; i++) {
            const bunny = new Exo.Sprite(this._bunnyTexture);

            bunny.setPosition(
                (i % 5) * (bunny.width + 10),
                (i / 5 | 0) * (bunny.height + 10)
            );

            this._bunnies.addChild(bunny);
        }

        this._bunnies.setPosition(width / 2 | 0, height / 2 | 0);
        this._bunnies.setAnchor(0.5, 0.5);

        this._timer = new Exo.Timer({ limit: 500, autoStart: true });
        this._random = new Exo.Random();

        this.tintBunnies();
    },

    tintBunnies() {
        for (const bunny of this._bunnies.children) {
            bunny.tint.set(
                this._random.next(50, 255),
                this._random.next(50, 255),
                this._random.next(50, 255)
            );
        }
    },

    update() {
        if (this._timer.expired) {
            this.tintBunnies();
            this._timer.restart();
        }
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._bunnies);
        renderManager.display();
    },
}));
