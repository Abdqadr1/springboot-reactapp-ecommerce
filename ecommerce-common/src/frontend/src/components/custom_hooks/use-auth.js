import { createContext } from "react";

export const setAuthToLocalStorage = (auth) => {
    localStorage.setItem("user", JSON.stringify(auth));
  };

export const getAuthFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
export const AuthContext =  createContext({ auth: {}, setAuth: () => { } });