# React Native Laravel Sanctum

React Native auth package for [Laravel Sanctum ](https://laravel.com/docs/10.x/sanctum) integration. While this package is mainly build for Laravel Sanctum APIs, you can use this library for other API-Backends as well.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Example App](#example-app)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- [x] Login
- [x] Logout
- [x] Get current user
- [x] Check if user is authenticated
- [x] CSRF-Token

## Installation

```sh
npm install react-native-laravel-sanctum
```
### Install native dependencies
As the package relies on `expo-secure-store` you will need to create a new build of your app to use it.

## Basic Usage

Wrap your app with `AuthProvider` and pass the `config` object as a prop.

Make sure your validation rules, within your controller look like this: 
```php
[
  'email' => 'required|email',
  'password' => 'required',
  'deviceName' => 'required',
];
```

```js
import { AuthProvider } from 'react-native-laravel-sanctum';


export default function App() {
  const config = {
    loginUrl: 'https://your-awesome-domain/api/sanctum/token',
    logoutUrl: 'https://your-awesome-domain/api/logout',
    userUrl: 'https://your-awesome-domain/api/user',
    csrfTokenUrl: 'https://your-awesome-domain/sanctum/csrf-cookie'
  };

  return (
    <AuthProvider config={config}>
      <View>
        ...
      </View>
    </AuthProvider>
  );
}
```

You can now use the `useAuth` hook within the AuthProvider to access the auth methods.
    
```js
import { useAuth } from 'react-native-laravel-sanctum';

export default function Login() {
  const { login, getToken, updateUser, setUserIsAuthenticated, isAuthenticated, logout, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const tokenObtained = await login(email, password, 'Test-Device');
    if (tokenObtained) {
      const user = await updateUser();

      if (user.id) {
        setUserIsAuthenticated(true);
      }
    }
  };

  return (
    <View>
      <Text >You are not logged in.</Text>
      <TextInput
        onChangeText={text => setEmail(text)}
        value={email}
        placeholder='Email'
      />
      <TextInput
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
        placeholder='Password'
      />
      <Pressable onPress={handleLogin}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}
```

## Example App

You can find the example app [here](https://github.com/Tschucki/react-native-laravel-sanctum-example-app).

## Documentation

You can find the documentation [here](https://github.com/Tschucki/react-native-laravel-sanctum/wiki).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
