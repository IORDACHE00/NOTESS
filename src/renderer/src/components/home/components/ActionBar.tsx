import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { FiArchive, FiFilePlus, FiFolderPlus, FiTrash } from 'react-icons/fi'
import { useSetAtom } from 'jotai'
import { createEmptyNoteAtom, deleteNoteAtom } from '@/store'

type Action = {
  id?: number
  title: string
  icon: JSX.Element
  action: () => void
}

export default function ActionBar() {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom)
  const deleteNote = useSetAtom(deleteNoteAtom)

  async function handleCreateNote() {
    await createEmptyNote()
  }

  async function handleDeleteNote() {
    console.log('Delete note')
    await deleteNote()
  }

  const actions: Action[] = [
    {
      id: 1,
      title: 'Add note',
      icon: <FiFilePlus />,
      action: handleCreateNote
    },
    {
      id: 2,
      title: 'Add folder',
      icon: <FiFolderPlus />,
      action: () => console.log('Add folder')
    },
    {
      id: 3,
      title: 'View archive',
      icon: <FiArchive />,
      action: () => console.log('View archive')
    },
    // DELETE BUTTON PLACEHOLDER
    {
      id: 4,
      title: 'Delete',
      icon: <FiTrash />,
      action: handleDeleteNote
    }
  ]

  return (
    <div>
      {actions.map(({ id, title, icon, action }) => (
        <ActionItem key={id} title={title} icon={icon} action={action} />
      ))}
    </div>
  )
}

export function ActionItem({ icon, title, action }: Action) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button size="xs" variant="link" className="hover:bg-white/10" onClick={action}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="py-1 px-2 bg-black text-text">
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
