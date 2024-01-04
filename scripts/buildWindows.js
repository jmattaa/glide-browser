const installer = require('electron-installer-windows');
const packageFile = require('./../package.json');
const version = packageFile.version;

if (!fs.existsSync('releases/bin/installers')) {
    fs.mkdirSync('releases/bin/installers');
}

require('./package')('win32', 'x64').then(function(packagedPaths) {
    const packagePath = packagedPaths[0];
    const installerOpts = {
        src: packagePath,
        dest: 'releases/bin/installers',
        icon: 'assets/icons/icon.ico',
    };

    console.log('creating package (it\'ll take a while!!!!)');

    await installer(installerOpts).catch(e => {
        console.log(e.stack);
        process.exit(1);
    });
})

require('./package')('win32', 'x32').then(function(packagedPaths) {
    const packagePath = packagedPaths[0];
    const installerOpts = {
        src: packagePath,
        dest: 'releases/bin/installers',
        icon: 'assets/icons/icon.ico',
    };

    console.log('creating package (it\'ll take a while!!!!)');

    await installer(installerOpts).catch(e => {
        console.log(e.stack);
        process.exit(1);
    });
})
