export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/admin';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const tokenStr = localStorage.getItem('balingasag_admin_auth');
  let token = '';
  
  if (tokenStr) {
    try {
      const authData = JSON.parse(tokenStr);
      token = authData.token || '';
    } catch (e) {
      // invalid JSON
    }
  }

  // To support FormData for image uploads, don't set Content-Type if body is FormData
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to parse error message
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch(e) {}
    
    throw new Error(`API Error: ${errorMessage}`);
  }

  return response.json();
}
