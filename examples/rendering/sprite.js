const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.Black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Exo.Scene({

    load(loader) {
        loader.add('texture', { bunny: 'image/bunny.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._bunny = new Exo.Sprite(resources.get('texture', 'bunny'));
        this._bunny.setPosition(width / 2 | 0, height / 2 | 0);
        this._bunny.setAnchor(0.5);
    },

    update(delta) {
        this._bunny.rotate(delta.seconds * 360);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._bunny);
        renderManager.display();
    },
}));
