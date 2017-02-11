'use strict'
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const appMenu = require('./menu')

// const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      nodeIntegration: false
    },
    backgroundColor: '#38587b'
  })

  // disable X-Frame-Options
  // https://github.com/electron/electron/pull/573

  mainWindow.webContents.session.webRequest.onHeadersReceived({}, (d, c) => {
    if(d.responseHeaders['x-frame-options'] || d.responseHeaders['X-Frame-Options']){
      delete d.responseHeaders['x-frame-options'];
      delete d.responseHeaders['X-Frame-Options'];
    }
    c({cancel: false, responseHeaders: d.responseHeaders});
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow.removeAllListeners();
    mainWindow = null
  })

  const page = mainWindow.webContents

  page.on('new-window', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })
}

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
