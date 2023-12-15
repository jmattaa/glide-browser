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
const pageHistory_1 = require("./pageHistory");
class Glide {
    constructor() {
        this.url = "glide://home"; // change this to smth else from user
        this.webpage = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
        });
        this.glideView = new electron_1.BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        this.webpage.webContents.on('did-navigate', (_event, url) => {
            if (url.startsWith("file://" + path.join(__dirname, "glide-pages")))
                return;
            this.url = url;
            this.lastPages.newPage(url);
        });
        const bounds = this.webpage.getBounds();
        this.glideView.setBounds({
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height,
        });
        this.glideView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });
        this.glideView.webContents.loadFile(path.join(__dirname, 'index.html'));
        this.lastPages = new pageHistory_1.PageHistory(this.url);
    }
    openUrl(url = this.url) {
        this.url = url;
        // can i make this more efficient????
        this.lastPages.newPage(url); // this is removed in openHistoryUrl 
        console.log(this.lastPages);
        if (this.url === "") {
            this.openDefaultUrl();
            return;
        }
        if (this.url.startsWith("glide://")) {
            this.openGlideUrl();
            return;
        }
        this.webpage.loadURL(this.url);
    }
    openHistoryUrl(url = this.url) {
        this.url = url;
        console.log(this.lastPages);
        if (this.url === "") {
            this.openDefaultUrl();
            return;
        }
        if (this.url.startsWith("glide://")) {
            this.openGlideUrl();
            return;
        }
        this.webpage.loadURL(this.url);
    }
    openDefaultUrl() {
        this.openGlideUrl("glide://home"); // TODO: add settings so we can change this
    }
    showUrlbar() {
        this.webpage.setBrowserView(this.glideView);
        this.glideView.setBounds({
            x: 0,
            y: 0,
            width: this.webpage.getBounds().width,
            height: this.webpage.getBounds().height,
        });
        this.glideView.webContents.send('searchbar-open', { url: this.url });
        this.glideView.webContents.focus();
        electron_1.ipcMain.on('searchbar-enter', (_event, value) => {
            this.openUrl(value);
            this.webpage.removeBrowserView(this.glideView);
        });
        electron_1.ipcMain.on('searchbar-escape', () => {
            this.webpage.removeBrowserView(this.glideView);
        });
    }
    goBack() {
        this.url = this.lastPages.goBack();
        this.openHistoryUrl();
    }
    goForward() {
        this.url = this.lastPages.goForward();
        this.openHistoryUrl();
    }
    openGlideUrl(url = this.url) {
        this.url = url;
        if (!this.url.startsWith("glide://")) {
            this.openDefaultUrl();
            return;
        }
        const filename = "glide-pages/" + this.url.replace("glide://", "") + ".html";
        this.webpage.loadFile(path.join(__dirname, filename));
    }
}
exports.Glide = Glide;
