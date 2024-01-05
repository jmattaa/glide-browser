import { app, BrowserWindow } from 'electron';
import { Quiver } from './quiver/quiver';
import fs from 'fs';
import { configDir, settingsPath } from './globals';
import * as path from 'path';

// create settingsPath if not existing
if (!fs.existsSync(settingsPath)) {
    fs.mkdir(configDir, function() {
        fs.cpSync(
            path.join(__dirname, '..', 'user'),
            configDir,
            { recursive: true }
        )
    });
}

let quiver: Quiver;

function createWindow() {
    fs.readFile(settingsPath, (err, res) => {
        if (err)
            throw Error(err + '\r\nQUIVER NOT INSTALLED CORRECTLY!');

        quiver = new Quiver(JSON.parse(res.toString()));
        quiver.urlManager.openUrl();
    });
}

app.on('ready', () => {
    createWindow()

    app.on('activate', () => {
        // mocos stuff
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// more macos stuff
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

