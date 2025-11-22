"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
    user: null,
    userData: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Stores role and profile from Firestore
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch user role and data from Firestore
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    // New user, userData will be null until they complete onboarding
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Check if user exists in DB, if not, they might need to go to onboarding
            const userDoc = await getDoc(doc(db, "users", result.user.uid));
            if (!userDoc.exists()) {
                // Redirect to role selection or onboarding if not set
                // For now, we assume the user selects role on landing page, 
                // but for a generic login, we might need a "select role" screen.
                // We'll handle this in the UI components.
            }
            return result.user;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
