import { authClient } from "@/lib/auth-client";
import { createContext } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const isAuthenticated = !!session.data?.user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
