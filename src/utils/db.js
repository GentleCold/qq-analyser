const sqlite3 = require('sqlite3').verbose()
const qqData = new sqlite3.Database('./sqlite3/qq.db')

// initialize
qqData.serialize(() => {
  qqData.run('create table if not exists groupInfo(id bigint, name varchar(50), member_count int, primary key(id));')
  qqData.run('create table if not exists member(group_id bigint, user_id bigint, nickname varchar(50), card varchar(50), sex varchar(10), join_time int, role varchar(10), unfriendly boolean, last_sent_time int, primary key(group_id, user_id));')
  qqData.run('create table if not exists message(message_id int, message_seq int, group_id bigint, user_id bigint, anonymous boolean, message TEXT, time int, primary key(message_id, message_seq));')
  qqData.run('create table if not exists recordTime(start int, end int);')
})

/**
 * wrapped function to fast store
 * @param table db table name
 * @param args values to store
 */
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
