const fs = require('fs');
const archiver = require('archiver');
const builder = require('electron-builder');
const Arch = builder.Arch;

const packageFile = require('./../package.json');
const version = packageFile.version;

const createPackage = require('./package.js');

async function afterPackageBuilt(packagePaths) {
    const packagePath = packagePaths[0];
    if (!fs.existsSync('releases/bin')) {
        fs.mkdirSync('releases/bin');
    }

    var output = fs.createWriteStream(
        'releases/bin/' + 'glide-v' + version + '-windows' +
        (packagePath.includes('ia32') ? '-ia32' : '') + '.zip'
    );
    var archive = archiver('zip', {
        zlib: { level: 9 }
    });
    archive.directory(packagePath, 'glide-v' + version);
    archive.pipe(output);
    await archive.finalize();

    if (!packagePath.includes('ia32')) {
        const installer = require('electron-installer-windows');

        const options = {
            src: packagePath,
            dest: 'releases/bin/glide-installer-win-x64',
            icon: 'assets/icons/icon.ico',
            licenseUrl: 'https://github.com/jmattaa/glide-brwoser/blob/main/LICENSE',
            noMsi: true
        };

        console.log('Creating package (this may take a while)');

        fs.copyFileSync('LICENSE', packagePath + '/LICENSE');

        await installer(options)
            .then(function() {
                fs.renameSync(
                    './releases/bin/glide-installer-win-x64/glide-' + version + '-setup.exe', 
                    './dist/glide/glide-' + version + '-setup.exe'
                );
            })
            .catch(err => {
                console.error(err, err.stack);
                process.exit(1);
            });
    }
}

createPackage('win32', 'x64')
    .then(afterPackageBuilt)
    .then(function() {
        return createPackage('win32', 'ia32')
    })
    .then(afterPackageBuilt);

