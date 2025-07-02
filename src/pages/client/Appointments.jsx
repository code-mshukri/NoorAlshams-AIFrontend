import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { Calendar, ChevronLeft, ChevronRight, Filter, Search, Star, Edit, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const ClientAppointments = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [sortOrder, setSortOrder] = useState('newest')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    service_id: '',
    date: '',
    time: ''
  })

  // Fetch appointments
  const { data: appointmentsData, isLoading, isError, refetch } = useQuery(
    ['client-appointments', statusFilter, dateRange, sortOrder],
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
            status: statusFilter,
            date_from: dateRange.from,
            date_to: dateRange.to,
            sort: sortOrder
          }),
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error fetching appointments:', error)
        throw new Error('Failed to load appointments')
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!user,
      onError: (error) => {
        toast.error(error.message || 'Failed to load appointments')
      }
    }
  )

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation(
    async (appointmentId) => {
      try {
        const response = await fetch('/api/Booking/cancelBooking.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id,
            role: user?.role,
            appointment_id: appointmentId,
            csrf_token: user?.csrf_token
          }),
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error cancelling appointment:', error)
        throw new Error('Failed to cancel appointment')
      }
    },
    {
      onSuccess: () => {
        toast.success('تم إلغاء الموعد بنجاح')
        queryClient.invalidateQueries(['client-appointments'])
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to cancel appointment')
      }
    }
  )

  // Edit appointment mutation
  const editAppointmentMutation = useMutation(
    async (data) => {
      try {
        const response = await fetch('/api/Booking/editBooking.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id,
            role: user?.role,
            appointment_id: selectedAppointment.id,
            service_id: data.service_id,
            date: data.date,
            time: data.time,
            csrf_token: user?.csrf_token
          }),
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error editing appointment:', error)
        throw new Error('Failed to update appointment')
      }
    },
    {
      onSuccess: () => {
        toast.success('تم تعديل الموعد بنجاح')
        setShowEditModal(false)
        queryClient.invalidateQueries(['client-appointments'])
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update appointment')
      }
    }
  )

  // Mock data for appointments (replace with actual data from API)
  const appointments = appointmentsData?.data?.appointments || [
    {
      id: 1,
      service_name: 'Laser Hair Removal',
      staff_name: 'Lana Khalil',
      date: '2025-07-15',
      time: '10:00:00',
      status: 'pending',
      price: 230
    },
    {
      id: 2,
      service_name: 'Facial Treatment',
      staff_name: 'Maya Odeh',
      date: '2025-07-16',
      time: '14:30:00',
      status: 'confirmed',
      price: 120
    },
    {
      id: 3,
      service_name: 'Henna Design',
      staff_name: 'Noura Hasan',
      date: '2025-07-20',
      time: '11:15:00',
      status: 'completed',
      price: 70
    }
  ]

  // Mock data for services (replace with actual data from API)
  const services = [
    { id: 1, name: 'Laser Hair Removal', price: 230 },
    { id: 3, name: 'Facial Treatment', price: 120 },
    { id: 4, name: 'Henna Design', price: 70 },
    { id: 5, name: 'Pedicare', price: 80 },
    { id: 8, name: 'Nails Polishing', price: 130 }
  ]

  // Generate calendar days for the current month
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1)
    const days = []
    
    // Get the first day of the month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    
    // Get the last day of the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayIndex = firstDay.getDay()
    
    // Add previous month's days to fill the first week
    const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      })
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true
      })
    }
    
    // Add next month's days to fill the last week
    const lastDayIndex = lastDay.getDay()
    const nextDays = 7 - lastDayIndex - 1
    
    for (let i = 1; i <= nextDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const calendarDays = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (day) => {
    const dateString = day.date.toISOString().split('T')[0]
    return appointments.filter(appointment => appointment.date === dateString)
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار'
      case 'confirmed':
        return 'مؤكد'
      case 'completed':
        return 'مكتمل'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
      cancelAppointmentMutation.mutate(appointmentId)
    }
  }

  // Handle edit form submission
  const handleEditSubmit = (e) => {
    e.preventDefault()
    editAppointmentMutation.mutate(editFormData)
  }

  // Reset filters
  const resetFilters = () => {
    setStatusFilter('')
    setDateRange({ from: '', to: '' })
    setSortOrder('newest')
  }

  // Handle appointment click
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  // Handle edit button click
  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment)
    setEditFormData({
      service_id: appointment.service_id || '',
      date: appointment.date || '',
      time: appointment.time || ''
    })
    setShowEditModal(true)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مواعيدي</h1>
          <p className="text-gray-600">عرض وإدارة جميع مواعيدك</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">حالة الموعد</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="input-field"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="btn-outline mr-2"
            >
              إعادة تعيين
            </button>
            <button
              onClick={() => refetch()}
              className="btn-primary"
            >
              تطبيق
            </button>
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900">
              {currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Weekday Headers */}
            {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-700 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day)
              const isToday = day.date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-24 border rounded-lg p-2 ${
                    day.isCurrentMonth
                      ? isToday
                        ? 'bg-primary-50 border-primary-200'
                        : 'bg-white'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className="text-right">
                    <span className={`text-sm ${isToday ? 'font-bold text-primary-200' : ''}`}>
                      {day.date.getDate()}
                    </span>
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        className="text-xs p-1 rounded bg-primary-50 border-r-2 border-primary-200 cursor-pointer hover:bg-primary-100 transition-colors"
                      >
                        <div className="font-medium truncate">{appointment.service_name}</div>
                        <div className="text-gray-600">{appointment.time.substring(0, 5)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">قائمة المواعيد</h2>
          
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
              <p className="text-gray-600 mb-4">لم نتمكن من تحميل المواعيد</p>
              <button
                onClick={() => refetch()}
                className="btn-primary"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Calendar className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد</h3>
              <p className="text-gray-600">لم يتم العثور على مواعيد تطابق معايير البحث</p>
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
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.service_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                        <div className="text-sm text-gray-500">{appointment.time.substring(0, 5)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.staff_name || 'لم يتم التعيين بعد'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.price} ₪</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                            <>
                              <button
                                onClick={() => handleEditClick(appointment)}
                                className="text-blue-600 hover:text-blue-900"
                                title="تعديل"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900"
                                title="إلغاء"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <a
                              href="/client/feedback"
                              className="text-yellow-600 hover:text-yellow-900"
                              title="ترك تقييم"
                            >
                              <Star className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الموعد</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">الخدمة</h3>
                <p className="text-base font-medium text-gray-900">{selectedAppointment.service_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">التاريخ والوقت</h3>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(selectedAppointment.date)} - {selectedAppointment.time.substring(0, 5)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">الموظف</h3>
                <p className="text-base font-medium text-gray-900">
                  {selectedAppointment.staff_name || 'لم يتم التعيين بعد'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">الحالة</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeColor(selectedAppointment.status)}`}>
                  {getStatusLabel(selectedAppointment.status)}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">السعر</h3>
                <p className="text-base font-medium text-gray-900">{selectedAppointment.price} ₪</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-outline"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">تعديل الموعد</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الخدمة</label>
                <select
                  value={editFormData.service_id}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, service_id: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">اختر الخدمة</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price} ₪
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوقت</label>
                <input
                  type="time"
                  value={editFormData.time}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-outline"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={editAppointmentMutation.isLoading}
                  className="btn-primary"
                >
                  {editAppointmentMutation.isLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" text="" />
                      <span className="mr-2">جاري الحفظ...</span>
                    </span>
                  ) : (
                    'حفظ التغييرات'
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

export default ClientAppointments