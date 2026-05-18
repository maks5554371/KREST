import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "whatsapp_outline" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variants = {
  primary: "bg-[#B8943F] hover:bg-[#9d7d34] text-white",
  secondary: "bg-[#0F172A] hover:bg-[#1e293b] text-white",
  whatsapp_outline: "border-2 border-[#25D366] text-[#25D366]",
  outline: "border-2 border-[#B8943F] text-[#B8943F] hover:bg-[#B8943F] hover:text-white",
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
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
