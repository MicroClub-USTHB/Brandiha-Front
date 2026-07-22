import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Agenda } from "@/components/landing/agenda";
import { Authors } from "@/components/landing/authors";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* <About />
        <Agenda />
        <Authors /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
