import fs from 'fs';
import { BrowserViewConstructorOptions, app } from 'electron';
import * as path from 'path';
import os from 'os';

const glideHomeDir = os.userInfo().homedir;

// also defined in scripts/setupDist.js
const configDir = fs.existsSync(path.join(glideHomeDir, '.config')) ?
    path.join(glideHomeDir, '.config', 'glidebrowser') :
    path.join(glideHomeDir, '.glidebrowser-config');

export const settingsPath = path.join(configDir, 'settings.json');
export const webpageOpts: BrowserViewConstructorOptions = {
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
    },
}

