import { SettingsManager } from './settingsManager';
import { TabManager } from './tabManager';
import { WindowManager } from './windowManager';
import { UrlManager } from './urlManager';
import { Tab } from './tabs/tabStack';
import * as path from 'path';
import { genFromTemplateFile } from '../templateGen';
import { ipcMain } from 'electron';

export class Quiver {
    public settingsManager: SettingsManager;
    public tabManager: TabManager;
    public windowManager: WindowManager;
    public urlManager: UrlManager;
    public currentPageTitle: string = "";

    constructor(settings: any) {
        this.settingsManager = new SettingsManager(settings);
        this.windowManager = new WindowManager(this, settings);

        this.urlManager =
            new UrlManager(this, this.settingsManager.settings['default-url']);

        const currentTab: Tab = {
            url: this.settingsManager.settings['default-url'],
            title: 'New Tab',
            webpage: this.windowManager.webpage,
        };
        this.tabManager = new TabManager(this, currentTab);
        this.tabManager.tabStack.add(currentTab);

        ipcMain.on('request-theme', (event) => {
            event.reply('request-theme-response',
                {
                    'theme.bg': this.settingsManager.settings['theme.bg'],
                    'theme.fg': this.settingsManager.settings['theme.fg'],
                    'theme.alt': this.settingsManager.settings['theme.alt'],
                }
            );
        });
    }
}
