import fs from 'fs';
import { settingsPath } from '../globals';
import { ipcMain } from 'electron';

export class SettingsManager {
    public settings: any;

    constructor(settings: any) {
        this.settings = settings;

        // settings change
        ipcMain.on('change-settings', (_event, { setting, value }) => {
            this.settings[setting] = value;

            // write settings
            let settingsJSON = JSON.stringify(this.settings);
            fs.writeFileSync(settingsPath, settingsJSON);
        });
    }
}
