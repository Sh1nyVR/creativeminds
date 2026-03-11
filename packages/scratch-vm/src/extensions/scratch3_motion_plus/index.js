const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');

class Scratch3MotionPlus {
    static get STATE_KEY () {
        return 'Scratch.motionPlus';
    }

    static get DEFAULT_STATE () {
        return {
            vx: 0,
            vy: 0
        };
    }

    getInfo () {
        return {
            id: 'motionplus',
            name: formatMessage({
                id: 'motionplus.categoryName',
                default: 'Motion+',
                description: 'Label for Motion+ extension category'
            }),
            color1: '#4C97FF',
            color2: '#3373CC',
            color3: '#2A5FA8',
            blocks: [
                {
                    opcode: 'moveXY',
                    blockType: BlockType.COMMAND,
                    text: 'move x [DX] y [DY]',
                    arguments: {
                        DX: {type: ArgumentType.NUMBER, defaultValue: 10},
                        DY: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'moveTowardPoint',
                    blockType: BlockType.COMMAND,
                    text: 'move toward x [X] y [Y] by [STEPS]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        STEPS: {type: ArgumentType.NUMBER, defaultValue: 10}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'pointTowardPoint',
                    blockType: BlockType.COMMAND,
                    text: 'point toward x [X] y [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setVelocity',
                    blockType: BlockType.COMMAND,
                    text: 'set velocity x [VX] y [VY]',
                    arguments: {
                        VX: {type: ArgumentType.NUMBER, defaultValue: 5},
                        VY: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'applyVelocity',
                    blockType: BlockType.COMMAND,
                    text: 'apply velocity',
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'bounceInStage',
                    blockType: BlockType.COMMAND,
                    text: 'bounce in stage with damping [DAMPING]',
                    arguments: {
                        DAMPING: {type: ArgumentType.NUMBER, defaultValue: 0.9}
                    },
                    filter: [TargetType.SPRITE]
                },
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
                }
            ]
        };
    }

    _getState (target) {
        let state = target.getCustomState(Scratch3MotionPlus.STATE_KEY);
        if (!state) {
            state = Clone.simple(Scratch3MotionPlus.DEFAULT_STATE);
            target.setCustomState(Scratch3MotionPlus.STATE_KEY, state);
        }
        return state;
    }

    moveXY (args, util) {
        util.target.setXY(
            util.target.x + Cast.toNumber(args.DX),
            util.target.y + Cast.toNumber(args.DY)
        );
    }

    moveTowardPoint (args, util) {
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const steps = Cast.toNumber(args.STEPS);
        const dx = x - util.target.x;
        const dy = y - util.target.y;
        const len = Math.sqrt((dx * dx) + (dy * dy));
        if (len <= 0) return;
        util.target.setXY(
            util.target.x + ((dx / len) * steps),
            util.target.y + ((dy / len) * steps)
        );
    }

    pointTowardPoint (args, util) {
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const dx = x - util.target.x;
        const dy = y - util.target.y;
        const direction = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
        util.target.setDirection(direction);
    }

    setVelocity (args, util) {
        const state = this._getState(util.target);
        state.vx = Cast.toNumber(args.VX);
        state.vy = Cast.toNumber(args.VY);
    }

    applyVelocity (args, util) {
        const state = this._getState(util.target);
        util.target.setXY(util.target.x + state.vx, util.target.y + state.vy);
    }

    bounceInStage (args, util) {
        const damping = Cast.toNumber(args.DAMPING);
        const state = this._getState(util.target);
        let x = util.target.x;
        let y = util.target.y;
        if (x < -240 || x > 240) {
            state.vx = -state.vx * damping;
            x = Math.max(-240, Math.min(240, x));
        }
        if (y < -180 || y > 180) {
            state.vy = -state.vy * damping;
            y = Math.max(-180, Math.min(180, y));
        }
        util.target.setXY(x, y);
    }

    velocityX (args, util) {
        return this._getState(util.target).vx;
    }

    velocityY (args, util) {
        return this._getState(util.target).vy;
    }
}

module.exports = Scratch3MotionPlus;
