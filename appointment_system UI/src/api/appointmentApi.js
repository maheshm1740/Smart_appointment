import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const getAppointment = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const getDoctorQueue = async (doctorId) => {
  try {
    const response = await api.get(`/queues/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const completeAppointment = async (appointmentId) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    await api.delete(`/appointments/${appointmentId}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export default api;
