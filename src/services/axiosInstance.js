import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
  },
});

// Helper function to log requests and responses
const logToDatabase = async (logData) => {
  try {
    const logApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/log-api`;

    // Only log if the URL is not the log endpoint
    if (logData.url !== logApiUrl) {
      await axiosInstance.post(logApiUrl, logData);
    }
  } catch (error) {
    console.error('Error logging request/response:', error);
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const logData = {
      type: 'request',
      method: config.method,
      url: config.url,
      headers: config.headers['Content-Type'],
      data: config.data,
      timestamp: new Date().toISOString(),
      responseStatus: null, // Placeholder for response status
      responseData: null, // Placeholder for response data
    };

    // Store the log data in the config object for access in the response interceptor
    config.logData = logData;

    return config;
  },
  (error) => {
    logToDatabase({
      type: 'request-error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Access the log data stored in the config object
    let logData = response.config.logData;

    // Update the log data with response status and data
    logData.type = 'response'; // Change type to response
    logData.responseStatus = response.status; // Capture response status
    logData.responseData = response.data; // Capture response data

    // Log the complete request/response data
    logToDatabase(logData);

    return response;
  },
  (error) => {
    // Initialize logData with existing data or create a new entry
    let logData = error.response ? error.response.config.logData : {
      type: 'network-error', // Default to network-error if no response
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    // If there's a response, update log data
    if (error.response) {
      logData.type = 'response-error'; // Update type for error
      logData.responseStatus = error.response.status; // Capture response error status
      logData.responseData = error.response.data; // Capture response error data
    }

    logToDatabase(logData); // Log the error data
    return Promise.reject(error);
  }
);

export default axiosInstance;
