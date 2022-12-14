// open cqhttp firstly
const path = require('path')
const childProcess = require('child_process')
startCqhttp()
// electron
const { ipcMain, app } = require('electron')
// mine
const wins = require('./utils/wins')
const config = require('./utils/config')
const qqData = require('./utils/db')
const webSocket = require('ws')
const sever = new webSocket.Server(config.ip)

// add ws listener
sever.on('connection', cqhttpHandler)

app.whenReady().then(() => {
  // 1. init windows
  wins.winIndex.init(config.winIndex, path.join(__dirname, 'web/index.html'))
  // 2. global ipc
  globalIpc()
  // 3. close cqhttp before quit
  app.on('will-quit', () => {
    killCqhttp()
    if (startTime) qqData.replaceInto('recordTime', startTime, endTime)
  })
})

// bundles for help
let socket // connection between cqhttp and app
let startTime, endTime
let init = false; let groupNums = 0; let checkNums = 0

/***
 * connection between cqhttp and app
 */
function cqhttpHandler (connection) {
  socket = connection
  // handle message listener
  connection.on('message', messageHandler.handle.bind(messageHandler)) // pay attention to bind
  // actions
  // 1. record time
  startTime = new Date().getTime()
  // 2. group list
  if (!init) {
    connection.send(config.cqhttpApi.getGroupList())
    init = true
  } else {
    wins.winIndex.send('restart', true)
  }
  // 3. bug from cqhttp
  // 15 minute per restart
  setTimeout(() => {
    killCqhttp()
    startCqhttp()
    wins.winIndex.send('restart', false)
  }, 900000) // 15min
}

/***
 * handle message and store them to database
 */
class messageHandler {
  static handle (mess) {
    const raw = JSON.parse(mess)
    if ('echo' in raw) { // groups & members
      if (raw.echo === 'groups') {
        if (raw.data) this.#handleGroups(raw.data)
      } else if (raw.echo === 'member') {
        if (raw.data) this.#handleMember(raw.data)
      } else if (raw.echo === 'members') {
        if (raw.data) this.#handleMembers(raw.data)
      }
    } else if (raw.message_type === 'group') { // only group message
      this.#handleMessage(raw)
    }
  }

  static #handleGroups (raw) {
    groupNums = raw.length
    if (groupNums === 0) {
      wins.winIndex.send('groups', true, false)
    }
    raw.forEach(group => {
      checkNums++
      // send to front
      if (checkNums === groupNums) {
        wins.winIndex.send('groups', true, group)
        checkNums = 0
      } else wins.winIndex.send('groups', false, group)
      // save to group-db
      qqData.replaceInto(
        'groupInfo',
        group.group_id,
        group.group_name,
        group.member_count)
    })
  }

  static #handleMember (raw) {
    // save to member-db
    qqData.replaceInto(
      'member',
      raw.group_id,
      raw.user_id,
      raw.nickname,
      raw.card,
      raw.sex,
      raw.join_time,
      raw.role,
      raw.unfriendly,
      raw.last_sent_time)
  }

  static #handleMembers (raw) {
    raw.forEach(member => {
      this.#handleMember(member)
    })
  }

  static #handleMessage (raw) {
    // save to message-db
    qqData.replaceInto(
      'message',
      raw.message_id,
      raw.message_seq,
      raw.group_id,
      raw.user_id,
      Boolean(raw.anonymous),
      raw.message,
      raw.time)
    // get sender
    if (!raw.anonymous) socket.send(config.cqhttpApi.getMemberInfo(raw.group_id, raw.user_id))
    // send to front
    wins.winIndex.send('message', raw)
  }
}

function killCqhttp () {
  // only way to kill the cqhttp
  // process.kill and taskkill are useless
  // loop must be sync
  const stdout = childProcess.execSync('tasklist').toString().split('\n')
  for (let i = 0, len = stdout.length; i < len; i++) {
    const processInfo = stdout[i].trim().split(/\s+/)
    if (processInfo[0] === 'go-cqhttp_windows_386.exe') {
      process.kill(processInfo[1])
      console.log(`process ${processInfo[0]} was killed`)
      endTime = new Date().getTime()
      break
    }
  }
}

function startCqhttp () {
  childProcess.spawn('go-cqhttp_windows_386.exe -faststart', {
    cwd: path.join(process.cwd(), 'go-cqhttp/'),
    shell: true
  })
  console.log('start cqhttp')
}

function globalIpc () {
  ipcMain.handle('get-member', () => {
    qqData.all('select id from groupInfo', (err, rows) => {
      if (err) console.log(err)
      rows.forEach(group => {
        socket.send(config.cqhttpApi.getMemberList(group.id))
      })
    })
  })
}

// one app at a time
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}
