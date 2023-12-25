const { ipcRenderer } = require('electron');

window.addEventListener('message', function(e) {
    if (!e.origin.startsWith('file://')) {
        return
    }

    const message = e.data;

    if (message.name.startsWith('glide-ipc-')) {
        const msgName = message.name.replace('glide-ipc-', '');
        ipcRenderer.send(msgName, message.data);
    }
})
