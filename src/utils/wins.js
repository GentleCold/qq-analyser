const { ipcMain, BrowserWindow } = require('electron')
const jieBa = require('@node-rs/jieba')

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

/**
 * for fast init a window with useful ipc listeners and others
 */
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
    ipcMain.handle('cut-word', (event, text) => {
      const result = jieBa.extract(text, 100)
      this.send('return-word', result)
    })
    ipcMain.handle('pin', () => {
      this.win.setAlwaysOnTop(true)
    })
    ipcMain.handle('unpin', () => {
      this.win.setAlwaysOnTop(false)
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
