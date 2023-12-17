import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthProvider, useAuth } from 'react-native-laravel-sanctum';

function Login() {
  const {
    login,
    getToken,
    updateUser,
    setUserIsAuthenticated,
    isAuthenticated,
    currentUser,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = async () => {
    console.log(await getToken());
    const tokenObtained = await login(email, password, 'Test-Device');
    console.log(tokenObtained);
    if (tokenObtained) {
      const user = await updateUser();
      if (user && user.id) {
        setUserIsAuthenticated(true);
      }
    }
  };

  return (
    <View style={styles.view}>
      <Text style={styles.caption}>You are not logged in.</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        placeholder="Password"
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

function Logout() {
  const { logout, setUserIsAuthenticated, updateUser, currentUser } = useAuth();

  const handleLogout = async () => {
    const isLoggedOut = await logout();
    if (isLoggedOut) {
      setUserIsAuthenticated(false);
      await updateUser();
    }
  };

  return (
    <View style={styles.view}>
      <Text style={styles.caption}>
        You are logged in as {currentUser ? currentUser.name : ''}
      </Text>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

function Example() {
  const { isAuthenticated } = useAuth();
  return (
    <View style={styles.view}>{isAuthenticated ? <Logout /> : <Login />}</View>
  );
}

export default function App() {
  const config = {
    loginUrl: 'http://127.0.0.1:8000/api/sanctum/token',
    logoutUrl: 'http://127.0.0.1:8000/api/logout',
    userUrl: 'http://127.0.0.1:8000/api/user',
  };

  return (
    <AuthProvider config={config}>
      <View style={styles.container}>
        <Example />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#f59e0b',
    padding: 12,
    minWidth: '80%',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '800',
    letterSpacing: 0.5,
    lineHeight: 20,
    color: '#fff',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    minWidth: '80%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  caption: {
    marginBottom: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    lineHeight: 20,
    color: '#000',
    textAlign: 'center',
  },
  view: {
    padding: 15,
    alignItems: 'center',
  },
});
