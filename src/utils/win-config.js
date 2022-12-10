const path = require('path')

const indexConfig = {
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

module.exports = {
  indexConfig
}
