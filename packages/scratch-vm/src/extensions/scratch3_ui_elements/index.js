const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const StageLayering = require('../../engine/stage-layering');

class Scratch3UIElements {
    constructor (runtime) {
        this.runtime = runtime;
        this._elements = new Map();
        this._order = [];
        this._nextId = 1;
        this._lastMouseDown = false;
        this._clickedId = '';
        this._dragging = null;
        this._tickHandle = setInterval(() => this._tick(), 1000 / 30);

        this._onProjectStop = this._onProjectStop.bind(this);
        this._onRuntimeDisposed = this._onRuntimeDisposed.bind(this);
        this.runtime.on('PROJECT_STOP_ALL', this._onProjectStop);
        this.runtime.on('RUNTIME_DISPOSED', this._onRuntimeDisposed);
    }

    getInfo () {
        return {
            id: 'uielements',
            name: formatMessage({
                id: 'uielements.categoryName',
                default: 'UI Elements',
                description: 'Label for UI Elements extension category'
            }),
            color1: '#FF8C1A',
            color2: '#E07000',
            color3: '#B95C00',
            blocks: [
                {
                    opcode: 'createPanel',
                    blockType: BlockType.COMMAND,
                    text: 'create panel [ID] w [W] h [H] color [COLOR]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'panel1'},
                        W: {type: ArgumentType.NUMBER, defaultValue: 180},
                        H: {type: ArgumentType.NUMBER, defaultValue: 100},
                        COLOR: {type: ArgumentType.COLOR, defaultValue: '#2B2D42'}
                    }
                },
                {
                    opcode: 'createButton',
                    blockType: BlockType.COMMAND,
                    text: 'create button [ID] text [TEXT]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'button1'},
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Click me'}
                    }
                },
                {
                    opcode: 'createText',
                    blockType: BlockType.COMMAND,
                    text: 'create text [ID] value [TEXT]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'text1'},
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Hello world'}
                    }
                },
                '---',
                {
                    opcode: 'setElementPosition',
                    blockType: BlockType.COMMAND,
                    text: 'set [ID] x [X] y [Y]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'changeElementPosition',
                    blockType: BlockType.COMMAND,
                    text: 'change [ID] x by [DX] y by [DY]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        DX: {type: ArgumentType.NUMBER, defaultValue: 10},
                        DY: {type: ArgumentType.NUMBER, defaultValue: 10}
                    }
                },
                {
                    opcode: 'setElementSize',
                    blockType: BlockType.COMMAND,
                    text: 'set [ID] width [W] height [H]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        W: {type: ArgumentType.NUMBER, defaultValue: 160},
                        H: {type: ArgumentType.NUMBER, defaultValue: 60}
                    }
                },
                {
                    opcode: 'centerElement',
                    blockType: BlockType.COMMAND,
                    text: 'center [ID] on [AXIS]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        AXIS: {type: ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'both'}
                    }
                },
                {
                    opcode: 'setParent',
                    blockType: BlockType.COMMAND,
                    text: 'set parent of [CHILD] to [PARENT]',
                    arguments: {
                        CHILD: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        PARENT: {type: ArgumentType.STRING, menu: 'parentMenu', defaultValue: 'none'}
                    }
                },
                {
                    opcode: 'setAnchor',
                    blockType: BlockType.COMMAND,
                    text: 'set anchor of [ID] to [ANCHOR]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        ANCHOR: {type: ArgumentType.STRING, menu: 'anchorMenu', defaultValue: 'center'}
                    }
                },
                '---',
                {
                    opcode: 'setText',
                    blockType: BlockType.COMMAND,
                    text: 'set text of [ID] to [TEXT]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        TEXT: {type: ArgumentType.STRING, defaultValue: 'Hello!'}
                    }
                },
                {
                    opcode: 'setTextAlign',
                    blockType: BlockType.COMMAND,
                    text: 'set text align of [ID] to [ALIGN]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        ALIGN: {type: ArgumentType.STRING, menu: 'alignMenu', defaultValue: 'left'}
                    }
                },
                {
                    opcode: 'setFontSize',
                    blockType: BlockType.COMMAND,
                    text: 'set font size of [ID] to [SIZE]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 24}
                    }
                },
                {
                    opcode: 'setElementColor',
                    blockType: BlockType.COMMAND,
                    text: 'set color of [ID] to [COLOR]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        COLOR: {type: ArgumentType.COLOR, defaultValue: '#2B2D42'}
                    }
                },
                {
                    opcode: 'setTextColor',
                    blockType: BlockType.COMMAND,
                    text: 'set text color of [ID] to [COLOR]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        COLOR: {type: ArgumentType.COLOR, defaultValue: '#FFFFFF'}
                    }
                },
                {
                    opcode: 'setVisible',
                    blockType: BlockType.COMMAND,
                    text: 'set [ID] visible [VISIBLE]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        VISIBLE: {type: ArgumentType.STRING, menu: 'visibleMenu', defaultValue: 'show'}
                    }
                },
                {
                    opcode: 'setDragMode',
                    blockType: BlockType.COMMAND,
                    text: 'set drag mode of [ID] [MODE]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'text1'},
                        MODE: {type: ArgumentType.STRING, menu: 'dragMenu', defaultValue: 'on'}
                    }
                },
                {
                    opcode: 'bringToFront',
                    blockType: BlockType.COMMAND,
                    text: 'bring [ID] to front',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'sendToBack',
                    blockType: BlockType.COMMAND,
                    text: 'send [ID] to back',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                '---',
                {
                    opcode: 'deleteElement',
                    blockType: BlockType.COMMAND,
                    text: 'delete ui [ID]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'clearUI',
                    blockType: BlockType.COMMAND,
                    text: 'clear all ui'
                },
                '---',
                {
                    opcode: 'elementX',
                    blockType: BlockType.REPORTER,
                    text: '[ID] x',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'elementY',
                    blockType: BlockType.REPORTER,
                    text: '[ID] y',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'elementWidth',
                    blockType: BlockType.REPORTER,
                    text: '[ID] width',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'elementHeight',
                    blockType: BlockType.REPORTER,
                    text: '[ID] height',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'elementExists',
                    blockType: BlockType.BOOLEAN,
                    text: 'ui [ID] exists?',
                    arguments: {
                        ID: {type: ArgumentType.STRING, defaultValue: 'panel1'}
                    }
                },
                {
                    opcode: 'isMouseOver',
                    blockType: BlockType.BOOLEAN,
                    text: 'mouse over [ID]?',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'button1'}
                    }
                },
                {
                    opcode: 'elementClicked',
                    blockType: BlockType.BOOLEAN,
                    text: '[ID] clicked?',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'button1'}
                    }
                },
                {
                    opcode: 'elementColorIs',
                    blockType: BlockType.BOOLEAN,
                    text: '[ID] color is [COLOR]?',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'elementsMenu', defaultValue: 'panel1'},
                        COLOR: {type: ArgumentType.COLOR, defaultValue: '#2B2D42'}
                    }
                }
            ],
            menus: {
                elementsMenu: {
                    acceptReporters: true,
                    items: '_elementItems'
                },
                parentMenu: {
                    acceptReporters: true,
                    items: '_parentItems'
                },
                anchorMenu: {
                    acceptReporters: true,
                    items: [
                        'top-left',
                        'top',
                        'top-right',
                        'left',
                        'center',
                        'right',
                        'bottom-left',
                        'bottom',
                        'bottom-right'
                    ]
                },
                axisMenu: {
                    acceptReporters: true,
                    items: ['both', 'horizontal', 'vertical']
                },
                alignMenu: {
                    acceptReporters: true,
                    items: ['left', 'center', 'right']
                },
                dragMenu: {
                    acceptReporters: true,
                    items: ['on', 'off']
                },
                visibleMenu: {
                    acceptReporters: true,
                    items: ['show', 'hide']
                }
            }
        };
    }

    _onProjectStop () {
        this._clearAll();
    }

    _onRuntimeDisposed () {
        this._clearAll();
        if (this._tickHandle) {
            clearInterval(this._tickHandle);
            this._tickHandle = null;
        }
    }

    _clearAll () {
        for (const id of this._order) {
            this._destroyElementRender(id);
        }
        this._elements.clear();
        this._order = [];
        this._clickedId = '';
        this._dragging = null;
    }

    _renderer () {
        return this.runtime && this.runtime.renderer;
    }

    _elementItems () {
        if (this._order.length === 0) return [{text: 'none', value: 'none'}];
        return this._order.map(id => ({text: id, value: id}));
    }

    _parentItems () {
        const items = [{text: 'none', value: 'none'}];
        for (const id of this._order) {
            items.push({text: id, value: id});
        }
        return items;
    }

    _normalizeId (value) {
        const raw = String(value).trim();
        if (raw) return raw;
        return `ui${this._nextId++}`;
    }

    _normalizeHex (value) {
        const rgb = Cast.toRgbColorObject(value);
        const toHex = part => {
            const n = Math.max(0, Math.min(255, Math.round(part)));
            const hex = n.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    }

    _ensureElement (id, createType) {
        const key = this._normalizeId(id);
        let element = this._elements.get(key);
        if (!element && createType) {
            element = {
                id: key,
                type: createType,
                text: '',
                width: 120,
                height: 40,
                x: 0,
                y: 0,
                worldX: 0,
                worldY: 0,
                color: '#2b2d42',
                textColor: '#ffffff',
                textAlign: 'left',
                fontSize: 22,
                parentId: null,
                anchor: 'center',
                visible: true,
                dragMode: false,
                skinId: null,
                drawableId: null,
                autoSizeText: createType === 'text'
            };
            this._elements.set(key, element);
            this._order.push(key);
        }
        return element;
    }

    _destroyElementRender (id) {
        const renderer = this._renderer();
        if (!renderer) return;
        const element = this._elements.get(id);
        if (!element) return;
        if (element.drawableId !== null) {
            renderer.destroyDrawable(element.drawableId, StageLayering.SPRITE_LAYER);
            element.drawableId = null;
        }
        if (element.skinId !== null) {
            renderer.destroySkin(element.skinId);
            element.skinId = null;
        }
    }

    _deleteElementInternal (id) {
        const element = this._elements.get(id);
        if (!element) return;
        this._destroyElementRender(id);
        this._elements.delete(id);
        this._order = this._order.filter(current => current !== id);
        for (const other of this._elements.values()) {
            if (other.parentId === id) {
                other.parentId = null;
            }
        }
        if (this._dragging && this._dragging.id === id) {
            this._dragging = null;
        }
    }

    _measureTextBox (text, fontSize) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px sans-serif`;
        const lines = String(text).split('\n');
        let maxWidth = 24;
        for (const line of lines) {
            maxWidth = Math.max(maxWidth, ctx.measureText(line).width + 16);
        }
        const lineHeight = Math.round(fontSize * 1.25);
        const height = Math.max(lineHeight + 8, (lines.length * lineHeight) + 8);
        return {width: Math.ceil(maxWidth), height, lineHeight, lines};
    }

    _createBitmapForElement (element) {
        const fontSize = Math.max(8, Math.round(Cast.toNumber(element.fontSize)));
        let width = Math.max(4, Math.round(Cast.toNumber(element.width)));
        let height = Math.max(4, Math.round(Cast.toNumber(element.height)));
        let lines = [String(element.text)];
        let lineHeight = Math.round(fontSize * 1.25);
        if (element.type === 'text' && element.autoSizeText) {
            const measured = this._measureTextBox(element.text, fontSize);
            width = measured.width;
            height = measured.height;
            lines = measured.lines;
            lineHeight = measured.lineHeight;
            element.width = width;
            element.height = height;
        } else if (element.type !== 'panel') {
            lines = String(element.text).split('\n');
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        if (element.type === 'panel' || element.type === 'button') {
            ctx.fillStyle = element.color;
            ctx.fillRect(0, 0, width, height);
        }

        if (element.type === 'button' || element.type === 'text') {
            ctx.fillStyle = element.textColor;
            ctx.font = `${fontSize}px sans-serif`;
            ctx.textBaseline = 'middle';
            let anchorX = 8;
            if (element.textAlign === 'center') {
                anchorX = width / 2;
                ctx.textAlign = 'center';
            } else if (element.textAlign === 'right') {
                anchorX = width - 8;
                ctx.textAlign = 'right';
            } else {
                ctx.textAlign = 'left';
            }
            const textBlockHeight = lines.length * lineHeight;
            let y = ((height - textBlockHeight) / 2) + (lineHeight / 2);
            for (const line of lines) {
                ctx.fillText(line, anchorX, y);
                y += lineHeight;
            }
        }

        return canvas;
    }

    _ensureElementDrawable (element) {
        const renderer = this._renderer();
        if (!renderer) return;
        if (element.drawableId === null) {
            element.drawableId = renderer.createDrawable(StageLayering.SPRITE_LAYER);
        }
        const canvas = this._createBitmapForElement(element);
        const center = [canvas.width / 2, canvas.height / 2];
        const newSkinId = renderer.createBitmapSkin(canvas, 1, center);
        if (element.skinId !== null) {
            renderer.destroySkin(element.skinId);
        }
        element.skinId = newSkinId;
        renderer.updateDrawableSkinId(element.drawableId, element.skinId);
        renderer.updateDrawableVisible(element.drawableId, element.visible);
    }

    _stageFrame () {
        return {
            centerX: 0,
            centerY: 0,
            width: 480,
            height: 360
        };
    }

    _anchorPoint (frame, anchor) {
        const left = frame.centerX - (frame.width / 2);
        const right = frame.centerX + (frame.width / 2);
        const top = frame.centerY + (frame.height / 2);
        const bottom = frame.centerY - (frame.height / 2);
        switch (anchor) {
        case 'top-left': return {x: left, y: top};
        case 'top': return {x: frame.centerX, y: top};
        case 'top-right': return {x: right, y: top};
        case 'left': return {x: left, y: frame.centerY};
        case 'center': return {x: frame.centerX, y: frame.centerY};
        case 'right': return {x: right, y: frame.centerY};
        case 'bottom-left': return {x: left, y: bottom};
        case 'bottom': return {x: frame.centerX, y: bottom};
        case 'bottom-right': return {x: right, y: bottom};
        default: return {x: frame.centerX, y: frame.centerY};
        }
    }

    _anchorCenterShift (anchor, width, height) {
        const halfW = width / 2;
        const halfH = height / 2;
        switch (anchor) {
        case 'top-left': return {x: halfW, y: -halfH};
        case 'top': return {x: 0, y: -halfH};
        case 'top-right': return {x: -halfW, y: -halfH};
        case 'left': return {x: halfW, y: 0};
        case 'center': return {x: 0, y: 0};
        case 'right': return {x: -halfW, y: 0};
        case 'bottom-left': return {x: halfW, y: halfH};
        case 'bottom': return {x: 0, y: halfH};
        case 'bottom-right': return {x: -halfW, y: halfH};
        default: return {x: 0, y: 0};
        }
    }

    _elementFrame (element) {
        return {
            centerX: element.worldX,
            centerY: element.worldY,
            width: element.width,
            height: element.height
        };
    }

    _computeElementWorld (id, visiting) {
        const element = this._elements.get(id);
        if (!element) return;
        if (visiting.has(id)) return;
        visiting.add(id);

        let frame = this._stageFrame();
        if (element.parentId && this._elements.has(element.parentId)) {
            this._computeElementWorld(element.parentId, visiting);
            const parent = this._elements.get(element.parentId);
            frame = this._elementFrame(parent);
        }
        const anchorPoint = this._anchorPoint(frame, element.anchor);
        const shift = this._anchorCenterShift(element.anchor, element.width, element.height);
        element.worldX = anchorPoint.x + element.x + shift.x;
        element.worldY = anchorPoint.y + element.y + shift.y;
    }

    _layoutAll () {
        const renderer = this._renderer();
        if (!renderer) return;
        const visiting = new Set();
        for (const id of this._order) {
            this._computeElementWorld(id, visiting);
            const element = this._elements.get(id);
            if (!element || element.drawableId === null) continue;
            renderer.updateDrawablePosition(element.drawableId, [element.worldX, element.worldY]);
            renderer.updateDrawableVisible(element.drawableId, element.visible);
        }
        this.runtime.requestRedraw();
    }

    _elementAtPoint (x, y) {
        for (let index = this._order.length - 1; index >= 0; index--) {
            const id = this._order[index];
            const element = this._elements.get(id);
            if (!element || !element.visible) continue;
            const halfW = element.width / 2;
            const halfH = element.height / 2;
            if (x >= element.worldX - halfW && x <= element.worldX + halfW &&
                y >= element.worldY - halfH && y <= element.worldY + halfH) {
                return element;
            }
        }
        return null;
    }

    _tick () {
        const mouse = this.runtime.ioDevices && this.runtime.ioDevices.mouse;
        if (!mouse) return;

        const mouseX = Cast.toNumber(mouse.getScratchX()) || 0;
        const mouseY = Cast.toNumber(mouse.getScratchY()) || 0;
        const isDown = !!mouse.getIsDown();

        this._layoutAll();

        if (isDown && !this._lastMouseDown) {
            const hit = this._elementAtPoint(mouseX, mouseY);
            this._clickedId = hit ? hit.id : '';
            if (hit && hit.dragMode) {
                this._dragging = {
                    id: hit.id,
                    dx: mouseX - hit.worldX,
                    dy: mouseY - hit.worldY
                };
            }
        }

        if (!isDown) {
            this._dragging = null;
        }

        if (this._dragging && isDown) {
            const element = this._elements.get(this._dragging.id);
            if (element) {
                const desiredWorldX = mouseX - this._dragging.dx;
                const desiredWorldY = mouseY - this._dragging.dy;
                let frame = this._stageFrame();
                if (element.parentId && this._elements.has(element.parentId)) {
                    frame = this._elementFrame(this._elements.get(element.parentId));
                }
                const anchorPoint = this._anchorPoint(frame, element.anchor);
                const shift = this._anchorCenterShift(element.anchor, element.width, element.height);
                element.x = desiredWorldX - anchorPoint.x - shift.x;
                element.y = desiredWorldY - anchorPoint.y - shift.y;
                this._layoutAll();
            }
        }

        this._lastMouseDown = isDown;
    }

    _setCommonTextProps (element, text) {
        element.text = Cast.toString(text);
        if (element.type === 'text') {
            element.autoSizeText = true;
        }
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    createPanel (args) {
        const id = this._normalizeId(args.ID);
        const element = this._ensureElement(id, 'panel');
        element.width = Math.max(4, Math.round(Cast.toNumber(args.W)));
        element.height = Math.max(4, Math.round(Cast.toNumber(args.H)));
        element.color = this._normalizeHex(args.COLOR);
        element.text = '';
        element.autoSizeText = false;
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    createButton (args) {
        const id = this._normalizeId(args.ID);
        const element = this._ensureElement(id, 'button');
        element.width = Math.max(50, element.width);
        element.height = Math.max(24, element.height);
        element.color = element.color || '#2b2d42';
        element.textColor = element.textColor || '#ffffff';
        element.textAlign = 'center';
        element.autoSizeText = false;
        this._setCommonTextProps(element, args.TEXT);
    }

    createText (args) {
        const id = this._normalizeId(args.ID);
        const element = this._ensureElement(id, 'text');
        element.textColor = element.textColor || '#ffffff';
        element.textAlign = element.textAlign || 'left';
        element.autoSizeText = true;
        this._setCommonTextProps(element, args.TEXT);
    }

    setElementPosition (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        element.x = Cast.toNumber(args.X);
        element.y = Cast.toNumber(args.Y);
        this._layoutAll();
    }

    changeElementPosition (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        element.x += Cast.toNumber(args.DX);
        element.y += Cast.toNumber(args.DY);
        this._layoutAll();
    }

    setElementSize (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        element.width = Math.max(4, Math.round(Cast.toNumber(args.W)));
        element.height = Math.max(4, Math.round(Cast.toNumber(args.H)));
        if (element.type === 'text') {
            element.autoSizeText = false;
        }
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    centerElement (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        const axis = Cast.toString(args.AXIS).toLowerCase();
        let frame = this._stageFrame();
        if (element.parentId && this._elements.has(element.parentId)) {
            frame = this._elementFrame(this._elements.get(element.parentId));
        }
        const anchorPoint = this._anchorPoint(frame, element.anchor);
        const shift = this._anchorCenterShift(element.anchor, element.width, element.height);
        if (axis === 'both' || axis === 'horizontal') {
            element.x = frame.centerX - anchorPoint.x - shift.x;
        }
        if (axis === 'both' || axis === 'vertical') {
            element.y = frame.centerY - anchorPoint.y - shift.y;
        }
        this._layoutAll();
    }

    setParent (args) {
        const childId = this._normalizeId(args.CHILD);
        const parentIdRaw = Cast.toString(args.PARENT).trim().toLowerCase();
        const child = this._elements.get(childId);
        if (!child) return;
        if (parentIdRaw === 'none') {
            child.parentId = null;
            this._layoutAll();
            return;
        }
        const parentId = this._normalizeId(args.PARENT);
        if (parentId === childId || !this._elements.has(parentId)) {
            return;
        }
        let walker = parentId;
        while (walker) {
            if (walker === childId) return;
            const node = this._elements.get(walker);
            walker = node ? node.parentId : null;
        }
        child.parentId = parentId;
        this._layoutAll();
    }

    setAnchor (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        const anchor = Cast.toString(args.ANCHOR).toLowerCase();
        const valid = [
            'top-left', 'top', 'top-right',
            'left', 'center', 'right',
            'bottom-left', 'bottom', 'bottom-right'
        ];
        if (!valid.includes(anchor)) return;
        element.anchor = anchor;
        this._layoutAll();
    }

    setText (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element || (element.type !== 'text' && element.type !== 'button')) return;
        this._setCommonTextProps(element, args.TEXT);
    }

    setTextAlign (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element || (element.type !== 'text' && element.type !== 'button')) return;
        const align = Cast.toString(args.ALIGN).toLowerCase();
        if (!['left', 'center', 'right'].includes(align)) return;
        element.textAlign = align;
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    setFontSize (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element || (element.type !== 'text' && element.type !== 'button')) return;
        element.fontSize = Math.max(8, Math.round(Cast.toNumber(args.SIZE)));
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    setElementColor (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        element.color = this._normalizeHex(args.COLOR);
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    setTextColor (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element || (element.type !== 'text' && element.type !== 'button')) return;
        element.textColor = this._normalizeHex(args.COLOR);
        this._ensureElementDrawable(element);
        this._layoutAll();
    }

    setVisible (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        element.visible = Cast.toString(args.VISIBLE).toLowerCase() !== 'hide';
        if (element.drawableId !== null && this._renderer()) {
            this._renderer().updateDrawableVisible(element.drawableId, element.visible);
        }
        this._layoutAll();
    }

    setDragMode (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return;
        element.dragMode = Cast.toString(args.MODE).toLowerCase() === 'on';
    }

    bringToFront (args) {
        const id = this._normalizeId(args.ID);
        if (!this._elements.has(id)) return;
        this._order = this._order.filter(current => current !== id);
        this._order.push(id);
        this._layoutAll();
    }

    sendToBack (args) {
        const id = this._normalizeId(args.ID);
        if (!this._elements.has(id)) return;
        this._order = this._order.filter(current => current !== id);
        this._order.unshift(id);
        this._layoutAll();
    }

    deleteElement (args) {
        const id = this._normalizeId(args.ID);
        this._deleteElementInternal(id);
        this._layoutAll();
    }

    clearUI () {
        this._clearAll();
    }

    elementX (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        return element ? Math.round(element.worldX) : 0;
    }

    elementY (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        return element ? Math.round(element.worldY) : 0;
    }

    elementWidth (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        return element ? element.width : 0;
    }

    elementHeight (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        return element ? element.height : 0;
    }

    elementExists (args) {
        return this._elements.has(this._normalizeId(args.ID));
    }

    isMouseOver (args) {
        const id = this._normalizeId(args.ID);
        const element = this._elements.get(id);
        if (!element) return false;
        const mouse = this.runtime.ioDevices && this.runtime.ioDevices.mouse;
        if (!mouse) return false;
        const mouseX = Cast.toNumber(mouse.getScratchX()) || 0;
        const mouseY = Cast.toNumber(mouse.getScratchY()) || 0;
        const halfW = element.width / 2;
        const halfH = element.height / 2;
        return mouseX >= element.worldX - halfW &&
            mouseX <= element.worldX + halfW &&
            mouseY >= element.worldY - halfH &&
            mouseY <= element.worldY + halfH;
    }

    elementClicked (args) {
        const id = this._normalizeId(args.ID);
        const clicked = this._clickedId === id;
        if (clicked) this._clickedId = '';
        return clicked;
    }

    elementColorIs (args) {
        const element = this._elements.get(this._normalizeId(args.ID));
        if (!element) return false;
        return element.color.toLowerCase() === this._normalizeHex(args.COLOR).toLowerCase();
    }
}

module.exports = Scratch3UIElements;
