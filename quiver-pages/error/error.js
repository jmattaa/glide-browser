const searchParams = new URLSearchParams(window.location.search.replace('?', ''))

let errorCodeEl = document.getElementById('error-code');
let errorDescEl = document.getElementById('error-desc');
let errorUrlEl = document.getElementById('error-url');

let errorDesc = searchParams.get('ed');
let expectedUrl = searchParams.get('url');

errorDescEl.innerHTML = errorDesc;
errorUrlEl.innerHTML = `Check if there is a typo in '${expectedUrl}'`;

function reloadPage() {
    window.postMessage({
        name: 'quiver-ipc-reload-err-page',
        data: {
            url: expectedUrl,
        },
    });
}
