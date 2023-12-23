const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const packageFile = require('./../package.json');
const version = packageFile.version;
const platform = process.argv.find(arg => arg.match('platform')).split('=')[1];

require('./package.js')('darwin', platform).then(function(packagePaths) {
    const packagePath = packagePaths[0];
    if (platform === 'arm64') {
        execSync('codesign -s - -a arm64 -f --deep ' + packagePath + '/glide.app');
    }

    const binDir = path.join(process.cwd(), 'releases', 'bin', 'mac');
    if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir);
    }

    let output = fs.createWriteStream(binDir + '/glide-v' + version + platform + '.zip');
    let archive = archiver('zip', {
        zlib: { level: 9 }
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.directory(path.resolve(packagePath, 'glide.app'), 'glide.app')

    archive.pipe(output);
    archive.finalize();
});
