const ipcClient = window.ipcRenderer;

let anyad = () => {
    document.getElementById('version-number').innerHTML = ipcClient.sendSync('reciveVersionNumber');
}