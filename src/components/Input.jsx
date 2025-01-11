import { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(function Input(
  { label, labelClass, className, type, ...props },
  ref,
) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={twMerge(
          'w-full rounded-md border border-gray-500 outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
});

export default Input;
