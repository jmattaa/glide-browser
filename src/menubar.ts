import { Menu, MenuItem, MenuItemConstructorOptions, app } from "electron"
import { Quiver } from "./quiver/quiver"
import { CmdOrCtrl, isMac } from "./utils"

export function getMenubar(quiver: Quiver): Menu {
    const menuTempalate: (MenuItemConstructorOptions | MenuItem)[] = [
        {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                {
                    label: 'Fit screen',
                    accelerator: CmdOrCtrl('Shift+F'),
                    click: () => { quiver.windowManager.fitScreen() },
                },
                {
                    label: 'Open Settings',
                    accelerator: CmdOrCtrl(','),
                    click: () => {
                        quiver.urlManager.openQuiverUrl('quiver://settings');
                    }
                },
                { type: 'separator' },
                // mocos stuff
                ...(isMac ? [
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ] : [])
            ] as MenuItemConstructorOptions[]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                {
                    label: 'Toggle Dev Tools',
                    accelerator:
                        isMac ? 'Cmd+Option+I' : 'Control+Shift+I',
                    click: () => {
                        quiver.windowManager.webpage.webContents.toggleDevTools();
                    }
                },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ],
        },
        {
            label: 'Tabs',
            submenu: [
                {
                    label: 'Show Url',
                    accelerator: CmdOrCtrl('L'),
                    click: () => { quiver.urlManager.showUrlbar() }
                },
                { type: 'separator' },
                {
                    label: 'New Tab',
                    accelerator: CmdOrCtrl('T'),
                    click: () => { quiver.tabManager.addNewTab() }
                },
                {
                    label: 'Close Current Tab',
                    accelerator: CmdOrCtrl('W'),
                    click: () => { quiver.tabManager.closeCurrentTab() }
                },
                {
                    label: 'Next Tab',
                    accelerator: 'Ctrl+Tab',
                    click: () => { quiver.tabManager.nextTab() }
                },
                {
                    label: 'Previous Tab',
                    accelerator: 'Ctrl+Shift+Tab',
                    click: () => { quiver.tabManager.prevTab() }
                },
                {
                    label: 'Show All Tabs',
                    accelerator: CmdOrCtrl('Shift+L'),
                    click: () => { quiver.tabManager.toggleTabsView() }
                }
            ]
        },
        {
            label: 'Archive',
            submenu: [
                {
                    label: 'Show Url',
                    accelerator: CmdOrCtrl('L'),
                    click: () => { quiver.urlManager.showUrlbar() }
                },
                { type: 'separator' },
                {
                    label: 'Go Back',
                    accelerator: CmdOrCtrl('['),
                    click: () => { quiver.windowManager.goBack() },
                },
                {
                    label: 'Go Forward',
                    accelerator: CmdOrCtrl(']'),
                    click: () => { quiver.windowManager.goForward() },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTempalate);
    return menu
}
