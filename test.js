/* eslint-env node, mocha */
const assert = require('chai').assert
const { getName } = require('guld-user')
const { getPass, getHostName } = require('./util.js')

describe('get-git-host', function () {
  before(async function () {
    this.user = await getName()
  })
  it('getPass', async function () {
    var pass = await getPass(this.user, 'github')
    assert.exists(pass.password)
    assert.exists(pass.login)
  })
  it('getHostName', async function () {
    var hostname = await getHostName('guld', 'github')
    assert.exists(hostname)
    assert.equal(hostname, 'guldcoin')
  })
})
