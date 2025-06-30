import api from './api'

export const serviceService = {
 async getServices() {
    // No pagination param, fetches all active services
    return await api.get(`/services/viewServices.php`)
  },

  async getService(id) {
    return await api.get(`/services/viewServices.php?id=${id}`)
  },

  async createService(serviceData) {
    const formData = new FormData()
    formData.append('name', serviceData.name)
    formData.append('description', serviceData.description)
    formData.append('price', serviceData.price)
    formData.append('duration', serviceData.duration)
    
    if (serviceData.image) {
      formData.append('image', serviceData.image)
    }
    
    return await api.post('/services/addService.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async updateService(serviceId, serviceData) {
    const formData = new FormData()
    formData.append('service_id', serviceId)
    formData.append('name', serviceData.name)
    formData.append('description', serviceData.description)
    formData.append('price', serviceData.price)
    formData.append('duration', serviceData.duration)
    
    if (serviceData.image) {
      formData.append('image', serviceData.image)
    }
    
    return await api.post('/services/editService.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async deleteService(serviceId) {
    const formData = new FormData()
    formData.append('service_id', serviceId)
    
    return await api.post('/services/deleteService.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async toggleServiceStatus(serviceId) {
    const formData = new FormData()
    formData.append('service_id', serviceId)
    
    return await api.post('/services/toggleServiceStatus.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}