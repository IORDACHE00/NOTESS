import { fileEncoding } from '@shared/constants'
import { NoteSchema } from '@shared/models'
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
import { BrowserWindow, dialog } from 'electron'
import { ensureDir, readdir, stat, readFile, writeFile, remove } from 'fs-extra'
import Store from 'electron-store'
import fs from 'fs'
import chokidar from 'chokidar'

const userStore = new Store()

// HELPERS

function getExistingNoteTitles(notesDirectory: string) {
  const existingFiles = fs.readdirSync(notesDirectory, { withFileTypes: true })
  const noteTitles = existingFiles
    .filter((file) => file.isFile() && file.name.endsWith('.md'))
    .map((file) => file.name.replace('.md', ''))

  return noteTitles
}

function generateUniqueTitle(notesDirectory) {
  let newTitle = 'Untitled'
  let titleSuffix = 1

  const existingTitles = getExistingNoteTitles(notesDirectory)

  while (existingTitles.includes(newTitle)) {
    newTitle = `Untitled ${titleSuffix}`
    titleSuffix++
  }

  return newTitle
}

// EXPORTS

// export const getRootDirectory = () => {
//   const notesVaultPath = path.resolve(__dirname, '..', '..', appDirectoryName)
//   return notesVaultPath
// }

export const getVaultPath: GetVaultPath = () => {
  const notesDirectory = userStore.get('notesVault', '')

  if (!notesDirectory) return ''

  return notesDirectory as string
}

export const getNotes: GetNotes = async () => {
  const rootDir = getVaultPath()

  await ensureDir(rootDir)

  const noteFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: true
  })

  const notes = noteFileNames.filter((note) => note.name.endsWith('.md'))

  return Promise.all(notes.map(({ name }) => getNoteInfoFromFilename(name)))
}

export const setVaultPath: SetVaultPath = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Notes Vault',
    buttonLabel: 'Select',
    properties: ['openDirectory']
  })

  if (canceled || !filePaths) return

  userStore.set('notesVault', filePaths[0])
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteSchema> => {
  const fileStats = await stat(`${getVaultPath()}/${filename}`)

  return {
    title: filename.replace('.md', ''),
    lastEdited: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getVaultPath()

  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getVaultPath()

  console.info(`Writing note to ${rootDir}/${filename}.md`)
  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getVaultPath()

  await ensureDir(rootDir)

  const newTitle = generateUniqueTitle(rootDir)

  await writeFile(`${rootDir}/${newTitle}.md`, `# ${newTitle}`, { encoding: fileEncoding })
  console.log(rootDir)

  return newTitle
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getVaultPath()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ['Yes', 'No'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) return false

  await remove(`${rootDir}/${filename}.md`)

  return true
}

export const saveNotes: SaveNotes = async (filename, content) => {
  const rootDir = getVaultPath()

  console.info(`Saving notes to ${rootDir}/${filename}.md`)
  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const watchVault: WatchVault = async (mainWindow: BrowserWindow) => {
  const rootDir = getVaultPath()

  const watcher = chokidar.watch(rootDir, {
    ignored: /(^|[\\])\../,
    persistent: true
  })

  watcher.on('all', (filePath) => {
    if (!filePath.endsWith('.md') || filePath.startsWith('.')) {
      return
    }

    mainWindow.webContents.send('directory-changed', filePath)
  })

  watcher.on('error', (error) => {
    console.error('Error watching notes directory:', error)
  })
}
