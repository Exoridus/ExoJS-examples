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
        loader.add('texture', { buttons: 'image/buttons.png' });
        loader.add('json', { buttons: 'json/buttons.json' });
    },

    init(resources) {
        this._gamepad = this.app.inputManager.gamepads[0];

        this._buttons = new Exo.Spritesheet(
            resources.get('texture', 'buttons'),
            resources.get('json', 'buttons')
        );

        this._buttonColor = new Exo.Color(255, 255, 255, 0.25);

        this._mappingButtons = new Map();
        this._mappingFunctions = new Map();

        this._status = this.createStatus();
        this._container = this.createGamepad();

        for (const sprite of this._mappingButtons.values()) {
            sprite.setTint(this._buttonColor);
        }

        this._gamepad.onConnect.add(() => this._status.setTint(Exo.Color.White));
        this._gamepad.onDisconnect.add(() => this._status.setTint(this._buttonColor));
        this._gamepad.onUpdate.add((channel, value) => {
            if (this._mappingButtons.has(channel)) {
                this._mappingButtons.get(channel).tint.a = Exo.lerp(0.25, 1, value);
            }

            if (this._mappingFunctions.has(channel)) {
                this._mappingFunctions.get(channel)(value);
            }
        });
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._status);
        renderManager.draw(this._container);
        renderManager.display();
    },

    createStatus() {
        const { width, height } = this.app.canvas;
        const status = this._buttons.getFrameSprite('status');

        status.setAnchor(0.5);
        status.setPosition(width / 2, height / 5);

        if (!this._gamepad.connected) {
            status.setTint(this._buttonColor);
        }

        return status;
    },

    createGamepad() {
        const container = new Exo.Container();

        container.addChild(this.createDPadField());
        container.addChild(this.createFaceButtons());
        container.addChild(this.createShoulderButtons());
        container.addChild(this.createMenuButtons());
        container.addChild(this.createJoysticks());

        return container;
    },

    createDPadField() {
        const { width, height } = this.app.canvas,
            mappedButtons = this._mappingButtons,
            container = new Exo.Container(),
            dpad = this._buttons.getFrameSprite('dpad'),
            dpadUp = this._buttons.getFrameSprite('DPadUp'),
            dpadDown = this._buttons.getFrameSprite('DPadDown'),
            dpadLeft = this._buttons.getFrameSprite('DPadLeft'),
            dpadRight = this._buttons.getFrameSprite('DPadRight');

        mappedButtons.set(Exo.Gamepad.DPadUp, dpadUp);
        mappedButtons.set(Exo.Gamepad.DPadDown, dpadDown);
        mappedButtons.set(Exo.Gamepad.DPadLeft, dpadLeft);
        mappedButtons.set(Exo.Gamepad.DPadRight, dpadRight);

        dpad.setTint(this._buttonColor);

        dpad.setScale(1.75);
        dpadUp.setScale(1.75);
        dpadDown.setScale(1.75);
        dpadLeft.setScale(1.75);
        dpadRight.setScale(1.75);

        container.addChild(dpad);
        container.addChild(dpadUp);
        container.addChild(dpadDown);
        container.addChild(dpadLeft);
        container.addChild(dpadRight);

        container.setAnchor(0.5);
        container.setPosition(width / 5, height / 2);

        return container;
    },

    createFaceButtons() {
        const { width, height } = this.app.canvas,
            mappedButtons = this._mappingButtons,
            container = new Exo.Container(),
            buttonTop = this._buttons.getFrameSprite('FaceTop'),
            buttonLeft = this._buttons.getFrameSprite('FaceLeft'),
            buttonRight = this._buttons.getFrameSprite('FaceRight'),
            buttonBottom = this._buttons.getFrameSprite('FaceBottom');

        mappedButtons.set(Exo.Gamepad.FaceTop, buttonTop);
        mappedButtons.set(Exo.Gamepad.FaceLeft, buttonLeft);
        mappedButtons.set(Exo.Gamepad.FaceRight, buttonRight);
        mappedButtons.set(Exo.Gamepad.FaceBottom, buttonBottom);

        buttonTop.setScale(0.75);
        buttonTop.setPosition(50, 0);

        buttonLeft.setScale(0.75);
        buttonLeft.setPosition(0, 50);

        buttonRight.setScale(0.75);
        buttonRight.setPosition(100, 50);

        buttonBottom.setScale(0.75);
        buttonBottom.setPosition(50, 100);

        container.addChild(buttonTop);
        container.addChild(buttonLeft);
        container.addChild(buttonRight);
        container.addChild(buttonBottom);

        container.setAnchor(0.5);
        container.setPosition(width * 0.8, height / 2);

        return container;
    },

    createShoulderButtons() {
        const { width, height } = this.app.canvas,
            mappedButtons = this._mappingButtons,
            container = new Exo.Container(),
            leftButton = this._buttons.getFrameSprite('ShoulderLeftBottom'),
            rightButton = this._buttons.getFrameSprite('ShoulderRightBottom'),
            leftTrigger = this._buttons.getFrameSprite('ShoulderLeftTop'),
            rightTrigger = this._buttons.getFrameSprite('ShoulderRightTop');

        mappedButtons.set(Exo.Gamepad.ShoulderLeftBottom, leftButton);
        mappedButtons.set(Exo.Gamepad.ShoulderRightBottom, rightButton);
        mappedButtons.set(Exo.Gamepad.ShoulderLeftTop, leftTrigger);
        mappedButtons.set(Exo.Gamepad.ShoulderRightTop, rightTrigger);

        leftButton.setPosition(0, 75);

        rightButton.setAnchor(0.5, 0);
        rightButton.setPosition(width * 0.65, 75);

        rightTrigger.setAnchor(0.5, 0);
        rightTrigger.setPosition(width * 0.65, 0);

        container.addChild(leftButton);
        container.addChild(rightButton);
        container.addChild(leftTrigger);
        container.addChild(rightTrigger);

        container.setAnchor(0.5);
        container.setPosition(width / 2, height / 5);

        return container;
    },

    createMenuButtons() {
        const { width, height } = this.app.canvas,
            mappedButtons = this._mappingButtons,
            container = new Exo.Container(),
            selectButton = this._buttons.getFrameSprite('Select'),
            startButton = this._buttons.getFrameSprite('Start');

        mappedButtons.set(Exo.Gamepad.Select, selectButton);
        mappedButtons.set(Exo.Gamepad.Start, startButton);

        startButton.setAnchor(1, 0);
        startButton.setPosition(width * 0.3, 0);

        container.addChild(selectButton);
        container.addChild(startButton);

        container.setAnchor(0.5);
        container.setPosition(width / 2, height / 2);

        return container;
    },

    createJoysticks() {
        const { width, height } = this.app.canvas,
            mappedButtons = this._mappingButtons,
            mappingFunctions = this._mappingFunctions,
            container = new Exo.Container(),
            leftStick = this._buttons.getFrameSprite('LeftStick'),
            rightStick = this._buttons.getFrameSprite('RightStick'),
            startLeft = new Exo.Vector(0, 0),
            startRight = new Exo.Vector(width * 0.3, 0),
            range = 35;

        mappedButtons.set(Exo.Gamepad.LeftStick, leftStick);
        mappedButtons.set(Exo.Gamepad.RightStick, rightStick);

        mappingFunctions.set(Exo.Gamepad.LeftStickLeft, (value) => (leftStick.x = Exo.lerp(startLeft.x, startLeft.x - range, value)));
        mappingFunctions.set(Exo.Gamepad.LeftStickRight, (value) => (leftStick.x = Exo.lerp(startLeft.x, startLeft.x + range, value)));
        mappingFunctions.set(Exo.Gamepad.LeftStickUp, (value) => (leftStick.y = Exo.lerp(startLeft.y, startLeft.y - range, value)));
        mappingFunctions.set(Exo.Gamepad.LeftStickDown, (value) => (leftStick.y = Exo.lerp(startLeft.y, startLeft.y + range, value)));

        mappingFunctions.set(Exo.Gamepad.RightStickLeft, (value) => (rightStick.x = Exo.lerp(startRight.x, startRight.x - range, value)));
        mappingFunctions.set(Exo.Gamepad.RightStickRight, (value) => (rightStick.x = Exo.lerp(startRight.x, startRight.x + range, value)));
        mappingFunctions.set(Exo.Gamepad.RightStickUp, (value) => (rightStick.y = Exo.lerp(startRight.y, startRight.y - range, value)));
        mappingFunctions.set(Exo.Gamepad.RightStickDown, (value) => (rightStick.y = Exo.lerp(startRight.y, startRight.y + range, value)));

        leftStick.position = startLeft;
        rightStick.position = startRight;

        container.addChild(leftStick);
        container.addChild(rightStick);

        container.setAnchor(0.5, 0);
        container.setPosition(width / 2, height * 0.65);

        return container;
    },
}));
