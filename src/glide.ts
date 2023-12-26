import { BrowserWindow, BrowserView, ipcMain, Menu, HandlerDetails } from 'electron';
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
    public currentPageTitle: string = '';

    private tabChooserView: BrowserView | null = null;

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
                'settings.theme.alt': this.settings['theme.alt'],
            }
        );

        this.webpage = new BrowserView(webpageOpts);
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


        ipcMain.on('open-tab', (_event, id) => {
            this.tabStack.switch(id);

            this.closeTabsView();
        });

        ipcMain.on('close-tabs-win', () => {
            this.closeTabsView();
        })

        // dont open extra windows for links
        // one window is already too much for me to handle :>
        this.webpage.webContents.setWindowOpenHandler((details: HandlerDetails) => {
            const tab: Tab = {
                url: details.url,
                title: '',
                webpage: this.webpage,
            };

            // open bg tab and dont switch to it
            if (details.disposition === 'background-tab') {
                this.tabStack.openBgTab(tab);
            }
            // open fg tab so we switch to it
            else if (
                details.disposition === 'foreground-tab' ||
                details.disposition === 'new-window'
            ) {
                this.tabStack.add(tab);
            }

            return { action: 'deny' }
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
    }

    public addNewTab() {
        const newTabPage = new BrowserView(webpageOpts);
        this.tabStack.add({
            url: this.settings['default-url'],
            title: 'New tab',
            webpage: newTabPage,
        });

        // open the tab
        this.openUrl();

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

    public toggleTabsView() {
        if (this.tabChooserView) {
            this.closeTabsView();
            return;
        }

        this.openTabsView();
    }

    public updateCurrentTab() {
        if (!this.tabStack.state.currentTab.id) return;

        this.tabStack.update(this.tabStack.state.currentTab.id, {
            url: this.url,
            title: this.currentPageTitle,
            webpage: this.webpage,
        });

        if (this.tabChooserView)
            this.tabChooserView.webContents.send('get-tabs', {
                tabState: JSON.stringify(this.tabStack.state)
            });
    }

    public openTabsView() {
        const appwinBounds = this.appwindow.getBounds();
        this.tabChooserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
        });
        const tabsViewWidth = Math.floor(appwinBounds.width / 4);
        this.tabChooserView.setBounds({
            x: 0,
            y: 0,
            width: tabsViewWidth,
            height: appwinBounds.height,
        });

        this.tabChooserView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.webpage.setBounds({
            x: tabsViewWidth,
            y: 0,
            width: appwinBounds.width - tabsViewWidth,
            height: appwinBounds.height,
        });

        this.appwindow.addBrowserView(this.tabChooserView);

        this.tabChooserView.webContents.loadFile(path.join(__dirname, 'tabs.html'));

        this.tabChooserView.webContents.on('did-finish-load', () => {
            this.tabChooserView?.webContents.send(
                'get-tabs',
                { tabState: JSON.stringify(this.tabStack.state) },
            );
        });
    }

    public closeTabsView() {
        if (!this.tabChooserView) return;

        this.appwindow.removeBrowserView(this.tabChooserView);
        this.tabChooserView = null;

        const appwinBounds = this.appwindow.getBounds();
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
    }
}
