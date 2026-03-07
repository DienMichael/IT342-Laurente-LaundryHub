import React from 'react';

export const Button = React.forwardRef(({ className = '', disabled = false, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
    {...props}
  />
));

Button.displayName = 'Button';
