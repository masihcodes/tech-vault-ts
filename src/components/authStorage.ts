import { AuthCredentials } from './authTypes';

const AUTH_KEY = 'tech-vault-auth';

export function getAuthCredentials(): AuthCredentials | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthCredentials;
  } catch {
    return null;
  }
}

export function setAuthCredentials(credentials: AuthCredentials): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(credentials));
}

export function clearAuthCredentials(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  return getAuthCredentials() !== null;
}
