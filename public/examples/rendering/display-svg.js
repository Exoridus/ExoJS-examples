const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.Black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Exo.Scene({

    load(loader) {
        loader.add('svg', { tiger: 'svg/tiger.svg' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._texture = new Exo.Texture(resources.get('svg', 'tiger'));

        this._tiger = new Exo.Sprite(this._texture);
        this._tiger.setAnchor(0.5);
        this._tiger.setPosition(width / 2 | 0, height / 2 | 0);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._tiger);
        renderManager.display();
    },
}));
