const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bar', {
  close: () => ipcRenderer.invoke('close-index'),
  min: () => ipcRenderer.invoke('min-index')
})

contextBridge.exposeInMainWorld('info', {
  groups: (callback) => {
    ipcRenderer.on('groups', callback)
  },
  message: (callback) => {
    ipcRenderer.on('message', callback)
  },
  restart: (callback) => {
    ipcRenderer.on('restart', callback)
  }
})
