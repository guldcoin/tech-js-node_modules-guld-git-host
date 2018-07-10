const { getAlias, getName } = require('guld-user')
const { pathEscape } = require('guld-git-path')
const HOSTS = {
  bitbucket: require('guld-git-host-bitbucket'),
  github: require('guld-git-host-github'),
  gitlab: require('guld-git-host-gitlab')
}

async function getClients (user) {
  user = user || await getName()
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].getClient(user)))
}

async function listRepos (user) {
  user = user || await getName()
  var aliases = await getAlias(user)
  return Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].listRepos(user))
}

async function createRepo (rname, user, privacy = 'public', options = {}) {
  user = user || await getName()
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].createRepo(rname, user, privacy, options).catch()))
}

async function deleteRepo (rname, user) {
  user = user || await getName()
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].deleteRepo(rname, user)))
}

async function getHostURL (user, slug, host, protocol = 'https') {
  user = user || await getName()
  slug = slug || await pathEscape()
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
  if (host) {
    var aname = await getAlias(user, host)
    return `${prefix}${HOSTS[host].meta.url}${joiner}${aname}/${slug}.git`
  } else {
    return Promise.all(Object.keys(HOSTS)
      .filter(a => aliases.hasOwnProperty(a))
      .map(async host => {
        var aname = await getAlias(user, host)
        return `${prefix}${HOSTS[host].meta.url}${joiner}${aname}/${slug}.git`
      }))
  }
}

async function addSSHKey (key) {
  var aliases = await getAlias(await getName())
  return Promise.all(Object.keys(HOSTS)
    .filter(a => aliases.hasOwnProperty(a))
    .map(a => HOSTS[a].addSSHKey(key)))
}

module.exports = {
  HOSTS: HOSTS,
  getClients: getClients,
  listRepos: listRepos,
  createRepo: createRepo,
  deleteRepo: deleteRepo,
  getHostURL: getHostURL,
  addSSHKey: addSSHKey
}
