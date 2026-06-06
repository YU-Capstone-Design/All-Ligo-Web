import { useState } from 'react';
import AuthContext from './AuthContext';
import { clearAuthToken } from '../apis/api';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: Boolean(localStorage.getItem('ownerAccessToken')),
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
    clearAuthToken();
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
