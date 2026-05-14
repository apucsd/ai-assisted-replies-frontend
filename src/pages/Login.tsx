import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { SiFiverr, SiGoogle } from 'react-icons/si'

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/v1/auth/google'
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        <div className="space-y-4">
          <div className="inline-block p-6 rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl">
            <SiFiverr className="text-7xl" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">SafeMessage</h1>
          <p className="text-muted-foreground font-medium">Professional communication, secured by AI.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Continue with</p>
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-14 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-4 font-bold shadow-sm"
          >
            <SiGoogle className="text-xl text-red-500" />
            Login with Google
          </Button>
          <p className="text-[10px] text-muted-foreground opacity-60">
            Only Google Login is allowed for professional security.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
