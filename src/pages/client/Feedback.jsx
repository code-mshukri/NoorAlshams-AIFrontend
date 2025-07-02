import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { Star, Calendar, User, CheckCircle, X, Search } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const ClientFeedback = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: ''
  })

  // Fetch completed appointments
  const { data: appointmentsData, isLoading, isError, refetch } = useQuery(
    ['completed-appointments', searchTerm],
    async () => {
      try {
        // In a real implementation, this would be an API call with proper params
        const response = await fetch('/api/Booking/viewClientAppointments.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id,
            role: user?.role,
            status: 'completed',
            search: searchTerm
          }),
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error fetching appointments:', error)
        throw new Error('Failed to load completed appointments')
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!user,
      onError: (error) => {
        toast.error(error.message || 'Failed to load completed appointments')
      }
    }
  )

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation(
    async (data) => {
      try {
        const response = await fetch('/api/Feedback/submitFeedback.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id,
            role: user?.role,
            booking_id: selectedAppointment.id,
            rating: data.rating,
            comment: data.comment,
            csrf_token: user?.csrf_token
          }),
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error submitting feedback:', error)
        throw new Error('Failed to submit feedback')
      }
    },
    {
      onSuccess: () => {
        toast.success('تم إرسال التقييم بنجاح')
        setShowFeedbackModal(false)
        setFeedbackData({ rating: 5, comment: '' })
        queryClient.invalidateQueries(['completed-appointments'])
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to submit feedback')
      }
    }
  )

  // Mock data for completed appointments (replace with actual data from API)
  const completedAppointments = appointmentsData?.data?.appointments || [
    {
      id: 3,
      service_name: 'Henna Design',
      staff_name: 'Noura Hasan',
      date: '2025-07-10',
      time: '11:15:00',
      status: 'completed',
      price: 70,
      has_feedback: false
    },
    {
      id: 4,
      service_name: 'Facial Treatment',
      staff_name: 'Maya Odeh',
      date: '2025-07-05',
      time: '14:30:00',
      status: 'completed',
      price: 120,
      has_feedback: true
    },
    {
      id: 5,
      service_name: 'Laser Hair Removal',
      staff_name: 'Lana Khalil',
      date: '2025-07-01',
      time: '10:00:00',
      status: 'completed',
      price: 230,
      has_feedback: false
    }
  ]

  // Filter appointments based on search term
  const filteredAppointments = completedAppointments.filter(appointment => 
    appointment.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle feedback form submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      toast.error('يرجى اختيار تقييم بين 1 و 5 نجوم')
      return
    }
    
    if (!feedbackData.comment.trim()) {
      toast.error('يرجى إدخال تعليق')
      return
    }
    
    if (feedbackData.comment.length > 500) {
      toast.error('يجب ألا يتجاوز التعليق 500 حرف')
      return
    }
    
    submitFeedbackMutation.mutate(feedbackData)
  }

  // Render star rating
  const renderStarRating = (rating, setRating) => {
    return (
      <div className="flex space-x-2 space-x-reverse">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تقييم الخدمات</h1>
          <p className="text-gray-600">شاركينا رأيك في الخدمات التي تلقيتها</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث بالخدمة أو اسم الموظف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-12 w-full"
            />
          </div>
        </motion.div>

        {/* Completed Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">الخدمات المكتملة</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">حدث خطأ</h3>
              <p className="text-gray-600 mb-4">لم نتمكن من تحميل الخدمات المكتملة</p>
              <button
                onClick={() => refetch()}
                className="btn-primary"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <CheckCircle className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد خدمات مكتملة</h3>
              <p className="text-gray-600">لم يتم العثور على خدمات مكتملة تطابق معايير البحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخدمة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ والوقت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الموظف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التقييم
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.service_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                        <div className="text-sm text-gray-500">{appointment.time.substring(0, 5)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.staff_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.price} ₪</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.has_feedback ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            تم التقييم
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setShowFeedbackModal(true)
                            }}
                            className="btn-primary text-sm"
                          >
                            ترك تقييم
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">تقييم الخدمة</h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">تفاصيل الخدمة:</h3>
              <p className="text-gray-700"><span className="font-medium">الخدمة:</span> {selectedAppointment.service_name}</p>
              <p className="text-gray-700"><span className="font-medium">الموظف:</span> {selectedAppointment.staff_name}</p>
              <p className="text-gray-700">
                <span className="font-medium">التاريخ والوقت:</span> {formatDate(selectedAppointment.date)} - {selectedAppointment.time.substring(0, 5)}
              </p>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
                <div className="flex justify-center">
                  {renderStarRating(feedbackData.rating, (rating) => setFeedbackData(prev => ({ ...prev, rating })))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التعليق</label>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                  className="input-field w-full"
                  rows="4"
                  placeholder="شاركينا رأيك في الخدمة..."
                  maxLength="500"
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  {feedbackData.comment.length}/500 حرف
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="btn-outline"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitFeedbackMutation.isLoading}
                  className="btn-primary"
                >
                  {submitFeedbackMutation.isLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" text="" />
                      <span className="mr-2">جاري الإرسال...</span>
                    </span>
                  ) : (
                    'إرسال التقييم'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ClientFeedback