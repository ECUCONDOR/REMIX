import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "~/lib/firebase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return <>{children}</>;
}
