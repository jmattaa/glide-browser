const formElement = document.getElementById("settingsForm");
const settingsBanner = document.querySelector(".banner");

window.onload = function() {
    window.quiverApi.send('request-settings', {});
    window.quiverApi.on('request-settings-response', function(_evt, data) {
        createSettingsForm(data.settings);
    });
}

function createInput(key, value) {
    const container = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = key.replaceAll("-", " ");
    container.appendChild(label);

    if (typeof value === "boolean") {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = value;
        input.addEventListener("change",
            () => changeSetting(key, input.checked));

        container.appendChild(input);
    } else {
        const input = document.createElement("input");
        input.type = "text";
        input.value = value;
        input.addEventListener("keyup",
            () => changeSetting(key, input.value));

        container.appendChild(input);
    }

    formElement.appendChild(container);
}

function createSettingsForm(settings) {
    for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
            createInput(key, settings[key]);
        }
    }
}

function changeSetting(setting, value) {
    window.quiverApi.send('change-settings', { setting, value });

    // show banner
    settingsBanner.style.display = 'block';
}
