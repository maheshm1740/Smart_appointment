import api from './appointmentApi';

// Weekly Schedule Endpoints

export const getWeeklySchedule = async (doctorId) => {
  try {
    const response = await api.get(`/schedules/weekly/${doctorId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No schedule found
    }
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const createWeeklySchedule = async (scheduleData) => {
  try {
    const response = await api.post('/schedules/weekly', scheduleData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const updateWeeklySchedule = async (doctorId, scheduleData) => {
  try {
    const response = await api.put(`/schedules/weekly/${doctorId}`, scheduleData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const deleteWeeklySchedule = async (doctorId) => {
  try {
    await api.delete(`/schedules/weekly/${doctorId}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Availability Endpoints

export const getDoctorAvailability = async (doctorId, date) => {
  try {
    // date should be in YYYY-MM-DD format
    const response = await api.get(`/schedules/${doctorId}/availability`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};
