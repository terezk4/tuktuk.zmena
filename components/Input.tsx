import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-bold text-lg uppercase">{label}</label>
      <input 
        className={`
          w-full border-3 border-brand-black p-3 font-bold text-lg
          focus:outline-none focus:bg-brand-lime/20
          placeholder:text-gray-400
          ${error ? 'border-red-600 bg-red-50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-red-600 font-bold text-sm">⚠ {error}</span>}
    </div>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-bold text-lg uppercase">{label}</label>
      <textarea 
        className={`
          w-full border-3 border-brand-black p-3 font-mono text-md
          focus:outline-none focus:bg-brand-lime/20
          placeholder:text-gray-400
          ${error ? 'border-red-600 bg-red-50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-red-600 font-bold text-sm">⚠ {error}</span>}
    </div>
  );
};