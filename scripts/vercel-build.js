const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const repoRoot = process.cwd();
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function runBuild() {
    const result = spawnSync(
        npmCmd,
        ['run', 'build:dev', '--workspace=@scratch/scratch-gui'],
        {
            cwd: repoRoot,
            stdio: 'inherit',
            env: process.env
        }
    );

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}

function ensureOutput() {
    const candidates = [
        path.join(repoRoot, 'packages', 'scratch-gui', 'build'),
        path.join(repoRoot, 'build')
    ];

    const sourceDir = candidates.find(candidate => fs.existsSync(candidate));
    if (!sourceDir) {
        console.error('No static output directory was created by the build.');
        console.error(`Checked: ${candidates.join(', ')}`);
        process.exit(1);
    }

    const targetDir = path.join(repoRoot, 'build');
    if (path.resolve(sourceDir) === path.resolve(targetDir)) {
        return;
    }

    fs.rmSync(targetDir, {recursive: true, force: true});
    fs.mkdirSync(targetDir, {recursive: true});
    fs.cpSync(sourceDir, targetDir, {recursive: true});
}

runBuild();
ensureOutput();
console.log('Vercel build artifacts are ready in ./build');
