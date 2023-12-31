import { webpageOpts } from '../globals';
import { Glide } from './glide';
import { tabActivity } from './tabs/tabActivity';
import { Tab, TabStack } from './tabs/tabStack';
import { BrowserView, ipcMain } from 'electron';
import * as path from 'path';

export class TabManager {
    public tabStack: TabStack;
    private glide: Glide;

    constructor(glide: Glide, currentTab: Tab) {
        this.tabStack = new TabStack(currentTab, glide);
        this.glide = glide;

        // ipc stuff
        ipcMain.on('open-tab', (_event, id) => {
            this.tabStack.switch(id);
            this.closeTabsView();
        });
    }

    public openTabsView() {
        const appwinBounds = this.glide.windowManager.appwindow.getBounds();
        this.glide.windowManager.tabChooserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
        });
        const tabsViewWidth = Math.floor(appwinBounds.width / 4);
        this.glide.windowManager.tabChooserView.setBounds({
            x: 0,
            y: 0,
            width: tabsViewWidth,
            height: appwinBounds.height,
        });

        this.glide.windowManager.tabChooserView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.glide.windowManager.webpage.setBounds({
            x: tabsViewWidth,
            y: 0,
            width: appwinBounds.width - tabsViewWidth,
            height: appwinBounds.height,
        });

        this.glide.windowManager.appwindow.
            addBrowserView(this.glide.windowManager.tabChooserView);

        this.glide.windowManager.tabChooserView?.webContents.
            loadFile(path.join(__dirname, '..', 'tabs.html'));

        this.glide.windowManager.tabChooserView?.webContents.on('did-finish-load', () => {
            this.glide.windowManager.tabChooserView?.webContents.send('get-tabs', {
                tabState: JSON.stringify(this.tabStack.state),
                tabActivityTime: tabActivity.removeTime,
            });
        });
    }

    public closeTabsView() {
        if (!this.glide.windowManager.tabChooserView) return;

        this.glide.windowManager.appwindow.
            removeBrowserView(this.glide.windowManager.tabChooserView);
        this.glide.windowManager.tabChooserView = null;

        const appwinBounds = this.glide.windowManager.appwindow.getBounds();
        this.glide.windowManager.webpage.setBounds({
            x: 0,
            y: 0,
            width: appwinBounds.width,
            height: appwinBounds.height,
        });
        this.glide.windowManager.webpage.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });
    }

    public toggleTabsView() {
        if (this.glide.windowManager.tabChooserView) {
            this.closeTabsView();
            return;
        }

        this.openTabsView();
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

    public nextTab() {
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

    public closeCurrentTab() {
        // don't close last tab
        if (this.tabStack.state.tabs.length === 1)
            return;
        if (!this.tabStack.state.currentTab.id)
            return;

        this.tabStack.close(this.tabStack.state.currentTab.id);
    }

    public addNewTab() {
        const newTabPage = new BrowserView(webpageOpts);
        this.tabStack.add({
            url: this.glide.settingsManager.settings['default-url'],
            title: 'New tab',
            webpage: newTabPage,
        });

        // open the tab
        this.glide.urlManager.openUrl();

        this.glide.urlManager.showUrlbar(); // open the url bar at new tab
    }

    public updateCurrentTab() {
        if (!this.tabStack.state.currentTab.id) return;

        this.tabStack.update(this.tabStack.state.currentTab.id, {
            url: this.glide.urlManager.url,
            title: this.glide.currentPageTitle,
            webpage: this.glide.windowManager.webpage,
        });

        if (this.glide.windowManager.tabChooserView)
            this.glide.windowManager.tabChooserView.webContents.send('get-tabs', {
                tabState: JSON.stringify(this.tabStack.state),
                tabActivity,
            });
    }
}
