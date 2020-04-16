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
        loader.add('font', { example: 'font/AndyBold/AndyBold.woff2' }, { family: 'AndyBold' });
    },

    init() {
        const { width, height } = this.app.canvas;

        this._time = new Exo.Time();

        this._text = new Exo.Text('Hello World!', {
            align: 'left',
            fill: 'white',
            stroke: 'black',
            strokeThickness: 3,
            fontSize: 25,
            fontFamily: 'AndyBold',
        });

        this._text.setPosition(width / 2, height / 2);
        this._text.setAnchor(0.5, 0.5);
    },

    update(delta) {
        this._text
            .setText(`Hello World! ${this._time.addTime(delta).seconds | 0}`)
            .rotate(delta.seconds * 36);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._text);
        renderManager.display();
    },
}));
