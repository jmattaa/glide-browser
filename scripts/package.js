const packager = require('electron-packager');
const path = require('path');

const appConfig = {
    dir: process.cwd(),
    name: 'Glide',
    platform: process.platform, 
    arch: process.arch, 
    out: path.join(process.cwd(), 'releases'), 
    overwrite: true, 
};

packager(appConfig)
    .then(appPaths => {
        console.log(`App packaged successfully at: ${appPaths.join(', ')}`);
    })
    .catch(error => {
        console.error('Error packaging the app:', error);
    });

