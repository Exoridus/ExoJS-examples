const app = new Exo.Application({
    width: 800,
    height: 600,
    clearColor: Exo.Color.black,
    resourcePath: 'assets/',
});

document.body.append(app.canvas);

app.start(new Exo.Scene({

    load(loader) {
        loader.add('texture', { buttons: 'image/buttons.png' });
        loader.add('json', { buttons: 'json/buttons.json' });
    },

    init(resources) {
        this._gamepad = null;
        this._buttons = new Exo.Spritesheet(
            resources.get('texture', 'buttons'),
            resources.get('json', 'buttons')
        );
        this._buttonColor = new Exo.Color(255, 255, 255, 0.25);
        this._mappingButtons = new Map();
        this._mappingFunctions = new Map();
        this._resetFunctions = [];
        this._status = this.createStatus();
        this._container = this.createGamepad();
        this._updateGamepadState = (channel, value, updatedGamepad) => {
            if (!this._gamepad || updatedGamepad.index !== this._gamepad.index) {
                return;
            }

            this.updateMappedVisual(channel, value);
        };

        for (const sprite of this._mappingButtons.values()) {
            sprite.setTint(this._buttonColor);
        }

        this.app.inputManager.onGamepadConnected.add((gamepad) => this.handleGamepadConnected(gamepad));
        this.app.inputManager.onGamepadDisconnected.add((gamepad) => this.handleGamepadDisconnected(gamepad));

        const [connectedGamepad] = this.app.inputManager.gamepads;

        if (connectedGamepad) {
            this.setActiveGamepad(connectedGamepad);
        }
    },

    draw(renderManager) {
        renderManager.clear();
        renderManager.draw(this._status);
        renderManager.draw(this._container);
        renderManager.display();
    },

    handleGamepadConnected(gamepad) {
        if (!this._gamepad) {
            this.setActiveGamepad(gamepad);
        }
    },

    handleGamepadDisconnected(gamepad) {
        if (!this._gamepad || gamepad.index !== this._gamepad.index) {
            return;
        }

        const [nextGamepad] = this.app.inputManager.gamepads;
        this.setActiveGamepad(nextGamepad || null);
    },

    setActiveGamepad(gamepad) {
        if (this._gamepad) {
            this._gamepad.onUpdate.remove(this._updateGamepadState);
        }

        this._gamepad = gamepad;

        if (this._gamepad) {
            this._gamepad.onUpdate.add(this._updateGamepadState);
            this._status.setTint(Exo.Color.white);
            return;
        }

        this._status.setTint(this._buttonColor);
        this.resetVisualState();
    },

    updateMappedVisual(channel, value) {
        if (this._mappingButtons.has(channel)) {
            this._mappingButtons.get(channel).tint.a = Exo.lerp(0.25, 1, value);
        }

        if (this._mappingFunctions.has(channel)) {
            this._mappingFunctions.get(channel)(value);
        }
    },

    resetVisualState() {
        for (const sprite of this._mappingButtons.values()) {
            sprite.tint.a = this._buttonColor.a;
        }

        for (const reset of this._resetFunctions) {
            reset();
        }
    },

    createStatus() {
        const { width, height } = this.app.canvas;
        const status = this._buttons.getFrameSprite('status');

        status.setAnchor(0.5);
        status.setPosition(width / 2, height / 5);
        status.setTint(this._buttonColor);

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
        const { width, height } = this.app.canvas;
        const mappedButtons = this._mappingButtons;
        const container = new Exo.Container();
        const dPad = this._buttons.getFrameSprite('dpad');
        const dPadUp = this._buttons.getFrameSprite('DPadUp');
        const dPadDown = this._buttons.getFrameSprite('DPadDown');
        const dPadLeft = this._buttons.getFrameSprite('DPadLeft');
        const dPadRight = this._buttons.getFrameSprite('DPadRight');

        mappedButtons.set(Exo.Gamepad.dPadUp, dPadUp);
        mappedButtons.set(Exo.Gamepad.dPadDown, dPadDown);
        mappedButtons.set(Exo.Gamepad.dPadLeft, dPadLeft);
        mappedButtons.set(Exo.Gamepad.dPadRight, dPadRight);

        dPad.setTint(this._buttonColor);

        dPad.setScale(1.75);
        dPadUp.setScale(1.75);
        dPadDown.setScale(1.75);
        dPadLeft.setScale(1.75);
        dPadRight.setScale(1.75);

        container.addChild(dPad);
        container.addChild(dPadUp);
        container.addChild(dPadDown);
        container.addChild(dPadLeft);
        container.addChild(dPadRight);

        container.setAnchor(0.5);
        container.setPosition(width / 5, height / 2);

        return container;
    },

    createFaceButtons() {
        const { width, height } = this.app.canvas;
        const mappedButtons = this._mappingButtons;
        const container = new Exo.Container();
        const buttonTop = this._buttons.getFrameSprite('FaceTop');
        const buttonLeft = this._buttons.getFrameSprite('FaceLeft');
        const buttonRight = this._buttons.getFrameSprite('FaceRight');
        const buttonBottom = this._buttons.getFrameSprite('FaceBottom');

        mappedButtons.set(Exo.Gamepad.faceTop, buttonTop);
        mappedButtons.set(Exo.Gamepad.faceLeft, buttonLeft);
        mappedButtons.set(Exo.Gamepad.faceRight, buttonRight);
        mappedButtons.set(Exo.Gamepad.faceBottom, buttonBottom);

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
        const { width, height } = this.app.canvas;
        const mappedButtons = this._mappingButtons;
        const container = new Exo.Container();
        const leftButton = this._buttons.getFrameSprite('ShoulderLeftBottom');
        const rightButton = this._buttons.getFrameSprite('ShoulderRightBottom');
        const leftTrigger = this._buttons.getFrameSprite('ShoulderLeftTop');
        const rightTrigger = this._buttons.getFrameSprite('ShoulderRightTop');

        mappedButtons.set(Exo.Gamepad.shoulderLeftBottom, leftButton);
        mappedButtons.set(Exo.Gamepad.shoulderRightBottom, rightButton);
        mappedButtons.set(Exo.Gamepad.shoulderLeftTop, leftTrigger);
        mappedButtons.set(Exo.Gamepad.shoulderRightTop, rightTrigger);

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
        const { width, height } = this.app.canvas;
        const mappedButtons = this._mappingButtons;
        const container = new Exo.Container();
        const selectButton = this._buttons.getFrameSprite('Select');
        const startButton = this._buttons.getFrameSprite('Start');

        mappedButtons.set(Exo.Gamepad.select, selectButton);
        mappedButtons.set(Exo.Gamepad.start, startButton);

        startButton.setAnchor(1, 0);
        startButton.setPosition(width * 0.3, 0);

        container.addChild(selectButton);
        container.addChild(startButton);

        container.setAnchor(0.5);
        container.setPosition(width / 2, height / 2);

        return container;
    },

    createJoysticks() {
        const { width, height } = this.app.canvas;
        const mappedButtons = this._mappingButtons;
        const mappingFunctions = this._mappingFunctions;
        const container = new Exo.Container();
        const leftStick = this._buttons.getFrameSprite('LeftStick');
        const rightStick = this._buttons.getFrameSprite('RightStick');
        const startLeft = new Exo.Vector(0, 0);
        const startRight = new Exo.Vector(width * 0.3, 0);
        const range = 35;

        mappedButtons.set(Exo.Gamepad.leftStick, leftStick);
        mappedButtons.set(Exo.Gamepad.rightStick, rightStick);

        mappingFunctions.set(Exo.Gamepad.leftStickLeft, (value) => (leftStick.x = Exo.lerp(startLeft.x, startLeft.x - range, value)));
        mappingFunctions.set(Exo.Gamepad.leftStickRight, (value) => (leftStick.x = Exo.lerp(startLeft.x, startLeft.x + range, value)));
        mappingFunctions.set(Exo.Gamepad.leftStickUp, (value) => (leftStick.y = Exo.lerp(startLeft.y, startLeft.y - range, value)));
        mappingFunctions.set(Exo.Gamepad.leftStickDown, (value) => (leftStick.y = Exo.lerp(startLeft.y, startLeft.y + range, value)));
        mappingFunctions.set(Exo.Gamepad.rightStickLeft, (value) => (rightStick.x = Exo.lerp(startRight.x, startRight.x - range, value)));
        mappingFunctions.set(Exo.Gamepad.rightStickRight, (value) => (rightStick.x = Exo.lerp(startRight.x, startRight.x + range, value)));
        mappingFunctions.set(Exo.Gamepad.rightStickUp, (value) => (rightStick.y = Exo.lerp(startRight.y, startRight.y - range, value)));
        mappingFunctions.set(Exo.Gamepad.rightStickDown, (value) => (rightStick.y = Exo.lerp(startRight.y, startRight.y + range, value)));

        this._resetFunctions.push(() => {
            leftStick.setPosition(startLeft.x, startLeft.y);
            rightStick.setPosition(startRight.x, startRight.y);
        });

        leftStick.setPosition(startLeft.x, startLeft.y);
        rightStick.setPosition(startRight.x, startRight.y);

        container.addChild(leftStick);
        container.addChild(rightStick);

        container.setAnchor(0.5, 0);
        container.setPosition(width / 2, height * 0.65);

        return container;
    },
}));
