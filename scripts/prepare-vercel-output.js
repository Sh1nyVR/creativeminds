const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const sourceDir = path.join(repoRoot, 'packages', 'scratch-gui', 'build');
const targetDir = path.join(repoRoot, 'build');

if (!fs.existsSync(sourceDir)) {
    console.error(`Expected build output not found: ${sourceDir}`);
    process.exit(1);
}

fs.rmSync(targetDir, {recursive: true, force: true});
fs.mkdirSync(targetDir, {recursive: true});
fs.cpSync(sourceDir, targetDir, {recursive: true});

console.log(`Prepared Vercel output: ${targetDir}`);
