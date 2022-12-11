const { ipcMain, BrowserWindow } = require('electron')

class win {
  static win
  static init (config, viewPath) {
    this.win = new BrowserWindow(config)
    this.win.loadFile(viewPath)
  }

  static send (channel, ...args) {
    this.win.webContents.send(channel, ...args)
  }
}

class winIndex extends win {
  static init (config, viewPath) {
    super.init(config, viewPath)
    this.#setIpc()
    this.#others()
  }

  static #setIpc () {
    // local ipc
    ipcMain.handle('close-index', () => {
      if (this.win) {
        this.win.close()
      }
    })
    ipcMain.handle('min-index', () => {
      this.win.minimize()
    })
  }

  static #others () {
    // prevent right click menu
    this.win.hookWindowMessage(0x116, () => {
      this.win.setEnabled(false)
      setTimeout(() => {
        this.win.setEnabled(true)
      }, 100)
      return true
    })
  }
}

module.exports = {
  winIndex
}
