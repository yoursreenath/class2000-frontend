import axios from 'axios'

// In production (Vercel), VITE_API_URL points to your Render backend URL.
// In local dev, it falls back to '' so Vite proxy handles /api/* calls.
const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

export const memberApi = {
  getAll:  ()         => api.get('/members'),
  getById: (id)       => api.get(`/members/${id}`),
  search:  (q)        => api.get('/members/search', { params: { q } }),
  create:  (data)     => api.post('/members', data),
  update:  (id, data) => api.put(`/members/${id}`, data),
  delete:  (id)       => api.delete(`/members/${id}`),
}

export const photoApi = {
  getAll:  ()     => api.get('/photos'),
  create:  (data) => api.post('/photos', data),
  delete:  (id)   => api.delete(`/photos/${id}`),
}

export const eventApi = {
  getAll:    ()     => api.get('/events'),
  getUpcoming: ()   => api.get('/events/upcoming'),
  create:    (data) => api.post('/events', data),
  rsvp:      (id)   => api.put(`/events/${id}/rsvp`),
  delete:    (id)   => api.delete(`/events/${id}`),
}

export const discussionApi = {
  getAll:     ()           => api.get('/discussions'),
  getById:    (id)         => api.get(`/discussions/${id}`),
  create:     (data)       => api.post('/discussions', data),
  like:       (id)         => api.put(`/discussions/${id}/like`),
  delete:     (id)         => api.delete(`/discussions/${id}`),
  getComments:(postId)     => api.get(`/discussions/${postId}/comments`),
  addComment: (postId, data) => api.post(`/discussions/${postId}/comments`, data),
}

export const newsApi = {
  getAll:  ()     => api.get('/news'),
  create:  (data) => api.post('/news', data),
  delete:  (id)   => api.delete(`/news/${id}`),
}

// For file uploads (multipart) — uses full backend URL directly
export const uploadPhoto = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axios.post(`${BASE_URL}/api/upload/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  // Return full absolute URL so <img src> works from any host
  return `${BASE_URL}${res.data.url}`
}

export default api
