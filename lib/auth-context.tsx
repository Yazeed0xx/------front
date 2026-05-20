import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { api, setAuthToken, clearAuthToken, initializeToken, getErrorMessage } from '@/utils/api';
import type {
  AuthState,
  AuthContextType,
  User,
  Company,
  LoginResponse,
  RegisterResponse,
  CompanyProfileResponse,
  RegisterFormData,
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  company: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Fetch company profile with token
  const fetchCompanyProfile = useCallback(async (): Promise<{
    user: User;
    company: Company;
  } | null> => {
    try {
      const response = await api.get<CompanyProfileResponse>('/api/companies/me');
      return {
        user: response.data.data.user,
        company: response.data.data.company,
      };
    } catch {
      return null;
    }
  }, []);

  // Initialize auth on app start
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await initializeToken();
        if (token) {
          const profile = await fetchCompanyProfile();
          if (profile) {
            setState({
              user: profile.user,
              company: profile.company,
              token,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
        }
        // No token or invalid token
        await clearAuthToken();
        setState({
          ...initialState,
          isLoading: false,
        });
      } catch {
        await clearAuthToken();
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    initialize();
  }, [fetchCompanyProfile]);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await api.post<LoginResponse>('/api/companies/login', {
      email,
      password,
    });

    const { token, user, company } = response.data.data;
    await setAuthToken(token.token);

    setState({
      user,
      company,
      token: token.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterFormData): Promise<void> => {
    const formData = new FormData();

    // Determine PDF file URI
    let pdfUri = data.registrationNumberPdf;

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'registrationNumberPdf') return; // handled separately

      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    if (pdfUri && pdfUri.length > 0) {
      formData.append('registrationNumberPdf', {
        uri: pdfUri,
        name: pdfUri.split('/').pop() || 'registration.pdf',
        type: 'application/pdf',
      } as any);
    }

    const baseURL = api.defaults.baseURL || 'http://localhost:3333';
    const url = `${baseURL}/api/companies/register`;
    console.log('[Register] URL:', url);
    console.log('[Register] Has file:', !!pdfUri);

    let fetchResponse;
    try {
      fetchResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      console.log('[Register] Status:', fetchResponse.status);
    } catch (fetchError: any) {
      console.log('[Register] Fetch error:', fetchError?.message, fetchError);
      throw fetchError;
    }

    const responseText = await fetchResponse.text();
    console.log('[Register] Response body:', responseText);

    if (!fetchResponse.ok) {
      let errorMsg = `Request failed with status ${fetchResponse.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMsg =
          errorData?.error?.message ||
          errorData?.message ||
          errorData?.error?.details?.[0]?.message ||
          errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const response = JSON.parse(responseText) as RegisterResponse;
    const { token, user, company } = response.data;
    await setAuthToken(token.token);

    setState({
      user,
      company,
      token: token.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post('/api/companies/logout');
    } catch {
      // Ignore logout API errors
    } finally {
      await clearAuthToken();
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  }, []);

  // Refresh company profile
  const refreshCompany = useCallback(async (): Promise<void> => {
    const profile = await fetchCompanyProfile();
    if (profile) {
      setState((prev) => ({
        ...prev,
        user: profile.user,
        company: profile.company,
      }));
    }
  }, [fetchCompanyProfile]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshCompany,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if company is approved
export function useIsApproved(): boolean {
  const { company } = useAuth();
  return company?.status === 'approved';
}

// Hook to get company status
export function useCompanyStatus(): string | null {
  const { company } = useAuth();
  return company?.status ?? null;
}
