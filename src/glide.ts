import { BrowserWindow, BrowserView, ipcMain } from 'electron';
import fs from 'fs';
import * as path from 'path';
import { formatUrl, isDomain, isUrl } from './utils';
import { getMenubar } from './menubar';
import { genFromTemplateFile } from './templateGen';
import { settingsPath } from './globals';

export class Glide {
    public url: string;
    public webpage: BrowserWindow; // containing the open website of user
    public glideView: BrowserView; // containing our index.html defined in dist
    public settings: any;

    constructor(settings: any) {
        this.settings = settings;
        this.url = this.settings['default-url'];

        this.webpage = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            autoHideMenuBar: this.settings['auto-hide-menu'],
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

        this.glideView.webContents.loadFile(path.join(__dirname, 'index.html'));

        this.webpage.setMenu(getMenubar(this));

        // settings change
        ipcMain.on('change-settings', (_event, { setting, value }) => {
            this.settings[setting] = value;

            // write settings
            let settingsJSON = JSON.stringify(this.settings);
            fs.writeFileSync(settingsPath, settingsJSON);
        });

        // gen files
        genFromTemplateFile(
            path.join(__dirname, 'templates', 'css', 'style.css.template'),
            path.join(__dirname, 'glide-pages', 'css', 'style.css'),
            {
                'settings.theme.bg': this.settings['theme.bg'],
                'settings.theme.fg': this.settings['theme.fg'],
            }
        );
    }

    public openUrl(url = this.url) {
        if (url.startsWith('glide://')) {
            this.url = url;
            this.openGlideUrl();
            return;
        } else if (isDomain(url) || isUrl(url)) {
            this.url = formatUrl(url);
        } else {
            // searching using searchengine
            if (this.url === '') {
                this.openDefaultUrl();
                return
            }

            const formattedQuery: string = url.split(' ').join('+');
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

    public openDefaultUrl() {
        this.openUrl(this.settings['default-url']);
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

        const filename = path.join('glide-pages', this.url.replace('glide://', '') + '.html');
        this.webpage.loadFile(path.join(__dirname, filename));
    }
}
