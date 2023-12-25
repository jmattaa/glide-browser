import { BrowserWindow, BrowserView, ipcMain, Menu } from 'electron';
import fs from 'fs';
import * as path from 'path';
import { formatUrl, isDomain, isUrl } from './utils';
import { getMenubar } from './menubar';
import { genFromTemplateFile } from './templateGen';
import { settingsPath, webpageOpts } from './globals';
import { Tab, TabStack } from './tabStack';

export class Glide {
    public url: string;
    public appwindow: BrowserWindow; // the appwindow duh
    public webpage: BrowserView; // the current webpage
    public glideView: BrowserView; // containing our index.html defined in dist
    public tabStack: TabStack;
    public settings: any;

    constructor(settings: any) {
        this.settings = settings;
        this.url = this.settings['default-url'];

        this.appwindow = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: this.settings['auto-hide-menu'],
            titleBarStyle:
                this.settings['titlebar-hidden'] ? 'customButtonsOnHover' : 'default',
        });

        const menubar = getMenubar(this);
        Menu.setApplicationMenu(menubar);

        const appwinBounds = this.appwindow.getBounds();

        this.webpage = new BrowserView(webpageOpts);

        this.webpage.setBounds({
            x: 0,
            y: 0,
            width: appwinBounds.width,
            height: appwinBounds.height,
        });

        this.webpage.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.appwindow.setBrowserView(this.webpage);

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

        this.glideView.webContents.loadFile(path.join(__dirname, 'index.html'));

        this.webpage.webContents.on('did-navigate', (_event, url) => {
            if (url.startsWith('file://' + path.join(__dirname, 'glide-pages')))
                return;

            this.url = url
        });

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

        // tabs
        const currentTab: Tab = {
            url: this.url,
            title: 'New Tab',
            webpage: this.webpage,
        };
        this.tabStack = new TabStack(currentTab, this);

        // loading indicator
        const loadingIndicator = new BrowserView();

        loadingIndicator.webContents.loadFile(path.join(__dirname, 'loading.html'));

        this.appwindow.webContents.on('did-start-loading', () => {
            const boundsWin = this.appwindow.getBounds();
            loadingIndicator.setBounds({
                x: (boundsWin.width / 2) - Math.min(boundsWin.width / 2 - 60, 60),
                y: 0,
                width: Math.min(boundsWin.width / 2 - 60, 60),
                height: 4
            });

            this.appwindow.addBrowserView(loadingIndicator);
        });

        this.appwindow.webContents.on('did-stop-loading', () => {
            // wait before we close
            setTimeout(() => {
                this.appwindow.removeBrowserView(loadingIndicator);
            }, 1000);
        });

        this.appwindow.webContents.on('will-navigate', () => {
            setTimeout(() => {
                this.appwindow.removeBrowserView(loadingIndicator);
            }, 1000);
        });

        this.appwindow.webContents.on('did-fail-load', () => {
            setTimeout(() => {
                this.appwindow.removeBrowserView(loadingIndicator);
            }, 1000);
        });


        // ipc stuff
        ipcMain.on('searchbar-enter', (_event, value) => {
            this.openUrl(value);
            this.appwindow.removeBrowserView(this.glideView);
        });

        ipcMain.on('searchbar-escape', () => {
            this.appwindow.removeBrowserView(this.glideView);
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

        this.webpage.webContents.loadURL(this.url);

        this.webpage.webContents.once('did-finish-load', () => {
            const currentTabId = this.tabStack.state.currentTab.id;
            if (!currentTabId) return; // shouldn't happen

            this.tabStack.update(currentTabId, {
                url: this.url,
                title: this.webpage.webContents.getTitle(),
                webpage: new BrowserView(webpageOpts),
            });
        });
    }

    public openDefaultUrl() {
        this.openUrl(this.settings['default-url']);
    }

    public showUrlbar() {
        this.appwindow.addBrowserView(this.glideView);

        this.glideView.setBounds({
            x: 0,
            y: 0,
            width: this.webpage.getBounds().width,
            height: this.webpage.getBounds().height,
        });

        this.glideView.webContents.send('searchbar-open', { url: this.url });
        this.glideView.webContents.focus();
    }

    public goBack() {
        this.webpage.webContents.goBack();
        this.url = this.webpage.webContents.getURL();
    }

    public goForward() {
        this.webpage.webContents.goForward();
        this.url = this.webpage.webContents.getURL();
    }

    public fitScreen() {
        this.appwindow.maximize();
    }

    public openGlideUrl(url = this.url) {
        this.url = url;
        if (!this.url.startsWith('glide://')) {
            this.openDefaultUrl();
            return;
        }

        const filename = path.join('glide-pages', this.url.replace('glide://', '') + '.html');
        this.webpage.webContents.loadFile(path.join(__dirname, filename));

        this.webpage.webContents.once('did-finish-load', () => {
            const currentTabId = this.tabStack.state.currentTab.id;
            if (!currentTabId) return; // shouldn't happen

            this.tabStack.update(currentTabId, {
                url: this.url,
                title: this.webpage.webContents.getTitle(), // no need to change
                webpage: this.webpage // no need to change 
            });
        });
    }

    public addNewTab() {
        this.tabStack.add({
            url: this.settings['default-url'],
            title: 'New tab',
            webpage: new BrowserView(webpageOpts),
        });

        this.showUrlbar(); // open the url bar at new tab
    }

    public closeCurrentTab() {
        // don't close last tab
        if (this.tabStack.state.tabs.length === 1)
            return;
        if (!this.tabStack.state.currentTab.id)
            return;

        this.tabStack.close(this.tabStack.state.currentTab.id);
    }

    public prevTab() {
        const currentTabId = this.tabStack.state.currentTab.id;
        if (!currentTabId) return;

        const currentTabIdx = this.tabStack.getIdx(currentTabId);

        // wrap around if end 
        const newTabIdx =
            (currentTabIdx + 1) % this.tabStack.state.tabs.length;
        const newTabId =
            this.tabStack.state.tabs[newTabIdx].id || -1; // -1 shouldn't exist

        this.tabStack.switch(newTabId);
    }

    public NextTab() {
        const currentTabId = this.tabStack.state.currentTab.id;
        if (!currentTabId) return;

        const currentTabIdx = this.tabStack.getIdx(currentTabId);

        // wrap around if end 
        const newTabIdx =
            (currentTabIdx - 1 + this.tabStack.state.tabs.length) %
            this.tabStack.state.tabs.length;

        const newTabId =
            this.tabStack.state.tabs[newTabIdx].id || -1; // -1 shouldn't exist

        this.tabStack.switch(newTabId);
    }
}
