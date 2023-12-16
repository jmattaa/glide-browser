const platform = process.argv.find(arg => arg.match('platform')).split('=')[1];
const builder = require('electron-builder');
const Platform = builder.Platform;
const Arch = builder.Arch;

function toArch(platform) {
    switch (platform) {
        case 'x64':
            return Arch.x64
        case 'armhf':
            return Arch.armv7l
        case 'arm64':
            return Arch.arm64
        default:
            return Arch.universal
    }
}

require('./package')('linux', platform).then(function(paths) {
    const path = paths[0];

    const installerOptions = {
        artifactName: 'glide-browser.deb',
        packageName: 'glide-browser',
        icon: 'assets/icons/icon.png',
        category: 'Network;WebBrowser',
        packageCategory: 'Network',
        maintainer: 'Jonathan Matta',
        afterInstall: 'resources/postinst_script',
        // all electron dependencies from:
        // https://www.electronjs.org/docs/latest/development/build-instructions-linux
        depends: [
            'base-devel',
            'clang',
            'libdbus',
            'gtk2',
            'libnotify',
            'libgnome-keyring',
            'alsa-lib',
            'libcap',
            'libcups',
            'libxtst',
            'libxss',
            'nss',
            'gcc-multilib',
            'curl',
            'gperf',
            'bison',
            'python',
            'python-dbusmock',
            'jdk8-openjdk',
        ],
    };

    console.log('Creating package (hold on it\'ll take some time :>)');

    const options = {
        linux: {
            target: ['deb']
        },
        directories: {
            buildResources: 'resources',
            output: 'releases/bin/debpackage'
        },
        deb: installerOptions
    };

    builder.build({
        prepackaged: path,
        targets: Platform.LINUX.createTarget(['deb'], toArch(platform)),
        config: options
    })
        .then(() => console.log('Created package. :>'))
        .catch(err => {
            console.error(err, err.stack)
            process.exit(1)
        });
});
