import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "app_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Load user from localStorage initially
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(!user); // loading only if no cached user

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        setLoading(false);
        return;
      }

      // Check if we already have user in localStorage
      const cachedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return;
      }

      // Fetch user from Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      let snap = await getDoc(userRef);
      console.log(snap)

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: firebaseUser.email,
          role: "ADMIN",
          active: true,
          createdAt: new Date(),
        });
        snap = await getDoc(userRef);
      }

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: snap.data().role,
      };

      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
