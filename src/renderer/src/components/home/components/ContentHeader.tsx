import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FiChevronLeft, FiChevronRight, FiMoreVertical } from 'react-icons/fi'

type TContentHeaderItem = {
  id?: number
  title: string
  icon: JSX.Element
  action: () => void
}

export default function ContentHeader() {
  const leftHeader: TContentHeaderItem[] = [
    {
      id: 1,
      title: 'Navigate back',
      icon: <FiChevronLeft />,
      action: () => console.log('Navigate back')
    },
    {
      id: 2,
      title: 'Navigate forward',
      icon: <FiChevronRight />,
      action: () => console.log('Navigate forward')
    }
  ]

  const rightHeader: TContentHeaderItem[] = [
    {
      id: 1,
      title: 'More options',
      icon: <FiMoreVertical />,
      action: () => console.log('More options')
    }
  ]

  return (
    <div className="flex items-center p-2">
      {leftHeader.map(({ id, title, icon, action }) => (
        <ContentHeaderItem key={id} title={title} icon={icon} action={action} />
      ))}

      <div className="ml-auto">
        {rightHeader.map(({ id, title, icon, action }) => (
          <ContentHeaderItem key={id} title={title} icon={icon} action={action} />
        ))}
      </div>
    </div>
  )
}

const ContentHeaderItem = ({ action, icon, title }: TContentHeaderItem) => {
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
