import { formatUrl, isDomain, isUrl } from '../utils';
import * as path from 'path';
import { ipcMain } from 'electron';
import { Glide } from './glide';

export class UrlManager {
    public url: string;
    private glide: Glide;

    constructor(glide: Glide, url: string) {
        this.url = url;
        this.glide = glide;

        // ipc stuff
        ipcMain.on('searchbar-enter', (_event, value) => {
            this.openUrl(value);
            this.glide.windowManager.appwindow.
                removeBrowserView(this.glide.windowManager.glideView);
        });

        ipcMain.on('searchbar-escape', () => {
            this.glide.windowManager.appwindow.
                removeBrowserView(this.glide.windowManager.glideView);
        })
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
                return;
            }

            const formattedQuery: string = url.split(' ').join('+');
            let baseUrl;

            switch (this.glide.settingsManager.settings['search-engine']) {
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

        this.glide.windowManager.webpage.webContents.loadURL(this.url);
    }

    public openDefaultUrl() {
        this.openUrl(this.glide.settingsManager.settings['default-url']);
    }

    public openGlideUrl(url = this.url) {
        this.url = url;
        let filename;

        if (!this.url.startsWith('glide://'))
            filename = this.url;
        else
            filename =
                path.join('glide-pages', this.url.replace('glide://', '') + '.html');

        this.glide.windowManager.webpage.webContents.
            loadURL('file://' + path.join(__dirname, '..', filename));
    }

    public showUrlbar() {
        this.glide.windowManager.appwindow.
            addBrowserView(this.glide.windowManager.glideView);

        this.glide.windowManager.glideView.setBounds({
            x: 0,
            y: 0,
            width: this.glide.windowManager.webpage.getBounds().width,
            height: this.glide.windowManager.webpage.getBounds().height,
        });

        this.glide.windowManager.glideView.webContents.
            send('searchbar-open', { url: this.url });
        this.glide.windowManager.glideView.webContents.focus();
    }
}
