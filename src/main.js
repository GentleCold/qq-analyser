// open cqhttp firstly
const path = require('path')
const childProcess = require('child_process')
childProcess.spawn('go-cqhttp_windows_386.exe', {
  cwd: path.join(process.cwd(), 'go-cqhttp/'),
  shell: true
})
// electron
const { app } = require('electron')
// mine
const wins = require('./utils/wins')
const config = require('./utils/config')
const qqData = require('./utils/db')
const webSocket = require('ws')
const sever = new webSocket.Server(config.ip)

sever.on('connection', cqhttpHandler)

app.whenReady().then(() => {
  // 1. init windows
  wins.winIndex.init(config.winIndex, path.join(__dirname, 'web/index.html'))
  // 2. close cqhttp before quit
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
})

// bundles for help

/***
 * connection between cqhttp and app
 */
function cqhttpHandler (socket) {
  // handle message listener
  socket.on('message', messageHandler.handle)
  // actions
  wins.winIndex.send('info', 'connect successfully')
  socket.send(config.cqhttpApi.getGroupList())
}

/***
 * store the message to database
 */
class messageHandler {
  static handle (mess) {
    const raw = JSON.parse(mess)
    if ('echo' in raw) { // groups & members
      if (raw.echo === 'groups') {
        this.#handleGroups(raw.data)
      } else if (raw.echo === 'members') {
        this.#handleMembers(raw.data)
      }
    } else if (raw.message_type === 'group') { // only group message
      this.#handleMessage(raw)
    }
  }

  static #handleGroups (raw) {
    raw.data.forEach(group => {
      // save to group-db
      qqData.replaceInto(
        'groupInfo',
        group.group_id,
        group.group_name,
        group.member_count)
    })
  }

  static #handleMembers (raw) {
    // save to member-db
    raw.data.forEach(member => {
      qqData.replaceInto(
        'member',
        member.group_id,
        member.user_id,
        member.nickname,
        member.card,
        member.sex,
        member.join_time,
        member.role,
        member.unfriendly,
        member.title)
    })
  }

  static #handleMessage (raw) {
    // save to message-db
    qqData.replaceInto(
      'message',
      raw.message_id,
      raw.group_id,
      raw.user_id,
      Boolean(raw.anonymous),
      raw.message,
      raw.time)
  }
}
