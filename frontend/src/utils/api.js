import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const sendContactMessage = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const sendVisitorThankYou = async (data) => {
  const response = await api.post('/visitor', data);
  return response.data;
};

// Hero API
export const fetchHeroData = async () => {
  try {
    const response = await api.get('/hero');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const updateHeroData = async (data) => {
  const response = await api.put('/hero', data);
  return response.data;
};

// About API
export const fetchAboutData = async () => {
  try {
    const response = await api.get('/about');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const updateAboutData = async (data) => {
  const response = await api.put('/about', data);
  return response.data;
};

// Projects API
export const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const createProject = async (data) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Skills API
export const fetchSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const createSkill = async (data) => {
  const response = await api.post('/skills', data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.put(`/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};

// Experience API
export const fetchExperience = async () => {
  try {
    const response = await api.get('/experience');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const createExperience = async (data) => {
  const response = await api.post('/experience', data);
  return response.data;
};

export const updateExperience = async (id, data) => {
  const response = await api.put(`/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experience/${id}`);
  return response.data;
};

// Code Examples API
export const fetchCodeExamples = async () => {
  try {
    const response = await api.get('/code-examples');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const createCodeExample = async (data) => {
  const response = await api.post('/code-examples', data);
  return response.data;
};

export const updateCodeExample = async (id, data) => {
  const response = await api.put(`/code-examples/${id}`, data);
  return response.data;
};

export const deleteCodeExample = async (id) => {
  const response = await api.delete(`/code-examples/${id}`);
  return response.data;
};

// Image Upload API
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 3D GLB Model Upload API
export const uploadModel = async (file) => {
  const formData = new FormData();
  formData.append('model', file);
  const response = await api.post('/upload/model', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Resume Management API
export const fetchResume = async () => {
  try {
    const response = await api.get('/resume');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const replaceResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.put('/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteResume = async () => {
  const response = await api.delete('/resume');
  return response.data;
};

export const getResumeDownloadUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${backendBase}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
};

// Admin Account & Security Settings API
export const fetchAdminAccount = async () => {
  try {
    const response = await api.get('/admin/account');
    return response.data?.admin || null;
  } catch (error) {
    return null;
  }
};

export const updateAdminUsername = async (newUsername) => {
  const response = await api.patch('/admin/account/username', { newUsername });
  return response.data;
};

export const updateAdminPassword = async (currentPassword, newPassword) => {
  const response = await api.patch('/admin/account/password', { currentPassword, newPassword });
  return response.data;
};

// Audio Management API
export const fetchAudioSettings = async () => {
  try {
    const response = await api.get('/audio');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const fetchAudioAdmin = async () => {
  try {
    const response = await api.get('/audio/settings');
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);
  const response = await api.post('/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const replaceAudio = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);
  const response = await api.put('/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateAudioSettings = async (data) => {
  const response = await api.patch('/audio/settings', data);
  return response.data;
};

export const deleteAudio = async () => {
  const response = await api.delete('/audio');
  return response.data;
};

export const getAudioFileUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${backendBase}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
};

export default api;

