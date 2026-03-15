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
  update:    (id, data) => api.put(`/events/${id}`, data),
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
  update:  (id, data) => api.put(`/news/${id}`, data),
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
  const url = res.data.url
  // Cloudinary returns an absolute https:// URL — use it directly.
  // Local dev returns a relative /api/upload/files/... — prepend backend base.
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

export default api

export const teacherApi = {
  getAll:  ()         => api.get('/teachers'),
  getById: (id)       => api.get(`/teachers/${id}`),
  search:  (q)        => api.get('/teachers/search', { params: { q } }),
  create:  (data)     => api.post('/teachers', data),
  update:  (id, data) => api.put(`/teachers/${id}`, data),
  delete:  (id)       => api.delete(`/teachers/${id}`),
}

export const initiativeApi = {
  getAll:  ()         => api.get('/initiatives'),
  create:  (data)     => api.post('/initiatives', data),
  update:  (id, data) => api.put(`/initiatives/${id}`, data),
  delete:  (id)       => api.delete(`/initiatives/${id}`),
}

export const getTogetherApi = {
  getAll:  ()         => api.get('/get-togethers'),
  create:  (data)     => api.post('/get-togethers', data),
  update:  (id, data) => api.put(`/get-togethers/${id}`, data),
  delete:  (id)       => api.delete(`/get-togethers/${id}`),
}

export const getTogetherPhotosApi = {
  getByAlbum: (gtId)  => api.get(`/photos/get-together/${gtId}`),
}
