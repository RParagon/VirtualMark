import { useState, useEffect } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'
import { CaseProvider } from '../contexts/CaseContext'
import { useAuth } from '../contexts/AuthContext'

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setIsAuthenticated(!!user)
  }, [user])

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success)
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <CaseProvider>
          <AdminDashboard />
        </CaseProvider>
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  )
}

export default AdminPage