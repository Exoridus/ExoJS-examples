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

        this._container = this.createBunnyContainer(resources.get('texture', 'bunny'));

        this._renderTexture = this.createRenderTexture(this._container);

        this._renderSprite = new Exo.Sprite(this._renderTexture);
        this._renderSprite.setPosition(width, height);
        this._renderSprite.setAnchor(1, 1);
    },

    createBunnyContainer(texture) {
        const container = new Exo.Container();

        for (let i = 0; i < 25; i++) {
            const bunny = new Exo.Sprite(texture);

            bunny.setAnchor(0.5, 0.5);
            bunny.setPosition(25 + (i % 5) * 30, 25 + Math.floor(i / 5) * 30);
            bunny.setRotation(Math.random() * 360);

            container.addChild(bunny);
        }

        return container;
    },

    createRenderTexture(container) {
        const renderManager = this.app.renderManager;
        const renderTexture = new Exo.RenderTexture(Math.ceil(container.width), Math.ceil(container.height));

        renderManager.setRenderTarget(renderTexture);

        renderManager.clear();
        renderManager.draw(container);
        renderManager.display();

        renderManager.setRenderTarget(null);

        return renderTexture;
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._container);
        renderManager.draw(this._renderSprite);
        renderManager.display();
    },
}));
