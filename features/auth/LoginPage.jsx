import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthInput from "../../components/ui/AuthInput";
import { APP_NAME } from "../../constants";
import { useAuth } from "../../context/AuthContext";

import authService from "../../services/authService";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too short!").required("Password is required"),
});

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const successMessage = location.state?.message;

  // Auto-redirect if already logged in, but stay if we just registered
  React.useEffect(() => {
    if (isAuthenticated && !successMessage) {
      navigate("/onboarding", { replace: true });
    }
  }, [isAuthenticated, successMessage, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const user = await authService.googleLogin();
      console.log("Supabase Google login success:", user);
      onLogin();
      navigate("/onboarding");
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-[#131f1a] overflow-hidden">
      {/* ... other code remains same ... */}
      <header className="flex items-center justify-between px-6 py-3 md:px-12 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-base">
              shopping_bag
            </span>
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-gray dark:text-white">
            {APP_NAME}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-gray dark:text-gray-300 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded-lg transition-colors">
            Support
          </button>
          <div className="h-3 w-px bg-gray-200 dark:bg-gray-700" />
          <Link
            to="/register"
            className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-lg hover:brightness-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-4 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-[400px] z-10">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/[0.03]">
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-lg">
                    shopping_bag
                  </span>
                </div>
                <span className="text-lg font-extrabold text-smart-dark dark:text-white tracking-tight">
                  {APP_NAME}
                </span>
              </div>
              <div className="text-center">
                <h1 className="text-smart-dark dark:text-white text-xl font-bold tracking-tight mb-0.5">
                  Welcome Back
                </h1>
                <p className="text-slate-gray/60 dark:text-gray-400 text-[12px]">
                  Sign in to your account
                </p>
              </div>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                  const response = await authService.login({
                    email: values.email,
                    password: values.password,
                  });
                  console.log("Login success:", response);
                  onLogin();
                  navigate("/onboarding");
                } catch (error) {
                  console.error("Login error:", error);
                  setStatus({ error: error.message });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, status }) => (
                <Form className="space-y-3">
                  {successMessage && (
                    <div className="p-3 text-xs text-primary bg-primary/10 rounded-lg border border-primary/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      {successMessage}
                    </div>
                  )}
                  {status && status.error && (
                    <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {status.error}
                    </div>
                  )}
                  <AuthInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    icon="alternate_email"
                  />
                  <AuthInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon="lock"
                    rightElement={
                      <Link
                        to="/forgot-password"
                        title="Forgot password?"
                        className="text-primary text-[11px] font-bold hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </Link>
                    }
                  />

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                    >
                      <span>{isSubmitting ? "Logging In..." : "Log In"}</span>
                      <span className="material-symbols-outlined text-lg">
                        login
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase">
                <span className=" dark:bg-zinc-900 px-4 text-gray-400 font-bold tracking-widest">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 py-2.5 rounded-xl transition-all font-bold text-slate-gray dark:text-white text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  fill="#EA4335"
                ></path>
                <path
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  fill="#34A853"
                ></path>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-slate-gray/60 dark:text-gray-400 text-[11px] font-medium">
              Don't have an account?
              <Link
                to="/register"
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full px-12 py-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-gray/50 dark:text-gray-500">
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary">
            Terms of Service
          </a>
        </div>
        <div>© 2026 {APP_NAME}</div>
      </footer>
    </div>
  );
};

export default LoginPage;
