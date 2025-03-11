import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { GoogleTag, GoogleTagFormData } from '../../types/GoogleTags'
import { PencilIcon, TrashIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

const commonElements = [
  {
    category: 'Botões',
    elements: [
      'button',
      '.btn',
      '.button',
      'input[type="submit"]',
      'input[type="button"]',
      '.submit-button',
      '.cta-button'
    ]
  },
  {
    category: 'Formulários',
    elements: [
      'form',
      'input[type="text"]',
      'input[type="email"]',
      'input[type="password"]',
      'textarea',
      'select',
      '.form-control',
      '.input-field'
    ]
  },
  {
    category: 'Elementos Interativos',
    elements: [
      'a',
      '.link',
      '.nav-item',
      '.menu-item',
      '.dropdown',
      '.accordion',
      '.tab',
      '.modal'
    ]
  },
  {
    category: 'Seções de Conteúdo',
    elements: [
      '.header',
      '.footer',
      '.main',
      '.sidebar',
      '.content',
      '.section',
      '.container',
      '.wrapper'
    ]
  }
]

const tutorialCards = [
  {
    id: 'button-tags',
    title: 'Adicionando Tags em Botões',
    description: 'Aprenda como implementar tags de rastreamento para cliques em botões no seu site.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Click"',
      '2. Adicione elementos alvo como ".btn", "button", ou seletores específicos como ".contact-button"',
      '3. Cole seu código de Tag do Google no campo Código da Tag',
      '4. Certifique-se de definir a tag como Ativa',
      '5. Para melhores resultados, use seletores específicos para rastrear apenas os botões desejados'
    ],
    example: '.contact-submit-btn, .newsletter-signup-btn',
    triggerEvent: 'click'
  },
  {
    id: 'contact-form-tags',
    title: 'Tags para Formulários de Contato',
    description: 'Rastreie envios de formulários para medir taxas de conversão.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Click"',
      '2. Direcione o botão de envio do formulário com seletores como "form .submit-button" ou "#contact-form input[type=\'submit\']"',
      '3. Alternativamente, direcione o próprio formulário com "form" ou "#contact-form"',
      '4. Cole seu código de rastreamento de conversão no campo Código da Tag',
      '5. Teste sua implementação enviando o formulário e verificando seu painel de análise'
    ],
    example: '#contact-form, .contact-form input[type="submit"]',
    triggerEvent: 'click'
  },
  {
    id: 'pageview-tags',
    title: 'Rastreamento de Visualização de Página',
    description: 'Implemente tags que disparam quando os usuários visualizam páginas específicas.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Não são necessários elementos alvo, pois isso será acionado quando a página carregar',
      '3. Cole seu código de visualização de página do Google Analytics ou Tag Manager',
      '4. Isso é ideal para rastrear visitas à página, duração da sessão e fluxo de usuários',
      '5. Considere usar tags diferentes para diferentes categorias de páginas (ex: páginas de produtos, posts de blog)'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página',
    triggerEvent: 'pageview'
  },
  {
    id: 'pageview-home',
    title: 'Rastreamento da Página Inicial',
    description: 'Configure tags específicas para rastrear visualizações da página inicial.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Defina o nome da tag como "Home Page View" para fácil identificação',
      '3. Cole seu código de rastreamento do Google Analytics ou Tag Manager',
      '4. Adicione uma descrição como "Rastreamento de visualizações da página inicial"',
      '5. Ative a tag para começar a coletar dados'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página inicial',
    triggerEvent: 'pageview'
  },
  {
    id: 'pageview-services',
    title: 'Rastreamento da Página de Serviços',
    description: 'Implemente tags para monitorar visualizações da página de serviços.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Defina o nome da tag como "Services Page View" para fácil identificação',
      '3. Cole seu código de rastreamento do Google Analytics ou Tag Manager',
      '4. Adicione uma descrição como "Rastreamento de visualizações da página de serviços"',
      '5. Considere adicionar eventos personalizados para rastrear interações com serviços específicos'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página de serviços',
    triggerEvent: 'pageview'
  },
  {
    id: 'pageview-cases',
    title: 'Rastreamento da Página de Cases',
    description: 'Configure tags para monitorar visualizações da página de cases.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Defina o nome da tag como "Cases Page View" para fácil identificação',
      '3. Cole seu código de rastreamento do Google Analytics ou Tag Manager',
      '4. Adicione uma descrição como "Rastreamento de visualizações da página de cases"',
      '5. Considere adicionar eventos adicionais para rastrear cliques em cases específicos'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página de cases',
    triggerEvent: 'pageview'
  },
  {
    id: 'pageview-case-detail',
    title: 'Rastreamento de Case Individual',
    description: 'Implemente tags para rastrear visualizações de páginas de cases individuais.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Defina o nome da tag como "Case Detail Page View" para fácil identificação',
      '3. Cole seu código de rastreamento do Google Analytics ou Tag Manager',
      '4. Adicione uma descrição como "Rastreamento de visualizações de cases individuais"',
      '5. Para análises avançadas, considere usar variáveis dinâmicas para capturar o ID ou título do case'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página de case individual',
    triggerEvent: 'pageview'
  },
  {
    id: 'pageview-blogs',
    title: 'Rastreamento da Página de Blogs',
    description: 'Configure tags para monitorar visualizações da página de blogs.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Defina o nome da tag como "Blogs Page View" para fácil identificação',
      '3. Cole seu código de rastreamento do Google Analytics ou Tag Manager',
      '4. Adicione uma descrição como "Rastreamento de visualizações da página de blogs"',
      '5. Considere adicionar eventos adicionais para rastrear interações com categorias de blog'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página de blogs',
    triggerEvent: 'pageview'
  },
  {
    id: 'pageview-blog-detail',
    title: 'Rastreamento de Blog Individual',
    description: 'Implemente tags para rastrear visualizações de posts de blog individuais.',
    content: [
      '1. Crie uma nova tag com evento de disparo definido como "Page View"',
      '2. Defina o nome da tag como "Blog Post View" para fácil identificação',
      '3. Cole seu código de rastreamento do Google Analytics ou Tag Manager',
      '4. Adicione uma descrição como "Rastreamento de visualizações de posts de blog individuais"',
      '5. Para análises avançadas, considere usar variáveis dinâmicas para capturar o ID ou título do post'
    ],
    example: 'Não são necessários elementos alvo - dispara no carregamento da página de blog individual',
    triggerEvent: 'pageview'
  }
]

const GoogleTagsAdmin = () => {
  const [tags, setTags] = useState<GoogleTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTag, setCurrentTag] = useState<GoogleTagFormData>({
    name: '',
    tag_type: 'google_ads',
    tag_code: '',
    is_active: true,
    target_elements: [],
    trigger_event: 'click'
  })
  const [showElementsList, setShowElementsList] = useState(false)
  const [targetElementInput, setTargetElementInput] = useState('')
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null)

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags()

    // Set up real-time subscription
    const tagsSubscription = supabase
      .channel('custom-google-tags-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'google_tags' }, fetchTags)
      .subscribe()

    return () => {
      tagsSubscription.unsubscribe()
    }
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('google_tags')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTags(data || [])
    } catch (error: any) {
      setError(error.message)
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setCurrentTag({ ...currentTag, [name]: checked })
    } else {
      setCurrentTag({ ...currentTag, [name]: value })
    }
  }

  const addTargetElement = () => {
    if (targetElementInput.trim() !== '' && !currentTag.target_elements.includes(targetElementInput.trim())) {
      setCurrentTag({
        ...currentTag,
        target_elements: [...currentTag.target_elements, targetElementInput.trim()]
      })
      setTargetElementInput('')
    }
  }

  const removeTargetElement = (element: string) => {
    setCurrentTag({
      ...currentTag,
      target_elements: currentTag.target_elements.filter(item => item !== element)
    })
  }

  const resetForm = () => {
    setCurrentTag({
      name: '',
      tag_type: 'google_ads',
      tag_code: '',
      is_active: true,
      target_elements: [],
      trigger_event: 'click'
    })
    setTargetElementInput('')
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (isEditing && currentTag.id) {
        // Update existing tag
        const { id, ...tagData } = currentTag as GoogleTag & GoogleTagFormData
        const { error } = await supabase
          .from('google_tags')
          .update(tagData)
          .eq('id', id)
        
        if (error) throw error
      } else {
        // Create new tag
        const { error } = await supabase
          .from('google_tags')
          .insert([currentTag])
        
        if (error) throw error
      }
      
      resetForm()
      await fetchTags()
    } catch (error: any) {
      setError(error.message)
      console.error('Error saving tag:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tag: GoogleTag) => {
    setCurrentTag(tag)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        setLoading(true)
        const { error } = await supabase
          .from('google_tags')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        await fetchTags()
      } catch (error: any) {
        setError(error.message)
        console.error('Error deleting tag:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleToggleActive = async (tag: GoogleTag) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('google_tags')
        .update({ is_active: !tag.is_active })
        .eq('id', tag.id)
      
      if (error) throw error
      await fetchTags()
    } catch (error: any) {
      setError(error.message)
      console.error('Error toggling tag status:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTutorial = (id: string) => {
    setExpandedTutorial(expandedTutorial === id ? null : id)
  }

  const applyTutorialExample = (tutorial: typeof tutorialCards[0]) => {
    // Set trigger event based on tutorial
    setCurrentTag(prev => ({
      ...prev,
      trigger_event: tutorial.triggerEvent as 'click' | 'pageview' | 'custom'
    }))

    // Add example target elements if applicable
    if (tutorial.example && tutorial.triggerEvent === 'click') {
      const examples = tutorial.example.split(',').map(ex => ex.trim())
      examples.forEach(example => {
        if (example && !currentTag.target_elements.includes(example)) {
          setCurrentTag(prev => ({
            ...prev,
            target_elements: [...prev.target_elements, example]
          }))
        }
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Tags do Google</h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tutorial Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <InformationCircleIcon className="h-5 w-5 text-primary-500" />
          Tutoriais de Implementação de Tags
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutorialCards.map((tutorial) => (
            <motion.div 
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-700">
                <h4 className="text-lg font-medium text-white">{tutorial.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{tutorial.description}</p>
              </div>
              
              <div className="p-4 flex-grow">
                {expandedTutorial === tutorial.id ? (
                  <div className="space-y-3">
                    <ul className="space-y-2 text-sm text-gray-300">
                      {tutorial.content.map((item, index) => (
                        <li key={index} className="flex">
                          <span className="text-primary-500 mr-2">{item.split('.')[0]}.</span>
                          <span>{item.substring(item.indexOf('.') + 1).trim()}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {tutorial.example && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-400">Exemplos de Elementos Alvo:</p>
                        <div className="mt-1 p-2 bg-gray-900/50 rounded border border-gray-700">
                          <code className="text-xs text-primary-400">{tutorial.example}</code>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Clique em "Ver Tutorial" para ver instruções passo a passo.</p>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700 flex justify-between">
                <button
                  onClick={() => toggleTutorial(tutorial.id)}
                  className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  {expandedTutorial === tutorial.id ? 'Ocultar Tutorial' : 'Ver Tutorial'}
                </button>
                <button
                  onClick={() => applyTutorialExample(tutorial)}
                  className="px-3 py-1.5 bg-primary-500/10 text-primary-500 text-sm rounded hover:bg-primary-500/20 transition-colors"
                >
                  Aplicar Exemplo
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tag Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          {isEditing ? 'Editar Tag' : 'Adicionar Nova Tag'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nome da Tag
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentTag.name}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="tag_type" className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Tag
              </label>
              <select
                id="tag_type"
                name="tag_type"
                value={currentTag.tag_type}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="google_ads">Google Ads</option>
                <option value="tag_manager">Tag Manager</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="trigger_event" className="block text-sm font-medium text-gray-300 mb-1">
                Evento de Disparo
              </label>
              <select
                id="trigger_event"
                name="trigger_event"
                value={currentTag.trigger_event}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="click">Clique</option>
                <option value="pageview">Visualização de Página</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            <div>
              <label htmlFor="is_active" className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={currentTag.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-700 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">Ativa</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="tag_code" className="block text-sm font-medium text-gray-300 mb-1">
              Código da Tag
            </label>
            <textarea
              id="tag_code"
              name="tag_code"
              value={currentTag.tag_code}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              placeholder="<!-- Cole seu código de tag aqui -->"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              id="description"
              name="description"
              value={currentTag.description || ''}
              onChange={handleInputChange}
              rows={2}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
              placeholder="Breve descrição do propósito desta tag"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Elementos Alvo
            </label>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={targetElementInput}
                  onChange={(e) => setTargetElementInput(e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Seletor CSS (ex: .contact-button, #submit-form)"
                />
                <button
                  type="button"
                  onClick={addTargetElement}
                  className="px-4 py-2 bg-primary-500/10 text-primary-500 rounded-lg hover:bg-primary-500/20 transition-colors"
                >
                  Adicionar
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setShowElementsList(!showElementsList)}
                className="w-full text-left px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <span>Elementos Comuns</span>
                <span className={`transform transition-transform ${showElementsList ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {showElementsList && (
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                  {commonElements.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400">{category.category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.elements.map((element) => (
                          <button
                            key={element}
                            type="button"
                            onClick={() => {
                              setTargetElementInput(element);
                              addTargetElement();
                            }}
                            className="text-left px-3 py-2 rounded bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors text-sm truncate"
                          >
                            {element}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentTag.target_elements.map((element, index) => (
                <div key={index} className="flex items-center bg-gray-700/50 rounded-lg px-3 py-1">
                  <span className="text-sm text-gray-300">{element}</span>
                  <button
                    type="button"
                    onClick={() => removeTargetElement(element)}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Tag' : 'Add Tag'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Tags List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Existing Tags</h3>
        </div>
        {loading && tags.length === 0 ? (
          <div className="p-6 text-center text-gray-400">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No tags found. Add your first tag above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{tag.name}</div>
                      {tag.description && (
                        <div className="text-xs text-gray-400 mt-1">{tag.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/10 text-blue-500">
                        {tag.tag_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                        {tag.trigger_event.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(tag)}
                        className={`inline-flex items-center px-2.5 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                          tag.is_active
                            ? 'border-green-500 text-green-500 hover:bg-green-500/10'
                            : 'border-gray-500 text-gray-500 hover:bg-gray-500/10'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          tag.is_active ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        {tag.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(tag)}
                          className="text-primary-500 hover:text-primary-400 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleTagsAdmin