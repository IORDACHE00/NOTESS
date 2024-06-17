import SearchBar from './SearchBar'
import ActionBar from './ActionBar'
import { useNotesList } from '@/hooks/useNotesList'
import { useEffect } from 'react'

export default function Sidebar() {
  return (
    <div className="h-full font-semibold bg-body-darker text-text p-4 flex flex-col gap-4">
      <SearchBar />
      <div className="w-full h-[1px] bg-white/10" />
      <ActionBar />
      <Notes />
    </div>
  )
}

const Notes = () => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({})

  if (!notes) return null

  return (
    <div className="flex flex-col gap-2">
      {notes.length ? (
        notes.map(({ title, lastEdited }, index) => (
          <NoteItem
            key={index}
            index={index}
            title={title}
            lastEdited={lastEdited}
            selectedNoteIndex={selectedNoteIndex}
            handleNoteSelect={handleNoteSelect}
          />
        ))
      ) : (
        <p className="text-white/50 text-xs font-normal">Start with a new note?</p>
      )}
    </div>
  )
}

type NoteItemProps = {
  index: number
  title: string
  lastEdited: number
  selectedNoteIndex: number | null
  handleNoteSelect: (index: number) => () => void
}

const NoteItem = ({
  index,
  title,
  lastEdited,
  selectedNoteIndex,
  handleNoteSelect
}: NoteItemProps) => {
  return (
    <div
      className={`flex flex-col p-2 justify-center items cursor-pointer hover:bg-white/5 rounded-md ${
        selectedNoteIndex === index ? 'bg-white/10' : ''
      }`}
      onClick={handleNoteSelect(index)}
    >
      <div className="flex w-full items-center">
        <h3 className="text-white/70 text-sm font-semibold line-clamp-1">{title}</h3>
        <p className="text-[10px] text-white/30 ml-auto pl-2">
          {new Date(lastEdited).toLocaleDateString()}
        </p>
      </div>

      {/* <p className="text-white/50 text-xs font-normal line-clamp-2">
        {content}
      </p> */}
    </div>
  )
}
