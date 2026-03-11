const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');

class Scratch3Physics {
    constructor (runtime) {
        this.runtime = runtime;
        this._stepHandle = setInterval(() => this._step(), 1000 / 30);
        this._onProjectStop = this._onProjectStop.bind(this);
        this._onRuntimeDisposed = this._onRuntimeDisposed.bind(this);
        this.runtime.on('PROJECT_STOP_ALL', this._onProjectStop);
        this.runtime.on('RUNTIME_DISPOSED', this._onRuntimeDisposed);
    }

    static get STATE_KEY () {
        return 'Scratch.physics';
    }

    static get DEFAULT_STATE () {
        return {
            enabled: false,
            vx: 0,
            vy: 0,
            fx: 0,
            fy: 0,
            gravity: -0.8,
            mass: 1,
            elasticity: 0.8,
            damping: 0.995
        };
    }

    getInfo () {
        return {
            id: 'physics',
            name: formatMessage({
                id: 'physics.categoryName',
                default: 'Physics',
                description: 'Label for Physics extension category'
            }),
            color1: '#2E8B57',
            color2: '#277349',
            color3: '#1E5A39',
            blocks: [
                {
                    opcode: 'enablePhysics',
                    blockType: BlockType.COMMAND,
                    text: 'set physics [MODE]',
                    arguments: {
                        MODE: {type: ArgumentType.STRING, menu: 'onOffMenu', defaultValue: 'on'}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setGravity',
                    blockType: BlockType.COMMAND,
                    text: 'set gravity to [G]',
                    arguments: {
                        G: {type: ArgumentType.NUMBER, defaultValue: -0.8}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setMass',
                    blockType: BlockType.COMMAND,
                    text: 'set mass to [M]',
                    arguments: {
                        M: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setElasticity',
                    blockType: BlockType.COMMAND,
                    text: 'set elasticity to [E]',
                    arguments: {
                        E: {type: ArgumentType.NUMBER, defaultValue: 0.8}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setDamping',
                    blockType: BlockType.COMMAND,
                    text: 'set damping to [D]',
                    arguments: {
                        D: {type: ArgumentType.NUMBER, defaultValue: 0.995}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'applyForce',
                    blockType: BlockType.COMMAND,
                    text: 'apply force x [FX] y [FY]',
                    arguments: {
                        FX: {type: ArgumentType.NUMBER, defaultValue: 5},
                        FY: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'applyImpulse',
                    blockType: BlockType.COMMAND,
                    text: 'apply impulse x [IX] y [IY]',
                    arguments: {
                        IX: {type: ArgumentType.NUMBER, defaultValue: 30},
                        IY: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setVelocity',
                    blockType: BlockType.COMMAND,
                    text: 'set velocity x [VX] y [VY]',
                    arguments: {
                        VX: {type: ArgumentType.NUMBER, defaultValue: 0},
                        VY: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'stepNow',
                    blockType: BlockType.COMMAND,
                    text: 'step physics now',
                    filter: [TargetType.SPRITE]
                },
                '---',
                {
                    opcode: 'velocityX',
                    blockType: BlockType.REPORTER,
                    text: 'x velocity',
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'velocityY',
                    blockType: BlockType.REPORTER,
                    text: 'y velocity',
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'isPhysicsOn',
                    blockType: BlockType.BOOLEAN,
                    text: 'physics enabled?',
                    filter: [TargetType.SPRITE]
                }
            ],
            menus: {
                onOffMenu: {
                    acceptReporters: true,
                    items: ['on', 'off']
                }
            }
        };
    }

    _onProjectStop () {
        for (const target of this.runtime.targets) {
            if (target.isStage) continue;
            const state = this._getState(target);
            state.vx = 0;
            state.vy = 0;
            state.fx = 0;
            state.fy = 0;
        }
    }

    _onRuntimeDisposed () {
        if (this._stepHandle) {
            clearInterval(this._stepHandle);
            this._stepHandle = null;
        }
    }

    _getState (target) {
        let state = target.getCustomState(Scratch3Physics.STATE_KEY);
        if (!state) {
            state = Clone.simple(Scratch3Physics.DEFAULT_STATE);
            target.setCustomState(Scratch3Physics.STATE_KEY, state);
        }
        return state;
    }

    _clampInStage (target, state) {
        const bounds = target.getBounds();
        if (!bounds) return;

        let x = target.x;
        let y = target.y;

        if (bounds.left < -240) {
            x += (-240 - bounds.left);
            state.vx = Math.abs(state.vx) * state.elasticity;
        } else if (bounds.right > 240) {
            x -= (bounds.right - 240);
            state.vx = -Math.abs(state.vx) * state.elasticity;
        }

        if (bounds.bottom < -180) {
            y += (-180 - bounds.bottom);
            state.vy = Math.abs(state.vy) * state.elasticity;
        } else if (bounds.top > 180) {
            y -= (bounds.top - 180);
            state.vy = -Math.abs(state.vy) * state.elasticity;
        }

        target.setXY(x, y, true);
    }

    _stepTarget (target) {
        if (target.isStage || target.dragging) return;
        const state = this._getState(target);
        if (!state.enabled) return;

        const mass = Math.max(0.001, Cast.toNumber(state.mass));
        const damping = Math.max(0, Math.min(1, Cast.toNumber(state.damping)));

        state.vx += state.fx / mass;
        state.vy += (state.fy / mass) + Cast.toNumber(state.gravity);

        state.vx *= damping;
        state.vy *= damping;

        target.setXY(target.x + state.vx, target.y + state.vy, true);
        this._clampInStage(target, state);

        state.fx = 0;
        state.fy = 0;
    }

    _step () {
        if (!this.runtime) return;
        for (const target of this.runtime.targets) {
            this._stepTarget(target);
        }
    }

    enablePhysics (args, util) {
        const state = this._getState(util.target);
        state.enabled = Cast.toString(args.MODE).toLowerCase() === 'on';
    }

    setGravity (args, util) {
        const state = this._getState(util.target);
        state.gravity = Cast.toNumber(args.G);
    }

    setMass (args, util) {
        const state = this._getState(util.target);
        state.mass = Math.max(0.001, Cast.toNumber(args.M));
    }

    setElasticity (args, util) {
        const state = this._getState(util.target);
        state.elasticity = Math.max(0, Math.min(1.5, Cast.toNumber(args.E)));
    }

    setDamping (args, util) {
        const state = this._getState(util.target);
        state.damping = Math.max(0, Math.min(1, Cast.toNumber(args.D)));
    }

    applyForce (args, util) {
        const state = this._getState(util.target);
        state.fx += Cast.toNumber(args.FX);
        state.fy += Cast.toNumber(args.FY);
    }

    applyImpulse (args, util) {
        const state = this._getState(util.target);
        const mass = Math.max(0.001, Cast.toNumber(state.mass));
        state.vx += Cast.toNumber(args.IX) / mass;
        state.vy += Cast.toNumber(args.IY) / mass;
    }

    setVelocity (args, util) {
        const state = this._getState(util.target);
        state.vx = Cast.toNumber(args.VX);
        state.vy = Cast.toNumber(args.VY);
    }

    stepNow (args, util) {
        this._stepTarget(util.target);
    }

    velocityX (args, util) {
        return this._getState(util.target).vx;
    }

    velocityY (args, util) {
        return this._getState(util.target).vy;
    }

    isPhysicsOn (args, util) {
        return this._getState(util.target).enabled;
    }
}

module.exports = Scratch3Physics;
