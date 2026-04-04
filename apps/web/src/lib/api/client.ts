const API_BASE_URL = "http://localhost:3001"

interface ApiError extends Error {
  status?: number
  data?: unknown
}

class ApiClient {
  public baseURL: string
  private internalBaseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.internalBaseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.internalBaseURL}${endpoint}`
    
    // Check if body is FormData - don't set Content-Type, browser will set it with boundary
    const isFormData = options.body instanceof FormData
    
    const headers: Record<string, string> = {}
    
    // Only set Content-Type to application/json if not FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }
    
    // Merge with any provided headers (they take precedence)
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          headers[key] = String(value)
        }
      })
    }
    
    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = new Error(`API Error: ${response.status}`) as ApiError
      error.status = response.status
      try {
        error.data = await response.json()
      } catch {
        error.data = await response.text()
      }
      throw error
    }

    if (response.status === 204) {
      return null as T
    }

    return response.json()
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    // Don't stringify if it's FormData
    const requestBody = body instanceof FormData ? body : JSON.stringify(body)
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: requestBody,
    })
  }

  put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    // Don't stringify if it's FormData
    const requestBody = body instanceof FormData ? body : JSON.stringify(body)
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: requestBody,
    })
  }

  patch<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    // Don't stringify if it's FormData
    const requestBody = body instanceof FormData ? body : JSON.stringify(body)
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: requestBody,
    })
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export const api = new ApiClient(API_BASE_URL)
