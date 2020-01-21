const {app, BrowserWindow, ipcMain, Menu} = require('electron')
const { autoUpdater } = require("electron-updater")
const path = require('path')
const url = require('url')

let window = null

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 500px
    width: 500,
    // Set the initial height to 400px
    height: 400,
    // set the title bar style
    titleBarStyle: 'hiddenInset',
    // set the background color to black
    backgroundColor: "#111",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false,

    webPreferences: {
      preload: `${__dirname}/preload.js`
    }
  })

  window.webContents.openDevTools()

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  window.once('ready-to-show', () => {
    window.show()
  });

  let menu = Menu.buildFromTemplate([
    {
      label: 'Update',
      submenu: [
        {
          label: 'Check for updates',
          click: () => {
            autoUpdater.checkForUpdates();
          }
        }
      ]
    }
  ]);
  window.setMenu(menu);
});

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('reciveVersionNumber', (event, arg) => {
  event.returnValue = app.getVersion();
})

autoUpdater.on('checking-for-update', () => {
  window.webContents.send('Show update text', 'Checking for updates!');
})
autoUpdater.on('update-available', (info) => {
  window.webContents.send('Show update text', 'Update avaible');
})
autoUpdater.on('update-not-available', (info) => {
  window.webContents.send('Show update text', 'Update not avaible');
})
autoUpdater.on('error', (err) => {
  window.webContents.send('Show update text', err.toString());
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  window.webContents.send('Show update text', log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  window.webContents.send('Show update text', 'Update downloaded, 5 seconds to restart');
  setTimeout(()=>autoUpdater.quitAndInstall(), 5000)
})