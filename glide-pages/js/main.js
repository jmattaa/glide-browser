window.glideApi.send('request-theme');

window.glideApi.on('request-theme-response', function(_event, data) {
    const themeVars = {
        '--glide-bg': data['theme.bg'],
        '--glide-fg': data['theme.fg'],
        '--glide-alt': data['theme.alt'],
    }

    Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
});
