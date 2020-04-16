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
        loader.add('texture', { rainbow: 'image/rainbow.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._time = new Exo.Time();

        this._boxA = new Exo.Sprite(resources.get('texture', 'rainbow'));
        this._boxA.setPosition(width / 2, height / 2);
        this._boxA.setAnchor(0.5, 0.5);

        this._boxB = new Exo.Sprite(resources.get('texture', 'rainbow'));
        this._boxB.setPosition(width / 2, height / 2);
        this._boxB.setAnchor(0.5, 0.5);

        this.app.inputManager.onPointerMove.add((pointer) => {
            this._boxB.setPosition(pointer.x, pointer.y);
        });
    },

    update(delta) {
        this._time.addTime(delta);

        this._boxA.setScale(0.25 + (Math.cos(this._time.seconds) * 0.5 + 0.5));
        this._boxB.setScale(0.25 + (Math.sin(this._time.seconds - Math.PI / 2) * 0.5 + 0.5));

        this._boxA.setRotation(this._time.seconds * 25);
        this._boxB.setRotation(this._time.seconds * -100);

        this._boxA.setTint(Exo.Color.White);
        this._boxB.setTint(Exo.Color.White);

        if (this._boxA.intersects(this._boxB)) {
            const { shapeAInB, shapeBInA } = this._boxA.getCollision(this._boxB);

            this._boxA.setTint(shapeAInB ? Exo.Color.Cyan : Exo.Color.Red);
            this._boxB.setTint(shapeBInA ? Exo.Color.Cyan : Exo.Color.Red);
            this._boxB.tint.a = 0.5;
        }
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._boxA);
        renderManager.draw(this._boxB);
        renderManager.display();
    },
}));
