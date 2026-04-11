import React from 'react';

export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`px-6 py-4 border-b border-gray-200 ${className}`}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-xl font-bold text-gray-900 ${className}`}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 ${className}`}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`px-6 py-4 ${className}`}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`px-6 py-4 border-t border-gray-200 ${className}`}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';
