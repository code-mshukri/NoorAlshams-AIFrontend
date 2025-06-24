import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { serviceService } from '../../services/serviceService'

const AdminServices = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const queryClient = useQueryClient()

  // Fetch services
  const { data: servicesData, isLoading } = useQuery(
    'admin-services',
    () => serviceService.getServices(),
    {
      refetchOnWindowFocus: false,
    }
  )

  // Toggle service status mutation
  const toggleServiceMutation = useMutation(
    (serviceId) => serviceService.toggleServiceStatus(serviceId),
    {
      onSuccess: () => {
        toast.success('تم تحديث حالة الخدمة بنجاح!')
        queryClient.invalidateQueries('admin-services')
      },
      onError: () => {
        toast.error('فشل في تحديث حالة الخدمة')
      }
    }
  )

  // Delete service mutation
  const deleteServiceMutation = useMutation(
    (serviceId) => serviceService.deleteService(serviceId),
    {
      onSuccess: () => {
        toast.success('تم حذف الخدمة بنجاح!')
        queryClient.invalidateQueries('admin-services')
      },
      onError: () => {
        toast.error('فشل في حذف الخدمة')
      }
    }
  )

  const services = servicesData?.data || []

  const handleToggleService = (serviceId) => {
    toggleServiceMutation.mutate(serviceId)
  }

  const handleDeleteService = (serviceId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      deleteServiceMutation.mutate(serviceId)
    }
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الخدمات</h1>
              <p className="text-gray-600">عرض وإدارة جميع خدمات الصالون</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة خدمة</span>
            </button>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gray-200">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100">
                    <span className="text-primary-200 text-4xl font-bold">
                      {service.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                    service.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active ? 'نشط' : 'معطل'}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                  <span className="text-primary-200 font-bold">{service.price} ر.س</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>المدة: {service.duration} دقيقة</span>
                  <span>تاريخ الإنشاء: {new Date(service.created_at).toLocaleDateString('ar-SA')}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse">
                  <button className="btn-outline flex-1 flex items-center justify-center space-x-1 space-x-reverse">
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>
                  
                  <button
                    onClick={() => handleToggleService(service.id)}
                    disabled={toggleServiceMutation.isLoading}
                    className={`btn-outline flex items-center justify-center p-2 ${
                      service.is_active 
                        ? 'text-red-600 border-red-600 hover:bg-red-50' 
                        : 'text-green-600 border-green-600 hover:bg-green-50'
                    }`}
                  >
                    {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    disabled={deleteServiceMutation.isLoading}
                    className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center justify-center p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد خدمات</h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة أول خدمة للصالون</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              إضافة خدمة جديدة
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default AdminServices