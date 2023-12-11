const packager = require('electron-packager');
const path = require('path');

const args = process.argv.slice(2);
const platformOptionIndex = args.indexOf('--platform');
const archOptionIndex = args.indexOf('--arch');

const platform = platformOptionIndex !== -1 ? args[platformOptionIndex + 1] : process.platform;
const arch = archOptionIndex !== -1 ? args[archOptionIndex + 1] : process.arch;

const validPlatforms = ['darwin', 'win32', 'linux'];
const validArchitectures = ['x64', 'ia32'];

if (!validPlatforms.includes(platform) || !validArchitectures.includes(arch)) {
    console.error('Invalid platform or architecture. Please provide valid options.');
    process.exit(1);
}

function getPlatformIconPath() {
    switch (platform) {
        case 'darwin':
            return path.join(process.cwd(), 'assets/icons/icon.icns');
        case 'win32':
            return path.join(process.cwd(), 'assets/icons/icon.ico');
        case 'linux':
            return path.join(process.cwd(), 'assets/icons/icon.png');
    }
}

const appConfig = {
    dir: process.cwd(),
    name: 'Glide',
    platform: platform,
    arch: arch,
    out: path.join(process.cwd(), 'releases'),
    overwrite: true,
    icon: getPlatformIconPath(),
};

packager(appConfig)
    .then(appPaths => {
        console.log(`App packaged successfully at: ${appPaths.join(', ')}`);
    })
    .catch(error => {
        console.error('Error packaging the app!\n', error);
    });

