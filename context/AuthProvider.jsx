
'use client'

import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(storedToken)
          const currentTime = Date.now() / 1000
          
          if (decodedToken.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token')
            setIsAuthenticated(false)
            setUser(null)
            setToken(null)
          } else {
            // Set token in axios headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            
            // Get user data
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`)
            setUser(data)
            setIsAuthenticated(true)
            setToken(storedToken)
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          localStorage.removeItem('token')
          setIsAuthenticated(false)
          setUser(null)
          setToken(null)
        }
      }
      
      setIsLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      })
      
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (name, username, email, password) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name,
        username,
        email,
        password
      })
      
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
      
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser({ ...user, ...userData })
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
