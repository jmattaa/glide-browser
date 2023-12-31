import { BrowserWindow, BrowserView, Menu, ipcRenderer, ipcMain } from 'electron';
import * as path from 'path';
import { getMenubar } from '../menubar';
import { webpageOpts } from '../globals';
import { Glide } from './glide';

export class WindowManager {
    public appwindow: BrowserWindow;
    public glideView: BrowserView;
    public webpage: BrowserView;
    public tabChooserView: BrowserView | null = null;

    private glide: Glide;

    constructor(glide: Glide, settings: any) {
        this.glide = glide;
        this.appwindow = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: settings['auto-hide-menu'],
            titleBarStyle: settings['titlebar-hidden'] ?
                'customButtonsOnHover' : 'default',
        });

        const menubar = getMenubar(this.glide);
        Menu.setApplicationMenu(menubar);

        const appwinBounds = this.appwindow.getBounds();

        this.glideView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        this.glideView.setBounds({
            x: 0,
            y: 0,
            width: appwinBounds.width,
            height: appwinBounds.height,
        });

        this.glideView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.glideView.webContents.loadFile(path.join(__dirname, '..', 'index.html'));

        this.webpage = new BrowserView(webpageOpts);

        ipcMain.on('reload-err-page', (_e, { url }) => {
            this.glide.urlManager.openUrl(url);
        });
    }

    public goBack() {
        this.webpage.webContents.goBack();
        this.glide.urlManager.url = this.webpage.webContents.getURL();
    }

    public goForward() {
        this.webpage.webContents.goForward();
        this.glide.urlManager.url = this.webpage.webContents.getURL();
    }

    public fitScreen() {
        this.appwindow.maximize();
    }
}
