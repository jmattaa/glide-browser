import { BrowserWindow, BrowserView, Menu, ipcMain } from 'electron';
import * as path from 'path';
import { getMenubar } from '../menubar';
import { webpageOpts } from '../globals';
import { Quiver } from './quiver';

export class WindowManager {
    public appwindow: BrowserWindow;
    public quiverView: BrowserView;
    public webpage: BrowserView;
    public tabChooserView: BrowserView | null = null;

    private quiver: Quiver;

    constructor(quiver: Quiver, settings: any) {
        this.quiver = quiver;
        this.appwindow = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: settings['auto-hide-menu'],
            titleBarStyle: settings['titlebar-hidden'] ?
                'customButtonsOnHover' : 'default',
        });

        const menubar = getMenubar(this.quiver);
        Menu.setApplicationMenu(menubar);

        const appwinBounds = this.appwindow.getBounds();

        this.quiverView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        this.quiverView.setBounds({
            x: 0,
            y: 0,
            width: appwinBounds.width,
            height: appwinBounds.height,
        });

        this.quiverView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.quiverView.webContents.loadFile(path.join(__dirname, '..', 'index.html'));

        this.webpage = new BrowserView(webpageOpts);

        ipcMain.on('reload-err-page', (_e, { url }) => {
            this.quiver.urlManager.openUrl(url);
        });
    }

    public goBack() {
        this.webpage.webContents.goBack();
        this.quiver.urlManager.url = this.webpage.webContents.getURL();
    }

    public goForward() {
        this.webpage.webContents.goForward();
        this.quiver.urlManager.url = this.webpage.webContents.getURL();
    }

    public fitScreen() {
        this.appwindow.maximize();
    }
}
