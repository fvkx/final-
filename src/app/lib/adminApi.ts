import { apiRequest } from './apiConfig';

export const authApi = {
  login: (credentials: any) => 
    apiRequest<any>('/auth.php', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  verifyToken: () =>
    apiRequest<any>('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'verify' })
    }),
  logout: () => {
    localStorage.removeItem('balingasag_admin_auth');
  }
};

export const inquiriesApi = {
  getAll: (page = 1, filters = { status: 'all', search: '' }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      status: filters.status,
      search: filters.search
    });
    return apiRequest<any>(`/inquiries.php?${params.toString()}`);
  },
  create: (data: any) =>
    apiRequest<any>('/inquiries.php', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateStatus: (id: number, status: string) =>
    apiRequest<any>('/inquiries.php', {
      method: 'PATCH',
      body: JSON.stringify({ id, status })
    }),
  delete: (id: number) =>
    apiRequest<any>(`/inquiries.php?id=${id}`, {
      method: 'DELETE'
    })
};

export const dashboardApi = {
  getStats: () => apiRequest<any>('/dashboard.php')
};

export const usersApi = {
  getAll: () => apiRequest<any>('/users.php'),
  create: (data: any) =>
    apiRequest<any>('/users.php', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  delete: (id: number) =>
    apiRequest<any>(`/users.php?id=${id}`, {
      method: 'DELETE'
    })
};

export const placesApi = {
  getAll: () => apiRequest<any>('/places.php'),
  create: (formData: FormData) =>
    apiRequest<any>('/places.php', {
      method: 'POST',
      body: formData
    }),
  delete: (id: number) =>
    apiRequest<any>(`/places.php?id=${id}`, {
      method: 'DELETE'
    })
};

export const contentApi = {
  getAll: (category?: string) => {
    const url = category ? `/content.php?category=${category}` : '/content.php';
    return apiRequest<any>(url);
  },
  getById: (id: number) => apiRequest<any>(`/content.php?id=${id}`),
  getBySlug: (slug: string) => apiRequest<any>(`/content.php?slug=${slug}`),
  savePage: (data: any) => 
    apiRequest<any>('/content.php', {
      method: 'POST',
      body: JSON.stringify({ ...data, action: 'save_page' })
    }),
  saveSections: (pageId: number, sections: any[]) =>
    apiRequest<any>('/content.php', {
      method: 'POST',
      body: JSON.stringify({ page_id: pageId, sections, action: 'save_sections' })
    }),
  delete: (id: number) =>
    apiRequest<any>(`/content.php?id=${id}`, {
      method: 'DELETE'
    })
};

export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<any>('/upload.php', {
      method: 'POST',
      body: formData
    });
  }
};

