"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdOrCtrl = exports.isMac = exports.isDomain = exports.isUrl = exports.formatUrl = void 0;
const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)*$/;
function formatUrl(input) {
    if (domainRegex.test(input)) {
        if (!/^https?:\/\//i.test(input)) {
            input = "https://" + input;
        }
        if (!/^https?:\/\/www\./i.test(input)) {
            input = input.replace(/^(https?:\/\/)?/, "$1www.");
        }
        // `/` at end
        if (!/\/$/.test(input)) {
            input += '/';
        }
    }
    return input;
}
exports.formatUrl = formatUrl;
function isUrl(input) {
    try {
        new URL(input);
        return true;
    }
    catch (_err) {
        return false;
    }
}
exports.isUrl = isUrl;
function isDomain(input) {
    return domainRegex.test(input);
}
exports.isDomain = isDomain;
exports.isMac = process.platform === 'darwin';
function CmdOrCtrl(key) {
    return exports.isMac ? `Cmd+${key}` : `Ctrl+${key}`;
}
exports.CmdOrCtrl = CmdOrCtrl;
