import { useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    username: '',
    role: '', 
  });

  const login = (name, role) => {
    setAuth({
      isLoggedIn: true,
      username: name,
      role,
    });
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      username: '',
      role: '',
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
