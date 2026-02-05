import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../components/ui/AuthInput";
import authService from "../../services/authService";
import { APP_NAME } from "../../constants";

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 chars")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const RegisterPage = ({ onRegister }) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const user = await authService.googleLogin();
      console.log("Supabase Google login success:", user);
      onRegister();
      navigate("/onboarding");
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-[#131f1a] overflow-hidden">
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
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-slate-gray/50 text-[10px] font-bold uppercase tracking-wider">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/20 transition-all"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-2 px-6 relative">
        <div className="w-full max-w-[400px] z-10">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl p-4 md:p-5 shadow-2xl shadow-black/[0.03]">
            <div className="flex flex-col items-center mb-3">
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
              <p className="text-slate-gray/60 dark:text-gray-400 text-[12px] font-medium text-center">
                Your AI-powered shopping journey starts here.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 h-10 px-4 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all mb-3 font-bold text-slate-gray dark:text-white text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="relative flex items-center mb-3">
              <div className="flex-grow border-t border-gray-100 dark:border-white/10"></div>
              <span className="mx-3 text-[8px] uppercase tracking-widest text-slate-gray/40 dark:text-gray-500 font-extrabold">
                or with email
              </span>
              <div className="flex-grow border-t border-gray-100 dark:border-white/10"></div>
            </div>

            <Formik
              initialValues={{
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                  const user = await authService.register({
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                  });
                  console.log("Supabase registration success:", user);

                  // Force sign out immediately so they have to log in manually
                  await authService.logout();

                  navigate("/login", {
                    state: {
                      message: "Registration successful! Please sign in.",
                    },
                  });
                } catch (error) {
                  console.error("Registration error:", error);
                  setStatus({ error: error.message });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, status }) => (
                <Form className="space-y-2">
                  {status && status.error && (
                    <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {status.error}
                    </div>
                  )}
                  <AuthInput
                    label="Full Name"
                    name="fullName"
                    placeholder="John Doe"
                    icon="person"
                  />
                  <AuthInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    icon="mail"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      icon="lock"
                    />
                    <AuthInput
                      label="Confirm"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      icon="verified_user"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-primary text-white text-sm font-bold rounded-xl shadow-xl shadow-primary/20 hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <span>
                        {isSubmitting
                          ? "Creating Account..."
                          : "Create Account"}
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-4 text-[9px] text-slate-gray/40 font-bold leading-relaxed">
              By joining, you agree to our
              <a
                href="#"
                className="text-smart-dark dark:text-gray-200 ml-1 underline underline-offset-4 decoration-primary/30"
              >
                Terms
              </a>{" "}
              &
              <a
                href="#"
                className="text-smart-dark dark:text-gray-200 ml-1 underline underline-offset-4 decoration-primary/30"
              >
                Privacy
              </a>
              .
            </p>
          </div>
          <div className="text-center mt-3 pt-3">
            <p className="text-slate-gray/60 dark:text-gray-400 text-xs font-medium">
              Already have an account?
              <Link
                to="/login"
                className="text-primary font-bold hover:underline ml-1"
              >
                Log In
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

export default RegisterPage;
