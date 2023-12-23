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
exports.Glide = void 0;
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("./utils");
const menubar_1 = require("./menubar");
const templateGen_1 = require("./templateGen");
const globals_1 = require("./globals");
class Glide {
    constructor(settings) {
        this.settings = settings;
        this.url = this.settings['default-url'];
        this.webpage = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            autoHideMenuBar: this.settings['auto-hide-menu'],
        });
        this.glideView = new electron_1.BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        this.webpage.webContents.on('did-navigate', (_event, url) => {
            if (url.startsWith('file://' + path.join(__dirname, 'glide-pages')))
                return;
            this.url = url;
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
        const menubar = (0, menubar_1.getMenubar)(this);
        this.webpage.setMenu(menubar);
        electron_1.Menu.setApplicationMenu(menubar);
        // settings change
        electron_1.ipcMain.on('change-settings', (_event, { setting, value }) => {
            this.settings[setting] = value;
            // write settings
            let settingsJSON = JSON.stringify(this.settings);
            fs_1.default.writeFileSync(globals_1.settingsPath, settingsJSON);
        });
        // gen files
        (0, templateGen_1.genFromTemplateFile)(path.join(__dirname, 'templates', 'css', 'style.css.template'), path.join(__dirname, 'glide-pages', 'css', 'style.css'), {
            'settings.theme.bg': this.settings['theme.bg'],
            'settings.theme.fg': this.settings['theme.fg'],
        });
    }
    openUrl(url = this.url) {
        if (url.startsWith('glide://')) {
            this.url = url;
            this.openGlideUrl();
            return;
        }
        else if ((0, utils_1.isDomain)(url) || (0, utils_1.isUrl)(url)) {
            this.url = (0, utils_1.formatUrl)(url);
        }
        else {
            // searching using searchengine
            if (this.url === '') {
                this.openDefaultUrl();
                return;
            }
            const formattedQuery = url.split(' ').join('+');
            let baseUrl;
            switch (this.settings['search-engine']) {
                case 'google':
                    baseUrl = 'https://www.google.com/search?q=';
                    break;
                case 'bing':
                    baseUrl = 'https://www.bing.com/search?q=';
                    break;
                case 'duckduckgo':
                    baseUrl = 'https://duckduckgo.com/?q=';
                    break;
                default:
                    baseUrl = 'https://duckduckgo.com/?q=';
            }
            this.url = baseUrl + formattedQuery;
        }
        this.webpage.loadURL(this.url);
    }
    openDefaultUrl() {
        this.openUrl(this.settings['default-url']);
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
        this.webpage.webContents.goBack();
    }
    goForward() {
        this.webpage.webContents.goForward();
    }
    openGlideUrl(url = this.url) {
        this.url = url;
        if (!this.url.startsWith('glide://')) {
            this.openDefaultUrl();
            return;
        }
        const filename = path.join('glide-pages', this.url.replace('glide://', '') + '.html');
        this.webpage.loadFile(path.join(__dirname, filename));
    }
}
exports.Glide = Glide;
