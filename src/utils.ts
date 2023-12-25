const domainRegex =
    /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)*$/;

export function formatUrl(input: string): string {
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

export function isUrl(input: string) {
    try {
        new URL(input);
        return true;
    } catch (_err) {
        return false;
    }
}

export function isDomain(input: string) {
    return domainRegex.test(input);
}

export const isMac = process.platform === 'darwin';

export function CmdOrCtrl(key: string) {
    return isMac ? `Cmd+${key}` : `Ctrl+${key}`;
}

export function MacCtrlOrAlt(key: string) {
    return isMac ? `Ctrl+${key}` : `Alt+${key}`;
}
