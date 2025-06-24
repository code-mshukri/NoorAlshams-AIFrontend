import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from 'react-query'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { staffService } from '../../services/staffService'

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'week' or 'month'

  // Calculate date range based on view mode
  const getDateRange = () => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)

    if (viewMode === 'week') {
      // Get start of week (Saturday)
      const dayOfWeek = start.getDay()
      const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) - 1 // Adjust for Saturday start
      start.setDate(diff)
      end.setDate(start.getDate() + 6)
    } else {
      // Get start and end of month
      start.setDate(1)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
    }

    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0]
    }
  }

  const dateRange = getDateRange()

  // Fetch staff schedule
  const { data: scheduleData, isLoading } = useQuery(
    ['staff-schedule', dateRange.from, dateRange.to],
    () => staffService.getStaffSchedule(null, dateRange.from, dateRange.to),
    {
      refetchOnWindowFocus: false,
    }
  )

  const schedule = scheduleData?.data || {}

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getWeekDays = () => {
    const days = []
    const start = new Date(dateRange.from)
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    
    return days
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      in_progress: 'جاري',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      no_show: 'لم يحضر',
    }
    return labels[status] || status
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <LoadingSpinner />
        <Footer />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جدولي الأسبوعي</h1>
          <p className="text-gray-600">عرض وإدارة مواعيدك المجدولة</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => navigateDate('prev')}
                className="btn-outline p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900">
                {viewMode === 'week' 
                  ? `أسبوع ${formatDate(new Date(dateRange.from)).split('،')[0]}`
                  : formatDate(currentDate).split('،')[1]
                }
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="btn-outline p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => setViewMode('week')}
                className={`btn-outline ${viewMode === 'week' ? 'bg-primary-200 text-white' : ''}`}
              >
                أسبوعي
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`btn-outline ${viewMode === 'month' ? 'bg-primary-200 text-white' : ''}`}
              >
                شهري
              </button>
            </div>
          </div>
        </motion.div>

        {/* Schedule View */}
        {viewMode === 'week' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-7 gap-4"
          >
            {getWeekDays().map((day, index) => {
              const dayKey = day.toISOString().split('T')[0]
              const dayAppointments = schedule[dayKey] || []
              const isToday = dayKey === new Date().toISOString().split('T')[0]

              return (
                <div
                  key={dayKey}
                  className={`card p-4 ${isToday ? 'ring-2 ring-primary-200' : ''}`}
                >
                  <div className="text-center mb-4">
                    <h3 className={`font-bold ${isToday ? 'text-primary-200' : 'text-gray-900'}`}>
                      {day.toLocaleDateString('ar-SA', { weekday: 'long' })}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {day.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 bg-gray-50 rounded-lg border-r-4 border-primary-200"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {appointment.appointment_time}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusLabel(appointment.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {appointment.client_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {appointment.service_name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">لا توجد مواعيد</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        ) : (
          // Month view - simplified list
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="space-y-4">
              {Object.entries(schedule).map(([date, appointments]) => (
                <div key={date} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="font-bold text-gray-900 mb-3">
                    {new Date(date).toLocaleDateString('ar-SA', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {appointment.appointment_time}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {appointment.client_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {appointment.service_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(schedule).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد</h3>
                  <p className="text-gray-600">لا توجد مواعيد مجدولة في هذه الفترة</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default StaffSchedule