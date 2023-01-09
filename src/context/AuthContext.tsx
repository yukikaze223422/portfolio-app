import { User } from "@firebase/auth-types";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
};

type Props = { children: ReactNode };
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const value: AuthContextType = {
    currentUser,
    loading,
  };

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user: User | null) => {
      console.log(user);
      setCurrentUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  if (loading) {
    return <p>loading...</p>;
  } else {
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
  }
};

type authProps = { children: JSX.Element };

const AuthUser = ({ children }: authProps) => {
  const { currentUser } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (currentUser !== null) {
      console.log(currentUser);
      return;
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return children;
};

export { useAuthContext, AuthProvider, AuthUser };
