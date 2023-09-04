import TokenStorage from '../utils/TokenStorage';
import type { AuthConfig, User } from 'react-native-laravel-sanctum';

class AuthService {
  private readonly config: AuthConfig | null;

  constructor(authConfig: AuthConfig) {
    if (authConfig === null) {
      throw new Error('AuthConfig is null');
    }
    this.config = authConfig;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      throw new Error('The request was not successful');
    }
  }

  async login(
    email: string,
    password: string,
    deviceName: string
  ): Promise<boolean> {
    try {
      if (!this.config) {
        throw new Error('AuthConfig is null');
      }

      const response = await fetch(this.config.loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('Fehler beim Einloggen:', error);
      throw error;
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (!this.config) {
        throw new Error('AuthConfig is null');
      }

      const currentToken = await TokenStorage.getToken();

      if (currentToken === null) {
        return true;
      }

      const response = await fetch(this.config.logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      await this.handleResponse(response);
      await TokenStorage.removeToken();
      return true;
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      if (!this.config) {
        throw new Error('AuthConfig is null');
      }

      const currentToken = await TokenStorage.getToken();

      if (currentToken === null) {
        return null;
      }

      const response = await fetch(this.config.userUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      await this.handleResponse(response);

      const user = await response.json();

      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzers:', error);
      throw error;
    }
  }
}

export default AuthService;
