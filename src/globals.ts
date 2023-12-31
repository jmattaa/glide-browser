import { BrowserViewConstructorOptions } from 'electron';
import * as path from 'path';

export const settingsPath = path.join(__dirname, 'user', 'settings.json');
export const webpageOpts: BrowserViewConstructorOptions = {
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
    },
}

