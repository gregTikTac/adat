import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/site/About";
import { Contacts } from "@/components/site/Contacts";
import { Match } from "@/components/site/Match";
import { Routes } from "@/components/site/Routes";
import { Story } from "@/components/site/Story";
import { Tours } from "@/components/site/Tours";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <Routes />
      <Tours />
      <About />
      <Match />
      <Contacts />
    </main>
  );
}
