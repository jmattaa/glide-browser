const fs = require('fs');
const installer = require('electron-installer-windows');
const packageFile = require('./../package.json');
const version = packageFile.version;

if (!fs.existsSync('releases/bin/installers')) {
    fs.mkdirSync('releases/bin/installers');
}

require('./package')('win32', 'x64').then(async function(packagedPaths) {
    if (!fs.existsSync('releases/bin/installers/win32-x64')) {
        fs.mkdirSync('releases/bin/installers/win32-x64');
    }

    const packagePath = packagedPaths[0];
    const installerOpts = {
        src: packagePath,
        dest: 'releases/bin/installers/win32-x64',
        icon: 'assets/icons/icon.ico',
    };

    console.log('creating package (it\'ll take a while!!!!)');

    await installer(installerOpts).catch(e => {
        console.log(e.stack);
        process.exit(1);
    });
})

require('./package')('win32', 'ia32').then(async function(packagedPaths) {
    if (!fs.existsSync('releases/bin/installers/win32-ia32')) {
        fs.mkdirSync('releases/bin/installers/win32-ia32');
    }

    const packagePath = packagedPaths[0];
    const installerOpts = {
        src: packagePath,
        dest: 'releases/bin/installers/win32-ia32',
        icon: 'assets/icons/icon.ico',
    };

    console.log('creating package (it\'ll take a while!!!!)');

    await installer(installerOpts).catch(e => {
        console.log(e.stack);
        process.exit(1);
    });
})
