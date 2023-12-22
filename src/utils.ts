export function formatUrl(input: string): string {
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

export function CmdOrCtrl(key: string) {
    return process.platform === 'darwin' ?  `Cmd+${key}` : `Ctrl+${key}`;
}

