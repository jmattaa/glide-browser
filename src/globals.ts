import fs from 'fs';
import { BrowserViewConstructorOptions, app } from 'electron';
import * as path from 'path';
import os from 'os';

const quiverHomeDir = os.userInfo().homedir;

// also defined in scripts/setupDist.js
export const configDir = fs.existsSync(path.join(quiverHomeDir, '.config')) ?
    path.join(quiverHomeDir, '.config', 'quiverbrowser') :
    path.join(quiverHomeDir, '.quiverbrowser-config');

export const settingsPath = path.join(configDir, 'settings.json');
export const webpageOpts: BrowserViewConstructorOptions = {
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
    },
}

