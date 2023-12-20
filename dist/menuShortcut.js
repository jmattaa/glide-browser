"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuShortcuts = void 0;
const electron_1 = require("electron");
function getMenuShortcuts(glide) {
    const menu = new electron_1.Menu();
    menu.append(new electron_1.MenuItem({
        label: 'Archive',
        submenu: [
            {
                label: 'Show Url',
                accelerator: process.platform === 'darwin' ? 'Cmd+L' : 'Ctrl+L',
                click: () => { glide.showUrlbar(); }
            },
            {
                label: 'Go back',
                accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Ctrl+[',
                click: () => { glide.goBack(); },
            },
            {
                label: 'Go forward',
                accelerator: process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
                click: () => { glide.goForward(); },
            },
        ],
    }));
    return menu;
}
exports.getMenuShortcuts = getMenuShortcuts;
