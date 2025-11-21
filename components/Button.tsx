'use client'

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, type = 'button' }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) => {
  const styles = {
    primary: "bg-orange-600 hover:bg-orange-700 text-white",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
