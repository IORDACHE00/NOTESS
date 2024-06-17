import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import {
  CreateNote,
  DeleteNote,
  GetNotes,
  GetVaultPath,
  ReadNote,
  SetVaultPath,
  UserPreferences,
  WriteNote
} from '@shared/types'
import {
  createNote,
  deleteNote,
  getNotes,
  getVaultPath,
  readNote,
  setVaultPath,
  watchVault,
  writeNote
} from './lib'
import fs from 'fs'

const preferencesPath = join(app.getPath('userData'), 'userPreferences.json')

function createWindow(): void {
  // Read preferences or use default values
  let preferences: UserPreferences = {
    windowState: {
      x: 0,
      y: 0,
      width: 900,
      height: 670
    }
  }

  try {
    preferences = JSON.parse(fs.readFileSync(preferencesPath, 'utf-8'))
  } catch (error) {
    console.error('Error reading preferences file:', error)
  }

  const savedState = preferences.windowState

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: savedState?.width || 900, // Use saved width or default
    height: savedState?.height || 670, // Use saved height or default
    x: savedState?.x, // Use saved x or default
    y: savedState?.y, // Use saved y or default
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  watchVault(mainWindow)

  // Save window state on close
  mainWindow.on('close', () => {
    const windowState = mainWindow.getBounds()
    preferences.windowState = windowState

    fs.writeFileSync(preferencesPath, JSON.stringify(preferences))
  })
}

// ... rest of your code ...

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC Notes
  ipcMain.handle('getNotes', async (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle(`readNote`, async (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle(`writeNote`, async (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle(`createNote`, async (_, ...args: Parameters<CreateNote>) => createNote(...args))
  ipcMain.handle('deleteNote', async (_, ...args: Parameters<DeleteNote>) => deleteNote(...args))

  // Vault Path Handler
  ipcMain.handle('getVaultPath', async (_, ...args: Parameters<GetVaultPath>) =>
    getVaultPath(...args)
  )
  ipcMain.handle('setVaultPath', async (_, ...args: Parameters<SetVaultPath>) =>
    setVaultPath(...args)
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
