const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.Black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

const explosionInterval	= Exo.seconds(1);
const explosionDuration	= Exo.seconds(0.2);
const tailDuration = Exo.seconds(2.5);
const tailsPerExplosion	= 15;
const particlesPerTail = 25;
const gravity = 30;
const fireworkColors = [
    new Exo.Color(100, 255, 135),
    new Exo.Color(175, 255, 135),
    new Exo.Color(85, 190, 255),
    new Exo.Color(255, 145, 255),
    new Exo.Color(100, 100, 255),
    new Exo.Color(140, 250, 190),
    new Exo.Color(255, 135, 135),
    new Exo.Color(240, 255, 135),
    new Exo.Color(245, 215, 80),
];

class FireworkEmitter {

    constructor(particleOptions) {
        this.particleOptions = particleOptions;
        this.accumulatedTime = new Exo.Time();
        this.tailInterval = explosionDuration.milliseconds / tailsPerExplosion;
    }

    apply(system, delta) {
        this.accumulatedTime.addTime(delta);

        while (this.accumulatedTime.milliseconds - this.tailInterval > 0) {
            const velocity = new Exo.PolarVector(Exo.rand(30, 70), Exo.rand(0, 360));
            const scale = this.particleOptions.scale.clone();

            for (let i = 0; i < particlesPerTail; i++) {
                const particle = system.requestParticle();

                scale.multiply(0.8, 0.8);
                velocity.radius *= 0.96;

                particle.applyOptions(this.particleOptions);
                particle.scale = scale;
                particle.velocity = velocity.toVector();

                system.emitParticle(particle);
            }

            this.accumulatedTime.milliseconds -= this.tailInterval;
        }
    }
}

class FireworkAffector {

    /**
     * @param {Particle} particle
     * @param {Time} delta
     * @returns {FireworkAffector}
     */
    apply(particle, delta) {
        particle.velocity.y += delta.seconds * gravity * particle.scale.x * particle.scale.y;
        particle.tint.a = particle.remainingRatio * particle.scale.x;

        return this;
    }
}

app.start(new Exo.Scene({

    load(loader) {
        loader.add('texture', { particle: 'image/particle.png' });
    },

    init(resources) {
        const { width, height } = this.app.canvas;

        /**
         * @type {Size}
         */
        this.canvasSize = new Exo.Size(width, height);

        /**
         * @type {ParticleOptions}
         */
        this.particleOptions = new Exo.ParticleOptions({
            position: new Exo.Vector(
                Exo.rand(0, this.canvasSize.width),
                Exo.rand(0, this.canvasSize.height)
            ),
            scale: new Exo.Vector(0.95, 0.95),
            tint: fireworkColors[Exo.rand(0, fireworkColors.length - 1) | 0],
            totalLifetime: tailDuration,
        });

        /**
         * @type {ParticleSystem}
         */
        this.particleSystem = new Exo.ParticleSystem(resources.get('texture', 'particle'));
        this.particleSystem.addEmitter(new FireworkEmitter(this.particleOptions));
        this.particleSystem.addAffector(new FireworkAffector());

        /**
         * @type {Timer}
         */
        this.explosionTimer = new Exo.Timer(explosionInterval, true);
    },

    update(delta) {
        if (this.explosionTimer.expired) {
            this.particleOptions.tint = fireworkColors[Exo.rand(0, fireworkColors.length - 1) | 0];
            this.particleOptions.position.set(
                Exo.rand(0, this.canvasSize.width),
                Exo.rand(0, this.canvasSize.height)
            );

            this.explosionTimer.restart();
        }

        this.particleSystem.update(delta);
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this.particleSystem);
        renderManager.display();
    },
}));
