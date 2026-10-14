// REST API Service for Student Management System
// Connects to Spring Boot backend at /api/students

const getBaseUrl = () => {
  // If running via Vite dev server proxy or same origin, use relative path
  if (typeof window !== 'undefined') {
    const isDevPort = window.location.port && window.location.port !== '8080' && window.location.port !== '';
    // Vite proxy forwards /api to http://localhost:8080 automatically
    return '/api/students';
  }
  return 'http://localhost:8080/api/students';
};

const API_BASE = getBaseUrl();

export const studentApi = {
  // Fetch all students (with optional search query)
  async getAll(search = '') {
    const url = search ? `${API_BASE}?search=${encodeURIComponent(search.trim())}` : API_BASE;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await parseError(res);
      throw new Error(err);
    }
    return res.json();
  },

  // Fetch student by ID
  async getById(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const err = await parseError(res);
      throw new Error(err);
    }
    return res.json();
  },

  // Create / Enroll new student
  async create(studentData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) {
      const err = await parseError(res);
      throw new Error(err);
    }
    return res.json();
  },

  // Update existing student
  async update(id, studentData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) {
      const err = await parseError(res);
      throw new Error(err);
    }
    return res.json();
  },

  // Delete student
  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const err = await parseError(res);
      throw new Error(err);
    }
    return res.json();
  },

  // Get aggregated stats (total count, department breakdown)
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const err = await parseError(res);
      throw new Error(err);
    }
    return res.json();
  },

  // Ping backend health/connectivity
  async ping() {
    const res = await fetch(`${API_BASE}/stats`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    return res.ok;
  },
};

async function parseError(response) {
  try {
    const data = await response.json();
    return data.message || `HTTP ${response.status}: ${response.statusText}`;
  } catch {
    return `HTTP ${response.status}: ${response.statusText}`;
  }
}
