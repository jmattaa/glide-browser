const builder = require('electron-builder');
const Platform = builder.Platform;
const Arch = builder.Arch;

require('./package.js')('linux', 'x64').then(function(paths) {
    const options = {
        linux: {
            target: ['snap'],
            icon: 'assets/icons/icon.png',
            category: 'Network',
            packageCategory: 'Network',
            maintainer: 'Jonathan Matta',
        },
        directories: {
            output: 'releases/bin/snap'
        },
    };

    builder.build({
        prepackaged: paths[0],
        targets: Platform.LINUX.createTarget(['snap'], Arch.x64),
        config: options
    });
});

