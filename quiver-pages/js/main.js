window.quiverApi.send('request-theme');

window.quiverApi.on('request-theme-response', function(_event, data) {
    const themeVars = {
        '--quiver-bg': data['theme.bg'],
        '--quiver-fg': data['theme.fg'],
        '--quiver-alt': data['theme.alt'],
    }

    Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
});
