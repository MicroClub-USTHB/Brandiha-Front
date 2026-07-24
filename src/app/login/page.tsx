import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/components/login/login-form";
import { ThemePicker } from "@/components/theme-picker";

export default function LoginPage() {
  return (
    <main className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:h-screen md:max-h-screen overflow-visible p-4">
      {/* On mobile the logo sits in normal flow, centered above the form; from
          md up it returns to its pinned top-left corner. */}
      <Link href="/" className="static mb-6 md:mb-0 md:absolute md:left-6 md:top-6 z-50">
        <Image
          src="/brandiha-logo.svg"
          alt="Brandiha"
          width={253}
          height={63}
          className="w-44 md:w-[clamp(5rem,9vw,9rem)] h-auto"
        />
      </Link>
      {/* Theme selector pinned to the top-right corner, mirroring the header. */}
      <div className="absolute right-4 top-4 md:right-6 md:top-6 z-50">
        <ThemePicker />
      </div>
      <LoginForm />
    </main>
  );
}
