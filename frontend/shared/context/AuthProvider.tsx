import { auth } from "@/config/firebase.config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const registerUser = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );
  };

  const loginUser = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(
    auth,
    email.trim().toLowerCase()
  );
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}