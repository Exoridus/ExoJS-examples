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
        loader.add('texture', { particle: 'image/particle.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        this._particleOptions = new Exo.ParticleOptions();
        this._colorAffector = new Exo.ColorAffector(new Exo.Color(194, 64, 30, 1), new Exo.Color(0, 0, 0, 0));
        this._particleEmitter = new Exo.UniversalEmitter(50, this._particleOptions);

        this._particleSystem = new Exo.ParticleSystem(resources.get('texture', 'particle'));
        this._particleSystem.setPosition(width * 0.5, height * 0.75);
        this._particleSystem.setBlendMode(Exo.BlendModes.ADDITIVE);
        this._particleSystem.addAffector(this._colorAffector);
        this._particleSystem.addEmitter(this._particleEmitter);

        this._random = new Exo.Random();
    },

    update(delta) {
        const { x, y } = this._particleSystem;
        const random = this._random;
        const angle = random.next(90, 100) * (Math.PI / 180);
        const speed = random.next(60, 80);

        this._particleOptions.totalLifetime.set(random.next(5, 10), Exo.TimeInterval.SECONDS);
        this._particleOptions.position.set(x + random.next(-50, 50), y + random.next(-10, 10));
        this._particleOptions.velocity.set(Math.cos(angle) * speed, -Math.sin(angle) * speed);

        this._particleSystem.update(delta);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._particleSystem);
        renderManager.display();
    },
}));
