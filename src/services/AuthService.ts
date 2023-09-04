import TokenStorage from '../utils/TokenStorage';
import type { AuthConfig, User } from 'react-native-laravel-sanctum';

class AuthService {
  private static config: AuthConfig | null = null;

  public constructor(authConfig: AuthConfig) {
    if (authConfig === null) throw new Error('AuthConfig is null');
    AuthService.config = authConfig;
  }

  async login(
    email: string,
    password: string,
    deviceName: string
  ): Promise<boolean | null> {
    try {
      if (AuthService.config === null) throw new Error('AuthConfig is null');

      const response = await fetch(AuthService.config.loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          deviceName: deviceName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        if (token) {
          await TokenStorage.saveToken(token);
          return true;
        } else {
          return false;
        }
      } else {
        throw new Error('The request was not successful');
      }
    } catch (error) {
      console.error('Fehler beim Einloggen:', error);
      throw error;
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (AuthService.config === null) throw new Error('AuthConfig is null');
      const currentToken = await TokenStorage.getToken();
      if (currentToken === null) return true;

      const response = await fetch(AuthService.config.logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        await TokenStorage.removeToken();
        return true;
      } else {
        throw new Error('The request was not successful');
      }
    } catch (error) {
      console.error('Fehler beim Einloggen:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    if (AuthService.config === null) throw new Error('AuthConfig is null');
    const currentToken = await TokenStorage.getToken();
    if (currentToken === null) return null;
    console.log(`Bearer ${currentToken}`);
    try {
      const response = await fetch(AuthService.config.userUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        if (user) {
          return user;
        } else {
          return null;
        }
      } else if (response.status === 401) {
        await TokenStorage.removeToken();
        return null;
      } else {
        throw new Error('The request was not successful');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzers:', error);
      throw error;
    }
  }
}

export default AuthService;
