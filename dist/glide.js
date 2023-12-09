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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glide = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
class Glide {
    constructor() {
        this.url = "";
        this.window = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        this.window.loadFile(path.join(__dirname, 'index.html'));
        this.page = new electron_1.BrowserView();
        const bounds = this.window.getBounds();
        this.page.setBounds({
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height
        });
        this.page.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: false
        });
        this.window.setBrowserView(this.page);
        this.floatingWindow = undefined;
    }
    openUrl(url = this.url) {
        this.url = url;
        if (this.url === "") {
            this.openDefaultUrl();
            return;
        }
        if (this.url.startsWith("glide://")) {
            this.openGlideUrl();
            return;
        }
        this.page.webContents.loadURL(this.url);
    }
    openDefaultUrl() {
        this.openGlideUrl("glide://home");
    }
    showUrlbar() {
        this.floatingWindow = new electron_1.BrowserWindow({
            width: 300,
            height: 50,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            parent: this.window,
        });
        this.floatingWindow.on('show', () => {
            var _a;
            (_a = this.floatingWindow) === null || _a === void 0 ? void 0 : _a.focus();
        });
        this.floatingWindow.on('blur', () => {
            var _a;
            (_a = this.floatingWindow) === null || _a === void 0 ? void 0 : _a.focus();
        });
        this.floatingWindow.loadFile(path.join(__dirname, "searchbar.html"));
        this.floatingWindow.webContents.send('current-url', { url: this.url });
        // searchbar stuff
        electron_1.ipcMain.on('search-bar-enter', (event, value) => {
            var _a;
            this.openUrl(value);
            (_a = this.floatingWindow) === null || _a === void 0 ? void 0 : _a.close();
        });
        electron_1.ipcMain.on('search-bar-escape', () => {
            var _a;
            (_a = this.floatingWindow) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
    openGlideUrl(url = this.url) {
        this.url = url;
        if (!this.url.startsWith("glide://")) {
            this.openDefaultUrl();
            return;
        }
        const filename = "html/" + this.url.replace("glide://", "") + ".html";
        this.page.webContents.loadFile(path.join(__dirname, filename));
    }
}
exports.Glide = Glide;
