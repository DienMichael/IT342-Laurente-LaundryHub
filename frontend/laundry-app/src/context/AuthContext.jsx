import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
const DEVELOPMENT_MODE = false; // Set to false to persist login

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    // Clear storage in development mode to always start fresh
    if (DEVELOPMENT_MODE) {
      localStorage.removeItem('laundry_user');
      localStorage.removeItem('laundry_token');
    }

    const savedUser = localStorage.getItem('laundry_user');
    const savedToken = localStorage.getItem('laundry_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password, role = 'customer') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role.toUpperCase(),
        }),
      });

      let data;
      try {
        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);

        if (!responseText) {
          throw new Error(`Server returned empty response (status ${response.status})`);
        }

        // Backend should return JSON (AuthResponse). If it doesn't, this will throw.
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Registration response parse error:', parseError);

        // Surface empty-response error directly.
        if (parseError?.message?.startsWith('Server returned empty response')) {
          throw parseError;
        }

        // If backend returned HTML (500 error page) or something non-JSON, show that.
        throw new Error('Server returned invalid JSON: ' + (parseError?.message || 'Unable to parse response'));
      }



      if (!response.ok) {
        const errorMessage = data.message || data.error?.message || 'Registration failed';
        throw new Error(errorMessage);
      }

      // Store user data (no token on register)
      localStorage.setItem('laundry_user', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
      }));

      setUser({
        name: data.name,
        email: data.email,
        role: data.role,
      });

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error instanceof TypeError 
        ? 'Failed to connect to server. Make sure backend is running on ' + API_BASE_URL
        : error.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);
        
        if (!responseText) {
          throw new Error('Server returned empty response');
        }
        
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);

        // If the server body was empty, show that directly (don't re-wrap as invalid JSON).
        if (parseError?.message === 'Server returned empty response') {
          throw parseError;
        }

        throw new Error('Server returned invalid JSON: ' + (parseError?.message || 'Unable to parse response'));
      }


      if (!response.ok) {
        throw new Error(data.message || data.error?.message || 'Invalid credentials');
      }

      // Store token and user data
      localStorage.setItem('laundry_token', data.accessToken);
      localStorage.setItem('laundry_user', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
      }));

      setToken(data.accessToken);
      setUser({
        name: data.name,
        email: data.email,
        role: data.role,
      });

      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof TypeError 
        ? 'Failed to connect to server. Make sure backend is running on ' + API_BASE_URL
        : error.message || 'Login failed';
      return { success: false, message };
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      let data;
      try {
        const responseText = await response.text();
        if (!responseText) {
          // Show server status + avoid JSON.parse crash
          throw new Error(`Empty response from server (status ${response.status})`);
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // If server returns non-JSON (e.g., 501 page or stacktrace), surface it
        throw new Error(parseError.message || 'Google login failed');
      }


      if (!response.ok) {
        throw new Error(data.message || data.error?.message || 'Google login failed');
      }

      // Store token and user data
      localStorage.setItem('laundry_token', data.accessToken);
      localStorage.setItem('laundry_user', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role || 'customer',
      }));

      setToken(data.accessToken);
      setUser({
        name: data.name,
        email: data.email,
        role: data.role || 'customer',
      });

      return { success: true, message: 'Google login successful' };
    } catch (error) {
      console.error('Google login error:', error);
      const message = error instanceof TypeError 
        ? 'Failed to connect to server. Make sure backend is running on ' + API_BASE_URL
        : error.message || 'Google login failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('laundry_token');
    localStorage.removeItem('laundry_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
