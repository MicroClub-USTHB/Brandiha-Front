import { Header } from "@/components/landing/header";
import LoginForm from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:h-screen md:max-h-screen overflow-visible p-4 pt-24">
      <Header />
      <LoginForm />
    </main>
  );
}
