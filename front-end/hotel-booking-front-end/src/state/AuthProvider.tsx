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
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  logout: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const isAuth = async () => {
      try {
        // Recupero del token JWT dal localStorage o un altro storage sicuro
        const token = localStorage.getItem("jwtToken"); // Oppure sessionStorage
        if (!token) {
          setUser(null);
          setAuth(false);
          return;
        }

        // Richiesta con il token JWT nell'header Authorization
        const res = await axios.get(
          "http://localhost:8080/api/v1/auth/get-info-from-token",
          {
            headers: {
              Authorization: `${token}`, // Aggiunta del token nell'header
            },
          }
        );

        console.log(res.data);
        setUser(res.data); // Aggiorna i dati dell'utente
        setAuth(true); // Indica che l'utente è autenticato
      } catch (error) {
        setUser(null); // Nessun utente autenticato
        setAuth(false); // Indica che l'utente non è autenticato
      }
    };

    isAuth();
  }, [auth]);

  const logout = () => {
    setUser(null);
    setAuth(false);
    localStorage.removeItem("jwtToken"); // Or sessionStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
