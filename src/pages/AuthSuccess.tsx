import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function AuthSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('token', token)
      toast.success('Login successful!')
      navigate('/', { replace: true })
    } else {
      toast.error('Login failed. No token found.')
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-instagram-blue border-t-transparent mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-instagram-blue rounded-full animate-ping" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">Security Check</p>
          <p className="text-2xl font-bold tracking-tight">Finalizing Authentication...</p>
        </div>
      </div>
    </div>
  )
}
