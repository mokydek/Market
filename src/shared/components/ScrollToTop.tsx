import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Rendered inside BrowserRouter. Resets scroll to the top whenever the route
// pathname changes so each page starts from the top.
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
