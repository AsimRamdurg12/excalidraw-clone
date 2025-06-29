import useAuth from "../context/AuthContext";

const useLoggedIn = () => {
  const { token } = useAuth();

  return !!token;
};

export default useLoggedIn;
