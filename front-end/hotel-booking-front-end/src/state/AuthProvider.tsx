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
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  logout: () => {},
  isAuth: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const isAuth = async () => {
    try {
      // Recupero del token JWT dal localStorage o un altro storage sicuro
      const token = localStorage.getItem("jwtToken"); // Oppure sessionStorage
      if (!token) {
        setUser(null);
        setAuth(false);
        return;
      }

      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/auth/get-info-from-token";

      // Richiesta con il token JWT nell'header Authorization
      const res = await axios.get(url, {
        headers: {
          Authorization: `${token}`, // Aggiunta del token nell'header
        },
      });

      setUser(res.data); // Aggiorna i dati dell'utente
      setAuth(true); // Indica che l'utente è autenticato
    } catch (error) {
      setUser(null); // Nessun utente autenticato
      setAuth(false); // Indica che l'utente non è autenticato
      localStorage.removeItem("jwtToken");
      alert("Session expired");
    }
  };

  useEffect(() => {
    isAuth();
  }, [auth]);

  const logout = () => {
    setUser(null);
    setAuth(false);
    localStorage.removeItem("jwtToken");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
