
import React from 'react';
import { useField } from 'formik';

const AuthInput = ({ label, icon, rightElement, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = React.useState(false);
  const isError = meta.touched && meta.error;
  const isPasswordField = props.type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center px-1">
        <label htmlFor={props.name} className="text-slate-gray dark:text-gray-200 text-xs font-semibold uppercase tracking-wide">
          {label}
        </label>
        {rightElement}
      </div>
      <div className="relative group">
        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${isError ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`}>
          {icon}
        </span>
        <input
          {...field}
          {...props}
          type={isPasswordField ? (showPassword ? 'text' : 'password') : props.type}
          className={`w-full pl-10 ${isPasswordField ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl border bg-white dark:bg-white/5 text-smart-dark dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm ${
            isError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10 focus:border-primary'
          }`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      {isError && (
        <span className="text-[10px] text-red-500 font-bold px-1 animate-pulse">
          {meta.error}
        </span>
      )}
    </div>
  );
};

export default AuthInput;
