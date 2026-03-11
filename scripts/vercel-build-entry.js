const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

const cwd = process.cwd();
const pkgPath = path.join(cwd, 'package.json');

if (!fs.existsSync(pkgPath)) {
    throw new Error(`No package.json found in ${cwd}`);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const isMonorepoRoot = Array.isArray(pkg.workspaces);

if (isMonorepoRoot) {
    execSync('npm run build:dev --workspace=@scratch/scratch-gui', {stdio: 'inherit'});

    const src = path.join(cwd, 'packages', 'scratch-gui', 'build');
    const dst = path.join(cwd, 'build');
    if (!fs.existsSync(src)) {
        throw new Error(`Missing source output: ${src}`);
    }

    fs.rmSync(dst, {recursive: true, force: true});
    fs.cpSync(src, dst, {recursive: true});
    console.log(`Prepared output: ${dst}`);
} else {
    execSync('npm run build:dev', {stdio: 'inherit'});

    const dst = path.join(cwd, 'build');
    if (!fs.existsSync(dst)) {
        throw new Error(`Missing output: ${dst}`);
    }
    console.log(`Prepared output: ${dst}`);
}
