import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Sidebar from './components/Sidebar'
import Content from './components/Content'

export default function Home() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15} minSize={12}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle
        className="bg-white/10 hover:bg-purple-500 transition-all duration-200 ease-in-out"
        withHandle
      />
      <ResizablePanel defaultSize={85} minSize={16}>
        <Content />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
