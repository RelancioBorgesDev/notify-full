import { Bell } from "lucide-react";

interface LogoProps {
  type: "dark" | "light";
}

export default function Logo({ type }: LogoProps) {
  return (
    <span
      className={`flex items-center gap-1 ${
        type === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      <Bell size={32} fill={type === "dark" ? "#fff" : "#222"} />
      <p className="font-bold text-xl">Notify.me</p>
    </span>
  );
}
