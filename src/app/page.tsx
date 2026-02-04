import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <SmoothScroll>
        <Hero />
        <Gallery />
      </SmoothScroll>
    </main>
  );
}
