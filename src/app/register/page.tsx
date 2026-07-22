import Link from "next/link";
import Image from "next/image";
import RegistrationForm from "@/components/register/registration-form";

export default function RegisterPage() {
  return (
    <main className="relative flex h-screen max-h-screen items-center justify-center overflow-hidden p-4">
      <Link href="/" className="absolute left-6 top-6 z-50">
        <Image
          src="/brandiha-logo.svg"
          alt="Brandiha"
          width={253}
          height={63}
          className="w-[clamp(5rem,9vw,9rem)] h-auto"
        />
      </Link>
      <RegistrationForm />
    </main>
  );
}
