"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const glide_1 = require("./glide");
let glide;
function createWindow() {
    glide = new glide_1.Glide();
    glide.openUrl();
}
electron_1.app.on('ready', () => {
    createWindow();
    electron_1.globalShortcut.register("CommandOrControl+l", () => glide.showUrlbar());
    electron_1.globalShortcut.register("CommandOrControl+[", () => glide.goBack());
    electron_1.globalShortcut.register("CommandOrControl+]", () => glide.goForward());
    electron_1.app.on('activate', () => {
        // mocos stuff
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// more macos stuff
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
