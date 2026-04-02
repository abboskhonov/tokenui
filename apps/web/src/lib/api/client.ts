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
    
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export const api = new ApiClient(API_BASE_URL)
