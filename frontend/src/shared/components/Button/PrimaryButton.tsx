type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  bgColor?: string;
  borderColor?: string;
};

export function PrimaryButton({ children, onClick, fullWidth, bgColor, borderColor }: Readonly<PrimaryButtonProps>) {
  return (
    <button
      className={`${fullWidth ? 'w-full' : ''} py-2 ${bgColor || 'bg-primary'} ${borderColor || 'border-primary-border'} border-2 text-white font-bold rounded-3xl active:scale-95 transition-all font-label-lg`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}