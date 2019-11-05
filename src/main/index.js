'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { VkClient } from '../vkApi'
import '../renderer/store'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const client = new VkClient()
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
  mainWindow.loadURL(winURL)

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

ipcMain.on('DownloadMenu', async (event, message, info) => {
  switch (message) {
    case 'getAlbums':
      const resp = await client.getAlbumsList(info)
      mainWindow.webContents.send('DownloadMenu', resp)
      break
    default:
      break
  }
})

ipcMain.on('LoginPage', async (event, message) => {
  client.authUser().then(result => {
    switch (result.error) {
      case null:
        console.log('okee')
        mainWindow.webContents.send('LoginPage', 'success', result.name)
        break
      case 'reject':
        console.log('rejected')
        console.log('dsad')
        break
      default:
        console.log(result)
        break
    }
  }, error => {
    console.log(error)
  })
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
