import { createContext } from 'react';
import type { AuthContextType } from '../interfaces/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
