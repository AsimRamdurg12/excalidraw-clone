import { createContext, useContext } from "react";

export interface tokenProps {
  token: string;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<tokenProps>({
  token: "",
  setToken: () => {},
});

export default function useAuth() {
  return useContext(AuthContext);
}
