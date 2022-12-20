const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bar', {
  close: () => ipcRenderer.invoke('close-index'),
  min: () => ipcRenderer.invoke('min-index'),
  getMember: () => ipcRenderer.invoke('get-member'),
  pin: () => ipcRenderer.invoke('pin'),
  unpin: () => ipcRenderer.invoke('unpin')
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
  },
  memberFinish: (callback) => {
    ipcRenderer.on('member-finish', callback)
  }
})

contextBridge.exposeInMainWorld('word', {
  cut: (text) => {
    ipcRenderer.invoke('cut-word', text)
  },
  get: (callback) => {
    ipcRenderer.on('return-word', callback)
  }
})
