import {
  CreateNote,
  DeleteNote,
  GetNotes,
  GetVaultPath,
  ReadNote,
  SaveNotes,
  SetVaultPath,
  WatchVault,
  WriteNote
} from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args),
    saveNotes: (...args: Parameters<SaveNotes>) => ipcRenderer.invoke('saveNotes', ...args),
    setVaultPath: (...args: Parameters<SetVaultPath>) =>
      ipcRenderer.invoke('setVaultPath', ...args),
    getVaultPath: (...args: Parameters<GetVaultPath>) =>
      ipcRenderer.invoke('getVaultPath', ...args),
    watchVault: (...args: Parameters<WatchVault>) => ipcRenderer.invoke('watchVault', ...args)
  })
} catch (error) {
  console.error(error)
}
