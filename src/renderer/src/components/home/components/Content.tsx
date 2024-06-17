import { useEffect, useRef } from 'react'
import ContentHeader from './ContentHeader'
import { MarkdownEditor } from './MarkdownEditor'
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor'

export default function Content() {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const { selectedNote } = useMarkdownEditor()

  useEffect(() => {
    contentContainerRef.current?.scrollTo(0, 0)
  }, [selectedNote])

  return (
    <div className="min-h-full bg-body">
      <ContentHeader />
      <MarkdownEditor />
    </div>
  )
}
