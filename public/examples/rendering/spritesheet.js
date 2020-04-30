const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.Black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Exo.Scene({

    load(loader) {
        loader.add('texture', { explosion: 'image/explosion.png' });
        loader.add('json', { explosion: 'json/explosion.json' });
    },

    init(resources) {
        const { width, height } = this.app.canvas,
            texture = resources.get('texture', 'explosion'),
            data = resources.get('json', 'explosion');

        this._spritesheet = new Exo.Spritesheet(texture, data);
        this._sprite = this._spritesheet.getFrameSprite('explosion-0');
        this._frame = 0;
        this._frames = 64;

        for (const sprite of this._spritesheet.sprites.values()) {
            sprite.setAnchor(0.5);
            sprite.setPosition(width / 2, height / 2);
        }
    },

    update() {
        this._frame = (this._frame + 1) % this._frames;
        this._sprite = this._spritesheet.getFrameSprite(`explosion-${this._frame}`);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._sprite);
        renderManager.display();
    },
}));
