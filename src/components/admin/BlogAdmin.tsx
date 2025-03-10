import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePosts } from '../../contexts/PostContext'
import { Editor } from '../../lib/tinymce'
import { defaultEditorConfig } from '../../lib/tinymce'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  imageUrl: string
  featured: boolean
  status: 'draft' | 'published'
}

const BlogAdmin = () => {
  const { posts, addPost, updatePost, deletePost } = usePosts()
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localPosts, setLocalPosts] = useState<BlogPost[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0
  })

  useEffect(() => {
    const filteredPosts = posts.filter(p => p.status === 'published' || p.status === 'draft')
    setLocalPosts(filteredPosts)
    setDashboardStats({
      total: filteredPosts.length,
      published: filteredPosts.filter(p => p.status === 'published').length,
      draft: filteredPosts.filter(p => p.status === 'draft').length,
      featured: filteredPosts.filter(p => p.featured).length
    })
  }, [posts])

  const categories = ['marketing', 'social media', 'seo', 'analytics']

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: '',
      title: '',
      excerpt: '',
      content: '',
      category: categories[0],
      author: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min',
      imageUrl: '/blog/default-post.jpg',
      featured: false,
      status: 'draft'
    }
    setSelectedPost(newPost)
    setIsEditing(true)
  }

  const validatePost = (post: BlogPost): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (!post.title.trim()) errors.push('Title is required')
    if (!post.excerpt.trim()) errors.push('Excerpt is required')
    if (!post.content.trim()) errors.push('Content is required')
    if (!post.author.trim()) errors.push('Author is required')
    if (!post.imageUrl.trim()) errors.push('Image URL is required')
    if (post.imageUrl.trim() && !post.imageUrl.match(/^(\/blog\/|https?:\/\/).+/)) {
      errors.push('Image URL must start with "/blog/" or be a valid HTTP(S) URL')
    }
    return { isValid: errors.length === 0, errors }
  }

  const handleSavePost = async (post: BlogPost) => {
    const validation = validatePost(post)
    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'))
      return
    }

    setIsLoading(true)
    let imageUrl = post.imageUrl.trim()
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/blog/')) {
      imageUrl = `/blog/${imageUrl}`
    }

    const postToSave = {
      ...post,
      imageUrl
    }

    try {
      if (post.id) {
        await updatePost(postToSave)
      } else {
        const { id, ...postWithoutId } = postToSave
        await addPost(postWithoutId)
      }
      setSelectedPost(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving post:', error)
      alert(error instanceof Error ? error.message : 'An error occurred while saving the post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    setIsLoading(true)
    try {
      await deletePost(id)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error instanceof Error ? error.message : 'An error occurred while deleting the post. Please try again.')
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
            <h3 className="text-gray-400 text-sm">Total Posts</h3>
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
            <span className="text-gradient"> Blog</span>
          </h1>
          <button
            onClick={handleCreatePost}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <PlusIcon className="w-5 h-5" />
            Novo Post
          </button>
        </div>

        {/* Modal de Criação/Edição */}
        {isEditing && selectedPost && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen py-8 px-4 sm:p-6">
              <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Cabeçalho */}
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedPost.id ? 'Editar Post' : 'Novo Post'}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedPost(null)
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
                      handleSavePost(selectedPost)
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-6">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Informações Básicas</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                              <input
                                type="text"
                                value={selectedPost.title}
                                onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Resumo</label>
                              <textarea
                                value={selectedPost.excerpt}
                                onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">URL da Imagem</label>
                              <input
                                type="text"
                                value={selectedPost.imageUrl}
                                onChange={(e) => setSelectedPost({ ...selectedPost, imageUrl: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column - Post Options */}
                      <div className="space-y-6">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Opções do Post</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                              <select
                                value={selectedPost.category}
                                onChange={(e) => setSelectedPost({ ...selectedPost, category: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                              >
                                {categories.map((category) => (
                                  <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Autor</label>
                              <input
                                type="text"
                                value={selectedPost.author}
                                onChange={(e) => setSelectedPost({ ...selectedPost, author: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
                              <input
                                type="date"
                                value={selectedPost.date}
                                onChange={(e) => setSelectedPost({ ...selectedPost, date: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Tempo de Leitura</label>
                              <input
                                type="text"
                                value={selectedPost.readTime}
                                onChange={(e) => setSelectedPost({ ...selectedPost, readTime: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                              value={selectedPost.status}
                              onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value as 'draft' | 'published' })}
                              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center space-x-3 mt-4">
                            <input
                              type="checkbox"
                              checked={selectedPost.featured}
                              onChange={(e) => setSelectedPost({ ...selectedPost, featured: e.target.checked })}
                              className="w-5 h-5 text-primary-600 border-gray-700 rounded bg-gray-900/50 focus:ring-primary-500"
                              id="featured-post"
                            />
                            <label htmlFor="featured-post" className="text-sm text-gray-300 select-none cursor-pointer">
                              Post em Destaque
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Editor de Conteúdo */}
                    <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                      <h4 className="text-lg font-semibold text-white mb-4">Conteúdo</h4>
                      <div className="min-h-[400px]">
                        <Editor
                          value={selectedPost.content}
                          onChange={(content: string) => setSelectedPost({ ...selectedPost, content })}
                          modules={defaultEditorConfig.modules}
                          formats={defaultEditorConfig.formats}
                          theme={defaultEditorConfig.theme}
                          style={{ ...defaultEditorConfig.style, minHeight: '400px' }}
                        />
                      </div>
                    </div>

                    {/* Ações do Formulário */}
                    <div className="mt-8 flex items-center justify-end space-x-4 sticky bottom-0 bg-gray-900 py-4 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPost(null)
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
                        {isLoading ? 'Salvando...' : 'Salvar Post'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Posts */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título / Resumo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {localPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{post.title}</div>
                      <div className="text-sm text-gray-400">{post.excerpt.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-500/10 text-primary-500">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'published'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPost(post)
                          setIsEditing(true)
                        }}
                        className="text-primary-500 hover:text-primary-400 mr-4"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
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

export default BlogAdmin
