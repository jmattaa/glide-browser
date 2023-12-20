import { BrowserWindow, BrowserView, ipcMain } from 'electron';
import * as path from 'path';
import { formatUrl } from './utils';
import { getMenuShortcuts } from './menuShortcut';

export class Glide {
    public url: string;
    public webpage: BrowserWindow; // containing the open website of user
    public glideView: BrowserView; // containing our index.html defined in dist
    public settings: any;

    constructor(settings: any) {
        this.settings = settings;
        this.url = this.settings.defaultUrl;

        this.webpage = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: this.settings.autohideMenu,
        });

        this.glideView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        this.webpage.webContents.on('did-navigate', (_event, url) => {
            if (url.startsWith('file://' + path.join(__dirname, 'glide-pages')))
                return;

            this.url = url
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

        this.glideView.webContents.loadFile(path.join(__dirname, 'index.html'))
            .then(() => {
                this.glideView.webContents.send(
                    'main-open', { settings: this.settings })
                this.glideView.webContents.toggleDevTools();
            });

        this.webpage.setMenu(getMenuShortcuts(this));
    }

    public openUrl(url = this.url) {
        if (url.startsWith('glide://')) {
            this.url = url;
            this.openGlideUrl();
            return;
        }

        this.url = formatUrl(url);
        if (this.url === '') {
            this.openDefaultUrl();
            return
        }

        this.webpage.loadURL(this.url);
    }

    public openDefaultUrl() {
        this.openUrl(this.settings.defaultUrl);
    }

    public showUrlbar() {
        this.webpage.setBrowserView(this.glideView);

        this.glideView.setBounds({
            x: 0,
            y: 0,
            width: this.webpage.getBounds().width,
            height: this.webpage.getBounds().height,
        });

        this.glideView.webContents.send('searchbar-open', { url: this.url });
        this.glideView.webContents.focus();

        ipcMain.on('searchbar-enter', (_event, value) => {
            this.openUrl(value);
            this.webpage.removeBrowserView(this.glideView);
        });

        ipcMain.on('searchbar-escape', () => {
            this.webpage.removeBrowserView(this.glideView);
        })
    }

    public goBack() {
        this.webpage.webContents.goBack();
    }

    public goForward() {
        this.webpage.webContents.goForward();
    }

    openGlideUrl(url = this.url) {
        this.url = url;
        if (!this.url.startsWith('glide://')) {
            this.openDefaultUrl();
            return;
        }

        const filename = 'glide-pages/' + this.url.replace('glide://', '') + '.html';
        this.webpage.loadFile(path.join(__dirname, filename));
    }
}
