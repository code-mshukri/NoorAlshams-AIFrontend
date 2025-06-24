import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  // Fetch users
  const { data: usersData, isLoading } = useQuery(
    ['admin-users', currentPage, searchTerm, selectedRole],
    async () => {
      const params = new URLSearchParams()
      params.append('page', currentPage)
      if (searchTerm) params.append('search', searchTerm)
      if (selectedRole) params.append('role', selectedRole)
      
      const response = await fetch(`/api/user/searchUsers.php?${params.toString()}`)
      return response.json()
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation(
    async ({ userId, action }) => {
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('action', action)
      
      const response = await fetch('/api/user/deactivateUser.php', {
        method: 'POST',
        body: formData,
      })
      return response.json()
    },
    {
      onSuccess: () => {
        toast.success('تم تحديث حالة المستخدم بنجاح!')
        queryClient.invalidateQueries('admin-users')
      },
      onError: () => {
        toast.error('فشل في تحديث حالة المستخدم')
      }
    }
  )

  const users = usersData?.data || []
  const pagination = usersData?.pagination || {}

  const handleToggleUserStatus = (userId, isActive) => {
    const action = isActive ? 'deactivate' : 'activate'
    toggleUserStatusMutation.mutate({ userId, action })
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800',
      staff: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800',
    }
    
    const labels = {
      admin: 'مدير',
      staff: 'موظف',
      client: 'عميل',
    }

    return (
      <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${badges[role]}`}>
        {labels[role]}
      </span>
    )
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
              <p className="text-gray-600">عرض وإدارة جميع المستخدمين في النظام</p>
            </div>
            <button className="btn-primary flex items-center space-x-2 space-x-reverse">
              <Plus className="w-5 h-5" />
              <span>إضافة مستخدم</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pr-12"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-field"
            >
              <option value="">جميع الأدوار</option>
              <option value="admin">مدير</option>
              <option value="staff">موظف</option>
              <option value="client">عميل</option>
            </select>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedRole('')
                setCurrentPage(1)
              }}
              className="btn-outline"
            >
              إعادة تعيين
            </button>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-200 font-medium">
                            {user.full_name.charAt(0)}
                          </span>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          className={`${
                            user.is_active 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          disabled={toggleUserStatusMutation.isLoading}
                        >
                          {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-outline disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                  disabled={currentPage === pagination.total_pages}
                  className="btn-outline disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    عرض <span className="font-medium">{((currentPage - 1) * pagination.items_per_page) + 1}</span> إلى{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.items_per_page, pagination.total_items)}
                    </span>{' '}
                    من <span className="font-medium">{pagination.total_items}</span> نتيجة
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-primary-200 border-primary-200 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminUsers