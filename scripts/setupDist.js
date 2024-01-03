const os = require('os');
const fs = require('fs');
const path = require('path');

// also defined in src/globals.ts
const configDir = fs.existsSync(path.join(os.homedir(), '.config')) ?
    path.join(os.homedir(), '.config', 'glidebrowser') :
    path.join(os.homedir(), '.glidebrowser-config');

fs.cpSync(
    path.join(process.cwd(), 'glide-pages'),
    path.join(process.cwd(), 'dist', 'glide-pages'),
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
