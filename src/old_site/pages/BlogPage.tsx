import { Route, Routes } from 'react-router-dom'
import Blog from '../components/Blog'
import BlogPost from '../components/BlogPost'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const BlogPage = () => {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/:postId/:titleSlug?" element={<BlogPost />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default BlogPage