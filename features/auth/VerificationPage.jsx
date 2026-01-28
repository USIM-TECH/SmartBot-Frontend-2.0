import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../constants';

const VerificationSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
    .required('Verification code is required'),
});

const VerificationPage = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInputChange = (e, index, setFieldValue, currentCode) => {
    const value = e.target.value;
    if (value.length > 1) return; // Prevent pasting multiple chars in one box

    const newCodeArray = currentCode.split('');
    newCodeArray[index] = value;
    const newCode = newCodeArray.join('');
    setFieldValue('code', newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index, setFieldValue, currentCode) => {
    // Handle backspace
    if (e.key === 'Backspace' && !currentCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e, setFieldValue) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    setFieldValue('code', pastedData);
    // Focus the last filled box or the next empty box
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-[#131f1a]">
      <header className="flex items-center justify-between px-6 py-3 md:px-12 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-base">shopping_bag</span>
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-gray dark:text-white">{APP_NAME}</h2>
        </div>
        <Link to="/forgot-password" className="text-slate-gray dark:text-gray-300 text-[10px] font-bold hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-gray-200 dark:border-white/10 flex items-center gap-1.5 active:scale-95">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
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
                <span className="material-symbols-outlined text-2xl">password</span>
              </div>
              <div className="text-center">
                <h1 className="text-smart-dark dark:text-white text-xl font-bold tracking-tight mb-2">Check Your Email</h1>
                <p className="text-slate-gray/60 dark:text-gray-400 text-[12px] leading-relaxed max-w-[280px] mx-auto">
                  We've sent a 6-digit verification code to your email. Please enter it below.
                </p>
              </div>
            </div>

            <Formik
              initialValues={{ code: '' }}
              validationSchema={VerificationSchema}
              onSubmit={(values) => {
                console.log(values);
                navigate('/reset-password');
              }}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form className="space-y-8">
                  <div className="flex flex-col gap-4">
                    <label className="text-slate-gray dark:text-gray-200 text-xs font-semibold uppercase tracking-wide px-1 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-between gap-2 md:gap-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={values.code[index] || ''}
                          onChange={(e) => handleInputChange(e, index, setFieldValue, values.code)}
                          onKeyDown={(e) => handleKeyDown(e, index, setFieldValue, values.code)}
                          onPaste={(e) => handlePaste(e, setFieldValue)}
                          className={`w-full aspect-square text-center text-xl font-bold rounded-xl border bg-white dark:bg-white/5 text-smart-dark dark:text-white focus:ring-4 focus:ring-primary/10 transition-all outline-none ${
                            touched.code && errors.code ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10 focus:border-primary'
                          }`}
                        />
                      ))}
                    </div>
                    {touched.code && errors.code && (
                      <span className="text-[10px] text-red-500 font-bold px-1 text-center animate-pulse">
                        {errors.code}
                      </span>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={values.code.length !== 6}
                      className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Verify Code</span>
                      <span className="material-symbols-outlined text-lg">verified</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-[11px] text-slate-gray/60 dark:text-gray-400 font-medium">
                      Didn't receive the code? 
                      <button type="button" className="text-primary font-bold hover:underline ml-1">Resend Code</button>
                    </p>
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

export default VerificationPage;
