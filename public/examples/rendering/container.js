const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.Black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Exo.Scene({

    load(loader) {
        loader.add('texture', {
            bunny: 'image/bunny.png',
            rainbow: 'image/rainbow.png',
        });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._rainbow = new Exo.Sprite(resources.get('texture', 'rainbow'));

        this._bunnies = new Exo.Container();
        this._bunnies.setPosition(width / 2 | 0, height / 2 | 0);

        for (let i = 0; i < 25; i++) {
            const bunny = new Exo.Sprite(resources.get('texture', 'bunny'));

            bunny.setPosition((i % 5) * (bunny.width + 15), (i / 5 | 0) * (bunny.height + 10));

            this._bunnies.addChild(bunny);
        }

        this._bunnies.setAnchor(0.5);
    },

    update(delta) {
        const bounds = this._bunnies.getBounds();

        this._rainbow.x = bounds.x;
        this._rainbow.y = bounds.y;
        this._rainbow.width = bounds.width;
        this._rainbow.height = bounds.height;

        this._bunnies.rotate(delta.seconds * 36);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._rainbow);
        renderManager.draw(this._bunnies);
        renderManager.display();
    },
}));
