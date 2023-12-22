"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuShortcuts = void 0;
const electron_1 = require("electron");
const utils_1 = require("./utils");
function getMenuShortcuts(glide) {
    const menu = new electron_1.Menu();
    // this gives us default shortcuts
    menu.append(new electron_1.MenuItem({
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
    menu.append(new electron_1.MenuItem({
        label: 'Archive',
        submenu: [
            {
                label: 'Show Url',
                accelerator: (0, utils_1.CmdOrCtrl)('L'),
                click: () => { glide.showUrlbar(); }
            },
            { type: 'separator' },
            {
                label: 'Go Back',
                accelerator: (0, utils_1.CmdOrCtrl)('['),
                click: () => { glide.goBack(); },
            },
            {
                label: 'Go Forward',
                accelerator: (0, utils_1.CmdOrCtrl)(']'),
                click: () => { glide.goForward(); },
            },
        ],
    }));
    menu.append(new electron_1.MenuItem({
        label: 'Settings',
        submenu: [
            {
                label: 'Open Settings',
                accelerator: (0, utils_1.CmdOrCtrl)(','),
                click: () => {
                    glide.openGlideUrl('glide://settings');
                }
            }
        ]
    }));
    return menu;
}
exports.getMenuShortcuts = getMenuShortcuts;
