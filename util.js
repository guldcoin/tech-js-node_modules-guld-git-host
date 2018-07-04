const { show, parsePass } = require('guld-pass')
const { getConfig } = require('guld-git-config')
const { getName } = require('guld-user')

async function getPass (user, hostname) {
  user = user || await getName()
  var pass = await show(`${user}/git/${hostname}`)
  if (pass) return parsePass(pass)
}

async function getHostName (user, host) {
  user = user || await getName()
  var cfg = await getConfig('public', user)
  if (cfg && cfg.host && cfg.host[host]) return cfg.host[host]
}

module.exports = {
  getPass: getPass,
  getHostName: getHostName
}
