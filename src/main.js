const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const winConfig = require('./win-config')
const childProcess = require('child_process')

app.whenReady().then(() => {
  // 1. create window
  createIndexWindow()
  // 2. connect ipc
  globalIpc()
  // 3. open socket
  childProcess.spawn('go-cqhttp_windows_386.exe', { cwd: path.join(process.cwd(), 'go-cqhttp/'), shell: true }, (err, out, stderr) => {
    if (err) {
      console.error(err)
    }
  })
  // totally mess......
  // socket.stdout.on('data', mess => {
  // })
})

app.on('will-quit', () => {
  // only way to kill the socket
  // process.kill and taskkill are useless
  // for must be sync
  const stdout = childProcess.execSync('tasklist').toString().split('\n')
  for (let i = 0, len = stdout.length; i < len; i++) {
    const processInfo = stdout[i].trim().split(/\s+/)
    if (processInfo[0] === 'go-cqhttp_windows_386.exe') {
      process.kill(processInfo[1])
      console.log(`process ${processInfo[0]} was killed`)
      break
    }
  }
})

// many func
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
