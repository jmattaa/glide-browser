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
            // this gives us default shortcuts
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ],
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
