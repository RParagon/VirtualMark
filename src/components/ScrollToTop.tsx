import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that automatically scrolls the window to the top
 * whenever the route changes. This component doesn't render anything visible,
 * it just handles the scroll behavior.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [pathname]) // Re-run effect when pathname changes

  return null // This component doesn't render anything
}

export default ScrollToTop