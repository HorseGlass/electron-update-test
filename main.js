process.env.GH_TOKEN = "4320920ce5d345630605315f7bb03c58541bece4";

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
          label: 'Check for updates'
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