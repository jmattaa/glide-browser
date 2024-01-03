// liturally the same in glide-pages/js/main.js
// but with ipcRenderer instead of window.glideApi
window.ipcRenderer.send('request-theme');

window.ipcRenderer.on('request-theme-response', function(_event, data) {
    const themeVars = {
        '--glide-bg': data['theme.bg'],
        '--glide-fg': data['theme.fg'],
        '--glide-alt': data['theme.alt'],
    }

    Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
});
