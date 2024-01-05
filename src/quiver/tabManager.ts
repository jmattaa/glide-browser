import { webpageOpts } from '../globals';
import { Quiver } from './quiver';
import { tabActivity } from './tabs/tabActivity';
import { Tab, TabStack } from './tabs/tabStack';
import { BrowserView, ipcMain } from 'electron';
import * as path from 'path';

export class TabManager {
    public tabStack: TabStack;
    private quiver: Quiver;

    constructor(quiver: Quiver, currentTab: Tab) {
        this.tabStack = new TabStack(currentTab, quiver);
        this.quiver = quiver;

        // ipc stuff
        ipcMain.on('open-tab', (_event, id) => {
            this.tabStack.switch(id);
            this.closeTabsView();
        });
    }

    public openTabsView() {
        const appwinBounds = this.quiver.windowManager.appwindow.getBounds();
        this.quiver.windowManager.tabChooserView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
        });
        const tabsViewWidth = Math.floor(appwinBounds.width / 4);
        this.quiver.windowManager.tabChooserView.setBounds({
            x: 0,
            y: 0,
            width: tabsViewWidth,
            height: appwinBounds.height,
        });

        this.quiver.windowManager.tabChooserView.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        this.quiver.windowManager.webpage.setBounds({
            x: tabsViewWidth,
            y: 0,
            width: appwinBounds.width - tabsViewWidth,
            height: appwinBounds.height,
        });

        this.quiver.windowManager.appwindow.
            addBrowserView(this.quiver.windowManager.tabChooserView);

        this.quiver.windowManager.tabChooserView?.webContents.
            loadFile(path.join(__dirname, '..', 'tabs.html'));

        this.quiver.windowManager.tabChooserView?.webContents.on('did-finish-load', () => {
            this.quiver.windowManager.tabChooserView?.webContents.send('get-tabs', {
                tabState: JSON.stringify(this.tabStack.state),
                tabActivityTime: tabActivity.removeTime,
            });
        });
    }

    public closeTabsView() {
        if (!this.quiver.windowManager.tabChooserView) return;

        this.quiver.windowManager.appwindow.
            removeBrowserView(this.quiver.windowManager.tabChooserView);
        this.quiver.windowManager.tabChooserView = null;

        const appwinBounds = this.quiver.windowManager.appwindow.getBounds();
        this.quiver.windowManager.webpage.setBounds({
            x: 0,
            y: 0,
            width: appwinBounds.width,
            height: appwinBounds.height,
        });
        this.quiver.windowManager.webpage.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });
    }

    public toggleTabsView() {
        if (this.quiver.windowManager.tabChooserView) {
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
            url: this.quiver.settingsManager.settings['default-url'],
            title: 'New tab',
            webpage: newTabPage,
        });

        // open the tab
        this.quiver.urlManager.openUrl();

        this.quiver.urlManager.showUrlbar(); // open the url bar at new tab
    }

    public updateCurrentTab() {
        if (!this.tabStack.state.currentTab.id) return;

        this.tabStack.update(this.tabStack.state.currentTab.id, {
            url: this.quiver.urlManager.url,
            title: this.quiver.currentPageTitle,
            webpage: this.quiver.windowManager.webpage,
        });

        if (this.quiver.windowManager.tabChooserView)
            this.quiver.windowManager.tabChooserView.webContents.send('get-tabs', {
                tabState: JSON.stringify(this.tabStack.state),
                tabActivity,
            });
    }
}
