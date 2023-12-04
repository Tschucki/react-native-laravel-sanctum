import * as SecureStore from 'expo-secure-store';

class TokenStorage {
  private static readonly TOKEN_KEY = 'authToken';

  static async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TokenStorage.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error while saving the encrypted token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      const encryptedToken = await SecureStore.getItemAsync(
        TokenStorage.TOKEN_KEY
      );
      return encryptedToken || null;
    } catch (error) {
      console.error('Error while retrieving the encrypted token:', error);
      throw error;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TokenStorage.TOKEN_KEY);
    } catch (error) {
      console.error('Error while removing the encrypted token:', error);
      throw error;
    }
  }
}

export default TokenStorage;
