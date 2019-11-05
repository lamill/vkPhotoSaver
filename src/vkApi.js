'use strict'
import { BrowserWindow, shell } from 'electron'
import Axios from 'axios'

const url = require('url')
const qs = require('querystring')
const _ = require('lodash')

const redirectUri = 'https://oauth.vk.com/blank.html'
const apiUrl = 'https://api.vk.com/method/'
const apiVersion = '5.101'
const scopes = 262148
let authWindow = null

export class VkClient {
  constructor () {
    this.app_id = 'your app id'
    this.token = null
    this.Aerror = null
    this.rejected = true
    this.used_id = null
  }
  authUser () {
    this.token = null
    this.Aerror = null
    this.rejected = true
    this.user_id = null
    let data = this
    return new Promise(function (resolve) {
      authWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
          nodeIntegration: false
        }
      })

      authWindow.on('closed', async function () {
        authWindow = null
        let retVal = {
          error: null,
          name: ''
        }
        retVal.error = data.rejected && data.Aerror === null
          ? 'reject'
          : data.Aerror
        if (retVal.error === null) {
          console.log('getting name')
          const resp = await data.runMethod('users.get', {user_ids: data.user_id})
          retVal.name = resp.data.response[0].first_name + ' ' + resp.data.response[0].last_name
        }
        resolve(retVal)
      })

      authWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault()
        shell.openExternal(url)
      })

      authWindow.webContents.on('did-get-redirect-request', function (e, oldUrl, newUrl) {
        try {
          if (newUrl === 'https://oauth.vk.com/') {
            authWindow.close()
            return
          }
          if (newUrl.indexOf(redirectUri) !== 0) {
            return
          }
          data.rejected = false
          const hash = url.parse(newUrl).hash.substr(1)
          data.token = _.get(qs.parse(hash), 'access_token')
          data.user_id = _.get(qs.parse(hash), 'user_id')
          if (data.token === undefined) {
            console.log(_.get(qs.parse(hash), 'error_reason'))
            data.Aerror = _.get(qs.parse(hash), 'error_reason=') > 'user_denied'
              ? _.get(qs.parse(hash), 'error_description')
              : 'reject'
          }
        // authWindow.webContents.session.clearStorageData()
        } catch (error) {
          data.Aerror = error
        }
        authWindow.close()
      })

      authWindow.loadURL(url.format({
        protocol: 'https',
        host: 'oauth.vk.com',
        pathname: 'authorize',
        query: {
          client_id: data.app_id,
          scope: scopes,
          redirect_uri: redirectUri,
          display: 'popup',
          response_type: 'token',
          revoke: 1
        }
      }))
    })
  }
  async runMethod (method, args) {
    try {
      let apiArgs = {
        v: apiVersion,
        access_token: this.token
      }
      if (args !== null) {
        Object.assign(apiArgs, args)
      }
      const resp = await Axios.get(apiUrl + method, {
        params: apiArgs
      })
      return resp
    } catch (error) {
      console.log(error)
      return error
    }
  }
  async getAccessInfo (info) {
    let retVal = {
      id: null,
      name: null,
      error: 'empty'
    }
    switch (info.idType) {
      case 'users':
        {
          const resp = await this.runMethod('users.get', {user_ids: info.id})
          if (!('error' in resp.data)) {
            if (resp.data.response[0].can_access_closed === true) {
              retVal.id = resp.data.response[0].id
              retVal.error = null
              retVal.name = resp.data.response[0].first_name + ' ' + resp.data.response[0].last_name
            } else {
              retVal.error = 'closed'
            }
          } else {
            retVal.error = resp.data.error
          }
        }
        break
      case 'groups':
        {
          const resp = await this.runMethod('groups.getById', {group_ids: info.id})
          if (!('error' in resp.data)) {
            console.log(resp.data)
            if (resp.data.response[0].is_closed === 1 && resp.data.response[0].is_member === 0) {
              retVal.error = 'closed'
            } else {
              retVal.id = '-' + resp.data.response[0].id
              retVal.name = resp.data.response[0].name
              retVal.error = null
            }
          } else {
            retVal.error = resp.data.error
          }
        }
        break
      default:
        break
    }
    return retVal
  }
  async getAlbumsList (info) {
    let retVal
    try {
      retVal = await this.getAccessInfo(info)
      if (retVal.error !== null) {
        return retVal
      } else {
        const resp = await this.runMethod('photos.getAlbums', {
          owner_id: retVal.id,
          need_system: 1
        })
        retVal.albums = []
        for (let i = 0; i < resp.data.response.count; i++) {
          retVal.albums[i] = {
            id: resp.data.response.items[i].id,
            name: resp.data.response.items[i].title,
            size: resp.data.response.items[i].size
          }
        }
        return retVal
      }
    } catch (error) {
      retVal.error = error
      return retVal
    }
  }
}
