import { app, BrowserWindow } from 'electron';
import { Glide } from './glide';
import fs from 'fs';
import { settingsPath } from './globals';

let glide: Glide;

function createWindow() {
    fs.readFile(settingsPath, (err, res) => {
        if (err)
            throw Error(err + '\r\nGLIDE NOT INSTALLED CORRECTLY!');

        glide = new Glide(JSON.parse(res.toString()));
        glide.openUrl();
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

