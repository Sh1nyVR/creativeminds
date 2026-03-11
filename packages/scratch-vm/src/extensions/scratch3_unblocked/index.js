const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');

class Scratch3Unblocked {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'unblocked',
            name: formatMessage({
                id: 'unblocked.categoryName',
                default: 'Unblocked',
                description: 'Hidden unlocked category'
            }),
            color1: '#000000',
            color2: '#101010',
            color3: '#1f1f1f',
            blocks: [
                {
                    opcode: 'startProcess',
                    blockType: BlockType.COMMAND,
                    text: 'Start Process'
                }
            ]
        };
    }

    startProcess () {
        this.runtime.emit('INTERSTELLAR_START_PROCESS');
    }
}

module.exports = Scratch3Unblocked;
