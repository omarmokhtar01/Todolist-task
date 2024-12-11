import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });



  export const fetchTasks = async (page = 1) => {
    try {
      const response = await api.get(`/tasks?page=${page}`);
      return {
        tasks: response.data.data, 
        totalPages: response.data.last_page, 
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };
  

  export const createTask = async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data; 
    } catch (error) {
      console.error("Error creating task:", error.response.data);
      throw error;
    }
  };

  
  export const updateTask = async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data; 
    } catch (error) {
      console.error("Error updating task:", error.response.data);
      throw error;
    }
  };

  export const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data; 
    } catch (error) {
      console.error("Error deleting task:", error.response.data);
      throw error;
    }
  };

  export const fetchTrashedTasks = async () => {
    try {
      const response = await api.get("/trashed");
      return response.data.data; 
    } catch (error) {
      console.error("Error fetching trashed tasks:", error);
      throw error;
    }
  };

  
  export const restoreTask = async (id) => {
    try {
      const response = await api.post(`/${id}/restore`);
      return response.data; 
    } catch (error) {
      console.error("Error restoring task:", error.response.data);
      throw error;
    }
  };

  export const forceDeleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}/force`);
      return response.data; 
    } catch (error) {
      console.error("Error permanently deleting task:", error.response.data);
      throw error;
    }
  };


  export const fetchCategoriesApi = async () => {
    try {
      const response = await api.get('/categories');
      return response.data
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  
  export const addCategoriesApi = async (data) => {
    try {
      const response = await api.post('/categories', { name: data.name });
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error);
      throw error;
    }
  };
  
  

export default api;
