import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "whatsapp_outline" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variants = {
  primary: "bg-gold-500 hover:bg-gold-600 text-white shadow-sm hover:shadow-md",
  secondary: "bg-navy-900 hover:bg-navy-800 text-white shadow-sm hover:shadow-md",
  whatsapp_outline: "border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white",
  outline: "border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
