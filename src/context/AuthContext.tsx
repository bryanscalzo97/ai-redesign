import { authClient } from "@/lib/auth-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  user: { id: string; name: string; email: string; image?: string | null } | null;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isOnboarded: false,
  setIsOnboarded: () => {},
  user: null,
});

const ONBOARDED_KEY = "app:isOnboarded";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const isAuthenticated = !!session.data?.user;
  const user = session.data?.user ?? null;

  const [isOnboarded, setIsOnboardedState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      if (value === "true") {
        setIsOnboardedState(true);
      }
      setLoaded(true);
    });
  }, []);

  const setIsOnboarded = (value: boolean) => {
    setIsOnboardedState(value);
    AsyncStorage.setItem(ONBOARDED_KEY, value ? "true" : "false");
  };

  if (!loaded) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        setIsOnboarded,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
