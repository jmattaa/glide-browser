// liturally the same in quiver-pages/js/main.js
// but with ipcRenderer instead of window.quiverApi
window.ipcRenderer.send('request-theme');

window.ipcRenderer.on('request-theme-response', function(_event, data) {
    const themeVars = {
        '--quiver-bg': data['theme.bg'],
        '--quiver-fg': data['theme.fg'],
        '--quiver-alt': data['theme.alt'],
    }

    Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
});
