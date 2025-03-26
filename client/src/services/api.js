// src/services/api.js
// Use environment variable for API URL with fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

/**
 * Fetch data from the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Optional: Add an Accept header to specify expected response type
        Accept: "application/json",
      },
    };

    // Merge default options with provided options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, mergedOptions);

    // Handle different types of error responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // Fallback to text if JSON parsing fails
        errorData = await response.text();
      }

      // Create a more informative error
      const error = new Error(
        errorData.error ||
          errorData.message ||
          `Server error: ${response.status} - ${response.statusText}`
      );
      error.status = response.status;
      error.details = errorData;
      throw error;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);

    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Question-related API functions
 */
export const questionService = {
  // Get all questions
  getAllQuestions: async (category = null) => {
    let endpoint = "/questions";
    if (category) {
      endpoint += `?category=${encodeURIComponent(category)}`;
    }
    return fetchFromAPI(endpoint);
  },

  // Get a single question by ID
  getQuestionById: async (id) => {
    return fetchFromAPI(`/questions/${id}`);
  },

  // Create a new question
  createQuestion: async (questionData) => {
    return fetchFromAPI("/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    });
  },

  // Update a question
  updateQuestion: async (id, questionData) => {
    return fetchFromAPI(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(questionData),
    });
  },

  // Delete a question
  deleteQuestion: async (id) => {
    return fetchFromAPI(`/questions/${id}`, {
      method: "DELETE",
    });
  },
};
