import { useState, type ReactNode } from "react";
import { AuthContext, type tokenProps } from "./AuthContext";

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState("");

  const ProviderValue: tokenProps = {
    token,
    setToken,
  };

  return (
    <AuthContext.Provider value={ProviderValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
