const fs = require('fs');
const packager = require('electron-packager');
const path = require('path');

function getPlatformIconPath(platform) {
    switch (platform) {
        case 'darwin':
            return path.join(process.cwd(), 'assets', 'icons', 'icon.icns');
        case 'win32':
            return path.join(process.cwd(), 'assets', 'icons', 'icon.ico');
        case 'linux':
            return path.join(process.cwd(), 'assets', 'icons', 'icon.png');
    }
}

async function packageApp(platform, arch) {
    const appConfig = {
        dir: process.cwd(),
        name: 'quiver',
        platform: platform || process.platform,
        arch: arch || process.arch,
        out: path.join(process.cwd(), 'releases'),
        overwrite: true,
        icon: getPlatformIconPath(platform),
    };

    try {
        const appPaths = await packager(appConfig);
        console.log(`App packaged successfully at: ${appPaths.join(', ')}`);
        return appPaths;
    } catch (error) {
        console.error('Error packaging the app:', error);
        throw error;
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    const platformOptionIndex = args.indexOf('--platform');
    const archOptionIndex = args.indexOf('--arch');

    const platform = platformOptionIndex !== -1 ? args[platformOptionIndex + 1] : process.platform;
    const arch = archOptionIndex !== -1 ? args[archOptionIndex + 1] : process.arch;

    packageApp(platform, arch);
}

module.exports = packageApp;

