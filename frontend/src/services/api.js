import axios from 'axios';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Storage keys for local simulation fallback (ensures offline/demo reliability during viva)
const STORAGE_SLOTS_KEY = 'smartpark_slots_v1';
const STORAGE_HISTORY_KEY = 'smartpark_history_v1';

// Initial 50 slots configuration: P01-P23 RESERVED, P24-P50 AVAILABLE
const getInitialSlots = () => {
  const slots = [];
  for (let i = 1; i <= 50; i++) {
    const slotNumber = `P${i < 10 ? '0' + i : i}`;
    const isReserved = i <= 23;
    slots.push({
      id: i,
      slotNumber,
      status: isReserved ? 'RESERVED' : 'AVAILABLE',
      vehicleNumber: null,
      entryTime: null,
      token: null,
    });
  }
  return slots;
};

// Initial history records
const getInitialHistory = () => {
  return [
    {
      token: 'PK-2026-H1021',
      vehicleNumber: 'MH02CL4582',
      slotNumber: 'P25',
      entryTime: '09:15 AM',
      exitTime: '11:45 AM',
      duration: '2.5 Hours',
      amount: 75,
      status: 'COMPLETED',
    },
    {
      token: 'PK-2026-H0914',
      vehicleNumber: 'DL01AX9910',
      slotNumber: 'P30',
      entryTime: '08:30 AM',
      exitTime: '10:30 AM',
      duration: '2 Hours',
      amount: 60,
      status: 'COMPLETED',
    },
  ];
};

const memoryStore = {};

const getStorageItem = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage.getItem(key);
    }
  } catch (e) {
    // fallback
  }
  return memoryStore[key] || null;
};

const setStorageItem = (key, val) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
      return;
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.setItem(key, val);
      return;
    }
  } catch (e) {
    // fallback
  }
  memoryStore[key] = val;
};

const getLocalSlots = () => {
  try {
    const saved = getStorageItem(STORAGE_SLOTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  const initial = getInitialSlots();
  saveLocalSlots(initial);
  return initial;
};

const saveLocalSlots = (slots) => {
  try {
    setStorageItem(STORAGE_SLOTS_KEY, JSON.stringify(slots));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
};

const getLocalHistory = () => {
  try {
    const saved = getStorageItem(STORAGE_HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  const initial = getInitialHistory();
  saveLocalHistory(initial);
  return initial;
};

const saveLocalHistory = (history) => {
  try {
    setStorageItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
};

const generateToken = () => {
  const hex = Math.random().toString(16).substring(2, 7).toUpperCase();
  return `PK-2026-${hex}`;
};

const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const parkingService = {
  // GET /api/parking/slots
  getAllSlots: async () => {
    try {
      const response = await apiClient.get('/parking/slots');
      return response.data;
    } catch (err) {
      console.info('Backend unreachable, using local store for slots:', err.message);
      return getLocalSlots();
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
      console.info('Backend unreachable, using local store for booking:', err.message);
      const slots = getLocalSlots();
      const slotIndex = slots.findIndex(
        (s) => s.id === Number(slotId) || s.slotNumber === slotId
      );

      if (slotIndex === -1) {
        throw new Error('Slot not found.');
      }
      if (slots[slotIndex].status !== 'AVAILABLE') {
        throw new Error('Slot is no longer available.');
      }

      const token = generateToken();
      const entryTime = formatTime();

      slots[slotIndex].status = 'OCCUPIED';
      slots[slotIndex].vehicleNumber = vehicleNumber.trim().toUpperCase();
      slots[slotIndex].entryTime = entryTime;
      slots[slotIndex].token = token;
      saveLocalSlots(slots);

      const history = getLocalHistory();
      const newRecord = {
        token,
        vehicleNumber: slots[slotIndex].vehicleNumber,
        slotNumber: slots[slotIndex].slotNumber,
        entryTime,
        exitTime: '-',
        duration: 'Active',
        amount: '-',
        status: 'ACTIVE',
      };
      history.unshift(newRecord);
      saveLocalHistory(history);

      return {
        success: true,
        token,
        slotNumber: slots[slotIndex].slotNumber,
        vehicleNumber: slots[slotIndex].vehicleNumber,
        entryTime,
      };
    }
  },

  // POST /api/parking/exit
  // Payload: { token }
  findExitDetails: async (token) => {
    try {
      const response = await apiClient.post('/parking/exit', {
        token: token.trim(),
      });
      return response.data;
    } catch (err) {
      console.info('Backend unreachable, using local store for exit:', err.message);
      const cleanToken = token.trim().toUpperCase();
      const slots = getLocalSlots();
      const slot = slots.find((s) => s.token && s.token.toUpperCase() === cleanToken);

      if (!slot) {
        throw new Error('Invalid parking token.');
      }

      const currentTime = formatTime();
      const durationHours = 3; // Standard calculation for demo
      const ratePerHour = 30; // ₹30/hour as requested
      const totalAmount = durationHours * ratePerHour;

      return {
        token: slot.token,
        vehicleNumber: slot.vehicleNumber,
        slotNumber: slot.slotNumber,
        entryTime: slot.entryTime || '12:35 PM',
        currentTime,
        duration: `${durationHours} Hours`,
        rate: `₹${ratePerHour}/hour`,
        ratePerHour,
        totalAmount,
      };
    }
  },

  // POST /api/payment/process
  // Payload: { token, paymentMethod }
  processPayment: async (token, paymentMethod) => {
    try {
      const response = await apiClient.post('/payment/process', {
        token: token.trim(),
        paymentMethod,
      });
      return response.data;
    } catch (err) {
      console.info('Backend unreachable, using local store for payment:', err.message);
      const cleanToken = token.trim().toUpperCase();
      const slots = getLocalSlots();
      const slotIndex = slots.findIndex(
        (s) => s.token && s.token.toUpperCase() === cleanToken
      );

      if (slotIndex === -1) {
        throw new Error('Parking token not found or already settled.');
      }

      // Release slot
      slots[slotIndex].status = 'AVAILABLE';
      slots[slotIndex].vehicleNumber = null;
      slots[slotIndex].entryTime = null;
      slots[slotIndex].token = null;
      saveLocalSlots(slots);

      // Update history record
      const history = getLocalHistory();
      const recordIndex = history.findIndex(
        (h) => h.token && h.token.toUpperCase() === cleanToken
      );
      const exitTime = formatTime();
      if (recordIndex !== -1) {
        history[recordIndex].exitTime = exitTime;
        history[recordIndex].duration = '3 Hours';
        history[recordIndex].amount = 90;
        history[recordIndex].status = 'COMPLETED';
      } else {
        history.unshift({
          token: cleanToken,
          vehicleNumber: 'MH04AB1234',
          slotNumber: slots[slotIndex].slotNumber,
          entryTime: '12:35 PM',
          exitTime,
          duration: '3 Hours',
          amount: 90,
          status: 'COMPLETED',
        });
      }
      saveLocalHistory(history);

      const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

      return {
        success: true,
        transactionId: txnId,
        message: 'Parking completed successfully. Your parking slot has been released.',
      };
    }
  },

  // PUT /api/parking/slots/{id}/free
  freeReservedSlot: async (slotId) => {
    try {
      const response = await apiClient.put(`/parking/slots/${slotId}/free`);
      return response.data;
    } catch (err) {
      console.info('Backend unreachable, using local store to free slot:', err.message);
      const slots = getLocalSlots();
      const slotIndex = slots.findIndex(
        (s) => s.id === Number(slotId) || s.slotNumber === slotId
      );

      if (slotIndex === -1) {
        throw new Error('Slot not found.');
      }
      if (slots[slotIndex].status !== 'RESERVED') {
        throw new Error('Only reserved slots can be freed.');
      }

      slots[slotIndex].status = 'AVAILABLE';
      saveLocalSlots(slots);

      return {
        success: true,
        slotNumber: slots[slotIndex].slotNumber,
      };
    }
  },

  // GET /api/parking/history
  getHistory: async () => {
    try {
      const response = await apiClient.get('/parking/history');
      return response.data;
    } catch (err) {
      console.info('Backend unreachable, using local store for history:', err.message);
      return getLocalHistory();
    }
  },

  // Reset to initial config (handy for viva demos)
  resetDemoData: () => {
    saveLocalSlots(getInitialSlots());
    saveLocalHistory(getInitialHistory());
  },
};

export default apiClient;
