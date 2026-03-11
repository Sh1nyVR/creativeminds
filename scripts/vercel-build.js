const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const repoRoot = process.cwd();

function runBuild() {
    const args = ['run', 'build:dev', '--workspace=@scratch/scratch-gui'];
    const candidates = process.platform === 'win32' ? ['npm.cmd', 'npm'] : ['npm', 'npm.cmd'];
    for (const cmd of candidates) {
        console.log(`Running build via: ${cmd} ${args.join(' ')}`);
        const result = spawnSync(cmd, args, {
            cwd: repoRoot,
            stdio: 'inherit',
            env: process.env
        });

        if (result.error && result.error.code === 'ENOENT') {
            console.warn(`Command not found: ${cmd}`);
            continue;
        }

        if (result.error) {
            console.error(`Failed to start build command (${cmd}).`);
            console.error(result.error);
            process.exit(1);
        }

        if (result.status !== 0) {
            console.error(`Build command failed with exit code ${result.status}.`);
            process.exit(result.status || 1);
        }

        return;
    }

    console.error('Could not find npm in PATH while running Vercel build.');
    process.exit(1);
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
        const guiDir = path.join(repoRoot, 'packages', 'scratch-gui');
        if (fs.existsSync(guiDir)) {
            const topLevel = fs.readdirSync(guiDir).slice(0, 40);
            console.error(`Top-level entries in packages/scratch-gui: ${topLevel.join(', ')}`);
        }
        process.exit(1);
    }

    const targetDir = path.join(repoRoot, 'build');
    if (path.resolve(sourceDir) === path.resolve(targetDir)) {
        console.log(`Using existing output directory: ${targetDir}`);
        return;
    }

    try {
        fs.rmSync(targetDir, {recursive: true, force: true});
        fs.mkdirSync(targetDir, {recursive: true});
        fs.cpSync(sourceDir, targetDir, {recursive: true});
        console.log(`Copied output from ${sourceDir} to ${targetDir}`);
    } catch (error) {
        console.error(`Failed to prepare output directory. Source: ${sourceDir}, Target: ${targetDir}`);
        console.error(error);
        process.exit(1);
    }
}

runBuild();
ensureOutput();
console.log('Vercel build artifacts are ready in ./build');
