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
        loader.add('texture', { example: 'image/uv.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._moveSpeed = 3;
        this._zoomSpeed = 0.01;
        this._rotationSpeed = 1;

        this._camera = new Exo.View(0, 0, width, height);

        this._sprite = new Exo.Sprite(resources.get('texture', 'example'));
        this._sprite.setAnchor(0.5, 0.5);

        this._info = new Exo.Text([
            'Camera:',
            'W/A/S/D = Move',
            'Up/Down = Zoom',
            'Left/Right = Rotate',
            'R = Reset',
        ].join('\n'), {
            fontSize: 16,
            fill: '#fff',
            padding: 10,
        });

        this.app.inputManager.add([

            // Move Up
            new Exo.Input(Exo.Keyboard.W, {
                onActive: (value) => {
                    this._camera.move(0, value * -this._moveSpeed);
                },
            }),

            // Move Down
            new Exo.Input(Exo.Keyboard.S, {
                onActive: (value) => {
                    this._camera.move(0, value * this._moveSpeed);
                },
            }),

            // Move Left
            new Exo.Input(Exo.Keyboard.A, {
                onActive: (value) => {
                    this._camera.move(value * -this._moveSpeed, 0);
                },
            }),

            // Move Right
            new Exo.Input(Exo.Keyboard.D, {
                onActive: (value) => {
                    this._camera.move(value * this._moveSpeed, 0);
                },
            }),

            // Zoom In
            new Exo.Input(Exo.Keyboard.Up, {
                onActive: (value) => {
                    this._camera.zoom(1 + (value * -this._zoomSpeed));
                },
            }),

            // Zoom Out
            new Exo.Input(Exo.Keyboard.Down, {
                onActive: (value) => {
                    this._camera.zoom(1 + (value * this._zoomSpeed));
                },
            }),

            // Rotate Left
            new Exo.Input(Exo.Keyboard.Left, {
                onActive: (value) => {
                    this._camera.rotate(value * -this._rotationSpeed);
                },
            }),

            // Rotate Right
            new Exo.Input(Exo.Keyboard.Right, {
                onActive: (value) => {
                    this._camera.rotate(value * this._rotationSpeed);
                },
            }),

            // Reset
            new Exo.Input(Exo.Keyboard.R, {
                onTrigger: () => {
                    this._camera.reset(0, 0, width, height);
                },
            })
        ]);
    },

    draw(renderManager) {
        renderManager.clear();

        renderManager.renderTarget.setView(this._camera);
        renderManager.draw(this._sprite).display();

        renderManager.renderTarget.setView(null);
        renderManager.draw(this._info).display();
    },
}));
