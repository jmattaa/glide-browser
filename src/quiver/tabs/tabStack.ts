import { BrowserView } from "electron";
import { Quiver } from "../quiver";
import { tabActivity } from "./tabActivity";
import * as path from 'path';

export interface Tab {
    url: string,
    title: string,
    webpage: BrowserView
    id?: number,
    lastActivity?: number,
};

export class TabStack {
    private quiver: Quiver;

    public state: {
        tabs: Tab[],
        currentTab: Tab
    };

    constructor(tab: Tab, quiver: Quiver) {
        this.quiver = quiver;
        this.state = {
            tabs: [],
            currentTab: tab,
        }

        // initialize tab activity monitor
        tabActivity.monitor(this);
    }

    public add(tab: Tab) {
        tab.id = Date.now() + Math.random();
        tab.lastActivity = Date.now();
        this.state.tabs.push(tab);
        this.switch(tab.id);

        this.quiver.windowManager.webpage.webContents.on('did-navigate', (_event, url) => {
            if (url.startsWith('file://' + path.join(
                __dirname,
                '..',
                '..',
                'quiver-pages'
            )))
                return;

            this.quiver.urlManager.url = url;
            this.state.currentTab.url = url;
        });

        this.quiver.windowManager.webpage.webContents.on('did-finish-load', () => {
            if (
                this.quiver.urlManager.url.
                    startsWith(
                        'file://' + path.join(
                            __dirname,
                            '..',
                            '..',
                            'quiver-pages'
                        )
                    )
            ) return;

            this.quiver.currentPageTitle =
                this.quiver.windowManager.webpage.webContents.getTitle();
            this.quiver.tabManager.updateCurrentTab();
        });

        this.quiver.windowManager.webpage.webContents.on('did-fail-load', (
            e,
            _errorCode,
            errorDesc,
            validatedUrl
        ) => {
            e.preventDefault();
            const urlToOpen =
                path.join(
                    'quiver-pages',
                    'error',
                    'index.html'
                ) +
                '?ed=' + errorDesc +
                '&url=' + validatedUrl;

            this.quiver.urlManager.openQuiverUrl(urlToOpen);
            this.quiver.urlManager.url = validatedUrl;
        });
    }

    public close(tabId: number) {
        const tabIdx = this.getIdx(tabId);
        if (tabIdx === -1)
            return;

        this.state.tabs.splice(tabIdx, 1);

        this.switch(
            this.state.tabs[
                tabIdx - 1 > 0 ? tabIdx - 1 : 0
            ].id || -1
        );
    }

    public update(tabId: number, newData: Tab) {
        const tabIdx = this.getIdx(tabId);
        if (tabIdx === -1)
            throw new ReferenceError(`Tab with id: ${tabId} dosen't exist`);

        this.state.tabs[tabIdx].url = newData.url;
        this.state.tabs[tabIdx].title = newData.title;
    }

    public getIdx(tabId: number): number {
        for (var i = 0; i < this.state.tabs.length; i++) {
            if (this.state.tabs[i].id == tabId) {
                return i
            }
        }
        return -1;
    }

    public switch(tabId: number) {
        const tabIdx = this.getIdx(tabId);
        if (tabIdx === -1)
            throw new ReferenceError(`Tab with id: ${tabId} can't be selected`);

        // remove old browserView
        this.quiver.windowManager.appwindow.removeBrowserView(this.state.currentTab.webpage);

        this.quiver.tabManager.closeTabsView();

        // last active is now before we switch
        this.state.currentTab.lastActivity = Date.now();

        this.state.currentTab = this.state.tabs[tabIdx];

        this.quiver.windowManager.webpage = this.state.currentTab.webpage;
        this.quiver.urlManager.url = this.state.currentTab.url;

        const appwinBounds = this.quiver.windowManager.appwindow.getBounds();
        this.state.currentTab.webpage.setBounds({
            x: 0,
            y: 0,
            width: appwinBounds.width,
            height: appwinBounds.height,
        });
        this.state.currentTab.webpage.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true
        });

        // add the new one
        this.quiver.windowManager.appwindow.
            addBrowserView(this.quiver.windowManager.webpage);
    }

    // this is like close but we silently close without switching tabs
    public remove(tabId: number) {
        const tabIdx = this.getIdx(tabId);
        if (tabIdx === -1)
            return;

        this.state.tabs.splice(tabIdx, 1);
    }

    public openBgTab(tab: Tab) {
        // store the current tab cuz dis is what we want
        const currentTab = this.state.currentTab.id;
        if (!currentTab)
            return;

        this.add(tab);

        this.switch(currentTab);
    }
}
