import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Coordinator {
  name: string;
}

interface AuthContextType {
  coordinator: Coordinator | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const VALID_COORDINATORS = ["Aniket", "Mansi", "Bajrang", "Rushikesh", "Priya", "Parshuram"];
const VALID_PASSWORD = "123";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("coordinator");
    if (stored) {
      setCoordinator(JSON.parse(stored));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const normalizedUsername = username.trim();
    const matchedCoordinator = VALID_COORDINATORS.find(
      (c) => c.toLowerCase() === normalizedUsername.toLowerCase()
    );

    if (matchedCoordinator && password === VALID_PASSWORD) {
      const coord = { name: matchedCoordinator };
      setCoordinator(coord);
      sessionStorage.setItem("coordinator", JSON.stringify(coord));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCoordinator(null);
    sessionStorage.removeItem("coordinator");
  };

  return (
    <AuthContext.Provider
      value={{
        coordinator,
        login,
        logout,
        isAuthenticated: !!coordinator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
