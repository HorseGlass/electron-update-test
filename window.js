const ipcClient = window.ipcRenderer;

let anyad = () => {
    document.getElementById('version-number').innerHTML = ipcClient.sendSync('reciveVersionNumber');
}

ipcClient.on('Show update text', (e, text) => {
    document.getElementById('updatepanel').innerHTML = text;
    console.log(text);
})