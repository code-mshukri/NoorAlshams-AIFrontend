import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, MessageCircle, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api'
import { toast } from 'react-toastify';

/**
 * NotificationCenter Component - Handles all notifications with smooth animations
 * Features:
 * - Real-time notification updates
 * - Smooth popup animations
 * - Different notification types (message, appointment, system)
 * - Mark as read functionality
 * - Notification badge counter
 */
const NotificationCenter = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API


const fetchNotifications = async () => {
  if (!user) return;

  setLoading(true);

  try {
    const response = await api.post('/Notifications/viewNotifications.php', new FormData());

    if (response.status === 'success') {
      const notificationData = response.data || [];
      setNotifications(notificationData);

      const unread = notificationData.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // error toast is already handled by api.js interceptor
  } finally {
    setLoading(false);
  }
};


  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const formData = new FormData();
formData.append('notification_id', notificationId);

const response = await api.post('/Notifications/markNotificationAsRead.php', formData, {
  withCredentials: true
});

      if (response.status === 'success') {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        // Update unread count
       const updated = notifications.map(notification =>
  notification.id === notificationId
    ? { ...notification, is_read: true }
    : notification
);

setNotifications(updated);
setUnreadCount(updated.filter(n => !n.is_read).length);

      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      //  toast.error(t('error_marking_notification'));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);

      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }

      toast.success(t('all_notifications_marked_read'));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error(t('error_marking_all_notifications'));
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'appointment':
      case 'booking_completed':
      case 'booking_confirmed':
      case 'booking_cancelled':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format notification time
 const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};


  // Load notifications on component mount and set up polling
  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.notification-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative notification-dropdown">
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-gray-600 hover:text-primary-200 transition-colors duration-200 rounded-full hover:bg-gray-100"
        title={t('notifications')}
      >
        <Bell className="w-6 h-6" />

        {/* Notification Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  {t('notifications')}
                </h3>
                
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-200 mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>{t('no_notifications')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className={`p-4 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'
                            }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page if exists
                  }}
                  className="w-full text-center text-sm text-primary-200 hover:text-primary-300 font-medium"
                >
                  {t('view_all_notifications')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;

