
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../../components/ui/AuthInput';
import { APP_NAME } from '../../constants';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-[#131f1a]">
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
                  Enter your email address and we'll send you a 6-digit code to reset your password.
                </p>
              </div>
            </div>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={(values) => {
                console.log(values);
                navigate('/verify-code');
              }}
            >
              <Form className="space-y-6">
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
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Send Verification Code</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </Form>
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
