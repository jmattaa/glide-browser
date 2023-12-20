"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const glide_1 = require("./glide");
const fs_1 = __importDefault(require("fs"));
let glide;
function createWindow() {
    fs_1.default.readFile(path.join(__dirname, 'user/settings.json'), (err, res) => {
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
