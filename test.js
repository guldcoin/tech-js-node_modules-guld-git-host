/* eslint-env node, mocha */
const assert = require('chai').assert
const { getName } = require('guld-user')
const { getHostURL } = require('./index.js')

describe('get-git-host', function () {
  it('getHostURL', async function () {
    var url = await getHostURL('guld', 'test-repo', 'github', protocol='https')
    assert.equal(url, `https://github.com/guldcoin/test-repo.git`)
  })
  it('getHostURL http', async function () {
    var url = await getHostURL('guld', 'test-repo', 'github', protocol='http')
    assert.equal(url, `https://github.com/guldcoin/test-repo.git`)
  })
  it('getHostURL ssh', async function () {
    var url = await getHostURL('guld', 'test-repo', 'github', protocol='ssh')
    assert.equal(url, `git@github.com:guldcoin/test-repo.git`)
  })
  it('getHostURL git', async function () {
    var url = await getHostURL('guld', 'test-repo', 'github', protocol='git')
    assert.equal(url, `git@github.com:guldcoin/test-repo.git`)
  })
  it('getHostURL multiple', async function () {
    var url = await getHostURL('guld', 'test-repo', undefined)
    assert.isTrue(Array.isArray(url))
    assert.isTrue(url.indexOf(`https://github.com/guldcoin/test-repo.git`) > -1)
    assert.isTrue(url.indexOf(`https://gitlab.com/guld/test-repo.git`) > -1)
    assert.isTrue(url.indexOf(`https://bitbucket.org/guld/test-repo.git`) > -1)
  })
})
