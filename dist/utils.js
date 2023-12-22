"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdOrCtrl = exports.formatUrl = void 0;
function formatUrl(input) {
    const domainRegex = /\.(.*)$/i;
    if (domainRegex.test(input)) {
        if (!/^https?:\/\//i.test(input)) {
            input = "https://" + input;
        }
        if (!/^https?:\/\/www\./i.test(input)) {
            input = input.replace(/^(https?:\/\/)?/, "$1www.");
        }
    }
    // `/` at end
    if (!/\/$/.test(input)) {
        input += '/';
    }
    return input;
}
exports.formatUrl = formatUrl;
function CmdOrCtrl(key) {
    return process.platform === 'darwin' ? `Cmd+${key}` : `Ctrl+${key}`;
}
exports.CmdOrCtrl = CmdOrCtrl;
