import { BrowserWindow, BrowserView, ipcMain } from 'electron';
import * as path from 'path';
import { PageHistory } from './pageHistory';

export class Glide {
    public url: string;
    public webpage: BrowserWindow; // containing the open website of user
    public glideView: BrowserView; // containing our index.html defined in dist
    public lastPages: PageHistory;

    constructor() {
        this.url = "glide://home"; // change this to smth else from user
        this.webpage = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
        });

        this.glideView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        this.webpage.webContents.on('did-navigate', (_event, url) => {
            if (url.startsWith("file://" + path.join(__dirname, "glide-pages")))
                return;

            this.url = url
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

        this.lastPages = new PageHistory(this.url);
    }

    public openUrl(url = this.url) {
        this.url = url
        // can i make this more efficient????
        this.lastPages.newPage(url); // this is removed in openHistoryUrl 
        console.log(this.lastPages);
        if (this.url === "") {
            this.openDefaultUrl();
            return
        }

        if (this.url.startsWith("glide://")) {
            this.openGlideUrl();
            return;
        }

        this.webpage.loadURL(this.url);
    }

    public openHistoryUrl(url = this.url) {
        this.url = url
        console.log(this.lastPages);
        if (this.url === "") {
            this.openDefaultUrl();
            return
        }

        if (this.url.startsWith("glide://")) {
            this.openGlideUrl();
            return;
        }

        this.webpage.loadURL(this.url);
    }

    public openDefaultUrl() {
        this.openGlideUrl("glide://home"); // TODO: add settings so we can change this
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
        this.url = this.lastPages.goBack();
        this.openHistoryUrl();
    }

    public goForward() {
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
