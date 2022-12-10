const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bar', {
  close: () => ipcRenderer.invoke('close-index'),
  min: () => ipcRenderer.invoke('min-index')
})

contextBridge.exposeInMainWorld('info', {
  get: (callback) => {
    ipcRenderer.on('info', callback)
  }
})
