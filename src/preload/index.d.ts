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

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
      saveNotes: SaveNotes
      setVaultPath: SetVaultPath
      getVaultPath: GetVaultPath
      watchVault: WatchVault
    }
  }
}
