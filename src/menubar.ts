import { Menu, MenuItem, MenuItemConstructorOptions, app } from "electron"
import { Glide } from "./glide"
import { CmdOrCtrl, isMac } from "./utils"


export function getMenubar(glide: Glide): Menu {
    const menuTempalate: (MenuItemConstructorOptions | MenuItem)[] = [
        {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                {
                    label: 'Fit screen',
                    accelerator: CmdOrCtrl('Shift+F'),
                    click: () => { glide.fitScreen() },
                },
                {
                    label: 'Open Settings',
                    accelerator: CmdOrCtrl(','),
                    click: () => {
                        glide.openGlideUrl('glide://settings');
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
                        isMac ? 'Cmd+Option+I' : 'Alt+Shift+I',
                    click: () => {
                        glide.webpage.webContents.openDevTools({
                            mode: 'undocked'
                        });
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
                    click: () => { glide.showUrlbar() }
                },
                { type: 'separator' },
                {
                    label: 'New Tab',
                    accelerator: CmdOrCtrl('T'),
                    click: () => { glide.addNewTab() }
                },
                {
                    label: 'Close Current Tab',
                    accelerator: CmdOrCtrl('W'),
                    click: () => { glide.closeCurrentTab() }
                },
                {
                    label: 'Next Tab',
                    accelerator: 'Ctrl+Tab',
                    click: () => { glide.NextTab() }
                },
                {
                    label: 'Previous Tab',
                    accelerator: 'Ctrl+Shift+Tab',
                    click: () => { glide.prevTab() }
                },
                {
                    label: 'Show All Tabs',
                    accelerator: CmdOrCtrl('Shift+L'),
                    click: () => { glide.openTabsWindow() }
                }
            ]
        },
        {
            label: 'Archive',
            submenu: [
                {
                    label: 'Show Url',
                    accelerator: CmdOrCtrl('L'),
                    click: () => { glide.showUrlbar() }
                },
                { type: 'separator' },
                {
                    label: 'Go Back',
                    accelerator: CmdOrCtrl('['),
                    click: () => { glide.goBack() },
                },
                {
                    label: 'Go Forward',
                    accelerator: CmdOrCtrl(']'),
                    click: () => { glide.goForward() },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTempalate);
    return menu
}
