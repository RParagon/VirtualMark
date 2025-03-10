import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePosts } from '../contexts/PostContext'
import { ArrowLeftIcon, ClockIcon, UserIcon, CalendarIcon, ShareIcon } from '@heroicons/react/24/outline'

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
  featured?: boolean
}

const BlogPost = () => {
  const { postId } = useParams()
  const { posts } = usePosts()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // Find the current post
    const currentPost = posts.find((p) => p.id === postId)
    setPost(currentPost || null)

    // Find related posts (same category, excluding current)
    if (currentPost) {
      const related = posts
        .filter(
          (p) =>
            p.id !== postId && p.category === currentPost.category
        )
        .slice(0, 3) // Limit to 3 related posts
      setRelatedPosts(related)
    }
  }, [postId, posts])

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-custom py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post não encontrado</h1>
          <Link
            to="/blog"
            className="text-primary-500 hover:text-primary-400 flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar para o Blog
          </Link>
        </div>
      </div>
    )
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing:', error))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-custom py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to blog link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-primary-500 hover:text-primary-400 mb-8 transition-colors duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Voltar para o Blog
        </Link>

        {/* Article header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800"
        >
          {/* Featured image */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Category */}
            <span className="text-primary-500 text-sm font-medium">
              {post.category.toUpperCase()}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-6">{post.title}</h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                {post.readTime}
              </div>
              <button
                onClick={sharePost}
                className="flex items-center text-primary-500 hover:text-primary-400 transition-colors duration-300"
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Compartilhar
              </button>
            </div>

            {/* Main content */}
            <div className="prose prose-invert prose-primary max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-200 prose-code:text-primary-300 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300 prose-li:text-gray-300 prose-table:border-gray-700 prose-th:text-white prose-td:text-gray-300 prose-img:rounded-lg prose-a:text-primary-500 hover:prose-a:text-primary-400 prose-hr:border-gray-700 [&>*]:mb-4 [&>*:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_p]:whitespace-pre-wrap">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags/Categories */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Categoria:</span>
                <span className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Posts Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-primary-500 text-sm font-medium">
                      {relatedPost.category.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold mt-2 mb-4">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>{relatedPost.author}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPost