import { app, BrowserWindow, globalShortcut } from 'electron';
import { Glide } from './glide';

let glide: Glide;

function createWindow() {
    glide = new Glide();
    glide.openUrl();
}

app.on('ready', () => {
    createWindow()

    globalShortcut.register("CommandOrControl+l", () => glide.showUrlbar());
    globalShortcut.register("CommandOrControl+b", () =>
        glide.goBack());
    globalShortcut.register("CommandOrControl+f", () =>
        glide.goForward());

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

