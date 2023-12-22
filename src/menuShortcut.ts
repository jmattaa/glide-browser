import { Menu, MenuItem } from "electron"
import { Glide } from "./glide"
import { CmdOrCtrl } from "./utils"

export function getMenuShortcuts(glide: Glide) {
    const menu = new Menu()

    // this gives us default shortcuts
    menu.append(new MenuItem({
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
    }));

    menu.append(new MenuItem({
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
    }))

    menu.append(new MenuItem({
        label: 'Settings',
        submenu: [
            {
                label: 'Open Settings',
                accelerator: CmdOrCtrl(','),
                click: () => {
                    glide.openGlideUrl('glide://settings');
                }
            }
        ]
    }))

    return menu
}
