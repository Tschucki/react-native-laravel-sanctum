import { type AuthConfig } from './AuthConfig';
import { type ReactNode } from 'react';

export interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
}
