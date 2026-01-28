
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../../components/ui/AuthInput';
import authService from '../../services/authService';
import { APP_NAME } from '../../constants';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = React.useState(false);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-[#131f1a]">
        <header className="flex items-center justify-between px-6 py-3 md:px-12 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-gray dark:text-white">{APP_NAME}</h2>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-[400px] z-10">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/[0.03] text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">mark_email_read</span>
              </div>
              <h1 className="text-smart-dark dark:text-white text-xl font-bold mb-3">Check your email</h1>
              <p className="text-slate-gray/60 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                We've sent password reset instructions to your email address. Please follow the link in the email to reset your password.
              </p>
              <Link to="/login" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
                Return to Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-[#131f1a]">
      {/* ... header and background remains same ... */}
      <header className="flex items-center justify-between px-6 py-3 md:px-12 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-base">shopping_bag</span>
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-gray dark:text-white">{APP_NAME}</h2>
        </div>
        <Link to="/login" className="text-slate-gray dark:text-gray-300 text-[10px] font-bold hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-gray-200 dark:border-white/10 flex items-center gap-1.5 active:scale-95">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-[400px] z-10">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/[0.03]">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <div className="text-center">
                <h1 className="text-smart-dark dark:text-white text-xl font-bold tracking-tight mb-2">Forgot Password</h1>
                <p className="text-slate-gray/60 dark:text-gray-400 text-[12px] leading-relaxed max-w-[280px] mx-auto">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>
            </div>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                  await authService.sendPasswordReset(values.email);
                  setIsSuccess(true);
                } catch (error) {
                  console.error('Reset password error:', error);
                  setStatus({ error: error.message });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, status }) => (
              <Form className="space-y-6">
                {status && status.error && (
                  <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
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

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    <span>{isSubmitting ? 'Sending Instructions...' : 'Reset Password'}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>

      <footer className="w-full px-12 py-3 border-t border-gray-100 dark:border-white/5 flex justify-center items-center text-[10px] font-bold text-slate-gray/50 dark:text-gray-500">
        <div>© 2026 {APP_NAME}</div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
