import { Application, Color, Scene, Sprite } from 'exojs';

const app = new Application({
    width: 800,
    height: 600,
    clearColor: Color.black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Scene({

    load(loader) {
        loader.add('texture', { bunny: 'image/bunny.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._bunny = new Sprite(resources.get('texture', 'bunny'));
        this._bunny.setPosition(width / 2 | 0, height / 2 | 0);
        this._bunny.setAnchor(0.5);
    },

    update(delta) {
        this._bunny.rotate(delta.seconds * 360);
    },

    draw(renderManager) {
        renderManager.clear();
        this._bunny.render(renderManager);
    },
}));
