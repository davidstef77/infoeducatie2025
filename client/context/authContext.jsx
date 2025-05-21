import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifică dacă există un token și datele utilizatorului stocate
    try {
      const token = localStorage.getItem('log-in-token');
      const storedUser = localStorage.getItem('user-data');

      // Dacă token-ul și datele utilizatorului sunt disponibile, setează starea de autentificare
      if (token && storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Eroare la încărcarea utilizatorului:", error);
    } finally {
      setLoading(false); // Oprește încărcarea când datele au fost procesate
    }
  }, []);

  const login = (userData) => {
    if (userData.token) {
      localStorage.setItem('log-in-token', userData.token); // Salvează token-ul
    }
    localStorage.setItem('user-data', JSON.stringify(userData)); // Salvează datele utilizatorului
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('log-in-token');
    localStorage.removeItem('user-data');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth trebuie folosit în interiorul AuthProvider');
  }
  return context;
};

export default AuthContext;
