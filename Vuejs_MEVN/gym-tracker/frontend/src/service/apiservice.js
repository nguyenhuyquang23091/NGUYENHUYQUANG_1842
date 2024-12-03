import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }

});

export default {
  // Fetch all exercises
  getExercise() {
    return apiClient.get('/exercises');
  },

  // Create a new exercise (including file upload)
  createExercise(exercise) {
    return apiClient.post('/exercises', exercise, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set for file uploads
      },
    });
  },

  // Update an existing exercise (including file upload)
  updateExercise(id, updateExercise) {
    return apiClient.put(`/exercises/${id}`, updateExercise, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set for file uploads
      },
    });
  },

  // Delete an exercise
  deleteExercise(id) {
    return apiClient.delete(`/exercises/${id}`);
  },

  // Fetch image by ID (if needed)
  getImageUrl(imageId) {
    return apiClient.get(`/images/${imageId}`);
  },
};
