import { app, BrowserWindow } from 'electron';
import { Glide } from './glide';

let glide: Glide;

function createWindow() {
    glide = new Glide();
    glide.openUrl();
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

