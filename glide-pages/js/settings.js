import data from "../../user/settings.json" assert { type: "json" };

const formElement = document.getElementById("settingsForm");
const settingsBanner = document.querySelector(".banner");

const settings = data;

createSettingsForm(settings);

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
    window.postMessage({
        name: 'glide-ipc-change-settings',
        data: {
            setting,
            value
        },
    });

    // show banner
    settingsBanner.style.display = 'block';
}
