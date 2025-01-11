import { twMerge } from 'tailwind-merge';

const Button = ({ className, children, type, ...props }) => {
  return (
    <button
      className={twMerge('rounded-md px-4 py-[6px]', className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
