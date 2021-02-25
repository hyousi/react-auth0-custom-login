import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { AuthOptions, WebAuth } from 'auth0-js';
import { useHistory } from 'react-router-dom';

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  signup: (username: string, password: string) => Promise<any>;
}

const initialAuthState: AuthContextProps = {
  isAuthenticated: false,
  loading: false,
  login: () => new Promise((resolve) => resolve(null)),
  signup: () => new Promise((resolve) => resolve(null)),
};

const AuthContext = createContext<AuthContextProps>(initialAuthState);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: React.PropsWithChildren<AuthOptions>) {
  const { children, ...options } = props;
  const webAuth = new WebAuth(options);
  const history = useHistory();

  /* add auth0 callback listener to parse & store auth0 response. */
  useEffect(() => {
    webAuth.parseHash((error, result) => {
      if (error) {
        alert(error.description);
      }
      if (result) {
        console.log('on parseHash');
        console.log(result);
        history.replace('/');
      }
    });
  }, []);

  function login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      webAuth.login({ email, password }, (err, authResult) => {
        if (err) {
          reject(new Error(err.error_description));
        } else if (!authResult) {
          reject(new Error('login with no authResult!'));
        }
        resolve(authResult);
      });
    });
  }

  function signup(email: string, password: string) {
    return Promise.resolve("success");
  }

  return (
    <AuthContext.Provider
      value={{
        ...initialAuthState,
        login,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
