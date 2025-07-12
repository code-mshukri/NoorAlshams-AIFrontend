import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const Services = () => {
  const [services, setServices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)

  useEffect(() => {
    fetchServices(currentPage)
  }, [currentPage])

  const fetchServices = (page) => {
    axios
      .get(`http://localhost/senior-nooralshams/api/ServicesEndpoint/viewServices.php?page=${page}`)
      .then((response) => {
        const data = response.data.data
        if (Array.isArray(data)) {
          setServices(data)
          setIsLastPage(data.length < 9) // backend returns 10 per page
        } else {
          console.error('Invalid format:', response.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error)
      })
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(price)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (!isLastPage) setCurrentPage((prev) => prev + 1)
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدماتنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشفي مجموعة خدمات قصر نور الشمس المتنوعة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group hover:scale-105 shadow-lg bg-white rounded-lg"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${BASE_URL}/${service.image_path}`}
                    alt={service.name}
                    className="w-[387px] h-[250px] object-cover mx-auto"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <p className="text-primary-200 font-semibold mb-4">
                    السعر: {formatPrice(service.price)}
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-primary-200 hover:text-primary-300 font-medium group"
                  >
                    احجزي الآن
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 space-x-4 rtl:space-x-reverse">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-md shadow text-white font-semibold ${
                currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-200 hover:bg-primary-300'
              }`}
            >
              السابق
            </button>

            <span className="flex items-center font-bold text-gray-700 px-3">الصفحة {currentPage}</span>

            <button
              onClick={handleNext}
              disabled={isLastPage}
              className={`px-5 py-2 rounded-md shadow text-white font-semibold ${
                isLastPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-200 hover:bg-primary-300'
              }`}
            >
              التالي
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Services
