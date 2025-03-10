import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        const remember = localStorage.getItem('rememberMe') === 'true'

        if (currentSession) {
          if (!remember) {
            await supabase.auth.signOut()
            setSession(null)
            setUser(null)
            localStorage.removeItem('rememberMe')
            localStorage.removeItem('userEmail')
          } else {
            setSession(currentSession)
            setUser(currentSession.user)
          }
        }
      } catch (error) {
        console.error('Error initializing authentication:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('userEmail')
      } else if (session) {
        setSession(session)
        setUser(session.user)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, rememberMe: boolean = false): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        console.error('Login error:', error)
        return { error }
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('userEmail', email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('userEmail')
        }
      }

      return { error: null }
    } catch (err) {
      console.error('Exception during login:', err)
      return { error: err as Error }
    }
  }

  const signOut = async () => {
    try {
      // Clear all auth-related state and storage first
      setSession(null)
      setUser(null)
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('userEmail')
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error during signOut:', error)
      }
    } catch (error) {
      console.error('Error executing signOut:', error)
    }
  }

  const value: AuthContextType = { session, user, loading, signIn, signOut }

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
