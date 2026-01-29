import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import StoreEditor from './pages/StoreEditor'
import Storefront from './pages/Storefront'
import Admin from './pages/Admin'
import Education from './pages/education'

// Auth Context
export const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [token])

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            } else {
                logout()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            console.log('Login response status:', res.status)

            const text = await res.text()
            let data
            try {
                data = JSON.parse(text)
            } catch (e) {
                console.error('Failed to parse login response:', text)
                throw new Error(`Server error (${res.status}): ${text.slice(0, 100)}`)
            }

            if (!res.ok) {
                throw new Error(data?.detail || data?.message || `Login failed (${res.status})`)
            }

            localStorage.setItem('token', data.access_token)
            setToken(data.access_token)
        } catch (err) {
            console.error('Login error:', err)
            throw err
        }
    }

    const register = async (email, password, fullName) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName })
            })

            console.log('Register response status:', res.status)

            const text = await res.text()
            let data
            try {
                data = JSON.parse(text)
            } catch (e) {
                console.error('Failed to parse register response:', text)
                throw new Error(`Server error (${res.status}): ${text.slice(0, 100)}`)
            }

            if (!res.ok) {
                throw new Error(data?.detail || data?.message || `Registration failed (${res.status})`)
            }

            await login(email, password)
        } catch (err) {
            console.error('Registration error:', err)
            throw err
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!user) return <Navigate to="/login" />
    return children
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
                    <Route path="/store/:storeId" element={<ProtectedRoute><StoreEditor /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    <Route path="/s/:slug" element={<Storefront />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
