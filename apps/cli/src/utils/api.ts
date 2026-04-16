export async function makeApiRequest(
  url: string, 
  token?: string, 
  options: RequestInit = {}
): Promise<unknown> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Only add auth header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    
    // Provide user-friendly error messages for common cases
    if (response.status === 404) {
      throw new Error('Skill not found');
    }
    if (response.status === 401) {
      throw new Error('Authentication required - please run "tasteui login"');
    }
    if (response.status === 403) {
      throw new Error('Access denied - you do not have permission to access this skill');
    }
    if (response.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
}
