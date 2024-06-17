import { ThemeProvider } from './components/theme-provider'
import Home from './components/home'
import { useEffect, useState } from 'react'

function App() {
  const [vaultPath, setPath] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  async function getVaultPath() {
    const response = await window.context.getVaultPath()

    setPath(response)
  }

  async function setVaultPath() {
    await window.context.setVaultPath('')
    getVaultPath()
  }

  useEffect(() => {
    getVaultPath()
  }, [vaultPath])

  console.log(hasChanges)

  console.log('vaultPath', vaultPath)
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {vaultPath ? (
        <div className="h-[100vh]">
          <Home />
        </div>
      ) : (
        <div className="flex place-content-center h-[100vh] w-full">
          <button onClick={setVaultPath}>set vault path</button>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
