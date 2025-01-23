import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "~/lib/firebase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        const redirectPath = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?redirectTo=${redirectPath}`);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
