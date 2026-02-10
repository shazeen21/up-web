"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AuthModal } from "./AuthModal";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuth: () => void;
  requireAuth: (onAuthed: () => void) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => supabaseBrowser());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const checkRole = async (uid: string) => {
    const { data } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .single();
    if (data?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        checkRole(data.session.user.id);
      }
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      const previousUser = user;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        checkRole(newSession.user.id);
      } else {
        setIsAdmin(false);
      }

      // If user just signed in and there's a pending callback, execute it
      if (newSession && !previousUser && pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
        setShow(false);
      } else if (newSession) {
        setShow(false);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const value = useMemo<AuthContextValue & { isAdmin: boolean }>(
    () => ({
      user,
      session,
      isAdmin,
      loading,
      isAuthModalOpen: show,
      openAuth: () => setShow(true),
      requireAuth: (onAuthed) => {
        if (user) {
          onAuthed();
        } else {
          setPendingCallback(() => onAuthed);
          setShow(true);
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, session, isAdmin, loading, supabase, show]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal open={show} onClose={() => setShow(false)} />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

