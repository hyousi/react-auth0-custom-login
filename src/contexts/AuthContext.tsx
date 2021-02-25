import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthOptions, WebAuth } from 'auth0-js';
import { useHistory } from 'react-router-dom';

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  authResult: any;
  login: (username: string, password: string) => Promise<any>;
  signup: (username: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const initialAuthState: AuthContextProps = {
  isAuthenticated: false,
  loading: false,
  authResult: null,
  login: () => new Promise((resolve) => resolve(null)),
  signup: () => new Promise((resolve) => resolve(null)),
  logout: () => new Promise((resolve) => resolve(null)),
};

const AuthContext = createContext<AuthContextProps>(initialAuthState);

export function useAuth() {
  return useContext(AuthContext);
}

/** refactor useState to useReducer! */
export function AuthProvider(props: React.PropsWithChildren<AuthOptions>) {
  const { children, ...options } = props;
  const webAuth = new WebAuth(options);
  const history = useHistory();
  const [authResult, setAuthResult] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* add auth0 callback listener to parse & store auth0 response. */
  useEffect(() => {
    webAuth.parseHash((error, result) => {
      if (error) {
        alert(error.description);
      }
      if (result) {
        console.log('on parseHash');
        console.log(result);
        setAuthResult(result);
        setIsAuthenticated(true);
        history.push('/');
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
    return new Promise((resolve, reject) => {
      webAuth.signup({email, password, connection: "Username-Password-Authentication"}, (error) => {
        if (error) {
          reject(new Error(error.error_description));
        } else {
          return login(email, password);
        }
      })
    })
  }

  function logout() {
    return Promise.resolve("logout");
  }

  return (
    <AuthContext.Provider
      value={{
        ...initialAuthState,
        isAuthenticated,
        authResult,
        login,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
