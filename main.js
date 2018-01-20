const {
  app,
  BrowserWindow,
  Menu,
  Tray
} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "RPiLC Desktop",
    icon: "web/favicon96x96.png"
  })

  win.on('minimize', function(event) {
    event.preventDefault();
    win.hide();
  });

  win.on('close', function(event) {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }

    return false;
  });
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'web/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


let tray = null

app.on('ready', () => {
  tray = new Tray('web/favicon.ico')
  const contextMenu = Menu.buildFromTemplate([{
      label: 'Show App',
      click: function() {
        win.show();
      }
    },

    {
      label: 'Red Light',
      click: function() {
        win.webContents.send('fadeoc', "#ff0000");
      }
    },

    {
      label: 'Quit',
      click: function() {
        app.isQuiting = true;
        app.quit();
      }
    }

  ])
  tray.setToolTip('RPiLC Desktop')
  tray.setContextMenu(contextMenu)
})
