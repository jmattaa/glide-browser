import { Menu, MenuItem } from "electron"
import { Glide } from "./glide"

export function getMenuShortcuts(glide: Glide) {
    const menu = new Menu()
    menu.append(new MenuItem({
        label: 'Archive',
        submenu: [
            {
                label: 'Show Url',
                accelerator: process.platform === 'darwin' ? 'Cmd+L' : 'Ctrl+L',
                click: () => { glide.showUrlbar() }
            },
            {
                label: 'Go back',
                accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Ctrl+[',
                click: () => { glide.goBack() },
            },
            {
                label: 'Go forward',
                accelerator: process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
                click: () => { glide.goForward() },
            },
        ],
    }))

    return menu
}
