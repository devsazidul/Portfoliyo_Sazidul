import { useAuth } from "@/context/auth-context";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ component: Component, ...rest }: any) {
    const { isAuthenticated, token } = useAuth();

    // Wait for token check (if using async auth check, but here context initializes from localStorage mostly synchronously)
    // However, simple check:

    if (!isAuthenticated && !token) {
        return <Redirect to="/admin/login" />;
    }

    return <Component />;
}
