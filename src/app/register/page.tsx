import RegistrationForm from "@/components/register/registration-form";

export default function RegisterPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-repeat p-4"
      style={{ backgroundImage: "url(/wall-background.png)" }}
    >
      <RegistrationForm />
    </main>
  );
}
