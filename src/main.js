const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const winConfig = require('./win-config')

app.whenReady().then(() => {
  // 1. create window
  createIndexWindow()
  // 2. connect ipc
  globalIpc()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const createIndexWindow = () => {
  const win = new BrowserWindow(winConfig.indexConfig)
  win.loadFile(path.join(__dirname, 'web/index.html'))
  // local ipc
  ipcMain.handle('close-index', () => {
    if (win) {
      win.close()
    }
  })
  ipcMain.handle('min-index', () => {
    win.minimize()
  })
  // prevent right click menu
  win.hookWindowMessage(0x116, () => {
    win.setEnabled(false)
    setTimeout(() => {
      win.setEnabled(true)
    }, 100)
    return true
  })
}

const globalIpc = () => {
}
