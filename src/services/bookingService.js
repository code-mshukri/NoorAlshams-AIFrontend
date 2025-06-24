import api from './api'

export const bookingService = {
  async getBookings(page = 1) {
    return await api.get(`/booking/viewClientAppointments.php?page=${page}`)
  },

  async createBooking(bookingData) {
    const formData = new FormData()
    formData.append('staff_id', bookingData.staff_id)
    formData.append('service_id', bookingData.service_id)
    formData.append('date', bookingData.date)
    formData.append('time', bookingData.time)
    
    return await api.post('/booking/addBooking.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async cancelBooking(appointmentId) {
    const formData = new FormData()
    formData.append('appointment_id', appointmentId)
    
    return await api.post('/booking/cancelBooking.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}