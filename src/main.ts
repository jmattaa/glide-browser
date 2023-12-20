import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { Glide } from './glide';
import fs from 'fs';

let glide: Glide;

function createWindow() {
    fs.readFile(path.join(__dirname, 'user/settings.json'), (err, res) => {
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

