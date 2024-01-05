import { formatUrl, isDomain, isUrl } from '../utils';
import * as path from 'path';
import { ipcMain } from 'electron';
import { Quiver } from './quiver';

export class UrlManager {
    public url: string;
    private quiver: Quiver;

    constructor(quiver: Quiver, url: string) {
        this.url = url;
        this.quiver = quiver;

        // ipc stuff
        ipcMain.on('searchbar-enter', (_event, value) => {
            this.openUrl(value);
            this.quiver.windowManager.appwindow.
                removeBrowserView(this.quiver.windowManager.quiverView);
        });

        ipcMain.on('searchbar-escape', () => {
            this.quiver.windowManager.appwindow.
                removeBrowserView(this.quiver.windowManager.quiverView);
        })
    }

    public openUrl(url = this.url) {
        if (url.startsWith('quiver://')) {
            this.url = url;
            this.openQuiverUrl();
            return;
        } else if (isDomain(url) || isUrl(url)) {
            this.url = formatUrl(url);
        } else {
            // searching using searchengine
            if (this.url === '') {
                this.openDefaultUrl();
                return;
            }

            const formattedQuery: string = url.split(' ').join('+');
            let baseUrl;

            switch (this.quiver.settingsManager.settings['search-engine']) {
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

        this.quiver.windowManager.webpage.webContents.loadURL(this.url);
    }

    public openDefaultUrl() {
        this.openUrl(this.quiver.settingsManager.settings['default-url']);
    }

    public openQuiverUrl(url = this.url) {
        this.url = url;
        let filename;

        if (!this.url.startsWith('quiver://'))
            filename = this.url;
        else
            filename =
                path.join('quiver-pages', this.url.replace('quiver://', '') + '.html');

        this.quiver.windowManager.webpage.webContents.
            loadURL('file://' + path.join(__dirname, '..', filename));
    }

    public showUrlbar() {
        this.quiver.windowManager.appwindow.
            addBrowserView(this.quiver.windowManager.quiverView);

        this.quiver.windowManager.quiverView.setBounds({
            x: 0,
            y: 0,
            width: this.quiver.windowManager.webpage.getBounds().width,
            height: this.quiver.windowManager.webpage.getBounds().height,
        });

        this.quiver.windowManager.quiverView.webContents.
            send('searchbar-open', { url: this.url });
        this.quiver.windowManager.quiverView.webContents.focus();
    }
}
