import { BrowserWindow, BrowserView, ipcMain } from 'electron';
import * as path from 'path';

export class Glide {
    public url: string;
    public window: BrowserWindow; // containing the open website of user
    public page: BrowserView; // containing our index.html defined in dist

    constructor() {
        this.url = "https://google.com";
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
        });

        this.page = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        const bounds = this.window.getBounds();

        this.page.setBounds({
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height,
        });

        this.page.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.window.setBrowserView(this.page);
        this.page.webContents.loadFile(path.join(__dirname, 'index.html'));
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

        this.window.loadURL(this.url);
    }

    public openDefaultUrl() {
        this.openGlideUrl("glide://home");
    }

    public showUrlbar() {
        this.page.webContents.send('searchbar-open', { url: this.url });
        this.page.webContents.focus();

        ipcMain.on('searchbar-enter', (_event, value) => {
            this.openUrl(value);
        });
    }

    openGlideUrl(url = this.url) {
        this.url = url;
        if (!this.url.startsWith("glide://")) {
            this.openDefaultUrl();
            return;
        }

        const filename = "html/" + this.url.replace("glide://", "") + ".html";
        this.window.loadFile(path.join(__dirname, filename));
    }
}
