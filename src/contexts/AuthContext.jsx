import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          dispatch({ type: 'AUTH_SUCCESS', payload: user })
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: null })
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'فشل في التحقق من حالة تسجيل الدخول' })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authService.login(credentials)
      
      if (response.status === 'success') {
        const userData = {
          full_name: response.full_name,
          role: response.role,
          csrf_token: response.csrf_token,
        }
        
        // Store in localStorage
        localStorage.setItem('auth_token', response.csrf_token)
        localStorage.setItem('user_data', JSON.stringify(userData))
        
        dispatch({ type: 'AUTH_SUCCESS', payload: userData })
        toast.success('تم تسجيل الدخول بنجاح!')
        
        return { success: true }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message })
        toast.error(response.message)
        return { success: false, error: response.message }
      }
    } catch (error) {
      const errorMessage = 'حدث خطأ في تسجيل الدخول'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authService.register(userData)
      
      if (response.status === 'success') {
        toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني')
        dispatch({ type: 'AUTH_FAILURE', payload: null }) // Reset loading state
        return { success: true }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message })
        toast.error(response.message)
        return { success: false, error: response.message }
      }
    } catch (error) {
      const errorMessage = 'حدث خطأ في إنشاء الحساب'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    dispatch({ type: 'LOGOUT' })
    toast.info('تم تسجيل الخروج بنجاح')
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}