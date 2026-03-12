import { Application, Color, Scene, Texture, Sprite } from 'exojs';

const app = new Application({
    width: 800,
    height: 600,
    clearColor: Color.black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Scene({

    load(loader) {
        loader.add('svg', { tiger: 'svg/tiger.svg' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._texture = new Texture(resources.get('svg', 'tiger'));

        this._tiger = new Sprite(this._texture);
        this._tiger.setAnchor(0.5);
        this._tiger.setPosition(width / 2 | 0, height / 2 | 0);
    },

    draw(renderManager) {
        renderManager.clear();
        this._tiger.render(renderManager);
    },
}));
