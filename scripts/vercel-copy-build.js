const fs = require('fs');
const path = require('path');

const source = path.join(process.cwd(), 'packages', 'scratch-gui', 'build');
const target = path.join(process.cwd(), 'build');

if (!fs.existsSync(source)) {
    console.error(`Missing source build directory: ${source}`);
    process.exit(1);
}

fs.rmSync(target, {recursive: true, force: true});
fs.mkdirSync(target, {recursive: true});
fs.cpSync(source, target, {recursive: true});

console.log(`Copied ${source} -> ${target}`);
