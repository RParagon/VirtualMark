import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

type QuizStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'

type QuizAnswer = {
  questionId?: string
  text?: string
  weights?: Record<string, number>
}

type QuizLead = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  icp: string
  icp_name: string
  branch: 'A' | 'B' | 'C' | null
  adherence: number | null
  scores: Record<string, number> | null
  answers: QuizAnswer[] | null
  open_answer: string | null
  vertical: 'imobiliaria' | 'ecommerce' | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  referrer: string | null
  landing_page: string | null
  status: QuizStatus
  assigned_to: string | null
  notes: string | null
  contacted_at: string | null
}

// Roteamento sugerido por ICP (referência do quiz_leads.sql)
const SUGGESTED_CLOSER: Record<string, string> = {
  icp1: 'José',
  icp2: 'Vitor',
  icp3: 'Yan',
  icp4: 'Yan',
  icp5: 'José',
  icp6: 'Rafael/José'
}

const BRANCH_LABEL: Record<string, string> = {
  A: 'Inicial',
  B: 'Parcial',
  C: 'Avançado'
}

const VERTICAL_LABEL: Record<string, string> = {
  imobiliaria: 'Imobiliária',
  ecommerce: 'Ecommerce'
}

const QuizLeadsAdmin = () => {
  const [leads, setLeads] = useState<QuizLead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<QuizLead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [icpFilter, setIcpFilter] = useState<string>('all')
  const [verticalFilter, setVerticalFilter] = useState<string>('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<QuizLead | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0
  })

  // Fetch quiz leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('quiz_leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        const rows = (data || []) as QuizLead[]
        setLeads(rows)

        setDashboardStats({
          total: rows.length,
          new: rows.filter((l) => l.status === 'new').length,
          contacted: rows.filter((l) => l.status === 'contacted' || l.status === 'qualified').length,
          converted: rows.filter((l) => l.status === 'converted').length
        })
      } catch (error) {
        console.error('Error fetching quiz leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

    const subscription = supabase
      .channel('quiz-leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_leads' }, fetchLeads)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Filter
  useEffect(() => {
    let result = [...leads]

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter)
    }
    if (icpFilter !== 'all') {
      result = result.filter((l) => l.icp === icpFilter)
    }
    if (verticalFilter !== 'all') {
      result = result.filter((l) => (l.vertical || 'imobiliaria') === verticalFilter)
    }
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(t) ||
          l.email.toLowerCase().includes(t) ||
          l.phone.toLowerCase().includes(t) ||
          (l.icp_name && l.icp_name.toLowerCase().includes(t)) ||
          (l.open_answer && l.open_answer.toLowerCase().includes(t))
      )
    }

    setFilteredLeads(result)
  }, [leads, searchTerm, statusFilter, icpFilter, verticalFilter])

  const updateLeadStatus = async (id: string, status: QuizStatus) => {
    try {
      const updates = {
        status,
        ...(status === 'contacted' ? { contacted_at: new Date().toISOString() } : {})
      }
      const { error } = await supabase.from('quiz_leads').update(updates).eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Error updating quiz lead status:', error)
    }
  }

  const saveLeadEdits = async (id: string, notes: string, assignedTo: string) => {
    try {
      const { error } = await supabase
        .from('quiz_leads')
        .update({ notes, assigned_to: assignedTo || null })
        .eq('id', id)
      if (error) throw error
      setIsEditModalOpen(false)
      setSelectedLead(null)
    } catch (error) {
      console.error('Error updating quiz lead:', error)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Nome', 'Email', 'Telefone', 'Vertical', 'ICP', 'Perfil', 'Aderência', 'Maturidade',
      'Closer', 'Status', 'Dor relatada', 'Origem (utm_source)', 'Campanha', 'Data', 'Notas'
    ]
    const csvData = filteredLeads.map((l) => [
      l.name,
      l.email,
      l.phone,
      VERTICAL_LABEL[l.vertical || 'imobiliaria'] || l.vertical || '',
      l.icp,
      l.icp_name,
      l.adherence != null ? `${l.adherence}%` : '',
      l.branch ? BRANCH_LABEL[l.branch] : '',
      l.assigned_to || SUGGESTED_CLOSER[l.icp] || '',
      l.status,
      l.open_answer || '',
      l.utm_source || '',
      l.utm_campaign || '',
      new Date(l.created_at).toLocaleDateString('pt-BR'),
      l.notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `quiz_leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const StatusBadge = ({ status }: { status: QuizStatus }) => {
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

  const AdherenceBar = ({ value }: { value: number | null }) => {
    if (value == null) return <span className="text-gray-500 text-sm">—</span>
    const tone = value >= 85 ? 'bg-green-500' : value >= 72 ? 'bg-yellow-500' : 'bg-blue-500'
    return (
      <div className="flex items-center gap-2 min-w-[110px]">
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${tone} rounded-full`} style={{ width: `${value}%` }} />
        </div>
        <span className="text-xs text-gray-300 tabular-nums w-9 text-right">{value}%</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm">Total do Quiz</h3>
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

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-3xl font-bold">
          Leads do
          <span className="text-gradient"> Quiz</span>
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Buscar (nome, dor, ICP)..."
            />
          </div>

          <select
            value={verticalFilter}
            onChange={(e) => setVerticalFilter(e.target.value)}
            className="block w-full sm:w-auto px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todos os verticais</option>
            <option value="imobiliaria">Imobiliária</option>
            <option value="ecommerce">Ecommerce</option>
          </select>

          <select
            value={icpFilter}
            onChange={(e) => setIcpFilter(e.target.value)}
            className="block w-full sm:w-auto px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todos os ICPs</option>
            <option value="icp1">ICP 1</option>
            <option value="icp2">ICP 2</option>
            <option value="icp3">ICP 3</option>
            <option value="icp4">ICP 4</option>
            <option value="icp5">ICP 5</option>
            <option value="icp6">ICP 6</option>
          </select>

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

          <button
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors w-full sm:w-auto"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center p-8 text-gray-400">
              {searchTerm || statusFilter !== 'all' || icpFilter !== 'all' || verticalFilter !== 'all'
                ? 'Nenhum lead encontrado com os filtros aplicados.'
                : 'Nenhum lead do quiz ainda.'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Perfil / ICP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aderência</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Closer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLeads.map((lead) => {
                  const isOpen = expandedRow === lead.id
                  const closer = lead.assigned_to || SUGGESTED_CLOSER[lead.icp]
                  return (
                    <Fragment key={lead.id}>
                      <tr className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setExpandedRow(isOpen ? null : lead.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Ver detalhes"
                          >
                            {isOpen ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{lead.name}</div>
                          <div className="text-xs text-gray-400">{lead.email}</div>
                          <div className="text-xs text-gray-400">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-white">{lead.icp_name}</div>
                          <div className="text-xs text-gray-400">
                            <span className="uppercase">{lead.icp}</span>
                            {lead.branch && <span className="ml-1">· {BRANCH_LABEL[lead.branch]}</span>}
                            <span className="ml-1">· {VERTICAL_LABEL[lead.vertical || 'imobiliaria']}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <AdherenceBar value={lead.adherence} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {closer || '—'}
                          {!lead.assigned_to && closer && (
                            <span className="block text-[10px] text-gray-500">sugerido</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
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
                              <div className={`absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 ${openStatusDropdown === lead.id ? 'block' : 'hidden'} overflow-hidden`}>
                                <div className="absolute right-4 -top-2 w-3 h-3 bg-gray-900 border-t border-l border-gray-800 transform rotate-45 z-10"></div>
                                <div className="py-1">
                                  {([
                                    ['new', ClockIcon, 'text-blue-500', 'Novo'],
                                    ['contacted', UserCircleIcon, 'text-yellow-500', 'Contatado'],
                                    ['qualified', ChatBubbleLeftRightIcon, 'text-purple-500', 'Qualificado'],
                                    ['converted', CheckCircleIcon, 'text-green-500', 'Convertido'],
                                    ['closed', XCircleIcon, 'text-red-500', 'Fechado']
                                  ] as const).map(([value, Icon, color, label]) => (
                                    <button
                                      key={value}
                                      onClick={() => {
                                        updateLeadStatus(lead.id, value)
                                        setOpenStatusDropdown(null)
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                                    >
                                      <span className="flex items-center">
                                        <Icon className={`h-4 w-4 mr-2 ${color}`} />
                                        {label}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedLead(lead)
                                setIsEditModalOpen(true)
                              }}
                              className="p-2 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors flex items-center justify-center"
                              title="Editar notas / closer"
                            >
                              <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {isOpen && (
                          <tr className="bg-gray-900/70">
                            <td colSpan={8} className="px-6 py-5">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-5"
                              >
                                {/* Dor relatada */}
                                <div className="lg:col-span-3 bg-primary-500/5 border border-primary-500/20 rounded-xl p-4">
                                  <p className="text-xs uppercase tracking-wider text-primary-400 mb-1">Dor relatada (script do closer)</p>
                                  <p className="text-white text-sm whitespace-pre-wrap">
                                    {lead.open_answer || <span className="text-gray-500">— não respondeu —</span>}
                                  </p>
                                </div>

                                {/* Scores por ICP */}
                                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Scores por ICP</p>
                                  {lead.scores && Object.keys(lead.scores).length > 0 ? (
                                    <div className="space-y-2">
                                      {Object.entries(lead.scores)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([key, val]) => {
                                          const max = Math.max(...Object.values(lead.scores || { x: 1 }))
                                          const pct = max > 0 ? (val / max) * 100 : 0
                                          const isWinner = key === lead.icp
                                          return (
                                            <div key={key} className="flex items-center gap-2">
                                              <span className={`text-xs w-12 ${isWinner ? 'text-primary-400 font-semibold' : 'text-gray-400'}`}>{key}</span>
                                              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${isWinner ? 'bg-primary-500' : 'bg-gray-500'}`} style={{ width: `${pct}%` }} />
                                              </div>
                                              <span className="text-xs text-gray-300 tabular-nums w-6 text-right">{val}</span>
                                            </div>
                                          )
                                        })}
                                    </div>
                                  ) : (
                                    <p className="text-gray-500 text-sm">—</p>
                                  )}
                                </div>

                                {/* Trilha de respostas */}
                                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Trilha de respostas</p>
                                  {lead.answers && lead.answers.length > 0 ? (
                                    <ol className="space-y-2 list-decimal list-inside">
                                      {lead.answers.map((a, i) => (
                                        <li key={i} className="text-sm text-gray-300">
                                          {a.text || <span className="text-gray-500">—</span>}
                                        </li>
                                      ))}
                                    </ol>
                                  ) : (
                                    <p className="text-gray-500 text-sm">—</p>
                                  )}
                                </div>

                                {/* Atribuição */}
                                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Atribuição</p>
                                  <dl className="space-y-1.5 text-sm">
                                    {[
                                      ['Origem', lead.utm_source],
                                      ['Mídia', lead.utm_medium],
                                      ['Campanha', lead.utm_campaign],
                                      ['Termo', lead.utm_term],
                                      ['Conteúdo', lead.utm_content],
                                      ['Referrer', lead.referrer],
                                      ['Landing', lead.landing_page]
                                    ].map(([label, val]) => (
                                      <div key={label as string} className="flex justify-between gap-3">
                                        <dt className="text-gray-400">{label}</dt>
                                        <dd className="text-gray-200 text-right truncate max-w-[60%]" title={(val as string) || ''}>
                                          {val || '—'}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                </div>

                                {lead.notes && (
                                  <div className="lg:col-span-3 bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Notas internas</p>
                                    <p className="text-gray-200 text-sm whitespace-pre-wrap">{lead.notes}</p>
                                  </div>
                                )}
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 w-full">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full max-w-md px-4 sm:px-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full shadow-2xl relative overflow-hidden"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">Editar — {selectedLead.name}</h3>

                <div className="mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Perfil:</span>
                    <p className="text-white">{selectedLead.icp_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Aderência:</span>
                    <p className="text-white">{selectedLead.adherence != null ? `${selectedLead.adherence}%` : '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedLead.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Telefone:</span>
                    <p className="text-white">{selectedLead.phone}</p>
                  </div>
                </div>

                <div className="mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-300 mb-2">
                    Closer responsável
                  </label>
                  <input
                    id="assigned_to"
                    type="text"
                    className="block w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder={SUGGESTED_CLOSER[selectedLead.icp] ? `Sugerido: ${SUGGESTED_CLOSER[selectedLead.icp]}` : 'Nome do closer'}
                    defaultValue={selectedLead.assigned_to || ''}
                  />
                </div>

                <div className="mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <label htmlFor="quiz_notes" className="block text-sm font-medium text-gray-300 mb-2">
                    Notas
                  </label>
                  <textarea
                    id="quiz_notes"
                    rows={5}
                    className="block w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Adicione notas sobre este lead..."
                    defaultValue={selectedLead.notes || ''}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false)
                      setSelectedLead(null)
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const notesEl = document.getElementById('quiz_notes') as HTMLTextAreaElement
                      const closerEl = document.getElementById('assigned_to') as HTMLInputElement
                      saveLeadEdits(selectedLead.id, notesEl.value, closerEl.value)
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
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

export default QuizLeadsAdmin
