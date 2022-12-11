const path = require('path')

const winIndex = {
  // win size
  width: 750,
  height: 450,
  minWidth: 750,
  minHeight: 450,
  frame: false,
  maximizable: false,
  webPreferences: {
    // devTools: false,
    preload: path.join(__dirname, '../preload/index-pre.js')
  }
}

const ip = {
  host: '127.0.0.1',
  port: '8080'
}

const cqhttpApi = {
  getGroupList: () => JSON.stringify({
    action: 'get_group_list',
    echo: 'groups'
  }),
  getMemberInfo: (gid, uid) => JSON.stringify({
    action: 'get_group_member_info',
    params: {
      group_id: gid,
      user_id: uid
    },
    echo: 'member'
  })
}

module.exports = {
  winIndex,
  ip,
  cqhttpApi
}
