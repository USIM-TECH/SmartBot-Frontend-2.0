import { supabase } from "../config/supabase";

const handleAuthError = (error) => {
  console.error("Supabase Auth Error:", error.message);
  return error.message || "An unexpected error occurred. Please try again.";
};

const authService = {
  register: async ({ fullName, email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Save user to public.users table (if not already handled by trigger)
        const { error: dbError } = await supabase.from("users").upsert({
          id: data.user.id,
          email: email,
          role: "user",
          username: fullName,
        });

        if (dbError) {
          console.error("Error saving user to database:", dbError);
        }
      }

      return data.user;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  login: async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  googleLogin: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  getCurrentUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  subscribeToAuthChanges: (callback) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      callback(session?.user || null);
    });
    return () => subscription.unsubscribe();
  },

  sendPasswordReset: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },
};

export default authService;
