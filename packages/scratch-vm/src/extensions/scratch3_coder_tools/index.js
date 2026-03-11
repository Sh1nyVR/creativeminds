const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Scratch3CoderToolsBlocks {
    getInfo () {
        return {
            id: 'codertools',
            name: formatMessage({
                id: 'codertools.categoryName',
                default: 'Coder Tools',
                description: 'Label for the coder tools extension category'
            }),
            blocks: [
                {
                    opcode: 'clamp',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.clamp',
                        default: 'clamp [VALUE] between [MIN] and [MAX]',
                        description: 'Clamp a number between two limits'
                    }),
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 10},
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 100}
                    }
                },
                {
                    opcode: 'mapRange',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.mapRange',
                        default: 'map [VALUE] from [IN_MIN]..[IN_MAX] to [OUT_MIN]..[OUT_MAX]',
                        description: 'Map a number from one range to another'
                    }),
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 50},
                        IN_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        IN_MAX: {type: ArgumentType.NUMBER, defaultValue: 100},
                        OUT_MIN: {type: ArgumentType.NUMBER, defaultValue: -1},
                        OUT_MAX: {type: ArgumentType.NUMBER, defaultValue: 1}
                    }
                },
                {
                    opcode: 'roundToPlaces',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.roundToPlaces',
                        default: 'round [VALUE] to [PLACES] decimal places',
                        description: 'Round a number to a certain number of decimal places'
                    }),
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 3.14159},
                        PLACES: {type: ArgumentType.NUMBER, defaultValue: 2}
                    }
                },
                {
                    opcode: 'lerp',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.lerp',
                        default: 'interpolate from [A] to [B] by [T]',
                        description: 'Linear interpolation between two values'
                    }),
                    arguments: {
                        A: {type: ArgumentType.NUMBER, defaultValue: 0},
                        B: {type: ArgumentType.NUMBER, defaultValue: 100},
                        T: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    }
                },
                {
                    opcode: 'ifElse',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.ifElse',
                        default: 'if [COND] then [WHEN_TRUE] else [WHEN_FALSE]',
                        description: 'Return one value or another based on a condition'
                    }),
                    arguments: {
                        COND: {type: ArgumentType.BOOLEAN},
                        WHEN_TRUE: {type: ArgumentType.STRING, defaultValue: 'yes'},
                        WHEN_FALSE: {type: ArgumentType.STRING, defaultValue: 'no'}
                    }
                },
                {
                    opcode: 'isValidJSON',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'codertools.isValidJSON',
                        default: 'is valid JSON [TEXT]?',
                        description: 'Check if a string is valid JSON'
                    }),
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: '{"a":1}'}
                    }
                },
                {
                    opcode: 'prettyJSON',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.prettyJSON',
                        default: 'format JSON [TEXT]',
                        description: 'Pretty print JSON text'
                    }),
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: '{"hello":"world"}'}
                    }
                },
                {
                    opcode: 'getJSONPath',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.getJSONPath',
                        default: 'value at path [PATH] in JSON [TEXT]',
                        description: 'Read a value from JSON by path'
                    }),
                    arguments: {
                        PATH: {type: ArgumentType.STRING, defaultValue: 'user.name'},
                        TEXT: {type: ArgumentType.STRING, defaultValue: '{"user":{"name":"Ada"}}'}
                    }
                },
                {
                    opcode: 'hashText',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.hashText',
                        default: 'hash of [TEXT]',
                        description: 'Generate a deterministic numeric hash'
                    }),
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Scratch'}
                    }
                },
                {
                    opcode: 'isBetween',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'codertools.isBetween',
                        default: 'is [VALUE] between [MIN] and [MAX]?',
                        description: 'Check if a value is within a range'
                    }),
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 50},
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 100}
                    }
                },
                {
                    opcode: 'snapToStep',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.snapToStep',
                        default: 'snap [VALUE] to nearest step [STEP]',
                        description: 'Round a value to the nearest step size'
                    }),
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 37},
                        STEP: {type: ArgumentType.NUMBER, defaultValue: 5}
                    }
                },
                {
                    opcode: 'truncateText',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.truncateText',
                        default: 'truncate [TEXT] to [LENGTH] chars',
                        description: 'Trim text to a max length'
                    }),
                    arguments: {
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'hello world'},
                        LENGTH: {type: ArgumentType.NUMBER, defaultValue: 5}
                    }
                },
                {
                    opcode: 'firstNonEmpty',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'codertools.firstNonEmpty',
                        default: 'first non-empty of [A] and [B]',
                        description: 'Return A unless empty, otherwise B'
                    }),
                    arguments: {
                        A: {type: ArgumentType.STRING, defaultValue: ''},
                        B: {type: ArgumentType.STRING, defaultValue: 'fallback'}
                    }
                }
            ]
        };
    }

    clamp (args) {
        const value = Cast.toNumber(args.VALUE);
        let min = Cast.toNumber(args.MIN);
        let max = Cast.toNumber(args.MAX);
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }
        return Math.min(max, Math.max(min, value));
    }

    mapRange (args) {
        const value = Cast.toNumber(args.VALUE);
        const inMin = Cast.toNumber(args.IN_MIN);
        const inMax = Cast.toNumber(args.IN_MAX);
        const outMin = Cast.toNumber(args.OUT_MIN);
        const outMax = Cast.toNumber(args.OUT_MAX);

        const inputRange = inMax - inMin;
        if (inputRange === 0) return outMin;
        const normalized = (value - inMin) / inputRange;
        return outMin + (normalized * (outMax - outMin));
    }

    roundToPlaces (args) {
        const value = Cast.toNumber(args.VALUE);
        const places = Math.max(0, Math.min(20, Math.floor(Cast.toNumber(args.PLACES))));
        const factor = Math.pow(10, places);
        return Math.round(value * factor) / factor;
    }

    lerp (args) {
        const a = Cast.toNumber(args.A);
        const b = Cast.toNumber(args.B);
        const t = Cast.toNumber(args.T);
        return a + ((b - a) * t);
    }

    ifElse (args) {
        return Cast.toBoolean(args.COND) ? args.WHEN_TRUE : args.WHEN_FALSE;
    }

    isValidJSON (args) {
        try {
            JSON.parse(Cast.toString(args.TEXT));
            return true;
        } catch (e) {
            return false;
        }
    }

    prettyJSON (args) {
        try {
            const parsed = JSON.parse(Cast.toString(args.TEXT));
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return '';
        }
    }

    getJSONPath (args) {
        let data;
        try {
            data = JSON.parse(Cast.toString(args.TEXT));
        } catch (e) {
            return '';
        }

        const path = Cast.toString(args.PATH).trim();
        if (!path) return '';

        const tokens = this._tokenizePath(path);
        let cursor = data;
        for (const token of tokens) {
            if (cursor === null || typeof cursor === 'undefined') return '';
            cursor = cursor[token];
        }

        if (typeof cursor === 'undefined') return '';
        if (typeof cursor === 'object') return JSON.stringify(cursor);
        return cursor;
    }

    hashText (args) {
        const text = Cast.toString(args.TEXT);
        let hash = 2166136261;
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    isBetween (args) {
        const value = Cast.toNumber(args.VALUE);
        let min = Cast.toNumber(args.MIN);
        let max = Cast.toNumber(args.MAX);
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }
        return value >= min && value <= max;
    }

    snapToStep (args) {
        const value = Cast.toNumber(args.VALUE);
        const step = Math.abs(Cast.toNumber(args.STEP));
        if (step === 0) return value;
        return Math.round(value / step) * step;
    }

    truncateText (args) {
        const text = Cast.toString(args.TEXT);
        const maxLength = Math.max(0, Math.floor(Cast.toNumber(args.LENGTH)));
        return text.slice(0, maxLength);
    }

    firstNonEmpty (args) {
        const first = Cast.toString(args.A);
        if (first.trim() !== '') return first;
        return Cast.toString(args.B);
    }

    _tokenizePath (path) {
        const tokens = [];
        const regex = /([^[.\]]+)|\[(\d+)\]/g;
        let match = regex.exec(path);
        while (match) {
            if (typeof match[1] !== 'undefined') {
                tokens.push(match[1]);
            } else {
                tokens.push(Cast.toNumber(match[2]));
            }
            match = regex.exec(path);
        }
        return tokens;
    }
}

module.exports = Scratch3CoderToolsBlocks;
