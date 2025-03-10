import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCases } from '../../contexts/CaseContext'
import { Editor } from '../../lib/tinymce'
import { supabase } from '../../lib/supabase'
import { defaultEditorConfig } from '../../lib/tinymce'

interface CaseData {
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
  duration: string
  image_url: string
  featured: boolean
  tools: string[]
  metrics: Array<{ value: string; label: string }>
  status: 'draft' | 'published'
}

const CaseAdmin = () => {
  const { cases, refreshCases } = useCases()
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localCases, setLocalCases] = useState<CaseData[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0
  })

  useEffect(() => {
    const filteredCases = cases.filter(c => c.status === 'published' || c.status === 'draft')
    setLocalCases(filteredCases)
    setDashboardStats({
      total: filteredCases.length,
      published: filteredCases.filter(c => c.status === 'published').length,
      draft: filteredCases.filter(c => c.status === 'draft').length,
      featured: filteredCases.filter(c => c.featured).length
    })
  }, [cases])

  const industries = ['tecnologia', 'saúde', 'finanças', 'varejo', 'educação', 'outros']
  const clientSizes = ['pequena', 'média', 'grande', 'corporação']

  const handleCreateCase = () => {
    const newCase: CaseData = {
      id: '',
      title: '',
      slug: '',
      description: '',
      challenge: '',
      solution: '',
      results: '',
      client_name: '',
      client_industry: industries[0],
      client_size: clientSizes[0],
      duration: '',
      image_url: '',
      featured: false,
      tools: [],
      metrics: [],
      status: 'draft'
    }
    setSelectedCase(newCase)
    setIsEditing(true)
  }

  const validateCase = (caseData: CaseData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (!caseData.title.trim()) errors.push('Title is required')
    if (!caseData.slug.trim()) errors.push('Slug is required')
    if (!caseData.description.trim()) errors.push('Description is required')
    if (!caseData.challenge.trim()) errors.push('Challenge is required')
    if (!caseData.solution.trim()) errors.push('Solution is required')
    if (!caseData.results.trim()) errors.push('Results is required')
    if (!caseData.client_name.trim()) errors.push('Client name is required')
    if (!caseData.duration.trim()) errors.push('Duration is required')
    if (!caseData.image_url.trim()) errors.push('Image URL is required')
    return { isValid: errors.length === 0, errors }
  }

  const handleSaveCase = async (caseData: CaseData) => {
    const validation = validateCase(caseData)
    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'))
      return
    }

    const formattedCase = {
      ...caseData,
      slug: caseData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tools: caseData.tools || [],
      metrics: caseData.metrics || [],
      status: caseData.status || 'draft'
    }

    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Authentication required. Please log in again.')
      }

      const { error } = await supabase
        .from('cases')
        .upsert(
          [
            {
              ...formattedCase,
              id: formattedCase.id || undefined,
              created_at: undefined
            }
          ],
          { defaultToNull: false }
        )

      if (error) {
        if (error.code === '403') {
          throw new Error('You do not have permission to perform this action.')
        }
        throw error
      }

      await refreshCases()
      setSelectedCase(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving case:', error)
      alert(error instanceof Error ? error.message : 'An error occurred while saving the case. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCase = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Authentication required. Please log in again.')
      }
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id)
      if (error) {
        if (error.code === '403') {
          throw new Error('You do not have permission to delete this case.')
        }
        throw error
      }
      await refreshCases()
    } catch (error) {
      console.error('Error deleting case:', error)
      alert(error instanceof Error ? error.message : 'An error occurred while deleting the case. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (caseData: CaseData) => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Authentication required. Please log in again.')
      }
      const newStatus = caseData.status === 'draft' ? 'published' : 'draft'
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus })
        .eq('id', caseData.id)
      if (error) {
        if (error.code === '403') {
          throw new Error('You do not have permission to update this case.')
        }
        throw error
      }
      await refreshCases()
    } catch (error) {
      console.error('Error updating case status:', error)
      alert(error instanceof Error ? error.message : 'An error occurred while updating the case status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-custom py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Cases</h3>
            <p className="text-2xl font-bold">{dashboardStats.total}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm">Published</h3>
            <p className="text-2xl font-bold text-green-500">{dashboardStats.published}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm">Drafts</h3>
            <p className="text-2xl font-bold text-yellow-500">{dashboardStats.draft}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm">Featured</h3>
            <p className="text-2xl font-bold text-primary-500">{dashboardStats.featured}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Gerenciar
            <span className="text-gradient"> Cases</span>
          </h1>
          <button
            onClick={handleCreateCase}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <PlusIcon className="w-5 h-5" />
            Novo Case
          </button>
        </div>

        {/* Modal – utiliza a mesma estrutura visual do BlogAdmin */}
        {isEditing && selectedCase && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen py-8 px-4 sm:p-6">
              <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Cabeçalho do Modal */}
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCase.id ? 'Editar Case' : 'Novo Case'}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCase(null)
                      setIsEditing(false)
                    }}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Conteúdo do Formulário */}
                <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveCase(selectedCase)
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-6">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Informações Básicas</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                              <input
                                type="text"
                                value={selectedCase.title}
                                onChange={(e) => setSelectedCase({ ...selectedCase, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                              <input
                                type="text"
                                value={selectedCase.slug}
                                onChange={(e) => setSelectedCase({ ...selectedCase, slug: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                              <textarea
                                value={selectedCase.description}
                                onChange={(e) => setSelectedCase({ ...selectedCase, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">URL da Imagem</label>
                              <input
                                type="text"
                                value={selectedCase.image_url}
                                onChange={(e) => setSelectedCase({ ...selectedCase, image_url: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column - Client Info and Publication */}
                      <div className="space-y-6">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Informações do Cliente</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Cliente</label>
                              <input
                                type="text"
                                value={selectedCase.client_name}
                                onChange={(e) => setSelectedCase({ ...selectedCase, client_name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Indústria</label>
                              <select
                                value={selectedCase.client_industry}
                                onChange={(e) => setSelectedCase({ ...selectedCase, client_industry: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                              >
                                {industries.map((industry) => (
                                  <option key={industry} value={industry}>{industry}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Porte</label>
                              <select
                                value={selectedCase.client_size}
                                onChange={(e) => setSelectedCase({ ...selectedCase, client_size: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                              >
                                {clientSizes.map((size) => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Duração</label>
                              <input
                                type="text"
                                value={selectedCase.duration}
                                onChange={(e) => setSelectedCase({ ...selectedCase, duration: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Opções de Publicação</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                              <select
                                value={selectedCase.status}
                                onChange={(e) => setSelectedCase({ ...selectedCase, status: e.target.value as 'draft' | 'published' })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedCase.featured}
                                onChange={(e) => setSelectedCase({ ...selectedCase, featured: e.target.checked })}
                                className="w-5 h-5 text-primary-600 border-gray-700 rounded bg-gray-900/50 focus:ring-primary-500"
                                id="featured-case"
                              />
                              <label htmlFor="featured-case" className="text-sm text-gray-300 select-none cursor-pointer">
                                Case em Destaque
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Seção de Métricas */}
                    <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Métricas</h4>
                      <div className="space-y-4">
                        {selectedCase.metrics.map((metric, index) => (
                          <div key={index} className="flex gap-4 items-end">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-300 mb-2">Valor</label>
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => {
                                  const newMetrics = [...selectedCase.metrics]
                                  newMetrics[index] = { ...metric, value: e.target.value }
                                  setSelectedCase({ ...selectedCase, metrics: newMetrics })
                                }}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-300 mb-2">Rótulo</label>
                              <input
                                type="text"
                                value={metric.label}
                                onChange={(e) => {
                                  const newMetrics = [...selectedCase.metrics]
                                  newMetrics[index] = { ...metric, label: e.target.value }
                                  setSelectedCase({ ...selectedCase, metrics: newMetrics })
                                }}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newMetrics = selectedCase.metrics.filter((_, i) => i !== index)
                                setSelectedCase({ ...selectedCase, metrics: newMetrics })
                              }}
                              className="px-3 py-2.5 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCase({
                              ...selectedCase,
                              metrics: [...selectedCase.metrics, { value: '', label: '' }]
                            })
                          }}
                          className="w-full px-4 py-2.5 border border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-primary-500 transition-colors"
                        >
                          Adicionar Métrica
                        </button>
                      </div>
                    </div>
                    
                    {/* Seção de Detalhes com Rich Text Editors */}
                    <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Detalhes do Case</h4>
                      <div className="space-y-8">
                        <div className="editor-container">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Desafio</label>
                          <div className="relative">
                            <Editor
                              value={selectedCase.challenge}
                              onChange={(content: string) => setSelectedCase({ ...selectedCase, challenge: content })}
                              modules={defaultEditorConfig.modules}
                              formats={defaultEditorConfig.formats}
                              theme={defaultEditorConfig.theme}
                              style={defaultEditorConfig.style}
                            />
                          </div>
                        </div>
                        
                        <div className="editor-container">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Solução</label>
                          <div className="relative">
                            <Editor
                              value={selectedCase.solution}
                              onChange={(content: string) => setSelectedCase({ ...selectedCase, solution: content })}
                              modules={defaultEditorConfig.modules}
                              formats={defaultEditorConfig.formats}
                              theme={defaultEditorConfig.theme}
                              style={defaultEditorConfig.style}
                            />
                          </div>
                        </div>
                        
                        <div className="editor-container">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Resultados</label>
                          <div className="relative">
                            <Editor
                              value={selectedCase.results}
                              onChange={(content: string) => setSelectedCase({ ...selectedCase, results: content })}
                              modules={defaultEditorConfig.modules}
                              formats={defaultEditorConfig.formats}
                              theme={defaultEditorConfig.theme}
                              style={defaultEditorConfig.style}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações do Formulário */}
                    <div className="mt-8 flex items-center justify-end space-x-4 sticky bottom-0 bg-gray-900 py-4 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCase(null)
                          setIsEditing(false)
                        }}
                        className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Salvando...' : 'Salvar Case'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Cases */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Destaque</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {localCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{caseItem.title}</div>
                      <div className="text-sm text-gray-400">{caseItem.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{caseItem.client_name}</div>
                      <div className="text-sm text-gray-400">{caseItem.client_industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(caseItem)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          caseItem.status === 'published'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}
                      >
                        {caseItem.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          caseItem.featured ? 'bg-primary-500/10 text-primary-500' : 'bg-gray-700/50 text-gray-400'
                        }`}
                      >
                        {caseItem.featured ? 'Featured' : 'Not Featured'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCase(caseItem)
                          setIsEditing(true)
                        }}
                        className="text-primary-500 hover:text-primary-400 mr-4"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCase(caseItem.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseAdmin
