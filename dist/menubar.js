"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenubar = void 0;
const electron_1 = require("electron");
const utils_1 = require("./utils");
function getMenubar(glide) {
    const menuTempalate = [
        {
            label: electron_1.app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                {
                    label: 'Fit screen',
                    accelerator: (0, utils_1.CmdOrCtrl)('Shift+F'),
                    click: () => { glide.fitScreen(); },
                },
                {
                    label: 'Open Settings',
                    accelerator: (0, utils_1.CmdOrCtrl)(','),
                    click: () => {
                        glide.openGlideUrl('glide://settings');
                    }
                },
                { type: 'separator' },
                // mocos stuff
                ...(utils_1.isMac ? [
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ] : [])
            ]
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
        },
    ];
    const menu = electron_1.Menu.buildFromTemplate(menuTempalate);
    return menu;
}
exports.getMenubar = getMenubar;
