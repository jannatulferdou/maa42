import { auth } from "@/config/firebase.config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthContext = createContext<any>(null);

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const registerUser = (
    email: string,
    password: string
  ) => {
    return createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );
  };

  const loginUser = (
    email: string,
    password: string
  ) => {
    return signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  const resetPassword = (
    email: string
  ) => {
    return sendPasswordResetEmail(
      auth,
      email.trim().toLowerCase()
    );
  };

  // Helper function to fetch user from backend
  const fetchUserFromBackend = async (uid: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${uid}`);
      const data = await res.json();

      if (res.ok && data?.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to fetch from backend with retry
        let backendUser = null;
        let retryCount = 0;
        const maxRetries = 5;

        while (!backendUser && retryCount < maxRetries) {
          backendUser = await fetchUserFromBackend(firebaseUser.uid);

          if (!backendUser) {
            retryCount++;
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (backendUser) {
          setUser({
            ...firebaseUser,
            ...backendUser,
          });
        } else {
          setUser({
            ...firebaseUser,
            role: null,
            careStage: null,
          });
        }

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Force refresh user function
  const refreshUser = async () => {
    if (auth.currentUser) {
      setLoading(true);
      const backendUser = await fetchUserFromBackend(auth.currentUser.uid);
      if (backendUser) {
        setUser({
          ...auth.currentUser,
          ...backendUser,
        });
      }
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}