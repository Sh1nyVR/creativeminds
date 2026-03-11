const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const startCwd = process.cwd();

function findRepoRoot(fromDir) {
    let dir = fromDir;
    for (let i = 0; i < 8; i++) {
        const pkgPath = path.join(dir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                if (Array.isArray(pkg.workspaces)) return dir;
            } catch (_) {}
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return null;
}

const repoRoot = findRepoRoot(startCwd);
if (!repoRoot) {
    console.error(`Could not locate monorepo root from ${startCwd}`);
    process.exit(1);
}

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const build = spawnSync(
    npmCmd,
    ['run', 'build:dev', '--workspace=@scratch/scratch-gui'],
    {cwd: repoRoot, stdio: 'inherit', env: process.env}
);

if ((build.status || 0) !== 0) {
    process.exit(build.status || 1);
}

const source = path.join(repoRoot, 'build');
const target = path.join(startCwd, 'build');
if (!fs.existsSync(source)) {
    console.error(`Missing expected build output: ${source}`);
    process.exit(1);
}

fs.rmSync(target, {recursive: true, force: true});
fs.cpSync(source, target, {recursive: true});
console.log(`Prepared deploy output: ${target}`);
