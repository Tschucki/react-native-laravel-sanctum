export interface AuthConfig {
  loginUrl: string;
  logoutUrl: string;
  userUrl: string;
  csrfTokenUrl?: string | null;
}
