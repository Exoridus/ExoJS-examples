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
        loader.add('texture', {
            background: 'image/uv.png',
            bunny: 'image/bunny.png',
        }, {
            scaleMode: Exo.ScaleModes.NEAREST,
        });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._background = new Exo.Sprite(resources.get('texture', 'background'));
        this._background.setPosition(width / 2, height / 2);
        this._background.setAnchor(0.5, 0.5);

        this._leftBunny = new Exo.Sprite(resources.get('texture', 'bunny'));
        this._leftBunny.setAnchor(0.5, 0.5);
        this._leftBunny.setScale(5);

        this._rightBunny = new Exo.Sprite(resources.get('texture', 'bunny'));
        this._rightBunny.setAnchor(0.5, 0.5);
        this._rightBunny.setScale(5);

        this._blendModes = [
            Exo.BlendModes.NORMAL,
            Exo.BlendModes.ADDITIVE,
            Exo.BlendModes.SUBTRACT,
            Exo.BlendModes.MULTIPLY,
            Exo.BlendModes.SCREEN,
        ];

        this._blendModeNames = [
            'NORMAL',
            'ADDITIVE',
            'SUBTRACT',
            'MULTIPLY',
            'SCREEN',
        ];

        this._blendModeIndex = 0;
        this._ticker = 0;

        this._info = new Exo.Text('Click to switch between blend modes', {
            fontSize: 16,
            padding: 10,
            fill: '#fff',
            align: 'center',
        });

        this._info.setPosition(width / 2, 0);
        this._info.setAnchor(0.5, 0);

        this.app.inputManager.onPointerDown.add(this.updateBlendMode, this);

        this.updateBlendMode();
    },

    updateBlendMode() {
        this._blendModeIndex = (this._blendModeIndex + 1) % this._blendModes.length;

        this._leftBunny.setBlendMode(this._blendModes[this._blendModeIndex]);
        this._rightBunny.setBlendMode(this._blendModes[this._blendModeIndex]);

        this._info.setText([
            `Click to switch between blend modes`,
            `Current blend mode: ${this._blendModeNames[this._blendModeIndex]}`,
        ].join('\n'));
    },

    update(delta) {
        const canvas = this.app.canvas,
            offset = (Math.cos(this._ticker * 3) * 0.5 + 0.5) * (canvas.width * 0.25);

        this._leftBunny.setPosition((canvas.width / 2) - offset, canvas.height / 2);
        this._rightBunny.setPosition((canvas.width / 2) + offset, canvas.height / 2);

        this._ticker += delta.seconds;
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._background);
        renderManager.draw(this._leftBunny);
        renderManager.draw(this._rightBunny);
        renderManager.draw(this._info);
        renderManager.display();
    },
}));
