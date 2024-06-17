import { NoteSchema } from '@shared/models'
import { NoteContentSchema } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

export const loadNotes = async () => {
  const notes = await window.context.getNotes()

  if (!notes) return []

  return notes.sort((a, b) => b.lastEdited - a.lastEdited)
}

const notesAtomAsync = atom<NoteSchema[] | Promise<NoteSchema[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const selectedNoteIndex = get(selectedNoteIndexAtom)
  const notes = get(notesAtom)

  if (selectedNoteIndex === null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  const noteContent = await window.context.readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      lastEdited: Date.now(),
      content: ''
    }
)

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContentSchema) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  await window.context.writeNote(selectedNote.title, newContent)

  set(
    notesAtom,
    notes.map((note) =>
      note.title === selectedNote.title ? { ...note, lastEdited: Date.now() } : note
    )
  )
})

export const createEmptyNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = await window.context.createNote()

  if (!title) return

  const newNote: NoteSchema = {
    title,
    lastEdited: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDeleted = await window.context.deleteNote(selectedNote.title)

  if (!isDeleted) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})

export const saveNotesOnCloseAtom = atom(null, async (get, set, newContent: NoteContentSchema) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  await window.context.saveNotes(selectedNote.title, newContent)

  set(
    notesAtom,
    notes.map((note) =>
      note.title === selectedNote.title ? { ...note, lastEdited: Date.now() } : note
    )
  )
})
