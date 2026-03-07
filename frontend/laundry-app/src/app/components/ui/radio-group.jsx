import React from 'react';

const RadioGroupContext = React.createContext();

export const RadioGroup = React.forwardRef(({ value, onValueChange, className = '', children, ...props }, ref) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>
    <div
      ref={ref}
      className={`space-y-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  </RadioGroupContext.Provider>
));

RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = React.forwardRef(({ value, id, className = '', ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);

  return (
    <input
      ref={ref}
      type="radio"
      id={id}
      value={value}
      checked={context?.value === value}
      onChange={(e) => context?.onValueChange?.(e.target.value)}
      className={`w-4 h-4 accent-blue-600 cursor-pointer ${className}`}
      {...props}
    />
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';
