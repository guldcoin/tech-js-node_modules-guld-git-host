const { getAlias } = require('guld-user')
const HOSTS = {
  bitbucket: require('guld-git-host-bitbucket'),
  github: require('guld-git-host-github'),
  gitlab: require('guld-git-host-gitlab')
}

async function getClients (user) {
  var aliases = await getAlias(user)
  return Promise.all(Object.keys(HOSTS)
    .filter(aliases.hasOwnProperty)
    .map(a => HOSTS[a].getClient(user)))
}

async function listRepos (user) {
  var aliases = await getAlias(user)
  return Object.keys(HOSTS)
    .filter(aliases.hasOwnProperty)
    .map(a => HOSTS[a].listRepos(user))
}

async function createRepo (rname, user, privacy = 'public', options = {}) {
  var aliases = await getAlias(user)
  return Object.keys(HOSTS)
    .filter(aliases.hasOwnProperty)
    .map(a => HOSTS[a].createRepo(rname, user, privacy, options))
}

async function deleteRepo (rname, user) {
  var aliases = await getAlias(user)
  return Object.keys(HOSTS)
    .filter(aliases.hasOwnProperty)
    .map(a => HOSTS[a].deleteRepo(rname, user))
}

module.exports = {
  HOSTS: HOSTS,
  getClients: getClients,
  listRepos: listRepos,
  createRepo: createRepo,
  deleteRepo: deleteRepo
}
