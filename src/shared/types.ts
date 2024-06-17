import { BrowserWindow } from 'electron'
import { NoteContentSchema, NoteSchema } from './models'

export type GetNotes = () => Promise<NoteSchema[] | undefined>
export type ReadNote = (title: NoteSchema['title']) => Promise<NoteContentSchema>
export type WriteNote = (
  title: NoteSchema['title'],
  content: NoteContentSchema | undefined
) => Promise<void>
export type CreateNote = () => Promise<NoteSchema['title'] | false>
export type DeleteNote = (title: NoteSchema['title']) => Promise<boolean>
export type SaveNotes = (
  title: NoteSchema['title'],
  content: NoteContentSchema | undefined
) => Promise<void>

export type UserPreferences = {
  windowState: {
    x: number
    y: number
    width: number
    height: number
  }
}

// Vault path handler

export type GetVaultPath = () => string
export type SetVaultPath = (path: string) => void

export type WatchVault = (arg: BrowserWindow) => void
