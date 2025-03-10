import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePosts } from '../contexts/PostContext'
import { supabase } from '../lib/supabase'

// Função auxiliar para criar "slug" em links
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Interface opcional (TS)
interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  imageUrl: string
  featured?: boolean
  status: 'draft' | 'published'
}

const Blog = () => {
  // Scroll animation setup
  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 300], [0, -50])
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.3])
  const gradientRotate = useTransform(scrollY, [0, 300], [0, 45])

  // Estados principais
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(6)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  // Pegar posts do contexto (ou de fetch)
  const { posts } = usePosts()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') { // Unique violation error code
          alert('Este email já está cadastrado em nossa newsletter!')
        } else {
          console.error('Error saving email:', error)
          alert('Ocorreu um erro ao salvar seu email. Por favor, tente novamente.')
        }
        return
      }

      setIsSubmitted(true)
      setEmail('')
    } catch (error) {
      console.error('Error:', error)
      alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.')
    }
  }

  // Lista de categorias (fixas ou da API)
  const categories = ['all', 'marketing', 'social media', 'seo', 'analytics']

  // Filtro (busca + categoria)
  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory
    const isPublished = post.status === 'published'
    return matchesSearch && matchesCategory && isPublished
  })

  // Lógica de paginação
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Troca de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Reseta para página 1 ao mudar busca ou categoria
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Pega post em destaque (featured)
  const featuredPost = filteredPosts.find((post) => post.featured)

  // Posts recentes (para sidebar)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Animações do container e itens
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const featuredVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      {/* Cabeçalho do Blog com animação aprimorada */}
      <motion.header
        style={{
          y: headerY,
          opacity: headerOpacity,
          background: `linear-gradient(${gradientRotate}deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.2))`
        }}
        className="relative py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-black mb-12 mt-8 relative inline-block tracking-tight"
          >
            <span className="relative inline-block bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 text-transparent bg-clip-text">
              Transforme seu
              <br />
              Negócio Digital
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium mb-12"
          >
            Conteúdo exclusivo sobre Marketing Digital, Vendas e Tecnologia
            para levar sua empresa ao próximo nível.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center gap-4 mb-16"
          >
            <button
              onClick={() => window.location.href = '#newsletter'}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-primary-600/20 text-lg animate-glow"
            >
              Receba Conteúdo Exclusivo
            </button>
          </motion.div>
        </motion.div>
      
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent" />
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>
      </motion.header>

      {/* Container principal */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Grid com conteúdo principal + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seção Principal (3 colunas) */}
          <div className="lg:col-span-3">
            {/* Barra de busca e seleção de categorias */}
            <motion.div
              className="mb-8 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Campo de busca */}
              <motion.div
                className="relative max-w-xl"
                variants={itemVariants}
              >
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg pl-12 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition duration-300"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </motion.div>

              {/* Categorias */}
              <motion.div
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </motion.div>
            </motion.div>

            {/* Post em Destaque (se existir) */}
            {featuredPost && (
              <motion.div
                variants={featuredVariants}
                initial="hidden"
                animate="visible"
                className="mb-12 bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800
                           hover:border-primary-500/50 transition-transform duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/blog/${featuredPost.id}`} className="block">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={featuredPost.imageUrl}
                      alt="Featured post"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>
                <div className="p-8">
                  <span className="text-primary-500 text-sm font-medium">
                    {featuredPost.category.toUpperCase()}
                  </span>
                  <h2 className="text-2xl font-bold mt-2 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-400 space-x-2">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lista de posts paginados */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {currentPosts
                .filter((post) => !post.featured)
                .map((post: BlogPost) => (
                  <Link
                    to={`/blog/${post.id}/${slugify(post.title)}`}
                    key={post.id}
                    className="block"
                  >
                    <motion.article
                      variants={itemVariants}
                      className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800
                                 hover:border-primary-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-primary-500 text-sm font-medium">
                          {post.category.toUpperCase()}
                        </span>
                        <h3 className="text-xl font-bold mt-2 mb-4">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-6">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-400 space-x-2">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
            </motion.div>

            {/* Caso nenhum post filtrado */}
            {filteredPosts.length === 0 && (
              <div className="text-center text-gray-400 mt-12">
                <p className="text-lg">Nenhum resultado encontrado.</p>
              </div>
            )}

            {/* Paginação */}
            {filteredPosts.length > postsPerPage && (
              <div className="mt-10 flex justify-center items-center gap-2">
                {Array.from({
                  length: Math.ceil(filteredPosts.length / postsPerPage)
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors
                      ${
                        currentPage === index + 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (posts recentes, categorias, etc.) */}
          <div className="hidden lg:block space-y-8">
            {/* Posts Recentes */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h4 className="text-xl font-semibold mb-4 text-primary-500">
                Posts Recentes
              </h4>
              <ul className="space-y-4">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      to={`/blog/${post.id}/${slugify(post.title)}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lista de Categorias (extra) */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h4 className="text-xl font-semibold mb-4 text-primary-500">
                Categorias
              </h4>
              <ul className="text-gray-300 text-sm leading-6 space-y-2">
                {categories.slice(1).map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat)
                      setCurrentPage(1)
                    }}
                    className="cursor-pointer hover:text-primary-500 transition-colors"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Seção de Newsletter (CTA) */}
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: isSubmitted ? [1, 1.02, 1] : 1,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="mt-20 mb-12 bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-300 hover:border-primary-500/50 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="subscribe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 text-transparent bg-clip-text">Assine nossa Newsletter</h2>
                <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                  Receba artigos exclusivos, dicas avançadas e estratégias comprovadas diretamente em seu e-mail.
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="max-w-lg mx-auto flex gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    required
                    className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-primary-600/20 whitespace-nowrap"
                  >
                    Inscrever-se
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    y: [20, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    times: [0, 1]
                  }}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <div className="relative mb-6">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                        times: [0, 0.3, 0.7, 1]
                      }}
                    />
                    <div className="text-3xl font-bold text-primary-500">Sucesso!</div>
                  </div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 text-transparent bg-clip-text"
                  >
                    Obrigado por se inscrever!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-300 text-lg"
                  >
                    Você receberá nosso conteúdo exclusivo em breve.
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  )
}

export default Blog
