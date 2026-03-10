import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'class2000'    // ← change this to your preferred password
const SESSION_KEY = 'c2000_admin'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true')
  const [error, setError]     = useState('')

  const login = (user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setIsAdmin(true); setError(''); return true
    }
    setError('Incorrect username or password.')
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
