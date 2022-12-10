const sqlite3 = require('sqlite3').verbose()
const qqData = new sqlite3.Database('./sqlite3/qq.db')

// initialize
qqData.serialize(() => {
  qqData.run('create table if not exists groupInfo(id bigint, name varchar(50), member_count int, primary key(id));')
  qqData.run('create table if not exists member(group_id bigint, user_id bigint, nickname varchar(50), card varchar(50), sex varchar(10), join_time int, role varchar(10), unfriendly boolean, title varchar(50), primary key(group_id, user_id));')
  qqData.run('create table if not exists message(id int, group_id bigint, user_id bigint, anonymous boolean, message TEXT, time int, primary key(id));')
})

qqData.replaceInto = (table, ...args) => {
  const len = args.length
  let nq = ''
  for (let i = 1; i < len; i++) {
    nq += '?,'
  }
  nq += '?'
  qqData.run(`replace into ${table} values(${nq})`, args, e => {
    if (e) { console.log(e) }
  })
}

module.exports = qqData
