import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BlogAdmin from './BlogAdmin'
import CaseAdmin from './CaseAdmin'
import LeadsAdmin from './LeadsAdmin'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  ChartBarIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('blog')
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/admin')
    }
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      // First call the context's signOut to clear the auth state
      await signOut()
      // Then navigate to admin page
      navigate('/admin')
    } catch (error) {
      console.error('Error signing out:', error)
      // Force navigation to admin page even if there's an error
      navigate('/admin')
    }
  }
  const [stats, setStats] = useState([
    { name: 'Total Posts', value: '0', icon: DocumentTextIcon },
    { name: 'Total Cases', value: '0', icon: PhotoIcon },
    { name: 'Newsletter Subs', value: '0', icon: ChartBarIcon },
    { name: 'Total Leads', value: '0', icon: UserGroupIcon }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total posts
        const { count: postsCount } = await supabase
          .from('posts')
          .select('id', { count: 'exact' })

        // Fetch total cases
        const { count: casesCount } = await supabase
          .from('cases')
          .select('id', { count: 'exact' })

        // Fetch newsletter subscriptions
        const { count: subsCount } = await supabase
          .from('newsletter_subscriptions')
          .select('id', { count: 'exact' })
          
        // Fetch leads count
        const { count: leadsCount } = await supabase
          .from('leads')
          .select('id', { count: 'exact' })

        setStats([
          { name: 'Total Posts', value: String(postsCount || 0), icon: DocumentTextIcon },
          { name: 'Total Cases', value: String(casesCount || 0), icon: PhotoIcon },
          { name: 'Newsletter Subs', value: String(subsCount || 0), icon: ChartBarIcon },
          { name: 'Total Leads', value: String(leadsCount || 0), icon: UserGroupIcon }
        ])
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()

    // Set up real-time subscription
    const postsSubscription = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletter_subscriptions' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchStats)
      .subscribe()

    return () => {
      postsSubscription.unsubscribe()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-custom">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="text-gray-300">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          <div className="border-b border-gray-800 px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('blog')}
                className={`px-4 py-4 font-medium border-b-2 transition-colors ${activeTab === 'blog' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-4 py-4 font-medium border-b-2 transition-colors ${activeTab === 'cases' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Cases
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-4 font-medium border-b-2 transition-colors ${activeTab === 'leads' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Leads
              </button>
            </div>
          </div>
          <div className="p-6">
            {activeTab === 'blog' ? <BlogAdmin /> : 
             activeTab === 'cases' ? <CaseAdmin /> : 
             <LeadsAdmin />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard