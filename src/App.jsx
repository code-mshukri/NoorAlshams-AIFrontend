import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import { useLanguage } from './contexts/LanguageContext'
import Banner from './components/ui/Banner';
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorBoundary from './components/ui/ErrorBoundary'
import WhatsAppButton from './components/ui/WhatsAppButton'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer' 


// Lazy load pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const Register = React.lazy(() => import('./pages/auth/Register'))
const Services = React.lazy(() => import('./pages/Services'))
const About = React.lazy(() => import('./pages/About'))
//const Testimonials = React.lazy(() => import('./pages/Testimonials'))
const Contact = React.lazy(() => import('./pages/Contact'))
const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard'))
const ClientBooking = React.lazy(() => import('./pages/client/Booking'))
const ClientProfile = React.lazy(() => import('./pages/client/Profile'))
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = React.lazy(() => import('./pages/admin/Users'))
const AdminServices = React.lazy(() => import('./pages/admin/Services'))
const StaffDashboard = React.lazy(() => import('./pages/staff/Dashboard'))
const StaffSchedule = React.lazy(() => import('./pages/staff/Schedule'))

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

function App() {
  const { language } = useLanguage()

  React.useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])


  const renderMotionPage = (Component) => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Component />
    </motion.div>
  )

  return (
    <ErrorBoundary>
      <div className="min-h-screen gradient-bg">
        <Banner />
        <Header/>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={renderMotionPage(LandingPage)} />
              <Route path="/login" element={renderMotionPage(Login)} />
              <Route path="/register" element={renderMotionPage(Register)} />
              <Route path="/services" element={renderMotionPage(Services)} />
              <Route path="/about" element={renderMotionPage(About)} />
              {/*<Route path="/testimonials" element={renderMotionPage(Testimonials)} />*/}
              <Route path="/contact" element={renderMotionPage(Contact)} />

              {/* Client Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    {renderMotionPage(ClientDashboard)}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    {renderMotionPage(ClientBooking)}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    {renderMotionPage(ClientProfile)}
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    {renderMotionPage(AdminDashboard)}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    {renderMotionPage(AdminUsers)}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    {renderMotionPage(AdminServices)}
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    {renderMotionPage(StaffDashboard)}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/schedule"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    {renderMotionPage(StaffSchedule)}
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
    <Footer/>
        <WhatsAppButton />
      </div>
    </ErrorBoundary>
  )
}

export default App
