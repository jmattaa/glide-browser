import data from '../../user/settings.json' assert { type: 'json' };

const settings = data || {
    "theme": {
        "bg": "12, 15, 11",
        "fg": "255, 255, 255",
    },
    "autohideMenu": true,
    "defaultUrl": "glide://home",
};

const formElement = document.getElementById("settingsForm");

function createInput(key, value) {
    const container = document.createElement("div");

    if (typeof value === "object") {
        for (const subKey in value) {
            if (value.hasOwnProperty(subKey)) {
                createInput(`${key}: ${subKey}`, value[subKey]);
            }
        }
    }
    else {
        const label = document.createElement("label");
        label.textContent = key;
        container.appendChild(label);

        if (typeof value === "boolean") {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = value;
            container.appendChild(input);
        } else {
            const input = document.createElement("input");
            input.type = "text";
            input.value = value;
            container.appendChild(input);
        }
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

createSettingsForm(settings);

