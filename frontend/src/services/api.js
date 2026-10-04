import axios from 'axios';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

/**
 * Standardized error handler:
 * - If backend returned a response (HTTP 400, 404, 500, etc.), forward backend's error message.
 * - If no response (network error, offline backend, connection refused), throw clean connection error.
 */
const handleAxiosError = (err) => {
  if (err.response) {
    throw new Error(
      err.response.data?.message ||
      err.message ||
      'Request failed'
    );
  }
  throw new Error('Unable to connect to the SmartPark backend.');
};

export const parkingService = {
  // GET /api/parking/slots
  getAllSlots: async () => {
    try {
      const response = await apiClient.get('/parking/slots');
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },

  // GET /api/parking/slots/{id}
  getSlotById: async (id) => {
    try {
      const response = await apiClient.get(`/parking/slots/${id}`);
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },

  // POST /api/parking/book
  // Payload: { slotId, vehicleNumber }
  bookSlot: async (slotId, vehicleNumber) => {
    try {
      const response = await apiClient.post('/parking/book', {
        slotId: Number(slotId),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
      });
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },

  // POST /api/parking/exit
  // Payload: { token }
  findExitDetails: async (token) => {
    try {
      const response = await apiClient.post('/parking/exit', {
        token: token.trim().toUpperCase(),
      });
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },

  // POST /api/payment/process
  // Payload: { token, paymentMethod }
  processPayment: async (token, paymentMethod) => {
    try {
      const response = await apiClient.post('/payment/process', {
        token: token.trim().toUpperCase(),
        paymentMethod: paymentMethod.trim().toUpperCase(),
      });
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },

  // PUT /api/parking/slots/{id}/free
  freeReservedSlot: async (slotId) => {
    try {
      const response = await apiClient.put(`/parking/slots/${slotId}/free`);
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },

  // GET /api/parking/history
  getHistory: async () => {
    try {
      const response = await apiClient.get('/parking/history');
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },
};

export default apiClient;
