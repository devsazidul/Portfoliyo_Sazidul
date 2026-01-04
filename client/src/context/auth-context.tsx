import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: {
        image: string | null;
    };
}

interface AuthContextType {
    token: string | null;
    user: UserProfile | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<UserProfile | null>(null);
    const [location, setLocation] = useLocation();

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            // Fetch user profile
            fetchUserProfile();
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        if (!token) return;
        try {
            const res = await apiRequest("GET", "/api/users/me/");
            const userData = await res.json();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // Optional: Logout if token is invalid
        }
    };

    const login = (newToken: string) => {
        setToken(newToken);
        setLocation("/admin/dashboard");
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setLocation("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, refreshUser: fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
