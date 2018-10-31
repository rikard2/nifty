import { app, Menu, BrowserWindow } from 'electron'
const ipc = require('electron').ipcMain;
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
})
const template = [
    {},
    {
        label: 'File',
        submenu: [
            {
                label: 'New',
                accelerator: 'Cmd+N',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'new'
                    });
                }
            },
            {
                label: 'Close tab',
                accelerator: 'Cmd+W',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'close-tab'
                    });
                }
            },
            {
                label: 'Previous tab',
                accelerator: 'Cmd+Alt+Left',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'previous-tab'
                    });
                }
            },
            {
                label: 'Settings',
                accelerator: 'Cmd+,',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'settings'
                    });
                }
            },
            {
                label: 'Next tab',
                accelerator: 'Cmd+Alt+Right',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'next-tab'
                    });
                }
            },
            {
                label: 'Settings',
                accelerator: 'Cmd+,',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'settings'
                    });
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Copy',
                accelerator: 'Cmd+C',
                selector: 'copy:'
            },
            {
                label: 'Cut',
                accelerator: 'Cmd+X',
                selector: 'cut:'
            },
            {
                label: 'Paste',
                accelerator: 'Cmd+V',
                selector: 'paste:'
            }
        ]
    },
    {
        label: 'Execute',
        submenu: [
            {
                label: 'Execute Query',
                accelerator: 'Cmd+Enter',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'execute-query'
                    });
                }
            },
            {
                label: 'Lookup',
                accelerator: 'Cmd+O',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'lookup'
                    });
                }
            },
            {
                label: 'Execute Selected Query',
                accelerator: 'Cmd+Shift+Enter',
                click() {
                    mainWindow.webContents.send('command', {
                        command: 'execute-selected-query'
                    });
                }
            }
        ]
    },
    {
    label: 'Help',
        submenu: [
        {
            label: 'About',
            click() {
                electron.shell.openExternal('https://electron.atom.io') }
            }
        ]
    }
];
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
