/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_CLIENT_ID: string;
    readonly REACT_APP_AUTH0_DOMAIN: string;
  }
}
