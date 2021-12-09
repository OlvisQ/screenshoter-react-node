import React, { createContext } from 'react';
import { useSelector } from 'react-redux';

export const UserContext = createContext({ user: null });

const AuthProvider = ({ children }) => {
  const user = useSelector(state => state.auth.user);
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;
