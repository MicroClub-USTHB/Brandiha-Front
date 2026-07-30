import { Header } from "@/components/landing/header";

export default function RegisterPage() {
  return (
    <main className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 md:h-screen md:max-h-screen overflow-hidden p-4 pt-24">
      <Header />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-[clamp(1.5rem,5vh,4rem)] px-4">
        <div
          className="flex w-full items-center justify-center px-[clamp(1rem,4vw,5rem)] py-[clamp(3rem,6vh,5.5rem)] text-center"
          style={{
            backgroundImage: "url('/paper.svg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h1 className="font-heading text-5xl leading-relaxed tracking-wide text-foreground md:text-7xl">
            Registrations closed&nbsp;!
          </h1>
        </div>
      </div>
    </main>
  );
}
