import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

interface AuthContextType {
  auth: boolean | null;
  setAuth: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: User | null;
  logout: () => void;
  isAuth: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  logout: () => {},
  isAuth: () => {},
  user: null,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const isAuth = async () => {
    try {
      const token = localStorage.getItem("jwtToken"); 
      if (!token) {
        setUser(null);
        setAuth(false);
        setIsAdmin(false);
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/auth/get-info-from-token";

      const res = await axios.get(url, {
        headers: {
          Authorization: `${token}`, 
        },
      });

      const userData: User = res.data

      setUser(userData); 
      setAuth(true);
      setIsAdmin(userData.role == "ADMIN");
    } catch (error) {
      setUser(null); 
      setAuth(false); 
      setIsAdmin(false);
      localStorage.removeItem("jwtToken");
    }
  };

  useEffect(() => {
    isAuth();
  }, [auth]);

  const logout = () => {
    setUser(null);
    setAuth(false);
    setIsAdmin(false);
    localStorage.removeItem("jwtToken");
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, user, logout, isAuth, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
