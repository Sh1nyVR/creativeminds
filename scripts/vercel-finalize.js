const fs = require('fs');
const path = require('path');

const root = process.cwd();
const target = path.join(root, 'build');
const candidates = [
    path.join(root, 'packages', 'scratch-gui', 'build'),
    path.join(root, 'build'),
    path.join(root, '..', 'packages', 'scratch-gui', 'build'),
    path.join(root, '..', 'build')
];

const source = candidates.find(candidate => fs.existsSync(candidate));

if (!source) {
    console.error('No build output found. Checked these paths:');
    for (const candidate of candidates) console.error(`- ${candidate}`);
    process.exit(1);
}

if (path.resolve(source) !== path.resolve(target)) {
    fs.rmSync(target, {recursive: true, force: true});
    fs.cpSync(source, target, {recursive: true});
}

console.log(`Vercel output ready: ${target}`);
