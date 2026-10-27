import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventhive_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isExpired = error.response.data?.isExpired;
      if (isExpired || error.response.data?.message?.includes('token')) {
        localStorage.removeItem('eventhive_token');
        localStorage.removeItem('eventhive_user');
        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
};

// Events Service
export const eventService = {
  getEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data;
  },
  getFeaturedEvents: async () => {
    const res = await api.get('/events/featured');
    return res.data;
  },
  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },
  createEvent: async (eventData) => {
    const res = await api.post('/events', eventData);
    return res.data;
  },
  updateEvent: async (id, eventData) => {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
  getStatsSummary: async () => {
    const res = await api.get('/events/stats/summary');
    return res.data;
  },
};

// Registrations Service
export const registrationService = {
  registerForEvent: async (eventId, regData = {}) => {
    const res = await api.post(`/registrations/${eventId}`, regData);
    return res.data;
  },
  getMyTickets: async () => {
    const res = await api.get('/registrations/my-tickets');
    return res.data;
  },
  checkRegistration: async (eventId) => {
    const res = await api.get(`/registrations/check/${eventId}`);
    return res.data;
  },
  cancelRegistration: async (ticketId) => {
    const res = await api.delete(`/registrations/${ticketId}`);
    return res.data;
  },
};

// Clubs Service
export const clubService = {
  getClubs: async () => {
    const res = await api.get('/clubs');
    return res.data;
  },
};

// System / Health Service
export const systemService = {
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};

export default api;
