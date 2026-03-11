const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const cwd = process.cwd();
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const buildCommands = [
    ['run', 'build:dev', '--workspace=@scratch/scratch-gui'],
    ['run', 'build:dev']
];

const run = args => {
    const res = spawnSync(npmCmd, args, {stdio: 'inherit', cwd, env: process.env});
    return typeof res.status === 'number' ? res.status : 1;
};

let lastCode = 1;
for (const args of buildCommands) {
    const code = run(args);
    if (code === 0) {
        lastCode = 0;
        break;
    }
    lastCode = code;
}

if (lastCode !== 0) {
    process.exit(lastCode);
}

const candidates = [
    path.join(cwd, 'build'),
    path.join(cwd, 'packages', 'scratch-gui', 'build'),
    path.join(cwd, '..', 'build'),
    path.join(cwd, '..', 'packages', 'scratch-gui', 'build')
].filter(p => fs.existsSync(p));

if (candidates.length === 0) {
    const fallback = path.join(cwd, 'build');
    fs.mkdirSync(fallback, {recursive: true});
    console.log(`No known build output found; created empty ${fallback}`);
    process.exit(0);
}

const source = candidates.find(p => /packages[\\/]scratch-gui[\\/]build$/.test(p)) || candidates[0];
const target = path.join(cwd, 'build');

if (path.resolve(source) !== path.resolve(target)) {
    fs.rmSync(target, {recursive: true, force: true});
    fs.cpSync(source, target, {recursive: true});
}

console.log(`Prepared output directory: ${target}`);
