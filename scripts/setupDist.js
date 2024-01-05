const os = require('os');
const fs = require('fs');
const path = require('path');

// also defined in src/globals.ts
const configDir = fs.existsSync(path.join(os.homedir(), '.config')) ?
    path.join(os.homedir(), '.config', 'quiverbrowser') :
    path.join(os.homedir(), '.quiverbrowser-config');

fs.cpSync(
    path.join(process.cwd(), 'quiver-pages'),
    path.join(process.cwd(), 'dist', 'quiver-pages'),
    { recursive: true }
);
fs.cpSync(
    path.join(process.cwd(), 'root-code'),
    path.join(process.cwd(), 'dist'),
    { recursive: true }
);

fs.mkdir(configDir, function() {
    fs.cpSync(
        path.join(process.cwd(), 'user'),
        configDir,
        { recursive: true }
    )}
);
