import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import AdminLogin from '../admin/AdminLogin'
import AdminDashboard from '../admin/AdminDashboard'
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
      <Helmet>
        <title>Admin | VirtualMark</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
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