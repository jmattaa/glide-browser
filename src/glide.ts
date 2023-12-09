import { BrowserWindow, BrowserView, ipcMain } from 'electron';
import * as path from 'path';

export class Glide {
    public url: string;
    public window: BrowserWindow;
    public page: BrowserView;

    private floatingWindow: BrowserWindow | undefined;

    constructor() {
        this.url = "";
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        this.window.loadFile(path.join(__dirname, 'index.html'));

        this.page = new BrowserView();

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

    public openUrl(url = this.url) {
        this.url = url
        if (this.url === "") {
            this.openDefaultUrl();
            return
        }

        if (this.url.startsWith("glide://")) {
            this.openGlideUrl();
            return;
        }

        this.page.webContents.loadURL(this.url);
    }

    public openDefaultUrl() {
        this.openGlideUrl("glide://home");
    }

    public showUrlbar() {
        this.floatingWindow = new BrowserWindow({
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
            this.floatingWindow?.focus();
        });
        this.floatingWindow.on('blur', () => {
            this.floatingWindow?.focus();
        });

        this.floatingWindow.loadFile(path.join(__dirname, "searchbar.html"));

        this.floatingWindow.webContents.send('current-url', {url: this.url});
        // searchbar stuff
        ipcMain.on('search-bar-enter', (event, value) => {
            this.openUrl(value);
            this.floatingWindow?.close();
        });

        ipcMain.on('search-bar-escape', () => {
            this.floatingWindow?.close();
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
