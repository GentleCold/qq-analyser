const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const winConfig = require('./win-config')
const childProcess = require('child_process')
const webSocket = require('ws')
let indexWin, sever

// main process
app.whenReady().then(() => {
  // 1. create window
  createIndexWindow()
  // 2. connect ipc
  globalIpc()
  // 3. register websocket listener
  sever = new webSocket.Server({ host: '127.0.0.1', port: '8080' })
  sever.on('connection', socket => {
    // a. when connect
    indexWin.webContents.send('info', 'connect successfully')
    socket.send(JSON.stringify({ // get all group
      action: 'get_group_list',
      echo: 'group'
    }))
    // b. socket listener
    socket.on('message', mess => {
      // handle message
      const raw = JSON.parse(mess)
      if ('echo' in raw) { // group & sender
        if (raw.echo === 'group') {
          // save to group-db
        } else if (raw.echo === 'sender') {
          // save to sender-db
        }
      } else if (raw.message_type === 'group') { // only group message
        // save to message-db & get sender-info
        socket.send(JSON.stringify({
          action: 'get_group_member_info',
          params: {
            group_id: raw.group_id,
            user_id: raw.user_id
          },
          echo: 'sender'
        }))
      }
    })
    socket.on('error', err => {
      indexWin.webContents.send('info', 'server close' + err)
    })
  })
  // 4. open cqhttp
  childProcess.spawn('go-cqhttp_windows_386.exe', { cwd: path.join(process.cwd(), 'go-cqhttp/'), shell: true }, (err, out, stderr) => {
    if (err) {
      console.error(err)
    }
  })
  // cqhttp.stdout.on('data', mess => {
  //   // totally shit......
  //   indexWin.webContents.send('info', mess.toLocaleString().trim().replace('', '').replace('[37m', '').replace('[33m', '').replace('[0m', ''))
  // })
})

app.on('will-quit', () => {
  // only way to kill the cqhttp
  // process.kill and taskkill are useless
  // loop must be sync
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
  // record
  indexWin = win
}

const globalIpc = () => {
}
