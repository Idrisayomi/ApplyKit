"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-600",
            "focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50",
            "hover:border-slate-600",
            icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>}
    </div>
  );
};