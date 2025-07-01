import api from './api'

// Mock data for announcements
const mockAnnouncements = [
  {
    id: 1,
    message: '50% خصم على جميع خدمات الليزر حتى نهاية الشهر!',
    created_at: '2025-06-04T03:49:57',
    created_by: 8,
    is_active: true
  },
  {
    id: 2,
    message: '35% خصم على إزالة الشعر بالليزر!',
    created_at: '2025-06-04T04:10:11',
    created_by: 8,
    is_active: true
  },
  {
    id: 3,
    message: 'عروض العيد قادمة غداً!',
    created_at: '2025-06-04T04:11:54',
    created_by: 8,
    is_active: false
  },
  {
    id: 4,
    message: 'خصم 50% على جميع الخدمات بمناسبة افتتاح الفرع الجديد',
    created_at: '2025-06-14T15:21:02',
    created_by: 8,
    is_active: true
  }
];

export const announcementService = {
  async getAnnouncements() {
    // In a real implementation, this would be an API call
    // return await api.get('/Announcements/viewAnnouncements.php')
    
    // For now, return mock data
    return {
      status: 'success',
      data: mockAnnouncements
    };
  },
  
  async getActiveAnnouncements() {
    // In a real implementation, this would be an API call
    // return await api.get('/Announcements/getActiveAnnouncements.php')
    
    // For now, filter mock data for active announcements
    const activeAnnouncements = mockAnnouncements.filter(a => a.is_active);
    return {
      status: 'success',
      data: activeAnnouncements
    };
  },
  
  async createAnnouncement(message) {
    // In a real implementation, this would be an API call
    // const formData = new FormData();
    // formData.append('message', message);
    // return await api.post('/Announcements/createAnnouncement.php', formData)
    
    // For now, simulate creating an announcement
    console.log('Creating announcement:', message);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'success',
      message: 'Announcement created successfully'
    };
  },
  
  async toggleAnnouncementStatus(id) {
    // In a real implementation, this would be an API call
    // const formData = new FormData();
    // formData.append('announcement_id', id);
    // return await api.post('/Announcements/toggleAnnouncementStatus.php', formData)
    
    // For now, simulate toggling announcement status
    console.log('Toggling announcement status:', id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'success',
      message: 'Announcement status updated successfully'
    };
  },
  
  async deleteAnnouncement(id) {
    // In a real implementation, this would be an API call
    // const formData = new FormData();
    // formData.append('announcement_id', id);
    // return await api.post('/Announcements/deleteAnnouncement.php', formData)
    
    // For now, simulate deleting an announcement
    console.log('Deleting announcement:', id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'success',
      message: 'Announcement deleted successfully'
    };
  }
};