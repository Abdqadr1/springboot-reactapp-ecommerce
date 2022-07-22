import { createContext } from "react";

export const setAuthToLocalStorage = (auth) => {
    localStorage.setItem("customer", JSON.stringify(auth));
  };

export const getAuthFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("customer"));
  };
export const AuthContext =  createContext({ auth: {}, setAuth: () => { } });