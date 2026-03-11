const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const StageLayering = require('../../engine/stage-layering');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');

class Scratch3ThreeDBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this._penSkinId = -1;
        this._penDrawableId = -1;
        this._sharedState = Clone.simple(Scratch3ThreeDBlocks.DEFAULT_STATE);
        this.runtime.on('targetWasCreated', this._onTargetCreated.bind(this));
    }

    static get STATE_KEY () {
        return 'Scratch.threed';
    }

    static get DEFAULT_STATE () {
        return {
            skybox: 'day',
            sceneName: 'Scene 1',
            focalLength: 300,
            cameraX: 0,
            cameraY: 0,
            cameraZ: -250,
            cameraRotX: 0,
            cameraRotY: 0,
            cameraRotZ: 0,
            objects: []
        };
    }

    getInfo () {
        return {
            id: 'threed',
            name: formatMessage({
                id: 'threed.categoryName',
                default: '3D',
                description: 'Label for the 3D extension category'
            }),
            blocks: [
                {
                    blockType: BlockType.BUTTON,
                    text: 'New Scene',
                    func: 'newSceneButton'
                },
                {
                    blockType: BlockType.BUTTON,
                    text: 'Add Cube',
                    func: 'addCubeButton'
                },
                {
                    blockType: BlockType.BUTTON,
                    text: 'Add Sphere',
                    func: 'addSphereButton'
                },
                {
                    blockType: BlockType.BUTTON,
                    text: 'Render',
                    func: 'renderButton'
                },
                '---',
                {
                    opcode: 'renderScene',
                    blockType: BlockType.COMMAND,
                    text: 'render 3D scene',
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'createScene',
                    blockType: BlockType.COMMAND,
                    text: 'create scene [NAME]',
                    arguments: {NAME: {type: ArgumentType.STRING, defaultValue: 'Scene 1'}},
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'clearScene',
                    blockType: BlockType.COMMAND,
                    text: 'clear scene objects',
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setSkybox',
                    blockType: BlockType.COMMAND,
                    text: 'set skybox [SKYBOX]',
                    arguments: {SKYBOX: {type: ArgumentType.STRING, menu: 'skyboxes', defaultValue: 'day'}},
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'addPrimitive',
                    blockType: BlockType.COMMAND,
                    text: 'add [SHAPE] [ID] x [X] y [Y] z [Z] size [SIZE]',
                    arguments: {
                        SHAPE: {type: ArgumentType.STRING, menu: 'shapes', defaultValue: 'cube'},
                        ID: {type: ArgumentType.STRING, defaultValue: 'obj1'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 200},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setObjectPosition',
                    blockType: BlockType.COMMAND,
                    text: 'set object [ID] x [X] y [Y] z [Z]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'objectsMenu', defaultValue: 'obj1'},
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setObjectRotation',
                    blockType: BlockType.COMMAND,
                    text: 'set object [ID] rot x [RX] y [RY] z [RZ]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'objectsMenu', defaultValue: 'obj1'},
                        RX: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RY: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RZ: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'moveObjectBy',
                    blockType: BlockType.COMMAND,
                    text: 'move object [ID] by x [DX] y [DY] z [DZ]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'objectsMenu', defaultValue: 'obj1'},
                        DX: {type: ArgumentType.NUMBER, defaultValue: 10},
                        DY: {type: ArgumentType.NUMBER, defaultValue: 0},
                        DZ: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'rotateObjectBy',
                    blockType: BlockType.COMMAND,
                    text: 'rotate object [ID] by x [RX] y [RY] z [RZ]',
                    arguments: {
                        ID: {type: ArgumentType.STRING, menu: 'objectsMenu', defaultValue: 'obj1'},
                        RX: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RY: {type: ArgumentType.NUMBER, defaultValue: 15},
                        RZ: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setParent',
                    blockType: BlockType.COMMAND,
                    text: 'set parent of [CHILD] to [PARENT]',
                    arguments: {
                        CHILD: {type: ArgumentType.STRING, menu: 'objectsMenu', defaultValue: 'obj1'},
                        PARENT: {type: ArgumentType.STRING, menu: 'objectsMenu', defaultValue: 'none'}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setCameraPosition',
                    blockType: BlockType.COMMAND,
                    text: 'set camera x [X] y [Y] z [Z]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: -250}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setCameraRotation',
                    blockType: BlockType.COMMAND,
                    text: 'set camera rot x [RX] y [RY] z [RZ]',
                    arguments: {
                        RX: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RY: {type: ArgumentType.NUMBER, defaultValue: 0},
                        RZ: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setFocalLength',
                    blockType: BlockType.COMMAND,
                    text: 'set camera depth [FOCAL]',
                    arguments: {FOCAL: {type: ArgumentType.NUMBER, defaultValue: 300}},
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'sceneToJSON',
                    blockType: BlockType.REPORTER,
                    text: 'scene as JSON',
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'hierarchyText',
                    blockType: BlockType.REPORTER,
                    text: 'object hierarchy',
                    filter: [TargetType.SPRITE]
                }
            ],
            menus: {
                shapes: {acceptReporters: true, items: ['cube', 'sphere']},
                skyboxes: {acceptReporters: true, items: ['day', 'sunset', 'night', 'space', 'grid']},
                objectsMenu: {
                    acceptReporters: true,
                    items: '_objectsMenuItems'
                }
            }
        };
    }

    _onTargetCreated (newTarget, sourceTarget) {
        // Scene state is global to the extension, not per-target.
    }

    _getState (target) {
        return this._sharedState;
    }

    _getPreferredTarget () {
        return this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
    }

    _resolveTarget (util) {
        return (util && util.target) ? util.target : this._getPreferredTarget();
    }

    _ensurePenLayer () {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
        }
        return this._penSkinId;
    }

    _rotate (p, rx, ry, rz) {
        const dx = (rx * Math.PI) / 180;
        const dy = (ry * Math.PI) / 180;
        const dz = (rz * Math.PI) / 180;
        let {x, y, z} = p;
        let c = Math.cos(dx); let s = Math.sin(dx);
        [y, z] = [(y * c) - (z * s), (y * s) + (z * c)];
        c = Math.cos(dy); s = Math.sin(dy);
        [x, z] = [(x * c) + (z * s), (-x * s) + (z * c)];
        c = Math.cos(dz); s = Math.sin(dz);
        [x, y] = [(x * c) - (y * s), (x * s) + (y * c)];
        return {x, y, z};
    }

    _project (state, p) {
        const world = {x: p.x - state.cameraX, y: p.y - state.cameraY, z: p.z - state.cameraZ};
        const camera = this._rotate(this._rotate(this._rotate(world, 0, 0, -state.cameraRotZ), 0, -state.cameraRotY, 0), -state.cameraRotX, 0, 0);
        if (camera.z <= 1) return null;
        const scale = Math.max(1, state.focalLength) / camera.z;
        return {x: camera.x * scale, y: camera.y * scale};
    }

    _meshCube () {
        return {
            v: [
                {x: -0.5, y: -0.5, z: -0.5}, {x: 0.5, y: -0.5, z: -0.5},
                {x: 0.5, y: 0.5, z: -0.5}, {x: -0.5, y: 0.5, z: -0.5},
                {x: -0.5, y: -0.5, z: 0.5}, {x: 0.5, y: -0.5, z: 0.5},
                {x: 0.5, y: 0.5, z: 0.5}, {x: -0.5, y: 0.5, z: 0.5}
            ],
            e: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
        };
    }

    _meshSphere () {
        const v = [];
        const e = [];
        const lat = 8;
        const lon = 12;
        for (let i = 0; i <= lat; i++) {
            const t = (Math.PI * i) / lat;
            const y = Math.cos(t) * 0.5;
            const r = Math.sin(t) * 0.5;
            for (let j = 0; j < lon; j++) {
                const p = (Math.PI * 2 * j) / lon;
                v.push({x: Math.cos(p) * r, y, z: Math.sin(p) * r});
            }
        }
        for (let i = 0; i <= lat; i++) {
            for (let j = 0; j < lon; j++) {
                const a = (i * lon) + j;
                e.push([a, (i * lon) + ((j + 1) % lon)]);
                if (i < lat) e.push([a, ((i + 1) * lon) + j]);
            }
        }
        return {v, e};
    }

    _drawLine (x0, y0, x1, y1, color4f) {
        this.runtime.renderer.penLine(this._penSkinId, {color4f, diameter: 1}, x0, y0, x1, y1);
    }

    _renderScene (target) {
        if (!target) return;
        if (this._ensurePenLayer() < 0) return;
        const state = this._getState(target);
        this.runtime.renderer.penClear(this._penSkinId);
        const sky = {
            day: [0.2, 0.5, 0.95, 1],
            sunset: [0.95, 0.45, 0.15, 1],
            night: [0.2, 0.3, 0.6, 1],
            space: [0.9, 0.95, 1, 1],
            grid: [0.3, 0.8, 0.3, 1]
        }[state.skybox] || [0.2, 0.5, 0.95, 1];
        this._drawLine(-240, 180, 240, 180, sky);
        this._drawLine(-240, -180, 240, -180, sky);
        this._drawLine(-240, -180, -240, 180, sky);
        this._drawLine(240, -180, 240, 180, sky);

        for (const obj of state.objects) {
            const t = this._getWorldTransform(state, obj, 0);
            const mesh = obj.shape === 'sphere' ? this._meshSphere() : this._meshCube();
            const worldVerts = mesh.v.map(p => {
                const scaled = {x: p.x * obj.size, y: p.y * obj.size, z: p.z * obj.size};
                const rotated = this._rotate(scaled, t.rx, t.ry, t.rz);
                return {x: rotated.x + t.x, y: rotated.y + t.y, z: rotated.z + t.z};
            });
            for (const edge of mesh.e) {
                const a = this._project(state, worldVerts[edge[0]]);
                const b = this._project(state, worldVerts[edge[1]]);
                if (!a || !b) continue;
                this._drawLine(a.x, a.y, b.x, b.y, [1, 1, 1, 1]);
            }
        }
        this.runtime.requestRedraw();
    }

    _getWorldTransform (state, obj, depth) {
        if (!obj || depth > 16 || !obj.parentId) {
            return {
                x: obj.x,
                y: obj.y,
                z: obj.z,
                rx: obj.rx,
                ry: obj.ry,
                rz: obj.rz
            };
        }
        const parent = state.objects.find(o => o.id === obj.parentId);
        if (!parent) {
            return {
                x: obj.x,
                y: obj.y,
                z: obj.z,
                rx: obj.rx,
                ry: obj.ry,
                rz: obj.rz
            };
        }
        const pt = this._getWorldTransform(state, parent, depth + 1);
        return {
            x: pt.x + obj.x,
            y: pt.y + obj.y,
            z: pt.z + obj.z,
            rx: pt.rx + obj.rx,
            ry: pt.ry + obj.ry,
            rz: pt.rz + obj.rz
        };
    }

    _objectsMenuItems () {
        const target = this._getPreferredTarget();
        if (!target) return ['none'];
        const state = this._getState(target);
        if (!state.objects.length) return ['none'];
        return state.objects.map(obj => obj.id);
    }

    _buildHierarchy (state) {
        return state.objects.map(obj => `${obj.id}->${obj.parentId || 'root'}`).join(', ');
    }

    newSceneButton () {
        const target = this._getPreferredTarget();
        if (!target) return;
        this.createScene({NAME: 'Scene 1'}, {target});
    }

    addCubeButton () {
        const target = this._getPreferredTarget();
        if (!target) return;
        const state = this._getState(target);
        const id = `cube${state.objects.length + 1}`;
        this.addPrimitive({SHAPE: 'cube', ID: id, X: 0, Y: 0, Z: 220, SIZE: 100}, {target});
    }

    addSphereButton () {
        const target = this._getPreferredTarget();
        if (!target) return;
        const state = this._getState(target);
        const id = `sphere${state.objects.length + 1}`;
        this.addPrimitive({SHAPE: 'sphere', ID: id, X: 120, Y: 0, Z: 260, SIZE: 80}, {target});
    }

    renderButton () {
        const target = this._getPreferredTarget();
        if (!target) return;
        this._renderScene(target);
    }

    createScene (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        s.sceneName = Cast.toString(args.NAME) || 'Scene';
        s.objects = [];
        this._renderScene(target);
    }

    clearScene (args, util) {
        const target = this._resolveTarget(util);
        this._getState(target).objects = [];
        this._renderScene(target);
    }

    setSkybox (args, util) {
        const target = this._resolveTarget(util);
        this._getState(target).skybox = Cast.toString(args.SKYBOX).toLowerCase();
        this._renderScene(target);
    }

    addPrimitive (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        const id = Cast.toString(args.ID).trim() || 'obj1';
        const obj = {
            id,
            shape: Cast.toString(args.SHAPE).toLowerCase(),
            x: Cast.toNumber(args.X),
            y: Cast.toNumber(args.Y),
            z: Cast.toNumber(args.Z),
            size: Math.max(1, Cast.toNumber(args.SIZE)),
            rx: 0,
            ry: 0,
            rz: 0,
            parentId: null
        };
        const idx = s.objects.findIndex(o => o.id === id);
        if (idx >= 0) s.objects[idx] = obj;
        else s.objects.push(obj);
        this._renderScene(target);
    }

    setObjectPosition (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        const obj = s.objects.find(o => o.id === Cast.toString(args.ID));
        if (!obj) return;
        obj.x = Cast.toNumber(args.X);
        obj.y = Cast.toNumber(args.Y);
        obj.z = Cast.toNumber(args.Z);
        this._renderScene(target);
    }

    setObjectRotation (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        const obj = s.objects.find(o => o.id === Cast.toString(args.ID));
        if (!obj) return;
        obj.rx = Cast.toNumber(args.RX);
        obj.ry = Cast.toNumber(args.RY);
        obj.rz = Cast.toNumber(args.RZ);
        this._renderScene(target);
    }

    moveObjectBy (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        const obj = s.objects.find(o => o.id === Cast.toString(args.ID));
        if (!obj) return;
        obj.x += Cast.toNumber(args.DX);
        obj.y += Cast.toNumber(args.DY);
        obj.z += Cast.toNumber(args.DZ);
        this._renderScene(target);
    }

    rotateObjectBy (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        const obj = s.objects.find(o => o.id === Cast.toString(args.ID));
        if (!obj) return;
        obj.rx += Cast.toNumber(args.RX);
        obj.ry += Cast.toNumber(args.RY);
        obj.rz += Cast.toNumber(args.RZ);
        this._renderScene(target);
    }

    setParent (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        const childId = Cast.toString(args.CHILD);
        const parentId = Cast.toString(args.PARENT);
        const child = s.objects.find(o => o.id === childId);
        if (!child) return;
        child.parentId = (parentId === 'none' || parentId === childId) ? null : parentId;
        this._renderScene(target);
    }

    setCameraPosition (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        s.cameraX = Cast.toNumber(args.X);
        s.cameraY = Cast.toNumber(args.Y);
        s.cameraZ = Cast.toNumber(args.Z);
        this._renderScene(target);
    }

    setCameraRotation (args, util) {
        const target = this._resolveTarget(util);
        const s = this._getState(target);
        s.cameraRotX = Cast.toNumber(args.RX);
        s.cameraRotY = Cast.toNumber(args.RY);
        s.cameraRotZ = Cast.toNumber(args.RZ);
        this._renderScene(target);
    }

    setFocalLength (args, util) {
        const target = this._resolveTarget(util);
        this._getState(target).focalLength = Math.max(1, Cast.toNumber(args.FOCAL));
        this._renderScene(target);
    }

    renderScene (args, util) {
        this._renderScene(this._resolveTarget(util));
    }

    sceneToJSON (args, util) {
        return JSON.stringify(this._getState(this._resolveTarget(util)));
    }

    hierarchyText (args, util) {
        return this._buildHierarchy(this._getState(this._resolveTarget(util)));
    }
}

module.exports = Scratch3ThreeDBlocks;
