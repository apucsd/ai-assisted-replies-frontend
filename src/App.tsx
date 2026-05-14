import { Outlet, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { FaHome, FaInfoCircle, FaSun, FaMoon } from 'react-icons/fa'
import { SiFiverr } from 'react-icons/si'
import { useTheme } from './context/ThemeContext'
import { Toaster } from "@/components/ui/sonner"
import './App.css'

function App() {
  const { mode, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 px-4 h-16 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <SiFiverr className="text-3xl text-instagram-pink" />
            <span className="text-instagram-blue">
              SafeMessage
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-instagram-blue transition-colors">
              <FaHome /> Home
            </Link>
            <Link to="/about" className="flex items-center gap-2 text-muted-foreground hover:text-instagram-blue transition-colors">
              <FaInfoCircle /> About
            </Link>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10"
          >
            {mode === 'dark' ? <FaSun className="text-yellow-400 h-5 w-5" /> : <FaMoon className="text-instagram-blue h-5 w-5" />}
          </Button>
        </div>
      </header>
      <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-muted-foreground text-xs border-t border-border mt-auto">
        © 2026 AI Safe Message • Built with shadcn/ui & Tailwind
      </footer>
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App
