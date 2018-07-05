const { getAlias } = require('guld-user')
const { pathEscape } = require('guld-git-path')
const HOSTS = {
  bitbucket: require('guld-git-host-bitbucket'),
  github: require('guld-git-host-github'),
  gitlab: require('guld-git-host-gitlab')
}

async function getClients (user) {
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].getClient(user)))
}

async function listRepos (user) {
  var aliases = await getAlias(user)
  return Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].listRepos(user))
}

async function createRepo (rname, user, privacy = 'public', options = {}) {
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].createRepo(rname, user, privacy, options)))
}

async function deleteRepo (rname, user) {
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].deleteRepo(rname, user)))
}

async function getHostURL (user, rname, host, protocol='https') {
  user = user || await getName()
  rname = rname || await pathEscape()
  var aliases = await getAlias(user)
  var prefix
  var joiner
  if (protocol === 'ssh' || protocol === 'git') {
    prefix = 'git@'
    joiner = ':'
  } else if (protocol.startsWith('http')) {
    prefix = 'https://' // force https :)
    joiner = '/'
  } else {
    throw new TypeError('unknown git protocol')
  }
  if (host) return `${prefix}${HOSTS[host].meta.url}${joiner}${user}/${rname}.git`
  else {
    return Object.keys(HOSTS)
      .filter(a => aliases.hasOwnProperty(a))
      .map(host => `${prefix}${HOSTS[host].meta.url}${joiner}${user}/${rname}.git`)
  }
}

module.exports = {
  HOSTS: HOSTS,
  getClients: getClients,
  listRepos: listRepos,
  createRepo: createRepo,
  deleteRepo: deleteRepo,
  getHostURL: getHostURL
}
