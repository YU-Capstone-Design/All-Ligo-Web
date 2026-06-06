import { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'

const RequireOwnerAuth = ({ children }) => {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const hasRedirected = useRef(false)
  const isLoggedIn =
    auth?.isLoggedIn || Boolean(localStorage.getItem('ownerAccessToken'))

  useEffect(() => {
    if (isLoggedIn || hasRedirected.current) return

    hasRedirected.current = true
    alert('로그인 후 이용해주세요')
    navigate('/splash', { replace: true })
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) {
    return null
  }

  return children
}

export default RequireOwnerAuth
