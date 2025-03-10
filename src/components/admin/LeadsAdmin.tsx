import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

type Lead = {
  id: string
  created_at: string
  name: string
  phone: string
  email: string
  instagram: string | null
  business_category: string
  monthly_revenue: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  notes: string | null
  contacted_at: string | null
}

const LeadsAdmin = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'ascending' | 'descending' }>({ 
    key: 'created_at', 
    direction: 'descending' 
  })
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0
  })

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setLeads(data || [])
        setFilteredLeads(data || [])
        
        // Calculate dashboard stats
        if (data) {
          setDashboardStats({
            total: data.length,
            new: data.filter(lead => lead.status === 'new').length,
            contacted: data.filter(lead => lead.status === 'contacted' || lead.status === 'qualified').length,
            converted: data.filter(lead => lead.status === 'converted').length
          })
        }
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

    // Set up real-time subscription
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchLeads)
      .subscribe()

    return () => {
      leadsSubscription.unsubscribe()
    }
  }, [])

  // Filter and sort leads
  useEffect(() => {
    let result = [...leads]

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        lead =>
          lead.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
          (lead.instagram && lead.instagram.toLowerCase().includes(lowerCaseSearchTerm))
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = sortConfig?.key ? a[sortConfig.key] : null;
      const bValue = sortConfig?.key ? b[sortConfig.key] : null;
      
      if (aValue === null || bValue === null) return 0;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    })

    setFilteredLeads(result)
  }, [leads, searchTerm, statusFilter, sortConfig])

  // Handle sorting
  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Instagram', 'Categoria', 'Faturamento', 'Status', 'Data de Criação', 'Data de Contato', 'Notas']
    
    const csvData = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.instagram || '',
      lead.business_category,
      lead.monthly_revenue,
      lead.status,
      new Date(lead.created_at).toLocaleDateString('pt-BR'),
      lead.contacted_at ? new Date(lead.contacted_at).toLocaleDateString('pt-BR') : '',
      lead.notes || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update lead status
  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      const updates = {
        status,
        ...(status === 'contacted' ? { contacted_at: new Date().toISOString() } : {})
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  // Update lead notes
  const updateLeadNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', id)

      if (error) throw error
      
      // Close modal and reset selected lead
      setIsEditModalOpen(false)
      setSelectedLead(null)
    } catch (error) {
      console.error('Error updating lead notes:', error)
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: Lead['status'] }) => {
    const statusConfig = {
      new: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: ClockIcon, text: 'Novo' },
      contacted: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: UserCircleIcon, text: 'Contatado' },
      qualified: { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: ChatBubbleLeftRightIcon, text: 'Qualificado' },
      converted: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircleIcon, text: 'Convertido' },
      closed: { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircleIcon, text: 'Fechado' }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="-ml-0.5 mr-1.5 h-3 w-3" />
        {config.text}
      </span>
    )
  }

  // Format business category
  const formatBusinessCategory = (category: string) => {
    const categories: Record<string, string> = {
      'retail': 'Varejo presencial',
      'infoproducts': 'Infoprodutos',
      'services': 'Prestador de serviços',
      'ecommerce': 'Ecommerce'
    }
    return categories[category] || category
  }

  // Format monthly revenue
  const formatMonthlyRevenue = (revenue: string) => {
    const revenues: Record<string, string> = {
      'up_to_100k': 'Até R$100.000,00',
      '100k_to_300k': 'De R$100.000,00 a R$300.000,00',
      '300k_to_500k': 'De R$300.000,00 a R$500.000,00',
      'above_500k': 'Acima de R$500.000,00'
    }
    return revenues[revenue] || revenue
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm">Total de Leads</h3>
          <p className="text-2xl font-bold">{dashboardStats.total}</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm">Novos</h3>
          <p className="text-2xl font-bold text-blue-500">{dashboardStats.new}</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm">Contatados</h3>
          <p className="text-2xl font-bold text-yellow-500">{dashboardStats.contacted}</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm">Convertidos</h3>
          <p className="text-2xl font-bold text-green-500">{dashboardStats.converted}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold">
          Gerenciar
          <span className="text-gradient"> Leads</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Buscar leads..."
            />
          </div>
          
          {/* Filter */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Todos os status</option>
              <option value="new">Novos</option>
              <option value="contacted">Contatados</option>
              <option value="qualified">Qualificados</option>
              <option value="converted">Convertidos</option>
              <option value="closed">Fechados</option>
            </select>
          </div>
          
          {/* Export */}
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors w-full sm:w-auto"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center p-8 text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum lead encontrado com os filtros aplicados.'
                : 'Nenhum lead cadastrado ainda.'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('name')}
                  >
                    Nome
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('email')}
                  >
                    Email
                    {sortConfig.key === 'email' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('phone')}
                  >
                    Telefone
                    {sortConfig.key === 'phone' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('business_category')}
                  >
                    Categoria
                    {sortConfig.key === 'business_category' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('status')}
                  >
                    Status
                    {sortConfig.key === 'status' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('created_at')}
                  >
                    Data
                    {sortConfig.key === 'created_at' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatBusinessCategory(lead.business_category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <div className="flex justify-end space-x-3">
                        <div className="relative">
                          <button
                            className="p-2 text-xs bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors flex items-center justify-center"
                            title="Alterar Status"
                            onClick={() => setOpenStatusDropdown(openStatusDropdown === lead.id ? null : lead.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className={`absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 ${openStatusDropdown === lead.id ? 'block' : 'hidden'} overflow-hidden transform-gpu`}>
                            {/* Add a small triangle indicator */}
                            <div className="absolute right-4 -top-2 w-3 h-3 bg-gray-900 border-t border-l border-gray-800 transform rotate-45 z-10"></div>
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  updateLeadStatus(lead.id, 'new')
                                  setOpenStatusDropdown(null)
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                              >
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                                  Novo
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  updateLeadStatus(lead.id, 'contacted')
                                  setOpenStatusDropdown(null)
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                              >
                                <span className="flex items-center">
                                  <UserCircleIcon className="h-4 w-4 mr-2 text-yellow-500" />
                                  Contatado
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  updateLeadStatus(lead.id, 'qualified')
                                  setOpenStatusDropdown(null)
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                              >
                                <span className="flex items-center">
                                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-purple-500" />
                                  Qualificado
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  updateLeadStatus(lead.id, 'converted')
                                  setOpenStatusDropdown(null)
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                              >
                                <span className="flex items-center">
                                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                                  Convertido
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  updateLeadStatus(lead.id, 'closed')
                                  setOpenStatusDropdown(null)
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                              >
                                <span className="flex items-center">
                                  <XCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                                  Fechado
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedLead(lead)
                            setIsEditModalOpen(true)
                          }}
                          className="p-2 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors flex items-center justify-center"
                          title="Adicionar Notas"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Notes Modal */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 w-full">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full max-w-md px-4 sm:px-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full shadow-2xl relative overflow-hidden"
              >
            <h3 className="text-2xl font-bold mb-4 text-white">Editar Notas - {selectedLead.name}</h3>
            
            <div className="mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Informações do Lead:</p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
                <div>
                  <span className="text-gray-400">Telefone:</span>
                  <p className="text-white">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="text-gray-400">Instagram:</span>
                  <p className="text-white">{selectedLead.instagram || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Categoria:</span>
                  <p className="text-white">{formatBusinessCategory(selectedLead.business_category)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Faturamento:</span>
                  <p className="text-white">{formatMonthlyRevenue(selectedLead.monthly_revenue)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-white"><StatusBadge status={selectedLead.status} /></p>
                </div>
              </div>
            </div>
            
            <div className="mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Notas
              </label>
              <textarea
                id="notes"
                rows={5}
                className="block w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                placeholder="Adicione notas sobre este lead..."
                defaultValue={selectedLead.notes || ''}
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedLead(null)
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const notesElement = document.getElementById('notes') as HTMLTextAreaElement
                  updateLeadNotes(selectedLead.id, notesElement.value)
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Salvar
              </button>
            </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsAdmin