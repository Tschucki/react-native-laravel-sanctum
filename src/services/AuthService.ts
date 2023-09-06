import TokenStorage from '../utils/TokenStorage';
import type { AuthConfig, User } from 'react-native-laravel-sanctum';

class AuthService {
  private readonly config: AuthConfig | null;
  private csrfToken: string | null = null; // CSRF-Token speichern

  constructor(authConfig: AuthConfig) {
    if (authConfig === null) {
      throw new Error('AuthConfig is null');
    }
    this.config = authConfig;
  }

  private async handleResponse(response: Response): Promise<void> {
    if (!response.ok) {
      throw new Error('Request was not successful');
    }
  }

  private async fetchCSRFToken() {
    try {
      if (!this.config || !this.config.csrfTokenUrl) {
        return;
      }

      const response = await fetch(this.config.csrfTokenUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await this.handleResponse(response);

      // Extrahieren des CSRF-Tokens aus dem Set-Cookie-Header
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        const csrfTokenMatch = setCookieHeader.match(/XSRF-TOKEN=([^;]*)/);
        if (csrfTokenMatch) {
          this.csrfToken = csrfTokenMatch[1] ?? null;
        }
      }
    } catch (error) {
      console.error('Error while fetching CSRF token:', error);
      throw error;
    }
  }

  private async getRequestHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.csrfToken) {
      headers['X-XSRF-TOKEN'] = this.csrfToken;
    }

    const currentToken = await TokenStorage.getToken();
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    return headers;
  }

  async login(
    email: string,
    password: string,
    deviceName: string
  ): Promise<boolean> {
    try {
      if (!this.config) {
        throw new Error('Authentication configuration is missing');
      }

      if (this.config.csrfTokenUrl) {
        await this.fetchCSRFToken();
      }

      const response = await fetch(this.config.loginUrl, {
        method: 'POST',
        headers: await this.getRequestHeaders(),
        body: JSON.stringify({
          email,
          password,
          deviceName,
        }),
      });

      await this.handleResponse(response);

      const data = await response.json();
      const { token } = data;

      if (token) {
        await TokenStorage.saveToken(token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (!this.config) {
        throw new Error('Authentication configuration is missing');
      }

      if (this.config.csrfTokenUrl) {
        await this.fetchCSRFToken();
      }

      const currentToken = await TokenStorage.getToken();

      if (currentToken === null) {
        return true;
      }

      const response = await fetch(this.config.logoutUrl, {
        method: 'POST',
        headers: await this.getRequestHeaders(),
      });

      await this.handleResponse(response);
      await TokenStorage.removeToken();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      if (!this.config) {
        throw new Error('Authentication configuration is missing');
      }

      const currentToken = await TokenStorage.getToken();

      if (currentToken === null) {
        return null;
      }

      if (this.config.csrfTokenUrl) {
        await this.fetchCSRFToken();
      }

      const response = await fetch(this.config.userUrl, {
        method: 'GET',
        headers: await this.getRequestHeaders(),
      });

      await this.handleResponse(response);

      const user = await response.json();

      if (user) {
        this.csrfToken = null;
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error while fetching user:', error);
      throw error;
    }
  }
}

export default AuthService;
