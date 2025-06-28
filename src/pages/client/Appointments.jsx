import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { bookingService } from '../../services/bookingService'
import { useLanguage } from '../../contexts/LanguageContext'
import { Link } from 'react-router-dom'
import { Pencil, Info, X } from 'lucide-react'
import { serviceService } from '../../services/serviceService'

const Appointments = () => {
  const { t } = useLanguage()
  const [page, setPage] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const [services, setServices] = useState([])

  const { data: appointmentsData, isLoading, refetch } = useQuery(
    ['appointments', page],
    () => bookingService.getBookings(page)
  )

  const appointments = appointmentsData?.data?.appointments || []
  console.log("Appointments data:", appointments)
  appointments.sort((a, b) => {
  const dateTimeA = new Date(`${a.appointment_date}T${a.appointment_time}`)
  const dateTimeB = new Date(`${b.appointment_date}T${b.appointment_time}`)
  return dateTimeA - dateTimeB
})
  const total = appointmentsData?.data?.total || 0
  const limit = 10
  const totalPages = Math.ceil(total / limit)

  const updateAppointmentMutation = useMutation(bookingService.editBooking, {
    onSuccess: () => {
      setShowEdit(false)
      refetch()
    }
  })

  useEffect(() => {
  const fetchServices = async () => {
    const response = await serviceService.getServices()
    setServices(response?.data?.data || [])  // ✅ fixed line
  }
  fetchServices()
}, [])


  const handleEditSubmit = (e) => {
    e.preventDefault()
    updateAppointmentMutation.mutate(editData)
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">حجوزاتي القادمة</h1>
          <Link to="/booking" className="btn-primary">حجز جديد</Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">جاري تحميل الحجوزات...</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.appointment_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{appointment.service_name}</h3>
                  <p className="text-sm text-gray-600">{appointment.date} - {appointment.time}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                }`}>
                    {appointment.status === 'confirmed' && 'مؤكد'}
                    {appointment.status === 'pending' && 'في الانتظار'}
                    {appointment.status === 'completed' && 'مكتمل'}
                    {appointment.status === 'cancelled' && 'ملغي'}
                    {!['confirmed', 'pending', 'completed', 'cancelled'].includes(appointment.status) && 'غير محدد'}
                </span>       
                </div>
                <div className="space-x-2 space-x-reverse">
                  <button
                    onClick={() => { setSelectedAppointment(appointment); setShowDetails(true) }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Info />
                  </button>
                  <button
                    onClick={() => { setEditData(appointment); setShowEdit(true) }}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Pencil />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-primary-200 text-white' : 'bg-white border'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative text-right">
            <button
              className="absolute top-2 left-2 text-gray-600"
              onClick={() => setShowDetails(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">تفاصيل الحجز</h2>
            <p><span className="font-semibold">الخدمة:</span> {selectedAppointment.service_name}</p>
            <p><span className="font-semibold">الموظف:</span> {selectedAppointment.staff_name}</p>
            <p><span className="font-semibold">التاريخ:</span> {selectedAppointment.appointment_date}</p>
            <p><span className="font-semibold">الوقت:</span> {selectedAppointment.appointment_time}</p>
            <p><span className="font-semibold">السعر:</span> {selectedAppointment.price} شيكل</p>
           <p><span className="font-semibold">الحالة:</span>
            <span className={`inline-block px-2 py-1 text-xs rounded ml-2 ${
                selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                selectedAppointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-600'
            }`}>
                {selectedAppointment.status || 'غير محدد'}
            </span>
            </p>

          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative text-right">
            <button
              className="absolute top-2 left-2 text-gray-600"
              onClick={() => setShowEdit(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">تعديل الموعد</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-1">الخدمة</label>
              <select
                className="w-full border p-2 mb-3 rounded"
                value={editData.service_id}
                onChange={(e) => setEditData({ ...editData, service_id: e.target.value })}
              >
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الموعد</label>
              <input
                type="date"
                className="w-full border p-2 mb-3 rounded"
                value={editData.appointment_date}
                onChange={(e) => setEditData({ ...editData, appointment_date: e.target.value })}
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">وقت الموعد</label>
              <input
                type="time"
                className="w-full border p-2 mb-3 rounded"
                value={editData.appointment_time}
                onChange={(e) => setEditData({ ...editData, appointment_time: e.target.value })}
              />

              <button type="submit" className="btn-primary w-full">حفظ التغييرات</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
