import React, { useEffect, useState } from 'react';
import type { AuthConfig } from '../interfaces/AuthConfig';
import AuthContext from './AuthContext';
import type { AuthProviderProps } from '../interfaces/AuthProviderProps';
import type { User } from '../interfaces/User';
import AuthService from '../services/AuthService';
import TokenStorage from '../utils/TokenStorage';

const AuthProvider: React.FC<AuthProviderProps> = ({ config, children }) => {
  const [currentConfig, setCurrentConfig] = useState<AuthConfig>(config);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authService, setAuthService] = useState<AuthService>();

  useEffect(() => {
    console.log('checking if authenticated');
    if (authService) {
      checkIfAuthenticated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authService]);

  useEffect(() => {
    return setAuthService(new AuthService(currentConfig));
  }, [currentConfig]);

  useEffect(() => {
    setCurrentConfig(config);
  }, [config]);

  const checkIfAuthenticated = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      await updateUser().then((user) => {
        if (user === null) {
          setUserIsAuthenticated(false);
        } else if (user.id) {
          setUserIsAuthenticated(true);
        }
      });
    } catch (error) {
      console.error('Fehler beim Überprüfen des Tokens:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, deviceName: string) => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.login(email, password, deviceName);
    } catch (error) {
      console.error('Fehler beim Einloggen:', error);
      throw error;
    }
  };

  const updateUser = async (): Promise<User | null> => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.getUser().then((fetchedUser) => {
        setCurrentUser(fetchedUser);
        return fetchedUser;
      });
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzers:', error);
      throw error;
    }
  };

  const setUserIsAuthenticated = (userIsAuthenticated: boolean): void => {
    setIsAuthenticated(userIsAuthenticated);
  };

  const getToken = async () => {
    return await TokenStorage.getToken()
      .then((apiToken) => {
        return apiToken;
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen des Tokens:', error);
        throw error;
      })
      .finally(() => {
        return null;
      });
  };

  const logout = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.logout();
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getToken,
        currentUser,
        updateUser,
        isAuthenticated,
        setUserIsAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
