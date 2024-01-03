const builder = require('electron-builder');
const Platform = builder.Platform;
const Arch = builder.Arch;

const packageFile = require('./../package.json');
const version = packageFile.version;

const platform = process.argv.find(arg => arg.match('platform')).split('=')[1];

function toArch (platform) {
  switch (platform) {
    case 'x64':
      return Arch.x64
    case 'arm64':
      return Arch.arm64
    default:
      return Arch.universal
  }
}

require('./package.js')('linux', platform).then(function(paths) {
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
        snap: {
            artifactName: 'glide-v' + version + '-linux-' + platform + '.snap'
        }
    };

    builder.build({
        prepackaged: paths[0],
        targets: Platform.LINUX.createTarget(['snap'], toArch(platform)),
        config: options
    });
});

