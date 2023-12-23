"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const glide_1 = require("./glide");
const fs_1 = __importDefault(require("fs"));
const globals_1 = require("./globals");
let glide;
function createWindow() {
    fs_1.default.readFile(globals_1.settingsPath, (err, res) => {
        if (err)
            throw Error(err + '\r\nGLIDE NOT INSTALLED CORRECTLY!');
        glide = new glide_1.Glide(JSON.parse(res.toString()));
        glide.openUrl();
    });
}
electron_1.app.on('ready', () => {
    createWindow();
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
