import { Link, useNavigate } from "@remix-run/react";
import { Bell, Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase.client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error al cerrar sesión:", error);
      return;
    }
    
    navigate("/");
  };

  let userInitials = "";
  if (user?.email) {
    const nameParts = user.email.split('@')[0].split('.');
    userInitials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    if (userInitials.length > 2) {
      userInitials = userInitials.substring(0, 2);
    }
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-accent rounded-lg md:hidden">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <Link to="/" className="text-xl font-bold text-foreground">
              ECUCONDOR
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>

            {user ? (
              <>
                <button className="relative p-2 rounded-full hover:bg-accent">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20"
                >
                  <span className="text-sm font-medium text-primary">{userInitials}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-foreground hover:underline">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium text-foreground hover:underline">
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
