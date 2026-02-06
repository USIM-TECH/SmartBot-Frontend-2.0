import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { supabase } from "../config/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(
      async (currentUser) => {
        if (currentUser) {
          setLoading(true);
          try {
            console.log(
              "[AuthContext] Checking user record in database for:",
              currentUser.email,
            );

            // 1. Fetch user data from the public.users table
            let { data, error: fetchError } = await supabase
              .from("users")
              .select("*")
              .eq("id", currentUser.id)
              .maybeSingle();

            if (fetchError) {
              console.error(
                "[AuthContext] Error fetching user record:",
                fetchError,
              );
            }

            // 2. If no record, create it (e.g. for Google signup)
            if (!data) {
              console.log(
                "[AuthContext] No user record found. Attempting to create one for Google/New user...",
              );

              const userPayload = {
                id: currentUser.id,
                email: currentUser.email,
                role: "user", // Default role for frontend users
                username:
                  currentUser.user_metadata?.full_name ||
                  currentUser.user_metadata?.name ||
                  "",
              };

              // Use upsert to handle potential race conditions
              const { data: newData, error: insertError } = await supabase
                .from("users")
                .upsert(userPayload)
                .select()
                .maybeSingle();

              if (insertError) {
                console.error(
                  "[AuthContext] CRITICAL: Failed to create user record in public.users table:",
                  insertError,
                );
                // If the table doesn't exist or RLS blocks us, we might be here.
                alert(
                  "Auth Error: Could not synchronize your account. Please contact support.",
                );
                await authService.logout();
                return;
              }

              console.log(
                "[AuthContext] User record successfully synchronized.",
              );
              data = newData;
            }

            // 3. Final Role Check
            if (data && data.role === "user") {
              setUser(currentUser);
              setUserData(data);
            } else {
              console.warn(
                "[AuthContext] Access Denied: Incorrect role or missing record. Data:",
                data,
              );
              await authService.logout();
              setUser(null);
              setUserData(null);
            }
          } catch (error) {
            console.error(
              "[AuthContext] Unexpected error in auth session management:",
              error,
            );
            setUser(null);
            setUserData(null);
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setUserData(null);
          setLoading(false);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
