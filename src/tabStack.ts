import { BrowserView } from "electron";
import { Glide } from "./glide";
import { tabActivity } from "./tabActivity";

export interface Tab {
    url: string,
    title: string,
    webpage: BrowserView
    id?: number,
    lastActivity?: number,
};

export class TabStack {
    private glide: Glide;

    public state: {
        tabs: Tab[],
        currentTab: Tab
    };

    constructor(tab: Tab, glide: Glide) {
        this.glide = glide;
        this.state = {
            tabs: [],
            currentTab: tab,
        }
        this.add(tab);

        // initialize tab activity monitor
        tabActivity.monitor(this);
    }

    public add(tab: Tab) {
        tab.id = Date.now() + Math.random();
        tab.lastActivity = Date.now();

        this.state.tabs.push(tab);

        this.switch(tab.id);
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

        if (tabId === this.state.currentTab.id)
            return;

        // remove old browserView
        this.glide.appwindow.removeBrowserView(this.state.currentTab.webpage);

        this.state.currentTab = this.state.tabs[tabIdx];
        // last active is now
        this.state.currentTab.lastActivity = Date.now();

        this.glide.webpage = this.state.currentTab.webpage;
        this.glide.url = this.state.currentTab.url;
        // open the url 
        this.glide.openUrl();

        const appwinBounds = this.glide.appwindow.getBounds();
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
        this.glide.appwindow.addBrowserView(this.state.currentTab.webpage);
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
