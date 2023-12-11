const builder = require('electron-builder');
const Platform = builder.Platform;
const Arch = builder.Arch;

require('./package.js')('linux', 'x64').then(function(paths) {
    const options = {
        linux: {
            target: ['AppImage'],
            icon: 'assets/icon/icons.png',
            category: 'Network',
            packageCategory: 'Network',
            maintainer: 'Jonathan Matta',
        },
        directories: {
            output: 'releases/bin/AppImage'
        },
    };

    builder.build({
        prepackaged: paths[0],
        targets: Platform.LINUX.createTarget(['AppImage'], Arch.x64),
        config: options
    });
});
