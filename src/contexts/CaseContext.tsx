import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Case = {
  id: string
  title: string
  slug: string
  description: string
  challenge: string
  solution: string
  results: string
  client_name: string
  client_industry: string
  client_size: string
  client_testimonial?: string
  client_role?: string
  duration: string
  image_url: string
  featured: boolean
  tools: string[]
  metrics: Array<{ value: string; label: string }>
  gallery?: string[]
  status: 'draft' | 'published'
  created_at: string
}

type CaseContextType = {
  cases: Case[]
  loading: boolean
  error: Error | null
  refreshCases: () => Promise<void>
  getCaseBySlug: (slug: string) => Case | undefined
  getFeaturedCases: () => Case[]
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCases = async () => {
    try {
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setCases(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cases'))
      setCases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const refreshCases = async () => {
    setLoading(true)
    await fetchCases()
  }

  const getCaseBySlug = (slug: string) => {
    return cases.find(c => c.slug === slug)
  }

  const getFeaturedCases = () => {
    return cases.filter(c => c.featured)
  }

  return (
    <CaseContext.Provider
      value={{
        cases,
        loading,
        error,
        refreshCases,
        getCaseBySlug,
        getFeaturedCases
      }}
    >
      {children}
    </CaseContext.Provider>
  )
}

export function useCases() {
  const context = useContext(CaseContext)
  if (context === undefined) {
    throw new Error('useCases must be used within a CaseProvider')
  }
  return context
}