import { client } from "@/sanity/client";
import ContactForm from "@/components/ContactForm";

export const revalidate = 0;

async function getData() {
  return await client.fetch(`*[_type == "siteContent"][0]{
    inquireTitle,
    inquireText,
    "videoUrl": inquireHeroVideo.asset->url,
    email,
    location
  }`);
}

export default async function InquirePage() {
  const data = await getData();

  const videoSource = data?.videoUrl || "/inquire-bg.mp4";

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden py-20">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src={videoSource} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/60 mb-6">
            Contact Us
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            {data?.inquireTitle || "Let's Create Something Beautiful"}
          </h1>
          <p className="text-lg text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            {data?.inquireText}
          </p>
        </div>
      </section>

      <section className="px-4 md:px-12 pt-8 pb-20 bg-black">
        <ContactForm />
      </section>

      <section className="text-center pb-24 text-white/40 text-sm tracking-widest space-y-2">
        <p>{data?.email}</p>
        <p>{data?.location}</p>
      </section>

    </main>
  );
}
